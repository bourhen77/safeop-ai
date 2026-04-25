import { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Typography, Stack, Paper, Chip, CircularProgress, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';

const STATIC_QA = [
  {
    keys: ['hypotension', 'tension basse', 'tas', 'pression'],
    answer: `SafeOp AI détecte l'hypotension quand la TAS descend sous 90 mmHg ou chute de plus de 20% par rapport à la valeur basale.

Protocole automatique SFAR 2023 :
1. Alerte critique émise en < 3 secondes
2. Éphédrine IV bolus (dose calculée pour le patient : 0.15 mg/kg)
3. Accélération perfusion Ringer Lactate (débit ×2)
4. Position Trendelenburg si possible
5. Réévaluation TA dans 3 minutes — médecin notifié

Cause probable : vasodilatation induite par le propofol (effet dose-dépendant documenté SFAR).`,
  },
  {
    keys: ['bradycardie', 'fc basse', 'fréquence cardiaque', 'atropine'],
    answer: `Détection bradycardie : FC < 50 bpm ou chute > 30% de la valeur basale.

Protocole automatique :
1. Alerte BRADYCARDIE générée immédiatement
2. Atropine IV bolus recommandée (0.02 mg/kg, minimum 0.5 mg adulte)
3. Vérification ECG — exclusion bloc auriculo-ventriculaire
4. Si résistant : Éphédrine ou Adrénaline 0.01 mg/kg
5. Chirurgien averti — pause stimulation recommandée

Mécanisme : réflexe vagal par stimulation parasympathique peropératoire.`,
  },
  {
    keys: ['dosage', 'dose', 'propofol', 'fentanyl', 'médicament'],
    answer: `SafeOp AI calcule les dosages selon les protocoles SFAR 2023 (mg/kg) :

Adulte standard :
• Propofol induction : 2.0 mg/kg IV bolus
• Fentanyl : 3.0 µg/kg IV bolus
• Atropine : 0.02 mg/kg (min 0.5 mg)
• Éphédrine : 0.15 mg/kg

Ajustements automatiques selon le profil patient :
• Âge > 65 ans → −20% propofol et fentanyl
• IRC légère (DFG < 60) → −25% fentanyl
• HTA → −15% éphédrine
• Pédiatrique (< 15 ans) → protocole dédié (+25% propofol, −33% fentanyl)

Les doses sont recalculées en temps réel à partir du rapport pré-opératoire.`,
  },
  {
    keys: ['pédiatrique', 'enfant', 'amygdale', 'pediatric'],
    answer: `Protocole pédiatrique SafeOp AI (SFAR 2023 / HAS) :

Ajustements vs adulte :
• Propofol induction : 2.5 mg/kg (+25% — métabolisme accéléré)
• Fentanyl : 2.0 µg/kg (−33% — sensibilité respiratoire plus élevée)
• Atropine : 0.02 mg/kg (minimum absolu 0.1 mg)
• Seuils d'alarme recalibrés : FC normale 70-120 bpm, SpO₂ > 97%

Surveillance renforcée : EtCO₂ post-extubation (risque apnée), glycémie peropératoire.
Analgésie post-op : Paracétamol 15 mg/kg IV recommandé.`,
  },
  {
    keys: ['hors ligne', 'offline', 'internet', 'réseau', 'connexion'],
    answer: `Oui, SafeOp AI fonctionne 100% hors ligne grâce à deux composants offline :

1. Expert Medical Response Engine (EMRE) — analyse clinique temps réel, zéro dépendance réseau
2. Mistral 7B via Ollama — LLM local sur le serveur de l'établissement

Aucune donnée patient ne sort du réseau hospitalier. Conforme RGPD et aux exigences de confidentialité médicale.

Débit réseau requis pour le mode multi-salles : 1 Mbps LAN (connexion interne uniquement).`,
  },
  {
    keys: ['modèle', 'llm', 'ia', 'intelligence', 'comment ça marche', 'mistral'],
    answer: `SafeOp AI utilise une architecture IA hybride à deux couches :

Couche 1 — EMRE (Expert Medical Response Engine) :
• 100% déterministe et offline
• Règles médicales basées sur SFAR 2023, WHO Anesthesia Guidelines, Vidal
• Latence < 50ms — analyse vitaux chaque seconde

Couche 2 — LLM conversationnel :
• Mistral 7B via Ollama (local, gratuit, hors ligne)
• Fallback : Claude Haiku API (Anthropic)
• RAG sur base de connaissances médicales internes

Ce choix hybride garantit fiabilité clinique (EMRE) + dialogue naturel (LLM).`,
  },
  {
    keys: ['responsabilité', 'erreur', 'risque', 'sécurité', 'légal'],
    answer: `SafeOp AI est un système d'aide à la décision (DSS), pas un dispositif autonome.

Cadre légal :
• Classifié "IA à haut risque" — EU AI Act Article 22 (usage médical)
• Toute décision clinique reste sous responsabilité exclusive du médecin anesthésiste
• L'IA recommande, le médecin décide et valide

Ce que SafeOp AI ne fait PAS :
• N'administre aucun médicament
• Ne remplace pas le jugement clinique
• Ne prescrit pas

Ce que SafeOp AI FAIT :
• Surveille en continu (< 3s de latence)
• Calcule les doses (protocoles validés)
• Archive chaque décision (traçabilité médico-légale)`,
  },
  {
    keys: ['objectif', 'problème', 'solution', 'quoi', 'safeop'],
    answer: `SafeOp AI résout 3 problèmes critiques en anesthésie :

1. Surveillance simultanée multi-salles
   Un technicien peut monitorer N salles d'opération depuis une interface centralisée.

2. Réduction du risque infectieux
   Moins de présence physique en salle = moins de vecteurs de contamination.

3. Documentation automatique
   Compte-rendu d'anesthésie généré automatiquement — archivage médico-légal instantané.

Contexte ESPRIM 2026 : les 8 objectifs trackés en temps réel pendant la simulation démontrent chaque capacité du système en conditions réelles.`,
  },
];

function staticAnswer(question) {
  const q = question.toLowerCase();
  const match = STATIC_QA.find(item => item.keys.some(k => q.includes(k)));
  if (match) return match.answer;
  return `SafeOp AI est un système intelligent d'aide à l'anesthésie développé pour ESPRIM 2026.

Il surveille les paramètres vitaux en temps réel, calcule les dosages précis (protocoles SFAR 2023), détecte les urgences en moins de 3 secondes, et génère automatiquement les comptes-rendus d'anesthésie.

Questions suggérées :
• Comment SafeOp AI détecte une hypotension ?
• Quel dosage pour un patient de 70 kg ?
• Comment fonctionne la chirurgie pédiatrique ?
• SafeOp AI peut-il fonctionner hors ligne ?

*(Mode hors ligne — démarrez le serveur local pour les réponses IA complètes)*`;
}

const SUGGESTED_DEFAULT = [
  "Comment SafeOp AI détecte une hypotension ?",
  "Quel modèle d'IA est utilisé ?",
  "Comment fonctionne la chirurgie pédiatrique ?",
  "Que fait l'IA en cas d'urgence grave ?",
  "SafeOp AI peut-il fonctionner hors ligne ?",
  "Qui est responsable si l'IA se trompe ?",
];

const SUGGESTED_ACTIVE = [
  "Quelle dose d'éphédrine pour ce patient ?",
  "Quel est l'état actuel du patient ?",
  "Pourquoi cette alerte a été déclenchée ?",
  "Quelle est la dose de propofol calculée ?",
  "Comment interpréter la SpO2 actuelle ?",
  "Est-ce que les vitaux sont dans les normes ?",
];

function Message({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 2, flexDirection: isUser ? 'row-reverse' : 'row' }}>
      <Avatar
        sx={{
          width: 28, height: 28, flexShrink: 0,
          background: isUser ? 'rgba(21,101,192,0.5)' : 'rgba(0,188,212,0.3)',
        }}
      >
        {isUser ? <PersonIcon sx={{ fontSize: 16 }} /> : <SmartToyIcon sx={{ fontSize: 16 }} />}
      </Avatar>
      <Paper
        elevation={0}
        sx={{
          p: 1.5, maxWidth: '80%',
          background: isUser ? 'rgba(21,101,192,0.2)' : 'rgba(10,22,40,0.8)',
          border: isUser ? '1px solid rgba(21,101,192,0.3)' : '1px solid rgba(0,188,212,0.15)',
          borderRadius: isUser ? '12px 12px 2px 12px' : '2px 12px 12px 12px',
        }}
      >
        <Typography variant="body2" sx={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
          {msg.content}
        </Typography>
        {msg.source && (
          <Typography variant="caption" sx={{ opacity: 0.5, fontSize: '0.65rem', display: 'block', mt: 0.5 }}>
            via {msg.source === 'ollama' ? `Ollama (Mistral)` : msg.source === 'claude' ? 'Claude API' : 'Base de connaissances'}
          </Typography>
        )}
      </Paper>
    </Stack>
  );
}

