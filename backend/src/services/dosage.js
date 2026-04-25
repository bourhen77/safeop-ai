// SFAR 2023 — Protocoles de dosage anesthésique (mg/kg)

const PROTOCOLS = {
  adult: {
    propofol:  { induction: 2.0,   maintenance_min: 4, maintenance_max: 10, unit: 'mg/kg', maintenance_unit: 'mg/kg/h' },
    fentanyl:  { induction: 3.0,   maintenance_min: 1, maintenance_max: 3,  unit: 'µg/kg', maintenance_unit: 'µg/kg/h' },
    atropine:  { dose: 0.02,       max_total: 3.0,     min_dose: 0.5,       unit: 'mg/kg' },
    ephedrine: { dose: 0.15,       max_total: 30,      unit: 'mg/kg' },
  },
  pediatric: {
    propofol:  { induction: 2.5,   maintenance_min: 6, maintenance_max: 12, unit: 'mg/kg', maintenance_unit: 'mg/kg/h' },
    fentanyl:  { induction: 2.0,   maintenance_min: 1, maintenance_max: 2,  unit: 'µg/kg', maintenance_unit: 'µg/kg/h' },
    atropine:  { dose: 0.02,       max_total: 1.0,     min_dose: 0.1,       unit: 'mg/kg' },
    ephedrine: { dose: 0.1,        max_total: 10,      unit: 'mg/kg' },
  },
};

export function calculateDosesWithAdjustments(patient, adjustments = []) {
  const base = calculateDoses(patient);
  if (!adjustments || adjustments.length === 0) return { ...base, adjustments: [], adjustmentSummary: [] };

  let propFactor = 1.0;
  let fentFactor = 1.0;
  let ephFactor = 1.0;

  for (const adj of adjustments) {
    propFactor += (adj.propofol || 0);
    fentFactor += (adj.fentanyl || 0);
    ephFactor  += (adj.ephedrine || 0);
  }

  propFactor = Math.max(0.50, propFactor);
  fentFactor = Math.max(0.50, fentFactor);
  ephFactor  = Math.max(0.60, ephFactor);

  const p = patient.isPediatric ? PROTOCOLS.pediatric : PROTOCOLS.adult;
  const w = patient.weight;

  const propInd = parseFloat((p.propofol.induction * w * propFactor).toFixed(1));
  const fentInd = parseFloat((p.fentanyl.induction * w * fentFactor).toFixed(1));
  const ephDose = parseFloat((p.ephedrine.dose * w * ephFactor).toFixed(1));

  const summary = adjustments
    .filter(a => a.propofol || a.fentanyl || a.ephedrine || a.note)
    .map(a => ({
      reason: a.reason,
      severity: a.severity,
      details: [
        a.propofol ? `Propofol ${Math.round(a.propofol * 100)}%` : null,
        a.fentanyl ? `Fentanyl ${Math.round(a.fentanyl * 100)}%` : null,
        a.ephedrine ? `Éphédrine ${Math.round(a.ephedrine * 100)}%` : null,
        a.note ? a.note : null,
      ].filter(Boolean).join(' · '),
    }));

  return {
    ...base,
    propofol: {
      ...base.propofol,
      induction: propInd,
      formula: `${p.propofol.induction} mg/kg × ${w}kg × ${(propFactor * 100).toFixed(0)}%`,
      adjusted: propFactor < 1.0,
      baseInduction: base.propofol.induction,
    },
    fentanyl: {
      ...base.fentanyl,
      induction: fentInd,
      formula: `${p.fentanyl.induction} µg/kg × ${w}kg × ${(fentFactor * 100).toFixed(0)}%`,
      adjusted: fentFactor < 1.0,
      baseInduction: base.fentanyl.induction,
    },
    ephedrine: {
      ...base.ephedrine,
      dose: ephDose,
      formula: `${p.ephedrine.dose} mg/kg × ${w}kg × ${(ephFactor * 100).toFixed(0)}%`,
      adjusted: ephFactor < 1.0,
      baseDose: base.ephedrine.dose,
    },
    adjustments,
    adjustmentSummary: summary,
  };
}

export function calculateDoses(patient) {
  const { weight, age } = patient;
  const isPediatric = age < 15;
  const p = isPediatric ? PROTOCOLS.pediatric : PROTOCOLS.adult;
  const w = weight;

  const propofol_induction = parseFloat((p.propofol.induction * w).toFixed(1));
  const propofol_maintenance_min = parseFloat((p.propofol.maintenance_min * w).toFixed(1));
  const propofol_maintenance_max = parseFloat((p.propofol.maintenance_max * w).toFixed(1));

  const fentanyl_induction = parseFloat((p.fentanyl.induction * w).toFixed(1));
  const fentanyl_maintenance_min = parseFloat((p.fentanyl.maintenance_min * w).toFixed(1));
  const fentanyl_maintenance_max = parseFloat((p.fentanyl.maintenance_max * w).toFixed(1));

  const atropine_dose = Math.max(
    p.atropine.min_dose,
    parseFloat((p.atropine.dose * w).toFixed(2))
  );

  const ephedrine_dose = parseFloat((p.ephedrine.dose * w).toFixed(1));

  return {
    isPediatric,
    weight: w,
    age,
    propofol: {
      label: 'Propofol',
      induction: propofol_induction,
      maintenance: `${propofol_maintenance_min}–${propofol_maintenance_max}`,
      unit_induction: 'mg IV bolus',
      unit_maintenance: 'mg/h (PSE)',
      formula: `${p.propofol.induction} mg/kg × ${w}kg`,
      concentration: '10 mg/mL',
      source: 'SFAR 2023 §3.1',
    },
    fentanyl: {
      label: 'Fentanyl',
      induction: fentanyl_induction,
      maintenance: `${fentanyl_maintenance_min}–${fentanyl_maintenance_max}`,
      unit_induction: 'µg IV bolus',
      unit_maintenance: 'µg/h (PSE)',
      formula: `${p.fentanyl.induction} µg/kg × ${w}kg`,
      concentration: '50 µg/mL',
      source: 'SFAR 2023 §4.2',
    },
    atropine: {
      label: 'Atropine',
      dose: atropine_dose,
      unit: 'mg IV bolus',
      formula: `max(${p.atropine.min_dose}mg, ${p.atropine.dose} mg/kg × ${w}kg)`,
      indication: 'FC < 50 bpm',
      max_total: p.atropine.max_total,
      source: 'SFAR 2023 §6.1',
    },
    ephedrine: {
      label: 'Éphédrine',
      dose: ephedrine_dose,
      unit: 'mg IV bolus',
      formula: `${p.ephedrine.dose} mg/kg × ${w}kg`,
      indication: 'TAS < 90 mmHg',
      max_total: p.ephedrine.max_total,
      source: 'SFAR 2023 §5.3',
    },
  };
}
