import { Box, Container, Typography, Grid, Paper, Stack, Chip } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';

export default function Intelligence() {
  return (
    <Box sx={{ py: 12, background: 'linear-gradient(180deg, #080F1F 0%, #050D1A 100%)' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: 3, fontWeight: 600 }}>
            INTELLIGENCE DÉCISIONNELLE
          </Typography>
          <Typography variant="h2" sx={{ mt: 1, mb: 2, fontSize: { xs: '2rem', md: '2.8rem' } }}>
            L'IA qui réagit selon la gravité
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', fontWeight: 300 }}>
            Deux niveaux de réponse intelligente — automatique pour le non-critique, assistée pour l'urgence.
          </Typography>
        </Box>

        <Grid container spacing={4} alignItems="stretch">
          {/* Non-critical */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 4, height: '100%', background: 'rgba(255,179,0,0.05)', border: '1px solid rgba(255,179,0,0.25)', borderRadius: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Box sx={{ p: 1.5, borderRadius: 2, background: 'rgba(255,179,0,0.15)' }}>
                  <WarningAmberIcon sx={{ color: '#FFB300', fontSize: 28 }} />
                </Box>
                <Box>
                  <Chip label="NIVEAU JAUNE" size="small" sx={{ background: 'rgba(255,179,0,0.15)', color: '#FFB300', mb: 0.5, fontWeight: 700 }} />
                  <Typography variant="h5" fontWeight={700}>Situations non critiques</Typography>
                </Box>
              </Stack>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                L'IA agit de manière autonome, sans intervention humaine requise.
              </Typography>
              <Stack spacing={2.5}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <AutoFixHighIcon sx={{ color: '#FFB300', mt: 0.3, flexShrink: 0 }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>Ajustement automatique des doses</Typography>
                    <Typography variant="body2" color="text.secondary">Adaptation continue selon la durée de l'intervention et les réactions du patient</Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <AutoFixHighIcon sx={{ color: '#FFB300', mt: 0.3, flexShrink: 0 }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>Hypotension détectée → traitement automatique</Typography>
                    <Typography variant="body2" color="text.secondary">Activation automatique du médicament hypertenseur via le pousse-seringue électrique</Typography>
                  </Box>
                </Stack>
              </Stack>
            </Paper>
          </Grid>

          {/* Critical */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 4, height: '100%', background: 'rgba(244,67,54,0.05)', border: '1px solid rgba(244,67,54,0.25)', borderRadius: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Box sx={{ p: 1.5, borderRadius: 2, background: 'rgba(244,67,54,0.15)' }}>
                  <CrisisAlertIcon sx={{ color: '#F44336', fontSize: 28 }} />
                </Box>
                <Box>
                  <Chip label="NIVEAU ROUGE" size="small" sx={{ background: 'rgba(244,67,54,0.15)', color: '#F44336', mb: 0.5, fontWeight: 700 }} />
                  <Typography variant="h5" fontWeight={700}>Situations graves</Typography>
                </Box>
              </Stack>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                L'IA alerte, guide et mobilise l'équipe médicale en quelques secondes.
              </Typography>
              <Stack spacing={2.5}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <NotificationsActiveIcon sx={{ color: '#F44336', mt: 0.3, flexShrink: 0 }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>Alerte sonore et visuelle immédiate</Typography>
                    <Typography variant="body2" color="text.secondary">Signal d'alarme en salle avec affichage de la situation détectée</Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <RecordVoiceOverIcon sx={{ color: '#F44336', mt: 0.3, flexShrink: 0 }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>Message vocal — conduites à tenir</Typography>
                    <Typography variant="body2" color="text.secondary">Instructions dictées au technicien en attente de l'arrivée du médecin</Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <PhoneAndroidIcon sx={{ color: '#F44336', mt: 0.3, flexShrink: 0 }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>Notification au médecin à distance</Typography>
                    <Typography variant="body2" color="text.secondary">Alerte simultanée envoyée sur le terminal du médecin, où qu'il soit</Typography>
                  </Box>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Pediatric highlight */}
        <Box sx={{ mt: 4, p: 4, borderRadius: 2, background: 'rgba(0,188,212,0.05)', border: '1px solid rgba(0,188,212,0.2)', textAlign: 'center' }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
            Chirurgie Pédiatrique — Précision absolue
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Calcul automatique des doses selon le <strong>poids exact et l'âge</strong> de l'enfant.
            Un technicien surveille plusieurs enfants simultanément — l'IA gère tous les débits.
            <Box component="span" sx={{ color: 'primary.main' }}> Zéro erreur de dosage.</Box>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
