import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Decal,
  Float,
  OrbitControls,
  Preload,
  useTexture,
} from "@react-three/drei";

import CanvasLoader from "../Loader";

const Ball = (props) => {
  const [decal] = useTexture([props.imgUrl]);

  return (
    <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 0, 0.05]} />
      <mesh castShadow receiveShadow scale={2.75}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color='#fff8eb'
          polygonOffset
          polygonOffsetFactor={-5}
          flatShading
        />
        <Decal
          position={[0, 0, 1]}
          rotation={[2 * Math.PI, 0, 6.25]}
          scale={1}
          map={decal}
          flatShading
        />
      </mesh>
    </Float>
  );
};

const BallCanvas = ({ icon, name, level, description }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get color based on expertise level
  const getLevelColor = (level) => {
    switch (level) {
      case "Expert":
        return "from-green-400 to-emerald-600";
      case "Advanced":
        return "from-blue-400 to-cyan-600";
      case "Intermediate":
        return "from-yellow-400 to-orange-600";
      case "Beginner":
        return "from-red-400 to-pink-600";
      default:
        return "from-gray-400 to-gray-600";
    }
  };

  // Get progress bar width based on level
  const getLevelWidth = (level) => {
    switch (level) {
      case "Expert":
        return "w-full";
      case "Advanced":
        return "w-3/4";
      case "Intermediate":
        return "w-1/2";
      case "Beginner":
        return "w-1/4";
      default:
        return "w-1/2";
    }
  };

  return (
    <div 
      className="relative w-28 h-28"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Canvas
        frameloop='demand'
        dpr={[1, 2]}
        gl={{ preserveDrawingBuffer: true }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <OrbitControls enableZoom={false} />
          <Ball imgUrl={icon} />
        </Suspense>

        <Preload all />
      </Canvas>

      {/* Tooltip */}
      {isHovered && (
        <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-tertiary p-4 rounded-xl shadow-2xl border border-[#d1e6ff]/20 min-w-[200px] backdrop-blur-sm">
            {/* Name */}
            <h3 className="text-white font-bold text-lg mb-2 text-center">
              {name}
            </h3>

            {/* Expertise Level */}
            <div className="mb-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-secondary text-xs uppercase tracking-wider">
                  Expertise
                </span>
                <span className={`text-xs font-semibold bg-gradient-to-r ${getLevelColor(level)} bg-clip-text text-transparent`}>
                  {level}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-2 bg-black-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getLevelWidth(level)} bg-gradient-to-r ${getLevelColor(level)} rounded-full transition-all duration-500`}
                />
              </div>
            </div>

            {/* Description */}
            {description && (
              <p className="text-secondary text-xs leading-relaxed mt-2 text-center">
                {description}
              </p>
            )}

            {/* Arrow pointing down */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-tertiary" />
          </div>
        </div>
      )}
    </div>
  );
};

export default BallCanvas;