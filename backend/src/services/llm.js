import Anthropic from '@anthropic-ai/sdk';
import { findRelevantContext } from './knowledge.js';

const SYSTEM_PROMPT = `Tu es l'assistant expert de SafeOp AI, un système intelligent d'aide à l'anesthésie développé pour ESPRIM 2026.
Tu réponds aux questions en français de manière claire, professionnelle et concise.
Tu es capable d'expliquer le système aux médecins, techniciens et membres d'un jury de compétition.
Base tes réponses uniquement sur le contexte SafeOp AI fourni.
Si une question sort totalement du domaine, redirige poliment vers SafeOp AI.
Sois précis, confiant et pédagogique.`;

let ollamaClient = null;

async function getOllama() {
  if (ollamaClient) return ollamaClient;
  try {
    const { Ollama } = await import('ollama');
    ollamaClient = new Ollama({ host: process.env.OLLAMA_URL || 'http://localhost:11434' });
    return ollamaClient;
  } catch {
    return null;
  }
}

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

export async function checkOllamaStatus() {
  try {
    const ollama = await getOllama();
    if (!ollama) return { available: false };
    await ollama.list();
    return { available: true, model: process.env.OLLAMA_MODEL || 'mistral' };
  } catch {
    return { available: false };
  }
}

function buildPatientSection(patientContext) {
  if (!patientContext) return '';
  const { patient, vitals, doses } = patientContext;
  const lines = ['\n\nCONTEXTE PATIENT EN COURS (simulation active) :'];
  if (patient) {
    lines.push(`- Patient : ${patient.age} ans, ${patient.weight} kg, ${patient.gender === 'M' ? 'Homme' : 'Femme'}, ASA ${patient.asa}${patient.isPediatric ? ' (PÉDIATRIQUE)' : ''}`);
  }
  if (vitals && vitals.sbp) {
    lines.push(`- Vitaux actuels : TA ${vitals.sbp}/${vitals.dbp} mmHg, FC ${vitals.hr} bpm, SpO2 ${vitals.spo2}%, EtCO2 ${vitals.etco2} mmHg, T° ${vitals.temp}°C`);
  }
  if (doses) {
    lines.push(`- Doses calculées (SFAR 2023) :`);
    if (doses.propofol) lines.push(`  · Propofol induction : ${doses.propofol}`);
    if (doses.fentanyl) lines.push(`  · Fentanyl : ${doses.fentanyl}`);
    if (doses.atropine) lines.push(`  · Atropine : ${doses.atropine}`);
    if (doses.ephedrine) lines.push(`  · Éphédrine : ${doses.ephedrine}`);
  }
  lines.push('Utilise ces données réelles pour répondre précisément aux questions sur ce patient.');
  return lines.join('\n');
}

export async function chat(message, history = [], patientContext = null) {
  const context = findRelevantContext(message);
  const systemWithContext = `${SYSTEM_PROMPT}

CONTEXTE SAFEOP AI PERTINENT :
${context}${buildPatientSection(patientContext)}`;

  const messages = [
    ...history.slice(-6).map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: message },
  ];

  // Try Ollama first
  try {
    const ollama = await getOllama();
    if (ollama) {
      const response = await ollama.chat({
        model: process.env.OLLAMA_MODEL || 'mistral',
        messages: [{ role: 'system', content: systemWithContext }, ...messages],
        options: { temperature: 0.7, num_predict: 512 },
      });
      return { text: response.message.content, source: 'ollama' };
    }
  } catch (e) {
    console.log('[LLM] Ollama unavailable, trying Claude fallback:', e.message);
  }

  // Fallback: Claude API
  if (anthropic) {
    try {
      const response = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        system: systemWithContext,
        messages,
      });
      return { text: response.content[0].text, source: 'claude' };
    } catch (e) {
      console.log('[LLM] Claude API failed:', e.message);
    }
  }

  // Last resort: static RAG answer
  return { text: buildStaticAnswer(message, context), source: 'static' };
}

function buildStaticAnswer(question, context) {
  if (!context) {
    return "Je suis l'assistant SafeOp AI. Posez-moi une question sur le système d'aide à l'anesthésie (fonctionnement, objectifs, phases opératoires, chirurgie pédiatrique...).";
  }
  return `Voici les informations pertinentes sur SafeOp AI :\n\n${context.substring(0, 600)}...\n\n*(Réponse générée depuis la base de connaissances — démarrez Ollama pour des réponses IA complètes)*`;
}
