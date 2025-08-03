/**
 * Configuration Analytics
 * Configurez vos outils d'analytics et de tracking
 */

export const ANALYTICS_CONFIG = {
  // Google Analytics 4
  googleAnalytics: {
    measurementId: process.env.REACT_APP_GA_MEASUREMENT_ID || "",
    enabled: process.env.REACT_APP_ENABLE_GA === "true",
    anonymizeIp: true,
    cookieExpires: 365 * 24 * 60 * 60, // 1 an en secondes
  },
  
  // Facebook Pixel
  facebookPixel: {
    pixelId: process.env.REACT_APP_FB_PIXEL_ID || "",
    enabled: process.env.REACT_APP_ENABLE_FB_PIXEL === "true"
  },
  
  // Hotjar
  hotjar: {
    hjid: process.env.REACT_APP_HOTJAR_ID || "",
    hjsv: process.env.REACT_APP_HOTJAR_VERSION || "6",
    enabled: process.env.REACT_APP_ENABLE_HOTJAR === "true"
  },
  
  // Microsoft Clarity
  clarity: {
    projectId: process.env.REACT_APP_CLARITY_ID || "",
    enabled: process.env.REACT_APP_ENABLE_CLARITY === "true"
  },
  
  // Événements personnalisés
  events: {
    // Actions utilisateur
    pageView: "page_view",
    contactForm: "contact_form_submission",
    quoteRequest: "quote_request_submission",
    newsletterSignup: "newsletter_signup",
    downloadResource: "resource_download",
    
    // Engagement
    articleView: "article_view",
    articleShare: "article_share",
    serviceView: "service_view",
    portfolioView: "portfolio_view",
    
    // E-commerce (si applicable)
    addToCart: "add_to_cart",
    beginCheckout: "begin_checkout",
    purchase: "purchase",
    
    // Erreurs et performance
    jsError: "javascript_error",
    slowPageLoad: "slow_page_load",
    apiError: "api_error"
  },
  
  // Configuration des cookies
  cookies: {
    consentRequired: true,
    categories: {
      necessary: {
        name: "Nécessaires",
        description: "Ces cookies sont essentiels au fonctionnement du site",
        required: true
      },
      analytics: {
        name: "Analytiques",
        description: "Ces cookies nous aident à comprendre comment vous utilisez notre site",
        required: false
      },
      marketing: {
        name: "Marketing",
        description: "Ces cookies sont utilisés pour vous proposer des publicités pertinentes",
        required: false
      },
      preferences: {
        name: "Préférences",
        description: "Ces cookies mémorisent vos préférences sur notre site",
        required: false
      }
    }
  }
};

/**
 * Initialiser Google Analytics
 */
export const initGoogleAnalytics = () => {
  if (!ANALYTICS_CONFIG.googleAnalytics.enabled || !ANALYTICS_CONFIG.googleAnalytics.measurementId) {
    return;
  }
  
  // Charger le script GA4
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.googleAnalytics.measurementId}`;
  document.head.appendChild(script);
  
  // Initialiser gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', ANALYTICS_CONFIG.googleAnalytics.measurementId, {
    anonymize_ip: ANALYTICS_CONFIG.googleAnalytics.anonymizeIp,
    cookie_expires: ANALYTICS_CONFIG.googleAnalytics.cookieExpires
  });
};

/**
 * Envoyer un événement personnalisé
 */
export const trackEvent = (eventName, parameters = {}) => {
  // Google Analytics
  if (window.gtag && ANALYTICS_CONFIG.googleAnalytics.enabled) {
    window.gtag('event', eventName, parameters);
  }
  
  // Facebook Pixel
  if (window.fbq && ANALYTICS_CONFIG.facebookPixel.enabled) {
    window.fbq('track', eventName, parameters);
  }
  
  // Console log en développement
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', eventName, parameters);
  }
};

/**
 * Tracker une page vue
 */
export const trackPageView = (pagePath, pageTitle) => {
  trackEvent(ANALYTICS_CONFIG.events.pageView, {
    page_path: pagePath,
    page_title: pageTitle
  });
};