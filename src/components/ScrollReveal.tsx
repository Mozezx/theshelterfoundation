import { ReactNode } from "react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "left" | "right" | "scale";
  delay?: number;
}

const directionClasses = {
  up: { hidden: "translate-y-12 opacity-0", visible: "translate-y-0 opacity-100" },
  left: { hidden: "-translate-x-12 opacity-0", visible: "translate-x-0 opacity-100" },
  right: { hidden: "translate-x-12 opacity-0", visible: "translate-x-0 opacity-100" },
  scale: { hidden: "scale-95 opacity-0", visible: "scale-100 opacity-100" },
};

const ScrollReveal = ({ children, className = "", direction = "up", delay = 0 }: ScrollRevealProps) => {
  const { ref, visible } = useScrollReveal(0.1);
  const classes = directionClasses[direction];

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? classes.visible : classes.hidden} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
