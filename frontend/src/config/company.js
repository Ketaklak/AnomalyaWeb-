/**
 * Configuration de l'entreprise
 * Modifiez ces valeurs pour personnaliser votre site
 */

export const COMPANY_INFO = {
  name: "Anomalya Corp",
  tagline: "L'Innovation Numérique à Votre Service",
  description: "Experts en développement web, maintenance informatique et solutions numériques innovantes",
  
  // Informations de contact
  contact: {
    address: "123 Rue de l'Innovation, 75001 Paris, France",
    phone: "+33 1 23 45 67 89",
    email: "contact@anomalya-corp.com",
    website: "https://anomalya-corp.com"
  },
  
  // Réseaux sociaux
  social: {
    linkedin: "https://linkedin.com/company/anomalya-corp",
    twitter: "https://twitter.com/anomalya_corp",
    facebook: "https://facebook.com/anomalya.corp",
    instagram: "https://instagram.com/anomalya.corp",
    youtube: "https://youtube.com/@anomalya-corp"
  },
  
  // Horaires d'ouverture
  hours: {
    weekdays: "Lundi - Vendredi : 9h00 - 18h00",
    saturday: "Samedi : 9h00 - 12h00",
    sunday: "Dimanche : Fermé",
    timezone: "Europe/Paris"
  },
  
  // Informations légales
  legal: {
    companyNumber: "12345678901234",
    vatNumber: "FR12345678901",
    address: "123 Rue de l'Innovation, 75001 Paris, France"
  },
  
  // Configuration SEO
  seo: {
    keywords: [
      "développement web",
      "maintenance informatique", 
      "solutions numériques",
      "Paris",
      "consultation IT",
      "applications web",
      "cybersécurité"
    ],
    defaultTitle: "Anomalya Corp - Innovation Numérique",
    defaultDescription: "Experts en développement web, maintenance informatique et solutions numériques. Contactez-nous pour transformer vos idées en réalité digitale."
  }
};

export const THEME_CONFIG = {
  // Couleurs principales
  colors: {
    primary: "#3b82f6",        // Bleu principal
    secondary: "#10b981",      // Vert accent
    accent: "#f59e0b",         // Orange CTA
    danger: "#ef4444",         // Rouge erreur
    warning: "#f59e0b",        // Orange warning
    success: "#10b981",        // Vert succès
    
    // Couleurs de fond
    background: {
      primary: "#0f172a",      // Fond principal (dark)
      secondary: "#1e293b",    // Fond secondaire
      card: "#334155",         // Fond cartes
      muted: "#64748b"         // Fond atténué
    },
    
    // Couleurs de texte
    text: {
      primary: "#f8fafc",      // Texte principal (blanc)
      secondary: "#cbd5e1",    // Texte secondaire
      muted: "#94a3b8",        // Texte atténué
      accent: "#3b82f6"        // Texte accent
    }
  },
  
  // Typographie
  fonts: {
    primary: "Inter, system-ui, sans-serif",
    heading: "Inter, system-ui, sans-serif",
    mono: "Fira Code, Monaco, monospace"
  },
  
  // Espacements
  spacing: {
    section: "6rem",         // Espacement entre sections
    container: "2rem",       // Padding container
    element: "1.5rem"        // Espacement éléments
  },
  
  // Animations
  animations: {
    duration: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms"
    },
    easing: "cubic-bezier(0.4, 0, 0.2, 1)"
  }
};

export const FEATURES_CONFIG = {
  // Fonctionnalités activées
  enableAnalytics: true,
  enableChat: false,
  enableNewsletter: true,
  enableBlog: true,
  enableMultiLanguage: false,
  enableDarkMode: true,
  enableNotifications: true,
  
  // Limites
  maxUploadSize: 5 * 1024 * 1024, // 5MB
  maxImagesPerArticle: 10,
  maxTagsPerArticle: 8,
  
  // Pagination
  itemsPerPage: {
    articles: 12,
    services: 6,
    testimonials: 9,
    users: 20
  }
};