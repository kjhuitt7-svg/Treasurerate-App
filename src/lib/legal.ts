// In-app summaries of the Terms and Privacy Policy, so the legal screens open without the
// website's navigation, cart or pricing pages. The full documents on treasurerate.com govern.

export type LegalSection = { heading: string; body: string };
export type LegalDoc = { title: string; updated: string; intro: string; sections: LegalSection[]; webKey: 'privacyWeb' | 'termsWeb' };

export const LEGAL: Record<'terms' | 'privacy', LegalDoc> = {
  terms: {
    title: 'Terms of Service',
    updated: 'October 23, 2026',
    webKey: 'termsWeb',
    intro: 'A short summary of the Terms for the TreasureRate Back Office app. The full Terms govern your use of the app.',
    sections: [
      {
        heading: 'The service',
        body: 'Back Office is a set of AI agents that help with everyday business writing and admin. Agents, features and pricing can change at any time. Results come from third-party AI models and are generated automatically.',
      },
      {
        heading: 'AI output and no professional advice',
        body: 'Results can be inaccurate or unsuitable. They are not legal, financial, tax or medical advice. Check every result before you send, post, sign or rely on it.',
      },
      {
        heading: 'Acceptable use',
        body: 'Do not use the app to break the law, create harmful or infringing content, disrupt the service, or misrepresent AI output as something it is not. Do not enter sensitive data such as health records or card numbers.',
      },
      {
        heading: 'Plans, credits and billing',
        body: 'Purchases are billed through Google Play or the Apple App Store. Plans renew automatically unless you cancel at least 24 hours before the period ends. Day passes give unlimited runs for 24 hours and do not renew. Credit packs do not expire and are stored on this device. You get 5 free credits each day, and each run costs 1 to 4 credits.',
      },
      {
        heading: 'Refunds',
        body: 'Store purchases are refunded under the policy of Google Play or the Apple App Store. Contact support@treasurerate.com if a charge looks wrong.',
      },
      {
        heading: 'Your content',
        body: 'You keep ownership of what you enter. You give TreasureRate a limited license to process it to run the service. You own the results you generate, subject to these Terms.',
      },
      {
        heading: 'Liability',
        body: 'The service is provided as is. To the extent the law allows, TreasureRate is not liable for indirect or consequential losses, and total liability is limited to what you paid in the previous 12 months.',
      },
      { heading: 'Governing law', body: 'California law applies.' },
      { heading: 'Contact', body: 'support@treasurerate.com' },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    updated: 'See full policy online',
    webKey: 'privacyWeb',
    intro: 'A short summary for the TreasureRate Back Office app, run by Driftwood Brands LLC, doing business as TreasureRate. The full Privacy Policy governs.',
    sections: [
      {
        heading: 'No account',
        body: 'The app has no sign-in. Your business details and run history are stored only on this phone.',
      },
      {
        heading: 'What leaves your phone',
        body: 'When you run an agent, the text you submit, along with your business details, is sent to TreasureRate, which uses third-party AI providers such as OpenAI and Anthropic to write the result. Photos and files are read on your phone, and only the text you choose to submit is sent.',
      },
      {
        heading: 'How it is used',
        body: 'Your text is used to produce your result and to run and secure the service. Content you submit to agents is not used to train TreasureRate\'s own AI models.',
      },
      {
        heading: 'Purchases',
        body: 'Google Play or the Apple App Store processes payment. RevenueCat receives an anonymous app ID, purchase details and approximate country to manage plans and credits.',
      },
      {
        heading: 'Sharing',
        body: 'We do not sell your personal information. Data is shared only with service providers such as AI model providers, hosting and purchase providers, or when the law requires it.',
      },
      {
        heading: 'Delete your data',
        body: 'Use "Delete all my data" in My Business to erase everything stored on this phone. To ask us to delete anything held on our side, email support@treasurerate.com with "Privacy request" in the subject. We respond within 30 days.',
      },
      {
        heading: 'Children',
        body: 'The app is not directed to anyone under 18.',
      },
      { heading: 'Contact', body: 'support@treasurerate.com' },
    ],
  },
};
