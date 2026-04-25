import { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Typography, Stack, Paper, Chip, CircularProgress, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';

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
        content: "Désolé, le service LLM est temporairement indisponible. Vérifiez qu'Ollama est démarré (`ollama serve`) avec le modèle Mistral (`ollama pull mistral`).",
        source: 'error',
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
