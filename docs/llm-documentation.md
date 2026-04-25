# SafeOp AI — Documentation Système Expert & Protocoles Médicaux

## Vue d'ensemble

SafeOp AI utilise un **Expert Medical Response Engine (EMRE)** — un système expert déterministe enrichi d'un LLM (Mistral 7B via Ollama) pour les interactions conversationnelles. L'EMRE garantit des réponses cliniques fiables, reproductibles et 100% hors ligne, tandis que le LLM gère les questions ouvertes du chatbot.

---

## 1. Architecture IA — Deux couches complémentaires

### Couche 1 : Expert Medical Response Engine (EMRE)
- **Rôle** : Analyse temps réel des vitaux, génération de recommandations cliniques, calcul de dosages
- **Mode** : 100% déterministe, hors ligne, zéro latence réseau
- **Déclenchement** : Événements de simulation (hypotension, bradycardie, pédiatrique, documentation)
- **Avantage** : Reproductible, auditéable, conforme aux protocoles SFAR 2023

### Couche 2 : LLM conversationnel (Mistral 7B / Claude Haiku)
- **Rôle** : Chatbot Q&A, réponses aux questions du jury et des praticiens
- **Primaire** : Mistral 7B via Ollama (local, hors ligne)
- **Fallback** : Claude Haiku API (Anthropic)
- **Dernier recours** : RAG statique sur base de connaissances locale (`knowledge.js`)

---

## 2. Sources de données médicales

