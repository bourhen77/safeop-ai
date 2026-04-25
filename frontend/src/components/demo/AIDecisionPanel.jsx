import { useEffect, useRef } from 'react';
import { Box, Typography, Stack, Chip, Paper } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorIcon from '@mui/icons-material/Error';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

const SEV_CONFIG = {
  success: { color: '#00C853', icon: <CheckCircleIcon sx={{ fontSize: 16 }} />, bg: 'rgba(0,200,83,0.08)', border: 'rgba(0,200,83,0.2)' },
  warning: { color: '#FFB300', icon: <WarningAmberIcon sx={{ fontSize: 16 }} />, bg: 'rgba(255,179,0,0.08)', border: 'rgba(255,179,0,0.2)' },
  error:   { color: '#F44336', icon: <ErrorIcon sx={{ fontSize: 16 }} />,        bg: 'rgba(244,67,54,0.08)', border: 'rgba(244,67,54,0.2)' },
  info:    { color: '#00BCD4', icon: <RadioButtonCheckedIcon sx={{ fontSize: 16 }} />, bg: 'rgba(0,188,212,0.08)', border: 'rgba(0,188,212,0.15)' },
};

function EventEntry({ event, index }) {
  const cfg = SEV_CONFIG[event.severity] || SEV_CONFIG.info;
  const time = new Date(event.ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <Box sx={{ p: 1.5, borderRadius: 1.5, background: cfg.bg, border: `1px solid ${cfg.border}`, mb: 1 }}>
      <Stack direction="row" spacing={1} alignItems="flex-start">
        <Box sx={{ color: cfg.color, mt: 0.2, flexShrink: 0 }}>{cfg.icon}</Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: cfg.color, fontWeight: 700, fontSize: '0.7rem' }}>
              {event.message}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1, flexShrink: 0, fontSize: '0.65rem', fontFamily: '"Roboto Mono"' }}>
              {time}
            </Typography>
          </Stack>
          {event.action && (
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', display: 'block' }}>
              → {event.action}
            </Typography>
          )}
        </Box>
      </Stack>
    </Box>
  );
}

export default function AIDecisionPanel({ events, running, scenarioLabel }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  const lastEvent = events[events.length - 1];
  const currentStatus = lastEvent?.severity === 'error' ? 'ALERTE CRITIQUE'
    : lastEvent?.severity === 'warning' ? 'SURVEILLANCE ACCRUE'
    : running ? 'PATIENT STABLE' : 'EN ATTENTE';

  const statusColor = lastEvent?.severity === 'error' ? '#F44336'
    : lastEvent?.severity === 'warning' ? '#FFB300'
    : running ? '#00C853' : '#546E7A';

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ letterSpacing: 1 }}>
          DÉCISIONS IA
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <SmartToyIcon sx={{ fontSize: 14, color: statusColor }} />
          <Chip
            label={currentStatus}
            size="small"
            sx={{ background: `${statusColor}18`, color: statusColor, fontWeight: 700, fontSize: '0.65rem',
              ...(lastEvent?.severity === 'error' && {
                animation: 'blink 1s infinite',
                '@keyframes blink': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } },
              }),
            }}
          />
        </Stack>
      </Stack>

      {/* AI Status card */}
      <Paper elevation={0} sx={{ p: 2, mb: 2, background: `${statusColor}08`, border: `1px solid ${statusColor}25`, borderRadius: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: statusColor, boxShadow: `0 0 8px ${statusColor}`, flexShrink: 0,
            ...(running && { animation: 'pulse 2s infinite', '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.3 } } }),
          }} />
          <Box>
            <Typography variant="caption" fontWeight={700} sx={{ color: statusColor, display: 'block' }}>
              SafeOp AI — {running ? 'Analyse en cours' : 'Inactif'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {scenarioLabel || 'Sélectionnez un scénario'}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Events log */}
      <Box sx={{ flex: 1, overflowY: 'auto', pr: 0.5,
        '&::-webkit-scrollbar': { width: 4 },
        '&::-webkit-scrollbar-track': { background: 'transparent' },
        '&::-webkit-scrollbar-thumb': { background: 'rgba(0,188,212,0.3)', borderRadius: 2 },
      }}>
        {events.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <SmartToyIcon sx={{ fontSize: 32, color: 'text.secondary', mb: 1, opacity: 0.4 }} />
            <Typography variant="body2" color="text.secondary">
              Démarrez une simulation pour voir les décisions IA en temps réel
            </Typography>
          </Box>
        ) : (
          events.map((e, i) => <EventEntry key={i} event={e} index={i} />)
        )}
        <div ref={bottomRef} />
      </Box>
    </Box>
  );
}
