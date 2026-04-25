import { Box, Container, Typography, Grid, Paper, Stack } from '@mui/material';
import WifiIcon from '@mui/icons-material/Wifi';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BiotechIcon from '@mui/icons-material/Biotech';
import SpeedIcon from '@mui/icons-material/Speed';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import ScienceIcon from '@mui/icons-material/Science';
import BoltIcon from '@mui/icons-material/Bolt';
import GavelIcon from '@mui/icons-material/Gavel';

const OBJECTIVES = [
  { icon: <WifiIcon />, title: "Suivi à distance", desc: "Le médecin suit le patient depuis n'importe où — consultation, couloir, domicile.", color: '#00BCD4' },
  { icon: <VisibilityIcon />, title: "Multi-salles", desc: "Un technicien surveille plusieurs salles opératoires simultanément en toute sécurité.", color: '#1565C0' },
  { icon: <BiotechIcon />, title: "Réduction infectieuse", desc: "Moins de va-et-vient en salle d'opération réduit le risque d'infection nosocomiale.", color: '#00C853' },
  { icon: <SpeedIcon />, title: "Gain de temps", desc: "Documentation automatique libère l'équipe des tâches répétitives. Efficacité maximale.", color: '#FF9800' },
  { icon: <TrackChangesIcon />, title: "Traçabilité totale", desc: "Chaque paramètre, chaque décision, chaque action enregistrée en continu.", color: '#9C27B0' },
  { icon: <ScienceIcon />, title: "Dosage précis", desc: "Réduction du gaspillage médicamenteux grâce aux doses calculées au milligramme près.", color: '#F44336' },
  { icon: <BoltIcon />, title: "Réponse d'urgence", desc: "Détection et réponse aux urgences cliniques en moins de 3 secondes.", color: '#FFB300' },
  { icon: <GavelIcon />, title: "Archivage médico-légal", desc: "Dossier complet, sécurisé et exportable pour toute procédure juridique.", color: '#4CAF50' },
];

export default function Objectives() {
  return (
    <Box id="objectives" sx={{ py: 12, background: '#080F1F' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: 3, fontWeight: 600 }}>
            OBJECTIFS
          </Typography>
          <Typography variant="h2" sx={{ mt: 1, mb: 2, fontSize: { xs: '2rem', md: '2.8rem' } }}>
            {"8 raisons concrètes d'adopter SafeOp AI"}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {OBJECTIVES.map((obj, i) => (
            <Grid item xs={12} sm={6} md={3} key={obj.title}>
              <Paper
                elevation={0}
                sx={{
                  p: 3, height: '100%',
                  background: 'rgba(10,22,40,0.6)',
                  border: `1px solid ${obj.color}18`,
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  '&:hover': { border: `1px solid ${obj.color}55`, transform: 'translateY(-4px)' },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
                  <Box sx={{ color: obj.color, display: 'flex' }}>
                    {obj.icon}
                  </Box>
                  <Typography variant="caption" sx={{ color: obj.color, fontWeight: 700, opacity: 0.6, fontFamily: '"Roboto Mono"' }}>
                    0{i + 1}
                  </Typography>
                </Stack>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>{obj.title}</Typography>
                <Typography variant="body2" color="text.secondary" lineHeight={1.7}>{obj.desc}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
