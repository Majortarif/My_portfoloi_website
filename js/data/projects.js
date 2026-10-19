// Project content. Sources: each project's GitHub README, the live apps and
// the CSE400C capstone. No metrics are added beyond what those state.

export const featured = {
  id: 'air-quality',
  title: 'Air Quality Prediction using Machine Learning & AI',
  shortTitle: 'Air Quality Prediction',
  kicker: 'Featured · CSE400C capstone · IoT + ML · Live app',
  lede: 'A low-cost IoT sensor node, 62,188 real readings from Dhaka, and a Random Forest that predicts the US EPA Air Quality Index. The trained forest is exported to JSON and runs inside a real-time web dashboard, with no server and no API key.',
  facts: [
    {
      label: 'Problem',
      text: 'Dhaka is one of the most polluted cities on Earth, and official monitoring stations are few and far between. People need a simple, live answer to "is the air safe right now?"',
    },
    {
      label: 'Data',
      text: '62,188 rows logged on 3–4 December 2025 in Badda and Aftabnagar, Dhaka, by a sensor node (PMSA003, MQ-7, MQ-131, MEMS NO₂, DHT22). Seven features: temperature, humidity, PM2.5, PM10, NO₂, O₃ and CO.',
    },
    {
      label: 'Model',
      text: 'A scikit-learn Random Forest (40 trees) learns the US EPA AQI from the raw readings, compared against LightGBM, KNN and SVM. PM2.5 carries 0.968 of the feature importance, matching Dhaka\'s reality.',
    },
    {
      label: 'Evaluation',
      text: 'Headline score is a time-ordered hold-out: R² 0.9933, RMSE 3.41 on 12,438 unseen rows. A random split scores 0.9998, but near-duplicate rows leak across it, so it is reported only as a comparison.',
    },
    {
      label: 'Delivery',
      text: 'One HTML file: animated AQI gauge, live Open-Meteo data, IoT sensor mode, 24-hour forecast, health advice and an English / বাংলা toggle. The browser forest matches scikit-learn to within 0.0002 AQI.',
    },
  ],
  role: 'Team of three · CSE400C Capstone, East West University · Supervised by Dr. Tania Sultana',
  tags: ['Python', 'scikit-learn', 'Random Forest', 'LightGBM', 'IoT sensors', 'JavaScript', 'Chart.js', 'US EPA AQI'],
  image: { src: 'assets/img/projects/air-quality.webp', width: 800, height: 500, alt: 'Air quality dashboard with an AQI gauge reading Unhealthy, a Random Forest check and cards for each pollutant' },
  url: 'airqualitypredictionapp.netlify.app',
  links: [
    { label: 'Live app', href: 'https://airqualitypredictionapp.netlify.app/', icon: 'arrow-up-right' },
    { label: 'Source', href: 'https://github.com/Majortarif/Air-Quality-Prediction-using-Machine-Learning-and-AI', icon: 'github' },
    { label: 'Report & files', href: 'https://drive.google.com/drive/folders/10eSsJFSNciL62RBukbYIgn-VzT1FQ4fR', icon: 'folder' },
  ],
  // Drives the pipeline diagram.
  pipeline: {
    inputs: ['Temp', 'Humidity', 'PM2.5', 'PM10', 'NO₂', 'O₃', 'CO'],
    prep: 'EPA AQI labels',
    models: ['Random Forest', 'LightGBM', 'KNN', 'SVM'],
    short: ['RF', 'LGBM', 'KNN', 'SVM'],
    explain: 'JSON',
    output: 'Live app',
  },
}

