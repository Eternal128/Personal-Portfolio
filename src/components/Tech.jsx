import React from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";

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
      <div className='flex flex-row flex-wrap justify-center gap-10'>
        {technologies.map((technology) => (
          <div className='w-28 h-28' key={technology.name}>
            <BallCanvas icon={technology.icon} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(Tech, "tech");
