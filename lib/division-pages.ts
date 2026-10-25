import type { MediaImage } from './media';
import type { DivisionSlug, Point } from './site-data';

/* ------------------------------------------------------------------
   The four division pages (/software, /automation, /ai, /creatives).
   Facts confirmed by the owner (2026-10-24): clients own the code and
   models, no client data is retained, automation runs on hitroo's own
   platform, every engagement starts with a free call, and Creatives is
   done for you with results in the client's dashboard.
   ------------------------------------------------------------------ */

/** One thing a division builds, opened in the capability explorer. */
export interface Capability {
  title: string;
  text: string;
  included: string[];
  href?: string;
}

/**
 * A division image: art-directed from references and approved by the owner (public/photos/divisions/, or the same
 * files in object storage once uploaded; see lib/media.ts).
 */
export interface DivisionImage extends MediaImage {
  /** Under text: how strongly the char scrim covers it (0 to 1; default 0.75). Dark photos need less. */
  dim?: number;
}

/** A division's signature opening: its image as the background of a large card, with the headline over it. */
export interface DivisionHero extends DivisionImage {
  /** Text colour over the image: char on light images, white on dark ones. */
  theme: 'light' | 'dark';
  /** Mirror the image, to put its darker side under the text. */
  flip?: boolean;
}

/** The Creatives colours: content on that page is colourful (the page frame stays hitroo). */
export type CreativeTint = 'ember' | 'pink' | 'yellow' | 'lime' | 'teal' | 'lilac' | 'cobalt' | 'char';

/** One reel on the Creatives page: a vertical still with its content format. */
export interface Reel extends DivisionImage {
  format: string;
  /** The format chip's colour. */
  tint?: CreativeTint;
  /** An on-screen caption, set in HTML in one of the trending caption looks. */
  caption?: string;
  captionStyle?: CaptionStyle;
  /** The caption's highlight colour. */
  captionTint?: CreativeTint;
}

/** The trending caption looks (components/warm/reels/ReelCaption). */
export type CaptionStyle =
  | 'subtitle'
  | 'box'
  | 'boxWhite'
  | 'hormozi'
  | 'karaoke'
  | 'pill'
  | 'serif'
  | 'typewriter'
  | 'sticker'
  | 'outline'
  | 'meme'
  | 'vox'
  | 'voxLabel';

/** A square post on the Creatives page. */
export interface Post extends DivisionImage {
  format: string;
  tint?: CreativeTint;
}

export interface DivisionPageContent {
  slug: DivisionSlug;
  hero?: DivisionHero;
  /** Its image on cards (home, What we do, other divisions); without one, the card shows the glass numeral. */
  visual?: DivisionImage;
  /** Images in equal panels under the page's opening. */
  gallery?: DivisionImage[];
  /** Behind the dark standards card, under a char scrim. */
  standardsImage?: DivisionImage;
  metaTitle: string;
  description: string;
  title: string;
  lede: string;
  /** When to call us: a two-line statement and three signs. */
  signs: { title: string; lede: string; items: Point[] };
  build: { title: string; items: Capability[] };
  /** One process shown start to finish, in five steps. */
  flow?: { caption: string; title: string; steps: Point[] };
  /** Two equal lists side by side: who does what. */
  split?: { caption: string; title: string; left: { label: string; items: string[] }; right: { label: string; items: string[] } };
  /** Six standards, on the dark card. */
  commitments: Point[];
  /** How a project runs, in four glass-numbered steps. */
  steps?: { title: string; items: [string, string][] };
  engagements?: { title: string; text: string; fit: string }[];
  faq: { q: string; a: string }[];
  closing: { title: string; line: string };
}

const PRICE = { q: 'How much does it cost?', a: 'It depends on the scope. After a free call, we send you a clear scope and estimate.' };

