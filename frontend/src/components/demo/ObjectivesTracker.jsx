import { Box, Typography, Stack } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const OBJECTIVES = [
  { id: 'remote',    label: 'Suivi à distance',            triggerAt: 0 },
  { id: 'multisalle',label: 'Multi-salles simultané',      triggerAt: 0 },
  { id: 'infect',    label: 'Réduction risque infectieux', triggerAt: 5 },
  { id: 'doc',       label: 'Documentation automatique',   triggerAt: 30 },
  { id: 'trace',     label: 'Traçabilité totale',          triggerAt: 10 },
  { id: 'dosage',    label: 'Dosage précis calculé',       triggerAt: 1, needsDoses: true },
  { id: 'urgence',   label: 'Détection urgence < 3s',      triggerAt: -1, needsAlarm: true },
  { id: 'archive',   label: 'Archivage médico-légal',      triggerAt: -1, needsReport: true },
];

export default function ObjectivesTracker({ elapsed, running, hasDoses, hasAlarm, hasReport }) {
  const isChecked = (obj) => {
    if (!running && !hasDoses) return false;
    if (obj.needsDoses && !hasDoses) return false;
    if (obj.needsAlarm && !hasAlarm) return false;
    if (obj.needsReport) return hasReport;
    if (obj.triggerAt === 0 && running) return true;
    if (obj.triggerAt > 0 && elapsed >= obj.triggerAt) return true;
    return false;
  };

  const checkedCount = OBJECTIVES.filter(obj => isChecked(obj)).length;

  return (
    <Box sx={{ p: 1.5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ letterSpacing: 1, fontSize: '0.65rem' }}>
          OBJECTIFS
        </Typography>
        <Box sx={{ px: 1, py: 0.25, borderRadius: 1, background: checkedCount >= 6 ? 'rgba(0,200,83,0.15)' : 'rgba(0,188,212,0.1)' }}>
          <Typography variant="caption" sx={{ color: checkedCount >= 6 ? '#00C853' : 'primary.main', fontWeight: 700, fontSize: '0.65rem', fontFamily: '"Roboto Mono"' }}>
            {checkedCount}/{OBJECTIVES.length}
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={0.75}>
        {OBJECTIVES.map(obj => {
          const checked = isChecked(obj);
          return (
            <Stack key={obj.id} direction="row" spacing={1} alignItems="center">
              {checked ? (
                <CheckCircleIcon sx={{ fontSize: 13, color: '#00C853', flexShrink: 0,
                  animation: 'appear 0.3s ease',
                  '@keyframes appear': { from: { transform: 'scale(0)', opacity: 0 }, to: { transform: 'scale(1)', opacity: 1 } },
                }} />
              ) : (
                <RadioButtonUncheckedIcon sx={{ fontSize: 13, color: 'text.secondary', opacity: 0.3, flexShrink: 0 }} />
              )}
              <Typography variant="caption" sx={{
                fontSize: '0.65rem', lineHeight: 1.3,
                color: checked ? '#00C853' : 'text.secondary',
                fontWeight: checked ? 600 : 400,
                transition: 'color 0.3s',
              }}>
                {obj.label}
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
}
