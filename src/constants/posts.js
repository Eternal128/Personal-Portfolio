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
];