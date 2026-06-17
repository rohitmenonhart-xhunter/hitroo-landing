import {
  Code2,
  Smartphone,
  MonitorSmartphone,
  BrainCircuit,
  Workflow,
  RefreshCw,
  Server,
  type LucideIcon,
  Layers,
  Database,
  Boxes,
  Apple,
  Globe,
  Gauge,
  MonitorDown,
  Cable,
  GitBranch,
  FlaskConical,
  Eye,
  Bot,
  Sparkles,
  LineChart,
  Search,
  ShieldCheck,
  LifeBuoy,
} from 'lucide-react';

export const GOOGLE_COLORS = {
  blue: '#4285F4',
  red: '#EA4335',
  yellow: '#FBBC05',
  green: '#34A853',
} as const;

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface Step {
  title: string;
  desc: string;
}

export interface Service {
  slug: string;
  title: string;
  short: string;
  tagline: string;
  icon: LucideIcon;
  color: string;
  image: string;
  solutionImage: string;
  overview: string;
  problem: string;
  approach: Step[];
  features: Feature[];
  capabilities: string[];
  outcomes: string[];
  stack: string[];
}

export const COMPANY = {
  name: 'HITROO',
  slogan: 'Intelligence, Unbound',
  email: 'info@hitroo.com',
  phone: '+91 7550000805',
  phoneHref: 'tel:+917550000805',
  location: 'Chennai, Tamil Nadu, India',
  blurb:
    'A Chennai-based software studio building intelligent software, apps, and AI for businesses — and staying with them long after launch.',
};

