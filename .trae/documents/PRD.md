# Product Requirements Document (PRD) - Executive Urban Dashboard

## 1. Introduction
The Executive Urban Dashboard is a high-fidelity web application designed for the Mayor and executive stakeholders to visualize the status of strategic urban development projects. The primary goal is clarity, visual elegance, and immediate understanding of project progress.

## 2. User Persona
- **Primary User:** The Mayor.
- **Characteristics:** Highly visual, limited time, needs "at-a-glance" status updates.
- **Goal:** Quickly assess if a project is on track, delayed, or completed.

## 3. Design Philosophy
- **Style:** Premium Modern.
- **Key Elements:**
  - **Glassmorphism:** Frosted glass effects for cards and overlays.
  - **Minimalism:** High whitespace, clean typography (Inter/Roboto).
  - **Visual Hierarchy:** Colors used strictly for status (Green=Done, Blue=In Progress, Gray=Pending).
  - **Fluidity:** Smooth transitions and animations (Framer Motion).

## 4. Key Features

### 4.1. Dashboard (Home)
- **Grid Layout:** Display "Grand Projects" as cards.
- **Project Card:**
  - Title & Brief Description.
  - Overall Progress Bar (e.g., 65%).
  - Glassmorphism styling.
  - Hover effects and click transition to details.

### 4.2. Project Details (The Mayor's View)
- **Horizontal Timeline (Chevron Style):**
  - **Structure:** Sequential chevron steps (Demanda -> Instrução -> ...).
  - **Visuals:**
    - Completed: Solid color/filled.
    - Current: Highlighted (glow/pulse), bold text.
    - Future: Reduced opacity.
  - **Annotations:** Top and bottom text annotations for specific steps (dates, responsible parties).
  - **Responsiveness:** Horizontal scroll for smaller screens.
- **Current Step Details:** Section below timeline showing specific details of the active phase (Owner, Deadline, Notes).

## 5. Technical Stack
- **Frontend:** React (Vite), TypeScript.
- **Styling:** Tailwind CSS, clsx, tailwind-merge.
- **Icons:** Lucide React.
- **Animation:** Framer Motion.
- **Backend:** Supabase (Mocked data initially).

## 6. Implementation Priorities
1. **Visual Fidelity:** The Timeline must match the reference image logic.
2. **Smoothness:** Animations must be polished.
3. **Responsiveness:** Dashboard must be usable on tablets/desktops.
