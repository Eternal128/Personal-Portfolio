import React, { useState } from "react";
import Tilt from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const ServiceCard = ({ index, title, icon, description, skills }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Tilt className='xs:w-[250px] w-full'>
      <motion.div
        variants={fadeIn("right", "spring", index * 0.5, 0.75)}
        className='w-full dark-blue-gradient p-[1px] rounded-[20px] shadow-card relative'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          options={{
            max: 45,
            scale: 1,
            speed: 450,
          }}
          className='bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col relative overflow-hidden'
        >
          {/* Default View */}
          <motion.div
            animate={{ opacity: isHovered ? 0 : 1, scale: isHovered ? 0.8 : 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            <img
              src={icon}
              alt={title}
              className='w-16 h-16 object-contain'
            />

            <h3 className='text-white text-[20px] font-bold text-center mt-4'>
              {title}
            </h3>
          </motion.div>

          {/* Hover View - Description & Skills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 p-6 flex flex-col justify-center items-center"
            style={{ pointerEvents: isHovered ? 'auto' : 'none' }}
          >
            <h3 className='text-white text-[18px] font-bold text-center mb-3'>
              {title}
            </h3>
            
            <p className='text-secondary text-[14px] text-center leading-relaxed mb-4'>
              {description}
            </p>

            {/* Skills Tags */}
            {skills && skills.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {skills.map((skill, idx) => (
                  <span 
                    key={idx}
                    className="text-[10px] px-2 py-1 bg-black-200 rounded-full text-[#d1e6ff] border border-[#d1e6ff]/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </Tilt>
  );
};

const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>Overview.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
      >
        I'm driven to build websites I'm proud of building! My commitment to beautiful design
        extends to video editing and content creation (with 2.7M+ monthly TikTok views). As a quick
        and curious learner, I'm highly adaptable and confident in adopting new technologies to
        deliver efficient, user-friendly results!
      </motion.p>

      <div className='mt-20 flex flex-wrap gap-10'>
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");