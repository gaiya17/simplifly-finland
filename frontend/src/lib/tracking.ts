/**
 * GA4 Tracking Utilities
 * Provides type-safe wrapper functions for firing Google Analytics events.
 */

// Declare the global gtag function
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Fires a standard GA4 `generate_lead` event when a user submits an inquiry form.
 * @param eventLabel e.g., 'Maldives Resort Inquiry', 'Sri Lanka Tour Inquiry'
 * @param packageName The specific package or resort name
 */
export const trackLeadGeneration = (eventLabel: string, packageName: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'generate_lead', {
      event_category: 'Inquiry',
      event_label: eventLabel,
      package_name: packageName,
      value: 0,
      currency: 'EUR',
    });
  } else {
    console.log('[Tracking] generate_lead:', { eventLabel, packageName });
  }
};

/**
 * Fires a custom `whatsapp_click` event when a user clicks a WhatsApp link.
 * @param location Where the click originated (e.g., 'Header', 'Footer', 'Resort Package', 'Chatbot')
 * @param details Optional additional context (e.g., package name)
 */
export const trackWhatsAppClick = (location: string, details?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'whatsapp_click', {
      event_category: 'Engagement',
      event_label: location,
      details: details || '',
    });
  } else {
    console.log('[Tracking] whatsapp_click:', { location, details });
  }
};
