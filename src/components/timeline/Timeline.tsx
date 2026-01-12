import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { TimelineStep } from '../../types';

interface TimelineProps {
  steps: TimelineStep[];
}

export const Timeline: React.FC<TimelineProps> = ({ steps }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Find current step index
  const currentStepIndex = steps.findIndex(s => s.isCurrent);

  // Auto-scroll to current step on mount
  useEffect(() => {
    if (scrollContainerRef.current && currentStepIndex !== -1) {
      const stepWidth = 180; // Approximate width of a step
      const containerWidth = scrollContainerRef.current.offsetWidth;
      const scrollPos = (currentStepIndex * stepWidth) - (containerWidth / 2) + (stepWidth / 2);
      scrollContainerRef.current.scrollTo({ left: scrollPos, behavior: 'smooth' });
    }
  }, [currentStepIndex]);

  return (
    <div className="w-full relative py-20 overflow-hidden">
      {/* Scrollable Container */}
      <div 
        ref={scrollContainerRef}
        className="overflow-x-auto pb-8 hide-scrollbar px-4 sm:px-12"
      >
        <div className="flex items-center min-w-max">
          {steps.map((step, index) => {
            const isCompleted = step.status === 'completed';
            const isCurrent = step.isCurrent;
            
            // Colors based on status and position (as per image logic)
            // Early steps: Mint/Green. Later steps: Dark Blue.
            // We'll use a threshold or just map based on status for simplicity + image logic.
            // Image logic: First 6 are green-ish, Rest are blue-ish.
            const isEarlyStage = index < 6;
            
            let bgClass = '';
            if (isCompleted) {
              bgClass = isEarlyStage ? 'bg-emerald-400' : 'bg-slate-700';
            } else if (isCurrent) {
              bgClass = 'bg-lime-400'; // Highlight color
            } else {
              bgClass = 'bg-slate-700/50'; // Future
            }

            // Text Color
            const textColor = isCurrent ? 'text-white font-bold' : 'text-white/90 font-medium';

            return (
              <div key={step.id} className="relative group flex flex-col items-center">
                
                {/* Top Annotation */}
                <div className="absolute -top-16 left-0 w-full text-center px-1">
                   {step.topAnnotation && (
                     <motion.div 
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       className="flex flex-col items-center"
                     >
                       <div className="text-[10px] text-slate-500 leading-tight mb-2 h-8 flex items-end justify-center w-32 mx-auto">
                         {step.topAnnotation}
                       </div>
                       <div className="w-px h-6 bg-slate-300"></div>
                       <div className={cn("w-2 h-2 rounded-full", isCompleted || isCurrent ? "bg-slate-400" : "bg-slate-200")}></div>
                     </motion.div>
                   )}
                </div>

                {/* Chevron Shape */}
                <div className="relative -mr-4 z-10 filter drop-shadow-sm">
                   {/* Hand-drawn circle for current step */}
                   {isCurrent && (
                     <svg className="absolute -top-4 -left-2 w-[115%] h-[140%] z-20 pointer-events-none text-sky-400" viewBox="0 0 100 100" preserveAspectRatio="none">
                       <motion.path
                         d="M10,50 Q20,5 50,10 Q90,5 95,50 Q90,95 50,90 Q10,95 10,50"
                         fill="none"
                         stroke="currentColor"
                         strokeWidth="2"
                         initial={{ pathLength: 0 }}
                         animate={{ pathLength: 1 }}
                         transition={{ duration: 1, ease: "easeInOut" }}
                       />
                     </svg>
                   )}

                   <div 
                     className={cn(
                       "h-16 w-44 flex items-center justify-center px-6 relative transition-colors duration-300",
                       bgClass
                     )}
                     style={{
                       clipPath: "polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%, 10% 50%)",
                       marginLeft: index === 0 ? 0 : undefined,
                       // Fix first item not having the left cut
                       ...(index === 0 ? { clipPath: "polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)" } : {})
                     }}
                   >
                     <span className={cn("text-xs uppercase text-center tracking-wide", textColor)}>
                       {step.title}
                     </span>
                   </div>
                </div>

                {/* Bottom Annotation */}
                <div className="absolute -bottom-24 left-0 w-full text-center px-1">
                   {step.bottomAnnotation && (
                     <motion.div 
                       initial={{ opacity: 0, y: -10 }}
                       animate={{ opacity: 1, y: 0 }}
                       className="flex flex-col items-center"
                     >
                       <div className={cn("w-2 h-2 rounded-full mb-1", isCompleted || isCurrent ? "bg-slate-400" : "bg-slate-200")}></div>
                       <div className="w-px h-8 bg-slate-300 mb-1"></div>
                       <div className="text-[10px] text-slate-500 leading-tight w-32 mx-auto">
                         {step.bottomAnnotation}
                       </div>
                     </motion.div>
                   )}
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