export const DIVISION_PAGES: Record<DivisionSlug, DivisionPageContent> = {
  software: {
    slug: 'software',
    visual: { src: '/photos/divisions/software-code.webp', alt: 'The code symbol in clear glass, wrapped in green vines and ember poppies', position: '70% 50%' },
    hero: { src: '/photos/divisions/software-code.webp', alt: 'The code symbol in clear glass, wrapped in green vines and ember poppies', theme: 'light', position: '60% 50%' },
    standardsImage: { src: '/photos/divisions/software-night.webp', alt: '', position: '50% 50%', dim: 0.35 },
    metaTitle: 'Software — Custom platforms, mobile and desktop apps',
    description:
      'hitroo Software designs, engineers and operates custom web platforms, mobile and desktop applications, APIs and cloud infrastructure. From discovery to operations, and you own the code.',
    title: 'From first sketch to production, and every release after.',
    lede: 'Custom platforms, mobile and desktop applications, designed, engineered and kept running for you.',
    signs: {
      title: 'Off-the-shelf tools make you work their way.',
      lede: 'We build software that works yours.',
      items: [
        { title: 'Data copied between tools', text: 'Your team re-types the same information into three systems.' },
        { title: 'Reports built by hand', text: 'Numbers take days to assemble and are out of date when they arrive.' },
        { title: 'Processes bent to fit the software', text: 'The tool decides how your business works, not the other way round.' },
      ],
    },
    build: {
      title: 'Six capabilities, one engineering team.',
      items: [
        {
          title: 'Web platforms and portals',
          text: 'Customer-facing products, client portals and internal tools, modelled on how your business actually works.',
          included: ['Web applications and internal tools', 'Workflow and operations systems', 'Dashboards and reporting', 'Data modelling and databases'],
          href: '/services/custom-software',
        },
        {
          title: 'Mobile applications',
          text: 'Fast, reliable apps for iOS and Android, shipped to both stores and kept up to date.',
          included: ['Native iOS and Android', 'Cross-platform with React Native and Flutter', 'Offline-first and sync', 'App Store and Play Store delivery'],
          href: '/services/mobile-apps',
        },
        {
          title: 'Desktop applications',
          text: 'Software for Windows, macOS and Linux when the work needs power, hardware or offline use.',
          included: ['Windows, macOS and Linux builds', 'System and hardware integration', 'Auto-update and crash reporting', 'Local-first data and sync'],
          href: '/services/desktop-apps',
        },
        {
          title: 'APIs and integrations',
          text: 'Your new software connected to the systems you already run, so data flows without re-typing.',
          included: ['APIs for your products and partners', 'Third-party integrations', 'Data sync between systems', 'CRM, ERP and accounting connections'],
          href: '/services/custom-software',
        },
        {
          title: 'Cloud architecture',
          text: 'Infrastructure designed for your load today and ready for the growth you expect.',
          included: ['Cloud architecture and hosting', 'Scaling and reliability', 'Monitoring and alerting', 'Infrastructure as code'],
          href: '/services/managed-services',
        },
        {
          title: 'Managed services',
          text: 'We host, monitor and maintain what we build, so your team can focus on the business.',
          included: ['Managed infrastructure', 'Dedicated support engineering', 'Monitoring and maintenance', 'Updates and security patches'],
          href: '/services/managed-services',
        },
      ],
    },
    commitments: [
      { title: 'Working software early', text: 'You use a working build early, then a new version every iteration.' },
      { title: 'Start to finish', text: 'The people who design and build it are the people who support it.' },
      { title: 'You own the code', text: 'Everything we write for you is yours to keep and run.' },
      { title: 'Tested at every step', text: 'Every change is tested before it reaches your users.' },
      { title: 'Security-checked before release', text: 'Security is reviewed as part of every release, not added later.' },
      { title: 'No client data retained', text: 'We don’t keep your data once the work is done.' },
    ],
    steps: {
      title: 'Four stages, each one visible to you.',
      items: [
        ['Discovery', 'We study your operations, users and existing systems before proposing a solution.'],
        ['Scope and design', 'Architecture, scope and clickable designs, agreed before development starts.'],
        ['Delivery', 'Working releases in short iterations, each reviewed with your team.'],
        ['Operations', 'Monitoring, maintenance and support by the team that built it.'],
      ],
    },
    engagements: [
      { title: 'A project', text: 'A defined scope and plan. We design, build and launch it, then support it.', fit: 'Best for a new product or system.' },
      { title: 'A dedicated team', text: 'Our engineers and designers working as part of yours, for as long as you need.', fit: 'Best for an ongoing roadmap.' },
      { title: 'Managed services', text: 'We take over hosting, monitoring and maintenance of software you already have.', fit: 'Best for systems already in use.' },
    ],
    faq: [
      { q: 'Who owns the code?', a: 'You do. Everything we write for you is yours to keep and run.' },
      PRICE,
      { q: 'How long does a project take?', a: 'It depends on the scope. You see working software early, and a new version every iteration after that.' },
      { q: 'Do you keep our data?', a: 'No. We don’t retain client data.' },
      { q: 'Can you work with our existing systems?', a: 'Yes. We connect new software to the systems you already run through APIs and integrations.' },
      { q: 'What happens after launch?', a: 'The engineers who built it stay on it. Raise anything in the hitroo app and follow it from report to release.' },
    ],
    closing: { title: 'Have a system in mind?', line: 'Tell us what it needs to do. We reply within a day.' },
  },

  automation: {
    slug: 'automation',
    visual: { src: '/photos/divisions/automation-wave.webp', alt: 'A twisting ribbon of fine ember lines on paper' },
    hero: { src: '/photos/divisions/automation-ribbons.webp', alt: 'Two ribbons of fine ember lines crossing and twisting on paper', theme: 'light', position: '50% 90%' },
    metaTitle: 'Automation — Workflow automation and AI agents',
    description:
      'hitroo Automation runs your repetitive work on our own automation platform: workflow automation, AI agents, document processing and integrations with the tools you already use, with people approving the steps that matter.',
    title: 'The repetitive work, handled by systems.',
    lede: 'Workflow automation and AI agents on our own automation platform, connected to the tools you already use.',
    signs: {
      title: 'Repetitive work quietly eats your team’s week.',
      lede: 'Automation gives it back.',
      items: [
        { title: 'Data typed in twice', text: 'The same details entered into the CRM, the spreadsheet and the invoice.' },
        { title: 'Approvals stuck in inboxes', text: 'Requests wait until someone notices the email.' },
        { title: 'Reports assembled by hand', text: 'Hours every week copying numbers into the same report.' },
      ],
    },
    build: {
      title: 'Six capabilities, one platform.',
      items: [
        {
          title: 'Workflow automation',
          text: 'Approvals, hand-offs and scheduled reports that run end to end.',
          included: ['Approval flows', 'Hand-offs between teams', 'Scheduled reports', 'Reminders and follow-ups'],
          href: '/services/ai-automation',
        },
        {
          title: 'AI agents',
          text: 'Agents that read, decide and act inside your existing tools, within the permissions you set.',
          included: ['Agents that use your tools', 'Conversational assistants', 'Request and email triage', 'Permission-scoped actions'],
          href: '/services/ai-automation',
        },
        {
          title: 'Document processing',
          text: 'Invoices, forms and emails read, checked and filed without re-typing.',
          included: ['Invoice and receipt extraction', 'Form and contract reading', 'Checks against your records', 'Filing into your systems'],
          href: '/services/ai-automation',
        },
        {
          title: 'System integration',
          text: 'Your CRM, ERP, accounting and messaging tools, finally sharing data.',
          included: ['CRM and ERP connections', 'Accounting and finance tools', 'Spreadsheets and databases', 'Messaging and email'],
          href: '/services/ai-automation',
        },
        {
          title: 'Human approval',
          text: 'Sensitive steps pause for a person, so automation never acts beyond what you allow.',
          included: ['Approval checkpoints', 'Role-based permissions', 'Exceptions routed to people', 'A record of every decision'],
          href: '/services/ai-automation',
        },
        {
          title: 'Run monitoring',
          text: 'Every run is logged and visible, and failures are caught early.',
          included: ['Run history and logs', 'Failure alerts', 'Hours-saved reporting', 'Ongoing tuning'],
          href: '/services/ai-automation',
        },
      ],
    },
    flow: {
      caption: 'One workflow, start to finish',
      title: 'An invoice, from inbox to accounts.',
      steps: [
        { title: 'Arrives', text: 'The invoice lands in a shared inbox.' },
        { title: 'Read', text: 'Supplier, amounts and dates are extracted.' },
        { title: 'Checked', text: 'Matched against the order and your records.' },
        { title: 'Approved', text: 'Above your limit, it waits for a person.' },
        { title: 'Filed', text: 'Entered in your accounting system and logged.' },
      ],
    },
    split: {
      caption: 'Who does what',
      title: 'Systems do the routine. People make the calls.',
      left: { label: 'Our platform handles', items: ['Collecting and entering data', 'Routing requests and documents', 'Running scheduled reports', 'Following up on pending steps'] },
      right: { label: 'Your team decides', items: ['Approvals above your limits', 'Exceptions and edge cases', 'Conversations that need judgement', 'Which workflow comes next'] },
    },
    commitments: [
      { title: 'Runs on our own platform', text: 'Your workflows run on the automation platform we build and operate.' },
      { title: 'Costliest workflow first', text: 'We start where your team loses the most hours.' },
      { title: 'Permissions you control', text: 'Automation acts only within the access you give it.' },
      { title: 'People approve what matters', text: 'Sensitive steps wait for a person’s approval.' },
      { title: 'Every run logged', text: 'Each run is recorded, so you can see what happened and when.' },
      { title: 'One workflow at a time', text: 'Each workflow is measured before we automate the next.' },
    ],
    steps: {
      title: 'Start with one workflow. Measure it. Expand.',
      items: [
        ['Find the busywork', 'We map where your team’s hours actually go.'],
        ['Automate one workflow', 'The costliest one, built and tested first.'],
        ['Keep people in the loop', 'Sensitive steps wait for approval from your team.'],
        ['Measure, then expand', 'Hours saved and errors avoided, then the next workflow.'],
      ],
    },
    engagements: [
      { title: 'A first workflow', text: 'We automate your costliest workflow end to end and measure the result.', fit: 'Best for proving the value first.' },
      { title: 'An automation programme', text: 'Workflow after workflow, prioritised by the hours each one saves.', fit: 'Best for operations-heavy teams.' },
      { title: 'Managed automation', text: 'We run, monitor and tune your automations on our platform.', fit: 'Best once workflows are live.' },
    ],
    faq: [
      { q: 'Will automation replace my team?', a: 'No. It takes the repetitive work, so your team can do the work that needs people.' },
      { q: 'Where do the automations run?', a: 'On the hitroo automation platform, which we build and operate. It connects to the tools you already use.' },
      { q: 'Which tools can it connect to?', a: 'Most tools with an API or an inbox: CRMs, spreadsheets, accounting and messaging apps.' },
      { q: 'Is it safe to let AI act on our data?', a: 'Agents act only with the permissions you give them, and sensitive steps wait for a person’s approval.' },
      { q: 'Where do we start?', a: 'With the one workflow that costs the most hours. We automate it, measure it, then move to the next.' },
      PRICE,
    ],
    closing: { title: 'Know a workflow that eats your week?', line: 'Tell us about it. We reply within a day.' },
  },

  ai: {
    slug: 'ai',
    visual: { src: '/photos/divisions/ai-glass.webp', alt: 'Ember light broken into ribbons behind fluted glass' },
    hero: { src: '/photos/divisions/ai-glass.webp', alt: 'Ember light broken into ribbons behind fluted glass', theme: 'dark', flip: true },
    standardsImage: { src: '/photos/divisions/ai-glass-tall.webp', alt: '', position: '50% 70%' },
    metaTitle: 'AI — Custom models, private language models and vision',
    description:
      'hitroo AI trains custom models on your data, deploys private language models in your cloud or on your servers, offers ready in-house models and builds computer-vision systems for quality inspection. You own the model; we retain no client data.',
    title: 'AI that understands your business.',
    lede: 'Custom models, private language models and vision systems, trained on your data and deployed where you choose.',
    signs: {
      title: 'Generic AI doesn’t know your business.',
      lede: 'Ours learns it.',
      items: [
        { title: 'Answers that miss your context', text: 'General models don’t know your products, customers or numbers.' },
        { title: 'Data that can’t leave the building', text: 'Public AI tools are off-limits when your data is sensitive.' },
        { title: 'Inspection that relies on tired eyes', text: 'Manual checks are slow, inconsistent and miss defects.' },
      ],
    },
    build: {
      title: 'Six capabilities, one AI team.',
      items: [
        {
          title: 'Custom models',
          text: 'Models trained and fine-tuned on your own data, for your domain.',
          included: ['Custom training and fine-tuning', 'Data preparation and labelling', 'Vision and multimodal models', 'Evaluation on your cases'],
          href: '/services/ai-models',
        },
        {
          title: 'In-house models',
          text: 'Our own models, ready to deploy and tune to your needs.',
          included: ['Ready to deploy', 'Tuned on your data', 'Deployed privately', 'Monitored after launch'],
          href: '/services/ai-models',
        },
        {
          title: 'Private language models',
          text: 'Language models running inside your own infrastructure.',
          included: ['LLM deployment and optimisation', 'Your cloud or your servers', 'Search across your documents', 'Assistants for your team'],
          href: '/services/ai-models',
        },
        {
          title: 'Vision systems',
          text: 'Cameras and models that inspect quality on the production line.',
          included: ['Automated quality inspection', 'Defect and anomaly detection', 'Detection, classification and tracking', 'Real-time alerts and dashboards'],
          href: '/services/vision-systems',
        },
        {
          title: 'Evaluation',
          text: 'Every model measured on your real cases before it goes live.',
          included: ['Tested on your own examples', 'Benchmarks against baselines', 'Clear accuracy reporting', 'Measured again after launch'],
          href: '/services/ai-models',
        },
        {
          title: 'Inference and monitoring',
          text: 'Fast, reliable serving, watched and kept accurate after launch.',
          included: ['Low-latency serving', 'Monitoring in production', 'Accuracy tracked over time', 'Retraining when needed'],
          href: '/services/ai-models',
        },
      ],
    },
    flow: {
      caption: 'Model lifecycle',
      title: 'From your data to a model you can rely on.',
      steps: [
        { title: 'Prepare', text: 'Your data gathered, cleaned and labelled.' },
        { title: 'Train', text: 'A custom model, or one of ours tuned to you.' },
        { title: 'Evaluate', text: 'Measured on your own examples before launch.' },
        { title: 'Deploy', text: 'In your cloud or on your own servers.' },
        { title: 'Monitor', text: 'Watched in production and kept accurate.' },
      ],
    },
    commitments: [
      { title: 'You own the model', text: 'Models trained for you are yours to keep and run.' },
      { title: 'No client data retained', text: 'We don’t keep your data once the work is done.' },
      { title: 'Deployed where you choose', text: 'In your cloud or on your own servers.' },
      { title: 'Evaluated before launch', text: 'Measured on your real cases, not on demos.' },
      { title: 'Monitored after release', text: 'Accuracy is tracked in production, not assumed.' },
      { title: 'Start to finish', text: 'The people who train the model support it.' },
    ],
    engagements: [
      { title: 'A model project', text: 'One defined use case, trained, evaluated and deployed.', fit: 'Best for a clear, specific problem.' },
      { title: 'A dedicated AI team', text: 'Our machine-learning engineers working alongside your team.', fit: 'Best for an AI roadmap.' },
      { title: 'Managed AI', text: 'We monitor, maintain and retrain your models in production.', fit: 'Best for models already live.' },
    ],
    faq: [
      { q: 'Who owns the model?', a: 'You do. Models we train for you are yours to keep and run.' },
      { q: 'What happens to our data?', a: 'It stays yours. We don’t retain client data once the work is done.' },
      { q: 'Can the AI run on our own servers?', a: 'Yes. We deploy private models in your cloud or on your own servers when your data must stay in-house.' },
      { q: 'Do we need a lot of data?', a: 'Not always. Fine-tuning and our in-house models can work with smaller sets, and we tell you honestly what your data can support.' },
      { q: 'How accurate will it be?', a: 'We measure it on your real cases before launch and keep measuring after, so you always know.' },
      PRICE,
    ],
    closing: { title: 'Have data that could be working harder?', line: 'Tell us about it. We reply within a day.' },
  },

  creatives: {
    slug: 'creatives',
    visual: { src: '/photos/divisions/creatives-leap.webp', alt: 'A man in an ember corduroy suit leaping across a blue sky with a phone in his hand', position: '70% 40%' },
    metaTitle: 'Creatives — Social media, done for you',
    description:
      'hitroo Creatives runs your social media for you: we create your content, post it across your channels and analyse which posts perform best. You see every post and its results in your own dashboard.',
    title: 'Your social media, done for you.',
    lede: 'We create your content, post it across your channels and analyse what performs. You see everything in your dashboard.',
    signs: {
      title: 'Posting every day is a full-time job.',
      lede: 'We take it off your hands.',
      items: [
        { title: 'No time to post', text: 'The business comes first, and the channels go quiet.' },
        { title: 'Posts that could be anyone’s', text: 'Generic content that doesn’t sound like your brand.' },
        { title: 'No clear view of what works', text: 'Likes and views, but no idea what drives results.' },
      ],
    },
    build: {
      title: 'Six capabilities, one creative team.',
      items: [
        {
          title: 'Content strategy',
          text: 'A content plan built around your brand, your audience and your goals.',
          included: ['Brand voice and positioning', 'Audience and channel plan', 'Content calendar', 'Campaign themes'],
        },
        {
          title: 'Content production',
          text: 'Posts, short-form video and carousels, made for your brand.',
          included: ['Feed posts', 'Short-form video', 'Carousels', 'Captions in your voice'],
        },
        {
          title: 'Publishing',
          text: 'Scheduled and posted across your channels, so they never go quiet.',
          included: ['Scheduled publishing', 'Consistent posting', 'Channels agreed at the start', 'No work on your side'],
        },
        {
          title: 'Client dashboard',
          text: 'Every post and its results in one place, whenever you want to look.',
          included: ['Every post we publish', 'Results for each post', 'Your best performers', 'Available any time'],
        },
        {
          title: 'Analytics',
          text: 'Reach, engagement and enquiries, measured on every post.',
          included: ['Reach and engagement', 'Best-performing posts', 'Trends over time', 'Plain-language summaries'],
        },
        {
          title: 'Growth engine',
          text: 'What performs best shapes what we make next.',
          included: ['Learning from every post', 'More of what works', 'Less of what doesn’t', 'Plans that improve each cycle'],
        },
      ],
    },
    flow: {
      caption: 'How it runs',
      title: 'A cycle that improves with every post.',
      steps: [
        { title: 'Plan', text: 'Your voice, audience and goals, turned into a plan.' },
        { title: 'Create', text: 'Posts, video and carousels made for you.' },
        { title: 'Post', text: 'Published on schedule across your channels.' },
        { title: 'Analyse', text: 'Every post measured, the best ones found.' },
        { title: 'Improve', text: 'More of what works in the next cycle.' },
      ],
    },
    split: {
      caption: 'Who does what',
      title: 'We do the work. You see the results.',
      left: { label: 'We handle', items: ['Planning your content', 'Creating every post', 'Posting on schedule', 'Analysing what performs'] },
      right: { label: 'In your dashboard', items: ['Every post we publish', 'How each one performs', 'Your best-performing posts', 'Results across your channels'] },
    },
    commitments: [
      { title: 'Done for you', text: 'You don’t write or post a thing.' },
      { title: 'Your brand’s voice', text: 'Every post sounds like you, not a template.' },
      { title: 'Best posts analysed', text: 'We study what performs and make more of it.' },
      { title: 'Results in your dashboard', text: 'Every post and its numbers, visible any time.' },
      { title: 'People behind every post', text: 'AI helps us move fast; people make sure it’s right.' },
      { title: 'Start to finish', text: 'The people who plan your content also make it and report on it.' },
    ],
    faq: [
      { q: 'Do we need to create any content?', a: 'No. We create the content and post it for you. You see every post and how it performs in your dashboard.' },
      { q: 'Which channels do you cover?', a: 'The ones your customers use. We agree on them at the start.' },
      { q: 'Do you use AI to make the content?', a: 'AI helps us move fast. People make sure every post sounds like you.' },
      { q: 'How do we know it’s working?', a: 'Your dashboard shows every post with its reach and engagement, and which posts perform best. We use that to plan what comes next.' },
      { q: 'How much does it cost?', a: 'It depends on your channels and how often you post. After a free call, we send you a clear plan and price.' },
    ],
    closing: { title: 'Ready to stop worrying about posting?', line: 'Tell us about your brand. We reply within a day.' },
  },
};
