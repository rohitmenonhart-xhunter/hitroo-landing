import type { MediaImage } from './media';

/*
 * The site's built-in content. Since migration 005 the live copy is in the database (web.content, edited in the
 * admin); these values are the defaults it was seeded from and the fallback when the database can't be read
 * (lib/content.ts, lib/content-defaults.ts).
 */

/** HITROO's divisions: the foundation's four lines of business (never called "wings" on the site). */
export type DivisionSlug = 'software' | 'automation' | 'ai' | 'creatives';
export const DIVISION_SLUGS: DivisionSlug[] = ['software', 'automation', 'ai', 'creatives'];

export interface Service {
  slug: string;
  /** Full name: page title and metadata. */
  title: string;
  /** Short name for menus, grids and the footer. */
  label: string;
  division: DivisionSlug;
  /** One line under the title. */
  short: string;
  /** Metadata title suffix. */
  tagline: string;
  /** The business problem, in one line. */
  pain: string;
  /** Search and social description (not shown on the page). */
  overview: string;
  /** How we work, step titles. */
  approach: string[];
  capabilities: string[];
  outcomes: string[];
  stack: string[];
}

export interface Company {
  name: string;
  email: string;
  phone: string;
  /** The phone number as a tel: link. */
  phoneHref: string;
  location: string;
  oneLiner: string;
  /** The standard paragraph at the end of news items and in the newsroom. */
  about: string;
  linkedin: string;
}

export const COMPANY: Company = {
  name: 'HITROO',
  email: 'info@hitroo.com',
  phone: '+91 7550000805',
  phoneHref: 'tel:+917550000805',
  location: 'Chennai, Tamil Nadu, India',
  oneLiner: 'One foundation for software, automation, AI and creative growth.',
  about:
    'HITROO is a technology company built as one foundation with four divisions: Software (our products, custom software, mobile and desktop apps, managed services), Automation (workflows and AI agents), AI (custom models and computer vision) and Creatives (social media, done for you). One team designs, builds, secures and supports everything it ships.',
  linkedin: 'https://www.linkedin.com/company/hitroo',
};

