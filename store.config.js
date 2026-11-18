/**
 * App Store listing for TreasureRate Back Office, uploaded with EAS Metadata.
 *
 *   npx eas-cli@latest metadata:push
 *
 * This only fills in the listing, age rating and review details for the version
 * below. It does not submit the app for review, touch in-app purchases, App Privacy
 * answers or screenshots. Those stay in App Store Connect.
 *
 * App Review contact details are only sent when REVIEW_PHONE is set, because Apple
 * requires a phone number with them, for example:
 *
 *   REVIEW_PHONE="+1 408 555 0100" npx eas-cli@latest metadata:push
 *
 * Docs: https://docs.expo.dev/eas/metadata/
 */

const DESCRIPTION = `TreasureRate Back Office is an AI business assistant for solo owners, freelancers and small teams. Fifteen AI agents, each a character from the TreasureRate guilds, handle the writing and admin that eat your week: invoices and estimates, receipts and expenses, customer replies, review responses, social posts, contracts, payment reminders, job posts and more.

Tell it about your business once. Every tool uses your name, services, prices and tone, so results come back ready to send instead of full of blanks.

REPLY TO CUSTOMERS AND REVIEWS
• Reply Writer: paste a customer message and get a clear, friendly reply in your voice.
• Review Responder: reply to Google, Yelp and Facebook reviews. It thanks happy customers by name, and for bad reviews it writes a calm public response plus a private follow-up.
• Meeting Notes: turn messy call or meeting notes into a summary, action items and a follow-up message.
• Quote Follow-Up: a friendly nudge for an estimate that went quiet, plus a second follow-up for later.

MARKETING CONTENT
• Social Week: turn one idea or offer into five social posts with captions and hashtags.
• Content Factory: write a blog post, newsletter or promo email from a short brief.
• Rewrite in My Voice: paste a rough draft and get polished copy that keeps every fact.

INVOICES, ESTIMATES AND ADMIN
• Invoice & Estimate: type your job notes and get a clean invoice or estimate with line items and totals.
• Payment Reminder: three reminders for an overdue invoice, from friendly to final notice.
• Expense Log: snap your receipts or paste messy expenses and get a categorized list with totals.
• Contract Check: photograph or paste a contract and get a plain-English summary, key dates and payments, and the clauses worth questioning. Not legal advice.
• Policy Writer: turn your rules into a clear cancellation, refund or late-payment policy. A template, not legal advice.

GROW
• Resume Tailor: compare your resume to a job post, see missing keywords, and get a tailored version that never invents experience.
• Job Post Writer: turn hiring notes into an inclusive job ad with screening questions.
• Listing Writer: turn property facts into a real estate listing and social posts.

WHY OWNERS USE IT
• Built for real tasks, not a blank chat box.
• Skip the typing: snap a photo, pick a screenshot or upload a text file, and the text drops right in.
• Your voice, every time. Save your tone and the things you never want to promise.
• Every run shows an estimate of the minutes it saved you.
• Copy or share any result in one tap.

FREE TO START, PRICED BY THE HOURS IT SAVES
• Free credits every day. Tools that save more time cost a little more per run (1 to 4 credits).
• Want more? Get a Week, Month or Year plan for unlimited runs on every tool, a one-day pass, or a credit pack that never expires.

PRIVATE BY DESIGN
• No account or sign-up needed.
• Your business details and history stay on your iPhone.
• Text in your photos is read on your iPhone. The photos themselves are never uploaded.
• What you enter into a tool is sent to TreasureRate and its AI providers only to generate that result.
• Delete all your data from the app at any time.

GOOD TO KNOW
Results are AI-generated. Review anything before you send, post or sign it. Contract Check and Expense Log help you organize and understand; they are not legal, tax or accounting advice. Tap Report on any result to flag a problem.

SUBSCRIPTIONS
Week, Month and Year plans renew automatically unless cancelled at least 24 hours before the end of the current period. Payment is charged to your Apple ID. Manage or cancel in your Apple ID account settings. Day passes and credit packs are one-time purchases and are stored on this device.

Terms of Use: https://www.treasurerate.com/terms
Privacy Policy: https://www.treasurerate.com/privacy

TreasureRate is made by Driftwood Brands LLC in San Jose, California. Questions or ideas: support@treasurerate.com`;

