/**
 * AI Knowledge Agent & Reasoning Engine for TADIA FONGE EMEKSON's Portfolio
 * Provides intelligent, contextual, multi-lingual (EN/FR) conversational answers
 * grounded in comprehensive portfolio facts, technical architectures, and AI creation achievements.
 */

export function detectLanguage(text, defaultLang = 'en') {
  const lower = text.toLowerCase()
  const frKeywords = [
    'bonjour', 'salut', 'merci', 'projet', 'projets', 'qui', 'est-ce', 'comment', 'pourquoi',
    'stage', 'stages', 'diplome', 'diplôme', 'etude', 'étude', 'competence', 'compétence',
    'embaucher', 'recruter', 'disponible', 'disponibilite', 'disponibilité', 'travail',
    'experience', 'expérience', 'langue', 'langues', 'contact', 'telecharger', 'télécharger',
    'parle', 'explique', 'quel', 'quels', 'quelle', 'quelles', 'est', 'sont', 'avec', 'ia', 'création'
  ]
  const matchFr = frKeywords.some(kw => lower.includes(kw))
  if (matchFr) return 'fr'
  
  const enKeywords = [
    'hello', 'hi', 'hey', 'thanks', 'thank', 'project', 'projects', 'who', 'how', 'why',
    'internship', 'internships', 'degree', 'study', 'education', 'skill', 'skills',
    'hire', 'hiring', 'available', 'availability', 'work', 'experience', 'language', 'languages',
    'reach', 'download', 'tell', 'explain', 'what', 'which', 'where', 'with', 'ai', 'creation'
  ]
  const matchEn = enKeywords.some(kw => lower.includes(kw))
  if (matchEn) return 'en'

  return defaultLang
}

