import { Box, Container, Typography, Grid, Paper, Chip, Stack } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const PHASES = [
  {
    phase: '01',
    label: 'Préopératoire',
    icon: <AssignmentIcon sx={{ fontSize: 32 }} />,
    color: '#1565C0',
    title: 'Poser les bases',
    desc: "Dès la première consultation, le médecin saisit le dossier complet du patient — socle de toutes les décisions IA le jour J.",
    items: [
      "Âge, poids, antécédents médicaux et allergies",
      "Traitements en cours et bilans biologiques",
      "Complications potentielles et protocole d'anesthésie prévu",
      "Personnalisation complète de la surveillance IA",
    ],
  },
  {
    phase: '02',
    label: 'Peropératoire',
    icon: <MonitorHeartIcon sx={{ fontSize: 32 }} />,
    color: '#00BCD4',
    title: 'Surveiller, documenter, agir',
    desc: "SafeOp AI décharge l'anesthésiste des tâches répétitives pour qu'il se concentre sur son rôle médical.",
    items: [
      "Enregistrement continu de tous les paramètres vitaux",
      "Détection précoce de toute anomalie",
      "Croisement des données avec le dossier préopératoire",
      "Aide à la décision clinique immédiate et contextualisée",
    ],
  },
  {
    phase: '03',
    label: 'Post-opératoire',
    icon: <CheckCircleIcon sx={{ fontSize: 32 }} />,
    color: '#00C853',
    title: 'Ne pas lâcher le patient',
    desc: "La phase de réveil reste critique. SafeOp AI assure une continuité de surveillance en salle de réveil.",
    items: [
      "Détection précoce des complications post-anesthésiques",
      "Suivi de la douleur avec alertes automatiques",
      "Transmission en temps réel au médecin à distance",
      "Génération automatique du compte-rendu et archivage sécurisé",
    ],
  },
];

export default function Solution() {
  return (
    <Box id="solution" sx={{ py: 12, background: '#080F1F' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: 3, fontWeight: 600 }}>
            SOLUTION
          </Typography>
          <Typography variant="h2" sx={{ mt: 1, mb: 2, fontSize: { xs: '2rem', md: '2.8rem' } }}>
            SafeOp AI — 3 phases, 0 compromis
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 640, mx: 'auto', fontWeight: 300 }}>
            Un système intelligent qui accompagne le patient de la consultation préopératoire jusqu'à la salle de réveil.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {PHASES.map((phase, idx) => (
            <Grid item xs={12} md={4} key={phase.phase}>
              <Paper
                elevation={0}
                sx={{
                  p: 4, height: '100%',
                  background: 'rgba(10,22,40,0.8)',
                  border: `1px solid ${phase.color}22`,
                  borderRadius: 2,
                  position: 'relative',
                  transition: 'all 0.25s',
                  '&:hover': { border: `1px solid ${phase.color}66`, transform: 'translateY(-6px)', boxShadow: `0 20px 40px ${phase.color}11` },
                }}
              >
                <Box sx={{ position: 'absolute', top: 16, right: 16, opacity: 0.08 }}>
                  <Typography sx={{ fontSize: '5rem', fontWeight: 900, lineHeight: 1, color: phase.color }}>
                    {phase.phase}
                  </Typography>
                </Box>

                <Chip
                  label={`Phase ${phase.phase}`}
                  size="small"
                  sx={{ mb: 2, background: `${phase.color}22`, color: phase.color, fontWeight: 600, border: `1px solid ${phase.color}44` }}
                />

                <Box sx={{ color: phase.color, mb: 2 }}>{phase.icon}</Box>
                <Typography variant="h5" gutterBottom fontWeight={700}>{phase.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>{phase.desc}</Typography>

                <Stack spacing={1}>
                  {phase.items.map(item => (
                    <Stack key={item} direction="row" spacing={1} alignItems="flex-start">
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: phase.color, mt: 0.7, flexShrink: 0 }} />
                      <Typography variant="body2" color="text.secondary" lineHeight={1.6}>{item}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
