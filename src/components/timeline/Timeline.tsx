import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '../../utils/cn';
import { TimelineStep } from '../../types';

interface TimelineProps {
  steps: TimelineStep[];
  onStepClick?: (step: TimelineStep) => void;
  onReorder?: (orderedStepIds: string[]) => void;
}

interface SortableStepProps {
  step: TimelineStep;
  index: number;
  onClick?: (step: TimelineStep) => void;
}

const SortableStep = ({ step, index, onClick }: SortableStepProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    cursor: 'grab',
  };

  const isCompleted = step.status === 'completed';
  const isCurrent = step.isCurrent;
  const isEarlyStage = index < 6;
  
  let bgClass = '';
  if (isCompleted) {
    bgClass = isEarlyStage ? 'bg-emerald-500 shadow-emerald-200' : 'bg-slate-700 shadow-slate-200';
  } else if (isCurrent) {
    bgClass = 'bg-blue-600 shadow-blue-200';
  } else {
    bgClass = 'bg-slate-100 border border-slate-200';
  }

  const textColor = isCurrent || isCompleted ? 'text-white font-semibold' : 'text-slate-500 font-medium';
  const subTextColor = isCurrent || isCompleted ? 'text-white/80' : 'text-slate-400';

  // Check if step is overdue
  const isOverdue = !isCompleted && step.completionForecast && new Date(step.completionForecast) < new Date();

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      onClick={() => onClick?.(step)}
      className="relative group flex flex-col items-center select-none"
    >
      {/* Top Annotation - Agency/Sector */}
      <div className="absolute -top-16 left-0 w-full text-center px-1">
         {(step.topAnnotation || step.responsibleAgency) && (
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="flex flex-col items-center"
           >
             <div className="text-[10px] text-slate-500 font-semibold leading-tight mb-2 h-8 flex items-end justify-center w-32 mx-auto uppercase tracking-wide">
               {step.responsibleAgency ? step.responsibleAgency : step.topAnnotation}
             </div>
             <div className="w-px h-6 bg-slate-300"></div>
             <div className={cn("w-2 h-2 rounded-full", isCompleted || isCurrent ? "bg-slate-400" : "bg-slate-200")}></div>
           </motion.div>
         )}
      </div>

      {/* Chevron Shape */}
      <div className="relative -mr-4 z-10 filter drop-shadow-sm hover:scale-105 transition-transform">
         {isCurrent && (
           <svg className="absolute -top-4 -left-2 w-[115%] h-[140%] z-20 pointer-events-none text-blue-400 opacity-50" viewBox="0 0 100 100" preserveAspectRatio="none">
             <motion.path
               d="M10,50 Q20,5 50,10 Q90,5 95,50 Q90,95 50,90 Q10,95 10,50"
               fill="none"
               stroke="currentColor"
               strokeWidth="1"
               initial={{ pathLength: 0 }}
               animate={{ pathLength: 1 }}
               transition={{ duration: 1, ease: "easeInOut" }}
             />
           </svg>
         )}

         <div 
           className={cn(
             "h-14 w-40 flex flex-col items-center justify-center px-4 relative transition-all duration-300 shadow-sm",
             bgClass
           )}
           style={{
             clipPath: "polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%, 10% 50%)",
             marginLeft: index === 0 ? 0 : undefined,
             ...(index === 0 ? { clipPath: "polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)" } : {})
           }}
         >
           <span className={cn("text-xs uppercase text-center tracking-wide leading-none", textColor)}>
             {step.title}
           </span>
           {step.completionForecast && (
             <span className={cn("text-[9px] mt-1 font-medium", isOverdue ? "text-red-500 bg-white/90 px-1 rounded" : subTextColor)}>
               {new Date(step.completionForecast).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
             </span>
           )}
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
};

export const Timeline: React.FC<TimelineProps> = ({ steps, onStepClick, onReorder }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentStepIndex = steps.findIndex(s => s.isCurrent);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && onReorder) {
      const oldIndex = steps.findIndex((s) => s.id === active.id);
      const newIndex = steps.findIndex((s) => s.id === over.id);
      const newSteps = arrayMove(steps, oldIndex, newIndex);
      onReorder(newSteps.map(s => s.id));
    }
  };

  useEffect(() => {
    if (scrollContainerRef.current && currentStepIndex !== -1) {
      const stepWidth = 180;
      const containerWidth = scrollContainerRef.current.offsetWidth;
      const scrollPos = (currentStepIndex * stepWidth) - (containerWidth / 2) + (stepWidth / 2);
      scrollContainerRef.current.scrollTo({ left: scrollPos, behavior: 'smooth' });
    }
  }, [currentStepIndex]);

  return (
    <div className="w-full relative py-20 overflow-hidden">
      <div 
        ref={scrollContainerRef}
        className="overflow-x-auto pb-8 hide-scrollbar px-4 sm:px-12"
      >
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={steps.map(s => s.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex items-center min-w-max">
              {steps.map((step, index) => (
                <SortableStep 
                  key={step.id} 
                  step={step} 
                  index={index} 
                  onClick={onStepClick}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};
