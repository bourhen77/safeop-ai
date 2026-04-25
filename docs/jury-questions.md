# SafeOp AI — Réponses aux questions jury ESPRIM 2026

## QUESTIONS TECHNIQUES

### Q1 : Quel modèle d'IA utilisez-vous et pourquoi ?
**Réponse** : Nous utilisons **Mistral 7B** via Ollama, un modèle de langue "small" (sLLM) open-source qui fonctionne entièrement en local, sans connexion internet. Ce choix est délibéré pour trois raisons : (1) confidentialité totale des données patients, (2) fonctionnement autonome en salle d'opération même sans réseau, (3) coût d'exploitation nul. Pour les décisions cliniques temps réel (hypotension, bradycardie), nous utilisons une **couche de règles médicales déterministes** — l'IA générative intervient uniquement pour la documentation, l'explication et le Q&A.

### Q2 : Comment le système détecte-t-il une hypotension ?
**Réponse** : En temps réel, le système mesure la tension artérielle systolique (TAS) toutes les secondes via le monitoring connecté. Si TAS < 90 mmHg pendant 2 lectures consécutives, le moteur de règles déclenche automatiquement : alerte niveau Jaune + ajustement du débit du PSE. Si TAS < 80 mmHg, passage en niveau Rouge : alerte sonore, message vocal au technicien, notification au médecin à distance. Tout est configurable selon le protocole d'anesthésie du patient.

### Q3 : Quelle est la latence du système ?
**Réponse** : La latence de bout en bout est inférieure à **500ms** pour la détection d'anomalie et le déclenchement de l'alerte. La communication patient-serveur utilise WebSocket (Socket.io) avec mise à jour toutes les **1 seconde**. Le modèle Mistral tourne localement et répond en 1-3 secondes pour le chatbot Q&A. La couche de décision clinique est purement synchrone et réagit en < 100ms.

### Q4 : Comment sont sécurisées les données patients ?
**Réponse** : (1) **Tout est local** — aucune donnée ne quitte l'hôpital. (2) Base de données chiffrée **AES-256**. (3) Authentification par token JWT avec expiration. (4) Logs d'audit complets (qui a accédé à quoi, quand). (5) Conformité aux standards médicaux **ISO 13485** et réglementations tunisiennes. Le modèle LLM tourne sur le serveur interne de l'hôpital — aucune API cloud n'est requise.

### Q5 : Peut-il s'intégrer avec les systèmes hospitaliers existants ?
**Réponse** : Oui. L'architecture utilise des API REST standardisées et est conçue pour supporter le protocole **HL7/FHIR** — le standard international pour l'interopérabilité des systèmes de santé. Cela permet l'intégration avec les HIS (Hospital Information Systems), les dossiers patients électroniques, et les équipements médicaux compatibles. Dans cette version prototype, nous simulons les données pour la démo.

### Q6 : Que se passe-t-il si internet tombe ?
**Réponse** : Le système fonctionne **100% hors ligne**. Ollama/Mistral tourne sur le serveur local de l'hôpital. Le monitoring temps réel via Socket.io est en réseau local. La notification au médecin à distance bascule sur le réseau interne (Wi-Fi hospitalier) ou SMS comme fallback. Pas de dépendance cloud.

