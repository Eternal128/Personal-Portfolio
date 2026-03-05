# James William Hanzell — Personal Portfolio

A sleek, minimal portfolio built with React and Framer Motion. Features parallax scrolling, smooth animations, and a clean black aesthetic to showcase my work and experience.

## ✨ Features

- **Hero Section** — Parallax scroll with multi-layer depth, shimmer name text, and animated scroll indicator
- **About / Gallery** — 3-column masonry image grid with grayscale-to-color hover, custom cursor labels, and per-card parallax
- **Experience** — Vertical timeline of professional roles
- **Technical Skills** — 3D floating technology balls with interactive rotation
- **Projects** — Tilt-enabled project cards with GitHub links
- **Testimonials** — Auto-scrolling infinite carousel that pauses on hover
- **Contact** — EmailJS-powered contact form with 3D Earth globe
- **End Section** — Physics-based falling text using Matter.js

## 🛠️ Tech Stack

- **React + Vite** — UI and build tooling
- **Framer Motion** — Animations, parallax, and scroll effects
- **Three.js / React Three Fiber / Drei** — 3D models and tech balls
- **Matter.js** — Physics engine for the end section
- **Tailwind CSS** — Utility styling
- **EmailJS** — Contact form email delivery
- **react-parallax-tilt** — Tilt effects on project cards

## 📦 Installation

```bash
git clone https://github.com/Eternal128/Personal-Portfolio.git
cd Personal-Portfolio
npm install --legacy-peer-deps
```

Create a `.env` file in the root:

```env
VITE_APP_EMAILJS_SERVICE_ID=your_service_id
VITE_APP_EMAILJS_TEMPLATE_ID=your_template_id
VITE_APP_EMAILJS_PUBLIC_KEY=your_public_key
```

```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── assets/
├── components/
│   ├── canvas/        # Three.js components
│   ├── Hero.jsx
│   ├── About.jsx
│   ├── Experience.jsx
│   ├── Tech.jsx
│   ├── Works.jsx
│   ├── Feedbacks.jsx
│   ├── Contact.jsx
│   ├── End.jsx
│   └── Navbar.jsx
├── constants/
├── hoc/
├── utils/
├── App.jsx
└── main.jsx
```

## 🚀 Deployment

Deployed on Vercel. Add your `.env` variables under **Settings → Environment Variables** in the Vercel dashboard, then any `git push` to `main` triggers an automatic redeploy.

## 📧 Contact

**James William Hanzell**
- Email: james.hanzell@mail.utoronto.ca
- LinkedIn: [james-william-hanzell](https://www.linkedin.com/in/james-william-hanzell/)
- GitHub: [@Eternal128](https://github.com/Eternal128)

**Website**
https://jameswilliamhanzell.vercel.app/
