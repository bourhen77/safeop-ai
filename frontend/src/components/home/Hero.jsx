import { Box, Container, Typography, Button, Grid, Chip, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import WifiIcon from '@mui/icons-material/Wifi';

const STATS = [
  { value: '< 3s', label: "Temps de réaction IA" },
  { value: '24/7', label: "Surveillance continue" },
  { value: '100%', label: "Offline — sans internet" },
  { value: '1 → N', label: "Salles par technicien" },
];

export default function Hero() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 60% 50%, rgba(0,188,212,0.08) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(21,101,192,0.1) 0%, transparent 50%), #050D1A',
      }}
    >
      {/* Animated grid background */}
      <Box
        sx={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'linear-gradient(rgba(0,188,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,188,212,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 12 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={7}>
            <Chip
              label="ESPRIM 2026 · AI for Health"
              sx={{ mb: 3, color: 'primary.main', borderColor: 'primary.main', fontWeight: 600 }}
              variant="outlined"
            />

            <Typography variant="h1" sx={{ fontSize: { xs: '2.2rem', md: '3.5rem' }, lineHeight: 1.1, mb: 2 }}>
              L'Intelligence Artificielle{' '}
              <Box component="span" sx={{ color: 'primary.main' }}>
                au service de l'anesthésie
              </Box>
            </Typography>

            <Typography variant="h5" color="text.secondary" sx={{ mb: 4, fontWeight: 300, lineHeight: 1.6 }}>
              SafeOp AI surveille, documente et prend des décisions cliniques en temps réel —
              même quand le médecin est à distance.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 6 }}>
              <Button
                component={Link}
                to="/demo"
                variant="contained"
                size="large"
                startIcon={<PlayArrowIcon />}
                sx={{ py: 1.5, px: 4, fontSize: '1rem' }}
              >
                Voir la démo live
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<ArrowDownwardIcon />}
                onClick={() => document.querySelector('#problem')?.scrollIntoView({ behavior: 'smooth' })}
                sx={{ py: 1.5, px: 4, borderColor: 'rgba(0,188,212,0.4)' }}
              >
                En savoir plus
              </Button>
            </Stack>

            {/* Stats row */}
            <Grid container spacing={2}>
              {STATS.map(s => (
                <Grid item xs={6} sm={3} key={s.label}>
                  <Box sx={{ p: 2, borderRadius: 2, border: '1px solid rgba(0,188,212,0.15)', textAlign: 'center', background: 'rgba(0,188,212,0.04)' }}>
                    <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700, fontSize: '1.5rem' }}>
                      {s.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {s.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12} md={5}>
            {/* Visual: mock monitoring dashboard */}
            <Box
              sx={{
                border: '1px solid rgba(0,188,212,0.25)',
                borderRadius: 3,
                background: 'rgba(10,22,40,0.8)',
                p: 3,
                backdropFilter: 'blur(10px)',
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: '#00C853', boxShadow: '0 0 8px #00C853' }} />
                <Typography variant="caption" color="success.main" fontWeight={600}>SYSTÈME ACTIF</Typography>
                <Box sx={{ flexGrow: 1 }} />
                <WifiIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                <Typography variant="caption" color="primary.main">Médecin connecté</Typography>
              </Stack>

              {[
                { label: 'Fréquence Cardiaque', value: '72', unit: 'bpm', color: '#F44336' },
                { label: 'SpO₂', value: '99', unit: '%', color: '#00BCD4' },
                { label: 'Tension Artérielle', value: '120/80', unit: 'mmHg', color: '#FF9800' },
                { label: 'Fréq. Respiratoire', value: '14', unit: '/min', color: '#4CAF50' },
                { label: 'Température', value: '36.5', unit: '°C', color: '#9C27B0' },
              ].map(v => (
                <Box key={v.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <Typography variant="caption" color="text.secondary">{v.label}</Typography>
                  <Typography variant="h6" sx={{ color: v.color, fontFamily: '"Roboto Mono", monospace', fontSize: '1rem' }}>
                    {v.value} <Typography component="span" variant="caption" color="text.secondary">{v.unit}</Typography>
                  </Typography>
                </Box>
              ))}

              <Box sx={{ mt: 2, p: 1.5, borderRadius: 1, background: 'rgba(0,200,83,0.08)', border: '1px solid rgba(0,200,83,0.2)' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <SmartToyIcon sx={{ fontSize: 16, color: 'success.main' }} />
                  <Typography variant="caption" color="success.main">
                    IA : Tous les paramètres dans les normes — patient stable
                  </Typography>
                </Stack>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
