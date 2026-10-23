import type { BusinessProfile } from './store';

export type Field = {
  key: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
  required?: boolean;
};

export type Agent = {
  id: string;
  /** Agent number on the TreasureRate backend (POST /api/agents/{num}/run). */
  num: number;
  /** Hero character from the TreasureRate guilds (same cast as TreasureRate.com). */
  hero: string;
  /** Plain job line shown under the hero name. */
  name: string;
  tagline: string;
  icon: string; // Ionicons name
  group: 'Customers' | 'Marketing' | 'Admin' | 'Growth';
  /** Conservative estimate of minutes one run saves, shown as "est." in the app. */
  minutesSaved: number;
  fields: Field[];
  /** Task instruction sent ahead of the user's inputs. */
  task: string;
};

export const AGENTS: Agent[] = [
  {
    id: 'reply-writer',
    num: 15,
    hero: 'Dawit Bekele',
    name: 'Reply Writer',
    tagline: 'Answer a customer message in your voice',
    icon: 'chatbubble-ellipses-outline',
    group: 'Customers',
    minutesSaved: 10,
    task: 'Write a ready-to-send reply to this customer message. Match the business tone. Be specific, warm and brief. Do not invent policies, prices or promises that are not in the business details. Output only the reply.',
    fields: [
      { key: 'message', label: 'Customer message', placeholder: 'Paste the message you received', multiline: true, required: true },
      { key: 'goal', label: 'What you want to say (optional)', placeholder: 'e.g. offer a reschedule for Thursday' },
    ],
  },
  {
    id: 'review-responder',
    num: 22,
    hero: 'Qori Mamani',
    name: 'Review Responder',
    tagline: 'Public reply to any review, good or bad',
    icon: 'star-outline',
    group: 'Customers',
    minutesSaved: 8,
    task: 'Write a public reply to this online review, ready to post. Thank the reviewer by first name if given, reference something specific they said, and keep it under 90 words. For a negative review, acknowledge the problem without admitting legal fault, and invite them to continue privately. After the public reply, add a heading "Private follow-up" with a short direct message for a negative review, or "None needed" for a positive one.',
    fields: [
      { key: 'review', label: 'The review', placeholder: 'Paste the review text and star rating', multiline: true, required: true },
      { key: 'platform', label: 'Platform (optional)', placeholder: 'Google, Yelp, Facebook…' },
    ],
  },
  {
    id: 'rewrite',
    num: 62,
    hero: 'Tala Mercado',
    name: 'Rewrite in My Voice',
    tagline: 'Turn any rough draft into polished copy',
    icon: 'create-outline',
    group: 'Marketing',
    minutesSaved: 10,
    task: 'Rewrite the draft in the business voice. Fix grammar and clarity, keep every fact, and follow the requested tone and length. Output only the rewritten text.',
    fields: [
      { key: 'draft', label: 'Your draft', placeholder: 'Paste anything: an email, a post, a bio', multiline: true, required: true },
      { key: 'tone', label: 'Tone and length (optional)', placeholder: 'e.g. friendly, under 100 words' },
    ],
  },
  {
    id: 'social-week',
    num: 14,
    hero: 'Sina Faleolo',
    name: 'Social Week',
    tagline: 'A week of posts from one idea',
    icon: 'megaphone-outline',
    group: 'Marketing',
    minutesSaved: 45,
    task: 'Create 5 social media posts for the coming week from this idea, one per weekday. For each post give: the day, the platform best suited, the post text, and 3 to 5 hashtags. Vary the angle across the week (tip, story, offer, question, behind the scenes). Use only facts from the business details and the idea.',
    fields: [
      { key: 'idea', label: 'Idea, offer or news', placeholder: 'e.g. 20% off first cleaning this month', multiline: true, required: true },
      { key: 'platforms', label: 'Platforms (optional)', placeholder: 'Instagram, Facebook, LinkedIn' },
    ],
  },
  {
    id: 'content-factory',
    num: 51,
    hero: 'Chidinma Nwosu',
    name: 'Content Factory',
    tagline: 'Blog post, newsletter or promo email',
    icon: 'document-text-outline',
    group: 'Marketing',
    minutesSaved: 60,
    task: 'Write the requested piece of content for this business. Use a clear headline, short paragraphs and one call to action. Use only facts from the business details and the brief.',
    fields: [
      { key: 'type', label: 'What to write', placeholder: 'Blog post, newsletter, or promo email', required: true },
      { key: 'brief', label: 'Topic and key points', placeholder: 'What it should cover', multiline: true, required: true },
    ],
  },
  {
    id: 'invoice-estimate',
    num: 1,
    hero: 'Adaeze Nwankwo',
    name: 'Invoice & Estimate',
    tagline: 'Job notes in, clean invoice or estimate out',
    icon: 'receipt-outline',
    group: 'Admin',
    minutesSaved: 15,
    task: 'Create a professional document from these job notes. Use the business details for the "From" section. Show line items in a table with quantity, rate and amount, then subtotal and total. Leave tax as a clearly marked line if no rate is given. Double-check every calculation.',
    fields: [
      { key: 'docType', label: 'Invoice or estimate', placeholder: 'Invoice', required: true },
      { key: 'client', label: 'Client', placeholder: 'Name and address', required: true },
      { key: 'notes', label: 'Job notes', placeholder: '3 sessions at $250 each, $40 travel, net-15', multiline: true, required: true },
    ],
  },
  {
    id: 'expense-log',
    num: 2,
    hero: 'Emiliano Ibarra',
    name: 'Expense Log',
    tagline: 'Messy expenses into a categorized log',
    icon: 'wallet-outline',
    group: 'Admin',
    minutesSaved: 20,
    task: 'Turn these expenses into a categorized table with columns: date, vendor, category, amount. Use common small-business expense categories. Then give totals per category and a grand total. Flag anything that looks personal or duplicated. This is organizational help, not tax advice.',
    fields: [
      { key: 'expenses', label: 'Expenses', placeholder: 'Paste or type them, one per line', multiline: true, required: true },
      { key: 'period', label: 'Period (optional)', placeholder: 'e.g. September 2026' },
    ],
  },
  {
    id: 'contract-check',
    num: 9,
    hero: 'Kwabena Asante',
    name: 'Contract Check',
    tagline: 'Plain-English summary and red flags',
    icon: 'shield-checkmark-outline',
    group: 'Admin',
    minutesSaved: 30,
    task: 'Review this contract text for the business owner. Give: a plain-English summary in 5 bullets; key dates, payments and obligations; clauses that look one-sided or risky, each with why it matters; and questions to ask before signing. End with: "This is not legal advice. For important agreements, consult a licensed attorney."',
    fields: [
      { key: 'contract', label: 'Contract text', placeholder: 'Paste the contract or the clauses you care about', multiline: true, required: true },
      { key: 'role', label: 'Your side (optional)', placeholder: 'e.g. I am the contractor' },
    ],
  },
  {
    id: 'resume-tailor',
    num: 65,
    hero: 'Youssef Benali',
    name: 'Resume Tailor',
    tagline: 'Match your resume to a job post',
    icon: 'briefcase-outline',
    group: 'Growth',
    minutesSaved: 40,
    task: 'Compare the resume to the job post. Give: a match score out of 100 with one line of reasoning; the important keywords from the job post that are missing from the resume; then a tailored version of the resume that uses only experience the person actually has. Never invent jobs, degrees, dates or skills.',
    fields: [
      { key: 'resume', label: 'Your resume', placeholder: 'Paste your resume text', multiline: true, required: true },
      { key: 'job', label: 'Job post', placeholder: 'Paste the job description', multiline: true, required: true },
    ],
  },
  {
    id: 'listing-writer',
    num: 51,
    hero: 'Paloma Reyes',
    name: 'Listing Writer',
    tagline: 'Property listing plus social posts',
    icon: 'home-outline',
    group: 'Growth',
    minutesSaved: 35,
    task: 'Write a real estate listing description (150 to 250 words) from these property facts, then 2 short social posts announcing it. Describe the property, never the people who should live there. Avoid language that could violate fair-housing rules (for example references to family status, religion, race, disability, or words like "perfect for young couples"). Use only the facts given.',
    fields: [
      { key: 'facts', label: 'Property facts', placeholder: 'Beds, baths, sq ft, features, neighborhood, price', multiline: true, required: true },
      { key: 'style', label: 'Style (optional)', placeholder: 'e.g. luxury, cozy, investor-focused' },
    ],
  },
  {
    id: 'meeting-notes',
    num: 6,
    hero: 'Nadia Farouk',
    name: 'Meeting Notes',
    tagline: 'Messy notes into a summary and to-dos',
    icon: 'people-outline',
    group: 'Customers',
    minutesSaved: 20,
    task: 'Turn these meeting or call notes into: a 3 to 5 bullet summary; decisions made; action items as a table with owner and due date (write "not set" if none was given); and a short follow-up message to send to the other people. Use only what is in the notes.',
    fields: [
      { key: 'notes', label: 'Notes or transcript', placeholder: 'Paste your notes, voice-memo text or transcript', multiline: true, required: true },
      { key: 'who', label: 'Who was there (optional)', placeholder: 'e.g. me, Sam from Acme' },
    ],
  },
  {
    id: 'quote-follow-up',
    num: 8,
    hero: 'Luana Ferraz',
    name: 'Quote Follow-Up',
    tagline: 'Nudge a quote that went quiet',
    icon: 'paper-plane-outline',
    group: 'Customers',
    minutesSaved: 10,
    task: 'Write a short, friendly follow-up message about a quote or estimate the customer has not answered. Remind them what was quoted, make it easy to say yes or ask a question, and offer one helpful next step. No pressure tactics or fake deadlines. Then write a second, shorter follow-up to send a week later if there is still no reply.',
    fields: [
      { key: 'quote', label: 'What you quoted', placeholder: 'e.g. kitchen deep clean, $320, sent last Tuesday', multiline: true, required: true },
      { key: 'customer', label: 'Customer name (optional)', placeholder: 'e.g. Maria' },
    ],
  },
  {
    id: 'payment-reminder',
    num: 17,
    hero: 'Aurelio Castellano',
    name: 'Payment Reminder',
    tagline: 'Polite to firm reminders for late invoices',
    icon: 'cash-outline',
    group: 'Admin',
    minutesSaved: 15,
    task: 'Write three payment reminders for this overdue invoice: 1) a friendly reminder, 2) a firmer second notice a week later, 3) a final notice that states the next step the business will take. Include the invoice number, amount and due date in each. Stay professional and never threaten anything the business has not said it will do.',
    fields: [
      { key: 'invoice', label: 'Invoice details', placeholder: 'Invoice #, amount, due date, client name', multiline: true, required: true },
      { key: 'terms', label: 'Late fee or next step (optional)', placeholder: 'e.g. 1.5% monthly late fee, pause service' },
    ],
  },
  {
    id: 'policy-writer',
    num: 86,
    hero: 'Thandeka Mokoena',
    name: 'Policy Writer',
    tagline: 'Cancellation, refund and late policies',
    icon: 'document-lock-outline',
    group: 'Admin',
    minutesSaved: 30,
    task: 'Write a clear, customer-friendly policy for this business from the owner rules given. Use short headings and plain English. Add a one-paragraph version for a website or booking page. End with: "This is a template, not legal advice. Check local laws before you publish it."',
    fields: [
      { key: 'type', label: 'Which policy', placeholder: 'Cancellation, refund, late payment, no-show…', required: true },
      { key: 'rules', label: 'Your rules', placeholder: 'e.g. 24h notice or $50 fee, refunds within 7 days', multiline: true, required: true },
    ],
  },
  {
    id: 'job-post',
    num: 23,
    hero: 'Gitau Njoroge',
    name: 'Job Post Writer',
    tagline: 'A clear job ad for your next hire',
    icon: 'person-add-outline',
    group: 'Growth',
    minutesSaved: 30,
    task: 'Write a job post from these notes: a title, a 2-sentence intro to the business, responsibilities, must-have and nice-to-have requirements, pay and schedule if given, and how to apply. Use inclusive, plain language and avoid anything that would discourage applicants based on age, gender, race, religion, disability or family status. Then add 3 short screening questions.',
    fields: [
      { key: 'role', label: 'The role', placeholder: 'e.g. part-time cleaner, 15 hrs/week, $20/hr', multiline: true, required: true },
      { key: 'apply', label: 'How to apply (optional)', placeholder: 'e.g. email jobs@brightday.com' },
    ],
  },
];

