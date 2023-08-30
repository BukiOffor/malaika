"use client";
import { Variants, motion, useAnimationControls, useScroll } from "framer-motion";
import { useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";


const ScrollToTopContainerVariants: Variants = {
  hide: { opacity: 0, y: 100 },
  show: { opacity: 1, y: 0 },
};
const isBrowser = () => typeof window !== 'undefined';

function scrollToTop() {
  if (!isBrowser()) return;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export default function ScrollToTopButton() {
  const { scrollYProgress } = useScroll();
  const controls = useAnimationControls();

  useEffect(() => {
    return scrollYProgress.on('change', (latestValue) => {
      if (latestValue > 0.6) {
        controls.start('show');
      } else {
        controls.start('hide');
      }
    });
  });

  return (
    <motion.button
      className="fixed bottom-4 right-2 p-3 rounded-full btn__nav"
      variants={ScrollToTopContainerVariants}
      initial="hide"
      animate={controls}
      onClick={scrollToTop}>
      <FaArrowUp />
    </motion.button>
  );
}