export const builds = [
  {
    id: 'agricycle',
    index: '02',
    title: 'AgriCycle',
    kicker: 'AgriTech PWA · CSE495 · 2026',
    summary: 'An offline-first, Bangla-first web app for smallholder farmers in Bangladesh: sell crops directly to buyers without middlemen, earn from crop waste instead of burning it, and get rewarded for green farming.',
    features: [
      'Farmer–buyer marketplace with listings, search, filters, order tracking and a "you earned more than the middleman" badge',
      'Waste-recycling matcher that ranks partner units by distance (haversine, optional GPS) and estimates CO₂ saved',
      'Rule-based Krishi advisor covering 43 topics, built so a real LLM can be plugged in later',
      'Installable PWA with a service worker, 64 districts, Bangla + English and farmer, buyer and admin roles',
    ],
    tags: ['JavaScript', 'PWA', 'Service Worker', 'Chart.js', 'i18n (বাংলা / EN)', 'Netlify'],
    image: { src: 'assets/img/projects/agricycle.webp', width: 800, height: 500, alt: 'Four AgriCycle phone screens in Bangla: home, marketplace, waste matcher and the advisor chat' },
    url: 'greencycle-farm.netlify.app',
    links: [
      { label: 'Live demo', href: 'https://greencycle-farm.netlify.app/', icon: 'arrow-up-right' },
      { label: 'Source', href: 'https://github.com/Majortarif/AgriCycle', icon: 'github' },
    ],
  },
  {
    id: 'docusense',
    index: '03',
    title: 'DocuSense RAG',
    kicker: 'AI engineering · Grounded RAG service · 2026',
    summary: 'A FastAPI microservice that answers questions only from internal documentation. When the answer is not in the documents it returns one fixed fallback sentence instead of guessing.',
    features: [
      'Markdown-aware chunking, local bge-small-en-v1.5 embeddings and exact cosine search in FAISS',
      'Answers written by Claude with structured JSON output, or an LLM-free extractive mode that needs no key',
      'Guardrails: prompt-injection screen, similarity gate, citation check and numeric grounding',
      '106 automated tests, a golden-set evaluation, Docker and GitHub Actions CI',
    ],
    tags: ['Python', 'FastAPI', 'FAISS', 'RAG', 'LLM guardrails', 'Docker', 'GitHub Actions'],
    visual: 'terminal',
    terminalTitle: 'POST /api/query',
    // Real request and response from the README (extractive mode).
    terminal: [
      '$ curl -X POST localhost:8000/api/query \\',
      '    -d \'{"question": "What is the policy on',
      '         database backup retention periods?"}\'',
      '',
      '{',
      '  "answer": "All primary database backups are',
      '    retained for a rolling period of 30 calendar',
      '    days. ...",',
      '  "sources": [{',
      '    "chunk_id": "chunk_04",',
      '    "similarity_score": 0.87',
      '  }],',
      '  "tokens_used": 0',
      '}',
    ],
    links: [
      { label: 'Source', href: 'https://github.com/Majortarif/docusense-rag', icon: 'github' },
    ],
  },
  {
    id: 'careerpilot',
    index: '04',
    title: 'CareerPilot AI',
    kicker: 'Career intelligence · Frontend prototype · 2026',
    summary: 'A career and skill intelligence workspace: analyse a CV and job descriptions, see skill gaps, follow a 12-week learning roadmap and track applications, all from one connected profile.',
    features: [
      'Skill extraction from CVs and job descriptions with required vs. preferred detection',
      'Skill-gap scoring and a generated 12-week roadmap',
      'Application tracker with seven statuses, search, filters and analytics',
      'Rule-based "AI" logic that is deterministic and clearly labelled as simulated',
    ],
    tags: ['JavaScript (ES modules)', 'Tailwind CSS', 'Chart.js', 'LocalStorage', '12 pages'],
    image: { src: 'assets/img/projects/careerpilot.webp', width: 799, height: 499, alt: 'CareerPilot AI dashboard showing career readiness, profile completion, skill gaps and application KPIs' },
    url: 'majortarif.github.io/CareerPilot-AI',
    links: [
      { label: 'Live demo', href: 'https://majortarif.github.io/CareerPilot-AI-AI-Powered-Career-Skill-Intelligence-Platform/', icon: 'arrow-up-right' },
      { label: 'Source', href: 'https://github.com/Majortarif/CareerPilot-AI-AI-Powered-Career-Skill-Intelligence-Platform', icon: 'github' },
    ],
  },
  {
    id: 'ecobin',
    index: '05',
    title: 'EcoBin 2.0',
    kicker: 'Smart waste management · Concept + 2026 dashboard',
    summary: 'An AI-powered smart waste bin concept I led from problem definition to prototype design, with a companion operations dashboard for monitoring bins, analysing waste and planning collection routes.',
    features: [
      'Led problem definition, solution planning and execution from concept to prototype',
      'Dashboard for 48 simulated smart bins: fill level, battery, temperature and waste type',
      'Waste analytics plus collection routes with a rule-based route-optimization simulator',
      'Responsive, keyboard-friendly UI with data export, import and reset',
    ],
    tags: ['Product design', 'JavaScript', 'Tailwind CSS', 'LocalStorage', 'Cloudflare'],
    image: { src: 'assets/img/projects/ecobin.webp', width: 800, height: 500, alt: 'EcoBin dashboard listing smart bins with fill levels, waste types and critical status badges' },
    url: 'icy-leaf-c41a.tariful-ewu.workers.dev',
    links: [
      { label: 'Live demo', href: 'https://icy-leaf-c41a.tariful-ewu.workers.dev/', icon: 'arrow-up-right' },
      { label: 'Source', href: 'https://github.com/Majortarif/ecobin-smart-waste-dashboard', icon: 'github' },
      { label: 'Concept files', href: 'https://drive.google.com/drive/folders/1W-2s4X11G8-sNc0Ek1QOp7l2QCd51YaW', icon: 'folder' },
    ],
  },
  {
    id: 'pulse',
    index: '06',
    title: 'Pulse',
    kicker: 'Productivity · Task & habit tracker · 2026',
    summary: 'An AI-assisted task and habit tracker that goes beyond a to-do list: organise tasks, build streaks, read your own productivity analytics and ask a contextual coach what to do next.',
    features: [
      'Tasks with priorities, due dates, search, sorting and filtering',
      'Habit streaks calculated from real completion dates, not click counts',
      'Rule-based AI Coach that answers from your current tasks and habits',
      'Dark and light themes, local persistence, data export and import',
    ],
    tags: ['JavaScript', 'Tailwind CSS', 'LocalStorage', 'Netlify'],
    image: { src: 'assets/img/projects/pulse.webp', width: 800, height: 500, alt: 'Pulse dashboard with total tasks, completion rate, habits and current streak cards above a task list' },
    url: 'ai-task-habit-tracker.netlify.app',
    links: [
      { label: 'Live demo', href: 'https://ai-task-habit-tracker.netlify.app/', icon: 'arrow-up-right' },
      { label: 'Source', href: 'https://github.com/Majortarif/ai-task-habit-tracker', icon: 'github' },
    ],
  },
]