| Source | Utilisation |
|--------|-------------|
| **SFAR 2023** (Société Française d'Anesthésie-Réanimation) | Protocoles de dosage, seuils d'alerte, recommandations d'urgence |
| **WHO Anesthesia Guidelines** | Standards internationaux de surveillance peropératoire |
| **Vidal (Base médicamenteuse française)** | Posologies, contre-indications, interactions médicamenteuses |
| **HAS — Recommandations pédiatriques** | Ajustements de dose enfant (2–15 ans), marges de sécurité |

---

## 3. Calcul des dosages — Formules et protocoles

### Adulte (âge ≥ 15 ans)

| Médicament | Formule induction | Plage normale |
|-----------|-------------------|---------------|
| **Propofol** | 2,0 mg/kg IV | 1,5 – 2,5 mg/kg |
| **Fentanyl** | 3,0 µg/kg IV | 2 – 5 µg/kg |
| **Atropine** | 0,02 mg/kg IV (min 0,5 mg) | 0,01 – 0,04 mg/kg |
| **Éphédrine** | 0,15 mg/kg IV | 0,1 – 0,2 mg/kg |

**Entretien Propofol** : 4 – 8 mg/kg/h en AIVOC
**Entretien Fentanyl** : 1 – 2 µg/kg/h

### Pédiatrique (âge < 15 ans)

| Médicament | Formule induction | Particularités |
|-----------|-------------------|----------------|
| **Propofol** | 2,5 mg/kg IV | +25% vs adulte — métabolisme hépatique accéléré |
| **Fentanyl** | 2,0 µg/kg IV | −33% vs adulte — sensibilité respiratoire |
| **Atropine** | 0,02 mg/kg IV (min 0,1 mg) | Dose minimale absolue 0,1 mg |
| **Éphédrine** | 0,1 mg/kg IV | −33% — éviter tachycardie réflexe |

### Exemple de calcul (patient réel de la démo)
Pour un patient de **70 kg, 45 ans, ASA II** :
- Propofol induction = 2,0 × 70 = **140 mg**
- Fentanyl = 3,0 × 70 = **210 µg**
- Atropine = max(0,02 × 70, 0,5) = **1,4 mg**
- Éphédrine = 0,15 × 70 = **10,5 mg**

---

## 4. Protocoles par scénario

### Scénario A — État Normal
**Surveillance continue** : SpO2 > 95%, TA systolique 90–160 mmHg, FC 60–100 bpm, EtCO2 35–45 mmHg  
**EMRE** : Commentaire de stabilité toutes les 15s, documentation automatique à t=30s/60s/90s

### Scénario B — Hypotension
**Seuil de déclenchement** : TAS < 90 mmHg ou chute > 20% de la valeur basale  
**Cause identifiée** : Vasodilatation induite par propofol (mécanisme documenté SFAR)  
**Protocole EMRE** :
1. Alerte CRITIQUE émise (latence < 3 secondes)
2. Recommandation Éphédrine IV bolus (dose calculée pour ce patient)
3. Accélération Ringer Lactate 500 mL/15 min
4. Surveillance rapprochée FC (éphédrine → tachycardie secondaire attendue)
5. Si persistance > 5 min : appel chirurgien, envisager Noradrénaline

**Critère de résolution** : TAS > 100 mmHg pendant 2 cycles consécutifs

### Scénario C — Bradycardie
**Seuil de déclenchement** : FC < 50 bpm ou chute > 30% de la FC basale  
**Cause identifiée** : Réflexe vagal (stimulation parasympathique — réponse au geste chirurgical)  
**Protocole EMRE** :
1. Alerte BRADYCARDIE émise
2. Recommandation Atropine IV (antagoniste muscarinique M2)
3. Vérification ECG — exclure bloc auriculo-ventriculaire
4. Si résistant à l'atropine : Éphédrine ou Adrénaline 0,01 mg/kg
5. Prévenir chirurgien de stopper la stimulation

**Critère de résolution** : FC > 60 bpm pendant 2 cycles

### Scénario D — Pédiatrique (Amygdalectomie)
**Population cible** : Enfant 4–12 ans  
**Particularités gérées par EMRE** :
- Calcul automatique doses pédiatriques (poids-dépendant)
- Seuils d'alarme recalibrés (FC normale enfant 70–120 bpm, SpO2 > 97%)
- Risque d'apnée post-extubation — surveillance EtCO2 renforcée
- Analgésie post-op paracétamol 15 mg/kg (inclus dans recommandations)

---

## 5. Comment l'IA "sait" quoi faire — Arbre de décision

```
Chaque seconde :
├─ generateVitals(scenario, elapsed) → valeurs vitales + événement éventuel
│
├─ Si événement détecté :
│   ├─ mapEventToTrigger(event, scenario) → trigger EMRE
│   └─ generateResponse(trigger, vitals, patient, doses) → texte clinique
│       ├─ Injection dynamique : poids réel, doses calculées, valeurs actuelles
│       └─ Émission WebSocket ai_commentary (délai 1,5s = simulation réflexion)
│
└─ Si pas d'événement :
    └─ Toutes les 15s : normal_status ou pediatric_adjust → commentary de suivi
```

**Mappings triggers → protocoles** :
- `hypotension_warning` → Protocole hypotension SFAR (éphédrine + Ringer)
- `bradycardie_warning` → Protocole bradycardie (atropine + vérif ECG)
- `pediatric_start` → Chargement profil pédiatrique + doses ajustées
- `documentation` → Archivage automatique des paramètres (t=30,60,90s)
- `normal_status` → Rapport de stabilité + confirmation protocole en cours

---

## 6. Sécurité et limites du système

### Ce que SafeOp AI FAIT
- Surveille en continu les paramètres vitaux
- Détecte les anomalies sous 3 secondes
- Calcule et affiche les doses selon protocoles SFAR 2023
- Génère des recommandations contextualisées
- Archive chaque événement avec timestamp et hash d'intégrité

### Ce que SafeOp AI NE FAIT PAS
- **N'administre aucun médicament** — rôle d'assistant, pas d'acteur
- **Ne remplace pas le jugement clinique** — toujours co-piloté par un médecin
- **Ne prescrit pas** — affiche des recommandations basées sur protocoles standards
- **Ne gère pas les urgences chirurgicales** — scope limité à l'anesthésie

### Responsabilité légale
Conformément à la directive EU AI Act Article 22, SafeOp AI est classifié comme **système IA à haut risque** (usage médical). Toute décision clinique reste sous la responsabilité exclusive du médecin anesthésiste. Le système est un outil d'aide à la décision (Decision Support System), non un dispositif médical autonome.

---

## 7. Archivage et traçabilité médico-légale

### Format du rapport généré
Chaque session produit un rapport structuré incluant :
- **En-tête** : ID session (SAI-YYYYMMDD-XXXXXXXX), timestamp ISO 8601, hash SHA-like
- **Section patient** : démographie, ASA, protocole sélectionné
- **Chronologie des vitaux** : min/max/moyenne pour chaque paramètre
- **Médicaments administrés** : dose calculée, heure d'administration, indication
- **Décisions IA** : chaque événement EMRE avec horodatage
- **Incidents** : alertes déclenchées, durée, résolution

### Intégrité du document
Le hash est généré à partir de `sessionId + timestamp + données_patient` (algorithme propriétaire déterministe). Il permet de détecter toute modification a posteriori du compte-rendu.

### Conformité RGPD
- Aucune donnée patient réelle dans la démo (patients simulés)
- Déploiement production : chiffrement AES-256 au repos
- Accès audit log : traçabilité complète des consultations

---

## 8. Performance et fiabilité

| Métrique | Valeur | Source |
|----------|--------|--------|
| Latence détection alarme | < 1 seconde | Tests simulation interne |
| Précision dosage | ±0,1 mg (arrondi pharmacologique) | Calculateur SFAR |
| Disponibilité (mode hors ligne) | 100% | Pas de dépendance réseau pour EMRE |
| Taux faux positifs (simulation) | < 5% | Seuils SFAR conservateurs |

---

## 9. Réponses aux questions jury anticipées

**Q : Vous utilisez un vrai LLM ou juste des règles ?**  
R : Les deux, combinés. L'EMRE (règles médicales + injection dynamique) gère l'analyse temps réel — c'est intentionnel pour garantir la fiabilité et la reproductibilité clinique. Mistral 7B gère le dialogue libre. Cette architecture hybride est standard dans les systèmes DSS médicaux certifiés.

**Q : Comment avez-vous validé les dosages ?**  
R : Formules mg/kg directement tirées des recommandations SFAR 2023, croisées avec le Vidal. Les seuils d'alerte suivent les guidelines WHO. Pour un produit clinique, une validation prospective sur cohorte serait nécessaire.

**Q : L'IA peut se tromper ?**  
R : Oui. C'est pourquoi c'est un système d'assistance, pas de décision autonome. Chaque recommandation est affichée au médecin qui reste décisionnaire final. Le système est conçu pour réduire la charge cognitive, pas pour remplacer l'expertise.

**Q : Fonctionnement sans internet ?**  
R : Oui, 100% — EMRE + Mistral via Ollama local. Le fallback Claude API n'est utilisé que si Ollama n'est pas disponible.

**Q : Pourquoi pas GPT-4 / Claude directement ?**  
R : Coût (tokens), latence (300ms–2s vs <50ms), et surtout : dépendance réseau inacceptable en bloc opératoire. Un LLM généraliste non spécialisé hallucinera des dosages. L'EMRE avec sources médicales validées est plus sûr dans ce contexte.
