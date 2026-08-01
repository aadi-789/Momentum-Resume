# Momentum Resume

Create professional, ATS-friendly resumes with LaTeX precision — live preview, multiple templates, and full style control, right in the browser.



---

## ✨ Features

| Feature | Description |
|---|---|
| **⚡ Live LaTeX Preview** | Type in the form, see a compiled PDF update automatically (debounced auto-compile). |
| **🎨 3 Templates** | **Classic** (single-column, ATS-friendly, recommended), **Modern** (two-column with accent header + sidebar), **Minimal** (no icons/color/tables, maximum ATS compatibility). |
| **🧩 Custom Sections** | Add your own sections beyond Education/Experience/Projects/Skills/Certifications — each with heading, subheading, date, and bullet points. |
| **↕️ Drag-and-Drop Ordering** | Reorder built-in and custom sections; the order is reflected exactly in the generated PDF. |
| **🖌️ Style Customization** | Pick a font (Latin Modern / Charter / Sans), an accent color, and a spacing density (Compact / Normal / Spacious) — applied across all templates. |
| **💾 Auto-Save** | Resume data, section order, template choice, and style settings all persist to `localStorage`. |
| **🌓 Dark / Light Mode** | Toggle themes; preference is remembered across sessions. |
| **📥 Instant Download** | Get your resume as a polished PDF, ready to send. |

---

## 🛠️ Tech Stack

- **Frontend:** React 19, React Router 7
- **Styling:** Tailwind CSS utility classes + a custom CSS design-token system (`src/index.css`) for theming/animation
- **UI:** lucide-react (icons), `@hello-pangea/dnd` (drag & drop)
- **PDF Generation:** LaTeX, compiled via the [ytotech LaTeX compiler API](https://latex.ytotech.com)
- **Analytics:** Vercel Analytics
- **Build Tool:** Create React App (`react-scripts`) — see [Roadmap](#-roadmap) for a planned Vite migration

---

## 🏗️ Architecture

Business logic is fully decoupled from the UI, so templates/styles can change without touching how resume data is generated or stored:

```
Business Logic (services/, utils/)  — zero React imports, unit-testable
        ↓
State (hooks/, context/)            — reusable stateful logic, global state
        ↓
Presentation (components/, features/) — small, focused, composable UI
```

**How a resume becomes a PDF:**

```
resumeData + sectionOrder
        ↓ (services/latex/contentBuilder.js)
  template-agnostic, pre-escaped content tree
        ↓ (services/templates/{classic,modern,minimal}Template.js)
  full LaTeX document string
        ↓ (services/exportService.js → ytotech API)
  compiled PDF blob → object URL → <object> preview + download link
```

Adding a 4th template means writing one new file in `services/templates/` that consumes the same content tree — no changes needed to the form, storage, or the other two templates.

## 📁 Folder Structure

```
src/
├── components/
│   ├── common/         # ThemeToggle, CollapsibleSection (generic, reusable)
│   └── editor/          # TemplatePicker, StyleSettingsPanel, SectionOrderManager
├── constants/            # resumeDefaults.js — default data shape, templates, style options
├── context/              # ThemeContext (dark/light mode — the only global state)
├── features/
│   └── resume/           # ResumeEditor.js — the page itself, wires everything together
├── hooks/                 # useLocalStorage, useResumeExport
├── services/
│   ├── latex/             # contentBuilder, fontPackages, spacingPresets (shared by all templates)
│   ├── templates/         # classicTemplate, modernTemplate, minimalTemplate
│   ├── latexService.js    # orchestrator — picks a template renderer
│   └── exportService.js   # talks to the PDF compiler API
├── utils/                 # latexEscape, urlHelpers — pure helpers, no React
├── LandingPage.js
├── App.js
└── index.js
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- npm

### Installation

```bash
git clone https://github.com/<your-username>/momentum-resume.git
cd momentum-resume
npm install
```

### Environment Variables

None required — PDF compilation uses a public compiler endpoint out of the box.

### Running Locally

```bash
npm start
```

Opens [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
```

Outputs an optimized production bundle to `build/`.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm start` | Development server with hot reload |
| `npm run build` | Production build to `build/` |
| `npm test` | Test runner (interactive watch mode) |
| `npm run eject` | **One-way** — exposes the CRA config |

---

## 🚀 Deployment

Optimized for one-click deployment on **Vercel** or **Netlify** — connect your GitHub repo and every push to `main` deploys automatically.

---

## 🗺️ Roadmap

- [ ] Migrate build tooling from CRA (`react-scripts`) to **Vite** for faster local dev startup
- [ ] Real per-template preview screenshots on the landing page (currently placeholders — see `PREVIEW_TEMPLATES` in `LandingPage.js`)
- [ ] User accounts + cloud sync
- [ ] Resume version history
- [ ] Import from LinkedIn / existing PDF
- [ ] AI-assisted bullet-point suggestions

---

## 🤝 Contributing

1. Fork the project
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

Available for personal and portfolio use. Add a `LICENSE` file (e.g. MIT) if you intend to open-source or distribute it formally.

---

<div align="center">
  <strong>Made by Aditya Singh</strong>
</div>
