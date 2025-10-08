import React from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { textVariant } from "../utils/motion";
import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";

const Tech = () => {
  return (
    <div className={`mt-12 bg-black-100 rounded-[20px]`}>
      <div
        className={`bg-tertiary rounded-2xl ${styles.padding} min-h-[100px]`}
      >
        <motion.div variants={textVariant()}>
          <p className={styles.sectionSubText}>My expertise</p>
          <h2 className={styles.sectionHeadText}>Technical Skills.</h2>
        </motion.div>
      </div>
      
      {/* Extra padding for tooltips */}
      <div className='flex flex-row flex-wrap justify-center gap-10 py-20 px-4'>
        {technologies.map((technology) => (
          <BallCanvas 
            key={technology.name} 
            icon={technology.icon}
            name={technology.name}
            level={technology.level}
            description={technology.description}
          />
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(Tech, "tech");