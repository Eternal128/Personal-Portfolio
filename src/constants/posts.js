import { machine, road, music, editor } from '../assets';

const VID = {
  fourRaws:    'https://res.cloudinary.com/daetzwh6x/video/upload/v1774021264/4_Raws_-_Toji_Fushiguro_oyvmqf.mp4',
  strongest:   'https://res.cloudinary.com/daetzwh6x/video/upload/v1773972756/the_strongest_ebutvq.mp4',
  tojiMograph: 'https://res.cloudinary.com/daetzwh6x/video/upload/v1773972350/toji_mograph_hbqmsu.mov',
  savage:      'https://res.cloudinary.com/daetzwh6x/video/upload/v1773972392/toji_ofjtmn.mov',
  creed:       'https://res.cloudinary.com/daetzwh6x/video/upload/v1773972454/toji_creed_x2zutr.mov',
};

export const POSTS = [
  {
    id: 'why-i-edit',
    kicker: 'Process',
    title: 'Why I Edit the Way I Do',
    date: '2026',
    readingTime: '5 min',
    excerpt:
      'I don’t really think about cuts when I edit. I think about how I want you to feel — and then I chase that feeling until the timeline agrees with me.',
    hero: { type: 'video', src: VID.fourRaws },
    blocks: [
      { type: 'paragraph', text: 'Honestly, I never planned to take editing this seriously. It started as something to do at night when I couldn’t sleep, but somewhere along the way it turned into the thing I do everytime I feel overwhelmed. 4 Raws, the edit above, was one of the videos I’m proud of making. It involves a lot of work including timing the clips, masking, typography, etc..' },
      { type: 'paragraph', text: 'The whole trick, if there even is one, is that I start from the feeling and music. Before I touch a single frame I ask myself, what vibe do I want to give off of this character? Then I work backwards from there. The cuts are just how I get there, they were never the point.' },
      { type: 'quote', text: 'When you stop seeing yourself in the work, that’s when you’re starting to get somewhere.', cite: 'some random editor' },
      { type: 'paragraph', text: 'I honestly, very much agree to this quote. When I edit, it feels like time flows really fast. Pair it up with the fact that I’ve gained million of likes for my vidoes, makes me feel even more motivated to edit.' },
      { type: 'video', src: VID.strongest, caption: 'The Strongest. ' },
      { type: 'heading', text: 'Making the text feel like it belongs' },
      { type: 'paragraph', text: 'This is the video where I experimented using Invincible Title Cards for my other favorite character, Satoru Gojo. I have to say, it was fun!' },
      { type: 'video', src: VID.tojiMograph, caption: 'Les Instrumental — Toji. The one that somehow ended up at 1.8M views.' },
      { type: 'paragraph', text: 'That one blew up in a way I genuinely didn’t expect. Someone left a comment — “why doesn’t this have 1M likes” — and another said “WHO IS THIS GUY,” and I’m not gonna lie, those stuck with me. I made this stuff alone at 2am with no idea if anyone will care, so when it connects, it really connects.' },
      { type: 'heading', text: 'Same guy, two totally different moods' },
      { type: 'paragraph', text: 'These next two are both Toji, both driven by hard SFX hits, but they feel nothing alike. That’s kind of the point I keep proving to myself, it’s not the footage that decides the emotion, it’s the pacing. Same clips, different rhythm, completely different energy and that’s what makes editing facinating for me.' },
      {
        type: 'duo',
        items: [
          { type: 'video', src: VID.savage },
          { type: 'video', src: VID.creed },
        ],
      },
      { type: 'paragraph', text: 'On these I cut the picture to the sound, not the other way around. I’ll drop the SFX in first and let the beats tell me where the frame should change. It feels backwards, but it’s the only way it comes out feeling intentional instead of decorated.' },
      { type: 'paragraph', text: 'Anyways that’s all! Thanks for reading my short yapping' },
    ],
  },

  {
    id: 'building-things',
    kicker: 'Engineering',
    title: 'Building Things Nobody Asked For',
    date: '2026',
    readingTime: '6 min',
    excerpt:
      'Most of what I actually know, I didn’t learn in class. I learned it building random projects at 2am that nobody asked for.',
    hero: { type: 'image', src: machine },
    blocks: [
      { type: 'paragraph', text: 'Honestly, I have this bad habit of building things nobody asked for. A classifier here, a route optimizer there. None of it was assigned, none of it was for a grade, I just got curious about something and couldn’t really let it go until it actually worked. And weirdly, that’s where most of my real learning ended up happening.' },
      { type: 'heading', text: 'Real data is a mess, and that’s the lesson' },
      { type: 'paragraph', text: 'The COVID X-ray classifier humbled me pretty fast. In class the data is clean and there’s always a right answer waiting for you. In real life it’s blurry scans, mislabeled files, and a model that’s confidently wrong about everything. I’m not gonna lie, figuring out why it kept getting things wrong taught me way more than any tutorial ever did.' },
      { type: 'heading', text: 'See it learn for yourself' },
      { type: 'paragraph', text: 'Instead of me just telling you a model “learns,” here’s a tiny one you can actually mess with. Drop some points on the canvas, pick two classes, hit train, and watch it slowly figure out the boundary between them. Try the XOR preset too, a single straight line physically can’t separate it, which is the whole reason we need a hidden layer in the first place.' },
      { type: 'interactive', widget: 'neural' },
      { type: 'paragraph', text: 'That little curve bending around your points? That’s basically the whole magic of a neural net in miniature. No clean data, no guarantees, just gradient descent slowly getting less wrong every frame. Watching it do that in real time is what made the concept finally click for me.' },
      { type: 'image', src: road, caption: 'Jakarta as a 46-node weighted graph. Dijkstra vs Kruskal — mostly just an excuse to nerd out about my hometown’s traffic.', wide: true },
      { type: 'paragraph', text: 'The Jakarta route optimizer taught me the opposite thing. I had this clean, elegant algorithm that I was honestly kind of proud of, and it meant nothing because the interface confused people. That one stuck with me. The math can be perfect and still fail if it doesn’t feel right to use, and I think about that a lot now, that little seam where the engineering meets the actual human on the other side of the screen.' },
      { type: 'paragraph', text: 'Anyways, none of these were “important” projects. But every one of them taught me something a class never could. That’s all!' },
    ],
  },

  {
    id: 'creative-outlet',
    kicker: 'Reflection',
    title: 'Code by Day, Edits by Night',
    date: '2025',
    readingTime: '3 min',
    excerpt:
      'Everyone thinks editing and coding are opposites. Honestly, for me they’re kind of the same thing, just wearing different clothes.',
    hero: { type: 'image', src: music },
    blocks: [
      { type: 'paragraph', text: 'On paper, engineering and editing shouldn’t really have anything in common. One’s all logic, the other’s all feel. But honestly, the more I do both, the more they kind of blur into the same question for me, how do you take something complicated and make it land simply?' },
      { type: 'image', src: editor, caption: 'Where the night shift happens.' },
      { type: 'paragraph', text: 'The editing keeps me honest about people, about attention and emotion and what actually makes someone feel something. The code keeps me honest about the boring but important stuff, structure, edge cases, all the parts you can’t fake your way through. I genuinely don’t think I’d be as good at either one if I dropped the other.' },
      { type: 'paragraph', text: 'I’m not gonna lie, keeping the creative side alive is pretty much the only thing that stops all of this from feeling like a job. Anyways, that’s the short version. Thanks for reading!' },
    ],
  },
];