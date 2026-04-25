import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box, Container, Grid, Paper, Typography, Divider, Button, Stack,
  Modal, Chip, IconButton,
} from '@mui/material';
import { io } from 'socket.io-client';
import ArticleIcon from '@mui/icons-material/Article';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ScenarioPanel from '../components/demo/ScenarioPanel';
import VitalMonitor from '../components/demo/VitalMonitor';
import AIDecisionPanel from '../components/demo/AIDecisionPanel';
import ChatBot from '../components/demo/ChatBot';
import DosagePanel from '../components/demo/DosagePanel';
import LLMPanel from '../components/demo/LLMPanel';
import ObjectivesTracker from '../components/demo/ObjectivesTracker';
import PreOpPanel from '../components/demo/PreOpPanel';

const SCENARIO_LABELS = {
  normal: 'Stable — État normal',
  hypotension: 'Crise — Hypotension',
  bradycardia: 'Alerte — Bradycardie',
  pediatric: 'Pédiatrique — Amygdalectomie',
};

const socket = io('http://localhost:3001', { autoConnect: false });

function ReportModal({ open, onClose, reportData }) {
  if (!reportData) return null;
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: { xs: '95vw', md: 720 }, maxHeight: '90vh',
        background: '#0A1628', border: '1px solid rgba(0,188,212,0.3)', borderRadius: 2,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2, borderBottom: '1px solid rgba(0,188,212,0.15)' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <ArticleIcon sx={{ color: 'primary.main' }} />
            <Typography variant="h6" fontWeight={700}>Compte-rendu d'anesthésie</Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Chip label={reportData.sessionId} size="small" sx={{ fontFamily: '"Roboto Mono"', fontSize: '0.65rem', color: 'primary.main', borderColor: 'primary.main' }} variant="outlined" />
            <IconButton onClick={onClose} size="small"><CloseIcon fontSize="small" /></IconButton>
          </Stack>
        </Stack>

        <Box sx={{ flex: 1, overflowY: 'auto', p: 2,
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-thumb': { background: 'rgba(0,188,212,0.3)', borderRadius: 2 },
        }}>
          <Box sx={{ p: 2, background: 'rgba(0,200,83,0.05)', border: '1px solid rgba(0,200,83,0.2)', borderRadius: 1, mb: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="caption" color="success.main" fontWeight={600}>✓ Archivé</Typography>
              <Typography variant="caption" color="text.secondary">Hash: {reportData.hash}</Typography>
              <Typography variant="caption" color="text.secondary">· {new Date(reportData.timestamp).toLocaleString('fr-FR')}</Typography>
            </Stack>
          </Box>
          <Typography component="pre" sx={{ fontFamily: '"Roboto Mono"', fontSize: '0.72rem', whiteSpace: 'pre-wrap', lineHeight: 1.8, color: 'text.primary' }}>
            {reportData.report}
          </Typography>
        </Box>

        <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ p: 2, borderTop: '1px solid rgba(0,188,212,0.1)' }}>
          <Button startIcon={<PrintIcon />} variant="outlined" size="small" onClick={() => window.print()}>
            Imprimer
          </Button>
          <Button variant="contained" size="small" onClick={onClose}>Fermer</Button>
        </Stack>
      </Box>
    </Modal>
  );
}