export const services: Service[] = [
  {
    slug: 'custom-software',
    title: 'Custom Software Development',
    short: 'Bespoke platforms and tools that solve your everyday operational problems.',
    tagline: 'Built around your business',
    icon: Code2,
    color: GOOGLE_COLORS.blue,
    image: '/img/craft.png',
    solutionImage: '/img/sol-software.png',
    overview:
      'We design and build custom software for companies, businesses, and individuals — turning the manual, messy parts of your operation into reliable, scalable systems you own.',
    problem:
      'Most businesses run on a patchwork of spreadsheets, disconnected tools, and manual workarounds. They quietly cost hours every day, hide your real numbers, and break the moment you try to grow.',
    approach: [
      { title: 'Map the workflow', desc: 'We learn how your business actually runs before a line of code is written.' },
      { title: 'Architect for scale', desc: 'Clean, modular systems with the right data model and integrations.' },
      { title: 'Ship in iterations', desc: 'You see working software early and often — never a big-bang reveal.' },
    ],
    features: [
      { icon: Layers, title: 'Architecture', description: 'Clean, modular systems built to last.' },
      { icon: Server, title: 'Backend & APIs', description: 'Scalable services and integrations.' },
      { icon: Database, title: 'Data', description: 'Solid data models and reporting.' },
      { icon: Boxes, title: 'End-to-end', description: 'Concept to production, one team.' },
    ],
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
    short: 'Native and cross-platform apps for iOS and Android.',
    tagline: 'Mobile that performs',
    icon: Smartphone,
    color: GOOGLE_COLORS.red,
    image: '/img/mobile.png',
    solutionImage: '/img/sol-mobile.png',
    overview:
      'High-performance mobile apps with intuitive interfaces, offline-ready architecture, and smooth motion — shipped to the App Store and Play Store.',
    problem:
      'Your customers live on their phones. A missing, slow, or clunky app means lost engagement, poor reviews, and revenue that quietly leaks to competitors with a better experience.',
    approach: [
      { title: 'Design for the thumb', desc: 'Interfaces built for how people really hold and tap their phones.' },
      { title: 'Build native-grade', desc: 'Native or cross-platform — whichever gives you the best experience.' },
      { title: 'Ship to both stores', desc: 'We handle review, release, and ongoing updates end to end.' },
    ],
    features: [
      { icon: Apple, title: 'iOS', description: 'Polished, native-feeling Apple apps.' },
      { icon: Smartphone, title: 'Android', description: 'Fast across all Android hardware.' },
      { icon: Globe, title: 'Cross-platform', description: 'One codebase, both platforms.' },
      { icon: Gauge, title: 'Performance', description: 'Smooth, lean, responsive.' },
    ],
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
    short: 'Capable desktop software for Windows, macOS, and Linux.',
    tagline: 'Power on the desktop',
    icon: MonitorSmartphone,
    color: GOOGLE_COLORS.yellow,
    image: '/img/desktop.png',
    solutionImage: '/img/sol-desktop.png',
    overview:
      'Native-feeling desktop applications that integrate deeply with the operating system, update themselves, and run fast on every platform.',
    problem:
      'Heavy workflows, offline needs, and hardware integrations often outgrow the browser. But desktop software has a reputation for being painful to build, sign, and keep updated across operating systems.',
    approach: [
      { title: 'Native where it counts', desc: 'We use native power for the parts that need it, web speed for the rest.' },
      { title: 'Deep OS integration', desc: 'Files, devices, tray, notifications — the full desktop experience.' },
      { title: 'Auto-update everything', desc: 'Signed, notarized builds that update silently in the background.' },
    ],
    features: [
      { icon: MonitorDown, title: 'Cross-OS', description: 'One product, every desktop.' },
      { icon: Cable, title: 'System integration', description: 'Deep OS and device access.' },
      { icon: GitBranch, title: 'Auto-update', description: 'Seamless background updates.' },
      { icon: Gauge, title: 'Native speed', description: 'Responsive, efficient code.' },
    ],
    capabilities: [
      'Windows, macOS, and Linux builds',
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
    short: 'Build, fine-tune, and custom-train AI models — or deploy our in-house models.',
    tagline: 'Models for your domain',
    icon: BrainCircuit,
    color: GOOGLE_COLORS.green,
    image: '/img/ai.png',
    solutionImage: '/img/sol-ai.png',
    overview:
      'We develop and custom-train AI models on your data, fine-tune language and vision systems, and offer in-house models you can put to work immediately.',
    problem:
      'Off-the-shelf AI doesn’t know your domain, your data, or your edge cases — so it underperforms exactly where it matters most, and generic APIs get expensive and unpredictable at scale.',
    approach: [
      { title: 'Prepare your data', desc: 'Cleaning, labeling, and pipelines that make training actually work.' },
      { title: 'Train & fine-tune', desc: 'Custom and fine-tuned models tuned to your domain and metrics.' },
      { title: 'Serve at low latency', desc: 'Optimized, monitored inference — including our in-house models.' },
    ],
    features: [
      { icon: FlaskConical, title: 'Training', description: 'Data prep, training, and tuning.' },
      { icon: BrainCircuit, title: 'LLMs & vision', description: 'Fine-tuned to your domain.' },
      { icon: Eye, title: 'In-house models', description: 'Ready-built models you can use now.' },
      { icon: Gauge, title: 'Inference', description: 'Optimized, low-latency serving.' },
    ],
    capabilities: [
      'Custom model training and fine-tuning',
      'In-house models ready to deploy',
      'LLM deployment and optimization',
      'Vision and multimodal models',
      'Data preparation and labeling',
      'Evaluation, benchmarking, and validation',
    ],
    outcomes: ['Models tuned to your domain', 'In-house option, ready now', 'Fast, reliable inference'],
    stack: ['PyTorch', 'vLLM', 'CUDA', 'Hugging Face', 'ONNX'],
  },
  {
    slug: 'ai-automation',
    title: 'AI Automation',
    short: 'Automate entire business workflows end to end.',
    tagline: 'Automate the routine',
    icon: Workflow,
    color: GOOGLE_COLORS.blue,
    image: '/img/automation.png',
    solutionImage: '/img/sol-automation.png',
    overview:
      'Intelligent automation that connects your tools and removes manual effort — autonomous agents, document processing, and operations workflows that run themselves.',
    problem:
      'Teams burn hours on repetitive, rules-based work — copying data between systems, chasing approvals, and answering the same questions. It’s slow, error-prone, and impossible to scale by hiring.',
    approach: [
      { title: 'Find the busywork', desc: 'We map the repetitive, high-volume tasks worth automating first.' },
      { title: 'Build the agents', desc: 'Reliable agents and workflows that use your existing tools.' },
      { title: 'Keep humans in the loop', desc: 'Approvals, monitoring, and guardrails where they matter.' },
    ],
    features: [
      { icon: Bot, title: 'AI agents', description: 'Goal-driven agents that use your tools.' },
      { icon: Workflow, title: 'Workflows', description: 'Reliable orchestration across apps.' },
      { icon: Sparkles, title: 'Assistants', description: 'Conversational, tuned to you.' },
      { icon: LineChart, title: 'Ops at scale', description: 'Less manual work, more output.' },
    ],
    capabilities: [
      'Autonomous, tool-using AI agents',
      'Workflow orchestration and RPA',
      'Document understanding and extraction',
      'Conversational assistants',
      'Integration with your existing systems',
      'Monitoring and human-in-the-loop',
    ],
    outcomes: ['Hours of manual work removed', 'Fewer errors', 'Scales without new headcount'],
    stack: ['LangChain', 'OpenAI', 'n8n', 'Temporal', 'Vector DBs'],
  },
  {
    slug: 'audit-modernization',
    title: 'Audit & AI Modernization',
    short: 'Audit existing software, speed up processes, and make legacy systems AI-ready.',
    tagline: 'Bring your stack to the AI era',
    icon: RefreshCw,
    color: GOOGLE_COLORS.red,
    image: '/img/audit.png',
    solutionImage: '/img/sol-audit.png',
    overview:
      'We audit your existing software and processes, find what is slowing you down, and modernize it — upgrading legacy systems to be AI-ready and AI-enabled.',
    problem:
      'Legacy software slows you down, costs more every year, and locks you out of AI. But a full rewrite is risky, expensive, and most teams can’t afford to stop and rebuild from scratch.',
    approach: [
      { title: 'Audit what you have', desc: 'A clear-eyed review of code, architecture, performance, and risk.' },
      { title: 'Modernize safely', desc: 'Incremental upgrades — no risky big-bang rewrite.' },
      { title: 'AI-enable the core', desc: 'Add the data and hooks that make your software AI-ready.' },
    ],
    features: [
      { icon: Search, title: 'Audit', description: 'Find what slows you down.' },
      { icon: Gauge, title: 'Speed-ups', description: 'Faster processes and software.' },
      { icon: Sparkles, title: 'AI-enable', description: 'Make existing software AI-ready.' },
      { icon: ShieldCheck, title: 'Hardened', description: 'Secured as part of the upgrade.' },
    ],
    capabilities: [
      'Software and architecture audits',
      'Process and performance audits',
      'Legacy modernization',
      'AI-readiness assessment',
      'AI feature enablement',
      'Security review and hardening',
    ],
    outcomes: ['Faster, safer systems', 'An AI-ready foundation', 'No risky big-bang rewrite'],
    stack: ['Static analysis', 'Profiling', 'Cloud', 'LLMs'],
  },
  {
    slug: 'managed-services',
    title: 'Managed & Custom Services',
    short: 'Provision custom-built or managed services for your business on demand.',
    tagline: 'Services on demand',
    icon: Server,
    color: GOOGLE_COLORS.green,
    image: '/img/managed.png',
    solutionImage: '/img/sol-managed.png',
    overview:
      'Need something specific? We provision custom-built and managed services for your business — from dedicated infrastructure to bespoke capabilities, run and maintained by us.',
    problem:
      'Running infrastructure, uptime, and support in-house pulls your best engineers away from the product — and gaps in monitoring or on-call only show up when something is already on fire.',
    approach: [
      { title: 'Provision & set up', desc: 'We stand up the infrastructure and services you need.' },
      { title: 'Run & monitor', desc: 'Proactive monitoring, alerting, and SLAs so nothing surprises you.' },
      { title: 'Support & scale', desc: 'Dedicated engineering that grows capacity with your demand.' },
    ],
    features: [
      { icon: Server, title: 'Managed infra', description: 'We run it so you do not have to.' },
      { icon: ShieldCheck, title: 'Reliability', description: 'SLAs, monitoring, uptime.' },
      { icon: LifeBuoy, title: 'Support', description: 'Dedicated engineering on call.' },
      { icon: GitBranch, title: 'Maintenance', description: 'Kept current and healthy.' },
    ],
    capabilities: [
      'Custom-built services',
      'Managed infrastructure and operations',
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