export function queryAIAgent(userQuery, portfolioData, currentLang = 'en') {
  const rawText = (userQuery || '').trim()
  if (!rawText) return null

  const query = rawText.toLowerCase()
  const detectedLang = detectLanguage(query, currentLang)
  const isFR = detectedLang === 'fr'
  const data = portfolioData[detectedLang] || portfolioData[currentLang] || portfolioData.en

  // Helper for contact strings
  const email = data?.contact?.email || 'tadiaemekson@gmail.com'
  const phones = data?.contact?.phones || ['+237 655 648 766', '+237 674 725 952']
  const whatsappUrl = data?.contact?.whatsapp || 'https://wa.me/237655648766'
  const name = data?.profile?.name || 'TADIA FONGE EMEKSON'

  // --- Intent 1: Greetings & Identity ---
  if (/^(hi|hello|hey|greetings|good\s*(morning|afternoon|evening)|yo|salut|bonjour|bonsoir|coucou|hola)\b/i.test(query) || query === 'hi' || query === 'hello' || query === 'bonjour') {
    if (isFR) {
      return {
        text: `Bonjour ! 👋 Je suis l'assistant IA intelligent de **${name}**.\n\nJe peux vous renseigner en détail sur :\n• Ses **créations en IA & Agents conversationnels** (Architecture NLP, Graphes de connaissances)\n• Ses **projets d'ingénierie logicielle** (SaaS Fintech, Santé Offline-First, Full-Stack)\n• Ses **compétences techniques** (React 19, Laravel 12, Node.js, SQL, TypeScript)\n• Ses **stages & expériences** (IFP PRONOTE, KIAMA, SIGERIS)\n• Ses **disponibilités pour recrutement ou collaboration**\n\nQue souhaitez-vous découvrir ?`,
        suggestions: [
          '🤖 Parle-moi de tes créations en IA',
          '🚀 Voir les projets phares',
          '🛠️ Quelle est sa stack technique ?',
          '💼 Quelles sont ses expériences en entreprise ?'
        ]
      }
    }
    return {
      text: `Hello there! 👋 I am the official AI Assistant for **${name}**.\n\nI can provide in-depth information about:\n• His **AI Creations & Autonomous Agents** (NLP Architecture, Knowledge Graph Grounding)\n• His **full-stack engineering projects** (Fintech SaaS, Offline-First HealthTech)\n• His **technical arsenal** (React 19, Laravel 12, Node.js, SQL, TypeScript)\n• His **internships & experience** (IFP PRONOTE, KIAMA, SIGERIS)\n• His **availability for hiring, contracts, or collaborations**\n\nWhat would you like to explore?`,
      suggestions: [
        '🤖 Tell me about his AI creations',
        '🚀 Explore major projects',
        '🛠️ What is his full tech stack?',
        '💼 Industry experience & internships'
      ]
    }
  }

  // --- Intent 2: Gratitude & Politeness ---
  if (/thank|merci|grateful|appreciate|cool|super|awesome|great|parfait/i.test(query)) {
    if (isFR) {
      return {
        text: `C'est un grand plaisir ! 😊 N'hésitez pas si vous avez d'autres questions sur les créations d'IA d'Emekson ou si vous souhaitez le contacter directement.`,
        suggestions: [
          '📞 Comment le contacter ?',
          '🤖 Ses compétences en création d\'IA',
          '📄 Télécharger son CV'
        ]
      }
    }
    return {
      text: `You're very welcome! 😊 Feel free to ask anything else about Emekson's AI creations and full-stack engineering background.`,
      suggestions: [
        '📞 How to contact him?',
        '🤖 His AI Creation skillset',
        '📄 Download his Resume'
      ]
    }
  }

  // --- Intent 3: Farewell / Exit ---
  if (/bye|goodbye|au revoir|a\+|ciao|see you|close|quitter|fermer/i.test(query)) {
    if (isFR) {
      return {
        text: `Au revoir et merci de votre visite ! 🌟 Le chat se fermera dans quelques secondes. N'hésitez pas à me rouvrir quand vous le souhaitez.`,
        shouldClose: true,
        suggestions: []
      }
    }
    return {
      text: `Goodbye and thank you for exploring Emekson's portfolio! 🌟 This chat will close shortly. Feel free to open it anytime.`,
      shouldClose: true,
      suggestions: []
    }
  }

  // --- Intent 4: AI Creation & Engineering Deep Dive (Lecturer's Priority) ---
  if (/ai\s*creation|création.*ia|creation.*ia|agent.*ia|intelligence.*artificielle|nlp|prompt.*engineering|llm|rag|comment.*cree.*ia|how.*ai.*built|generative\s*ai|ia.*generative/i.test(query)) {
    if (isFR) {
      return {
        text: `**Création d'IA & Ingénierie des Systèmes Intelligents par ${name}** 🤖🧠\n\nEmekson conçoit et intègre des solutions d'IA modernes au cœur de ses applications full-stack :\n\n1. **EMEKSON AI — Agent de Raisonnement Autonome (Ce Chatbot) :**\n   • Développé sur-mesure avec une architecture **NLP multi-intentions** côté client.\n   • Ancré dans un **graphe de connaissances** contextuel pour éliminer les hallucinations et garantir des réponses précises.\n   • Génération dynamique de suggestions de questions (chips) et rendu markdown temps-réel.\n\n2. **Aide à la Décision Clinique Algorithmique (PartoCare) :**\n   • Moteur d'analyse en temps réel des constantes du partogramme obstétrical.\n   • Détection prédictive automatisée des anomalies obstétricales (souffrance fœtale, pré-éclampsie) avec alertes visuelles standardisées.\n\n3. **Compétences en Ingénierie LLM :**\n   • **Prompt Engineering** avancé, orchestration d'APIs LLM (Claude AI, OpenAI), intégration de workflows **Cursor AI** et concepts **RAG** (Retrieval-Augmented Generation).`,
        suggestions: [
          '🏥 Découvrir le projet PartoCare',
          '💱 Découvrir ExchangeCompare Africa',
          '🛠️ Voir toutes les compétences techniques',
          '📞 Contacter Emekson'
        ]
      }
    }
    return {
      text: `**AI Creation & Intelligent Systems Engineering by ${name}** 🤖🧠\n\nEmekson actively creates and integrates modern AI architectures into his software solutions:\n\n1. **EMEKSON AI — Autonomous Conversational Reasoning Agent (This Assistant):**\n   • Built from scratch with a client-side **multi-intent NLP classification engine**.\n   • Grounded in a comprehensive **contextual knowledge graph** to deliver zero-latency, hallucination-free answers.\n   • Dynamic contextual suggestion generation and streaming markdown formatting.\n\n2. **Clinical Decision Support Intelligence (PartoCare):**\n   • Real-time algorithmic diagnostic engine monitoring labor curves.\n   • Automated early-warning triggers for obstetric complications (fetal distress, pre-eclampsia) with emergency referral workflows.\n\n3. **LLM & AI Creation Skillset:**\n   • Advanced **Prompt Engineering**, LLM API orchestration (Claude AI, OpenAI), **Cursor AI** acceleration, and **RAG** (Retrieval-Augmented Generation) patterns.`,
      suggestions: [
        '🏥 Explore PartoCare clinical engine',
        '💱 Explore ExchangeCompare Africa',
        '🛠️ Full technical skills arsenal',
        '📞 Contact Emekson'
      ]
    }
  }

  // --- Intent 5: Specific Project Deep Dives ---
  // A) ExchangeCompare Africa
  if (/exchange|compare|crypto|taux|monnaie|forex|fintech/i.test(query)) {
    if (isFR) {
      return {
        text: `**ExchangeCompare Africa** 💱\n\nIl s'agit d'une plateforme SaaS moderne conçue pour comparer en temps réel les taux de change et les frais de transfert d'argent à travers l'Afrique.\n\n• **Fonctionnalités clés :** Comparateur multi-canaux (Banques comme Ecobank/UBA, Fintechs comme Wise/WorldRemit, Crypto comme Binance), alertes de taux personnalisées, système d'abonnements SaaS et tableaux de bord dédiés.\n• **Stack Technique :** Laravel 12, React, TypeScript, Tailwind CSS, ShadCN UI, MySQL & Architecture API-First.\n• **Code Source :** Disponible sur GitHub.`,
        suggestions: [
          '🤖 Parle-moi de tes créations en IA',
          '🏥 Parle-moi du projet PartoCare',
          '🛠️ Quelles sont ses compétences en Laravel ?'
        ]
      }
    }
    return {
      text: `**ExchangeCompare Africa** 💱\n\nA full-featured SaaS platform built to compare real-time currency exchange rates and remittance fees across Africa.\n\n• **Core Features:** Real-time multi-channel comparison across traditional African banks (Ecobank, UBA, Société Générale), fintechs (Wise, WorldRemit), and crypto exchanges (Binance, Coinbase), plus rate alerts and a SaaS subscription engine.\n• **Tech Stack:** Laravel 12, React, TypeScript, Tailwind CSS, ShadCN UI, MySQL & API-First architecture.\n• **Source Code:** Available on GitHub.`,
      suggestions: [
        '🤖 Tell me about his AI creations',
        '🏥 Tell me about PartoCare',
        '🛠️ What are his Laravel skills?'
      ]
    }
  }

  // B) PartoCare
  if (/partocare|parto|matern|obstet|health|sante|santé|bebe|bébé|hopital|hôpital|offline|dexie|indexeddb/i.test(query)) {
    if (isFR) {
      return {
        text: `**PartoCare — Santé Obstétricale Numérique & Aide à la Décision** 🏥\n\nPartoCare est une application innovante conçue pour digitaliser le partogramme papier et lutter contre la mortalité maternelle et néonatale au Cameroun.\n\n• **Moteur d'Aide à la Décision :** Algorithmes automatisés d'alerte précoce pour détecter les anomalies de travail (dilatation anormale, pré-éclampsie, souffrance fœtale).\n• **Architecture Offline-First :** Fonctionne de manière 100% autonome sans connexion internet grâce à **Dexie.js (IndexedDB)** pour assister les soignants en zones reculées, avec synchronisation automatique lors du retour en ligne.\n• **Stack :** React, TypeScript, Tailwind CSS, Dexie.js, Laravel & MySQL.`,
        suggestions: [
          '🤖 Comment l\'IA est-elle utilisée dans ce projet ?',
          '💱 Parle-moi d’ExchangeCompare',
          '📞 Contacter Emekson pour un projet'
        ]
      }
    }
    return {
      text: `**PartoCare — Digital Obstetric Healthcare & Clinical Decision Support** 🏥\n\nAn impactful digital healthcare solution replacing manual paper partographs to reduce maternal and neonatal mortality in Cameroon.\n\n• **Clinical Decision Intelligence:** Automated early-warning triggers for labor complications (arrested dilation, pre-eclampsia, fetal distress).\n• **Offline-First Innovation:** Works seamlessly without internet connectivity using **Dexie.js (IndexedDB)** for rural and remote clinics, syncing data automatically once online.\n• **Tech Stack:** React, TypeScript, Tailwind CSS, Dexie.js, Laravel, and MySQL.`,
      suggestions: [
        '🤖 How is AI/algorithms used here?',
        '💱 Tell me about ExchangeCompare',
        '📞 Contact Emekson for collaboration'
      ]
    }
  }

  // C) Gourmet Restaurant Platform
  if (/restaurant|gourmet|food|commande|repas|reservation|réservation|table|repas/i.test(query)) {
    if (isFR) {
      return {
        text: `**Plateforme de Restauration Gourmet** 🍽️\n\nUne application haut de gamme de commande en ligne et de réservation de tables au design cinématographique "Noir & Or".\n\n• **Fonctionnalités :** Menu dynamique filtrable connecté à MongoDB Atlas, panier interactif animé avec Zustand, réservation de tables avec confirmation et suivi des livraisons en direct via WebSockets.\n• **Stack :** React 19, Vite, Tailwind CSS, Framer Motion, Zustand, Node.js, Express, MongoDB Atlas.`,
        suggestions: [
          '🤖 Voir les créations en IA',
          '🏥 Parle-moi de PartoCare',
          '🛠️ Ses compétences en Node.js'
        ]
      }
    }
    return {
      text: `**Gourmet Restaurant Platform** 🍽️\n\nA luxury culinary ordering and table reservation platform with a sleek "Black & Gold" aesthetic.\n\n• **Key Features:** Dynamic real-time menu filtering via MongoDB Atlas, animated interactive cart powered by Zustand, secure table booking system, and live WebSocket order tracking.\n• **Tech Stack:** React 19, Vite, Tailwind CSS, Framer Motion, Zustand, Node.js, Express, MongoDB Atlas.`,
      suggestions: [
        '🤖 View AI creations',
        '🏥 Tell me about PartoCare',
        '🛠️ What are his Node.js skills?'
      ]
    }
  }

  // D) General Project Inquiries
  if (/project|projects|projet|projets|portfolio|build|built|realis|réalis/i.test(query)) {
    const pList = (data?.projects || []).map(p => `• **${p.title}**: ${p.description}`).join('\n')
    if (isFR) {
      return {
        text: `Voici les réalisations majeures conçues par **${name}** (incluant ses créations en IA et plateformes full-stack) :\n\n${pList}\n\nVous pouvez cliquer sur n'importe quel projet pour inspecter l'étude de cas d'architecture et le code source !`,
        suggestions: [
          '🤖 EMEKSON AI (Agent conversationnel)',
          '💱 ExchangeCompare Africa',
          '🏥 PartoCare (Offline-First)',
          '🍽️ Plateforme de Restauration'
        ]
      }
    }
    return {
      text: `Here are the major engineering projects created by **${name}** (spanning AI agent creation, SaaS, and full-stack architectures):\n\n${pList}\n\nYou can click any project to inspect its complete architectural case study and repository!`,
      suggestions: [
        '🤖 EMEKSON AI (Conversational Agent)',
        '💱 ExchangeCompare Africa',
        '🏥 PartoCare (Offline-First)',
        '🍽️ Gourmet Restaurant Platform'
      ]
    }
  }

  // --- Intent 6: Work Experience & Internships ---
  if (/experience|expérience|internship|internships|stage|stages|travail|work|job|career|parcours|entreprise|company|kiama|sigeris|pronote/i.test(query)) {
    if (isFR) {
      return {
        text: `**Parcours Professionnel & Stages en Entreprise** 💼\n\n1. **IFP PRONOTE COMPANY (2026 – Présent)** — *Stage Professionnel (Développeur Logiciel & Solutions IA)*\n   • Conception et développement de solutions applicatives full-stack, intégration d'IA et gestion de bases de données.\n\n2. **KIAMA SA (Douala, Juil – Sept 2024)** — *Stage Académique*\n   • Conception et déploiement d'un site web pour le suivi de la disponibilité des travailleurs et des tâches opérationnelles.\n   • *Attestation vérifiée disponible.*\n\n3. **SIGERIS Sarl (Bafoussam, Juin – Août 2023)** — *Stage Académique*\n   • Implémentation de modules CRUD avec PHP & Grocery CRUD, maintenance informatique et administration réseau.\n   • *Attestation vérifiée disponible.*\n\n4. **PAPA INVESTMENT (2015 – 2022)** — *Assistance commerciale et gestion des opérations quotidiennes.*`,
        suggestions: [
          '📜 Voir ses certifications',
          '🎓 Quelle est sa formation universitaire ?',
          '🤖 Quelles sont ses créations en IA ?',
          '📞 Le contacter directement'
        ]
      }
    }
    return {
      text: `**Professional Experience & Industry Internships** 💼\n\n1. **IFP PRONOTE COMPANY (2026 – Present)** — *Professional Software & AI Engineering Internship*\n   • Full-stack software architecture, AI system integration, API development, and database engineering.\n\n2. **KIAMA SA (Douala, Jul – Sep 2024)** — *Academic Internship*\n   • Built a web platform to track employee availability and manage company task workflows.\n   • *Verified certificate available.*\n\n3. **SIGERIS Sarl (Bafoussam, Jun – Aug 2023)** — *Academic Internship*\n   • Developed PHP/Grocery CRUD database modules, managed PC maintenance and network operations.\n   • *Verified certificate available.*\n\n4. **PAPA INVESTMENT (2015 – 2022)** — *Family business operations and commercial assistance.*`,
      suggestions: [
        '📜 Verified certifications',
        '🎓 University education',
        '🤖 What are his AI creations?',
        '📞 Contact Emekson'
      ]
    }
  }

  // --- Intent 7: Technical Skills & AI Arsenal ---
  if (/skill|skills|tech|stack|competence|compétence|frontend|backend|database|outil|tool|react|laravel|node|typescript|docker|sql|mongodb|dexie/i.test(query)) {
    if (isFR) {
      return {
        text: `**Arsenal Technique & Compétences de ${name}** 🛠️\n\n• **Création d'IA & LLM :** NLP Multi-Intentions, Prompt Engineering, Orchestration de LLM (Claude, OpenAI), Graphes de connaissances, Concepts RAG, Workflows Cursor AI.\n• **Frontend :** React 19, TypeScript, JavaScript (ES6+), Tailwind CSS, Bootstrap 5, ShadCN UI, Design Réactif.\n• **Backend :** Laravel 12, PHP 8+, Node.js, Express, Architecture API-First, Authentification JWT & Sécurité RBAC, Grocery CRUD.\n• **Bases de Données :** MySQL, PostgreSQL, MongoDB Atlas, Dexie.js (IndexedDB pour l'Offline-First), Conception de schémas relationnels.\n• **Outils & DevOps :** Git & GitHub, VS Code, Docker (notions), Postman, Three.js / WebGL.`,
        suggestions: [
          '🤖 Comment crée-t-il des agents IA ?',
          '💱 Projets Laravel & React',
          '🏥 Comment utilise-t-il Dexie.js ?',
          '📄 Télécharger son CV'
        ]
      }
    }
    return {
      text: `**Technical Arsenal & Skillset of ${name}** 🛠️\n\n• **AI Creation & LLM Engineering:** Multi-Intent NLP, Advanced Prompt Engineering, LLM Orchestration (Claude, OpenAI), Contextual Knowledge Graphs, RAG Concepts, Cursor AI Workflows.\n• **Frontend:** React 19, TypeScript, JavaScript (ES6+), Tailwind CSS, Bootstrap 5, ShadCN UI, Responsive UI/UX.\n• **Backend:** Laravel 12, PHP 8+, Node.js, Express, API-First architectures, JWT Auth & RBAC security, Grocery CRUD.\n• **Databases:** MySQL, PostgreSQL, MongoDB Atlas, Dexie.js (IndexedDB for Offline-First), Relational Schema Design.\n• **Tools & DevOps:** Git & GitHub, VS Code, Docker Basics, Postman, Three.js / WebGL.`,
      suggestions: [
        '🤖 How does he engineer AI agents?',
        '💱 Laravel & React projects',
        '🏥 How does he use Dexie.js?',
        '📄 Download his Resume'
      ]
    }
  }

  // --- Intent 8: Education & University Degree ---
  if (/education|study|studies|etude|étude|universit|school|ecole|école|degree|diplome|diplôme|b-tech|cot|buea|baccalaur/i.test(query)) {
    if (isFR) {
      return {
        text: `**Formation Académique & Diplômes** 🎓\n\n• **B-TECH en Génie Logiciel (2023 – 2026 / Promo 2025–2026)**\n  *College of Technology (COT), Université de Buea*\n  Formation approfondie en algorithmique, structures de données, architecture logicielle, bases de données, génie logiciel et intégration de systèmes d'IA.\n\n• **Baccalauréat Scientifique – Série D (2021 – 2022)**\n  *Lycée Bilingue de Gouache Bafoussam*\n\n• **Probatoire Série D (2020 – 2021)** & **BEPC (2016 – 2017)**`,
        suggestions: [
          '💼 Ses stages en entreprise',
          '📜 Ses attestations de stage',
          '🤖 Ses créations en IA'
        ]
      }
    }
    return {
      text: `**Academic Journey & Degrees** 🎓\n\n• **Bachelor of Technology (B-TECH) in Software Engineering (2023 – 2026 / Academic Year 2025–2026)**\n  *College of Technology (COT), University of Buea*\n  Rigorous curriculum covering algorithms, data structures, full-stack software architecture, distributed database systems, and AI systems integration.\n\n• **Scientific Baccalauréat – Series D (2021 – 2022)**\n  *Government Bilingual High School Gouache Bafoussam*\n\n• **Probatoire Series D (2020 – 2021)** & **BEPC (2016 – 2017)**`,
      suggestions: [
        '💼 Industry internships',
        '📜 Verified certificates',
        '🤖 His AI creations'
      ]
    }
  }

  // --- Intent 9: Certifications & Verification ---
  if (/certif|attestation|verif|preuve|badge|credential/i.test(query)) {
    if (isFR) {
      return {
        text: `**Certifications & Attestations Vérifiées** 📜\n\n• **Attestation de Stage KIAMA SA :** Délivrée pour ses contributions au développement web et au suivi d'activité à Douala (2024).\n• **Attestation de Stage SIGERIS Sarl :** Délivrée pour ses réalisations en développement PHP/CRUD et maintenance réseau à Bafoussam (2023).\n\n*Vous pouvez visualiser et télécharger directement les attestations originales en cliquant sur les boutons "Voir l'attestation" dans la section Parcours.*`,
        suggestions: [
          '🎓 Voir la formation universitaire',
          '💼 Voir les détails des stages',
          '📞 Contacter Emekson'
        ]
      }
    }
    return {
      text: `**Verified Certifications & Credentials** 📜\n\n• **KIAMA SA Internship Certificate:** Awarded for web development and worker availability tracking in Douala (2024).\n• **SIGERIS Sarl Internship Certificate:** Awarded for PHP/CRUD development and network administration in Bafoussam (2023).\n\n*You can view and download the official signed certificates directly via the "View Certificate" buttons in the Education section.*`,
      suggestions: [
        '🎓 University education',
        '💼 Internship details',
        '📞 Contact Emekson'
      ]
    }
  }

  // --- Intent 10: Hiring, Availability & Opportunities ---
  if (/hire|hiring|recruit|recruter|embauch|disponible|disponibilite|disponibilité|available|availability|opportunit|contrat|freelance|open for work/i.test(query)) {
    if (isFR) {
      return {
        text: `**Disponibilité Professionnelle & Recrutement** 🚀\n\n**Oui, ${name} est activement disponible pour de nouvelles opportunités !**\n\n• **Profil ciblé :** Ingénieur Logiciel Full-Stack & Développeur de Systèmes IA (Junior/Intermédiaire), missions freelance, et contrats d'ingénierie.\n• **Localisation :** Buea, Cameroun (Ouvert au télétravail international ou sur site).\n• **Points forts :** Maîtrise de la création d'IA & NLP, expertise React / Laravel / Node.js, architecture Offline-First et rigueur logicielle.\n\n👉 Vous pouvez le contacter directement via le formulaire ci-dessous ou sur **WhatsApp** au \`${phones[0]}\`.`,
        suggestions: [
          '📞 Ouvrir un chat WhatsApp',
          '✉️ Envoyer un email à Emekson',
          '📄 Télécharger le CV (PDF)',
          '🤖 Voir ses créations en IA'
        ]
      }
    }
    return {
      text: `**Professional Availability & Hiring** 🚀\n\n**Yes, ${name} is actively open for opportunities!**\n\n• **Target Roles:** Full-Stack & AI Systems Software Engineer, Frontend/Backend Developer, and freelance engineering contracts.\n• **Location:** Buea, Cameroon (Open to remote worldwide and on-site roles).\n• **Key Strengths:** AI Agent creation & NLP, strong React / Laravel / Node.js / SQL skillset, offline-first systems, and rapid execution.\n\n👉 You can connect directly via the contact form or on **WhatsApp** at \`${phones[0]}\`.`,
      suggestions: [
        '📞 Open WhatsApp chat',
        '✉️ Send an Email to Emekson',
        '📄 Download Resume (PDF)',
        '🤖 Inspect AI creations'
      ]
    }
  }

  // --- Intent 11: Contact, Email, Phone, WhatsApp, Socials ---
  if (/contact|email|mail|phone|numero|numéro|telephone|téléphone|whatsapp|linkedin|github|facebook|reach|message/i.test(query)) {
    if (isFR) {
      return {
        text: `**Coordonnées & Réseaux de ${name}** 📬\n\n• 📧 **Email :** [${email}](mailto:${email})\n• 📱 **Téléphone / WhatsApp :** [${phones[0]}](tel:${phones[0].replace(/\s+/g, '')}) / [${phones[1]}](tel:${phones[1].replace(/\s+/g, '')})\n• 💬 **WhatsApp Direct :** [Ouvrir la discussion WhatsApp](${whatsappUrl})\n• 💻 **GitHub :** [github.com/tadiaemekson](https://github.com/tadiaemekson)\n• 💼 **LinkedIn :** [linkedin.com/in/tadia-fonge-emekson](https://www.linkedin.com/in/tadia-fonge-emekson)\n• 📍 **Localisation :** Buea, Cameroun`,
        suggestions: [
          '🤖 Ses créations en IA',
          '🚀 Voir ses projets',
          '📄 Télécharger son CV'
        ]
      }
    }
    return {
      text: `**Contact & Social Channels for ${name}** 📬\n\n• 📧 **Email:** [${email}](mailto:${email})\n• 📱 **Phone / WhatsApp:** [${phones[0]}](tel:${phones[0].replace(/\s+/g, '')}) / [${phones[1]}](tel:${phones[1].replace(/\s+/g, '')})\n• 💬 **Direct WhatsApp:** [Click here to chat on WhatsApp](${whatsappUrl})\n• 💻 **GitHub:** [github.com/tadiaemekson](https://github.com/tadiaemekson)\n• 💼 **LinkedIn:** [linkedin.com/in/tadia-fonge-emekson](https://www.linkedin.com/in/tadia-fonge-emekson)\n• 📍 **Location:** Buea, Cameroon`,
      suggestions: [
        '🤖 Explore AI creations',
        '🚀 Explore projects',
        '📄 Download Resume'
      ]
    }
  }

  // --- Intent 12: Resume / CV Download ---
  if (/cv|resume|résumé|curriculum|pdf|telecharger|télécharger|download/i.test(query)) {
    if (isFR) {
      return {
        text: `**Télécharger le CV de ${name}** 📄\n\nVous pouvez générer et télécharger instantanément son CV professionnel au format PDF en cliquant sur le bouton **"Télécharger le CV (PDF)"** situé tout en haut dans la section d'accueil (Hero).\n\nLe document est généré dynamiquement dans la langue active (FR ou EN) avec toutes les compétences en IA, projets et expériences à jour !`,
        suggestions: [
          '📞 Obtenir ses coordonnées',
          '🤖 Voir ses créations en IA',
          '🚀 Découvrir ses projets'
        ]
      }
    }
    return {
      text: `**Download ${name}'s Resume (PDF)** 📄\n\nYou can instantly generate and download his complete professional resume by clicking the **"Download Resume (PDF)"** button located at the top in the Hero section.\n\nThe PDF is dynamically compiled in your active language (English or French) with fully up-to-date AI creation skills, engineering projects, and credentials!`,
      suggestions: [
        '📞 Get contact info',
        '🤖 Inspect AI creations',
        '🚀 Explore projects'
      ]
    }
  }

  // --- Intent 13: Bio & General About ---
  if (/who|qui|about|a propos|à propos|biographie|presentation|présentation|emekson|tadia/i.test(query)) {
    const bio = data?.about?.bio || data?.profile?.bio || ''
    if (isFR) {
      return {
        text: `**À propos de ${name}** 👨‍💻\n\n${bio}\n\n• **Rôle :** Ingénieur Logiciel | Développeur Full-Stack & Systèmes IA\n• **Spécialités :** Création d'IA & NLP, React 19, Laravel 12, Node.js, SQL, Dexie (Offline-First)\n• **Localisation :** Buea, Cameroun`,
        suggestions: [
          '🤖 Quelles sont ses créations en IA ?',
          '🚀 Quels sont ses projets majeurs ?',
          '🛠️ Quelle est sa stack technique ?',
          '📞 Comment le contacter ?'
        ]
      }
    }
    return {
      text: `**About ${name}** 👨‍💻\n\n${bio}\n\n• **Role:** Software Engineer | Full-Stack & AI Systems Developer\n• **Specialties:** AI Creation & NLP, React 19, Laravel 12, Node.js, SQL, Dexie (Offline-First)\n• **Location:** Buea, Cameroon`,
      suggestions: [
        '🤖 What are his AI creations?',
        '🚀 What are his major projects?',
        '🛠️ What is his technical arsenal?',
        '📞 How can I reach him?'
      ]
    }
  }

  // --- Intent 14: Fallback Guidance ---
  if (isFR) {
    return {
      text: `C'est une excellente question ! 💡\n\nPour vous renseigner précisément sur **${name}**, vous pouvez sélectionner l'un des sujets ci-dessous ou me demander des détails sur ses créations en IA, un projet spécifique, sa stack ou ses coordonnées :`,
      suggestions: [
        '🤖 Créations en IA & Agents conversationnels',
        '🚀 Projets d’ingénierie logicielle',
        '💼 Stages & Expériences en entreprise',
        '📞 Coordonnées & Disponibilité'
      ]
    }
  }

  return {
    text: `That's a great question! 💡\n\nTo provide the most accurate insights about **${name}**, you can click any of the topics below or ask specifically about his AI creations, software projects, tech stack, or how to contact him:`,
    suggestions: [
      '🤖 AI Creations & Conversational Agents',
      '🚀 Key Engineering Projects',
      '💼 Industry Internships & Experience',
      '📞 Contact Info & Availability'
    ]
  }
}
