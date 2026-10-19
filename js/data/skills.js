// Skills grouped by category. `evidence` lists project ids (see projects.js)
// where the skill was used; 'cv' means the skill is stated on the CV and
// 'ysse' means it was used in the YSSE internship.
// Only skills supported by the CV, GitHub repositories or project files.

export const skillGroups = [
  {
    id: 'ml',
    title: 'AI & Machine Learning',
    note: 'Models, retrieval and evaluation',
    skills: [
      { name: 'Machine Learning', evidence: ['air-quality', 'cv'] },
      { name: 'Random Forest', evidence: ['air-quality'] },
      { name: 'LightGBM', evidence: ['air-quality'] },
      { name: 'KNN & SVM', evidence: ['air-quality'] },
      { name: 'scikit-learn', evidence: ['air-quality'] },
      { name: 'Model evaluation', evidence: ['air-quality', 'docusense', 'cv'] },
      { name: 'Retrieval-augmented generation (RAG)', evidence: ['docusense'] },
      { name: 'Embeddings & FAISS vector search', evidence: ['docusense'] },
      { name: 'LLM guardrails', evidence: ['docusense'] },
      { name: 'Prompt engineering', evidence: ['docusense', 'ysse'] },
      { name: 'AI tool evaluation', evidence: ['ysse'] },
      { name: 'Rule-based recommendation logic', evidence: ['agricycle', 'careerpilot', 'ecobin', 'pulse'] },
    ],
  },
  {
    id: 'data',
    title: 'Data & IoT',
    note: 'Collection, analysis and visualization',
    skills: [
      { name: 'Data analysis', evidence: ['air-quality', 'cv'] },
      { name: 'Data preprocessing', evidence: ['air-quality'] },
      { name: 'Data visualization', evidence: ['air-quality', 'careerpilot', 'ecobin', 'cv'] },
      { name: 'IoT sensor data', evidence: ['air-quality'] },
      { name: 'SQL', evidence: ['cv'] },
      { name: 'MS Excel', evidence: ['cv'] },
      { name: 'Chart.js', evidence: ['air-quality', 'agricycle', 'careerpilot'] },
    ],
  },
  {
    id: 'code',
    title: 'Programming & Web',
    note: 'Building working software',
    skills: [
      { name: 'Python', evidence: ['air-quality', 'docusense'] },
      { name: 'FastAPI', evidence: ['docusense'] },
      { name: 'JavaScript (ES6+)', evidence: ['air-quality', 'agricycle', 'careerpilot', 'ecobin', 'pulse'] },
      { name: 'HTML5 & CSS3', evidence: ['agricycle', 'careerpilot', 'ecobin', 'pulse'] },
      { name: 'Progressive Web Apps', evidence: ['agricycle'] },
      { name: 'Tailwind CSS', evidence: ['careerpilot', 'ecobin', 'pulse'] },
      { name: 'C', evidence: ['phonebook'] },
      { name: 'Automated testing (pytest)', evidence: ['docusense'] },
      { name: 'Responsive, accessible UI', evidence: ['agricycle', 'careerpilot', 'ecobin', 'pulse'] },
    ],
  },
  {
    id: 'design',
    title: 'Design & Product',
    note: 'From idea to interface',
    skills: [
      { name: 'UI/UX design', evidence: ['agricycle', 'careerpilot', 'ecobin', 'cv'] },
      { name: 'Figma', evidence: ['cv'] },
      { name: 'Product prototyping', evidence: ['agricycle', 'ecobin', 'careerpilot'] },
      { name: 'Bilingual UX (বাংলা / English)', evidence: ['agricycle', 'air-quality'] },
      { name: 'AI-assisted content creation', evidence: ['ai-ads', 'cv'] },
      { name: 'Ad & campaign concepts', evidence: ['ai-ads', 'cv'] },
    ],
  },
  {
    id: 'tools',
    title: 'Tools & Delivery',
    note: 'Shipping and version control',
    skills: [
      { name: 'Git & GitHub', evidence: ['air-quality', 'agricycle', 'docusense', 'careerpilot', 'phonebook'] },
      { name: 'Docker', evidence: ['docusense'] },
      { name: 'GitHub Actions CI', evidence: ['docusense', 'careerpilot'] },
      { name: 'Netlify', evidence: ['air-quality', 'agricycle', 'pulse'] },
      { name: 'GitHub Pages', evidence: ['careerpilot'] },
      { name: 'Cloudflare', evidence: ['ecobin'] },
      { name: 'PowerPoint', evidence: ['ysse'] },
    ],
  },
  {
    id: 'people',
    title: 'Working with people',
    note: 'How I collaborate',
    skills: [
      { name: 'Presentation', evidence: ['ysse'] },
      { name: 'Technical writing', evidence: ['ysse', 'docusense'] },
      { name: 'Project coordination', evidence: ['ecobin', 'cv'] },
      { name: 'Team collaboration', evidence: ['air-quality', 'ysse', 'cv'] },
      { name: 'Leadership', evidence: ['ecobin', 'cv'] },
      { name: 'Time management', evidence: ['cv'] },
      { name: 'Fast learning', evidence: ['cv'] },
    ],
  },
]
