import { BrainCircuit, Code2, Eye, MonitorSmartphone, Server, Smartphone, Workflow, type LucideIcon } from 'lucide-react';

export interface Service {
  slug: string;
  /** Full name: page title and metadata. */
  title: string;
  /** Short name for menus, grids and the footer. */
  label: string;
  /** One line under the title. */
  short: string;
  /** Metadata title suffix. */
  tagline: string;
  /** The business problem, in one line. */
  pain: string;
  icon: LucideIcon;
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
};

export const services: Service[] = [
  {
    slug: 'custom-software',
    title: 'Custom Software Development',
    label: 'Custom software',
    short: 'Platforms and tools built around the way you work.',
    tagline: 'Built around your business',
    pain: 'Spreadsheets and disconnected tools cost you hours and hide your real numbers.',
    icon: Code2,
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
    short: 'Native and cross-platform apps for iOS and Android.',
    tagline: 'Mobile that performs',
    pain: 'Your customers live on their phones. A slow or missing app sends them elsewhere.',
    icon: Smartphone,
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
    short: 'Fast desktop software for Windows, macOS and Linux.',
    tagline: 'Power on the desktop',
    pain: 'Heavy workloads, offline use and hardware often outgrow the browser.',
    icon: MonitorSmartphone,
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
    short: 'Custom-trained AI models, or our ready in-house models.',
    tagline: 'Models for your domain',
    pain: 'Generic AI doesn’t know your data, so it fails where it matters most.',
    icon: BrainCircuit,
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
    short: 'Workflows that run themselves, end to end.',
    tagline: 'Automate the routine',
    pain: 'Repetitive work eats hours every week, and hiring doesn’t fix it.',
    icon: Workflow,
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
    short: 'Cameras and AI that inspect quality on the line.',
    tagline: 'Quality, automated by sight',
    pain: 'Manual inspection is slow, inconsistent and misses defects.',
    icon: Eye,
    image: '/photos/why-ai.webp',
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
    short: 'We run and maintain your systems, on demand.',
    tagline: 'Services on demand',
    pain: 'Running servers and support in-house pulls your best people off the product.',
    icon: Server,
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
    image: '/photos/why-software.webp',
    alt: 'A back-office desk buried in printed spreadsheets, invoices and binders',
  },
  {
    title: 'Automation',
    text: 'Repetitive work eats your team’s week. Automation does it in minutes, without errors.',
    href: '/services/ai-automation',
    cta: 'Explore automation',
    image: '/photos/why-automation.webp',
    alt: 'A warehouse aisle with a barcode scanner and paper pick lists on a trolley',
  },
  {
    title: 'AI',
    text: 'Your data already holds answers. AI finds them faster than any team, day and night.',
    href: '/services/ai-models',
    cta: 'Explore AI',
    image: '/photos/why-ai.webp',
    alt: 'An inspection camera above a conveyor carrying machined parts',
  },
];

export const PROCESS = ['Discover', 'Design', 'Build', 'Test & secure', 'Launch', 'Support'];

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
