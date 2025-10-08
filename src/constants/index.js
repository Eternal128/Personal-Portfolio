import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  threejs,
  python,
  ey,
  metrodata,
  japfa,
  covid,
  graph,
  portfolio,
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
  },
  {
    title: "AI Developer",
    icon: mobile,
  },
  {
    title: "Frontend Developer",
    icon: backend,
  },
  {
    title: "Content Creator",
    icon: creator,
  },
];

const technologies = [
  {
    name: "Python",
    icon: python,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "figma",
    icon: figma,
  },
  {
    name: "docker",
    icon: docker,
  },
];

const experiences = [
  {
    title: "Software Engineer Intern",
    company_name: "PT. Japfa Comfeed Indonesia",
    icon: japfa,
    iconBg: "#2c4f76",
    date: "June 2023 - July 2023",
    points: [
      "Developed a company document-processing system powered by OpenAI API and LangChain.",
      "Implemented support for multi-file PDF reading, vectorization, and semantic retrieval.",
      "Enabled employees to upload internal documents and query information with cited page references.",
      "Collaborated remotely with the company’s IT and AI integration teams.",
    ],
  },
  {
    title: "Software Engineer Intern",
    company_name: "Mitra Integrasi Informatika (Metrodata Group)",
    icon: metrodata,
    iconBg: "#ecebe4",
    date: "July 2024 - August 2024",
    points: [
      "Developed an LLM processing system with Flutter as the frontend for dynamic natural language tasks.",
      "Integrated backend LLM inference pipelines with API-based responses.",
      "Collaborated remotely with the software engineering team to implement interactive and modular UI features.",
      "Worked on projects focused on integrating Artificial Intelligence and Flutter-based app interfaces.",
    ],
  },
  {
    title: "AI Development Intern",
    company_name: "Ernst & Young (EY)",
    icon: ey,
    iconBg: "#2c4f76",
    date: "June 2025 - September 2025",
    points: [
      "Developed automated pipelines for social media sentiment analysis using Selenium and Playwright.",
      "Built a Microsoft Word proposal generator that integrates Excel client data with WHO-sourced immunization data, scraping over 25,000 data points using BeautifulSoup.",
      "Enabled contextual proposal revisions via an interactive chatbot system.",
      "Engineered a speech-driven interviewer using Azure AI Speech SDK with incomplete-sentence detection, showcasing integration of speech recognition and natural language understanding.",
      "Created REST APIs and tested with Postman and built the project in Docker",
      "Created 10+ end-to-end features for 5+ companies from scratch"
    ],
  },
];


const testimonials = [
  {
    testimonial:
      "He’s the perfect mix of brains, humor, and calm in the chaos.",
    name: "Daniel Kim",
    designation: "Actuarial Science Student",
    company: "University of Toronto",
    image: "https://media.licdn.com/dms/image/v2/D4E03AQHN1JZBb1gCKA/profile-displayphoto-scale_400_400/B4EZjIa9CiGoAo-/0/1755709166793?e=1762992000&v=beta&t=8mPrId0UqY9uz_T0x43JTGVXQQMrEHtkj9t_A3LFGZ8",
  },
  {
    testimonial:
      "I went to high school with James. He’s the kind of person who made group projects actually fun and successful.",
    name: "Yung Jui Lai",
    designation: "Engineering Student",
    company: "University of Manchester",
    image: "https://media.licdn.com/dms/image/v2/D4E03AQGmiFjpMYO4Xg/profile-displayphoto-scale_400_400/B4EZmZu1RGKYAg-/0/1759220816396?e=1762992000&v=beta&t=VWLedTVIDHdBPbHhExhkxJBT4BXXd4VRCyE4x0uVaso",
  },
  {
    testimonial:
      "I’ve worked with James on several CS projects and he’s easily one of the most driven and talented people I know. ",
    name: "Abdullah Alhidary",
    designation: "CS Student",
    company: "University of Toronto",
    image: "https://pbs.twimg.com/media/GyHdy2fXIAEpDQW.png",
  },
];

const projects = [
  {
    name: "COVID-19 X-Ray Classification",
    description:
      "Deep learning analysis comparing CNN architectures (Xception vs ResNet-50) for COVID-19 detection from chest X-rays. Implemented transfer learning with ImageNet weights, achieving 94.50% validation accuracy with Xception, significantly outperforming ResNet-50 (85.11% accuracy).",
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
    image: covid,
    source_code_link: "https://github.com/Eternal128/COVID-19-Classification",
  },
  {
    name: "Jakarta Route Optimization",
    description:
      "Graph theory project modeling Jakarta's road network as a 46-node weighted graph. Implemented and compared Dijkstra's shortest-path algorithm with Kruskal's Minimum Spanning Tree to analyze individual route optimization versus total network cost minimization.",
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
    image: graph,
    source_code_link: "https://github.com/Eternal128/Dijkstra-VS-Kruskal-for-Jakarta-Route-Optimization",
  },
  {
    name: "Personal Portfolio",
    description:
      "Modern 3D portfolio website built with React Three Fiber and Framer Motion. Features interactive 3D models, smooth animations, and a responsive design showcasing projects, experience, and technical skills with an immersive user experience.",
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
    image: portfolio, // Replace with actual portfolio screenshot
    source_code_link: "https://github.com/Eternal128/Personal-Portfolio.git",
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
    image: covid, // Replace with actual project screenshot
    source_code_link: "https://github.com/",
  },
];

export { services, technologies, experiences, testimonials, projects };
