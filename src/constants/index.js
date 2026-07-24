import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  reactjs,
  tailwind,
  nodejs,
  mongodb,
  git,
  docker,
  threejs,
  python,
  ey,
  metrodata,
  japfa,
  lirvana,
  portfolio,
  virus,
  road,
  meal,
  chess,
  music,
  machine,
  roomie,
  quietspace,
  editor,
  // ── new tech icons ──
  java,
  cplusplus,
  rust,
  tensorflow,
  langchain,
  flutter,
  firebase,
  vercel,
  azure,
  postman,
  selenium,
  pytorch,
  nextjs,
  php,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Experience",
  },
  {
    id: "tech",
    title: "Technical Skills",
  },
  {
    id: "projects",
    title: "Projects",
  },
  {
    id: "blog",
    title: "Blog",
  },
  {
    id: "testimonials",
    title: "Testimonials",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Web Developer",
    icon: web,
    description: "I love building aesthetically-pleasing websites!",
    skills: ["React", "Tailwind CSS", "Three.js"]
  },
  {
    title: "AI Developer",
    icon: mobile,
    description: "Interned in AI and Data Ernst and Young.",
    skills: ["Python", "TensorFlow", "Azure AI", "OpenAI"]
  },
  {
    title: "Frontend Developer",
    icon: backend,
    description: "I love creating stunning user interfaces!",
    skills: ["React", "TypeScript", "Framer Motion", "CSS"]
  },
  {
    title: "Content Creator",
    icon: creator,
    description: "I love editing animes in my free-time and I have a tiktok with 1M+ monthly views!",
    skills: ["Video Editing", "Design", "Storytelling", "Social Media"]
  },
];

const technologies = [
  // ── Core stack ──
  { name: "Python",       icon: python,     level: "Advanced",     description: "Primary language for AI/ML development, automation, and data processing" },
  { name: "JavaScript",   icon: javascript, level: "Advanced",     description: "Full-stack development with React, Node.js, and modern frameworks" },
  { name: "React",        icon: reactjs,    level: "Expert",       description: "Building dynamic UIs with hooks, context, and state management" },
  { name: "TypeScript",   icon: typescript, level: "Expert",     description: "Type-safe development for scalable applications" },
  { name: "Three.js",     icon: threejs,    level: "Intermediate", invert: true, description: "Immersive 3D web experiences, WebGL scenes, and react-three-fiber" },
  { name: "Tailwind CSS", icon: tailwind,   level: "Advanced",     description: "Utility-first styling for rapid, responsive UI development" },
  { name: "Node.js",      icon: nodejs,     level: "Intermediate", description: "Backend development with Express and REST APIs" },
  { name: "MongoDB",      icon: mongodb,    level: "Intermediate", description: "NoSQL database for flexible data storage solutions" },
  { name: "Git",          icon: git,        level: "Advanced",     description: "Version control for collaborative development" },
  { name: "Docker",       icon: docker,     level: "Advanced",     description: "Containerization for consistent deployment environments" },

  // ── From resume ──
  { name: "Java",       icon: java,       level: "Intermediate", description: "OOP fundamentals and arcade game suite (chess, wordle, block blast)" },
  { name: "C / C++",    icon: cplusplus,  level: "Intermediate", description: "Systems programming and low-level coursework at UofT" },
  { name: "Rust",       icon: rust,       level: "Intermediate", invert: true, description: "Contributed to a Next.js + Rust monorepo at Lirvana Labs" },
  { name: "TensorFlow", icon: tensorflow, level: "Intermediate", description: "Deep learning; built a COVID-19 chest X-ray CNN classifier" },
  { name: "LangChain",  icon: langchain,  level: "Advanced",     description: "LLM pipelines with PDF vectorization and semantic retrieval" },
  { name: "Flutter",    icon: flutter,    level: "Intermediate", description: "Cross-platform mobile apps and LLM-driven natural-language UIs" },
  { name: "Firebase",   icon: firebase,   level: "Intermediate", description: "Auth, real-time data, and backend services" },
  { name: "Vercel",     icon: vercel,     level: "Advanced",     invert: true, description: "Deployment and hosting for production web apps" },
  { name: "Azure AI",   icon: azure,      level: "Intermediate", description: "Speech SDK for a speech-driven AI interviewer at EY" },
  { name: "Postman",    icon: postman,    level: "Intermediate", description: "REST API design and testing" },
  { name: "Selenium",   icon: selenium,   level: "Intermediate", description: "Automated web scraping and social sentiment pipelines at EY" },
  { name: "PyTorch",    icon: pytorch,    level: "Intermediate", description: "Deep learning; built a torch-based music recommendation model" },
  { name: "Next.js",    icon: nextjs,     level: "Intermediate", invert: true, description: "Production monorepo work at Lirvana Labs (Next.js + Rust)" },
  { name: "PHP",        icon: php,        level: "Intermediate", description: "Backend development with Laravel for Edukasih, a book donation app" },
];

