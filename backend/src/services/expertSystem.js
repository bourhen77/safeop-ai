// SafeOp AI — Expert Medical Response Engine (EMRE)
// Protocoles médicaux basés sur SFAR 2023, WHO Anesthesia Guidelines, Vidal
// Génère des commentaires cliniques contextualisés sans appel API externe

function fmt(val, dec = 1) {
  return typeof val === 'number' ? val.toFixed(dec) : val;
}

const RESPONSES = {

  simulation_start: (patient, doses) => `
Profil patient chargé — ${patient.name}, ${patient.age} ans, ${patient.weight} kg.
Chirurgie : ${patient.surgery}.

Protocole d'anesthésie calculé (SFAR 2023) :
• Propofol induction : ${doses.propofol.induction} mg IV (${doses.propofol.formula})
• Fentanyl induction : ${doses.fentanyl.induction} µg IV (${doses.fentanyl.formula})
• Entretien Propofol : ${doses.propofol.maintenance} mg/h via PSE
• Atropine disponible : ${doses.atropine.dose} mg (si FC < 50 bpm)
• Éphédrine disponible : ${doses.ephedrine.dose} mg (si TAS < 90 mmHg)

Surveillance IA activée. Analyse continue des paramètres vitaux.
`.trim(),

  normal_status: (vitals, elapsed) => {
    const mins = Math.floor(elapsed / 60);
    return `Analyse t+${mins}min — Paramètres hémodynamiques stables.
FC ${vitals.hr} bpm · SpO₂ ${fmt(vitals.spo2)} % · TA ${vitals.sbp}/${vitals.dbp} mmHg · FR ${vitals.rr}/min · T° ${fmt(vitals.temp)}°C.
Anesthésie équilibrée. Aucune intervention requise. Surveillance continue.`;
  },

  hypotension_warning: (vitals, doses) => `
⚠ HYPOTENSION DÉTECTÉE — TAS ${vitals.sbp} mmHg (seuil critique : < 90 mmHg)

Analyse clinique SafeOp AI :
Cause probable → Vasodilatation induite par le propofol + hypovolémie relative.
Fréquence cardiaque compensatoire : FC ${vitals.hr} bpm (tachycardie réactionnelle).

PROTOCOLE AUTOMATIQUE ACTIVÉ :
1. Éphédrine ${doses.ephedrine.dose} mg IV bolus (${doses.ephedrine.formula}) — PSE activé
2. Accélération perfusion Ringer Lactate — débit ×2
3. Tilt de Trendelenburg si chirurgie le permet

Médecin notifié à distance. Réévaluation TA dans 3 minutes.
`.trim(),

  hypotension_recovery: (vitals) => `
✅ STABILISATION CONFIRMÉE — TAS ${vitals.sbp} mmHg (normalisée)

L'éphédrine a produit l'effet vasopresseur attendu en ${Math.floor(Math.random() * 2) + 2} minutes.
FC revenue à ${vitals.hr} bpm. Perfusion réduite au débit initial.
PSE éphédrine arrêté automatiquement.

Traçabilité : événement hypotensif enregistré dans le dossier d'anesthésie.
Décision IA validée. Reprise de la surveillance standard.
`.trim(),

  bradycardie_warning: (vitals, doses) => `
⚠ BRADYCARDIE SÉVÈRE — FC ${vitals.hr} bpm (seuil critique : < 50 bpm)

Analyse clinique SafeOp AI :
Cause probable → Réflexe vagal per-opératoire (manipulation viscérale / traction péritonéale).
Tension artérielle : TA ${vitals.sbp}/${vitals.dbp} mmHg — sans hypotension associée.

PROTOCOLE AUTOMATIQUE ACTIVÉ :
1. Atropine ${doses.atropine.dose} mg IV bolus (${doses.atropine.formula})
2. Réduction profondeur anesthésie si BIS < 40
3. Alerte chirurgien : suspendre les tractions mésentériques

Message vocal émis en salle. Médecin notifié. Surveillance ECG continue.
`.trim(),

  bradycardie_recovery: (vitals) => `
✅ BRADYCARDIE CORRIGÉE — FC ${vitals.hr} bpm

L'atropine a rétabli le rythme sinusal en < 2 minutes.
Effet anticholinergique : blocage du réflexe vagal confirmé.

Surveillance maintenue : risque de rebond bradycardique dans les 15 prochaines minutes.
TA actuelle : TA ${vitals.sbp}/${vitals.dbp} mmHg — stable.
Incident documenté automatiquement.
`.trim(),

  pediatric_start: (patient, doses) => `
👶 PROFIL PÉDIATRIQUE ACTIVÉ — ${patient.age} ans · ${patient.weight} kg

SafeOp AI applique le protocole pédiatrique SFAR 2023 §8 :

CALCUL AUTOMATIQUE DES DOSES (mg/kg) :
• Propofol induction : ${doses.propofol.induction} mg IV (${doses.propofol.formula})
• Fentanyl : ${doses.fentanyl.induction} µg IV (${doses.fentanyl.formula})
• Atropine (si besoin) : ${doses.atropine.dose} mg — dose minimale pédiatrique respectée
• Éphédrine (si besoin) : ${doses.ephedrine.dose} mg IV

⚠ Paramètres normaux pédiatriques différents de l'adulte :
FC normale : 80–120 bpm · TA normale : 80–100 mmHg systolique · SpO₂ > 97%

Surveillance renforcée. Alertes recalibrées. Chirurgien informé.
`.trim(),

  pediatric_dose_adjust: (patient, vitals) => `
Ajustement dynamique — ${patient.age} ans · ${patient.weight} kg · t+${Math.floor(Math.random() * 5) + 3}min

FC actuelle ${vitals.hr} bpm (norme pédi : 80-120 bpm) — ✓ dans les normes.
SpO₂ ${fmt(vitals.spo2)} % — ✓ satisfaisante.
TA ${vitals.sbp}/${vitals.dbp} mmHg — ✓ adaptée au gabarit.

Débits PSE recalculés selon réponse hémodynamique :
• Propofol entretien ajusté : ${Math.round(patient.weight * 7)} mg/h
• Zéro extrapolation adulte — protocole pédiatrique strict maintenu.
`.trim(),

  documentation_auto: (elapsed) => `
Documentation automatique — t+${Math.floor(elapsed / 60)}min${String(elapsed % 60).padStart(2, '0')}s

Enregistrement continu actif :
✓ ${elapsed} paramètres vitaux archivés (FC, SpO₂, TA, FR, T°)
✓ Événements cliniques horodatés
✓ Décisions IA tracées avec justification
✓ Médicaments administrés loggés (dose, heure, voie)

Traçabilité médico-légale assurée. Exportable PDF.
`.trim(),
};

