import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function HoverButton({ label, onClick }) {
  const [hovered, setHovered] = useState(false);

  const variants = {
    initial: { y: 0, opacity: 1 },
    exit: { y: -24, opacity: 0 },
    enter: { y: 24, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative px-4 py-2 text-lg font-semibold text-black bg-transparent rounded-md"
    >
      {/* This makes space for the animation without clipping */}
      <div className="relative h-6 min-w-[100px] flex items-center justify-center">
        <AnimatePresence initial={false} mode="wait">
          {!hovered ? (
            <motion.span
              key="default"
              variants={variants}
              initial="enter"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="absolute w-full text-center"
            >
              {label}
            </motion.span>
          ) : (
            <motion.span
              key="hover"
              variants={variants}
              initial="exit"
              animate="animate"
              exit="enter"
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="absolute w-full text-center"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </button>
  );
}
