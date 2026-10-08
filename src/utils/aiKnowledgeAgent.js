/**
 * AI Knowledge Agent & Reasoning Engine for TADIA FONGE EMEKSON's Portfolio
 * Provides intelligent, contextual, multi-lingual (EN/FR) conversational answers
 * grounded in comprehensive portfolio facts, technical architectures, and career achievements.
 */

export function detectLanguage(text, defaultLang = 'en') {
  const lower = text.toLowerCase()
  const frKeywords = [
    'bonjour', 'salut', 'merci', 'projet', 'projets', 'qui', 'est-ce', 'comment', 'pourquoi',
    'stage', 'stages', 'diplome', 'diplôme', 'etude', 'étude', 'competence', 'compétence',
    'embaucher', 'recruter', 'disponible', 'disponibilite', 'disponibilité', 'travail',
    'experience', 'expérience', 'langue', 'langues', 'contact', 'telecharger', 'télécharger',
    'parle', 'explique', 'quel', 'quels', 'quelle', 'quelles', 'est', 'sont', 'avec'
  ]
  const matchFr = frKeywords.some(kw => lower.includes(kw))
  if (matchFr) return 'fr'
  
  const enKeywords = [
    'hello', 'hi', 'hey', 'thanks', 'thank', 'project', 'projects', 'who', 'how', 'why',
    'internship', 'internships', 'degree', 'study', 'education', 'skill', 'skills',
    'hire', 'hiring', 'available', 'availability', 'work', 'experience', 'language', 'languages',
    'reach', 'download', 'tell', 'explain', 'what', 'which', 'where', 'with'
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
        text: `Bonjour ! 👋 Je suis l'assistant IA officiel de **${name}**.\n\nJe peux vous renseigner en détail sur :\n• Ses **projets d'ingénierie logicielle** (SaaS, Offline-First, Full-Stack)\n• Ses **compétences techniques** (React, Laravel, Node.js, SQL, TypeScript)\n• Ses **stages & expériences** (IFP PRONOTE, KIAMA, SIGERIS)\n• Ses **disponibilités pour recrutement ou collaboration**\n\nQue souhaitez-vous découvrir ?`,
        suggestions: [
          '🚀 Parle-moi de ses projets clés',
          '💼 Quelles sont ses expériences en entreprise ?',
          '🛠️ Quelle est sa stack technique ?',
          '📞 Comment contacter Emekson ?'
        ]
      }
    }
    return {
      text: `Hello there! 👋 I am the official AI Assistant for **${name}**.\n\nI can provide in-depth information about:\n• His **engineering projects** (SaaS, Offline-First, Full-Stack)\n• His **technical arsenal** (React, Laravel, Node.js, SQL, TypeScript)\n• His **internships & experience** (IFP PRONOTE, KIAMA, SIGERIS)\n• His **availability for hiring, contracts, or collaborations**\n\nWhat would you like to explore?`,
      suggestions: [
        '🚀 Tell me about his top projects',
        '💼 What is his industry experience?',
        '🛠️ What is his full tech stack?',
        '📞 How can I get in touch?'
      ]
    }
  }

  // --- Intent 2: Gratitude & Politeness ---
  if (/thank|merci|grateful|appreciate|cool|super|awesome|great|parfait/i.test(query)) {
    if (isFR) {
      return {
        text: `C'est un grand plaisir ! 😊 N'hésitez pas si vous avez d'autres questions sur le profil d'Emekson ou si vous souhaitez le contacter directement.`,
        suggestions: [
          '📞 Comment le contacter ?',
          '🚀 Voir ses projets',
          '📄 Télécharger son CV'
        ]
      }
    }
    return {
      text: `You're very welcome! 😊 Feel free to ask anything else about Emekson's engineering background or reach out to him directly.`,
      suggestions: [
        '📞 How to contact him?',
        '🚀 Explore his projects',
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

  // --- Intent 4: Specific Project Deep Dives ---
  // A) ExchangeCompare Africa
  if (/exchange|compare|crypto|taux|monnaie|forex|fintech/i.test(query)) {
    if (isFR) {
      return {
        text: `**ExchangeCompare Africa** 💱\n\nIl s'agit d'une plateforme SaaS moderne conçue pour comparer en temps réel les taux de change et les frais de transfert d'argent à travers l'Afrique.\n\n• **Fonctionnalités clés :** Comparateur multi-canaux (Banques comme Ecobank/UBA, Fintechs comme Wise/WorldRemit, Crypto comme Binance), alertes de taux personnalisées, système d'abonnements SaaS et tableaux de bord dédiés.\n• **Stack Technique :** Laravel 12, React, TypeScript, Tailwind CSS, ShadCN UI, MySQL & Architecture API-First.\n• **Code Source :** Disponible sur GitHub.`,
        suggestions: [
          '🏥 Parle-moi du projet PartoCare',
          '🍽️ Parle-moi du projet Restaurant',
          '🛠️ Quelles sont ses compétences en Laravel ?'
        ]
      }
    }
    return {
      text: `**ExchangeCompare Africa** 💱\n\nA full-featured SaaS platform built to compare real-time currency exchange rates and remittance fees across Africa.\n\n• **Core Features:** Real-time multi-channel comparison across traditional African banks (Ecobank, UBA, Société Générale), fintechs (Wise, WorldRemit), and crypto exchanges (Binance, Coinbase), plus rate alerts and a SaaS subscription engine.\n• **Tech Stack:** Laravel 12, React, TypeScript, Tailwind CSS, ShadCN UI, MySQL & API-First architecture.\n• **Source Code:** Available on GitHub.`,
      suggestions: [
        '🏥 Tell me about PartoCare',
        '🍽️ Tell me about Gourmet Restaurant',
        '🛠️ What are his Laravel skills?'
      ]
    }
  }

  // B) PartoCare
  if (/partocare|parto|matern|obstet|health|sante|santé|bebe|bébé|hopital|hôpital|offline|dexie|indexeddb/i.test(query)) {
    if (isFR) {
      return {
        text: `**PartoCare — Santé Obstétricale Numérique** 🏥\n\nPartoCare est une application innovante conçue pour digitaliser le partogramme papier et lutter contre la mortalité maternelle et néonatale au Cameroun.\n\n• **Architecture Offline-First :** Fonctionne de manière 100% autonome sans connexion internet grâce à **Dexie.js (IndexedDB)** pour assister les soignants en zones reculées, avec synchronisation automatique lors du retour en ligne.\n• **Aide à la Décision :** Algorithmes automatisés d'alerte précoce pour détecter les anomalies de travail (dilatation anormale, pré-éclampsie, souffrance fœtale).\n• **Stack :** React, TypeScript, Tailwind CSS, Dexie.js, Laravel & MySQL.`,
        suggestions: [
          '💱 Parle-moi d’ExchangeCompare',
          '🛠️ Ses compétences en bases de données',
          '📞 Contacter Emekson pour un projet'
        ]
      }
    }
    return {
      text: `**PartoCare — Digital Obstetric Healthcare** 🏥\n\nAn impactful digital healthcare solution replacing manual paper partographs to reduce maternal and neonatal mortality in Cameroon.\n\n• **Offline-First Innovation:** Works seamlessly without internet connectivity using **Dexie.js (IndexedDB)** for rural and remote clinics, syncing data automatically once online.\n• **Decision Support:** Automated early-warning triggers for labor complications (arrested dilation, pre-eclampsia, fetal distress).\n• **Tech Stack:** React, TypeScript, Tailwind CSS, Dexie.js, Laravel, and MySQL.`,
      suggestions: [
        '💱 Tell me about ExchangeCompare',
        '🛠️ How does he handle databases?',
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
          '🏥 Parle-moi de PartoCare',
          '🚀 Liste tous ses projets',
          '🛠️ Ses compétences en Node.js'
        ]
      }
    }
    return {
      text: `**Gourmet Restaurant Platform** 🍽️\n\nA luxury culinary ordering and table reservation platform with a sleek "Black & Gold" aesthetic.\n\n• **Key Features:** Dynamic real-time menu filtering via MongoDB Atlas, animated interactive cart powered by Zustand, secure table booking system, and live WebSocket order tracking.\n• **Tech Stack:** React 19, Vite, Tailwind CSS, Framer Motion, Zustand, Node.js, Express, MongoDB Atlas.`,
      suggestions: [
        '🏥 Tell me about PartoCare',
        '🚀 List all projects',
        '🛠️ What are his Node.js skills?'
      ]
    }
  }

  // D) Clinic Management & Academic Projects
  if (/clinic|clinique|grocery|crud|php\s*project|b-tech project|projet academique|projet académique/i.test(query)) {
    if (isFR) {
      return {
        text: `**Systèmes de Gestion PHP & Grocery CRUD** 📋\n\n• **Clinic Management System :** Gestion des dossiers patients, prise de rendez-vous médicaux et contrôle d'accès basé sur les rôles (RBAC pour médecins, infirmières, admins) en PHP & MySQL.\n• **Projet Académique B-TECH :** Back-office administratif robuste pour la gestion des dossiers étudiants, des notes et des inscriptions avec PHP et Grocery CRUD.`,
        suggestions: [
          '💼 Ses stages professionnels',
          '🛠️ Ses compétences Backend',
          '🎓 Sa formation universitaire'
        ]
      }
    }
    return {
      text: `**PHP & Grocery CRUD Management Systems** 📋\n\n• **Clinic Management System:** Patient record management, appointments, and Role-Based Access Control (RBAC for doctors, nurses, admins) built with pure PHP & MySQL.\n• **B-TECH Academic System:** Administrative back-office for student records, enrollment, and grade management utilizing PHP and Grocery CRUD.`,
      suggestions: [
        '💼 Tell me about his internships',
        '🛠️ What is his backend skillset?',
        '🎓 Tell me about his education'
      ]
    }
  }

  // E) General Project Questions
  if (/project|projects|projet|projets|portfolio|build|built|realis|réalis/i.test(query)) {
    const pList = (data?.projects || []).map(p => `• **${p.title}**: ${p.description}`).join('\n')
    if (isFR) {
      return {
        text: `Voici un aperçu des projets clés réalisés par **${name}** :\n\n${pList}\n\nVous pouvez cliquer sur n'importe quel projet sur la page pour ouvrir l'étude de cas détaillée ou le code source !`,
        suggestions: [
          '💱 ExchangeCompare Africa',
          '🏥 PartoCare (Offline-First)',
          '🍽️ Plateforme de Restauration',
          '🛠️ Stack technique complète'
        ]
      }
    }
    return {
      text: `Here is a summary of major engineering projects built by **${name}**:\n\n${pList}\n\nYou can click any project on the page to inspect its full case study and GitHub repository!`,
      suggestions: [
        '💱 ExchangeCompare Africa',
        '🏥 PartoCare (Offline-First)',
        '🍽️ Gourmet Restaurant Platform',
        '🛠️ View Full Tech Stack'
      ]
    }
  }

  // --- Intent 5: Work Experience & Internships ---
  if (/experience|expérience|internship|internships|stage|stages|travail|work|job|career|parcours|entreprise|company|kiama|sigeris|pronote/i.test(query)) {
    if (isFR) {
      return {
        text: `**Parcours Professionnel & Stages en Entreprise** 💼\n\n1. **IFP PRONOTE COMPANY (2026 – Présent)** — *Stage Professionnel (Développeur Logiciel)*\n   • Conception et développement de solutions applicatives full-stack et gestion de bases de données.\n\n2. **KIAMA SA (Douala, Juil – Sept 2024)** — *Stage Académique*\n   • Conception et déploiement d'un site web pour le suivi de la disponibilité des travailleurs et des tâches opérationnelles.\n   • *Attestation vérifiée disponible.*\n\n3. **SIGERIS Sarl (Bafoussam, Juin – Août 2023)** — *Stage Académique*\n   • Implémentation de modules CRUD avec PHP & Grocery CRUD, maintenance informatique et administration réseau.\n   • *Attestation vérifiée disponible.*\n\n4. **PAPA INVESTMENT (2015 – 2022)** — *Assistance commerciale et gestion des opérations quotidiennes.*`,
        suggestions: [
          '📜 Voir ses certifications',
          '🎓 Quelle est sa formation universitaire ?',
          '🚀 Quels projets a-t-il créés ?',
          '📞 Le contacter directement'
        ]
      }
    }
    return {
      text: `**Professional Experience & Industry Internships** 💼\n\n1. **IFP PRONOTE COMPANY (2026 – Present)** — *Professional Software Engineering Internship*\n   • Full-stack software architecture, API implementation, and relational database management.\n\n2. **KIAMA SA (Douala, Jul – Sep 2024)** — *Academic Internship*\n   • Built a web platform to track employee availability and manage company task workflows.\n   • *Verified certificate available.*\n\n3. **SIGERIS Sarl (Bafoussam, Jun – Aug 2023)** — *Academic Internship*\n   • Developed PHP/Grocery CRUD database modules, managed PC maintenance and network operations.\n   • *Verified certificate available.*\n\n4. **PAPA INVESTMENT (2015 – 2022)** — *Family business operations and commercial assistance.*`,
      suggestions: [
        '📜 Verified certifications',
        '🎓 University education',
        '🚀 Featured engineering projects',
        '📞 Contact Emekson'
      ]
    }
  }

  // --- Intent 6: Technical Skills, Stack & Tools ---
  if (/skill|skills|tech|stack|competence|compétence|frontend|backend|database|outil|tool|react|laravel|node|typescript|docker|sql|mongodb|dexie/i.test(query)) {
    if (isFR) {
      return {
        text: `**Arsenal Technique & Compétences de ${name}** 🛠️\n\n• **Frontend :** React 19, TypeScript, JavaScript (ES6+), Tailwind CSS, Bootstrap, ShadCN UI, CSS Grid/Flexbox, Design Réactif.\n• **Backend :** Laravel 12, PHP, Node.js, Express, Architecture API-First, Authentification JWT & Sécurité RBAC, Grocery CRUD.\n• **Bases de Données :** MySQL, PostgreSQL, MongoDB Atlas, Dexie.js (IndexedDB pour l'Offline-First), Conception de schémas relationnels.\n• **Outils & DevOps :** Git & GitHub, VS Code, Docker (notions), Postman.\n• **Outils IA :** Claude AI, ChatGPT, Cursor AI, Grok AI pour optimiser le cycle de développement.`,
        suggestions: [
          '💱 Projets Laravel & React',
          '🏥 Comment utilise-t-il Dexie.js ?',
          '💼 Ses expériences de stage',
          '📄 Télécharger son CV'
        ]
      }
    }
    return {
      text: `**Technical Arsenal & Skillset of ${name}** 🛠️\n\n• **Frontend:** React 19, TypeScript, JavaScript (ES6+), Tailwind CSS, Bootstrap, ShadCN UI, CSS Grid/Flexbox, Responsive UI Design.\n• **Backend:** Laravel 12, PHP, Node.js, Express, API-First architectures, JWT Auth & RBAC security, Grocery CRUD.\n• **Databases:** MySQL, PostgreSQL, MongoDB Atlas, Dexie.js (IndexedDB for Offline-First), Relational Schema Design.\n• **Tools & DevOps:** Git & GitHub, VS Code, Docker Basics, Postman.\n• **AI Engineering Tools:** Claude AI, ChatGPT, Cursor AI, Grok AI for accelerated and rigorous software workflows.`,
      suggestions: [
        '💱 Laravel & React projects',
        '🏥 How does he use Dexie.js?',
        '💼 Industry internships',
        '📄 Download his Resume'
      ]
    }
  }

  // --- Intent 7: Education & University Degree ---
  if (/education|study|studies|etude|étude|universit|school|ecole|école|degree|diplome|diplôme|b-tech|cot|buea|baccalaur/i.test(query)) {
    if (isFR) {
      return {
        text: `**Formation Académique & Diplômes** 🎓\n\n• **B-TECH en Génie Logiciel (2023 – 2026 / Promo 2025–2026)**\n  *College of Technology (COT), Université de Buea*\n  Formation approfondie en algorithmique, structures de données, architecture logicielle, bases de données et génie logiciel.\n\n• **Baccalauréat Scientifique – Série D (2021 – 2022)**\n  *Lycée Bilingue de Gouache Bafoussam*\n\n• **Probatoire Série D (2020 – 2021)** & **BEPC (2016 – 2017)**`,
        suggestions: [
          '💼 Ses stages en entreprise',
          '📜 Ses attestations de stage',
          '🛠️ Sa stack technique'
        ]
      }
    }
    return {
      text: `**Academic Journey & Degrees** 🎓\n\n• **Bachelor of Technology (B-TECH) in Software Engineering (2023 – 2026 / Academic Year 2025–2026)**\n  *College of Technology (COT), University of Buea*\n  Rigorous curriculum covering algorithms, data structures, full-stack software architecture, and distributed database systems.\n\n• **Scientific Baccalauréat – Series D (2021 – 2022)**\n  *Government Bilingual High School Gouache Bafoussam*\n\n• **Probatoire Series D (2020 – 2021)** & **BEPC (2016 – 2017)**`,
      suggestions: [
        '💼 Industry internships',
        '📜 Verified certificates',
        '🛠️ Full tech stack'
      ]
    }
  }

  // --- Intent 8: Certifications & Verification ---
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

  // --- Intent 9: Hiring, Availability & Opportunities ---
  if (/hire|hiring|recruit|recruter|embauch|disponible|disponibilite|disponibilité|available|availability|opportunit|contrat|freelance|open for work/i.test(query)) {
    if (isFR) {
      return {
        text: `**Disponibilité Professionnelle & Recrutement** 🚀\n\n**Oui, ${name} est actuellement disponible !**\n\n• **Types d'opportunités recherchées :** Postes de Développeur Full-Stack / Ingénieur Logiciel (Junior/Intermédiaire), missions freelance, et stages de perfectionnement.\n• **Localisation :** Buea, Cameroun (Ouvert au télétravail international ou sur site).\n• **Points forts :** Rapidité d'exécution, maîtrise React / Laravel / Node.js, approche Offline-First et rigueur d'ingénierie logicielle.\n\n👉 Vous pouvez le contacter directement via le formulaire ci-dessous ou sur **WhatsApp** au \`${phones[0]}\`.`,
        suggestions: [
          '📞 Ouvrir un chat WhatsApp',
          '✉️ Envoyer un email à Emekson',
          '📄 Télécharger le CV (PDF)',
          '🚀 Découvrir ses réalisations'
        ]
      }
    }
    return {
      text: `**Professional Availability & Hiring** 🚀\n\n**Yes, ${name} is actively open for opportunities!**\n\n• **Target Roles:** Full-Stack Software Engineer, Frontend/Backend Developer, freelance contracts, and software engineering roles.\n• **Location:** Buea, Cameroon (Open to remote worldwide and on-site roles).\n• **Key Strengths:** Fast execution, strong React / Laravel / Node.js / SQL skills, offline-first architectures, and team collaboration.\n\n👉 You can connect directly via the contact form or on **WhatsApp** at \`${phones[0]}\`.`,
      suggestions: [
        '📞 Open WhatsApp chat',
        '✉️ Send an Email to Emekson',
        '📄 Download Resume (PDF)',
        '🚀 Inspect his projects'
      ]
    }
  }

  // --- Intent 10: Contact, Email, Phone, WhatsApp, Socials ---
  if (/contact|email|mail|phone|numero|numéro|telephone|téléphone|whatsapp|linkedin|github|facebook|reach|message/i.test(query)) {
    if (isFR) {
      return {
        text: `**Coordonnées & Réseaux de ${name}** 📬\n\n• 📧 **Email :** [${email}](mailto:${email})\n• 📱 **Téléphone / WhatsApp :** [${phones[0]}](tel:${phones[0].replace(/\s+/g, '')}) / [${phones[1]}](tel:${phones[1].replace(/\s+/g, '')})\n• 💬 **WhatsApp Direct :** [Ouvrir la discussion WhatsApp](${whatsappUrl})\n• 💻 **GitHub :** [github.com/tadiaemekson](https://github.com/tadiaemekson)\n• 💼 **LinkedIn :** [linkedin.com/in/tadia-fonge-emekson](https://www.linkedin.com/in/tadia-fonge-emekson)\n• 📍 **Localisation :** Buea, Cameroun`,
        suggestions: [
          '🚀 Voir ses projets',
          '💼 Ses expériences de stage',
          '📄 Télécharger son CV'
        ]
      }
    }
    return {
      text: `**Contact & Social Channels for ${name}** 📬\n\n• 📧 **Email:** [${email}](mailto:${email})\n• 📱 **Phone / WhatsApp:** [${phones[0]}](tel:${phones[0].replace(/\s+/g, '')}) / [${phones[1]}](tel:${phones[1].replace(/\s+/g, '')})\n• 💬 **Direct WhatsApp:** [Click here to chat on WhatsApp](${whatsappUrl})\n• 💻 **GitHub:** [github.com/tadiaemekson](https://github.com/tadiaemekson)\n• 💼 **LinkedIn:** [linkedin.com/in/tadia-fonge-emekson](https://www.linkedin.com/in/tadia-fonge-emekson)\n• 📍 **Location:** Buea, Cameroon`,
      suggestions: [
        '🚀 Explore projects',
        '💼 View internships',
        '📄 Download Resume'
      ]
    }
  }

  // --- Intent 11: Resume / CV Download ---
  if (/cv|resume|résumé|curriculum|pdf|telecharger|télécharger|download/i.test(query)) {
    if (isFR) {
      return {
        text: `**Télécharger le CV de ${name}** 📄\n\nVous pouvez générer et télécharger instantanément son CV professionnel au format PDF en cliquant sur le bouton **"Télécharger le CV (PDF)"** situé tout en haut dans la section d'accueil (Hero).\n\nLe document est généré dynamiquement dans la langue active (FR ou EN) avec toutes les informations à jour !`,
        suggestions: [
          '📞 Obtenir ses coordonnées',
          '🚀 Découvrir ses projets',
          '🛠️ Voir ses compétences'
        ]
      }
    }
    return {
      text: `**Download ${name}'s Resume (PDF)** 📄\n\nYou can instantly generate and download his complete professional resume by clicking the **"Download Resume (PDF)"** button located at the top in the Hero section.\n\nThe PDF is dynamically compiled in your active language (English or French) with fully up-to-date projects, education, and internships!`,
      suggestions: [
        '📞 Get contact info',
        '🚀 Explore projects',
        '🛠️ View skills arsenal'
      ]
    }
  }

  // --- Intent 12: Languages Spoken & Soft Skills ---
  if (/langue|languages|parle|speak|anglais|francais|français|english|qualit|soft skill|valeur|principes/i.test(query)) {
    if (isFR) {
      return {
        text: `**Langues & Savoir-Être** 🌐\n\n• **Langues :**\n  - Français : Courant / Langue maternelle\n  - Anglais : Capacité professionnelle complète\n  - Nwimboõ (Mbouda de Batcham) : Courant\n\n• **Qualités & Principes :**\n  - Rigueur, adaptabilité et esprit d'équipe\n  - Résolution proactive de problèmes et apprentissage rapide\n  - Code propre, interfaces soignées et architectures résilientes`,
        suggestions: [
          '🎓 Sa formation universitaire',
          '💼 Ses stages en entreprise',
          '🚀 Voir ses projets'
        ]
      }
    }
    return {
      text: `**Languages & Core Qualities** 🌐\n\n• **Languages:**\n  - French: Native / Fluent\n  - English: Full Professional Proficiency\n  - Nwimboõ (Mbouda de Batcham): Fluent\n\n• **Engineering Values & Qualities:**\n  - Rigor, adaptability, and high team spirit\n  - Proactive problem-solving and rapid technology adoption\n  - Focus on clean UI/UX, resilient APIs, and scalable database schemas`,
      suggestions: [
        '🎓 University education',
        '💼 Industry internships',
        '🚀 Explore projects'
      ]
    }
  }

  // --- Intent 13: Bio & General About ---
  if (/who|qui|about|a propos|à propos|biographie|presentation|présentation|emekson|tadia/i.test(query)) {
    const bio = data?.about?.bio || data?.profile?.bio || ''
    if (isFR) {
      return {
        text: `**À propos de ${name}** 👨‍💻\n\n${bio}\n\n• **Rôle :** Ingénieur Logiciel | Développeur Full-Stack\n• **Spécialités :** React, Laravel, Node.js, SQL, Dexie (Offline-First)\n• **Localisation :** Buea, Cameroun`,
        suggestions: [
          '🚀 Quels sont ses projets majeurs ?',
          '🛠️ Quelle est sa stack technique ?',
          '💼 Où a-t-il effectué ses stages ?',
          '📞 Comment le contacter ?'
        ]
      }
    }
    return {
      text: `**About ${name}** 👨‍💻\n\n${bio}\n\n• **Role:** Software Engineer | Full-Stack Developer\n• **Specialties:** React, Laravel, Node.js, SQL, Dexie (Offline-First)\n• **Location:** Buea, Cameroon`,
      suggestions: [
        '🚀 What are his major projects?',
        '🛠️ What is his technical arsenal?',
        '💼 Where did he intern?',
        '📞 How can I reach him?'
      ]
    }
  }

  // --- Intent 14: Intelligent Fallback with Helpful Guidance ---
  if (isFR) {
    return {
      text: `C'est une excellente question ! 💡\n\nPour vous donner l'information la plus précise concernant **${name}**, vous pouvez sélectionner l'un des sujets ci-dessous ou me demander directement des détails sur un projet spécifique, une technologie, un stage ou un moyen de contact :`,
      suggestions: [
        '🚀 Projets d’ingénierie logicielle',
        '💼 Stages & Expériences en entreprise',
        '🛠️ Stack technique (React, Laravel, Node.js)',
        '📞 Coordonnées & Disponibilité'
      ]
    }
  }

  return {
    text: `That's a great question! 💡\n\nTo provide the most accurate insights about **${name}**, you can click any of the topics below or ask specifically about a project, a technology stack, an internship, or how to contact him:`,
    suggestions: [
      '🚀 Key Engineering Projects',
      '💼 Industry Internships & Experience',
      '🛠️ Full Tech Stack (React, Laravel, Node.js)',
      '📞 Contact Info & Availability'
    ]
  }
}
