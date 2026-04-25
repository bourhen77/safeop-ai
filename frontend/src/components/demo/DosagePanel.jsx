import { Box, Typography, Grid, Paper, Stack, Chip, Divider } from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const DRUG_COLORS = {
  propofol: '#9C27B0',
  fentanyl: '#FF9800',
  atropine: '#F44336',
  ephedrine: '#00BCD4',
};

const DRUG_ICONS = { propofol: '💉', fentanyl: '⚕️', atropine: '🫀', ephedrine: '⚡' };

function DrugCard({ drugKey, drug, activated }) {
  const color = DRUG_COLORS[drugKey] || '#00BCD4';
  const icon = DRUG_ICONS[drugKey] || '💊';

  return (
    <Paper elevation={0} sx={{
      p: 1.5,
      background: activated ? `${color}18` : 'rgba(10,22,40,0.8)',
      border: `1px solid ${activated ? color : color + '22'}`,
      borderRadius: 2,
      position: 'relative',
      transition: 'all 0.4s',
    }}>
      {activated && (
        <Chip
          label="PSE ACTIVÉ"
          size="small"
          sx={{
            position: 'absolute', top: 6, right: 6,
            background: `${color}30`, color, fontWeight: 700, fontSize: '0.6rem',
            animation: 'pulse 1.2s infinite',
            '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.5 } },
          }}
        />
      )}

      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <Typography sx={{ fontSize: '1rem' }}>{icon}</Typography>
        <Typography variant="caption" fontWeight={700} sx={{ color, letterSpacing: 0.5, fontSize: '0.7rem' }}>
          {drug.label?.toUpperCase()}
        </Typography>
      </Stack>

      {/* Induction dose — main display */}
      <Typography sx={{ fontFamily: '"Roboto Mono"', fontSize: '1.1rem', fontWeight: 700, color: activated ? color : 'text.primary', lineHeight: 1 }}>
        {drug.induction || drug.dose}
        <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5, fontSize: '0.65rem' }}>
          {drug.unit_induction || drug.unit}
        </Typography>
      </Typography>

      {/* Formula */}
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontFamily: '"Roboto Mono"', fontSize: '0.62rem' }}>
        {drug.formula}
      </Typography>

      {/* Maintenance if exists */}
      {drug.maintenance && (
        <Typography variant="caption" sx={{ display: 'block', color: color, fontSize: '0.65rem', mt: 0.25 }}>
          Entretien : {drug.maintenance} {drug.unit_maintenance}
        </Typography>
      )}

      {/* Indication */}
      {drug.indication && (
        <Chip label={drug.indication} size="small" sx={{ mt: 0.75, fontSize: '0.58rem', height: 16, background: `${color}15`, color }} />
      )}
    </Paper>
  );
}

export default function DosagePanel({ doses, medicationsGiven }) {
  if (!doses) return (
    <Box sx={{ p: 2, textAlign: 'center' }}>
      <ScienceIcon sx={{ fontSize: 24, color: 'text.secondary', opacity: 0.3, mb: 0.5 }} />
      <Typography variant="caption" color="text.secondary" display="block">
        Démarrez une simulation pour voir les dosages calculés
      </Typography>
    </Box>
  );

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
        <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ letterSpacing: 1, fontSize: '0.7rem' }}>
          PROTOCOLE MÉDICAMENTEUX
        </Typography>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <LocalHospitalIcon sx={{ fontSize: 12, color: 'primary.main' }} />
          <Typography variant="caption" sx={{ color: 'primary.main', fontSize: '0.6rem', fontWeight: 600 }}>
            SFAR 2023
          </Typography>
        </Stack>
      </Stack>

      <Grid container spacing={1}>
        {[
          ['propofol', doses.propofol],
          ['fentanyl', doses.fentanyl],
          ['atropine', doses.atropine],
          ['ephedrine', doses.ephedrine],
        ].map(([key, drug]) => (
          <Grid item xs={6} key={key}>
            <DrugCard drugKey={key} drug={drug} activated={medicationsGiven?.has(key)} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 1.5, p: 1, borderRadius: 1, background: 'rgba(0,188,212,0.04)', border: '1px solid rgba(0,188,212,0.1)' }}>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <CheckCircleIcon sx={{ fontSize: 12, color: 'success.main' }} />
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.62rem' }}>
            Doses calculées selon protocoles SFAR 2023 · Patient {doses.weight}kg
            {doses.isPediatric && ' · Profil Pédiatrique'}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
