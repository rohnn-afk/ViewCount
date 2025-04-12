import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

export default function AnimatedBox({ children, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const boxVariants = {
    hidden: {
      scaleX: 0,
      scaleY: 0,
      opacity: 0,
      originX: 0,
      originY: 0,
    },
    visible: {
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div ref={ref} className="relative overflow-visible">
      {/* Dot at top-left */}
      <span className="absolute w-8 h-8  bg-black rounded-full z-[90] -top-2 -left-2  border-white border-4" />

      <motion.div
        initial="hidden"
        animate={controls}
        variants={boxVariants}
        className={`origin-top-left p-4 rounded-2xl bg-white  shadow-lg ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
}
