// Personal details and About-section content.
// Sources: CV (2026), LinkedIn, GitHub repositories, CSE400C capstone.

export const profile = {
  name: 'Tariful Hoque',
  role: 'CSE Graduate · ML & AI · Data Science · UI/UX',
  location: 'Dhaka, Bangladesh',
  university: 'East West University',
  degree: 'B.Sc. in Computer Science & Engineering',
  email: 'tarifulhoque347@gmail.com',
  cv: 'assets/cv/Tariful_Hoque_CV.pdf',
  // Contact form endpoint, e.g. 'https://formspree.io/f/abcdwxyz'. Leave empty
  // and the form opens the visitor's email app instead.
  formEndpoint: '',
  portrait: 'assets/img/portrait.webp',
  links: {
    linkedin: 'https://www.linkedin.com/in/tariful-hoque-582321259/',
    github: 'https://github.com/Majortarif',
  },
  languages: [
    { name: 'Bengali', level: 'Native' },
    { name: 'English', level: 'Professional working proficiency' },
  ],
}

export const about = {
  story: [
    'I am a Computer Science graduate from East West University with a focus on Machine Learning, Data Analysis and emerging AI technologies. I enjoy turning data and technology into practical solutions for real-world problems.',
    'My thesis, Air Quality Prediction using ML & AI, involved building predictive models and making their results interpretable with SHAP, LIME, partial dependence plots (PDP) and permutation-based analysis. Beyond AI and data, I am exploring UI/UX design and digital marketing, and how user experience and communication make digital products better.',
    'I keep growing through hands-on projects, GitHub development, UI/UX practice and my IT internship at YSSE. I am open to roles, collaborations and projects where I can apply my technical background, analytical thinking, creativity and communication skills to meaningful work.',
  ],

  // "From problem definition and data understanding through model building,
  // interpretation of results, and prototype delivery" (CV summary)
  process: [
    { title: 'Define', text: 'Frame the real problem and what a useful answer looks like.' },
    { title: 'Understand the data', text: 'Collect, explore, clean and prepare the data before modelling.' },
    { title: 'Model', text: 'Build and compare candidate models or retrieval pipelines.' },
    { title: 'Evaluate', text: 'Test honestly: time-ordered splits, golden sets, guardrails.' },
    { title: 'Deliver', text: 'Ship a live app or service people can actually use.' },
  ],

  // "Core interests", from the profile intro the owner wrote (2026-10-20)
  focus: [
    'Machine Learning & Artificial Intelligence',
    'Data analysis & data-driven solutions',
    'Explainable AI (XAI)',
    'Python & data technologies',
    'UI/UX design',
  ],

  // Real numbers only: all from the project READMEs.
  numbers: [
    { value: 62, suffix: 'K+', label: 'IoT sensor readings in the capstone dataset' },
    { value: 7, suffix: '', label: 'environmental features modelled' },
    { value: 5, suffix: '', label: 'live apps deployed on the web' },
    { value: 106, suffix: '', label: 'automated tests in the DocuSense RAG service' },
  ],

  beyond: [
    { title: 'UI/UX design', text: 'Interfaces and flows designed in Figma.' },
    { title: 'AI-assisted content', text: 'Short-form ads and campaign concepts made with generative tools.' },
    { title: 'Presenting', text: 'Weekly update decks for the YSSE AI & Cybersecurity wing.' },
  ],

  // Typed line by line in the About terminal card.
  terminal: [
    { cmd: 'whoami', out: 'tariful-hoque · CSE graduate, East West University' },
    { cmd: 'cat role.txt', out: 'IT Intern · AI Integration & Cybersecurity · YSSE' },
    { cmd: 'ls ./stack', out: 'python  scikit-learn  fastapi  faiss  javascript  figma' },
    { cmd: 'git log --oneline -1', out: 'feat: ship AgriCycle PWA + DocuSense RAG' },
    { cmd: 'echo $STATUS', out: 'open to AI/ML roles · Dhaka, Bangladesh' },
  ],
}
