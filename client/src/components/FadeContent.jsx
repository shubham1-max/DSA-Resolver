import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const FadeContent = ({
  children,
  blur = false,
  duration = 1000,
  easing = 'easeOut',
  delay = 0,
  threshold = 0.1,
  initialOpacity = 0,
  className = ''
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: initialOpacity, y: 30, filter: blur ? 'blur(8px)' : 'blur(0px)' }}
      animate={
        inView
          ? { opacity: 1, y: 0, filter: 'blur(0px)' }
          : { opacity: initialOpacity, y: 30, filter: blur ? 'blur(8px)' : 'blur(0px)' }
      }
      transition={{
        duration: duration / 1000,
        ease: easing,
        delay: delay / 1000,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeContent;
