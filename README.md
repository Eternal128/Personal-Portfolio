# James William Hanzell — Personal Portfolio

A minimal, motion-driven portfolio and blog built with React. It opens with a custom loader, scrolls on Lenis smooth scrolling with GSAP-driven reveals, and includes a built-in blog with interactive posts.

**Live site:** https://jameswilliamhanzell.vercel.app/

<img width="1700" height="870" alt="Screenshot 2026-07-23 at 22 26 20" src="https://github.com/user-attachments/assets/4a54e4b1-d274-43f4-987b-59d7ff335c44" />

## ✨ Features

- **Custom loader**: an animated box outline with a progress counter, which fills and morphs into the page as it opens
- **Smooth scrolling**: Lenis with GSAP ScrollTrigger reveals and a scroll-linked flight path across the page
- **Light and dark mode**: theme toggle backed by CSS variables
- **Sound design**: optional ambient audio and UI sound effects, with a mute toggle
- **Custom cursor**: context-aware cursor with hover labels
- **Experience and projects**: expandable role details, tilt project cards, and project modals (problem, approach, outcome)
- **Blog**: lazy-loaded, hash-routed posts (`#blog/<post-id>`) with interactive pieces such as a Jakarta shortest-path graph, a neural network playground, an easing playground and a Messi shot map/heatmap
- **Contact form**: sends email through EmailJS
- **Performance and accessibility**: code-split bundles, gzip/brotli compression, optimized images, SEO meta tags, keyboard support and a skip-to-content link

## 📸 Screenshots

<img width="1699" height="874" alt="Screenshot 2026-07-23 at 22 26 34" src="https://github.com/user-attachments/assets/8745d700-a3b3-4bcc-8b2e-e3623037f1f5" />
<img width="1701" height="865" alt="Screenshot 2026-07-23 at 22 26 55" src="https://github.com/user-attachments/assets/c4503f13-bd46-4f25-884d-8d5ba691f73f" />
<img width="1670" height="855" alt="Screenshot 2026-07-23 at 22 27 16" src="https://github.com/user-attachments/assets/d8ec2e98-9d27-4473-a279-5247665c9b86" />
<img width="1680" height="864" alt="Screenshot 2026-07-23 at 22 27 30" src="https://github.com/user-attachments/assets/7c498ef1-2c29-4577-bf86-e706674d3dc4" />
<img width="1682" height="857" alt="Screenshot 2026-07-23 at 22 27 52" src="https://github.com/user-attachments/assets/8734aee8-7196-4621-8fa5-d6e984e62974" />
<img width="1669" height="839" alt="Screenshot 2026-07-23 at 22 28 06" src="https://github.com/user-attachments/assets/8eb5b1c4-3936-4ffb-8aa9-a6fb14159979" />
<img width="1696" height="870" alt="Screenshot 2026-07-23 at 22 28 23" src="https://github.com/user-attachments/assets/8402d2a1-2c92-4bfa-b513-154ae6eec0c7" />
<img width="1686" height="865" alt="Screenshot 2026-07-23 at 22 28 40" src="https://github.com/user-attachments/assets/cd226225-7838-4443-ba1d-a4fef9292ce7" />
<img width="1677" height="859" alt="Screenshot 2026-07-23 at 22 29 01" src="https://github.com/user-attachments/assets/88070d7f-8a2f-4d87-9045-6e0bc0674752" />

## 🛠️ Tech Stack

- **React 18 + Vite**: UI and build tooling
- **GSAP + ScrollTrigger**: scroll-driven animation
- **Lenis**: smooth scrolling
- **Framer Motion**: loader, cursor and blog transitions
- **Three.js / React Three Fiber**: starfield background
- **Tailwind CSS**: styling
- **EmailJS**: contact form delivery
- **react-parallax-tilt**: tilt effect on project cards

## 📦 Getting Started

```bash
git clone https://github.com/Eternal128/Personal-Portfolio.git
cd Personal-Portfolio
npm install --legacy-peer-deps
```

Create a `.env` file in the project root for the contact form:

```env
VITE_APP_EMAILJS_SERVICE_ID=your_service_id
VITE_APP_EMAILJS_TEMPLATE_ID=your_template_id
VITE_APP_EMAILJS_PUBLIC_KEY=your_public_key
```

Then run:

| Command           | Description                       |
| ----------------- | --------------------------------- |
| `npm run dev`     | Start the dev server              |
| `npm run build`   | Production build into `dist/`     |
| `npm run preview` | Preview the production build      |
| `npm run lint`    | Lint the project with ESLint      |

## 📁 Project Structure

```
src/
├── assets/              # Images, icons, loader and blog images
├── components/
│   ├── blog/            # Interactive blog widgets
│   ├── canvas/          # Three.js starfield
│   ├── Loader.jsx
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── About.jsx
│   ├── Experience.jsx
│   ├── Tech.jsx
│   ├── Works.jsx
│   ├── Feedbacks.jsx
│   ├── BlogSection.jsx
│   ├── Blog.jsx
│   ├── End.jsx          # Contact form and footer
│   ├── FlightPath.jsx
│   ├── CustomCursor.jsx
│   └── SoundToggle.jsx
├── constants/           # Site content and blog posts
├── context/             # Theme, sound and Lenis providers
├── hooks/
├── utils/
├── App.jsx
└── main.jsx
scripts/
└── optimize-loader-images.mjs
```

Site content (experience, projects, tech, testimonials) lives in `src/constants/index.js`, and blog posts in `src/constants/posts.js`.

## 🚀 Deployment

Deployed on Vercel. Add the EmailJS variables above to the project's environment variables.

## 📄 License

Licensed under the GNU GPL v3. See [LICENSE](LICENSE).

## 📧 Contact

**James William Hanzell**
- Email: james.hanzell@mail.utoronto.ca
- LinkedIn: [james-william-hanzell](https://www.linkedin.com/in/james-william-hanzell/)
- GitHub: [@Eternal128](https://github.com/Eternal128)