const REVIEW_NOTES = `Back Office needs no account or login, so no demo account is needed. Open the app and tap any agent on the Agents tab. The first run shows a consent screen explaining that entered text is sent to our servers and our AI providers (OpenAI and Anthropic). Tap "I agree".

The business details in My Business are sample data we entered for testing. Results are AI-generated, labeled as such, and only shown to the person who ran the agent. Every result has a Report output button.

In-app purchases: Week, Month and Year auto-renewing plans (subscription group "All agents") unlock unlimited runs on every agent. A 24-hour Day Pass and three credit packs are consumables. Everyone gets 5 free credits a day. Restore Purchases restores plans and active day passes; used credits are not restorable by design, and the paywall says credits are stored on the device. To see the paywall, run agents until the free credits run out, or open My Business and tap See plans & credits.

Camera and Photos are used only to read text from documents on the device. Images are not uploaded.

Contact: support@treasurerate.com`;

const reviewPhone = process.env.REVIEW_PHONE;

const config = {
  configVersion: 0,
  apple: {
    version: '1.1.1',
    copyright: '2026 Driftwood Brands LLC',
    categories: ['BUSINESS', 'PRODUCTIVITY'],
    info: {
      'en-US': {
        title: 'TreasureRate Back Office',
        subtitle: '15 AI agents for your business',
        promoText:
          'Get your back office in order. 15 AI agents on your iPhone, priced by hours saved, not seats. Start free with 5 credits a day, no sign-up needed.',
        description: DESCRIPTION,
        keywords: [
          'automation',
          'assistant',
          'marketplace',
          'workflow',
          'small',
          'entrepreneur',
          'solopreneur',
          'startup',
          'admin',
          'tasks',
          'helper',
        ],
        marketingUrl: 'https://www.treasurerate.com',
        supportUrl: 'https://www.treasurerate.com',
        privacyPolicyUrl: 'https://www.treasurerate.com/privacy',
      },
    },
    advisory: {
      alcoholTobaccoOrDrugUseOrReferences: 'NONE',
      contests: 'NONE',
      gamblingSimulated: 'NONE',
      gunsOrOtherWeapons: 'NONE',
      horrorOrFearThemes: 'NONE',
      matureOrSuggestiveThemes: 'NONE',
      medicalOrTreatmentInformation: 'NONE',
      profanityOrCrudeHumor: 'NONE',
      sexualContentGraphicAndNudity: 'NONE',
      sexualContentOrNudity: 'NONE',
      violenceCartoonOrFantasy: 'NONE',
      violenceRealistic: 'NONE',
      violenceRealisticProlongedGraphicOrSadistic: 'NONE',
      gambling: false,
      lootBox: false,
      unrestrictedWebAccess: false,
      advertising: false,
      ageAssurance: false,
      healthOrWellnessTopics: false,
      messagingAndChat: false,
      parentalControls: false,
      userGeneratedContent: false,
      kidsAgeBand: null,
      ageRatingOverride: 'NONE',
      koreaAgeRatingOverride: 'NONE',
    },
    release: {
      // Release by hand after approval, so launch day is your call.
      automaticRelease: false,
    },
  },
};

if (reviewPhone) {
  config.apple.review = {
    firstName: 'Kenneth',
    lastName: 'Huitt',
    email: 'support@treasurerate.com',
    phone: reviewPhone,
    demoRequired: false,
    notes: REVIEW_NOTES,
  };
} else {
  console.warn('REVIEW_PHONE is not set, so App Review contact details and notes are skipped.');
}

module.exports = config;
