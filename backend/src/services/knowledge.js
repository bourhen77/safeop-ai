// RAG knowledge base — all SafeOp AI content, chunked for retrieval

export const KNOWLEDGE_CHUNKS = [
  {
    id: 'overview',
    keywords: ['safeop', 'système', 'présentation', 'intelligence artificielle', 'ia', 'qu est ce que', 'description'],
    content: `SafeOp AI est un système intelligent embarqué en salle d'opération, capable de collecter, analyser et interpréter en temps réel toutes les données du patient sous anesthésie, connecté à distance pour le médecin anesthésiste.

Le système connecte et analyse simultanément :
- Le monitoring du patient (tension artérielle, fréquence cardiaque, saturation en oxygène SpO2)
- Les paramètres du respirateur
- Les données du pousse-seringue électrique (PSE)

Toutes ces données sont croisées avec le dossier préopératoire pour produire des décisions adaptées à chaque patient individuellement.

SafeOp AI ne remplace pas le soignant. Il le décharge des tâches répétitives, l'alerte au bon moment et lui donne les outils pour décider mieux et plus vite.`,
  },
  {
    id: 'problem',
    keywords: ['problème', 'migration', 'pénurie', 'allemagne', 'infirmiers', 'techniciens', 'contexte', 'tunisie', 'challenge'],
    content: `Problématique — Un système de santé fragilisé :

La Tunisie fait face à une migration massive de ses infirmiers et techniciens en anesthésie vers l'Allemagne, créant un vide difficile à combler.

Conséquences directes :
- Un anesthésiste se retrouve seul à gérer : surveillance, documentation et décisions cliniques en simultané
- La documentation des paramètres vitaux toutes les 10 minutes distrait l'anesthésiste au mauvais moment
- Le risque d'erreur humaine augmente proportionnellement avec la charge de travail
- Un technicien ne peut surveiller qu'une seule salle à la fois

Face à cette réalité, l'IA n'est plus un luxe — c'est une nécessité médicale.`,
  },
  {
    id: 'preoperative',
    keywords: ['préopératoire', 'consultation', 'dossier', 'avant', 'saisie', 'antécédents', 'protocole', 'préparation'],
    content: `Phase Préopératoire — Poser les bases :

Dès la première consultation, le médecin anesthésiste saisit dans le système un dossier complet du patient qui devient le socle de toutes les décisions de l'IA le jour J.

Données collectées :
- Âge, poids, taille et antécédents médicaux
- Allergies médicamenteuses connues
- Traitements en cours et bilans biologiques
- Complications potentielles identifiées
- Protocole d'anesthésie prévu

Ce dossier permet à l'IA de personnaliser entièrement sa surveillance et ses décisions sans repartir de zéro lors de chaque intervention.`,
  },
  {
    id: 'intraoperative',
    keywords: ['peropératoire', 'pendant', 'opération', 'surveillance', 'temps réel', 'paramètres', 'documentation', 'automatique', 'enregistrement'],
    content: `Phase Peropératoire — Surveiller, documenter, agir :

SafeOp AI décharge l'anesthésiste des tâches répétitives pour qu'il se concentre sur son rôle médical.

Ce que le système fait automatiquement :
- Enregistrement continu de tous les paramètres vitaux (toutes les secondes, pas toutes les 10 minutes)
- Détection précoce de toute anomalie par analyse des tendances
- Croisement des données en temps réel avec le dossier préopératoire
- Aide à la décision clinique immédiate et contextualisée
- Documentation automatique qui libère l'anesthésiste

L'anesthésiste est ainsi libéré des tâches répétitives et peut se concentrer pleinement sur l'acte médical.`,
  },
  {
    id: 'decisions',
    keywords: ['décision', 'ia décide', 'alerte', 'hypotension', 'bradycardie', 'urgence', 'grave', 'non critique', 'automatique', 'réaction', 'réponse'],
    content: `Intelligence Décisionnelle — L'IA qui réagit selon la gravité :

Situations NON CRITIQUES — l'IA agit seule :
- Ajustement automatique des doses selon la durée de l'intervention
- Si hypotension détectée : activation automatique du médicament hypertenseur via pousse-seringue électrique
- Adaptation continue des débits selon les réactions physiologiques du patient

Situations GRAVES — l'IA alerte et guide :
- Alerte sonore et visuelle immédiate en salle
- Message vocal dictant les conduites à tenir au technicien
- Notification simultanée envoyée au médecin à distance (sur smartphone/tablette)
- Protocoles d'urgence affichés étape par étape

Le technicien en anesthésie n'a qu'à préparer les seringues, les brancher, et surveiller plusieurs patients bien stabilisés par l'IA.`,
  },
  {
    id: 'pediatric',
    keywords: ['pédiatrique', 'enfant', 'poids', 'âge', 'dosage', 'erreur', 'dose', 'pédiatrie', 'bébé', 'calcul'],
    content: `Chirurgie Pédiatrique — Une précision absolue pour les plus vulnérables :

En pédiatrie, une erreur de dosage peut être irréversible. SafeOp AI calcule automatiquement les doses selon le poids exact et l'âge de l'enfant, éliminant tout risque d'erreur manuelle.

Fonctionnalités pédiatriques :
- Calcul automatique de toutes les doses selon le poids (mg/kg) et l'âge
- Adaptation continue des doses selon les réactions physiologiques de l'enfant
- Le technicien prépare et branche les seringues — l'IA gère les débits
- Plusieurs enfants peuvent être surveillés simultanément par un seul technicien
- Alertes spécifiques aux valeurs normales pédiatriques (différentes de l'adulte)`,
  },
  {
    id: 'postoperative',
    keywords: ['postopératoire', 'réveil', 'après', 'complications', 'douleur', 'salle de réveil', 'compte rendu', 'archivage'],
    content: `Phase Post-Opératoire — Ne pas lâcher le patient :

La phase post-opératoire reste critique. SafeOp AI assure une continuité de surveillance en salle de réveil.

Fonctionnalités post-opératoires :
- Détection précoce des complications post-anesthésiques
- Suivi de la douleur avec alertes si les seuils sont dépassés
- Transmission en temps réel au médecin à distance
- Génération automatique du compte-rendu d'anesthésie
- Archivage sécurisé à des fins médico-légales`,
  },
  {
    id: 'objectives',
    keywords: ['objectifs', 'avantages', 'bénéfices', 'raisons', 'pourquoi', 'utiliser', 'apporte', 'gains', 'amélioration'],
    content: `8 Objectifs Concrets de SafeOp AI :

1. Suivi à distance — Le médecin anesthésiste peut suivre le patient depuis n'importe où (consultation, télétravail)
2. Surveillance multi-salles — Un technicien peut surveiller plusieurs salles opératoires simultanément
3. Réduction du risque infectieux — Moins de va-et-vient en salle d'opération
4. Gain de temps considérable — Documentation automatique libère l'équipe médicale
5. Traçabilité totale — Surveillance continue et précise de chaque paramètre et décision
6. Réduction du gaspillage — Dosage précis des médicaments, zéro surdosage
7. Réponse d'urgence rapide — Détection et réponse aux urgences en quelques secondes
8. Archivage médico-légal — Enregistrement complet et sécurisé pour la traçabilité juridique`,
  },
  {
    id: 'technical',
    keywords: ['technique', 'technologie', 'comment fonctionne', 'architecture', 'capteurs', 'connexion', 'réseau', 'intégration', 'materiel'],
    content: `Architecture Technique de SafeOp AI :

Composants matériels connectés :
- Moniteur multiparamétrique (ECG, SpO2, NIBP, température)
- Respirateur/ventilateur anesthésique
- Pousse-seringue électrique (PSE) programmable
- Tablette/terminal médecin pour accès à distance

Stack logicielle :
- Interface salle d'opération : React.js avec tableau de bord temps réel
- Backend API : Node.js + Express avec WebSocket (Socket.io)
- LLM embarqué : Mistral 7B via Ollama (fonctionne 100% hors ligne)
- Protocoles de communication : HL7/FHIR pour interopérabilité HIS
- Stockage : Base de données chiffrée AES-256

Sécurité et conformité :
- Données patient chiffrées de bout en bout
- Conformité ISO 13485 (dispositifs médicaux)
- Logs d'audit complets pour traçabilité médico-légale`,
  },
  {
    id: 'team_competition',
    keywords: ['équipe', 'esprim', 'compétition', 'concours', 'projet', 'université', 'étudiant', '2026'],
    content: `SafeOp AI — Projet ESPRIM 2026 :

Projet développé dans le cadre de la compétition ESPRIM 2026, catégorie "AI for Health".

Objectif du prototype : Démontrer la faisabilité technique et la valeur clinique d'un système d'aide à l'anesthésie basé sur l'IA embarquée.

Stade actuel : Prototype fonctionnel avec simulation de scénarios cliniques réels, chatbot RAG pour répondre aux questions médicales/techniques, interface temps réel.

Prochaines étapes : Tests en environnement clinique simulé, validation par des anesthésistes, intégration avec équipements médicaux réels (protocoles HL7).`,
  },
];

export function findRelevantContext(question) {
  const q = question.toLowerCase();
  const scored = KNOWLEDGE_CHUNKS.map(chunk => {
    const score = chunk.keywords.reduce((acc, kw) => acc + (q.includes(kw) ? 1 : 0), 0);
    return { ...chunk, score };
  });
  const top = scored
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (top.length === 0) {
    return scored.find(c => c.id === 'overview')?.content || '';
  }
  return top.map(c => `[${c.id.toUpperCase()}]\n${c.content}`).join('\n\n---\n\n');
}
