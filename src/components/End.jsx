import React, { useRef, useEffect } from "react";
import Matter from "matter-js";
import { styles } from "../styles"; // import your existing style constants

const End = () => {
  const containerRef = useRef(null);
  const wordBodies = useRef([]);
  const engineRef = useRef(null);

  const words = ["James", "Innovator", "Coder", "Editor", "Passion"];

  useEffect(() => {
    if (!containerRef.current) return;

    const Engine = Matter.Engine,
      World = Matter.World,
      Bodies = Matter.Bodies;

    const container = containerRef.current;
    const width = container.offsetWidth;
    const height = container.offsetHeight;

    const engine = Engine.create();
    engine.world.gravity.y = 2; // Adjust gravity for speed
    engineRef.current = engine;

    // Add boundaries (floor + walls)
    const boundaryOpts = { isStatic: true };
    const floor = Bodies.rectangle(width / 2, height - 80, width, 120, boundaryOpts);
    const leftWall = Bodies.rectangle(-50, height / 2, 100, height, boundaryOpts);
    const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height, boundaryOpts);
    World.add(engine.world, [floor, leftWall, rightWall]);

    // Create multiple falling words
    words.forEach((text) => {
      for (let i = 0; i < 5; i++) {
        const word = document.createElement("span");
        word.textContent = text;
        word.className = `
          absolute 
          select-none 
          whitespace-nowrap 
          font-black 
          text-[48px] 
          sm:text-[64px] 
          md:text-[80px] 
          tracking-tight 
          drop-shadow-lg 
          text-white 
        `;
        // Optional glowing gradient
        word.style.background = "linear-gradient(90deg, #915EFF, #A06BFF)";
        word.style.webkitBackgroundClip = "text";
        word.style.webkitTextFillColor = "transparent";

        container.appendChild(word);

        const rect = word.getBoundingClientRect();
        const spawnX = Math.random() * width;
        const spawnY = Math.random() * -800;

        const body = Bodies.rectangle(spawnX, spawnY, rect.width, rect.height, {
          restitution: 0.4,
          frictionAir: 0.02,
        });

        World.add(engine.world, body);
        wordBodies.current.push({ elem: word, body });
      }
    });

    // Animation loop
    const updateLoop = () => {
      wordBodies.current.forEach(({ elem, body }) => {
        const { x, y } = body.position;
        if (y < height - 80) {
          elem.style.left = `${x}px`;
          elem.style.top = `${y}px`;
          elem.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
        }
      });
      Matter.Engine.update(engine, 1000 / 60);
      requestAnimationFrame(updateLoop);
    };
    updateLoop();

    // Cleanup
    return () => {
      wordBodies.current.forEach(({ elem }) => container.removeChild(elem));
      wordBodies.current = [];
      Matter.World.clear(engine.world, false);
      Matter.Engine.clear(engine);
    };
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      <div
        ref={containerRef}
        className="absolute inset-0 flex justify-center items-center"
      />
      <div className="absolute top-[120px] left-0 right-0 text-center">
        <h1 className={`${styles.heroHeadText} text-white`}>
          Building the Future with{" "}
          <span className="text-[#915EFF]">Passion</span>
        </h1>
        <p className={`${styles.heroSubText} text-white-100`}>
          I code, create, and innovate through interactive experiences.
        </p>
      </div>
    </section>
  );
};

export default End;
