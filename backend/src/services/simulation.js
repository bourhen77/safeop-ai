// Vital signs simulation engine

const SCENARIOS = {
  normal: {
    label: 'Stable — État normal',
    patient: { name: 'Patient adulte', age: 45, weight: 70, surgery: 'Cholécystectomie laparoscopique' },
    base: { hr: 72, spo2: 99, sbp: 120, dbp: 80, rr: 14, temp: 36.5 },
    noise: { hr: 4, spo2: 0.5, sbp: 5, dbp: 3, rr: 1, temp: 0.1 },
    events: [],
  },
  hypotension: {
    label: '🔴 Crise — Hypotension',
    patient: { name: 'Patient adulte', age: 52, weight: 80, surgery: 'Résection colique' },
    base: { hr: 95, spo2: 97, sbp: 78, dbp: 45, rr: 18, temp: 36.2 },
    noise: { hr: 6, spo2: 1, sbp: 8, dbp: 5, rr: 2, temp: 0.1 },
    events: [
      { delay: 5, severity: 'warning', message: 'Tension artérielle en baisse : 88/55 mmHg', action: 'Surveillance accrue activée' },
      { delay: 12, severity: 'error', message: 'HYPOTENSION DÉTECTÉE : TA 72/42 mmHg', action: 'Activation automatique éphédrine via PSE — 10mg/h' },
      { delay: 20, severity: 'warning', message: 'Alerte vocale émise au technicien', action: 'Notification envoyée au médecin à distance' },
      { delay: 35, severity: 'success', message: 'TA en remontée : 105/65 mmHg', action: 'Dose éphédrine réduite automatiquement' },
    ],
  },
  bradycardia: {
    label: '🟡 Alerte — Bradycardie',
    patient: { name: 'Patient adulte', age: 61, weight: 75, surgery: 'Prostatectomie' },
    base: { hr: 38, spo2: 98, sbp: 95, dbp: 62, rr: 12, temp: 36.1 },
    noise: { hr: 3, spo2: 0.5, sbp: 6, dbp: 4, rr: 1, temp: 0.1 },
    events: [
      { delay: 3, severity: 'warning', message: 'FC basse détectée : 42 bpm', action: 'Analyse du contexte en cours...' },
      { delay: 8, severity: 'error', message: 'BRADYCARDIE SÉVÈRE : FC 35 bpm', action: 'Atropine 0.5mg recommandée — alerte technicien' },
      { delay: 15, severity: 'warning', message: 'Conduite à tenir affichée : Atropine IV', action: 'Médecin notifié sur mobile' },
      { delay: 28, severity: 'success', message: 'FC remontée : 58 bpm après traitement', action: 'Situation stabilisée, surveillance maintenue' },
    ],
  },
  pediatric: {
    label: '👶 Pédiatrique — Amygdalectomie',
    patient: { name: 'Enfant', age: 6, weight: 22, surgery: 'Amygdalectomie' },
    base: { hr: 105, spo2: 99, sbp: 92, dbp: 58, rr: 22, temp: 36.7 },
    noise: { hr: 8, spo2: 0.5, sbp: 4, dbp: 3, rr: 2, temp: 0.1 },
    events: [
      { delay: 2, severity: 'success', message: 'Profil pédiatrique chargé : 6 ans, 22 kg', action: 'Doses calculées automatiquement selon poids/âge' },
      { delay: 10, severity: 'success', message: 'Propofol : 2.2 mg/kg = 48.4 mg calculé', action: 'Dose injectée via PSE — débit ajusté' },
      { delay: 20, severity: 'warning', message: 'FC légèrement élevée : 118 bpm', action: "Évaluation contexte — réponse vagale post-intubation probable" },
      { delay: 40, severity: 'success', message: 'Paramètres stables, enfant bien équilibré', action: 'Surveillance automatique maintenue' },
    ],
  },
};

export function getScenario(id) {
  return SCENARIOS[id] || SCENARIOS.normal;
}

export function getScenarioList() {
  return Object.entries(SCENARIOS).map(([id, s]) => ({ id, label: s.label, patient: s.patient }));
}

export function generateVitals(scenarioId, elapsed) {
  const s = SCENARIOS[scenarioId] || SCENARIOS.normal;
  const { base, noise, events } = s;

  const n = (mu, sigma) => mu + (Math.random() - 0.5) * sigma * 2;

  const vitals = {
    hr: Math.round(n(base.hr, noise.hr)),
    spo2: Math.min(100, parseFloat(n(base.spo2, noise.spo2).toFixed(1))),
    sbp: Math.round(n(base.sbp, noise.sbp)),
    dbp: Math.round(n(base.dbp, noise.dbp)),
    rr: Math.round(n(base.rr, noise.rr)),
    temp: parseFloat(n(base.temp, noise.temp).toFixed(1)),
    ts: Date.now(),
  };

  // Determine alarms
  const alarms = [];
  if (vitals.hr < 50 || vitals.hr > 120) alarms.push({ type: 'hr', severity: vitals.hr < 40 || vitals.hr > 140 ? 'error' : 'warning' });
  if (vitals.spo2 < 95) alarms.push({ type: 'spo2', severity: vitals.spo2 < 90 ? 'error' : 'warning' });
  if (vitals.sbp < 90 || vitals.sbp > 160) alarms.push({ type: 'bp', severity: vitals.sbp < 80 || vitals.sbp > 180 ? 'error' : 'warning' });

  // Get triggered events
  const triggeredEvent = events.find(e => Math.abs(e.delay - elapsed) < 1);

  return { vitals, alarms, event: triggeredEvent || null, patient: s.patient };
}
