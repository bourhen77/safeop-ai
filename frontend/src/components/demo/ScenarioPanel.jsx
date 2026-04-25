import { Box, Typography, Button, Stack, Divider, Chip, LinearProgress } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import PersonIcon from '@mui/icons-material/Person';
import ChildCareIcon from '@mui/icons-material/ChildCare';

const SCENARIOS = [
  { id: 'normal', label: 'Normal', sublabel: 'État stable', color: '#00C853', icon: '🟢' },
  { id: 'hypotension', label: 'Hypotension', sublabel: 'Crise vasculaire', color: '#F44336', icon: '🔴' },
  { id: 'bradycardia', label: 'Bradycardie', sublabel: 'FC basse', color: '#FFB300', icon: '🟡' },
  { id: 'pediatric', label: 'Pédiatrique', sublabel: '6 ans, 22 kg', color: '#00BCD4', icon: '👶' },
];

export default function ScenarioPanel({ selected, running, elapsed, patient, onSelect, onStart, onStop }) {
  const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const seconds = (elapsed % 60).toString().padStart(2, '0');

  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ letterSpacing: 1, mb: 1.5, flexShrink: 0 }}>
        SCÉNARIO CLINIQUE
      </Typography>

      {/* Scrollable middle section */}
      <Box sx={{ flex: 1, overflowY: 'auto', pr: 0.5,
        '&::-webkit-scrollbar': { width: 3 },
        '&::-webkit-scrollbar-thumb': { background: 'rgba(0,188,212,0.3)', borderRadius: 2 },
      }}>
        <Stack spacing={1} sx={{ mb: 1.5 }}>
          {SCENARIOS.map(s => (
            <Button
              key={s.id}
              variant={selected === s.id ? 'contained' : 'outlined'}
              onClick={() => onSelect(s.id)}
              disabled={running}
              sx={{
                justifyContent: 'flex-start',
                px: 2, py: 1,
                borderColor: selected === s.id ? s.color : `${s.color}33`,
                background: selected === s.id ? `${s.color}22` : 'transparent',
                color: selected === s.id ? s.color : 'text.secondary',
                '&:hover': { borderColor: s.color, color: s.color, background: `${s.color}11` },
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center" width="100%">
                <Typography sx={{ fontSize: '1rem' }}>{s.icon}</Typography>
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.2 }}>{s.label}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>{s.sublabel}</Typography>
                </Box>
              </Stack>
            </Button>
          ))}
        </Stack>

        <Divider sx={{ borderColor: 'rgba(0,188,212,0.15)', mb: 1.5 }} />

        {/* Timer */}
        <Box sx={{ p: 1.5, borderRadius: 2, background: 'rgba(0,188,212,0.05)', border: '1px solid rgba(0,188,212,0.15)', textAlign: 'center', mb: 1.5 }}>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>DURÉE OPÉRATION</Typography>
          <Typography sx={{ fontFamily: '"Roboto Mono"', fontSize: '1.8rem', color: running ? 'primary.main' : 'text.secondary', fontWeight: 700 }}>
            {minutes}:{seconds}
          </Typography>
          {running && (
            <LinearProgress
              variant="indeterminate"
              sx={{ mt: 1, height: 2, borderRadius: 1, '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #00BCD4, #1565C0)' } }}
            />
          )}
        </Box>

        {/* Patient info */}
        {patient && (
          <Box sx={{ p: 1.5, borderRadius: 2, background: 'rgba(10,22,40,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              {selected === 'pediatric'
                ? <ChildCareIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                : <PersonIcon sx={{ fontSize: 16, color: 'primary.main' }} />}
              <Typography variant="caption" fontWeight={700} color="primary.main">PATIENT</Typography>
            </Stack>
            {[
              { l: 'Type', v: patient.name },
              { l: 'Âge', v: `${patient.age} ans` },
              { l: 'Poids', v: `${patient.weight} kg` },
              { l: 'Chirurgie', v: patient.surgery },
            ].map(row => (
              <Stack key={row.l} direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">{row.l}</Typography>
                <Typography variant="caption" fontWeight={500}>{row.v}</Typography>
              </Stack>
            ))}
          </Box>
        )}
      </Box>

      {/* Controls — always visible at bottom */}
      <Box sx={{ pt: 1.5, flexShrink: 0 }}>
        {!running ? (
          <Button
            fullWidth variant="contained" size="large"
            startIcon={<PlayArrowIcon />}
            onClick={onStart}
            sx={{ py: 1.5 }}
          >
            Démarrer simulation
          </Button>
        ) : (
          <Button
            fullWidth variant="outlined" size="large"
            startIcon={<StopIcon />}
            onClick={onStop}
            color="error"
            sx={{ py: 1.5 }}
          >
            Arrêter
          </Button>
        )}
      </Box>
    </Box>
  );
}
