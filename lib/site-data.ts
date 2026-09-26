import type { Leader } from '@/components/corporate/LeaderQuote';
/** Service groups: the columns of the Services menu. */
export type ServiceGroup = 'build' | 'ai' | 'run';

export interface Service {
  slug: string;
  /** Full name: page title and metadata. */
  title: string;
  /** Short name for menus, grids and the footer. */
  label: string;
  group: ServiceGroup;
  /** One line under the title. */
  short: string;
  /** Metadata title suffix. */
  tagline: string;
  /** The business problem, in one line. */
  pain: string;
  /** Brand icon: a transparent PNG in public/icons. */
  icon: string;
  /** Realistic photo (public/photos). */
  image: string;
  imageAlt: string;
  /** Search and social description (not shown on the page). */
  overview: string;
  /** How we work, step titles. */
  approach: string[];
  capabilities: string[];
  outcomes: string[];
  stack: string[];
}

export const COMPANY = {
  name: 'HITROO',
  email: 'info@hitroo.com',
  phone: '+91 7550000805',
  phoneHref: 'tel:+917550000805',
  location: 'Chennai, Tamil Nadu, India',
  oneLiner: 'Software, automation and AI for business.',
  /** The standard paragraph at the end of news items and in the newsroom. */
  about:
    'HITROO builds custom software, mobile and desktop apps, AI models, automation and computer-vision systems for businesses. One team designs, builds, security-tests and supports every project.',
  linkedin: 'https://www.linkedin.com/company/hitroo',
};

