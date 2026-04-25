import { Box, Typography, Grid, Paper, Stack, Chip } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Tooltip } from 'recharts';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AirIcon from '@mui/icons-material/Air';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import WaterIcon from '@mui/icons-material/Water';
import Co2Icon from '@mui/icons-material/Co2';

const VITALS_CONFIG = [
  { key: 'hr',    label: 'FC',    unit: 'bpm',  icon: <FavoriteIcon sx={{ fontSize: 14 }} />,   color: '#F44336', normalMin: 60,  normalMax: 100, minV: 40,  maxV: 130, dec: 0 },
  { key: 'spo2',  label: 'SpO₂',  unit: '%',    icon: <WaterIcon sx={{ fontSize: 14 }} />,        color: '#00BCD4', normalMin: 95,  normalMax: 100, minV: 80,  maxV: 100, dec: 1 },
  { key: 'sbp',   label: 'TAS',   unit: 'mmHg', icon: <BloodtypeIcon sx={{ fontSize: 14 }} />,   color: '#FF9800', normalMin: 90,  normalMax: 140, minV: 60,  maxV: 200, dec: 0 },
  { key: 'rr',    label: 'FR',    unit: '/min', icon: <AirIcon sx={{ fontSize: 14 }} />,          color: '#4CAF50', normalMin: 12,  normalMax: 20,  minV: 5,   maxV: 35,  dec: 0 },
  { key: 'temp',  label: 'Temp',  unit: '°C',   icon: <ThermostatIcon sx={{ fontSize: 14 }} />,  color: '#9C27B0', normalMin: 36,  normalMax: 37.5,minV: 35,  maxV: 39,  dec: 1 },
  { key: 'etco2', label: 'EtCO₂', unit: 'mmHg', icon: <Co2Icon sx={{ fontSize: 14 }} />,         color: '#26C6DA', normalMin: 35,  normalMax: 45,  minV: 20,  maxV: 60,  dec: 0 },
];

function getStatus(cfg, value) {
  if (value < cfg.normalMin || value > cfg.normalMax) {
    const severe = value < cfg.minV * 1.15 || value > cfg.maxV * 0.88;
    return severe ? 'error' : 'warning';
  }
  return 'success';
}

const STATUS_COLORS = { success: '#00C853', warning: '#FFB300', error: '#F44336' };

function VitalCard({ cfg, history }) {
  const current = history[history.length - 1]?.[cfg.key] ?? null;
  const status = typeof current === 'number' ? getStatus(cfg, current) : 'success';
  const statusColor = STATUS_COLORS[status];
  const displayVal = current !== null
    ? (cfg.dec > 0 ? current.toFixed(cfg.dec) : Math.round(current))
    : '—';

  return (
    <Paper elevation={0} sx={{
      p: 1.5, background: 'rgba(10,22,40,0.8)',
      border: `1px solid ${cfg.color}25`,
      borderTop: `2px solid ${cfg.color}80`,
      borderRadius: 2, height: '100%',
    }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.75 }}>
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: cfg.color }}>
          {cfg.icon}
          <Typography variant="caption" fontWeight={700} sx={{ color: cfg.color, letterSpacing: 1, fontSize: '0.62rem' }}>
            {cfg.label}
          </Typography>
        </Stack>
        <Box sx={{
          width: 7, height: 7, borderRadius: '50%',
          background: current !== null ? statusColor : '#37474F',
          boxShadow: current !== null ? `0 0 5px ${statusColor}` : 'none',
          ...(status === 'error' && current !== null && {
            animation: 'blink 0.8s infinite',
            '@keyframes blink': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.2 } },
          }),
        }} />
      </Stack>

      <Typography sx={{
        fontFamily: '"Roboto Mono"', fontSize: '1.35rem', fontWeight: 700,
        color: current !== null ? statusColor : 'text.secondary',
        lineHeight: 1,
      }}>
        {displayVal}
        <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5, fontSize: '0.6rem' }}>
          {cfg.unit}
        </Typography>
      </Typography>

      <Box sx={{ mt: 1, height: 32 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history.slice(-30)}>
            <Line
              type="monotone" dataKey={cfg.key}
              stroke={cfg.color} strokeWidth={1.5}
              dot={false} isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}

export default function VitalMonitor({ history, alarms, running }) {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ flexShrink: 0 }}>
        <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ letterSpacing: 1, fontSize: '0.7rem' }}>
          PARAMÈTRES VITAUX
        </Typography>
        <Stack direction="row" spacing={0.75} alignItems="center">
          {running && (
            <Chip label="LIVE" size="small" sx={{
              background: 'rgba(244,67,54,0.15)', color: '#F44336',
              fontWeight: 700, fontSize: '0.6rem', height: 18,
              animation: 'pulse 1.5s infinite',
              '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.5 } },
            }} />
          )}
          {alarms.length > 0 && (
            <Chip
              label={`${alarms.length} ALARME${alarms.length > 1 ? 'S' : ''}`}
              size="small" color="error"
              sx={{ fontWeight: 700, fontSize: '0.6rem', height: 18 }}
            />
          )}
        </Stack>
      </Stack>

      {/* 2×3 grid — all 6 vitals visible */}
      <Grid container spacing={1} sx={{ flex: 1, alignContent: 'flex-start' }}>
        {VITALS_CONFIG.map(cfg => (
          <Grid item xs={4} key={cfg.key}>
            <VitalCard cfg={cfg} history={history} />
          </Grid>
        ))}
      </Grid>

      {/* Trend chart — only when data available */}
      {history.length > 2 && (
        <Paper elevation={0} sx={{
          p: 1.5, flexShrink: 0,
          background: 'rgba(10,22,40,0.8)',
          border: '1px solid rgba(0,188,212,0.12)', borderRadius: 2,
        }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.75, display: 'block', letterSpacing: 1, fontSize: '0.6rem' }}>
            TENDANCE FC / SpO₂ / EtCO₂
          </Typography>
          <ResponsiveContainer width="100%" height={60}>
            <LineChart data={history.slice(-60)}>
              <XAxis dataKey="elapsed" hide />
              <YAxis domain={[30, 110]} hide />
              <Tooltip
                contentStyle={{ background: '#0A1628', border: '1px solid rgba(0,188,212,0.3)', borderRadius: 8, fontSize: '0.65rem' }}
                labelStyle={{ display: 'none' }}
              />
              <ReferenceLine y={100} stroke="#F44336" strokeDasharray="3 3" strokeOpacity={0.3} />
              <ReferenceLine y={60}  stroke="#F44336" strokeDasharray="3 3" strokeOpacity={0.3} />
              <Line type="monotone" dataKey="hr"    stroke="#F44336" strokeWidth={1.5} dot={false} isAnimationActive={false} name="FC" />
              <Line type="monotone" dataKey="spo2"  stroke="#00BCD4" strokeWidth={1.5} dot={false} isAnimationActive={false} name="SpO₂" />
              <Line type="monotone" dataKey="etco2" stroke="#26C6DA" strokeWidth={1}   dot={false} isAnimationActive={false} name="EtCO₂" strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      )}
    </Box>
  );
}
