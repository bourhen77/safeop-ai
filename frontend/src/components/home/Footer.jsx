import { Box, Container, Typography, Grid, Button, Divider, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

export default function Footer() {
  return (
    <Box sx={{ background: '#030810', borderTop: '1px solid rgba(0,188,212,0.1)', pt: 8, pb: 4 }}>
      <Container maxWidth="lg">
        {/* CTA Banner */}
        <Box sx={{ textAlign: 'center', mb: 8, p: 6, borderRadius: 3, background: 'linear-gradient(135deg, rgba(0,188,212,0.08) 0%, rgba(21,101,192,0.08) 100%)', border: '1px solid rgba(0,188,212,0.15)' }}>
          <Typography variant="h3" fontWeight={700} sx={{ mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
            L'anesthésie de demain,{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>dès aujourd'hui</Box>
          </Typography>
          <Typography variant="h6" color="text.secondary" fontWeight={300} sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            SafeOp AI ne remplace pas le soignant. Il le décharge, l'alerte au bon moment et lui donne les outils pour décider mieux et plus vite.
          </Typography>
          <Button
            component={Link}
            to="/demo"
            variant="contained"
            size="large"
            startIcon={<PlayArrowIcon />}
            sx={{ py: 1.5, px: 5, fontSize: '1rem' }}
          >
            Essayer la démo live
          </Button>
        </Box>

        <Divider sx={{ borderColor: 'rgba(0,188,212,0.1)', mb: 4 }} />

        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <MonitorHeartIcon sx={{ color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={700} color="primary.main">SafeOp AI</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
              Système intelligent d'aide à la décision anesthésique. Surveillance temps réel, documentation automatique, décisions IA contextualisées.
            </Typography>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>Navigation</Typography>
            {['Accueil', 'Problématique', 'Solution', 'Objectifs'].map(l => (
              <Typography key={l} variant="body2" color="text.secondary" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
                {l}
              </Typography>
            ))}
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>Système</Typography>
            {['Démo Live', 'Documentation', 'API'].map(l => (
              <Typography key={l} variant="body2" color="text.secondary" sx={{ mb: 1 }}>{l}</Typography>
            ))}
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>Technologies</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {['React', 'Node.js', 'Ollama', 'Mistral 7B', 'Socket.io', 'MUI'].map(t => (
                <Box key={t} sx={{ px: 1.5, py: 0.5, borderRadius: 1, background: 'rgba(0,188,212,0.08)', border: '1px solid rgba(0,188,212,0.15)', fontSize: '0.75rem', color: 'primary.light', fontFamily: '"Roboto Mono"' }}>
                  {t}
                </Box>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mb: 3 }} />

        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={1}>
          <Typography variant="body2" color="text.secondary">
            © 2026 SafeOp AI — Projet ESPRIM 2026 · AI for Health
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Moins de charge · Plus de vigilance · Zéro compromis
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