### Q7 : Comment avez-vous validé les seuils d'alerte médicaux ?
**Réponse** : Les seuils utilisés (FC < 50 bpm = bradycardie, TAS < 90 = hypotension, SpO2 < 95 = désaturation) sont des valeurs standard issues des **recommandations SFAR** (Société Française d'Anesthésie-Réanimation) et des guidelines ASA (American Society of Anesthesiologists). Dans le cadre du passage en production, ces paramètres seraient ajustés et validés avec des anesthésistes référents.

---

## QUESTIONS MÉDICALES / ÉTHIQUES

### Q8 : SafeOp AI remplace-t-il l'anesthésiste ?
**Réponse** : **Non.** C'est fondamental dans notre philosophie. SafeOp AI est un outil d'**aide à la décision**, pas un remplaçant. L'anesthésiste reste le décideur final et responsable légal. L'IA prend en charge les tâches répétitives (documentation, monitoring continu, ajustements mineurs de débit) pour permettre au médecin de se concentrer sur son expertise médicale. En situation grave, l'IA alerte et guide — mais la décision médicale appartient toujours à l'humain.

### Q9 : Qui est responsable si l'IA fait une erreur ?
**Réponse** : La **responsabilité reste entièrement médicale**. Le système ne prend aucune décision irreversible de manière autonome sans validation humaine. Les ajustements automatiques (ex: débit PSE) sont des micro-ajustements paramétrés dans des plages validées au préalable par le médecin. Le système génère un log d'audit complet de chaque action pour la traçabilité médico-légale. Légalement, le fabricant du dispositif médical (nous) assume la responsabilité du fonctionnement technique correct du matériel.

### Q10 : Comment gérez-vous les interactions médicamenteuses rares ?
**Réponse** : Dans la version actuelle du prototype, nous gérons les interactions via la base de connaissances du dossier préopératoire (allergies, traitements en cours). Pour une version de production, nous intégrerions une base de données pharmacologique certifiée (ex: Vidal, Theriaque) consultée en temps réel. C'est une fonctionnalité prévue en V2.

### Q11 : A-t-il été testé sur de vrais patients ?
**Réponse** : Ce prototype est en phase de **démonstration technique** (TRL 4-5). La prochaine étape est un test en environnement clinique simulé avec mannequins haute-fidélité dans un centre de simulation médicale, puis une étude observationnelle en bloc opératoire réel avec validation éthique (CLER). La validation clinique formelle nécessite 12-18 mois minimum avant déploiement.

---

## QUESTIONS BUSINESS / STRATÉGIE

### Q12 : Quel est votre marché cible ?
**Réponse** : Marché primaire : les **hôpitaux publics tunisiens** (24 CHU régionaux, ~150 hôpitaux de district) confrontés à la pénurie de techniciens en anesthésie. Marché secondaire : les cliniques privées tunisiennes et le marché africain (Maroc, Algérie, Sénégal) avec des problématiques similaires. Marché tertiaire à moyen terme : pays à faibles ressources humaines médicales (partenariat NGO, OMS).

### Q13 : Quel est votre modèle économique ?
**Réponse** : Modèle SaaS médical hybride : (1) **Licence annuelle** par bloc opératoire (abonnement), (2) Installation matérielle one-shot (serveur local, intégration équipements), (3) Formation du personnel incluse, (4) Maintenance et mises à jour garanties. Prix cible : 5,000-15,000 DT/an par bloc selon la taille de l'établissement — soit 10x moins qu'un technicien en anesthésie.

### Q14 : Qui sont vos concurrents ?
**Réponse** : À l'échelle internationale : GE Healthcare, Dräger, Philips proposent des systèmes de monitoring avancés mais sans IA décisionnelle embarquée et à des coûts prohibitifs (100,000+ €). À notre connaissance, il n'existe pas de solution équivalente combinant IA locale open-source + aide à la décision anesthésique + accessibilité pour les pays en voie de développement. Notre avantage : **prix accessible + 100% offline + open-source**.

### Q15 : Quelle est votre prochaine étape après ESPRIM 2026 ?
**Réponse** : (1) Validation technique avec des anesthésistes du CHU de Sfax (contact établi), (2) Dépôt de brevet pour le moteur de décision clinique, (3) Candidature à des financements (INNORPI, OMS, appels à projets UE med-tech), (4) Pilote en simulation médicale haute-fidélité, (5) Constitution d'une startup med-tech tunisienne.

---

## QUESTIONS DE FOND (JURY EXIGEANT)

### Q16 : Votre IA est-elle certifiée comme dispositif médical ?
**Réponse** : Non, ce prototype n'est pas encore certifié. La certification comme dispositif médical de classe IIb (CE en Europe, équivalent DMSST en Tunisie) nécessite des essais cliniques formels, une documentation technique exhaustive (IEC 62304, IEC 82304), et un processus de 2-3 ans minimum. Nous avons conscience de ce chemin et c'est précisément pourquoi nous sommes à ESPRIM : pour valider le concept avant d'engager ce processus coûteux.

### Q17 : Pourquoi un LLM pour la documentation médicale ? N'est-ce pas dangereux ?
**Réponse** : Excellente question. Nous distinguons deux couches : (1) **Couche de décision clinique** — 100% déterministe, règles médicales validées, aucun LLM impliqué dans les décisions critiques, (2) **Couche LLM** — utilisée uniquement pour la génération de texte (compte-rendus, explication des décisions au personnel, Q&A). Le LLM ne prescrit pas, ne décide pas. Il structure et communique. C'est la même logique qu'un médecin qui utilise un dictaphone IA — l'expert reste l'humain.

### Q18 : Comment assurez-vous la fiabilité du modèle Mistral dans un contexte médical ?
**Réponse** : Nous utilisons une approche **RAG (Retrieval-Augmented Generation)** : le modèle ne génère pas de réponses à partir de sa mémoire générale, il est contraint à utiliser notre base de connaissances médicales validée. La réponse est toujours ancrée dans des documents sources vérifiés. De plus, toutes les sorties LLM sont étiquetées "aide à la décision" et jamais présentées comme des prescriptions médicales fermes.
