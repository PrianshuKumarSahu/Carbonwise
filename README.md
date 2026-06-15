# CarbonWise 🌍

**Understand, Track & Reduce Your Carbon Footprint**

[![Live Demo](https://img.shields.io/badge/Live-Demo-059669?style=for-the-badge&logo=google-cloud&logoColor=white)](https://carbonproject-499409.web.app)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

CarbonWise is a personalized carbon footprint awareness platform that helps individuals understand their environmental impact through an interactive calculator, visual dashboard, and science-backed reduction strategies.

![CarbonWise Screenshot](screenshots/hero.png)

## ✨ Features

### 🧮 Carbon Calculator
Multi-step calculator covering transport, home energy, diet, and shopping with real-time calculations based on EPA/DEFRA emission factors.

### 📊 Interactive Dashboard
Visual breakdown of your carbon footprint with Chart.js-powered doughnut charts, trend lines, and comparison against global averages.

### 🌱 Personalized Reduction Tips
20+ actionable tips sorted by impact, with a pledge system to track your commitments and calculate potential savings.

### 📚 Educational Hub
Interactive quizzes, myth busters, CO₂ comparisons, and curated facts to deepen your understanding of carbon emissions.

### ♿ Accessible & Inclusive
WCAG AA compliant with keyboard navigation, screen reader support, `prefers-reduced-motion` respect, and 4.5:1 contrast ratios.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Vite** | Build tool & dev server |
| **Vanilla JS** | No framework overhead — clean ES modules |
| **CSS Custom Properties** | Design system tokens |
| **Chart.js** | Data visualization |
| **Lucide Icons** | SVG icon library |
| **Vitest** | Unit testing |
| **Firebase Hosting** | Deployment on Google Cloud |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
git clone https://github.com/PrianshuKumarSahu/Carbonwise.git
cd Carbonwise
npm install
```

### Development

```bash
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000)

### Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

### Build

```bash
npm run build
npm run preview    # Preview production build
```

## 📁 Project Structure

```
carbonwise/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── navbar.js
│   │   ├── footer.js
│   │   ├── charts.js
│   │   ├── form-controls.js
│   │   ├── toast.js
│   │   └── modal.js
│   ├── data/            # Data modules
│   │   ├── emission-factors.js
│   │   ├── tips.js
│   │   └── facts.js
│   ├── pages/           # Page modules
│   │   ├── home.js
│   │   ├── calculator.js
│   │   ├── dashboard.js
│   │   ├── reduce.js
│   │   ├── learn.js
│   │   └── about.js
│   ├── styles/          # CSS design system
│   │   ├── variables.css
│   │   ├── base.css
│   │   ├── components.css
│   │   └── animations.css
│   ├── utils/           # Utility functions
│   │   ├── calculator.js
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── accessibility.js
│   ├── main.js          # App entry point
│   ├── router.js        # SPA router
│   └── state.js         # State management
├── tests/               # Unit tests
├── index.html           # HTML entry
├── vite.config.js
├── vitest.config.js
└── package.json
```

## 🔬 Calculation Methodology

Carbon footprint calculations use emission factors from:
- **EPA** (US Environmental Protection Agency)
- **DEFRA** (UK Department for Environment, Food & Rural Affairs)
- **Our World in Data** for global averages

All values are in **kg CO₂ equivalent per year**.

## 🌐 Deployment

Deployed on **Google Cloud** via **Firebase Hosting**:

```bash
npm run build
firebase deploy
```

## 📊 Design System

Design tokens powered by [UI/UX Pro Max Skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill):
- **Style**: Organic Biophilic + Soft UI
- **Colors**: Nature-inspired emerald greens with amber accents
- **Typography**: Outfit (headings) + Work Sans (body)
- **Accessibility**: WCAG AA compliant

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

**Built with 💚 for a sustainable future.**
