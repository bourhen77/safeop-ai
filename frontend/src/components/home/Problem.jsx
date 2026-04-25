import { Box, Container, Typography, Grid, Paper, Divider } from '@mui/material';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonOffIcon from '@mui/icons-material/PersonOff';

const PROBLEMS = [
  {
    icon: <PersonOffIcon sx={{ fontSize: 36, color: '#F44336' }} />,
    title: "Migration massive",
    desc: "Des milliers d'infirmiers et techniciens en anesthésie quittent la Tunisie vers l'Allemagne chaque année, créant un vide critique.",
  },
  {
    icon: <AccessTimeIcon sx={{ fontSize: 36, color: '#FFB300' }} />,
    title: "Documentation chronophage",
    desc: "L'anesthésiste doit saisir manuellement les paramètres vitaux toutes les 10 minutes, le distrayant dans les moments les plus critiques.",
  },
  {
    icon: <ErrorOutlineIcon sx={{ fontSize: 36, color: '#FF9800' }} />,
    title: "Risque d'erreur humaine",
    desc: "La surcharge cognitive augmente le risque d'erreurs médicales — dosages, diagnostics tardifs, réactions d'urgence retardées.",
  },
  {
    icon: <TrendingDownIcon sx={{ fontSize: 36, color: '#9C27B0' }} />,
    title: "Sous-surveillance",
    desc: "Un seul technicien ne peut surveiller qu'une salle à la fois. En cas de pénurie, certains patients sont moins surveillés.",
  },
];

export default function Problem() {
  return (
    <Box id="problem" sx={{ py: 12, background: 'linear-gradient(180deg, #050D1A 0%, #080F1F 100%)' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="overline" sx={{ color: 'error.main', letterSpacing: 3, fontWeight: 600 }}>
            PROBLÉMATIQUE
          </Typography>
          <Typography variant="h2" sx={{ mt: 1, mb: 2, fontSize: { xs: '2rem', md: '2.8rem' } }}>
            Un système de santé fragilisé
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', fontWeight: 300 }}>
            La Tunisie fait face à une crise silencieuse qui met en danger la sécurité des patients en salle d'opération.
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 8 }}>
          {PROBLEMS.map(p => (
            <Grid item xs={12} sm={6} md={3} key={p.title}>
              <Paper
                elevation={0}
                sx={{
                  p: 3, height: '100%',
                  background: 'rgba(10,22,40,0.6)',
                  border: '1px solid rgba(244,67,54,0.15)',
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  '&:hover': { border: '1px solid rgba(244,67,54,0.4)', transform: 'translateY(-4px)' },
                }}
              >
                <Box sx={{ mb: 2 }}>{p.icon}</Box>
                <Typography variant="h6" gutterBottom fontWeight={600}>{p.title}</Typography>
                <Typography variant="body2" color="text.secondary" lineHeight={1.7}>{p.desc}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ borderColor: 'rgba(0,188,212,0.15)', mb: 6 }} />

        <Box sx={{ textAlign: 'center', p: 4, background: 'rgba(0,188,212,0.05)', borderRadius: 2, border: '1px solid rgba(0,188,212,0.15)' }}>
          <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700, mb: 1 }}>
            Face à cette réalité, l'IA n'est plus un luxe
          </Typography>
          <Typography variant="h5" color="text.secondary" fontWeight={300}>
            C'est une nécessité médicale.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