export const services: Service[] = [
  {
    slug: 'custom-software',
    title: 'Custom Software Development',
    label: 'Custom software',
    division: 'software',
    short: 'Platforms and tools built around the way you work.',
    tagline: 'Built around your business',
    pain: 'Spreadsheets and disconnected tools cost you hours and hide your real numbers.',
    overview:
      'We design and build custom software for companies, businesses and individuals — turning the manual, messy parts of your operation into reliable, scalable systems you own.',
    approach: ['Map the workflow', 'Architect for scale', 'Ship in iterations'],
    capabilities: [
      'Web platforms and internal tools',
      'APIs and third-party integrations',
      'Workflow and operations systems',
      'Dashboards and reporting',
      'Data modeling and databases',
      'Cloud architecture and hosting',
    ],
    outcomes: ['Hours saved every week', 'One source of truth', 'A system that scales with you'],
    stack: ['TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'React', 'AWS'],
  },
  {
    slug: 'mobile-apps',
    title: 'Mobile App Development',
    label: 'Mobile apps',
    division: 'software',
    short: 'Native and cross-platform apps for iOS and Android.',
    tagline: 'Mobile that performs',
    pain: 'Your customers live on their phones. A slow or missing app sends them elsewhere.',
    overview:
      'High-performance mobile apps with intuitive interfaces, offline-ready architecture and smooth motion — shipped to the App Store and Play Store.',
    approach: ['Design for the thumb', 'Build native-grade', 'Ship to both stores'],
    capabilities: [
      'Native iOS and Android',
      'Cross-platform with React Native and Flutter',
      'Offline-first and sync',
      'Push notifications and deep links',
      'App Store and Play Store delivery',
      'Performance and battery tuning',
    ],
    outcomes: ['Smooth 60fps experiences', 'Higher retention', 'One codebase, two stores'],
    stack: ['Swift', 'Kotlin', 'React Native', 'Flutter', 'Firebase'],
  },
  {
    slug: 'desktop-apps',
    title: 'Desktop App Development',
    label: 'Desktop apps',
    division: 'software',
    short: 'Fast desktop software for Windows, macOS and Linux.',
    tagline: 'Power on the desktop',
    pain: 'Heavy workloads, offline use and hardware often outgrow the browser.',
    overview:
      'Native-feeling desktop applications that integrate deeply with the operating system, update themselves and run fast on every platform.',
    approach: ['Native where it counts', 'Deep OS integration', 'Auto-update everything'],
    capabilities: [
      'Windows, macOS and Linux builds',
      'System and hardware integration',
      'Background services and tray apps',
      'Auto-update and crash reporting',
      'Code signing and notarization',
      'Local-first data and sync',
    ],
    outcomes: ['Runs on every OS', 'Works offline', 'Updates itself'],
    stack: ['Electron', 'Tauri', 'Rust', 'C++', '.NET'],
  },
  {
    slug: 'ai-models',
    title: 'AI Model Development & Training',
    label: 'AI models',
    division: 'ai',
    short: 'Custom-trained AI models, or our ready in-house models.',
    tagline: 'Models for your domain',
    pain: 'Generic AI doesn’t know your data, so it fails where it matters most.',
    overview:
      'We develop and custom-train AI models on your data, fine-tune language and vision systems, and offer in-house models you can put to work immediately.',
    approach: ['Prepare your data', 'Train and fine-tune', 'Serve at low latency'],
    capabilities: [
      'Custom model training and fine-tuning',
      'In-house models ready to deploy',
      'LLM deployment and optimization',
      'Vision and multimodal models',
      'Data preparation and labeling',
      'Evaluation and benchmarking',
    ],
    outcomes: ['Models tuned to your domain', 'In-house option, ready now', 'Fast, reliable inference'],
    stack: ['PyTorch', 'vLLM', 'CUDA', 'Hugging Face', 'ONNX'],
  },
  {
    slug: 'ai-automation',
    title: 'AI Automation',
    label: 'AI automation',
    division: 'automation',
    short: 'Workflows that run themselves, end to end.',
    tagline: 'Automate the routine',
    pain: 'Repetitive work eats hours every week, and hiring doesn’t fix it.',
    overview:
      'Intelligent automation that connects your tools and removes manual effort — AI agents, document processing and operations workflows that run themselves.',
    approach: ['Find the busywork', 'Build the agents', 'Keep humans in the loop'],
    capabilities: [
      'AI agents that use your tools',
      'Workflow orchestration',
      'Document reading and extraction',
      'Conversational assistants',
      'Integration with your systems',
      'Monitoring and approvals',
    ],
    outcomes: ['Hours of manual work removed', 'Fewer errors', 'Scales without new headcount'],
    stack: ['HITROO automation platform', 'AI agents', 'API integrations'],
  },
  {
    slug: 'vision-systems',
    title: 'Vision Systems',
    label: 'Vision systems',
    division: 'ai',
    short: 'Cameras and AI that inspect quality on the line.',
    tagline: 'Quality, automated by sight',
    pain: 'Manual inspection is slow, inconsistent and misses defects.',
    overview:
      'Computer-vision systems that see and judge the physical world — automated quality inspection, defect detection and machine-vision pipelines powered by custom and fine-tuned in-house models.',
    approach: ['Capture and label', 'Train custom models', 'Deploy on the line'],
    capabilities: [
      'Automated quality inspection',
      'Defect and anomaly detection',
      'Production-line vision',
      'Detection, classification and tracking',
      'Custom and fine-tuned vision models',
      'Real-time alerts and dashboards',
    ],
    outcomes: ['Fewer defects shipped', 'Consistent 24/7 inspection', 'Scales with the line'],
    stack: ['PyTorch', 'OpenCV', 'YOLO', 'TensorRT', 'VLMs'],
  },
  {
    slug: 'managed-services',
    title: 'Managed & Custom Services',
    label: 'Managed services',
    division: 'software',
    short: 'We run and maintain your systems, on demand.',
    tagline: 'Services on demand',
    pain: 'Running servers and support in-house pulls your best people off the product.',
    overview:
      'Custom-built and managed services for your business — from dedicated infrastructure to bespoke capabilities, run and maintained by us.',
    approach: ['Provision and set up', 'Run and monitor', 'Support and scale'],
    capabilities: [
      'Custom-built services',
      'Managed infrastructure',
      'Dedicated support engineering',
      'SLAs and monitoring',
      'Scaling and reliability',
      'Ongoing maintenance',
    ],
    outcomes: ['We run it, you build', 'SLA-backed uptime', 'Scales on demand'],
    stack: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);

/* ------------------------------------------------------------------
   Divisions: one foundation, four lines of business
   ------------------------------------------------------------------ */

/** A titled line: one item in a list of points or steps. */
export interface Point {
  title: string;
  text: string;
}

export interface Division {
  slug: DivisionSlug;
  name: string;
  /** One line under the name, in menus and lists. */
  line: string;
  /** Search and social description (not shown on the page). */
  overview: string;
  /** Its page's statement: the problem, then our answer. */
  statement: [string, string];
  /** What it does; an item with `href` opens its service page. */
  offers: { title: string; text: string; href?: string }[];
  outcomes: string[];
  /** Who it's for: three kinds of business and what it does for each. */
  forWho: Point[];
  /** How it works, in four steps. */
  steps: Point[];
  /** Tools we build with (none for Creatives). */
  tools: string[];
  /** Its own common questions. */
  faq: { q: string; a: string }[];
  /** Recently launched: shown with a "New" badge. */
  isNew?: boolean;
}

const serviceOffer = (slug: string) => {
  const s = getService(slug)!;
  return { title: s.label, text: s.short, href: `/services/${s.slug}` };
};

export const DIVISIONS: Division[] = [
  {
    slug: 'software',
    name: 'Software',
    line: 'Products and custom builds your business runs on.',
    overview:
      'HITROO Software builds custom software, mobile and desktop apps and our own software products, and runs them as managed services. One team designs, builds, secures and supports it all.',
    statement: ['Off-the-shelf tools make you work their way.', 'We build software that works yours.'],
    offers: [
      serviceOffer('custom-software'),
      serviceOffer('mobile-apps'),
      serviceOffer('desktop-apps'),
      serviceOffer('managed-services'),
      { title: 'Our products', text: 'We build our own software products, too.' },
    ],
    outcomes: ['One system instead of ten tools.', 'Built to grow with you.', 'Supported for years, not weeks.'],
    forWho: [
      { title: 'Founders', text: 'Turn an idea into a product people can use.' },
      { title: 'Growing businesses', text: 'Replace spreadsheets and scattered tools with one system.' },
      { title: 'Enterprises', text: 'Modernise old systems without stopping the business.' },
    ],
    steps: [
      { title: 'Discover', text: 'We map how your business works today.' },
      { title: 'Design', text: 'You click through the screens before we build.' },
      { title: 'Build', text: 'Working software early, improved in short cycles.' },
      { title: 'Launch and support', text: 'Live, watched and supported in one app.' },
    ],
    tools: ['TypeScript', 'React', 'Node.js', 'Python', 'PostgreSQL', 'Swift', 'Kotlin', 'Flutter', 'Electron', 'AWS', 'Docker'],
    faq: [
      { q: 'Do we own what you build?', a: 'Yes. The software we build for you is yours to keep and run.' },
      { q: 'Can it work with the tools we already use?', a: 'Yes. We connect new software to your existing tools through APIs and integrations.' },
      { q: 'How long does a project take?', a: 'It depends on the scope. You see working software early, it grows in short cycles, and we agree on the timeline before we start.' },
      { q: 'What happens after launch?', a: 'The engineers who built it stay on it. Raise anything in the HITROO app and follow it from report to release.' },
    ],
  },
  {
    slug: 'automation',
    name: 'Automation',
    line: 'Your workflows, running on their own.',
    overview:
      'HITROO Automation takes repetitive work off your team: workflow automation, AI agents that work inside your tools, document processing and integrations, with people in the loop.',
    statement: ['Repetitive work quietly eats your team’s week.', 'Automation gives it back.'],
    offers: [
      { title: 'Workflow automation', text: 'Approvals, hand-offs and reports that run themselves.', href: '/services/ai-automation' },
      { title: 'AI agents', text: 'Agents that work inside your tools, with people in the loop.', href: '/services/ai-automation' },
      { title: 'Document processing', text: 'Invoices, forms and emails, read and filed.', href: '/services/ai-automation' },
      { title: 'Integrations', text: 'Your apps, finally talking to each other.', href: '/services/ai-automation' },
    ],
    outcomes: ['Hours back, every week.', 'Fewer errors.', 'Growth without new headcount.'],
    forWho: [
      { title: 'Operations', text: 'Approvals, hand-offs and reports that run on time.' },
      { title: 'Finance and admin', text: 'Invoices and forms read, checked and filed.' },
      { title: 'Sales and support', text: 'Leads and requests sent to the right person, instantly.' },
    ],
    steps: [
      { title: 'Find the busywork', text: 'We find where your team’s hours really go.' },
      { title: 'Automate one workflow', text: 'The one that costs the most time, first.' },
      { title: 'Keep people in the loop', text: 'Sensitive steps wait for a person’s approval.' },
      { title: 'Measure, then expand', text: 'Hours saved, errors avoided, then the next workflow.' },
    ],
    tools: [],
    faq: [
      { q: 'Will automation replace my team?', a: 'No. It takes the repetitive work, so your team can do the work that needs people.' },
      { q: 'Which tools can it connect to?', a: 'Most tools with an API or an inbox: CRMs, spreadsheets, accounting and messaging apps.' },
      { q: 'Is it safe to let AI act on our data?', a: 'Agents act only with the permissions you give them, and sensitive steps wait for a person’s approval.' },
      { q: 'Where do we start?', a: 'With the one workflow that costs the most hours. We automate it, measure it, then move to the next.' },
    ],
  },
  {
    slug: 'ai',
    name: 'AI',
    line: 'Models and vision that learn your business.',
    overview:
      'HITROO AI trains custom models on your data, deploys private language models, offers ready in-house models and builds computer-vision systems that inspect quality on the line.',
    statement: ['Generic AI doesn’t know your business.', 'Ours learns it.'],
    offers: [
      { title: 'Custom models', text: 'Trained and tuned on your own data.', href: '/services/ai-models' },
      { title: 'In-house models', text: 'Our own models, ready to deploy.', href: '/services/ai-models' },
      { title: 'Language models', text: 'Private LLMs, deployed and optimized.', href: '/services/ai-models' },
      serviceOffer('vision-systems'),
    ],
    outcomes: ['Tuned to your domain.', 'Consistent, day and night.', 'Fast, reliable answers.'],
    forWho: [
      { title: 'Manufacturers', text: 'Cameras and AI that check quality on the line.' },
      { title: 'Data-heavy teams', text: 'Search, sort and summarise what you already have.' },
      { title: 'Product teams', text: 'AI features your users will actually use.' },
    ],
    steps: [
      { title: 'Prepare your data', text: 'We gather, clean and label what the model learns from.' },
      { title: 'Train and tune', text: 'A custom model, or one of ours tuned to you.' },
      { title: 'Test on real cases', text: 'Measured on your own examples before launch.' },
      { title: 'Deploy and watch', text: 'Fast, monitored and kept accurate after launch.' },
    ],
    tools: ['PyTorch', 'Hugging Face', 'vLLM', 'ONNX', 'CUDA', 'OpenCV', 'YOLO', 'TensorRT'],
    faq: [
      { q: 'Do we need a lot of data?', a: 'Not always. Fine-tuning and our in-house models can work with smaller sets, and we tell you honestly what your data can support.' },
      { q: 'Can the AI run on our own servers?', a: 'Yes. We deploy private models on your own servers or cloud when your data must stay in-house.' },
      { q: 'What happens to our data?', a: 'It stays yours. We don’t retain client data once the work is done.' },
      { q: 'How accurate will it be?', a: 'We measure it on your real cases before launch and keep measuring after, so you always know.' },
    ],
  },
  {
    slug: 'creatives',
    name: 'Creatives',
    line: 'Your social media, done for you.',
    overview:
      'HITROO Creatives runs your brand’s social media for you: content made for your brand, scheduled posting across your channels, clear analytics and a growth engine that learns from every post.',
    statement: ['Posting every day is a full-time job.', 'We take it off your hands.'],
    offers: [
      { title: 'Content', text: 'Posts, reels and carousels, made for your brand.' },
      { title: 'Posting', text: 'Scheduled and published across your channels.' },
      { title: 'Analytics', text: 'Your best posts, analysed, in your dashboard.' },
      { title: 'Growth engine', text: 'Every post teaches the next one.' },
    ],
    outcomes: ['Always on, always on brand.', 'More reach, more enquiries.', 'Your team back on the business.'],
    forWho: [
      { title: 'Brands', text: 'Stay visible every day, without a content team.' },
      { title: 'Local businesses', text: 'Turn followers into visits and enquiries.' },
      { title: 'Founders', text: 'Build an audience while you build the business.' },
    ],
    steps: [
      { title: 'Learn your brand', text: 'Your voice, your audience and your goals.' },
      { title: 'Plan and create', text: 'Content planned and made for you.' },
      { title: 'Post for you', text: 'Scheduled and published across your channels.' },
      { title: 'Report and grow', text: 'What worked, in plain words, and what’s next.' },
    ],
    tools: [],
    faq: [
      { q: 'Which channels do you cover?', a: 'The ones your customers use. We agree on them at the start.' },
      { q: 'Do we need to create any content?', a: 'No. We create the content and post it for you. You see every post and how it performs in your dashboard.' },
      { q: 'Do you use AI to make the content?', a: 'AI helps us move fast. People make sure every post sounds like you.' },
      { q: 'How do we know it’s working?', a: 'Your dashboard shows every post with its reach and engagement, and which posts perform best. We use that to plan what comes next.' },
    ],
    isNew: true,
  },
];


/* ------------------------------------------------------------------
   Shared page blocks
   ------------------------------------------------------------------ */

/** Who we help (What we do). */
export const AUDIENCE: Point[] = [
  { title: 'Founders and startups', text: 'From an idea to a product people use.' },
  { title: 'Growing businesses', text: 'Systems that keep up as you grow.' },
  { title: 'Enterprises', text: 'Modern software without stopping the business.' },
];

/** Ways to work with us. */
export const ENGAGEMENTS: Point[] = [
  { title: 'A project', text: 'A clear scope and a plan. We build it, launch it and stay.' },
  { title: 'A dedicated team', text: 'Our people, working as part of yours, for as long as you need.' },
  { title: 'Ongoing care', text: 'We run, support and improve what you already have.' },
];

/* ------------------------------------------------------------------
   Home page
   ------------------------------------------------------------------ */

/** Why HITROO, in two lines (llms.txt). */
export const WHY_HITROO_STATEMENT = ['Most firms build your software and move on.', 'We build it fast, keep it secure and stay.'];

/**
 * The home page's quote: a public figure's exact words, checked against the original (NVIDIA's announcement of GTC
 * 2026, 3 March 2026), with a freely licensed photo whose credit is always shown. The card quotes the two sentences
 * about every company. Chosen by the owner on 2026-09-28; back on the home page from 2026-10-24 in place of the
 * founder block. Nothing on the page may suggest he endorses HITROO.
 */
export interface Quote {
  caption: string;
  quote: string;
  name: string;
  role: string;
  source: { label: string; href: string };
  /** The portrait and its credit, always shown under it. */
  photo: MediaImage & { credit: string; creditHref: string; license: string; licenseHref: string; changes: string };
}

export const HOME_QUOTE: Quote = {
  caption: 'Why now',
  quote: 'AI is no longer a single breakthrough or application — it is essential infrastructure. Every company will use it.',
  name: 'Jensen Huang',
  role: 'Founder and CEO, NVIDIA',
  source: { label: 'NVIDIA, March 2026', href: 'https://nvidianews.nvidia.com/news/nvidia-ceo-jensen-huang-and-global-technology-leaders-to-showcase-age-of-ai-at-gtc-2026' },
  photo: {
    src: '/people/jensen-huang.webp',
    alt: 'Jensen Huang, founder and CEO of NVIDIA',
    position: '50% 22%',
    credit: 'Anderseidesvik',
    creditHref: 'https://commons.wikimedia.org/wiki/File:Jensen_huang_stanford_2026-04-30_010.jpg',
    license: 'CC BY-SA 4.0',
    licenseHref: 'https://creativecommons.org/licenses/by-sa/4.0/',
    changes: 'cropped, black and white',
  },
};

export interface Founder {
  caption: string;
  lines: [string, string];
  text: string;
  name: string;
  role: string;
  photo: MediaImage;
}

/** The founder's own words and photo, on the About page (chosen by Rohit on 2026-09-26). */
export const FOUNDER: Founder = {
  caption: 'Who you’ll work with',
  lines: ['The software a business runs on can’t be a demo.', 'We build it to work on day one and keep it working for years.'],
  text: 'No account managers in between. You work with the people who design and write your software, from the first call to the latest release.',
  name: 'Rohit',
  role: 'Founder, HITROO',
  photo: { src: '/people/rohit.webp', alt: 'Rohit, founder of HITROO' },
};

/* ------------------------------------------------------------------
   Home: the division showcase (one large card per division)
   ------------------------------------------------------------------ */

export interface Showcase {
  slug: DivisionSlug;
  name: string;
  title: string;
  text: string;
  /** What it builds: six capabilities, a title and one line each. */
  capabilities: Point[];
  /** How the work is held to account: four short standards. */
  standards: string[];
}

export const SHOWCASE: Showcase[] = [
  {
    slug: 'software',
    name: 'Software',
    title: 'Built for the day after launch.',
    text: 'Platforms, mobile and desktop apps engineered by one team, from architecture and interface to testing and hosting. Nothing gets lost between hand-offs, because there aren’t any.',
    capabilities: [
      { title: 'Web platforms', text: 'Products, portals and the internal tools teams live in.' },
      { title: 'Mobile applications', text: 'Native and cross-platform, made for one hand.' },
      { title: 'Desktop applications', text: 'For work that needs power, hardware or no connection.' },
      { title: 'APIs and integrations', text: 'One flow of data across every system you run.' },
      { title: 'Cloud architecture', text: 'Sized for today, ready for the spike.' },
      { title: 'Managed services', text: 'Monitored, patched and improved long after launch.' },
    ],
    standards: ['Working software, not slide decks', 'Every change tested', 'Security reviewed before release', 'Your code, your IP'],
  },
  {
    slug: 'automation',
    name: 'Automation',
    title: 'The routine, running itself.',
    text: 'We find where your team’s hours disappear, then automate those workflows end to end on our own automation platform, wired into the tools you already use. People still sign off on what matters.',
    capabilities: [
      { title: 'Workflow automation', text: 'Approvals, hand-offs and reports that move on their own.' },
      { title: 'AI agents', text: 'Agents that work inside your tools, within limits you set.' },
      { title: 'Document processing', text: 'Invoices, forms and emails read, checked and filed.' },
      { title: 'System integration', text: 'CRM, ERP and accounting on one version of the truth.' },
      { title: 'Human approval', text: 'Sensitive steps wait for a person.' },
      { title: 'Run monitoring', text: 'Every run logged and visible.' },
    ],
    standards: ['Runs on our own platform', 'Costliest workflow first', 'Permissions you control', 'Proven, then expanded'],
  },
  {
    slug: 'ai',
    name: 'AI',
    title: 'AI that knows your business, not just the internet.',
    text: 'General models know the internet. Yours should know your products, customers and numbers. We train and tune models on your data, prove them on real cases and deploy them privately, in your cloud or on your servers.',
    capabilities: [
      { title: 'Custom models', text: 'Trained and tuned on your own data.' },
      { title: 'In-house models', text: 'Our own models, ready to tune and deploy.' },
      { title: 'Private language models', text: 'Running inside your own walls.' },
      { title: 'Vision systems', text: 'Inspection that never blinks.' },
      { title: 'Evaluation', text: 'Proven on your cases, not on demos.' },
      { title: 'Inference', text: 'Fast, monitored and kept accurate.' },
    ],
    standards: ['You own the model', 'No client data retained', 'Proven before launch', 'Watched after release'],
  },
  {
    slug: 'creatives',
    name: 'Creatives',
    title: 'Your channels, run like a newsroom.',
    text: 'We plan, create and publish your content, then study what performs and make more of it. You never write a post, and every result lives in your dashboard.',
    capabilities: [
      { title: 'Content strategy', text: 'A plan built around your brand and goals.' },
      { title: 'Content production', text: 'Posts, short-form video and carousels.' },
      { title: 'Publishing', text: 'On schedule, on the channels you choose.' },
      { title: 'Client dashboard', text: 'Every post and its results, in one place.' },
      { title: 'Analytics', text: 'Reach, engagement and enquiries, measured.' },
      { title: 'Growth engine', text: 'Every post sharpens the next.' },
    ],
    standards: ['Done for you', 'In your brand’s voice', 'Best posts studied', 'Results in your dashboard'],
  },
];

/** How every project runs (home, What we do, About): four stages, shown with glass numerals. */
export const DELIVERY_STEPS: [string, string][] = [
  ['Discovery', 'We learn how work really moves through your business, including the parts nobody wrote down.'],
  ['Scope and design', 'Architecture, scope and screens you can click, agreed before a line of code.'],
  ['Delivery', 'Working releases every iteration. You steer with real software, not status reports.'],
  ['Operations', 'The team that built it runs it, watches it and keeps making it better.'],
];

/** What every client can count on (What we do, About, Support). */
export const PROMISES: Point[] = [
  { title: 'Engineers, not account managers', text: 'You work with the people who design and build it.' },
  { title: 'Context that stays', text: 'The team that built it supports it, so nothing is explained twice.' },
  { title: 'Every change tested', text: 'Nothing reaches your users unchecked.' },
  { title: 'Visible end to end', text: 'Follow every request from report to release in the HITROO app.' },
];
