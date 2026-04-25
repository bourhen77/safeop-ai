// SafeOp AI — Parseur de rapport pré-opératoire
// Extrait le profil patient et calcule les ajustements de dosage via LLM ou regex

import Anthropic from '@anthropic-ai/sdk';

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const EXTRACTION_PROMPT = `Tu es un assistant médical expert en anesthésiologie.
Analyse ce rapport pré-opératoire et extrais les données au format JSON STRICT (sans texte avant ni après) :

{
  "name": "Prénom Nom du patient",
  "age": <nombre entier>,
  "weight": <nombre entier en kg>,
  "height": <nombre entier en cm ou null>,
  "gender": "M" ou "F",
  "surgery": "Nom de la chirurgie",
  "asa": <1, 2, 3, 4 ou 5>,
  "dfg": <valeur DFG en mL/min ou null>,
  "imc": <valeur IMC ou null>,
  "conditions": ["liste", "des", "pathologies"],
  "medications": ["liste", "des", "médicaments"],
  "allergies": ["liste", "des", "allergies"],
  "mallampati": <1, 2, 3, 4 ou null>,
  "notes": "Remarques importantes pour l'anesthésiste"
}

Rapport à analyser :`;

const ADJUSTMENT_RULES = [
  {
    id: 'age_65_75',
    test: p => p.age >= 65 && p.age < 75,
    propofol: -0.20,
    fentanyl: -0.20,
    reason: `Âge ${'{age}'} ans — métabolisme hépatique ralenti, demi-vie prolongée`,
    severity: 'warning',
  },
  {
    id: 'age_over_75',
    test: p => p.age >= 75,
    propofol: -0.30,
    fentanyl: -0.30,
    reason: `Âge ${'{age}'} ans — pharmacocinétique très altérée, risque de dépression respiratoire`,
    severity: 'error',
  },
  {
    id: 'irc_legere',
    test: p => p.dfg !== null && p.dfg >= 30 && p.dfg < 60,
    propofol: -0.15,
    fentanyl: -0.25,
    reason: `IRC légère (DFG ${'{dfg}'} mL/min) — élimination fentanyl ralentie`,
    severity: 'warning',
  },
  {
    id: 'irc_moderee',
    test: p => p.dfg !== null && p.dfg < 30,
    propofol: -0.25,
    fentanyl: -0.40,
    reason: `IRC modérée/sévère (DFG ${'{dfg}'} mL/min) — accumulation opioïdes`,
    severity: 'error',
  },
  {
    id: 'hta',
    test: p => p.conditions.some(c => /hypertension|hta/i.test(c)),
    ephedrine: -0.15,
    reason: 'HTA — risque rebond tensionnel, éphédrine dose prudente',
    severity: 'info',
  },
  {
    id: 'hepatique',
    test: p => p.conditions.some(c => /hépatique|hepatique|cirrhose|foie/i.test(c)),
    propofol: -0.25,
    reason: 'Atteinte hépatique — métabolisme propofol altéré (CYP450)',
    severity: 'error',
  },
  {
    id: 'obesite',
    test: p => p.imc !== null && p.imc >= 30,
    note: 'Obésité — utiliser le poids idéal (PI) pour opioïdes : PI = 50 + 0,91×(taille-152,4)',
    severity: 'warning',
  },
];

function interpolate(str, patient) {
  return str
    .replace('{age}', patient.age)
    .replace('{dfg}', patient.dfg)
    .replace('{imc}', patient.imc);
}

function buildAdjustments(patient) {
  return ADJUSTMENT_RULES
    .filter(rule => rule.test(patient))
    .map(rule => ({
      id: rule.id,
      propofol: rule.propofol || 0,
      fentanyl: rule.fentanyl || 0,
      ephedrine: rule.ephedrine || 0,
      note: rule.note || null,
      reason: interpolate(rule.reason || '', patient),
      severity: rule.severity,
    }));
}

