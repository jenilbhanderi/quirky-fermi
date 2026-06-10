import React from 'react';
import { motion } from 'framer-motion';

const TypewriterText = ({ text, className = "", delay = 0, element: Wrapper = "p" }) => {
  // Split text into characters, but preserve words for wrapping
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: delay * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 10,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <Wrapper className={`${className} overflow-hidden flex flex-wrap`}>
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap"
      >
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block mr-2 whitespace-nowrap">
            {word.split("").map((character, charIndex) => (
              <motion.span
                variants={child}
                key={charIndex}
                className="inline-block"
              >
                {character}
              </motion.span>
            ))}
          </span>
        ))}
      </motion.div>
    </Wrapper>
  );
};

export default TypewriterText;