export const services: Service[] = [
  {
    slug: 'custom-software',
    title: 'Custom Software Development',
    label: 'Custom software',
    group: 'build',
    short: 'Platforms and tools built around the way you work.',
    tagline: 'Built around your business',
    pain: 'Spreadsheets and disconnected tools cost you hours and hide your real numbers.',
    icon: '/icons/custom-software.png',
    image: '/photos/svc-software.webp',
    imageAlt: 'A developer desk with two monitors, a laptop and a notebook of diagrams',
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
    group: 'build',
    short: 'Native and cross-platform apps for iOS and Android.',
    tagline: 'Mobile that performs',
    pain: 'Your customers live on their phones. A slow or missing app sends them elsewhere.',
    icon: '/icons/mobile-apps.png',
    image: '/photos/svc-mobile.webp',
    imageAlt: 'A phone on a restaurant billing counter showing an ordering app',
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
    group: 'build',
    short: 'Fast desktop software for Windows, macOS and Linux.',
    tagline: 'Power on the desktop',
    pain: 'Heavy workloads, offline use and hardware often outgrow the browser.',
    icon: '/icons/desktop-apps.png',
    image: '/photos/svc-desktop.webp',
    imageAlt: 'An engineering workstation with two monitors and printed drawings',
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
    group: 'ai',
    short: 'Custom-trained AI models, or our ready in-house models.',
    tagline: 'Models for your domain',
    pain: 'Generic AI doesn’t know your data, so it fails where it matters most.',
    icon: '/icons/ai-models.png',
    image: '/photos/svc-ai.webp',
    imageAlt: 'A machine-learning workstation with two graphics cards and a monitor',
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
    group: 'ai',
    short: 'Workflows that run themselves, end to end.',
    tagline: 'Automate the routine',
    pain: 'Repetitive work eats hours every week, and hiring doesn’t fix it.',
    icon: '/icons/ai-automation.png',
    image: '/photos/svc-automation.webp',
    imageAlt: 'A document scanner feeding invoices beside a laptop in an accounts office',
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
    stack: ['LangChain', 'OpenAI', 'n8n', 'Temporal', 'Vector DBs'],
  },
  {
    slug: 'vision-systems',
    title: 'Vision Systems',
    label: 'Vision systems',
    group: 'ai',
    short: 'Cameras and AI that inspect quality on the line.',
    tagline: 'Quality, automated by sight',
    pain: 'Manual inspection is slow, inconsistent and misses defects.',
    icon: '/icons/vision-systems.png',
    image: '/photos/svc-vision.webp',
    imageAlt: 'An inspection camera above a conveyor carrying machined parts',
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
    group: 'run',
    short: 'We run and maintain your systems, on demand.',
    tagline: 'Services on demand',
    pain: 'Running servers and support in-house pulls your best people off the product.',
    icon: '/icons/managed-services.png',
    image: '/photos/svc-managed.webp',
    imageAlt: 'An open network rack with servers and bundled cables in an office server room',
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
   Home page
   ------------------------------------------------------------------ */

/** Why HITROO, in two lines. */
export const WHY_HITROO_STATEMENT = ['Most firms build your software and move on.', 'We build it fast, keep it secure and stay.'];

/** Why a business needs each offer: two short sentences, then one step forward. */
export const WHY_NEED = [
  {
    title: 'Software',
    text: 'Spreadsheets and scattered apps waste hours. One system built for your business ends that.',
    href: '/services/custom-software',
    cta: 'Explore software',
    image: '/photos/need-software.webp',
    alt: 'A bright office desk with a laptop and a monitor showing the same business app',
  },
  {
    title: 'Automation',
    text: 'Repetitive work eats your team’s week. Automation does it in minutes, without errors.',
    href: '/services/ai-automation',
    cta: 'Explore automation',
    image: '/photos/need-automation.webp',
    alt: 'Robotic arms placing boxes on a conveyor in a modern fulfilment centre',
  },
  {
    title: 'AI',
    text: 'Your data already holds answers. AI finds them faster than any team, day and night.',
    href: '/services/ai-models',
    cta: 'Explore AI',
    image: '/photos/need-ai.webp',
    alt: 'A clean data-centre aisle lined with server racks',
  },
];

/** The delivery process (home "Fast, by design"): one short line and an icon per step. */
export const PROCESS_STEPS = [
  { name: 'Discover', line: 'Your goals, mapped.', image: '/photos/process-discover.webp', alt: 'Blank sticky notes in two groups on a glass wall, joined by a marker arrow' },
  { name: 'Design', line: 'Screens you can click.', image: '/photos/process-design.webp', alt: 'A designer’s desk with app screens on a monitor, a wireframe on a tablet and paper sketches' },
  { name: 'Build', line: 'Working software, early.', image: '/photos/process-build.webp', alt: 'An engineer’s workstation with code on two monitors' },
  { name: 'Test & secure', line: 'Every change checked.', image: '/photos/process-test.webp', alt: 'Phones and tablets lined up for testing on a white bench' },
  { name: 'Launch', line: 'Live, and watched.', image: '/photos/process-launch.webp', alt: 'A check-in app on a tablet beside a card terminal at a clinic reception desk' },
  { name: 'Support', line: 'First reply in 24 hours.', image: '/photos/process-support.webp', alt: 'A support desk with a headset beside a laptop' },
];

export const PROCESS = PROCESS_STEPS.map((s) => s.name);

/**
 * The home page's word from HITROO's leadership: a real person's own photo, name, role and words
 * (chosen by Rohit on 2026-09-26) — never a generated face or an invented quote. `null` hides it.
 */
export const LEADER: Leader | null = {
  lines: ['The software a business runs on can’t be a demo.', 'We build it to work on day one and keep it working for years.'],
  name: 'Rohit',
  role: 'Founder, HITROO',
  photo: '/people/rohit.webp',
  alt: 'Rohit, founder of HITROO',
};

export const AUDIENCE = [
  { title: 'Enterprises', image: '/photos/companies.webp', alt: 'The entrance plaza of a corporate office campus' },
  { title: 'Growing businesses', image: '/photos/businesses.webp', alt: 'A hardware shop counter with a payment terminal and a tablet' },
  { title: 'Founders & startups', image: '/photos/founders.webp', alt: 'A co-working desk with a laptop and app sketches in a notebook' },
];

/* ------------------------------------------------------------------
   Support (the HITROO app)
   ------------------------------------------------------------------ */

export const SUPPORT = {
  platforms: ['iOS', 'Android', 'Windows', 'macOS'],
  steps: ['Raise a ticket', 'We pick it up', 'We ship the fix', 'You stay updated'],
  image: '/photos/support.webp',
  imageAlt: 'A phone showing a support chat app beside a laptop on an office desk',
};

/* ------------------------------------------------------------------
   Navigation groups (header menus and footer)
   ------------------------------------------------------------------ */

export const SERVICE_GROUPS: { id: ServiceGroup; label: string; line: string }[] = [
  { id: 'build', label: 'Build', line: 'Software your business runs on.' },
  { id: 'ai', label: 'AI', line: 'Models and agents that work for you.' },
  { id: 'run', label: 'Run', line: 'We keep it running.' },
];

export interface NavItem {
  href: string;
  label: string;
  line: string;
  /** Brand icon: a transparent PNG in public/icons. */
  icon: string;
}

export const RESOURCES: { learn: NavItem[]; company: NavItem[]; support: NavItem[] } = {
  learn: [
    { href: '/insights', label: 'Insights', line: 'Latest articles and news', icon: '/icons/insights.png' },
    { href: '/blog', label: 'Blog', line: 'Quick takes on technology', icon: '/icons/blog.png' },
    { href: '/articles', label: 'Articles', line: 'In-depth thinking', icon: '/icons/articles.png' },
    { href: '/research', label: 'Research', line: 'Applied AI, vision and systems', icon: '/icons/research.png' },
    { href: '/ai-perspective', label: 'Our view on AI', line: 'Is AI a threat to software firms?', icon: '/icons/ai-view.png' },
  ],
  company: [
    { href: '/news', label: 'Newsroom', line: 'Company news and press', icon: '/icons/news.png' },
    { href: '/brand', label: 'Brand kit', line: 'Logo, colours and type', icon: '/icons/brand.png' },
  ],
  support: [
    { href: '/support', label: 'Support app', line: 'First reply in 24 hours', icon: '/icons/support.png' },
    { href: '/contact', label: 'Contact us', line: 'We reply within a day', icon: '/icons/contact.png' },
  ],
};

/* ------------------------------------------------------------------
   Home story carousel
   ------------------------------------------------------------------ */

export const STORIES = [
  {
    eyebrow: 'Our story',
    lines: ['Built with care.', 'Built to last.'],
    text: 'We design, build and support the software businesses run on, for years.',
    href: '/about',
    cta: 'Read our story',
    image: '/photos/story-business.webp',
    alt: 'A warehouse packing station at night, an orders app on a tablet under a work lamp',
  },
  {
    eyebrow: 'Our view on AI',
    lines: ['AI makes us faster.', 'We make it right.'],
    text: 'AI drafts in hours. We design, test and support it for years.',
    href: '/ai-perspective',
    cta: 'Read our view',
    image: '/photos/story-ai.webp',
    alt: 'An engineer’s desk at night, code and an AI assistant side by side on the monitor',
  },
  {
    eyebrow: 'Research',
    lines: ['Hard problems in.', 'Real products out.'],
    text: 'Applied AI, vision and systems research that becomes product.',
    href: '/research',
    cta: 'See our research',
    image: '/photos/story-research.webp',
    alt: 'A robot arm with a wrist camera lifting a machined part from a tray in a lab at night',
  },
];