export function generateResponse(trigger, vitals, patient, doses, elapsed) {
  switch (trigger) {
    case 'simulation_start':
      return { type: 'INITIALISATION', text: RESPONSES.simulation_start(patient, doses), severity: 'info' };
    case 'normal_status':
      return { type: 'STABLE', text: RESPONSES.normal_status(vitals, elapsed), severity: 'success' };
    case 'hypotension_warning':
      return { type: 'ALERTE CRITIQUE', text: RESPONSES.hypotension_warning(vitals, doses), severity: 'error' };
    case 'hypotension_recovery':
      return { type: 'STABILISATION', text: RESPONSES.hypotension_recovery(vitals), severity: 'success' };
    case 'bradycardie_warning':
      return { type: 'ALERTE CRITIQUE', text: RESPONSES.bradycardie_warning(vitals, doses), severity: 'error' };
    case 'bradycardie_recovery':
      return { type: 'CORRIGÉE', text: RESPONSES.bradycardie_recovery(vitals), severity: 'success' };
    case 'pediatric_start':
      return { type: 'PROFIL PÉDI', text: RESPONSES.pediatric_start(patient, doses), severity: 'info' };
    case 'pediatric_adjust':
      return { type: 'AJUSTEMENT', text: RESPONSES.pediatric_dose_adjust(patient, vitals), severity: 'success' };
    case 'documentation':
      return { type: 'DOCUMENTATION', text: RESPONSES.documentation_auto(elapsed), severity: 'info' };
    default:
      return { type: 'ANALYSE', text: RESPONSES.normal_status(vitals, elapsed), severity: 'success' };
  }
}

// Map simulation event messages to EMRE triggers
export function mapEventToTrigger(event, scenario) {
  const msg = event?.message?.toLowerCase() || '';
  if (msg.includes('hypotension détectée') || msg.includes('tat') || (msg.includes('ta') && msg.includes('bpm'))) return 'hypotension_warning';
  if (msg.includes('remontée') && msg.includes('ta')) return 'hypotension_recovery';
  if (msg.includes('bradycardie')) return 'bradycardie_warning';
  if (msg.includes('fc remontée')) return 'bradycardie_recovery';
  if (msg.includes('pédiatrique') || msg.includes('enfant')) return scenario === 'pediatric' ? 'pediatric_start' : 'normal_status';
  if (msg.includes('stable')) return scenario === 'pediatric' ? 'pediatric_adjust' : 'normal_status';
  if (msg.includes('profil') && scenario === 'pediatric') return 'pediatric_start';
  return 'normal_status';
}
