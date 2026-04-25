import { Router } from 'express';
import { parsePatientReport } from '../services/reportParser.js';
import { calculateDosesWithAdjustments, calculateDoses } from '../services/dosage.js';

const router = Router();

router.post('/analyze', async (req, res) => {
  const { reportText } = req.body;
  if (!reportText?.trim()) return res.status(400).json({ error: 'Rapport requis' });

  try {
    const patient = await parsePatientReport(reportText);
    const doses = calculateDosesWithAdjustments(patient, patient.adjustments || []);
    res.json({ patient, doses });
  } catch (err) {
    console.error('[preop]', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
