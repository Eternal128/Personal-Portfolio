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
  ey,
  metrodata,
  japfa,
  covid,
  graph,
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
    name: "HTML 5",
    icon: html,
    
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
      "Worked on-site as part of the AI and Data division.",
    ],
  },
];


const testimonials = [
  {
    testimonial:
      "Goat is James",
    name: "Sara Lee",
    designation: "CFO",
    company: "Acme Co",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    testimonial:
      "James is the GOAT",
    name: "Chris Brown",
    designation: "COO",
    company: "DEF Corp",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    testimonial:
      "James is so tuff",
    name: "Lisa Wang",
    designation: "CTO",
    company: "456 Enterprises",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    testimonial:
      "I’ve had the pleasure of working alongside James in several CS projects, and I can honestly say he’s one of the most driven and technically talented  people I know. ",
    name: "Abdullah Alhidary",
    designation: "CS Student",
    company: "University of Toronto",
    image: "https://pbs.twimg.com/media/GyHdy2fXIAEpDQW.png",
  },
];

const projects = [
  {
    name: "COVID-19 Classification",
    description:
      "Performed analysis on CNN models (XCeption vs ResNet-50) for better X-ray COVID-19 classification. Implemented transfer learning with ImageNet weights on a COVID X-ray dataset, achieving 94.50% validation accuracy with Xception, which outperformed the ResNet-50 model (85.11% accuracy).",
    tags: [
      {
        name: "python",
        color: "blue-text-gradient",
      },
      {
        name: "tensorflow/keras",
        color: "green-text-gradient",
      },
      {
        name: "ML",
        color: "pink-text-gradient",
      },
    ],
    image: covid,
    source_code_link: "https://github.com/",
  },
  {
    name: "Jakarta Route Optimization",
    description:
      "Modeled Jakarta's road network as a 46-node weighted graph and implemented Dijkstra's shortest-path and Kruskal's MST to compare individual route minimization vs. total network cost.",
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
        name: "graphs",
        color: "pink-text-gradient",
      },
    ],
    image: graph,
    source_code_link: "https://github.com/Eternal128/Dijkstra-VS-Kruskal-for-Jakarta-Route-Optimization.git",
  },
  {
    name: "Jakarta Route",
    description:
      "Web application that enables users to search for job openings, view estimated salary ranges for positions, and locate available jobs based on their current location.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "restapi",
        color: "green-text-gradient",
      },
      {
        name: "scss",
        color: "pink-text-gradient",
      },
    ],
    image: graph,
    source_code_link: "https://github.com/",
  },
  {
    name: "Trip Guide",
    description:
      "A comprehensive travel booking platform that allows users to book flights, hotels, and rental cars, and offers curated recommendations for popular destinations.",
    tags: [
      {
        name: "nextjs",
        color: "blue-text-gradient",
      },
      {
        name: "supabase",
        color: "green-text-gradient",
      },
      {
        name: "css",
        color: "pink-text-gradient",
      },
    ],
    image: covid,
    source_code_link: "https://github.com/",
  },
];

export { services, technologies, experiences, testimonials, projects };
