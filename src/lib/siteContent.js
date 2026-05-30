// Editable page-content blocks (section headings, badges, page hero copy).
// Each key maps to a JSON blob stored in SiteSetting. DEFAULTS are used as
// fallbacks so the site always renders even before the admin edits anything.

export const CONTENT_DEFAULTS = {
  home_sections: {
    aboutEyebrow: 'Who we are',
    productsEyebrow: 'Our catalogue',
    productsTitle: 'Explore our',
    productsHighlight: 'Products',
    productsSubtitle: 'Browse our range of pharmaceutical products by category.',
    testimonialsEyebrow: 'Testimonials',
    testimonialsTitle: 'What our',
    testimonialsHighlight: 'partners say',
    testimonialsSubtitle: 'Trusted by pharmacies and distributors across the country.',
    faqsEyebrow: 'FAQs',
    faqsTitle: 'Frequently asked',
    faqsHighlight: 'questions',
    faqsSubtitle: 'Quick answers about ordering, supply and partnerships.',
    trustBadges: [
      { icon: 'truck', label: 'Pan-India bulk supply' },
      { icon: 'shield', label: 'Quality assured stock' },
      { icon: 'award', label: 'WHO-GMP certified' },
      { icon: 'check', label: 'Trusted by pharmacies' },
    ],
  },
  products_page: {
    heroTitle: 'Our Products',
    heroSubtitle: 'Bulk pharmaceutical products for pharmacies & distributors',
  },
  contact_page: {
    badge: "We're here to help",
    heroTitle: 'Get In',
    heroHighlight: 'Touch',
    heroSubtitle: 'Have questions about bulk orders, pricing or partnerships? Our team is ready to assist you.',
    formHeading: "We'd love to hear from you!",
    formSubtitle: "Whether you're a pharmacy, distributor, or healthcare provider — send us a message and we'll respond promptly.",
    whatsappHeading: 'Quick Connect via WhatsApp',
    whatsappSubtitle: 'Need immediate assistance? Chat with us directly.',
    availability: 'Available Mon–Sat, 10:00 AM – 7:00 PM',
  },
  footer: {
    tagline: 'B2B Pharmaceutical Supplier',
  },
};

export const CONTENT_KEYS = Object.keys(CONTENT_DEFAULTS);

export function withDefaults(key, value) {
  const def = CONTENT_DEFAULTS[key] || {};
  return { ...def, ...(value || {}) };
}
