import { useState } from 'react';
import {
  Box, Modal, Typography, Stack, Button, TextField, Paper, Chip,
  Divider, CircularProgress, Grid, IconButton, Alert,
} from '@mui/material';
import axios from 'axios';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import ScienceIcon from '@mui/icons-material/Science';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const SAMPLE_REPORT = `RAPPORT PRÉ-OPÉRATOIRE — ENTRETIEN MÉDECIN/PATIENT
Centre Hospitalier Régional de Tunis
Service : Anesthésiologie-Réanimation
Date : 24/04/2026

DONNÉES PATIENT
Nom : BEN ALI Ahmed
Date de naissance : 15/03/1958 | Âge : 67 ans
Sexe : Masculin
Poids : 82 kg | Taille : 175 cm | IMC : 26.8 kg/m²

MOTIF D'HOSPITALISATION
Cholécystectomie laparoscopique programmée
(Lithiase vésiculaire symptomatique)

ANTÉCÉDENTS MÉDICAUX
- Hypertension artérielle (HTA) depuis 2015 — contrôlée
- Diabète type 2 (HbA1c : 7.2% — équilibré)
- Insuffisance rénale chronique légère (DFG = 58 mL/min — CKD G2)

TRAITEMENTS EN COURS
- Amlodipine 5mg/j (inhibiteur calcique — antihypertenseur)
- Metformine 850mg ×2/j (SUSPENDU 48h avant chirurgie)
- Ramipril 5mg/j (IEC — SUSPENDU 24h avant chirurgie)

ALLERGIES
- Pénicilline (urticaire modérée)
- Aucune allergie aux anesthésiques connue

BILAN BIOLOGIQUE (22/04/2026)
Créatinine : 125 µmol/L | DFG : 58 mL/min
Hémoglobine : 13.8 g/dL | Plaquettes : 224 000/mm³
TP : 92% | INR : 1.08 | Glycémie : 6.4 mmol/L

EXAMEN PRÉ-ANESTHÉSIQUE
Mallampati : Classe I (intubation facile prévue)
TA : 138/84 mmHg | FC : 76 bpm | SpO2 : 97%

CLASSIFICATION ASA : III
(comorbidités multiples non invalidantes)

RECOMMANDATIONS ANESTHÉSIOLOGIQUES
- Anesthésie générale balancée
- Réduire propofol de 20% (âge + IRC)
- Réduire fentanyl de 25% (IRC légère — élimination ralentie)
- Surveillance tensionnelle renforcée peropératoire
- Éviter AINS en post-opératoire (IRC)

Dr. Sofien Maalej — Anesthésiste-Réanimateur
Matricule : ANS-2847-TN | Date : 24/04/2026`;

const SEVERITY_COLORS = { error: '#F44336', warning: '#FFB300', info: '#00BCD4' };
const DRUG_COLORS = { propofol: '#9C27B0', fentanyl: '#FF9800', atropine: '#F44336', ephedrine: '#00BCD4' };

function DoseCard({ label, color, adjusted, original, current, unit, formula }) {
  return (
    <Paper elevation={0} sx={{
      p: 1.5, background: adjusted ? `${color}12` : 'rgba(10,22,40,0.8)',
      border: `1px solid ${adjusted ? color : color + '30'}`, borderRadius: 2,
    }}>
      <Typography variant="caption" fontWeight={700} sx={{ color, fontSize: '0.65rem', display: 'block', mb: 0.5 }}>
        {label.toUpperCase()}
      </Typography>
      <Stack direction="row" spacing={1} alignItems="baseline">
        <Typography sx={{ fontFamily: '"Roboto Mono"', fontWeight: 700, fontSize: '1.1rem', color: adjusted ? color : 'text.primary' }}>
          {current}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>{unit}</Typography>
        {adjusted && original !== current && (
          <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.secondary', opacity: 0.5, fontSize: '0.65rem' }}>
            {original}
          </Typography>
        )}
      </Stack>
      <Typography variant="caption" color="text.secondary" sx={{ fontFamily: '"Roboto Mono"', fontSize: '0.6rem', display: 'block', mt: 0.25 }}>
        {formula}
      </Typography>
    </Paper>
  );
}

