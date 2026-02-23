 
import { motion } from 'framer-motion';

export function BouceAnimation({ children , duration ,className }:any) {
  
  return (
    <motion.div  
     initial={{ opacity: 0, scale: 0 }}
     animate={{ opacity: 1, scale: 1 }}  
     className={className ? className :" "}
     transition={{
         duration:   0.4, 
         delay: duration ,
         scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
     }} 
    >
        {children}
    </motion.div>
  );
}




import { useEffect, useState, useRef } from 'react';

export function useSticky() {
  const [isSticky, setSticky] = useState(false);
  const element = useRef<HTMLDivElement>(null); // Type the ref

  const handleScroll = () => {
    if (element.current) {
      // Adjust the condition based on when you want it to become sticky
      setSticky(window.scrollY > element.current.getBoundingClientRect().bottom);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array ensures it runs once on mount and cleans up on unmount

  return { isSticky, element };
}



export default {}