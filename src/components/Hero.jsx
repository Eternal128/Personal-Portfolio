import React, { useRef, useEffect, useState, useMemo, useId } from 'react';

const Hero = () => {
  // --- Embedded CurvedLoop component ---
  const CurvedLoop = ({
    marqueeText = '',
    speed = 2,
    className,
    curveAmount = 100,
    direction = 'left',
    interactive = true
  }) => {
    const text = useMemo(() => {
      const hasTrailing = /\s|\u00A0$/.test(marqueeText);
      return (hasTrailing ? marqueeText.replace(/\s+$/, '') : marqueeText) + '\u00A0';
    }, [marqueeText]);

    const measureRef = useRef(null);
    const textPathRef = useRef(null);
    const pathRef = useRef(null);
    const [spacing, setSpacing] = useState(0);
    const [offset, setOffset] = useState(0);
    const uid = useId();
    const pathId = `curve-${uid}`;
    const pathD = `M-100,40 Q500,${40 + curveAmount} 1540,40`;

    const dragRef = useRef(false);
    const lastXRef = useRef(0);
    const dirRef = useRef(direction);
    const velRef = useRef(0);

    const textLength = spacing;
    const totalText = textLength
      ? Array(Math.ceil(1800 / textLength) + 2)
          .fill(text)
          .join('')
      : text;
    const ready = spacing > 0;

    useEffect(() => {
      if (measureRef.current) setSpacing(measureRef.current.getComputedTextLength());
    }, [text, className]);

    useEffect(() => {
      if (!spacing) return;
      if (textPathRef.current) {
        const initial = -spacing;
        textPathRef.current.setAttribute('startOffset', initial + 'px');
        setOffset(initial);
      }
    }, [spacing]);

    useEffect(() => {
      if (!spacing || !ready) return;
      let frame = 0;
      const step = () => {
        if (!dragRef.current && textPathRef.current) {
          const delta = dirRef.current === 'right' ? speed : -speed;
          const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0');
          let newOffset = currentOffset + delta;
          const wrapPoint = spacing;
          if (newOffset <= -wrapPoint) newOffset += wrapPoint;
          if (newOffset > 0) newOffset -= wrapPoint;
          textPathRef.current.setAttribute('startOffset', newOffset + 'px');
          setOffset(newOffset);
        }
        frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
      return () => cancelAnimationFrame(frame);
    }, [spacing, speed, ready]);

    const onPointerDown = e => {
      if (!interactive) return;
      dragRef.current = true;
      lastXRef.current = e.clientX;
      velRef.current = 0;
      e.target.setPointerCapture(e.pointerId);
    };

    const onPointerMove = e => {
      if (!interactive || !dragRef.current || !textPathRef.current) return;
      const dx = e.clientX - lastXRef.current;
      lastXRef.current = e.clientX;
      velRef.current = dx;
      const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0');
      let newOffset = currentOffset + dx;
      const wrapPoint = spacing;
      if (newOffset <= -wrapPoint) newOffset += wrapPoint;
      if (newOffset > 0) newOffset -= wrapPoint;
      textPathRef.current.setAttribute('startOffset', newOffset + 'px');
      setOffset(newOffset);
    };

    const endDrag = () => {
      if (!interactive) return;
      dragRef.current = false;
      dirRef.current = velRef.current > 0 ? 'right' : 'left';
    };

    const cursorStyle = interactive ? (dragRef.current ? 'grabbing' : 'grab') : 'auto';

    return (
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ visibility: ready ? 'visible' : 'hidden', cursor: cursorStyle }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        <svg
          className="select-none w-full overflow-visible block aspect-[100/12] text-[6rem] font-bold uppercase leading-none"
          viewBox="0 0 1440 120"
        >
          <text ref={measureRef} xmlSpace="preserve" style={{ visibility: 'hidden', opacity: 0, pointerEvents: 'none' }}>
            {text}
          </text>
          <defs>
            <path ref={pathRef} id={pathId} d={pathD} fill="none" stroke="transparent" />
          </defs>
          {ready && (
            <text xmlSpace="preserve" className={`fill-white ${className ?? ''}`}>
              <textPath ref={textPathRef} href={`#${pathId}`} startOffset={offset + 'px'} xmlSpace="preserve">
                {totalText}
              </textPath>
            </text>
          )}
        </svg>
      </div>
    );
  };

  // --- Stars background ---
  const starsRef = useRef(null);
  useEffect(() => {
    const canvas = starsRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 150 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      speed: Math.random() * 0.5 + 0.2,
      alpha: Math.random() * 0.8 + 0.2
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      stars.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) star.y = 0;
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center">
      <canvas
        ref={starsRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
      />
      <CurvedLoop
        marqueeText="James William Hanzell ✦ "
        speed={2}
        curveAmount={100}
        direction="left"
        className="text-6xl font-bold uppercase fill-white"
      />
      <p className="absolute bottom-20 text-white text-xl text-center w-full">
        Building a Fun Future
      </p>
    </section>
  );
};

export default Hero;
