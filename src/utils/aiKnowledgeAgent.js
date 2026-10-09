/**
 * Portfolio Knowledge Guide & Reasoning Engine for TADIA FONGE EMEKSON's Portfolio
 * Provides intelligent, helpful, multi-lingual (EN/FR) conversational answers
 * grounded in Emekson's real-world software engineering projects, work experience, and technical skills.
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
        text: `Bonjour ! 👋 Je suis le guide du portfolio de **${name}**.\n\nJe peux vous aider à découvrir :\n• Ses **projets d'ingénierie logicielle** (ExchangeCompare Africa, PartoCare, Restaurant Gourmet)\n• Ses **compétences techniques** (React 19, TypeScript, Laravel 12, Node.js, SQL)\n• Son **parcours et ses stages** (IFP PRONOTE COMPANY, KIAMA SA, SIGERIS)\n• Ses **disponibilités pour un poste, un stage ou un projet freelance**\n\nQue souhaitez-vous explorer ?`,
        suggestions: [
          '🚀 Découvrir ses projets majeurs',
          '🛠️ Quelle est sa stack technique ?',
          '💼 Son expérience chez IFP Pronote',
          '📞 Comment contacter Emekson ?'
        ]
      }
    }
    return {
      text: `Hello there! 👋 I am the portfolio guide for **${name}**.\n\nI can help you explore:\n• His **software engineering projects** (ExchangeCompare Africa, PartoCare, Restaurant Platform)\n• His **technical skills** (React 19, TypeScript, Laravel 12, Node.js, SQL databases)\n• His **internships and experience** (IFP PRONOTE COMPANY, KIAMA SA, SIGERIS)\n• His **availability for full-time roles, internships, or freelance projects**\n\nWhat would you like to know?`,
      suggestions: [
        '🚀 Explore major projects',
        '🛠️ What is his tech stack?',
        '💼 Experience at IFP Pronote',
        '📞 How to get in touch?'
      ]
    }
  }

  // --- Intent 2: Gratitude & Politeness ---
  if (/thank|merci|grateful|appreciate|cool|super|awesome|great|parfait/i.test(query)) {
    if (isFR) {
      return {
        text: `Avec grand plaisir ! 😊 N'hésitez pas si vous avez d'autres questions sur le travail d'Emekson ou si vous souhaitez échanger directement avec lui.`,
        suggestions: [
          '📞 Comment le contacter ?',
          '🚀 Voir ses projets',
          '📄 Télécharger son CV'
        ]
      }
    }
    return {
      text: `You're very welcome! 😊 Feel free to ask anything else about Emekson's projects, experience, or engineering approach.`,
      suggestions: [
        '📞 How to contact him?',
        '🚀 View his projects',
        '📄 Download his Resume'
      ]
    }
  }

  // --- Intent 3: Farewell / Exit ---
  if (/bye|goodbye|au revoir|a\+|ciao|see you|close|quitter|fermer/i.test(query)) {
    if (isFR) {
      return {
        text: `Au revoir et merci pour votre visite ! 🌟 Le chat se fermera dans quelques secondes. N'hésitez pas à me rouvrir à tout moment.`,
        shouldClose: true,
        suggestions: []
      }
    }
    return {
      text: `Goodbye and thank you for exploring Emekson's portfolio! 🌟 This chat will close shortly so you can browse. Feel free to open it anytime.`,
      shouldClose: true,
      suggestions: []
    }
  }

  // --- Intent 4: Project Exploration ---
  if (/project|projets|work|portfolio|application|partocare|exchange|restaurant|clinic|système|built|realisation|création/i.test(query)) {
    if (/partocare|santé|health|maternité|maternal|offline/i.test(query)) {
      if (isFR) {
        return {
          text: `**PartoCare — Plateforme de Santé Obstétricale Numérique** 🏥\n\n• **Objectif :** Remplacer le partogramme papier traditionnel pour réduire les risques de complications maternelles et néonatales.\n• **Architecture Offline-First :** Conçu avec **Dexie.js (IndexedDB)** pour fonctionner sans interruption dans les centres de santé isolés sans connexion internet.\n• **Système d'alerte clinique :** Détection précoce automatisée des anomalies du travail obstétrical (dilatation stagnante, pré-éclampsie) via des codes couleur normalisés.\n• **Technologies :** React, TypeScript, Tailwind CSS, Dexie.js, Laravel, MySQL.`,
          suggestions: [
            '💱 Découvrir ExchangeCompare Africa',
            '🛠️ Voir ses compétences techniques',
            '📞 Contacter Emekson'
          ]
        }
      }
      return {
        text: `**PartoCare — Digital Obstetrical Platform** 🏥\n\n• **Purpose:** Replaces traditional paper partographs to improve maternal and neonatal monitoring.\n• **Offline-First Architecture:** Built using **Dexie.js (IndexedDB)** so midwives and doctors in remote clinics can track labor without internet interruptions.\n• **Clinical Early Warnings:** Automated algorithmic color-coded alerts for labor complications (stalled dilation, fetal distress, pre-eclampsia).\n• **Tech Stack:** React, TypeScript, Tailwind CSS, Dexie.js (IndexedDB), Laravel, MySQL.`,
        suggestions: [
          '💱 Tell me about ExchangeCompare Africa',
          '🛠️ View full tech stack',
          '📞 Contact Emekson'
        ]
      }
    }

    if (/exchange|crypto|fintech|monnaie|money|compare|transfer/i.test(query)) {
      if (isFR) {
        return {
          text: `**ExchangeCompare Africa — Plateforme SaaS Fintech** 💱\n\n• **Objectif :** Permettre aux utilisateurs et entreprises de comparer en temps réel les taux et frais de transferts d'argent, banques et cryptomonnaies à travers l'Afrique.\n• **Fonctionnalités :** Moteur de comparaison multi-prestataires (Ecobank, Wise, WorldRemit, Binance), alertes de taux personnalisées, tableaux de bord abonnés et gestion SaaS.\n• **Architecture :** Conception API-First avec **Laravel 12 & MySQL** pour le backend, et **React + TypeScript + TailwindCSS** pour le frontend.`,
          suggestions: [
            '🏥 Découvrir le projet PartoCare',
            '💼 Expérience chez IFP Pronote',
            '📞 Contacter Emekson'
          ]
        }
      }
      return {
        text: `**ExchangeCompare Africa — Fintech SaaS Platform** 💱\n\n• **Purpose:** Real-time comparison engine for money transfer, bank, and crypto exchange rates across Africa.\n• **Features:** Multi-provider fee comparison (Ecobank, UBA, Wise, WorldRemit, Binance), custom rate alerts, user & admin dashboards, and SaaS subscription tiering.\n• **Architecture:** API-First architecture leveraging **Laravel 12 & MySQL** for the backend, paired with **React, TypeScript, Tailwind CSS, and ShadCN UI** on the frontend.`,
        suggestions: [
          '🏥 Tell me about PartoCare',
          '💼 Experience at IFP Pronote',
          '📞 Contact Emekson'
        ]
      }
    }

    if (isFR) {
      return {
        text: `**Projets Phares Développés par ${name}** 🚀\n\n1. **ExchangeCompare Africa** : Plateforme SaaS de comparaison en direct des taux de transfert, banques et cryptomonnaies en Afrique (React, TypeScript, Laravel 12, MySQL).\n2. **PartoCare** : Application de suivi obstétrical numérique avec synchronisation **Offline-First (Dexie.js / IndexedDB)** pour les cliniques isolées.\n3. **Plateforme Gourmet** : Application full-stack de commande et réservation avec panier Zustand et MongoDB Atlas.\n4. **Système de Gestion de Clinique** : Gestion complète des dossiers patients et des rendez-vous avec RBAC (PHP & MySQL).\n\nVous pouvez cliquer sur n'importe quel projet pour inspecter ses détails complets !`,
        suggestions: [
          '🏥 En savoir plus sur PartoCare',
          '💱 En savoir plus sur ExchangeCompare',
          '🛠️ Voir ses compétences techniques'
        ]
      }
    }
    return {
      text: `**Key Engineering Projects Built by ${name}** 🚀\n\n1. **ExchangeCompare Africa**: Real-time SaaS comparison engine for money transfers, bank fees, and crypto rates across Africa (React, TypeScript, Laravel 12, MySQL).\n2. **PartoCare**: Digital obstetrical care platform with **Offline-First (Dexie.js / IndexedDB)** sync for maternity clinics.\n3. **Gourmet Restaurant Platform**: Full-stack ordering and table reservation web app with Zustand cart and MongoDB Atlas.\n4. **Clinic Management System**: Role-based access control and patient records management in PHP & MySQL.\n\nFeel free to click any project card to view complete architecture details!`,
      suggestions: [
        '🏥 Tell me more about PartoCare',
        '💱 Tell me more about ExchangeCompare',
        '🛠️ What is his full tech stack?'
      ]
    }
  }

  // --- Intent 5: Skills & Tech Stack ---
  if (/skill|stack|technologie|competence|compétence|react|laravel|node|typescript|javascript|php|sql|database|mongo|dexie|git|docker/i.test(query)) {
    if (isFR) {
      return {
        text: `**Compétences Techniques & Technologies d'Emekson** 🛠️\n\n• **Frontend :** React 19, TypeScript, JavaScript (ES6+), Tailwind CSS, Bootstrap 5, HTML5/CSS3, Design Réactif.\n• **Backend & APIs :** PHP 8+, Laravel 12, Node.js, Express, Conception d'APIs RESTful, Authentification JWT & Sécurité RBAC.\n• **Bases de Données :** MySQL, PostgreSQL, Supabase, MongoDB Atlas, IndexedDB (Dexie.js pour le offline-first).\n• **Outils & Méthodes :** Git & GitHub, Postman API, Docker (bases), Three.js / WebGL, Méthodes Agiles.\n\nIl applique toujours une grande rigueur sur la propreté du code et l'expérience utilisateur finale.`,
        suggestions: [
          '🚀 Voir ses projets réalisés',
          '💼 Son parcours chez IFP Pronote',
          '📞 Comment le contacter ?'
        ]
      }
    }
    return {
      text: `**Technical Skills & Stack for ${name}** 🛠️\n\n• **Frontend:** React 19, TypeScript, JavaScript (ES6+), Tailwind CSS, Bootstrap 5, HTML5/CSS3, Responsive UI/UX.\n• **Backend & APIs:** PHP 8+, Laravel 12, Node.js, Express, RESTful API Design, JWT Authentication & RBAC Security.\n• **Databases:** MySQL, PostgreSQL, Supabase, MongoDB Atlas, IndexedDB (Dexie.js for offline sync).\n• **Tools & Workflows:** Git & GitHub, Postman API, Docker (basics), Three.js / WebGL, Agile workflows.\n\nHe emphasizes maintainable code architecture, thoughtful UX, and reliable system performance.`,
      suggestions: [
        '🚀 View his featured projects',
        '💼 Experience at IFP Pronote',
        '📞 How to get in touch?'
      ]
    }
  }

  // --- Intent 6: Experience & Internships (IFP PRONOTE, KIAMA, SIGERIS) ---
  if (/experience|expérience|stage|internship|pronote|kiama|sigeris|travail|work|career/i.test(query)) {
    if (isFR) {
      return {
        text: `**Parcours Professionnel & Stages en Entreprise** 💼\n\n1. **IFP PRONOTE COMPANY (2026 – Présent) :**\n   • Stage Professionnel en développement logiciel et architectures web full-stack.\n   • Conception applicative, gestion de bases de données et collaboration au sein d'une équipe agile.\n\n2. **KIAMA SA — Douala (Juil – Sept 2024) :**\n   • Développement d'une plateforme web pour suivre la disponibilité des employés et planifier les missions.\n\n3. **SIGERIS Sarl — Bafoussam (Juin – Août 2023) :**\n   • Implémentation de modules CRUD avec PHP et Grocery CRUD, modélisation de bases de données et maintenance système.`,
        suggestions: [
          '🎓 Sa formation universitaire (B-TECH)',
          '🚀 Voir ses projets réalisés',
          '📄 Télécharger son CV'
        ]
      }
    }
    return {
      text: `**Industry Experience & Internships** 💼\n\n1. **IFP PRONOTE COMPANY (2026 – Present):**\n   • Professional Internship in software development, full-stack architecture, and database modeling.\n   • Actively contributing to software design, API implementations, and agile team workflows.\n\n2. **KIAMA SA — Douala (July – Sept 2024):**\n   • Developed an internal web application to manage employee availability and company task allocation.\n\n3. **SIGERIS Sarl — Bafoussam (June – August 2023):**\n   • Built CRUD database interfaces using PHP and Grocery CRUD, assisted in network and IT administration.`,
      suggestions: [
        '🎓 University Education (B-TECH)',
        '🚀 Explore featured projects',
        '📄 Download his Resume'
      ]
    }
  }

  // --- Intent 7: Education & University ---
  if (/education|éducation|etude|étude|diplome|diplôme|university|université|buea|school|b-tech|matricule|cot/i.test(query)) {
    if (isFR) {
      return {
        text: `**Formation Académique** 🎓\n\n• **Diplôme :** B-TECH en Génie Logiciel (Année Académique 2025–2026).\n• **Établissement :** College of Technology (COT) – Université de Buea, Cameroun.\n• **Matricule :** CT22A133.\n• **Points forts :** Projets d'ingénierie full-stack, modélisation de bases de données, architectures web réactives et travail en équipe.`,
        suggestions: [
          '💼 Voir ses stages en entreprise',
          '🚀 Explorer ses projets',
          '📄 Télécharger son CV'
        ]
      }
    }
    return {
      text: `**Academic Background** 🎓\n\n• **Degree:** Bachelor of Technology (B-TECH) in Software Engineering (Academic Year 2025–2026).\n• **Institution:** College of Technology (COT) – University of Buea, Cameroon.\n• **Matricule:** CT22A133.\n• **Key Focus:** Full-stack software architecture, relational databases, offline-first systems, and collaborative engineering.`,
      suggestions: [
        '💼 View industry internships',
        '🚀 Explore featured projects',
        '📄 Download his Resume'
      ]
    }
  }

  // --- Intent 8: Contact, Hiring & Availability ---
  if (/contact|reach|email|phone|whatsapp|hire|recruter|embaucher|disponible|disponibilité|message|appel/i.test(query)) {
    if (isFR) {
      return {
        text: `**Coordonnées & Disponibilité d'Emekson** 📬\n\nEmekson est actuellement **disponible pour des opportunités professionnelles** (postes à temps plein, stages avancés et projets freelance) :\n\n• **Email :** [${email}](mailto:${email})\n• **Téléphone :** ${phones.join(' / ')}\n• **WhatsApp :** [Discuter en direct](${whatsappUrl})\n• **Localisation :** Buea, Cameroun\n\nVous pouvez également lui envoyer un message directement via le formulaire de contact en bas de page !`,
        suggestions: [
          '📄 Télécharger son CV',
          '🚀 Voir ses projets',
          '🛠️ Stack technique'
        ]
      }
    }
    return {
      text: `**Contact Details & Availability** 📬\n\nEmekson is currently **open for software engineering roles, internships, and project collaborations**:\n\n• **Email:** [${email}](mailto:${email})\n• **Phone:** ${phones.join(' / ')}\n• **WhatsApp:** [Chat on WhatsApp](${whatsappUrl})\n• **Location:** Buea, Cameroon\n\nFeel free to also use the contact form at the bottom of the page to reach out directly!`,
      suggestions: [
        '📄 Download Resume',
        '🚀 View featured projects',
        '🛠️ Tech stack'
      ]
    }
  }

  // --- Intent 9: Resume / CV Download ---
  if (/cv|resume|pdf|télécharger|telecharger|download/i.test(query)) {
    if (isFR) {
      return {
        text: `**Télécharger le CV d'Emekson** 📄\n\nVous pouvez télécharger son CV complet et mis à jour (format PDF professionnel) en cliquant directement sur le bouton **"Télécharger mon CV (PDF)"** dans la section d'accueil ou en haut de la page.`,
        suggestions: [
          '💼 Ses stages chez IFP Pronote',
          '🚀 Voir ses projets',
          '📞 Le contacter'
        ]
      }
    }
    return {
      text: `**Download Emekson's Resume** 📄\n\nYou can download his updated, professional PDF resume anytime by clicking the **"Download Resume (PDF)"** button in the hero section or top navigation bar.`,
      suggestions: [
        '💼 Experience at IFP Pronote',
        '🚀 View featured projects',
        '📞 Contact details'
      ]
    }
  }

  // --- Default Fallback ---
  if (isFR) {
    return {
      text: `C'est une excellente question ! Je suis là pour vous aider à explorer le travail et le parcours d'**${name}**.\n\nSouhaitez-vous en savoir plus sur ses projets (ExchangeCompare Africa, PartoCare), sa stack technique (React, Laravel, Node.js), son stage chez IFP PRONOTE, ou comment le contacter ?`,
      suggestions: [
        '🚀 Explorer ses projets majeurs',
        '🛠️ Découvrir ses compétences',
        '💼 Son expérience en entreprise',
        '📞 Comment contacter Emekson ?'
      ]
    }
  }

  return {
    text: `That's a great question! I'm here to help you learn about **${name}**'s software engineering background.\n\nWould you like to explore his major projects (ExchangeCompare Africa, PartoCare), his core tech stack (React, Laravel, Node.js), his internship at IFP PRONOTE, or how to contact him?`,
    suggestions: [
      '🚀 Explore major projects',
      '🛠️ Discover his tech stack',
      '💼 Industry experience & internships',
      '📞 How to get in touch?'
    ]
  }
}
