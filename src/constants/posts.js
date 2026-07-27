import { blogGraphAlgorithms, blogBuildingThings, blogMessi, lirvana, ey } from '../assets';
import blogUoft from '../assets/blog/uoft.jpg';

const VID = {
  fourRaws:    'https://res.cloudinary.com/daetzwh6x/video/upload/v1774021264/4_Raws_-_Toji_Fushiguro_oyvmqf.mp4',
  strongest:   'https://res.cloudinary.com/daetzwh6x/video/upload/v1773972756/the_strongest_ebutvq.mp4',
  tojiMograph: 'https://res.cloudinary.com/daetzwh6x/video/upload/v1773972350/toji_mograph_hbqmsu.mov',
  savage:      'https://res.cloudinary.com/daetzwh6x/video/upload/v1773972392/toji_ofjtmn.mov',
  creed:       'https://res.cloudinary.com/daetzwh6x/video/upload/v1773972454/toji_creed_x2zutr.mov',
};

export const POSTS = [
  {
    id: 'graph-algorithms',
    kicker: 'Algorithms',
    title: 'Finding the Shortest Path Through Jakarta.',
    date: '2024',
    readingTime: '10 min',
    excerpt:
      'I turned Jakarta into a 46 node weighted graph and tested Dijkstra against Kruskal to figure out the best delivery routes. This is what I learned about greedy algorithms and why the right one really just depends on the question.',
    thumbnail: blogGraphAlgorithms,
    hero: { type: 'interactive', widget: 'jakarta' },
    blocks: [
      { type: 'paragraph', text: 'This whole thing started because of a pretty practical problem. During COVID a lot of delivery services were losing money on bad routes, too much back and forth, too much fuel. I commute really far across Jakarta every day and I was always kind of amazed at how Google Maps just finds the fastest way home every time. So I wanted to figure it out myself. What is the actual shortest path for a delivery driver to get around the city, and can I prove which algorithm does it best?' },
      { type: 'paragraph', text: 'The first step was turning Jakarta into a graph. I plotted 46 nodes for intersections, edges for the roads, and I got the weights by Google Mapping the real distance between each node one by one, which took forever. But once you set it up like that, the question stops being a vibe and becomes a real shortest path problem. Getting to that point, taking a messy real thing and turning it into a graph, is basically half the work. The graph above is the actual network I built, so try running both algorithms on it.' },
      { type: 'heading', text: 'Two greedy algorithms, two different questions' },
      { type: 'paragraph', text: 'I ended up comparing Dijkstra and Kruskal, and the thing that stuck with me most is that they actually answer completely different questions even on the same graph. Dijkstra finds the shortest path from one starting node to every other node. Kruskal builds a minimum spanning tree, which is basically the cheapest set of roads that still keeps the whole city connected. Both are greedy, meaning they just take the best option available at each step, but they are optimizing for different things.' },
      { type: 'paragraph', text: 'Dijkstra works by keeping a tentative distance to every node and constantly relaxing edges. If going through the current node gives you a shorter path to a neighbor, you update it. The catch is that all the weights have to be non negative. I actually proved this to myself by contradiction, and then I did a counterexample to make sure I really got it.' },
      { type: 'heading', text: 'Why Dijkstra breaks with negative weights' },
      { type: 'paragraph', text: 'Dijkstra assumes that once you visit a node, that is the final shortest path to it and you never have to check it again. That works fine when the weights are non negative, because any detour can only ever make a path longer. But the second you add a negative edge, that assumption falls apart. A later path could loop back and actually lower the cost of a node you already locked in. Say A to B to D costs 1 minus 100, so negative 99, but Dijkstra already committed to A to D being 10 and refuses to look back. It just confidently spits out 3 for A to C to D and misses the real answer.' },
      { type: 'paragraph', text: 'That was the moment it clicked for me why Dijkstra is greedy and cannot go back on itself, and why other algorithms like Bellman Ford exist for graphs that do have negative edges. Figuring that out myself instead of just reading it is when graph theory stopped feeling like something I had to memorize.' },
      { type: 'heading', text: 'Running it on all 46 nodes' },
      { type: 'paragraph', text: 'Doing 16 nodes by hand in a table was good for understanding it, but doing all 46 nodes to get every possible shortest path was way too much to do manually. So I wrote it in Python with NetworkX. I build the graph from all the distances I measured, then run Dijkstra from every single node to fill in the full table.' },
      {
        type: 'code',
        lang: 'Python',
        filename: 'dijkstra.py',
        code:
`import pandas as pd
import networkx as nx

# Each tuple is (node_a, node_b, distance_km) measured from Google Maps
edge_data = [
    ('A', 'C', 7.8), ('A', 'B', 7.3), ('B', 'AT', 5.3),
    ('U', 'AA', 1.4), ('AC', 'AB', 1.5), ('W', 'V', 2.4),
    ('AE', 'AF', 0.7), ('AE', 'AD', 3.6), ('AD', 'AC', 3.3),
    # ... all 46 nodes of the Jakarta network
]

G = nx.Graph()
G.add_weighted_edges_from(edge_data)

# Run Dijkstra from every node to get all the shortest paths
all_nodes = sorted(set(sum(([e[0], e[1]] for e in edge_data), [])))
table = pd.DataFrame(index=all_nodes, columns=all_nodes)

for node in all_nodes:
    lengths = nx.single_source_dijkstra_path_length(G, node)
    for target in all_nodes:
        d = lengths.get(target, float('inf'))
        table.loc[node, target] = d if d != float('inf') else 'infinity'

table.to_csv('dijkstra_results.csv')
print("Dijkstra table saved.")`,
      },
      { type: 'paragraph', text: 'The output is a full grid, so I can pick any two intersections and just read the shortest distance right off it. The farthest two nodes turned out to be Kemanggisan and Kebon Pala at 25.8 km, which is actually useful to know. If you are a driver you probably do not want to build one delivery run across those two.' },
      { type: 'heading', text: 'And Kruskal for the whole network' },
      { type: 'paragraph', text: 'For the minimum spanning tree I used the same data but let Kruskal handle it. It sorts every edge by weight, then keeps adding the smallest edge that does not make a cycle, using union find to keep track of what is already connected. I proved this one with induction instead, since it builds up step by step, and every step keeps the tree valid so it cannot really go wrong.' },
      {
        type: 'code',
        lang: 'Python',
        filename: 'kruskal.py',
        code:
`import pandas as pd
import networkx as nx

G = nx.Graph()
G.add_weighted_edges_from(edge_data)  # same Jakarta network

# Kruskal gives the cheapest set of roads that connects every node
mst = nx.minimum_spanning_tree(G, algorithm='kruskal')

mst_data = [(u, v, d['weight']) for u, v, d in mst.edges(data=True)]
mst_df = pd.DataFrame(mst_data, columns=['Node1', 'Node2', 'Weight'])
mst_df.to_csv('kruskal_mst.csv', index=False)
print("Kruskal MST saved.")`,
      },
      { type: 'heading', text: 'The part that surprised me' },
      { type: 'paragraph', text: 'This is the part I liked the most. In some of my sample calculations both algorithms gave the same distance, but I realized you cannot just assume they always will. Take nodes A and C. Directly they are 7.8 km apart, and Dijkstra finds that right away. But the MST cuts that direct road to keep the total weight low, so to get from A to C on the tree you have to cycle all the way through the network, which comes out to 74.8 km. Same graph, completely different answer.' },
      { type: 'paragraph', text: 'So my actual takeaway was that there is no single best algorithm, it really just depends on what you are asking. Dijkstra wins if you just want the shortest route between two points, like a single delivery. Kruskal wins if you want to connect every drop off point with the least total road, which is a different need. A real delivery service would probably want both working together. That whole it depends on the question idea is honestly the most useful thing I got out of this.' },
      { type: 'paragraph', text: 'It started as kind of a joke about how bad Jakarta traffic is, and it turned into the project that taught me graphs, greedy proofs, union find, and mostly how to model a messy real problem cleanly enough that an algorithm can even solve it.' },
    ],
  },

  {
    id: 'building-things',
    kicker: 'Machine Learning',
    title: 'Teaching Machines to Make Learn.',
    date: '2026',
    readingTime: '8 min',
    excerpt:
      'How I went from thinking ML was scary math to building tiny generative models myself, and why watching a machine make stuff up is what finally made it click.',
    thumbnail: blogBuildingThings,
    hero: { type: 'interactive', widget: 'latentart' },
    blocks: [
      { type: 'paragraph', text: 'Machine learning used to scare me a lot. It felt like this wall of math that only PhD people were allowed to touch. What actually got me past that was not a class, it was building small dumb versions of these models myself until they stopped feeling like magic. That image at the top of the page? My site made it live, no photos involved, just a tiny neural net turning random numbers into color.' },
      { type: 'heading', text: 'What made it click was that it just predicts' },
      { type: 'paragraph', text: 'The moment ML stopped being scary for me was when I realized these models do not actually understand anything. They just predict. A language model is not thinking, it is guessing the next character over and over, very confidently. So I built exactly that, a tiny text generator, just to prove it to myself. You give it a seed and a temperature and watch it babble. It comes out almost coherent, and that almost is basically the whole trick.' },
      { type: 'interactive', widget: 'textgen' },
      { type: 'paragraph', text: 'Temperature was the idea that really unlocked it for me. Turn it low and the model plays it safe and just repeats the most likely thing. Turn it high and it gets reckless and weird. That one slider is pretty much the difference between boring autocomplete and something that feels creative, and I only really understood it once I could drag it around and watch it happen.' },
      { type: 'heading', text: 'The math stopped being scary once I could see it' },
      { type: 'paragraph', text: 'A lot of my fear of ML was really just fear of the notation. A function is way less scary when you can actually watch it bend. So I built a little grapher too, where you type an equation and it draws itself, kind of like a tiny GeoGebra. Messing around with curves like this is where a lot of the oh that is all it is moments came from.' },
      { type: 'interactive', widget: 'grapher' },
      { type: 'paragraph', text: 'Every activation function, every loss curve, every gradient, they are all just shapes like these. Once I could see them instead of only reading symbols, the whole thing got a lot less intimidating.' },
      { type: 'heading', text: 'From predicting text to generating images' },
      { type: 'paragraph', text: 'Once the text model made sense, the image one was not as big a jump as I expected. Same idea. Instead of sampling the next character you sample a point in a latent space and decode it into pixels. Every time you hit new latent below, you are asking the model to imagine a new image from a random seed. I built this one to demystify generative art for myself and it worked. It went from feeling like sorcery to feeling like a decoder just doing its job.' },
      { type: 'interactive', widget: 'latentart' },
      { type: 'paragraph', text: 'The thing I love about building these tiny versions is that you can see the whole thing. No giant dataset, no black box, no API you are just calling. You get to watch the sampling or the decoding actually happen, and then the huge scary models make sense because they are literally just this, scaled up a few billion times.' },
      { type: 'heading', text: 'Why I keep building random stuff nobody asked for' },
      { type: 'paragraph', text: 'None of these were assignments. I built them because I got curious and could not let the confusion sit. And that is where basically all of my real ML learning came from, not lectures, just tiny broken prototypes I kept poking at until they worked. The COVID X ray classifier, the route optimizer, these generators, they were all just me trying to turn I do not get it into oh, that is all it is.' },
      { type: 'paragraph', text: 'So that is the honest version of how I actually learned this stuff. Not gracefully, just stubbornly. Thanks for reading, and go crank the temperature slider up to 1.4 and enjoy the nonsense.' },
    ],
  },

  {
    id: 'university-of-toronto',
    kicker: 'Education',
    title: 'What Three Years at U of T Actually Taught Me',
    date: '2026',
    readingTime: '6 min',
    excerpt:
      "I came into a Computer Science degree at the University of Toronto already knowing how to code. What actually changed me was realizing that wasn't the same thing as understanding anything.",
    thumbnail: blogUoft,
    hero: { type: 'image', src: blogUoft },
    blocks: [
      { type: 'paragraph', text: "I got to U of T already comfortable writing code. High school had me building small projects, and I assumed a CS degree was just going to be a faster, more structured version of that. It took about one semester of CSC236 to figure out how wrong I was. Writing code that runs is one skill. Proving, on paper, that it terminates and does what you claim it does, is a completely different one, and nobody had ever asked me to do the second thing before." },
      { type: 'heading', text: 'The courses that actually rewired how I think' },
      { type: 'paragraph', text: "CSC240 and CSC236 back to back were the real turning point. Formal proofs, induction, correctness arguments, none of it felt like programming, and that was exactly the point. I stopped being able to get away with 'it works on my machine' as a justification for anything. I had to be able to say why, in a way that held up. That habit is the single most useful thing I've carried into every internship since, because production code doesn't care that something looks right, it cares that it is right." },
      { type: 'paragraph', text: "CSC258 (computer organization) and CSC369 (operating systems) did something similar from a different direction. Once you've built a tiny CPU out of logic gates and watched a scheduler actually context-switch, every abstraction above that stops feeling like magic. I stopped treating frameworks as black boxes and started asking what they were probably doing underneath, which is a habit that's paid off constantly, from debugging a Rust monorepo at Lirvana Labs to reasoning about latency in an ETL pipeline at EY." },
      { type: 'heading', text: 'Group projects taught me the part courses don’t grade' },
      { type: 'paragraph', text: "Most of the CS curriculum grades individual understanding, which makes sense, but it also means nobody formally teaches you how to work inside someone else's codebase, review a teammate's pull request without being a jerk about it, or recover when a group member disappears two days before a deadline. I learned all of that the hard way, through a handful of genuinely rough team projects. By the time I got to my internships, merge conflicts and unclear ownership didn't rattle me anymore, because I'd already been through worse with far less at stake." },
      { type: 'heading', text: 'Doing the degree and the internships at the same time' },
      { type: 'paragraph', text: "The part nobody warns you about is how strange it feels to be proving loop invariants on a Tuesday and shipping production TypeScript at a startup on a Wednesday. But it ended up being the best possible setup, because the theory gave me a reason for the practices I was picking up at work, and the work gave me a reason to actually care about the theory. Type systems stopped being an academic exercise in CSC324 once I'd felt what it was like to ship a bug into production without one." },
      { type: 'paragraph', text: "If there's one honest takeaway, it's that the degree didn't teach me to code, I already could. It taught me to be suspicious of my own code, to demand a reason before I trust that something works, and that habit turned out to matter a lot more than any specific language or framework I picked up along the way." },
    ],
  },

  {
    id: 'lirvana-labs',
    kicker: 'Internship',
    title: 'Shipping Production Code at a Silicon Valley Startup',
    date: '2026',
    readingTime: '6 min',
    excerpt:
      "Interning as a Software Engineer at Lirvana Labs meant shipping real, AI-generated learning activities into production, in a Next.js, TypeScript, React, and Rust monorepo, from day one.",
    thumbnail: lirvana,
    blocks: [
      { type: 'paragraph', text: "Lirvana Labs is a Silicon Valley edtech startup building AI-generated learning activities for students, and my job as a Software Engineer Intern was to help ship the actual student-facing product: quiz flows, concept lessons, and a Timeline feature students use to move through material. This wasn't a sandboxed internship project sitting off to the side, it was production code, in a live monorepo, shipping to real students." },
      { type: 'heading', text: 'What the product actually looks like' },
      { type: 'paragraph', text: "Before a student ever sees a question, they move through a guided-notes concept page: a plain-language explanation of the idea, a highlighted 'Remember' callout for the one thing they shouldn't forget, and a worked example, with a progress bar tracking how many concepts are left before the quiz unlocks. Only after that does the quiz itself show up, styled closer to Kahoot than a textbook, four color- and shape-coded answer tiles (a red triangle, a blue diamond, a gold circle, a green square) with a running point total in the corner and a 'Review notes' shortcut back to the concept page if a student second-guesses themselves mid-question." },
      { type: 'paragraph', text: "None of that content is hard-coded. It's all assembled through an internal authoring tool where a concept page's title, body, reminder callout, worked examples, an image URL, and even a raw SVG diagram field are entered separately and previewed live, side by side with the exact student-facing layout, before anything publishes. That's the part that made the i18n and sanitization work below non-negotiable rather than nice-to-have: every one of those fields is free-text content written or AI-generated outside of engineering, and it all flows through the same rendering pipeline a student eventually sees." },
      { type: 'heading', text: '14 files, one monorepo, and a lot of context to hold' },
      { type: 'paragraph', text: "The stack was a Next.js, TypeScript, and React frontend sitting on top of a Rust backend, all in a single monorepo. Across the internship I touched 14 production files improving those quiz, lesson, and Timeline flows, which meant constantly holding context across a type-safe frontend and a completely different language on the backend. Rust was new to me going in, and TypeScript's type system stopped being 'the thing that yells at you' and started being the thing that let me refactor a shared component with actual confidence that I hadn't broken three other flows I couldn't see." },
      { type: 'heading', text: 'Scaling the product to 5 locales' },
      { type: 'paragraph', text: "A big chunk of my work was internationalization. The UI had a lot of hard-coded English strings baked directly into guided notes, progress navigation, and quiz-start flows, which is fine until you want the product to work for a student who doesn't read English. I went through and replaced that hard-coded text with translation-backed labels, scaling the product's global readiness to 5 locales. The unglamorous part of this work was finding every place a string had quietly been hard-coded, since half the job was just refusing to trust that I'd caught them all until I'd actually checked." },
      { type: 'heading', text: 'Escaping 100% of AI-generated content before it ever renders' },
      { type: 'paragraph', text: "This is the part of the internship I'm proudest of. The product renders AI-generated quiz answers using LaTeX for math notation and dangerouslySetInnerHTML for rich formatting, both of which are exactly what they sound like, powerful and dangerous if you feed them content you don't fully control. AI-generated text is, by definition, content you don't fully control. So before any of that content reached either renderer, I built an escaping layer that sanitizes it first." },
      {
        type: 'code',
        lang: 'JavaScript',
        filename: 'sanitizeAnswer.js',
        code:
`// AI-generated answers are untrusted input the moment they leave the model,
// even before they touch LaTeX or dangerouslySetInnerHTML.
function sanitizeAnswer(raw) {
  // 1. Escape HTML-significant characters first, so nothing can break
  //    out of the dangerouslySetInnerHTML container.
  const escaped = raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  // 2. Re-open ONLY the specific LaTeX delimiters the renderer expects,
  //    after escaping, so formatting still works but nothing else does.
  return escaped
    .replace(/\\(/g, '\\(')
    .replace(/\\)/g, '\\)');
}

// Every AI-generated answer flows through this before it ever
// reaches a renderer, no exceptions, no "trusted" model outputs.
const safeAnswer = sanitizeAnswer(aiGeneratedAnswer);`,
      },
      { type: 'paragraph', text: "The result was that 100% of AI-generated quiz answers got escaped before they ever touched either renderer, closing off an injection risk without losing any of the rich formatting the product actually needed. It's the kind of fix that, if it works, nobody ever notices, and that's exactly the point." },
      { type: 'heading', text: 'What it actually taught me' },
      { type: 'paragraph', text: "Interning somewhere this small meant there was no separate security team to catch what I missed, no large QA org to file a bug before a student ever saw it. That's a lot of trust to hand an intern, and it changed how seriously I take shipping code, generally. I stopped thinking of security and i18n as 'senior engineer problems' and started treating them as just part of building the feature, because at a startup, that's what they are." },
    ],
  },

  {
    id: 'ernst-young',
    kicker: 'Internship',
    title: 'Building an ETL Pipeline and an AI Interviewer at EY',
    date: '2025',
    readingTime: '6 min',
    excerpt:
      "As an AI Development Intern at Ernst & Young, I built a Python ETL pipeline that cut proposal generation time by roughly 85%, and a speech-driven AI interviewer with sub-3-second response times.",
    thumbnail: ey,
    blocks: [
      { type: 'paragraph', text: "My internship at EY was an AI Development role sitting somewhere between data engineering and applied AI, building tools that plugged directly into client-facing work rather than staying internal experiments. Two projects took up most of my time: a document-generation pipeline for client proposals, and a speech-driven AI interview system." },
      { type: 'heading', text: 'Turning a 4 hour manual process into 5 minutes' },
      { type: 'paragraph', text: "The proposal-generation workflow started as a genuinely painful manual process, someone had to comb through World Health Organization records by hand to pull the data a client proposal needed. I built a Python ETL pipeline that processed over 25,000 WHO records and fed them into an LLM-powered document workflow, which was then piloted directly in client-facing work. What used to take about 4 hours of manual work came down to roughly 5 minutes, an ≈85% reduction, and the pipeline was modular enough to plug in pluggable LLM revision stages, so the same system could generate proposals in multiple formats without a rewrite for each one." },
      { type: 'heading', text: 'An AI interviewer that had to feel like a conversation' },
      { type: 'paragraph', text: "The second project was a speech-driven AI interview system, built on the Azure AI Speech SDK. The hard constraint was latency, if the response time is too slow, it stops feeling like a conversation and starts feeling like talking to a phone tree. I designed the system to stream speech-to-text and LLM inference in parallel rather than running them sequentially, which eliminated the bottleneck of waiting for a full transcript before inference could even begin. That got the system down to under 3 seconds response time, fast enough that the pauses read as thinking rather than lag." },
      { type: 'heading', text: 'The less glamorous infrastructure underneath both' },
      { type: 'paragraph', text: "Neither project worked in isolation. I used Selenium to automate web scraping and social sentiment pipelines feeding into the same proposal system, Docker to containerize both the AI and ETL pipelines so they ran identically regardless of whose machine (or which environment) they landed on, and Postman to design and test the REST APIs connecting all of it together. None of that shows up in a demo, but all of it is the reason the demo worked reliably more than once." },
      { type: 'paragraph', text: "What stuck with me most was how much of 'AI engineering' in an enterprise setting is actually just disciplined data engineering with an LLM bolted on at the right point in the pipeline. The model was rarely the hard part. Getting 25,000 messy real-world records into a shape an LLM could reliably use, and getting a response back to a person fast enough that it still felt human, that was the actual work." },
    ],
  },

  {
    id: 'why-i-edit',
    kicker: 'Craft',
    title: 'Why I Edit the Way I Do',
    date: '2026',
    readingTime: '5 min',
    excerpt:
      'The side of me that is not writing code. What a few million views taught me about pacing, restraint, and making people actually feel something.',
    hero: { type: 'video', src: VID.fourRaws },
    blocks: [
      { type: 'paragraph', text: 'Outside of engineering, this is the thing I do. Editing started as something to keep me busy at night when I could not sleep, but at some point it turned into the thing I reach for whenever I feel overwhelmed. 4 Raws, the edit at the top, is one I am genuinely proud of. Timing the clips, masking, typography, all of it took a ton of work.' },
      { type: 'paragraph', text: 'My whole approach, if I even have one, is that I start from the feeling and the music. Before I touch a single frame I ask myself what vibe I want to give off for this character, and then I work backwards from there. The cuts are just how I get there, they were never really the point.' },
      { type: 'quote', text: 'When you stop seeing yourself in the work, that is when you are starting to get somewhere.', cite: 'some random editor' },
      { type: 'paragraph', text: 'I really agree with that. When I edit it feels like time just flies, and picking up a few million likes along the way made me want to keep getting better at it.' },
      { type: 'video', src: VID.strongest, caption: 'The Strongest, Gojo. Built around one single crescendo.' },
      { type: 'heading', text: 'Making the text feel like it belongs' },
      { type: 'paragraph', text: 'This is the one where I tried out Invincible style title cards for Gojo. Getting the text to feel like it actually lives inside the scene instead of just sitting on top of it is a surprisingly deep rabbit hole. Masking, matching the camera motion, all of it.' },
      { type: 'video', src: VID.tojiMograph, caption: 'Les Instrumental, Toji. Somehow ended up at 1.8M views.' },
      { type: 'paragraph', text: 'That one blew up in a way I really did not expect. Someone commented why does this not have 1M likes and another one said WHO IS THIS GUY, and I am not gonna lie, those stuck with me. You make this stuff alone at 2am with no idea if anyone will even care, so when it connects it really connects.' },
      { type: 'heading', text: 'Same subject, two completely different moods' },
      { type: 'paragraph', text: 'These next two are both Toji and both driven by hard SFX hits, but they feel nothing alike. That is the thing I keep proving to myself, it is not the footage that decides the emotion, it is the pacing. Same clips, different rhythm, completely different energy.' },
      {
        type: 'duo',
        items: [
          { type: 'video', src: VID.savage },
          { type: 'video', src: VID.creed },
        ],
      },
      { type: 'paragraph', text: 'On these I cut the picture to the sound instead of the other way around. I drop the SFX in first and let the beats tell me where the frame should change. It feels backwards but it is the only way it comes out feeling intentional instead of just decorated. Anyways, that is the non code side of me. Thanks for reading.' },
    ],
  },
  {
    id: 'messi-goat',
    kicker: 'Sports Science',
    title: 'How is Lionel Messi so good? Scientifically speaking.',
    date: '2026',
    readingTime: '13 min',
    excerpt:
      "I've loved Messi for as long as I've followed football, and watching him play a World Cup final at 39 made me want to actually understand the science behind him instead of just the highlight reels. The biomechanics, the eye-tracking research, and a real neuroscience debate about whether time itself feels different to him.",
    thumbnail: blogMessi,
    hero: { type: 'interactive', widget: 'messistats' },
    blocks: [
      { type: 'paragraph', text: "I watched the 2026 final the way I've watched every Messi match for as long as I can remember, fully expecting something impossible to happen in the last five minutes. It didn't. Spain won 1-0 in extra time, and Messi, 39 years old, cried on the sideline. Argentina didn't get the trophy. But somewhere in the middle of that tournament, between the hat trick in the opener, the comeback against Egypt, and the two assists against England, I stopped just watching him and started wondering what actually explains this. Not in a highlight-reel way. In an actual, checkable, science way." },
      { type: 'paragraph', text: "So this post is that. It's not a tribute, or at least it's not only a tribute. It's me trying to figure out what's real, the biomechanics that are genuinely measurable, the neuroscience that's genuinely peer-reviewed, and, just as important, the stuff that gets repeated online with suspiciously precise-sounding numbers that I couldn't actually trace back to a real study. I wanted to be honest about which is which, because I think the real answer is more interesting than the mythical one anyway." },

      { type: 'heading', text: 'The Numbers, As They Actually Stand' },
      { type: 'paragraph', text: "Before anything else, here's what's real and current, checked as of the 2026 final, not some career-highlights version that stopped updating years ago." },

      { type: 'paragraph', text: "He crossed 900 career goals in March 2026, against Nashville in the Concacaf Champions Cup, and by the time the World Cup final whistle blew in July he was sitting at 919, 794 for club and 125 for Argentina. He's the only player besides Cristiano Ronaldo to ever reach 900 professional goals. He also holds the record for goals at a single club (672, for Barcelona) and, maybe more remarkably, he's the all-time leader in career assists too, having passed Puskás in 2025. Scoring and creating, at the same time, at a scale nobody else has managed." },

      { type: 'heading', text: 'The 2026 Tournament, In Full' },
      { type: 'paragraph', text: "This is the part that actually got me writing this post. He became the first man to ever play in six World Cups. He opened the tournament with a hat trick against Algeria and personally scored six of Argentina's first eight goals of the group stage. Then two escapes in a row, down two against Egypt with 20 minutes left, and a stoppage-time classic against England in the semifinal where he set up both the equalizer and the winner. And then the final, which Spain won by the smallest possible margin, deep into extra time, with Argentina down to ten men by the end." },

      { type: 'interactive', widget: 'wc2026' },

      { type: 'paragraph', text: "He finished the tournament as the all-time World Cup leading scorer, with 20 career World Cup goals, a record he now owns outright, ahead of Miroslav Klose. He also holds the records for World Cup assists, appearances, and minutes played. Individually, there's basically nothing left to win at this tournament. He just didn't get the one thing the whole team was there for. That contrast, total individual dominance next to a team result that got away, is honestly what pulled me into wanting to understand the mechanics of how a body this old still does this at all." },

      { type: 'heading', text: 'Why a 39-Year-Old Should Not Be Able to Do This' },
      { type: 'paragraph', text: "Athletic performance in almost every sport declines with age in fairly predictable, physical ways, top speed drops, recovery slows, high-intensity sprint output falls off. None of that is controversial, and Messi isn't exempt from it; commentators and his own coaching staff have talked openly about managing his minutes for exactly this reason. So the interesting question isn't whether he's in physical decline. He almost certainly is, by the normal measures. The real question is what he's compensating with, and how much of it is actually measurable?" },

      { type: 'heading', text: 'The Physics of Staying Low' },
      { type: 'paragraph', text: "One number that keeps getting cited is his center of gravity, commonly quoted as sitting around 51% of his total height, against roughly 56% for an average professional footballer. I want to be upfront that I couldn't trace this to a single peer-reviewed source, so treat it as a widely repeated estimate rather than an established measurement. But the underlying physics is completely sound regardless of the exact number. A lower center of mass means a shorter lever arm to redirect when changing direction, which is mechanically exactly what tight-space dribbling and a late-career reliance on close control (rather than raw speed) demands. At 1.70m, with heavy knee flexion and a forward torso lean, he's not fighting his height, he's using it." },

      { type: 'heading', text: 'Seeing Before Everyone Else, The Quiet Eye' },
      { type: 'paragraph', text: 'This is the part of the research I trust the most, because it\u2019s backed by a real, replicated body of sports science, not a single hypothesis paper. Kinesiologist Joan Vickers coined the term "Quiet Eye" for a specific, measurable behavior, elite athletes across sports hold a longer, stiller final fixation on their target right before they act, compared to less skilled athletes. A meta-analysis by Mann, Williams, Ward, and Janelle found that anticipation, not raw reaction speed, not memory recall, produces the single largest measurable performance gap between expert and novice athletes. It\u2019s less "faster brain," more "looks at the right thing for the right amount of time, because they\u2019ve done it ten thousand times before."' },

      { type: 'interactive', widget: 'quietEye' },

      { type: 'paragraph', text: "This connects directly to something in the tactical analysis of his game, his constant, small repositioning, described by his own coaches as reading passing lanes and defensive blind spots before the ball even arrives. That's not mystical field vision. It's the on-field version of exactly what the eye-tracking research describes, an expert doesn't process more information faster, they've learned exactly where to look, so there's simply less irrelevant information competing for their attention in the first place." },

      { type: 'heading', text: 'So Does Time Actually Slow Down for Him?' },
      { type: 'paragraph', text: "This is where I want to be honest about a real scientific disagreement, because I think it's a better story than picking one side and presenting it as settled. In 2016, researchers Jafari and Smith published a short hypothesis paper suggesting that Messi's neurons might genuinely process information faster, quite literally proposing that subjective time could pass more slowly for him during a match, drawing a comparison to Wayne Gretzky's famous description of hockey feeling \"slow.\"" },
      { type: 'paragraph', text: "A separate group, Erren, Kuffer, Pinger, and Groß, publishing in the same journal later that year, responded directly to that hypothesis. Their pushback wasn't dismissive, but it was skeptical of the literal \"faster neurons\" framing, and it offered an explanation I find much more convincing, that elite athletes like Messi and Gretzky effectively \"buy time,\" not through faster biology, but because automatized motor skills free up cognitive capacity that a less-skilled player is still spending on basic execution. If you don't have to think about how to control the ball, you have that much more attention left over to read the game around you." },
      { type: 'paragraph', text: "I think that second explanation is the right one, and it lines up with the Quiet Eye research above almost perfectly. It's not that the world moves slower for him. It's that after roughly two decades of repetition, he's spending almost none of his cognitive budget on execution, so nearly all of it is available for anticipation. That's not a supernatural gift. It's what 20 years of the same repeated motion, at the highest level, actually buys you. Which, honestly, makes the 2026 World Cup more impressive to me, not less. That budget is still intact at 39, even as the legs underneath it visibly aren't what they were." },

      { type: 'heading', text: 'What the Goal Data Actually Shows' },
      { type: 'paragraph', text: "One more piece of real, checkable data, from an analysis of his 474 La Liga goals during his Barcelona career. 394 of them (83.12%) came off his left foot, 63 (13.29%) off his right, and 17 (3.59%) were headers. Almost 79% came from open play rather than set pieces, and the majority of those, 68.14%, were scored from inside the penalty area but outside the six-yard box, which is exactly the zone his low-center-of-gravity close control is built to exploit. Not a poacher's tap-ins, and not exclusively long-range strikes, but the dense, contested space where balance and quick redirection matter most." },

      { type: 'interactive', widget: 'messishotmap' },

      { type: 'paragraph', text: "None of this adds up to \"one weird trick.\" It's a low center of mass that makes redirection mechanically cheap, a visual search strategy trained over two decades that means his eyes are rarely wasted on the wrong thing, and a level of automatized skill deep enough that almost his entire cognitive bandwidth during a match is free for reading the game instead of executing it. Individually, none of those three things is superhuman. Stacked together, sustained for 20 years, and still intact at 39 in a World Cup final, that's the actual, unglamorous, checkable explanation for why I still can't look away." },
    ],
  },
];