const experiences = [
  {
    title: "Software Engineer Intern",
    company_name: "Lirvana Labs",
    icon: lirvana,
    iconBg: "#1a1a1a",
    date: "June 2026 - Present",
    points: [
      "Shipped AI-generated student learning activities across **14 production files** in a **Next.js, TypeScript, React, and Rust** monorepo, improving student-facing quiz, concept-lesson, and Timeline flows.",
      "Scaled global readiness to **5 locales** by replacing hard-coded English UI with translation-backed labels across guided notes, progress navigation, and quiz-start flows.",
      "Eliminated injection risk by escaping **100%** of AI-generated quiz answers before LaTeX and dangerouslySetInnerHTML, hardening student-facing content without losing rich formatting.",
    ],
  },
  {
    title: "AI Development Intern",
    company_name: "Ernst & Young (EY)",
    icon: ey,
    iconBg: "#2c4f76",
    date: "June 2025 - August 2025",
    points: [
      "Reduced proposal generation time by **≈85% (4 hrs → 5 min)** by building a **Python ETL pipeline** that processed **25,000+ WHO records** into an LLM-powered document workflow used in a client-facing pilot.",
      "Designed a low-latency AI interview system at **<3s response time** by streaming speech-to-text and LLM inference in parallel, eliminating sequential bottlenecks.",
      "Built a modular document-generation pipeline with pluggable **LLM revision stages**, enabling scalable content generation across multiple proposal formats.",
    ],
  },
  {
    title: "Software Engineer Intern",
    company_name: "Mitra Integrasi Informatika (Metrodata Group)",
    icon: metrodata,
    iconBg: "#ecebe4",
    date: "July 2024 - August 2024",
    points: [
      "Built an **LLM processing system** with a **Flutter** frontend for dynamic natural-language tasks, integrating backend inference pipelines with API-based responses.",
    ],
  },
  {
    title: "Software Engineer Intern",
    company_name: "PT. Japfa Comfeed Indonesia",
    icon: japfa,
    iconBg: "#2c4f76",
    date: "June 2023 - July 2023",
    points: [
      "Built a document-processing system with **OpenAI API** and **LangChain** supporting multi-file PDF vectorization and semantic retrieval, letting employees query internal docs with **cited page references**.",
    ],
  },
];

const testimonials = [
  {
    testimonial:
      "He's the perfect mix of brains, humor, and calm in the chaos.",
    name: "Daniel Kim",
    designation: "Actuarial Science Student",
    company: "University of Toronto",
    image: "https://media.licdn.com/dms/image/v2/D4E03AQHN1JZBb1gCKA/profile-displayphoto-scale_400_400/B4EZjIa9CiGoAo-/0/1755709166793?e=1762992000&v=beta&t=8mPrId0UqY9uz_T0x43JTGVXQQMrEHtkj9t_A3LFGZ8",
  },
  {
    testimonial:
      "I went to high school with James. He's the kind of person who made group projects actually fun and successful.",
    name: "Yung Jui Lai",
    designation: "Engineering Student",
    company: "University of Manchester",
    image: "https://media.licdn.com/dms/image/v2/D4E03AQGmiFjpMYO4Xg/profile-displayphoto-scale_400_400/B4EZmZu1RGKYAg-/0/1759220816396?e=1762992000&v=beta&t=VWLedTVIDHdBPbHhExhkxJBT4BXXd4VRCyE4x0uVaso",
  },
  {
    testimonial:
      "I've worked with James on several CS projects and he's easily one of the most driven and talented people I know. ",
    name: "Abdullah Alhidary",
    designation: "CS Student",
    company: "University of Toronto",
    image: "https://pbs.twimg.com/media/GyHdy2fXIAEpDQW.png",
  },
];