export const moreWork = [
  {
    id: 'phonebook',
    title: 'Digital Phonebook 2026',
    shortTitle: 'Digital Phonebook',
    kicker: 'C · Console application',
    summary: 'My 2022 C console project, rebuilt in 2026 with proper fixes: full contact CRUD, search across six fields, blocking, favourites, statistics and export to a readable text file, with a colourised UI.',
    tags: ['C', 'File I/O', 'Code::Blocks · MinGW GCC'],
    visual: 'terminal',
    terminalTitle: 'phonebook.exe',
    // Real menu output of phonebook.c (showTitle + showOptions)
    terminal: [
      '=================================================',
      '      DIGITAL PHONEBOOK -- 2026 EDITION',
      '=================================================',
      '',
      ' 1. Create new contact',
      ' 2. View all contacts',
      ' 3. Edit contact',
      ' 4. Find contact',
      ' 5. Remove contact',
      ' 6. Block contact',
      ' 7. View blocked contacts',
      ' 8. Mark / unmark favorite',
      ' 9. View favorite contacts',
      '10. Contact statistics',
      '11. Export contacts to file',
      '12. Exit',
      '',
      'Select your option: ',
    ],
    links: [
      { label: 'Source', href: 'https://github.com/Majortarif/Digital_phone_book', icon: 'github' },
    ],
  },
  {
    id: 'ai-ads',
    title: 'AI-Powered Short Advertisement Creation',
    shortTitle: 'AI Ad Creation',
    kicker: 'Generative AI · Digital marketing',
    summary: 'Short-form promotional ads and creative ad concepts produced with AI-based generative content tools, exploring how AI-assisted workflows can make advertising faster and more creative.',
    tags: ['Generative AI', 'Advertising', 'Creative content'],
    visual: 'flow',
    // From the CV: ad concepts, made with generative tools, delivered as short-form ads
    flow: ['Creative ad concepts', 'AI-based generative content tools', 'Short-form promotional ads'],
    links: [
      { label: 'Project files', href: 'https://drive.google.com/drive/folders/1sht8pv4eu30iUAAp8_G1_nMwnoIfspnC', icon: 'folder' },
    ],
  },
]

/** Every project by id, used by the skills "evidence" links. */
export const projectIndex = Object.fromEntries(
  [featured, ...builds, ...moreWork].map((p) => [p.id, p.shortTitle || p.title]),
)
