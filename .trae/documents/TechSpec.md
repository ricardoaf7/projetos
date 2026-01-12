# Technical Specifications - Executive Urban Dashboard

## 1. Architecture

* **SPA (Single Page Application):** Built with React and Vite.

* **State Management:** Local state + Context API (if needed) or Zustand (for simple global state). Given the scope, simple props/hooks might suffice, but we'll prepare for scalability.

* **Routing:** React Router DOM (v6+).

## 2. Directory Structure

```
src/
  assets/
  components/
    ui/           # Generic UI components (Card, Button, ProgressBar)
    dashboard/    # Dashboard specific components (ProjectCard)
    timeline/     # The complex Timeline component
  data/           # Mock data
  pages/          # Page components (Home, ProjectDetails)
  types/          # TypeScript definitions
  utils/          # Helper functions (classNames, dates)
  App.tsx
  main.tsx
```

## 3. Component Details

### 3.1. Timeline Component (`src/components/timeline/Timeline.tsx`)

* **Props:** `steps: TimelineStep[]`, `currentStepId: string`.

* **Logic:**

  * Render a horizontal list of "Chevron" items.

  * Use CSS Clip-path or SVG for the chevron shape to ensure perfect arrows.

  * **Styling:**

    * `clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%, 20px 50%)` (Approximation, needs tuning for the first item).

  * **Annotations:**

    * Render absolute positioned text above/below the steps based on the step data.

### 3.2. Project Card (`src/components/dashboard/ProjectCard.tsx`)

* **Style:** `backdrop-blur-md bg-white/30 border border-white/20 shadow-xl rounded-2xl`.

* **Animation:** `whileHover={{ scale: 1.02 }}` using Framer Motion.

## 4. Data Models (`src/types/index.ts`)

```typescript
export type ProjectStatus = 'completed' | 'in-progress' | 'pending';

export interface TimelineStep {
  id: string;
  title: string;
  status: ProjectStatus;
  topAnnotation?: string;
  bottomAnnotation?: string;
  isCurrent?: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  progress: number;
  imageUrl?: string;
  steps: TimelineStep[];
  currentStepDetails?: {
    responsible: string;
    deadline: string;
    notes: string;
  };
}
```

## 5. Styling Strategy (Tailwind)

* **Colors:**

  * `bg-slate-50` for the app background.

  * `emerald-500` for completed steps.

  * `sky-500` for current steps.

  * `slate-300` for future steps.

* **Fonts:** Inter (default in many Tailwind setups) or Roboto.

## 6. Mock Data

* Create `src/data/mockData.ts` exporting an array of `Project` objects.

