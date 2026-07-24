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
    title: 'Finding the Shortest Path Through Jakarta',
    date: '2024',
    readingTime: '10 min',
    excerpt:
      'I turned Jakarta into a 46 node weighted graph and tested Dijkstra against Kruskal to figure out the best delivery routes. This is what I learned about greedy algorithms and why the right one really just depends on the question.',
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
    title: 'Teaching Machines to Make Things Up',
    date: '2026',
    readingTime: '8 min',
    excerpt:
      'How I went from thinking ML was scary math to building tiny generative models myself, and why watching a machine make stuff up is what finally made it click.',
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
    id: 'creative-outlet',
    kicker: 'Reflection',
    title: 'Code by Day, Edits by Night',
    date: '2025',
    readingTime: '4 min',
    excerpt:
      'Having a creative hobby outside of engineering actually makes me a better engineer, and it turns out the feel of a good edit is just math I had not written down yet.',
    hero: { type: 'video', src: VID.tojiMograph },
    blocks: [
      { type: 'paragraph', text: 'On paper, engineering and video editing should not have anything in common. One is all logic, the other is all feel. But the more I do both, the more they blur into the same question for me, which is how do you take something complicated and make it land simply.' },
      { type: 'heading', text: 'Pacing is just easing, and easing is just code' },
      { type: 'paragraph', text: 'This is the thing that connected both halves of my brain. When I hold a frame in an edit so it hits harder, I am doing the exact same thing a developer does when they pick an easing curve for an animation. It is the same math, I just used to feel it instead of writing it down. So I finally wrote out the function I had been feeling in my gut for years.' },
      {
        type: 'code',
        lang: 'JavaScript',
        filename: 'easing.js',
        code:
`// A back-out ease. It overshoots a little, then settles.
// That tiny overshoot is why a landing actually feels like it lands.
const impact = (t) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3)
           + c1 * Math.pow(t - 1, 2);
};

// Drive it with the same rAF clock every animation uses.
function animate(el, duration = 1400) {
  const start = performance.now();
  const step = (now) => {
    const t = Math.min((now - start) / duration, 1);
    el.style.transform = \`translateX(\${impact(t) * 100}%)\`;
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}`,
      },
      { type: 'paragraph', text: 'Seeing it written out kind of broke my brain in a good way. The instinct I built up from thousands of edits was just a cubic function and a requestAnimationFrame loop. So I turned it into something you can actually play with. You pick a curve and watch the timing I would feel in an edit happen in code.' },
      { type: 'interactive', widget: 'easing' },
      { type: 'paragraph', text: 'The editing keeps me honest about people, about attention and about what actually makes someone feel something. The code keeps me honest about the strict stuff, the structure and edge cases and all the parts you cannot fake. I really do not think I would be as good at either one if I dropped the other, and having a real creative outlet is the main thing that keeps engineering from ever feeling like a grind.' },
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
    title: 'What 919 Goals and One Heartbreaking Final Actually Prove',
    date: '2026',
    readingTime: '13 min',
    excerpt:
      "I've loved Messi for as long as I've followed football, and watching him play a World Cup final at 39 made me want to actually understand the science behind him instead of just the highlight reels. The biomechanics, the eye-tracking research, and a real neuroscience debate about whether time itself feels different to him.",
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