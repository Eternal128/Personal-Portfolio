import React, { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useAnimationFrame,
} from "framer-motion";

const TESTIMONIALS = [
  {
    name: "Daniel Kim",
    role: "Actuarial Science, U of T",
    text: "I've asked him at least 10x about why he's still working.",
    rating: 5,
    avatar: "https://pbs.twimg.com/media/GyHdy2fXIAEpDQW.png",
  },
  {
    name: "Yung Jui Lai",
    role: "Engineering, U of Manchester",
    text: "He's hard-working, smart, and actually gives me helpful, unfiltered feedback. Sometimes even unhinged.",
    rating: 5,
    avatar: "https://pbs.twimg.com/media/GyHdy2fXIAEpDQW.png",
  },
  {
    name: "Abdullah Alhidary",
    role: "CS Student, U of T",
    text: "He's the GOAT! And a great friend!",
    rating: 5,
    avatar: "https://pbs.twimg.com/media/GyHdy2fXIAEpDQW.png",
  },
];

// Duplicate for seamless loop
const ALL_CARDS = [...TESTIMONIALS, ...TESTIMONIALS];

const StarRating = ({ count }) => (
  <div className="flex gap-1 mt-5">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill={i < count ? "#c9a84c" : "none"}
        stroke={i < count ? "#c9a84c" : "rgba(var(--fg-rgb),0.15)"}
        strokeWidth="1.5"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ))}
    <span
      className="ml-2 text-[12px]"
      style={{ color: "rgba(var(--fg-rgb),0.3)" }}
    >
      {count}.0
    </span>
  </div>
);

const TestimonialCard = ({ name, role, text, rating, avatar }) => (
  <div
    className="flex-shrink-0 w-[460px] rounded-3xl p-12 flex flex-col justify-between backdrop-blur-md"
    style={{
      background: "rgba(var(--fg-rgb),0.035)",
      border: "1px solid rgba(var(--fg-rgb),0.08)",
      boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
      fontFamily: "'DM Sans', sans-serif",
    }}
  >
    <div>
      <div className="flex items-center gap-4 mb-6">
        <img
          src={avatar}
          alt={name}
          className="w-12 h-12 rounded-full object-cover"
          style={{
            filter: "grayscale(50%)",
            border: "1px solid rgba(var(--fg-rgb),0.15)",
          }}
        />
        <div>
          <p className="font-light text-[17px] tracking-wide" style={{ color: "var(--fg)" }}>
            {name}
          </p>
          <p
            className="text-[12px] font-light mt-1"
            style={{ color: "rgba(var(--fg-rgb),0.4)" }}
          >
            {role}
          </p>
        </div>
      </div>

      <div
        className="h-[1px] mb-6"
        style={{ background: "rgba(var(--fg-rgb),0.06)" }}
      />

      <p
        className="text-[17px] font-light leading-relaxed"
        style={{ color: "rgba(var(--fg-rgb),0.75)" }}
      >
        "{text}"
      </p>
    </div>

    <StarRating count={rating} />
  </div>
);

const Feedbacks = () => {
  const trackRef = useRef(null);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  // Smooth elite drift speed
  const speed = isHovered ? 30 : 60;

  useAnimationFrame((_, delta) => {
    const moveBy = (delta / 1000) * speed;
    x.set(x.get() - moveBy);

    if (trackRef.current) {
      const width = trackRef.current.scrollWidth / 2;
      if (Math.abs(x.get()) >= width) {
        x.set(0);
      }
    }
  });

  return (
    <>
      <style>
        {`
.testimonial-fade-left {
          background: linear-gradient(to right, var(--bg) 0%, transparent 100%);
        }

        .testimonial-fade-right {
          background: linear-gradient(to left, var(--bg) 0%, transparent 100%);
        }
      `}
      </style>

      <section
        id="testimonials"
        className="w-full bg-transparent py-28 overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 sm:px-16 mb-20">
          <p
            className="text-[11px] uppercase tracking-[0.25em] mb-5"
            style={{ color: "rgba(var(--fg-rgb),0.35)" }}
          >
            Testimonials
          </p>

          <h2 className="theme-shimmer-text font-light text-[clamp(40px,5vw,80px)] leading-none tracking-tight">
            What others say.
          </h2>

          <div
            className="mt-8 h-[1px]"
            style={{ background: "rgba(var(--fg-rgb),0.06)" }}
          />
        </div>

        {/* Infinite Track */}
        <div className="relative overflow-hidden py-8">
          <div className="testimonial-fade-left absolute left-0 top-0 bottom-0 w-48 z-10 pointer-events-none" />
          <div className="testimonial-fade-right absolute right-0 top-0 bottom-0 w-48 z-10 pointer-events-none" />

          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex gap-12 w-max"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {ALL_CARDS.map((t, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.04 }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
              >
                <TestimonialCard {...t} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Feedbacks;