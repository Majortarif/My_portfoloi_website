# Tariful Hoque — Portfolio

A premium, dark-first personal portfolio built with React, Vite, Tailwind CSS,
and Framer Motion. Content is separated from UI: everything in
`src/data/projects.js` and `src/data/content.js` is pulled directly from the
CV, with no invented experience, results, or metrics.

## Folder structure

```
tariful-portfolio/
├─ index.html
├─ package.json
├─ vite.config.js
├─ tailwind.config.js
├─ postcss.config.js
├─ public/
│  ├─ tariful-hoque.jpg     # portrait shown in the Hero section
│  └─ gallery/              # Gallery photos (full size + "-thumb" version of each)
├─ src/
│  ├─ main.jsx
│  ├─ App.jsx
│  ├─ index.css
│  ├─ data/
│  │  ├─ content.js        # profile, expertise, skills, education, volunteering
│  │  ├─ projects.js        # the 3 featured projects
│  │  └─ gallery.js         # Gallery photo list and captions
│  └─ components/
│     ├─ Navbar.jsx
│     ├─ Hero.jsx
│     ├─ NetworkVisual.jsx  # animated AI/Data/XAI/Design/Marketing diagram
│     ├─ About.jsx
│     ├─ Expertise.jsx
│     ├─ Toolkit.jsx        # interactive "My Toolkit" flow
│     ├─ Projects.jsx
│     ├─ ProjectVisual.jsx  # abstract SVG placeholders per project
│     ├─ ProjectModal.jsx
│     ├─ Skills.jsx
│     ├─ Education.jsx
│     ├─ Volunteering.jsx
│     ├─ Gallery.jsx        # responsive photo grid
│     ├─ GalleryLightbox.jsx # full-size photo viewer
│     ├─ CareerDirection.jsx
│     ├─ Contact.jsx
│     └─ Footer.jsx
```

## 1. Install

```bash
npm install
```

## 2. Run locally

```bash
npm run dev
```

Opens at `http://localhost:5173`.

## 3. Build for production

```bash
npm run build
```

Output goes to `dist/`.

## 4. Preview the production build

```bash
npm run preview
```

## 5. Deploy to Vercel

**Option A — CLI**

```bash
npm i -g vercel
vercel
```

Follow the prompts. Framework preset: **Vite**. Build command: `npm run build`.
Output directory: `dist`.

**Option B — Git-based deploy**

1. Push this folder to a GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel auto-detects Vite — confirm build command `vite build` and output
   directory `dist`.
4. Deploy.

## Updating content later

- **Projects**: edit `src/data/projects.js`. Each project is one object in the
  `projects` array — update `title`, `summary`, `overview`, `problem`,
  `solution`, `contribution`, `features`, `tags`, and `link` as needed. Adding
  a new project just means adding a new object and (optionally) a matching
  visual in `ProjectVisual.jsx`.
- **Profile / contact info**: edit `profile` in `src/data/content.js` (name,
  headline, email, phone, LinkedIn, GitHub, location, address, photo).
- **Gallery**: edit `src/data/gallery.js`. To add a photo, put a full-size JPEG
  (about 1800px on the long side) and a smaller `-thumb` version (about 800px
  wide) in `public/gallery/`, then add one entry with its file names, size,
  caption and alt text. Entries appear in the order they are listed.
- **Profile photo**: replace `public/tariful-hoque.jpg` (or point
  `profile.photo` to a different file in `public/`). It is shown as a circular
  portrait in the Hero section.
- **Skills, education, volunteering**: each has its own array in
  `src/data/content.js` — add, remove, or reorder items directly.
- **Contact form**: currently uses a `mailto:` link (no backend). To connect a
  real email service (e.g. Formspree, Resend, EmailJS), replace the
  `handleSubmit` function in `src/components/Contact.jsx` with an API call.

## Notes

- All copy is written to be truthful to the source CV — no fabricated job
  experience, companies, metrics, or results.
- Project visuals in `ProjectVisual.jsx` are abstract SVG illustrations, not
  screenshots, since no real project screenshots were provided.
- Reduced-motion preferences are respected globally via
  `prefers-reduced-motion` in `src/index.css`.