function regexExtract(text) {
  const get = (pattern, idx = 1, fallback = null) => {
    const m = text.match(pattern);
    return m ? m[idx] : fallback;
  };

  const ageStr = get(/(\d+)\s*ans/i);
  const age = ageStr ? parseInt(ageStr) : 45;

  const weightStr = get(/poids\s*[:|]?\s*(\d+)\s*kg/i) || get(/(\d+)\s*kg(?:\s*\||\s|$)/i);
  const weight = weightStr ? parseInt(weightStr) : 70;

  const heightStr = get(/taille\s*[:|]?\s*(\d+)\s*cm/i);
  const height = heightStr ? parseInt(heightStr) : null;

  const imcStr = get(/imc\s*[:|]?\s*([\d.,]+)/i);
  const imc = imcStr ? parseFloat(imcStr.replace(',', '.')) : null;

  const dfgStr = get(/dfg\s*[=:|]?\s*(\d+)/i);
  const dfg = dfgStr ? parseInt(dfgStr) : null;

  const genderRaw = text.match(/masculin|homme|male/i) ? 'M'
    : text.match(/féminin|femme|female/i) ? 'F' : 'M';

  const asaMatch = text.match(/(?:score|classification|classe)?\s*asa\s*[:|]?\s*(III|IV|II|VI|V|I|\d)/i);
  const asaStr = asaMatch ? asaMatch[1] : null;
  const asaMap = { 'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 5 };
  const asa = asaStr ? (asaMap[asaStr.toUpperCase()] || parseInt(asaStr) || 2) : 2;

  const mallampatiStr = get(/mallampati\s*[:|]?\s*(?:classe\s*)?([IVX1-4]+)/i);
  const mallampati = mallampatiStr ? (parseInt(mallampatiStr) || { 'I': 1, 'II': 2, 'III': 3, 'IV': 4 }[mallampatiStr.toUpperCase()] || null) : null;

  const surgeries = [
    [/cholécystectomie/i, 'Cholécystectomie laparoscopique'],
    [/appendice|appendicectomie/i, 'Appendicectomie'],
    [/amygdal/i, 'Amygdalectomie'],
    [/herni/i, 'Hernioplastie'],
    [/colect/i, 'Colectomie'],
    [/gastrect/i, 'Gastrectomie'],
    [/prothèse.*hanche|hanche/i, 'Prothèse de hanche'],
    [/genou|prothèse.*genou/i, 'Prothèse du genou'],
  ];
  const surgery = surgeries.find(([r]) => r.test(text))?.[1] || 'Intervention chirurgicale programmée';

  // Match "Nom : BEN ALI Ahmed" — handles ALL CAPS and mixed case
  const nomLine = text.match(/(?:^|\n)\s*Nom\s*[:|]\s*(.+?)(?:\s*\||$)/im);
  const name = nomLine ? nomLine[1].trim() : 'Patient inconnu';

  const conditionKeywords = [
    [/hypertension|hta/i, 'hypertension'],
    [/diabète.*type\s*2|dm2/i, 'diabete_type2'],
    [/diabète.*type\s*1/i, 'diabete_type1'],
    [/insuffisance\s*rénale|irc/i, 'insuffisance_renale'],
    [/insuffisance\s*hépatique|cirrhose/i, 'insuffisance_hepatique'],
    [/insuffisance\s*cardiaque/i, 'insuffisance_cardiaque'],
    [/asthme|bpco/i, 'pathologie_respiratoire'],
    [/anticoagul/i, 'anticoagulation'],
  ];
  const conditions = conditionKeywords.filter(([r]) => r.test(text)).map(([, c]) => c);

  const medicationKeywords = [
    [/metformine|metformin/i, 'metformine'],
    [/ramipril|lisinopril|perindopril/i, 'IEC'],
    [/amlodipine|nifédipine/i, 'inhibiteur_calcique'],
    [/bisoprolol|métoprolol|atenolol/i, 'betabloquant'],
    [/warfarine|acenocoumarol/i, 'AVK'],
    [/rivaroxaban|apixaban|dabigatran/i, 'AOD'],
    [/aspirine|clopidogrel/i, 'antiagregant'],
    [/oméprazole|pantoprazole/i, 'IPP'],
  ];
  const medications = medicationKeywords.filter(([r]) => r.test(text)).map(([, m]) => m);

  const allergyLine = text.match(/allergi[e]?\s*[s]?\s*[:|]([^\n]+)/i);
  const allergies = allergyLine
    ? allergyLine[1].split(/[,;·•]/).map(s => s.trim()).filter(s => s.length > 2 && !/aucune|none|néant/i.test(s))
    : [];

  return { name, age, weight, height, imc, gender: genderRaw, surgery, asa, dfg, mallampati, conditions, medications, allergies, notes: '' };
}

async function llmExtract(reportText) {
  // Try Claude first (more reliable JSON output)
  if (anthropic) {
    try {
      const response = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 800,
        messages: [{ role: 'user', content: `${EXTRACTION_PROMPT}\n\n${reportText}` }],
      });
      const raw = response.content[0].text.trim();
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.log('[reportParser] Claude extract failed:', e.message);
    }
  }

  // Try Ollama
  try {
    const { Ollama } = await import('ollama');
    const ollama = new Ollama({ host: process.env.OLLAMA_URL || 'http://localhost:11434' });
    const response = await ollama.chat({
      model: process.env.OLLAMA_MODEL || 'mistral',
      messages: [{ role: 'user', content: `${EXTRACTION_PROMPT}\n\n${reportText}\n\nRéponds UNIQUEMENT avec le JSON, sans explication.` }],
      options: { temperature: 0.1 },
    });
    const raw = response.message.content.trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.log('[reportParser] Ollama extract failed:', e.message);
  }

  return null;
}

export async function parsePatientReport(reportText) {
  let extracted = null;

  try {
    extracted = await llmExtract(reportText);
  } catch (e) {
    console.log('[reportParser] LLM extraction failed, using regex');
  }

  if (!extracted || typeof extracted.age !== 'number') {
    extracted = regexExtract(reportText);
    extracted._source = 'regex';
  } else {
    extracted._source = 'llm';
    // Normalize types
    extracted.age = parseInt(extracted.age) || 45;
    extracted.weight = parseInt(extracted.weight) || 70;
    extracted.dfg = extracted.dfg ? parseInt(extracted.dfg) : null;
    extracted.imc = extracted.imc ? parseFloat(extracted.imc) : null;
    extracted.asa = parseInt(extracted.asa) || 2;
    extracted.conditions = extracted.conditions || [];
    extracted.medications = extracted.medications || [];
    extracted.allergies = extracted.allergies || [];
  }

  extracted.isPediatric = extracted.age < 15;
  extracted.adjustments = buildAdjustments(extracted);
  extracted.fromReport = true;

  return extracted;
}
