import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Stack, Chip, Paper, Divider } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PsychologyIcon from '@mui/icons-material/Psychology';

const TYPE_COLORS = {
  'ALERTE CRITIQUE': '#F44336',
  'STABILISATION': '#00C853',
  'INITIALISATION': '#00BCD4',
  'PROFIL PÉDI': '#00BCD4',
  'AJUSTEMENT': '#4CAF50',
  'DOCUMENTATION': '#90A4AE',
  'STABLE': '#00C853',
  'CORRIGÉE': '#00C853',
  'ANALYSE': '#00BCD4',
};

function ThinkingDots() {
  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      <SmartToyIcon sx={{ fontSize: 14, color: 'primary.main' }} />
      <Typography variant="caption" color="primary.main" fontStyle="italic">SafeOp AI analyse</Typography>
      {[0, 1, 2].map(i => (
        <Box key={i} sx={{
          width: 5, height: 5, borderRadius: '50%', background: '#00BCD4',
          animation: `dot 1.4s infinite ${i * 0.2}s`,
          '@keyframes dot': { '0%,80%,100%': { opacity: 0.2, transform: 'scale(0.8)' }, '40%': { opacity: 1, transform: 'scale(1.2)' } },
        }} />
      ))}
    </Stack>
  );
}

function TypewriterText({ text, onDone }) {
  const [displayed, setDisplayed] = useState('');
  const idx = useRef(0);

  useEffect(() => {
    setDisplayed('');
    idx.current = 0;
    const speed = text.length > 300 ? 8 : 12;
    const timer = setInterval(() => {
      idx.current++;
      setDisplayed(text.slice(0, idx.current));
      if (idx.current >= text.length) {
        clearInterval(timer);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text]);

  return (
    <Typography variant="caption" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, fontSize: '0.72rem', display: 'block' }}>
      {displayed}
    </Typography>
  );
}

function CommentaryEntry({ entry, isLatest }) {
  const [thinking, setThinking] = useState(isLatest);
  const [showText, setShowText] = useState(!isLatest);
  const color = TYPE_COLORS[entry.type] || '#00BCD4';

  useEffect(() => {
    if (!isLatest) { setThinking(false); setShowText(true); return; }
    setThinking(true);
    setShowText(false);
    const t = setTimeout(() => { setThinking(false); setShowText(true); }, 1200);
    return () => clearTimeout(t);
  }, [isLatest]);

  if (!showText && !thinking) return null;

  return (
    <Paper elevation={0} sx={{
      p: 1.5, mb: 1,
      background: `${color}08`,
      border: `1px solid ${color}25`,
      borderLeft: `3px solid ${color}`,
      borderRadius: '0 8px 8px 0',
    }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.75 }}>
        <Chip label={entry.type} size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 700, background: `${color}20`, color }} />
        <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.secondary', fontFamily: '"Roboto Mono"' }}>
          {new Date(entry.ts).toLocaleTimeString('fr-FR')}
        </Typography>
      </Stack>
      {thinking ? (
        <ThinkingDots />
      ) : showText ? (
        <TypewriterText text={entry.text} />
      ) : null}
    </Paper>
  );
}

export default function LLMPanel({ commentaries, running }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [commentaries]);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <PsychologyIcon sx={{ fontSize: 16, color: 'primary.main' }} />
          <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ letterSpacing: 1, fontSize: '0.7rem' }}>
            ANALYSE CLINIQUE IA
          </Typography>
        </Stack>
        <Chip
          label="Expert System v1.0"
          size="small"
          sx={{ fontSize: '0.58rem', color: 'primary.main', borderColor: 'primary.main', height: 18 }}
          variant="outlined"
        />
      </Stack>

      <Box sx={{ mb: 1, p: 1, background: 'rgba(0,188,212,0.05)', borderRadius: 1, border: '1px solid rgba(0,188,212,0.1)' }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.62rem' }}>
          Protocoles SFAR 2023 · WHO Anesthesia Guidelines · Vidal
        </Typography>
      </Box>

      <Box sx={{
        flex: 1, overflowY: 'auto', pr: 0.5,
        '&::-webkit-scrollbar': { width: 3 },
        '&::-webkit-scrollbar-thumb': { background: 'rgba(0,188,212,0.3)', borderRadius: 2 },
      }}>
        {commentaries.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <PsychologyIcon sx={{ fontSize: 28, color: 'text.secondary', opacity: 0.25, mb: 1 }} />
            <Typography variant="caption" color="text.secondary" display="block">
              Démarrez une simulation
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.6 }}>
              L'IA analysera chaque paramètre en temps réel
            </Typography>
          </Box>
        ) : (
          commentaries.map((entry, i) => (
            <CommentaryEntry key={i} entry={entry} isLatest={i === commentaries.length - 1} />
          ))
        )}
        <div ref={bottomRef} />
      </Box>

      <Divider sx={{ borderColor: 'rgba(0,188,212,0.1)', mt: 1, mb: 0.5 }} />
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: running ? '#00C853' : '#546E7A',
          ...(running && { animation: 'pulse 2s infinite', '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.3 } } }) }} />
        <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.secondary' }}>
          {running ? 'Analyse en temps réel active' : 'En attente de simulation'}
        </Typography>
      </Stack>
    </Box>
  );
}
