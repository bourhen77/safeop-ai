import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import chatRouter from './routes/chat.js';
import preopRouter from './routes/preop.js';
import { generateVitals, getScenarioList } from './services/simulation.js';
import { calculateDoses, calculateDosesWithAdjustments } from './services/dosage.js';
import { generateResponse, mapEventToTrigger } from './services/expertSystem.js';
import { generateReport } from './services/reportGenerator.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: ['http://localhost:5173', 'http://localhost:5174'], methods: ['GET', 'POST'] },
});

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }));
app.use(express.json());
app.use('/api/chat', chatRouter);
app.use('/api/preop', preopRouter);
app.get('/api/scenarios', (_, res) => res.json(getScenarioList()));

app.post('/api/report', (req, res) => {
  const reportData = generateReport(req.body);
  res.json(reportData);
});

// Socket.io — real-time simulation with EMRE integration
io.on('connection', socket => {
  console.log('[WS] Client connected:', socket.id);
  let interval = null;
  let elapsed = 0;
  let currentScenario = 'normal';
  let sessionHistory = { events: [], vitalHistory: [], startTime: null, patient: null, doses: null };
  let lastCommentaryAt = -999;
  let medicationsGiven = new Set();

  socket.on('start_simulation', ({ scenario, customPatient }) => {
    currentScenario = scenario || 'normal';
    elapsed = 0;
    medicationsGiven = new Set();
    sessionHistory = { events: [], vitalHistory: [], startTime: new Date(), patient: null, doses: null };
    clearInterval(interval);

    // Get first vitals to determine patient (or use pre-op validated patient)
    const firstData = generateVitals(currentScenario, 0);
    const patient = customPatient || firstData.patient;
    const doses = customPatient && customPatient.adjustments?.length
      ? calculateDosesWithAdjustments(customPatient, customPatient.adjustments)
      : calculateDoses(patient);
    sessionHistory.patient = patient;
    sessionHistory.doses = doses;
    sessionHistory.scenario = currentScenario;

    // Emit dosage plan immediately
    socket.emit('dosage_plan', { doses, patient });

    // Emit EMRE start response after short delay
    setTimeout(() => {
      const trigger = currentScenario === 'pediatric' ? 'pediatric_start' : 'simulation_start';
      const commentary = generateResponse(trigger, firstData.vitals, patient, doses, 0);
      socket.emit('ai_commentary', commentary);
    }, 800);

    interval = setInterval(() => {
      elapsed++;
      const data = generateVitals(currentScenario, elapsed);
      sessionHistory.vitalHistory.push(data.vitals);

      // Periodically auto-document (every 30s)
      if (elapsed === 30 || elapsed === 60 || elapsed === 90) {
        const docResponse = generateResponse('documentation', data.vitals, patient, doses, elapsed);
        socket.emit('ai_commentary', docResponse);
        sessionHistory.events.push({ severity: 'info', message: `Documentation automatique — ${elapsed}s`, action: 'Paramètres archivés', ts: Date.now() });
      }

      // If there's a simulation event, generate EMRE commentary after 1.5s delay
      if (data.event) {
        const eventWithTs = { ...data.event, ts: Date.now() };
        sessionHistory.events.push(eventWithTs);
        socket.emit('vitals_update', { ...data, elapsed, event: eventWithTs });

        // Determine if medication was given
        const isMedEvent = data.event.message.toLowerCase().includes('éphédrine') ||
                           data.event.message.toLowerCase().includes('atropine') ||
                           data.event.message.toLowerCase().includes('activation');

        if (isMedEvent && data.event.severity === 'error') {
          const medName = data.event.message.toLowerCase().includes('éphédrine') ? 'ephedrine' : 'atropine';
          if (!medicationsGiven.has(medName)) {
            medicationsGiven.add(medName);
            setTimeout(() => {
              socket.emit('medication_given', { drug: medName, dose: doses[medName]?.dose, ts: Date.now() });
            }, 500);
          }
        }

        // EMRE commentary with 1.5s "thinking" delay
        setTimeout(() => {
          const trigger = mapEventToTrigger(data.event, currentScenario);
          const commentary = generateResponse(trigger, data.vitals, patient, doses, elapsed);
          socket.emit('ai_commentary', commentary);
          lastCommentaryAt = elapsed;
        }, 1500);

      } else {
        socket.emit('vitals_update', { ...data, elapsed, event: null });

        // Normal status commentary every 15s if no recent event
        if (elapsed % 15 === 0 && elapsed - lastCommentaryAt > 10) {
          const trigger = currentScenario === 'pediatric' && elapsed > 20 ? 'pediatric_adjust' : 'normal_status';
          const commentary = generateResponse(trigger, data.vitals, patient, doses, elapsed);
          socket.emit('ai_commentary', commentary);
          lastCommentaryAt = elapsed;
        }
      }
    }, 1000);

    socket.emit('simulation_started', { scenario: currentScenario });
  });

  socket.on('stop_simulation', () => {
    clearInterval(interval);
    const duration = elapsed;
    elapsed = 0;

    // Generate final report
    if (sessionHistory.patient) {
      const reportData = generateReport({
        ...sessionHistory,
        duration,
      });
      socket.emit('simulation_report', reportData);
    }
    socket.emit('simulation_stopped');
  });

  socket.on('disconnect', () => {
    clearInterval(interval);
    console.log('[WS] Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => console.log(`SafeOp AI backend running on http://localhost:${PORT}`));