export const GROUPS: Agent['group'][] = ['Customers', 'Marketing', 'Admin', 'Growth'];

export function getAgent(id: string) {
  return AGENTS.find((a) => a.id === id);
}

export function profileBlock(p: BusinessProfile) {
  const lines = [
    p.name && `Business name: ${p.name}`,
    p.owner && `Owner / signer: ${p.owner}`,
    p.services && `What we do: ${p.services}`,
    p.location && `Location: ${p.location}`,
    p.contact && `Contact: ${p.contact}`,
    p.tone && `Brand voice: ${p.tone}`,
    p.avoid && `Never say or promise: ${p.avoid}`,
  ].filter(Boolean);
  return lines.length ? lines.join('\n') : '';
}

export function buildInput(agent: Agent, values: Record<string, string>, profile: BusinessProfile) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const parts = [`TASK: ${agent.task}`, `TODAY'S DATE: ${today}. Use it for any dates, due dates or schedules.`];
  const biz = profileBlock(profile);
  if (biz) parts.push(`BUSINESS DETAILS (use these instead of placeholders):\n${biz}`);
  for (const f of agent.fields) {
    const v = values[f.key]?.trim();
    if (v) parts.push(`${f.label.replace(/ \(optional\)$/, '').toUpperCase()}:\n${v}`);
  }
  return parts.join('\n\n');
}

export function formatMinutes(min: number) {
  if (min < 60) return `${Math.round(min)} min`;
  const h = min / 60;
  return `${h >= 10 ? Math.round(h) : h.toFixed(1)} hr`;
}
