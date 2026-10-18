import type { ImageSourcePropType } from 'react-native';

/** Hero portraits, cropped from the TreasureRate.com guild art. Keyed by agent id. */
export const HERO_IMAGES: Record<string, ImageSourcePropType> = {
  'reply-writer': require('../../assets/heroes/dawit-bekele-customer-support.webp'),
  'review-responder': require('../../assets/heroes/qori-mamani-feedback.webp'),
  'meeting-notes': require('../../assets/heroes/nadia-farouk-meetings.webp'),
  'quote-follow-up': require('../../assets/heroes/luana-ferraz-leads.webp'),
  rewrite: require('../../assets/heroes/tala-mercado-brand-voice.webp'),
  'social-week': require('../../assets/heroes/sina-faleolo-social-media.webp'),
  'content-factory': require('../../assets/heroes/chidinma-nwosu-content-writing.webp'),
  'invoice-estimate': require('../../assets/heroes/adaeze-nwankwo-invoicing.webp'),
  'payment-reminder': require('../../assets/heroes/aurelio-castellano-budget.webp'),
  'expense-log': require('../../assets/heroes/emiliano-ibarra-expenses.webp'),
  'contract-check': require('../../assets/heroes/kwabena-asante-contracts.webp'),
  'policy-writer': require('../../assets/heroes/thandeka-mokoena-legal-drafting.webp'),
  'resume-tailor': require('../../assets/heroes/youssef-benali-creative-portfolio.webp'),
  'listing-writer': require('../../assets/heroes/paloma-reyes-seo-optimization.webp'),
  'job-post': require('../../assets/heroes/gitau-njoroge-recruiting.webp'),
};
