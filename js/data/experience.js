// Experience timeline. Sources: LinkedIn (Experience + Volunteering), the
// YSSE internship log, the CSE400C capstone and the GitHub repositories.

export const experience = [
  {
    period: 'Sep 2026 – Present',
    type: 'Internship',
    current: true,
    title: 'IT Intern, AI Integration & Cybersecurity Wing',
    org: 'Youth School for Social Entrepreneurs (YSSE)',
    summary: 'An 18-week IT internship in the AI Integration & Cybersecurity wing: hands-on assignments with AI tools, IT department training and weekly reporting to the wing.',
    points: [
      'Weekly presentation lead for the wing: build and present the weekly update deck at the official departmental meeting',
      'AI Tool Exploration: evaluated five assistants (ChatGPT, Gemini, Claude, Copilot and Grok) on a real East West University scenario with a scoring matrix, budget checks and a retest, written up as an 18-page report',
      'Prompt-cost study: measured how the same prompt costs more in Bangla than in English (647 vs 360 tokens) and what that means for AI budgets',
      'IT department training, including "Data to Intelligence", "From Words to Websites" and prompt engineering sessions',
    ],
    tags: ['AI integration', 'AI tool evaluation', 'Prompt engineering', 'Cybersecurity', 'Technical writing', 'Presentation'],
  },
  {
    period: '2026',
    type: 'Self-directed',
    title: 'AI & product engineer',
    org: 'Independent projects',
    summary: 'Designed, built and shipped software end to end, from problem framing and UI design to testing and deployment.',
    points: [
      'Built DocuSense, a grounded RAG microservice (FastAPI, FAISS, Claude) with anti-hallucination guardrails, 106 tests, Docker and CI',
      'Shipped AgriCycle, an offline-first Bangla PWA for farmers, plus CareerPilot AI, the EcoBin dashboard and the Pulse tracker',
      'Labelled rule-based "AI" features honestly as simulated, and documented every project with a README',
      'Deployed to Netlify, GitHub Pages and Cloudflare',
    ],
    tags: ['Python', 'FastAPI', 'RAG', 'JavaScript', 'PWA', 'UI/UX'],
  },
  {
    period: '2025',
    type: 'Academic research',
    title: 'Capstone research team member',
    org: 'East West University · CSE400C',
    summary: 'Three-person capstone on real-time air-quality prediction for Dhaka, supervised by Dr. Tania Sultana, Department of Computer Science and Engineering.',
    points: [
      'Collected 62,188 readings with a low-cost IoT sensor node in Badda and Aftabnagar',
      'Trained a Random Forest on the US EPA AQI and compared it with LightGBM, KNN and SVM, reporting an honest time-ordered score (R² 0.9933)',
      'Shipped the model inside a live web dashboard where prediction runs on the user\'s device',
    ],
    tags: ['Machine Learning', 'IoT', 'Data Analysis', 'Python'],
  },
  {
    period: '2 years each',
    type: 'Volunteering',
    title: 'Club volunteer',
    org: 'Three campus clubs, East West University',
    summary: 'Two years each with three clubs, organizing technical events and supporting workshops, runs and outreach.',
    points: [],
    tags: [],
    roles: [
      { org: 'EWU Robotics Club', text: 'Assisted in organizing technical events and managing team logistics.' },
      { org: 'Science Club', text: 'Contributed to promoting scientific innovation and to event coordination.' },
      { org: 'Telecommunication Club', text: 'Participated in workshops and managed communication-based project outreach.' },
    ],
  },
]