const projects = [
  // ── Editing Portfolio — featured first, has both GitHub + live demo ──
  {
    name: "Editing Portfolio",
    description:
      "My Personal Editing Portfolio",
    problem:
      "Editing started as something to keep me busy at night when I could not sleep, and I wanted a home for that work that felt as considered as the edits themselves.",
    approach:
      "I start from the feeling and the music, not the frame. Before touching a single clip I ask what vibe I want the character to give off, then work backwards, so the site itself is built the same way, timing and pacing first.",
    outcome:
      "Timing the clips, masking, and typography all took a ton of work, and a couple of the pieces featured here ended up blowing up in ways I did not expect, picking up a few million views along the way.",
    tags: [
      { name: "react",      color: "ocean-text-gradient"  },
      { name: "javascript", color: "blue-text-gradient"   },
      { name: "tailwind", color: "neon-text-gradient" },
      { name: "three js",   color: "cyan-purple-gradient"   },
    ],
    image: editor,
    source_code_link: "https://github.com/Eternal128/editor-portfolio.git",
    live_demo_link: "https://editor-portfolio-james.vercel.app/",
  },
  // ── ROOMIE — featured first, has both GitHub + live demo ──
  {
    name: "Roomie",
    description:
      "A modern website to imagine 2D floor plans to your preference.",
    tags: [
      { name: "react",      color: "ocean-text-gradient"  },
      { name: "javascript", color: "blue-text-gradient"   },
      { name: "tailwind",   color: "neon-text-gradient"   },
    ],
    image: roomie,
    source_code_link: "https://github.com/Eternal128/roomie.git",
    live_demo_link: "https://puter.com/app/roomie",
  },
  // ── QUIETSPACE ──
  {
    name: "QuietSpace",
    description:
      "A minimal, distraction-free focus app built to help mental health.",
    tags: [
      { name: "react",      color: "ocean-text-gradient"  },
      { name: "javascript", color: "blue-text-gradient"   },
      { name: "tailwind",   color: "neon-text-gradient"   },
    ],
    image: quietspace,
    source_code_link: "https://github.com/Eternal128/quietspace",
    live_demo_link: "https://quietspace-zeta.vercel.app/",
  },
  {
    name: "Personal Portfolio",
    description:
      "A Modern 3D portfolio website built with React and Framer Motion.",
    tags: [
      {
        name: "react",
        color: "ocean-text-gradient",
      },
      {
        name: "threejs",
        color: "sunset-text-gradient",
      },
      {
        name: "tailwind",
        color: "neon-text-gradient",
      },
      {
        name: "javascript",
        color: "cyan-purple-text-gradient",
      },
    ],
    image: portfolio,
    source_code_link: "https://github.com/Eternal128/Personal-Portfolio.git",
    live_demo_link: "https://jameswilliamhanzell.vercel.app/",
  },
  {
    name: "COVID-19 X-Ray Classification",
    description:
      "Deep learning analysis comparing CNN architectures (Xception vs ResNet-50) for COVID-19 detection from chest X-rays",
    tags: [
      {
        name: "python",
        color: "blue-text-gradient",
      },
      {
        name: "tensorflow",
        color: "green-text-gradient",
      },
      {
        name: "deep-learning",
        color: "pink-text-gradient",
      },
    ],
    image: virus,
    source_code_link: "https://github.com/Eternal128/COVID-19-Chest-X-Ray-Classification-using-XCeption-Model-VS-ResNet-50.git",
  },
  {
    name: "Jakarta Route Optimization",
    description:
      "Graph theory project modeling Jakarta's road network as a 46-node weighted graph comparing Dijkstra VS Kruskal's Algorithm.",
    problem:
      "During COVID a lot of delivery services were losing money on bad routes, too much back and forth, too much fuel. I wanted to know what the actual shortest path for a delivery driver around the city looks like, and which algorithm proves it best.",
    approach:
      "I plotted 46 nodes for real intersections, edges for the roads, and measured every weight by hand from Google Maps distances. Then I compared Dijkstra, which finds the shortest path from one node to every other node, against Kruskal, which builds the cheapest spanning tree that keeps the whole city connected.",
    outcome:
      "There is no single best algorithm, it really depends on the question. Dijkstra wins for a single delivery between two points, Kruskal wins if you want to connect every drop off point with the least total road. What started as a joke about Jakarta traffic ended up teaching me graph theory, greedy proofs, and union find from first principles.",
    tags: [
      {
        name: "python",
        color: "blue-text-gradient",
      },
      {
        name: "algorithms",
        color: "purple-blue-text-gradient",
      },
      {
        name: "graph-theory",
        color: "gold-text-gradient",
      },
    ],
    image: road,
    source_code_link: "https://github.com/Eternal128/Dijkstra-VS-Kruskal-for-Jakarta-Route-Optimization",
  },
  {
    name: "Meal App",
    description:
      "An app with cooking recipes and filterable menus to show filters e.g. gluten-free, vegetarian, vegan",
    tags: [
      {
        name: "dart",
        color: "blue-text-gradient",
      },
      {
        name: "flutter",
        color: "green-text-gradient",
      },
    ],
    image: meal,
    source_code_link: "https://github.com/Eternal128/meal-app.git",
  },
  {
    name: "Spotify Music Recommender",
    description:
      "A simple app to suggest music to users",
    tags: [
      {
        name: "python",
        color: "blue-text-gradient",
      },
      {
        name: "torch",
        color: "sunset-text-gradient",
      },
    ],
    image: music,
    source_code_link: "https://github.com/Eternal128/CSC111-Project-2.git",
  },
  {
    name: "Arcade Game using Java",
    description:
      "Chess puzzle, wordle, and block blast game using Java",
    tags: [
      {
        name: "Java",
        color: "neon-text-gradient",
      },
      {
        name: "Rapid API",
        color: "purple-blue-text-gradient",
      },
    ],
    image: chess,
    source_code_link: "https://github.com/akashngb/gamegrid.git",
  },
  {
    name: "Machine Learning Projects",
    description:
      "Several machine learning projects I've been working on to hone my skills in ML.",
    tags: [
      {
        name: "python",
        color: "blue-text-gradient",
      },
      {
        name: "matplotlib",
        color: "cyan-purple-text-gradient",
      },
    ],
    image: machine,
    source_code_link: "https://github.com/Eternal128/machine-learning-projects.git",
  },
];

export { services, technologies, experiences, testimonials, projects };