export default function ChatBot({ currentVitals, patient, dosePlan, running }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Bonjour ! Je suis l'assistant SafeOp AI. Posez-moi n'importe quelle question sur le système — fonctionnement, phases opératoires, décisions IA, sécurité, chirurgie pédiatrique...",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const SUGGESTED = running ? SUGGESTED_ACTIVE : SUGGESTED_DEFAULT;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const buildPatientContext = () => {
    if (!patient || !running) return null;
    const v = currentVitals || {};
    const d = dosePlan || {};
    return {
      patient: {
        age: patient.age,
        weight: patient.weight,
        gender: patient.gender,
        asa: patient.asa,
        isPediatric: patient.isPediatric,
      },
      vitals: {
        sbp: v.sbp, dbp: v.dbp, hr: v.hr, spo2: v.spo2,
        etco2: v.etco2, rr: v.rr, temp: v.temp,
      },
      doses: d ? {
        propofol: d.propofol ? `${d.propofol.induction} ${d.propofol.unit_induction}` : null,
        fentanyl: d.fentanyl ? `${d.fentanyl.induction} ${d.fentanyl.unit_induction}` : null,
        atropine: d.atropine ? `${d.atropine.dose} ${d.atropine.unit}` : null,
        ephedrine: d.ephedrine ? `${d.ephedrine.dose} ${d.ephedrine.unit}` : null,
      } : null,
    };
  };

  const send = async (text) => {
    const content = (text || input).trim();
    if (!content || loading) return;
    setInput('');

    const userMsg = { role: 'user', content };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const patientContext = buildPatientContext();
      const { data } = await axios.post('/api/chat', { message: content, history, patientContext });
      setMessages(prev => [...prev, { role: 'assistant', content: data.text, source: data.source }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: staticAnswer(content),
        source: 'static',
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ letterSpacing: 1 }}>
          ASSISTANT IA — SAFEOP Q&A
        </Typography>
        <Stack direction="row" spacing={1}>
          {running && patient && (
            <Chip
              label={`Patient ${patient.weight}kg · ${patient.isPediatric ? 'Pédiatrique' : 'Adulte'}`}
              size="small"
              sx={{ fontSize: '0.6rem', color: '#00C853', borderColor: '#00C853', height: 18 }}
              variant="outlined"
            />
          )}
          <Chip label="Mistral 7B" size="small" sx={{ fontSize: '0.65rem', color: 'primary.main', borderColor: 'primary.main' }} variant="outlined" />
        </Stack>
      </Stack>

      {/* Suggested questions */}
      <Box sx={{ mb: 1.5, display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
        {SUGGESTED.map(q => (
          <Chip
            key={q} label={q} size="small" onClick={() => send(q)}
            disabled={loading}
            sx={{ fontSize: '0.7rem', cursor: 'pointer', background: 'rgba(0,188,212,0.06)', borderColor: 'rgba(0,188,212,0.2)',
              '&:hover': { background: 'rgba(0,188,212,0.15)' } }}
            variant="outlined"
          />
        ))}
      </Box>

      {/* Messages */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 1,
        '&::-webkit-scrollbar': { width: 4 },
        '&::-webkit-scrollbar-thumb': { background: 'rgba(0,188,212,0.3)', borderRadius: 2 },
      }}>
        {messages.map((m, i) => <Message key={i} msg={m} />)}
        {loading && (
          <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 2 }}>
            <Avatar sx={{ width: 28, height: 28, background: 'rgba(0,188,212,0.3)' }}>
              <SmartToyIcon sx={{ fontSize: 16 }} />
            </Avatar>
            <Paper elevation={0} sx={{ p: 1.5, background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(0,188,212,0.15)', borderRadius: '2px 12px 12px 12px' }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={12} sx={{ color: 'primary.main' }} />
                <Typography variant="caption" color="text.secondary">SafeOp AI réfléchit...</Typography>
              </Stack>
            </Paper>
          </Stack>
        )}
        <div ref={bottomRef} />
      </Box>

      {/* Input */}
      <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Posez une question sur SafeOp AI..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          disabled={loading}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '& fieldset': { borderColor: 'rgba(0,188,212,0.2)' },
              '&:hover fieldset': { borderColor: 'rgba(0,188,212,0.4)' },
              '&.Mui-focused fieldset': { borderColor: 'primary.main' },
            },
          }}
        />
        <IconButton onClick={() => send()} disabled={loading || !input.trim()} sx={{ background: 'rgba(0,188,212,0.15)', color: 'primary.main', '&:hover': { background: 'rgba(0,188,212,0.3)' }, '&.Mui-disabled': { opacity: 0.3 } }}>
          <SendIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Box>
  );
}