export default function Demo() {
  const [selectedScenario, setSelectedScenario] = useState('normal');
  const [running, setRunning] = useState(false);
  const [vitalHistory, setVitalHistory] = useState([]);
  const [alarms, setAlarms] = useState([]);
  const [events, setEvents] = useState([]);
  const [elapsed, setElapsed] = useState(0);
  const [patient, setPatient] = useState(null);
  const [dosePlan, setDosePlan] = useState(null);
  const [llmCommentaries, setLlmCommentaries] = useState([]);
  const [medicationsGiven, setMedicationsGiven] = useState(new Set());
  const [reportData, setReportData] = useState(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [hasAlarm, setHasAlarm] = useState(false);
  const [preOpOpen, setPreOpOpen] = useState(false);
  const [preOpPatient, setPreOpPatient] = useState(null);
  const [preOpDoses, setPreOpDoses] = useState(null);

  useEffect(() => {
    socket.connect();

    socket.on('vitals_update', ({ vitals, alarms: a, event, patient: p, elapsed: e }) => {
      setVitalHistory(prev => [...prev.slice(-120), { ...vitals, elapsed: e }]);
      setAlarms(a || []);
      setElapsed(e);
      if (p) setPatient(p);
      if (event) {
        setEvents(prev => [...prev, event]);
        if (event.severity === 'error') setHasAlarm(true);
      }
    });

    socket.on('dosage_plan', ({ doses, patient: p }) => {
      setDosePlan(doses);
      setPatient(p);
    });

    socket.on('ai_commentary', (commentary) => {
      setLlmCommentaries(prev => [...prev, { ...commentary, ts: Date.now() }]);
    });

    socket.on('medication_given', ({ drug }) => {
      setMedicationsGiven(prev => new Set([...prev, drug]));
    });

    socket.on('simulation_started', ({ scenario }) => {
      setEvents([{ severity: 'info', message: `Simulation démarrée : ${SCENARIO_LABELS[scenario]}`, action: 'Surveillance IA activée', ts: Date.now() }]);
      setVitalHistory([]);
      setAlarms([]);
      setLlmCommentaries([]);
      setMedicationsGiven(new Set());
      setHasAlarm(false);
      setReportData(null);
    });

    socket.on('simulation_report', (data) => {
      setReportData(data);
      setReportOpen(true);
    });

    socket.on('simulation_stopped', () => {
      setRunning(false);
      setElapsed(0);
    });

    return () => socket.disconnect();
  }, []);

  const handlePreOpValidate = useCallback((patient, doses) => {
    setPreOpPatient(patient);
    setPreOpDoses(doses);
    setPatient(patient);
    setDosePlan(doses);
  }, []);

  const handleStart = useCallback(() => {
    setRunning(true);
    socket.emit('start_simulation', {
      scenario: selectedScenario,
      customPatient: preOpPatient || undefined,
    });
  }, [selectedScenario, preOpPatient]);

  const handleStop = useCallback(() => {
    socket.emit('stop_simulation');
    setRunning(false);
  }, []);

  const handleSelectScenario = useCallback((id) => {
    if (running) return;
    setSelectedScenario(id);
    setVitalHistory([]);
    setEvents([]);
    setAlarms([]);
    setElapsed(0);
    setPatient(null);
    setDosePlan(null);
    setLlmCommentaries([]);
    setMedicationsGiven(new Set());
    setHasAlarm(false);
    setReportData(null);
  }, [running]);

  const toggleDemoMode = () => setDemoMode(d => !d);

  return (
    <Box sx={{ minHeight: '100vh', background: '#050D1A', pt: 1.5, pb: 3 }}>
      <Container maxWidth="xl" sx={{ px: { xs: 1, md: 2 } }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h5" fontWeight={700}>
              SafeOp AI —{' '}
              <Box component="span" sx={{ color: 'primary.main' }}>Démo Interactive</Box>
            </Typography>
            <Chip label="Simulation peropératoire en temps réel" size="small" sx={{ color: 'text.secondary', borderColor: 'rgba(255,255,255,0.1)' }} variant="outlined" />
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant={preOpPatient ? 'contained' : 'outlined'}
              startIcon={<AssignmentIcon />}
              onClick={() => setPreOpOpen(true)}
              disabled={running}
              sx={{
                borderColor: preOpPatient ? 'success.main' : 'rgba(0,188,212,0.3)',
                background: preOpPatient ? 'rgba(0,200,83,0.15)' : 'transparent',
                color: preOpPatient ? 'success.main' : 'inherit',
              }}
            >
              {preOpPatient ? `Patient : ${preOpPatient.name}` : 'Rapport Pré-op'}
            </Button>
            {reportData && !running && (
              <Button size="small" variant="outlined" startIcon={<ArticleIcon />} onClick={() => setReportOpen(true)}>
                Voir rapport
              </Button>
            )}
            <Button
              size="small"
              variant={demoMode ? 'contained' : 'outlined'}
              startIcon={demoMode ? <FullscreenExitIcon /> : <FullscreenIcon />}
              onClick={toggleDemoMode}
              sx={{ borderColor: 'rgba(0,188,212,0.3)' }}
            >
              {demoMode ? 'Quitter démo' : 'Mode Démo'}
            </Button>
          </Stack>
        </Stack>

        {/* Pre-op patient banner */}
        {preOpPatient && !running && (
          <Paper elevation={0} sx={{
            p: 1.5, mb: 1.5,
            background: 'rgba(0,200,83,0.06)',
            border: '1px solid rgba(0,200,83,0.25)',
            borderRadius: 2,
          }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={2} alignItems="center">
                <AssignmentIcon sx={{ fontSize: 16, color: 'success.main' }} />
                <Typography variant="caption" fontWeight={700} color="success.main" sx={{ letterSpacing: 0.5 }}>
                  PATIENT VALIDÉ — Rapport pré-opératoire chargé
                </Typography>
                {[
                  `${preOpPatient.name}`,
                  `${preOpPatient.age} ans · ${preOpPatient.weight} kg`,
                  `ASA ${preOpPatient.asa}`,
                  preOpPatient.surgery,
                ].map(t => (
                  <Chip key={t} label={t} size="small"
                    sx={{ fontSize: '0.6rem', height: 18, color: 'success.main', borderColor: 'rgba(0,200,83,0.4)' }}
                    variant="outlined" />
                ))}
                {preOpDoses?.adjustmentSummary?.length > 0 && (
                  <Chip
                    label={`${preOpDoses.adjustmentSummary.length} ajustement(s) de dose`}
                    size="small"
                    sx={{ fontSize: '0.6rem', height: 18, color: '#FFB300', borderColor: 'rgba(255,179,0,0.4)' }}
                    variant="outlined"
                  />
                )}
              </Stack>
              <Button size="small" onClick={() => setPreOpOpen(true)} sx={{ fontSize: '0.65rem' }}>
                Modifier
              </Button>
            </Stack>
          </Paper>
        )}

        {/* Main 3-column grid */}
        <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
          {/* LEFT — Scenario + Objectives */}
          <Grid item xs={12} md={2.5}>
            <Stack spacing={1.5} sx={{ height: { md: 600 } }}>
              <Paper elevation={0} sx={{ flex: 1, background: 'rgba(10,22,40,0.85)', border: '1px solid rgba(0,188,212,0.12)', borderRadius: 2, overflow: 'hidden' }}>
                <ScenarioPanel
                  selected={selectedScenario}
                  running={running}
                  elapsed={elapsed}
                  patient={patient}
                  onSelect={handleSelectScenario}
                  onStart={handleStart}
                  onStop={handleStop}
                />
              </Paper>
              <Paper elevation={0} sx={{ background: 'rgba(10,22,40,0.85)', border: '1px solid rgba(0,188,212,0.12)', borderRadius: 2 }}>
                <ObjectivesTracker
                  elapsed={elapsed}
                  running={running}
                  hasDoses={!!dosePlan}
                  hasAlarm={hasAlarm}
                  hasReport={!!reportData}
                />
              </Paper>
            </Stack>
          </Grid>

          {/* CENTER — Vitals + Dosage */}
          <Grid item xs={12} md={5}>
            <Stack spacing={1.5} sx={{ height: { md: 600 } }}>
              <Paper elevation={0} sx={{ flex: 1, p: 2, background: 'rgba(10,22,40,0.85)', border: '1px solid rgba(0,188,212,0.12)', borderRadius: 2, overflow: 'hidden' }}>
                <VitalMonitor history={vitalHistory} alarms={alarms} running={running} />
              </Paper>
              <Paper elevation={0} sx={{ p: 2, background: 'rgba(10,22,40,0.85)', border: '1px solid rgba(0,188,212,0.12)', borderRadius: 2 }}>
                <DosagePanel doses={dosePlan || preOpDoses} medicationsGiven={medicationsGiven} />
              </Paper>
            </Stack>
          </Grid>

          {/* RIGHT — LLM Panel + Events */}
          <Grid item xs={12} md={4.5}>
            <Stack spacing={1.5} sx={{ height: { md: 600 } }}>
              <Paper elevation={0} sx={{ flex: 2, p: 2, background: 'rgba(10,22,40,0.85)', border: '1px solid rgba(0,188,212,0.12)', borderRadius: 2, overflow: 'hidden' }}>
                <LLMPanel commentaries={llmCommentaries} running={running} />
              </Paper>
              <Paper elevation={0} sx={{ flex: 1, p: 2, background: 'rgba(10,22,40,0.85)', border: '1px solid rgba(0,188,212,0.12)', borderRadius: 2, overflow: 'hidden' }}>
                <AIDecisionPanel
                  events={events}
                  running={running}
                  scenarioLabel={SCENARIO_LABELS[selectedScenario]}
                />
              </Paper>
            </Stack>
          </Grid>
        </Grid>

        {!demoMode && (
          <>
            <Divider sx={{ borderColor: 'rgba(0,188,212,0.08)', mb: 1.5 }} />
            <Paper elevation={0} sx={{ height: 400, p: 2.5, background: 'rgba(10,22,40,0.85)', border: '1px solid rgba(0,188,212,0.12)', borderRadius: 2, overflow: 'hidden' }}>
              <ChatBot
                currentVitals={vitalHistory[vitalHistory.length - 1]}
                patient={patient}
                dosePlan={dosePlan}
                running={running}
              />
            </Paper>
          </>
        )}
      </Container>

      <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} reportData={reportData} />

      <PreOpPanel
        open={preOpOpen}
        onClose={() => setPreOpOpen(false)}
        onValidate={handlePreOpValidate}
      />
    </Box>
  );
}