export default function PreOpPanel({ open, onClose, onValidate }) {
  const [reportText, setReportText] = useState(SAMPLE_REPORT);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const analyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const { data } = await axios.post('/api/preop/analyze', { reportText });
      setResult(data);
    } catch (e) {
      setError(e.response?.data?.error || 'Erreur lors de l\'analyse');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    if (!result) return;
    onValidate(result.patient, result.doses);
    onClose();
  };

  const { patient, doses } = result || {};

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '98vw', md: '90vw', lg: 1100 },
        maxHeight: '92vh',
        background: '#0A1628',
        border: '1px solid rgba(0,188,212,0.3)',
        borderRadius: 2,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center"
          sx={{ p: 2, borderBottom: '1px solid rgba(0,188,212,0.15)', flexShrink: 0 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <AssignmentIcon sx={{ color: 'primary.main' }} />
            <Typography variant="h6" fontWeight={700}>Rapport Pré-Opératoire</Typography>
            <Chip label="Analyse IA des dosages" size="small"
              sx={{ fontSize: '0.62rem', color: 'primary.main', borderColor: 'primary.main' }} variant="outlined" />
          </Stack>
          <IconButton onClick={onClose} size="small"><CloseIcon fontSize="small" /></IconButton>
        </Stack>

        {/* Body */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
          <Grid container spacing={2}>
            {/* LEFT — Report textarea */}
            <Grid item xs={12} md={5}>
              <Typography variant="caption" fontWeight={700} color="text.secondary"
                sx={{ letterSpacing: 1, fontSize: '0.65rem', display: 'block', mb: 1 }}>
                RAPPORT MÉDECIN (coller ou saisir)
              </Typography>
              <TextField
                multiline
                fullWidth
                minRows={20}
                maxRows={26}
                value={reportText}
                onChange={e => setReportText(e.target.value)}
                placeholder="Collez ici le rapport pré-opératoire du médecin..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontFamily: '"Roboto Mono"', fontSize: '0.7rem', lineHeight: 1.7,
                    '& fieldset': { borderColor: 'rgba(0,188,212,0.2)' },
                    '&:hover fieldset': { borderColor: 'rgba(0,188,212,0.4)' },
                  },
                }}
              />
              <Button
                fullWidth variant="contained" size="large"
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <AutoAwesomeIcon />}
                onClick={analyze}
                disabled={loading || !reportText.trim()}
                sx={{ mt: 1.5, py: 1.5, fontWeight: 700 }}
              >
                {loading ? 'Analyse en cours...' : 'Analyser le rapport IA'}
              </Button>
              {error && <Alert severity="error" sx={{ mt: 1, fontSize: '0.72rem' }}>{error}</Alert>}
            </Grid>

            {/* RIGHT — Analysis result */}
            <Grid item xs={12} md={7}>
              {!result && !loading && (
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2, opacity: 0.4 }}>
                  <ScienceIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    Cliquez sur "Analyser" pour extraire le profil patient<br />et calculer les dosages adaptés
                  </Typography>
                </Box>
              )}

              {loading && (
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2 }}>
                  <CircularProgress sx={{ color: 'primary.main' }} />
                  <Typography variant="body2" color="text.secondary">
                    SafeOp AI analyse le rapport...
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.6 }}>
                    Extraction des données · Détection comorbidités · Calcul dosages adaptés
                  </Typography>
                </Box>
              )}

              {result && patient && doses && (
                <Stack spacing={2}>
                  {/* Patient extracted */}
                  <Paper elevation={0} sx={{ p: 2, background: 'rgba(0,188,212,0.05)', border: '1px solid rgba(0,188,212,0.15)', borderRadius: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                      <PersonIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                      <Typography variant="caption" fontWeight={700} color="primary.main" sx={{ letterSpacing: 1 }}>
                        PROFIL PATIENT EXTRAIT
                      </Typography>
                      <Chip
                        label={patient._source === 'llm' ? 'LLM' : 'Regex'}
                        size="small"
                        sx={{ fontSize: '0.55rem', height: 16,
                          color: patient._source === 'llm' ? '#00C853' : '#FFB300',
                          borderColor: patient._source === 'llm' ? '#00C853' : '#FFB300' }}
                        variant="outlined"
                      />
                    </Stack>
                    <Grid container spacing={1}>
                      {[
                        ['Nom', patient.name],
                        ['Âge', `${patient.age} ans`],
                        ['Poids', `${patient.weight} kg`],
                        ['Sexe', patient.gender === 'M' ? 'Masculin' : 'Féminin'],
                        ['ASA', `Classe ${patient.asa}`],
                        ['DFG', patient.dfg ? `${patient.dfg} mL/min` : 'N/A'],
                        ['Chirurgie', patient.surgery],
                        ['Mallampati', patient.mallampati ? `Classe ${patient.mallampati}` : 'N/A'],
                      ].map(([label, value]) => (
                        <Grid item xs={6} key={label}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>{label}</Typography>
                            <Typography variant="caption" fontWeight={600} sx={{ fontSize: '0.65rem' }}>{value}</Typography>
                          </Stack>
                        </Grid>
                      ))}
                    </Grid>
                    {patient.conditions?.length > 0 && (
                      <Box sx={{ mt: 1.5, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {patient.conditions.map(c => (
                          <Chip key={c} label={c.replace(/_/g, ' ')} size="small"
                            sx={{ fontSize: '0.58rem', height: 18, background: 'rgba(244,67,54,0.1)', color: '#F44336', borderColor: '#F44336' }}
                            variant="outlined" />
                        ))}
                      </Box>
                    )}
                    {patient.allergies?.length > 0 && (
                      <Alert severity="warning" sx={{ mt: 1.5, py: 0.5, fontSize: '0.68rem' }}>
                        Allergie(s) : {patient.allergies.join(', ')}
                      </Alert>
                    )}
                  </Paper>

                  {/* Adjustments */}
                  {doses.adjustmentSummary?.length > 0 && (
                    <Paper elevation={0} sx={{ p: 2, background: 'rgba(255,179,0,0.04)', border: '1px solid rgba(255,179,0,0.2)', borderRadius: 2 }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                        <WarningAmberIcon sx={{ fontSize: 16, color: '#FFB300' }} />
                        <Typography variant="caption" fontWeight={700} sx={{ color: '#FFB300', letterSpacing: 1 }}>
                          AJUSTEMENTS DÉTECTÉS ({doses.adjustmentSummary.length})
                        </Typography>
                      </Stack>
                      <Stack spacing={1}>
                        {doses.adjustmentSummary.map((adj, i) => (
                          <Stack key={i} direction="row" spacing={1} alignItems="flex-start">
                            <Box sx={{ width: 6, height: 6, borderRadius: '50%', mt: 0.75, flexShrink: 0,
                              background: SEVERITY_COLORS[adj.severity] || '#FFB300' }} />
                            <Box>
                              <Typography variant="caption" sx={{ fontSize: '0.67rem', display: 'block', color: 'text.primary' }}>
                                {adj.reason}
                              </Typography>
                              <Typography variant="caption" sx={{ fontSize: '0.62rem', color: SEVERITY_COLORS[adj.severity] || '#FFB300', fontFamily: '"Roboto Mono"' }}>
                                {adj.details}
                              </Typography>
                            </Box>
                          </Stack>
                        ))}
                      </Stack>
                    </Paper>
                  )}

                  {/* Adjusted doses */}
                  <Box>
                    <Typography variant="caption" fontWeight={700} color="text.secondary"
                      sx={{ letterSpacing: 1, fontSize: '0.65rem', display: 'block', mb: 1 }}>
                      DOSAGES ADAPTÉS — SFAR 2023
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <DoseCard label="Propofol" color={DRUG_COLORS.propofol}
                          adjusted={doses.propofol.adjusted}
                          original={doses.propofol.baseInduction} current={doses.propofol.induction}
                          unit="mg IV" formula={doses.propofol.formula} />
                      </Grid>
                      <Grid item xs={6}>
                        <DoseCard label="Fentanyl" color={DRUG_COLORS.fentanyl}
                          adjusted={doses.fentanyl.adjusted}
                          original={doses.fentanyl.baseInduction} current={doses.fentanyl.induction}
                          unit="µg IV" formula={doses.fentanyl.formula} />
                      </Grid>
                      <Grid item xs={6}>
                        <DoseCard label="Atropine" color={DRUG_COLORS.atropine}
                          adjusted={false}
                          original={doses.atropine.dose} current={doses.atropine.dose}
                          unit="mg IV" formula={doses.atropine.formula} />
                      </Grid>
                      <Grid item xs={6}>
                        <DoseCard label="Éphédrine" color={DRUG_COLORS.ephedrine}
                          adjusted={doses.ephedrine.adjusted}
                          original={doses.ephedrine.baseDose} current={doses.ephedrine.dose}
                          unit="mg IV" formula={doses.ephedrine.formula} />
                      </Grid>
                    </Grid>
                  </Box>

                  {patient.notes && (
                    <Alert severity="info" sx={{ fontSize: '0.68rem', py: 0.5 }}>{patient.notes}</Alert>
                  )}
                </Stack>
              )}
            </Grid>
          </Grid>
        </Box>

        {/* Footer */}
        <Stack direction="row" justifyContent="space-between" alignItems="center"
          sx={{ p: 2, borderTop: '1px solid rgba(0,188,212,0.1)', flexShrink: 0 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.62rem' }}>
            {result
              ? `Profil extrait via ${result.patient?._source === 'llm' ? 'LLM (IA)' : 'analyse textuelle'} · Protocoles SFAR 2023`
              : 'Collez le rapport du médecin puis cliquez sur Analyser'}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" size="small" onClick={onClose}>Annuler</Button>
            <Button
              variant="contained" size="small"
              startIcon={<CheckCircleIcon />}
              onClick={validate}
              disabled={!result}
              sx={{ fontWeight: 700 }}
            >
              Valider et charger le patient
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}
