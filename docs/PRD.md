# GoalDesk AI — Product Requirements Document

## 1. Product Overview

### Product Name

**GoalDesk AI**

### One-Sentence Pitch

GoalDesk AI is an AI-powered personal assistant for students that turns long-term goals into small daily tasks, schedules them around real obligations, and displays timely reminders on a Particle Argon-powered desktop device.

### Product Vision

Students often have many goals at the same time: learning a skill, completing schoolwork, building projects, preparing for internships, improving routines, and managing daily responsibilities. These goals can feel overwhelming because users usually do not know what small action to take today.

GoalDesk AI helps users move from vague goals to daily execution.

The product combines:

1. A web app where users add goals, obligations, preferences, and tasks.
2. An AI assistant that breaks big goals into smaller daily tasks.
3. A calendar scheduler that places tasks into realistic free time slots.
4. A focus mode that helps users complete tasks.
5. A physical IoT desktop device that shows reminders, focus timers, motivational messages, and next actions.

The product should feel like a calm, useful, everyday personal assistant rather than a stressful productivity tracker.

---

## 2. Target Users

### Primary User

College or high school students managing multiple responsibilities.

Examples:

* Engineering students
* Computer science students
* Self-learners
* Students preparing for internships
* Students balancing classes, assignments, projects, fitness, and personal routines

### Secondary Users

* Makers
* Developers
* Busy professionals
* People trying to build better daily habits
* People who prefer physical reminders instead of phone notifications

---

## 3. Core Problem

Students set goals such as:

* “Learn AI engineering in 3 months.”
* “Finish my robotics project by next month.”
* “Prepare for internship interviews.”
* “Complete all school assignments this week.”
* “Build a healthier routine.”
* “Study circuits every day before the exam.”

But they struggle because:

* Big goals feel overwhelming.
* They do not know what to do first.
* They underestimate how much time tasks require.
* Their calendar is already full of classes, work, and obligations.
* Normal to-do apps require too much manual planning.
* Phone notifications are easy to ignore or become distracting.
* Missed tasks often cause users to give up instead of adapting.

GoalDesk AI solves this by converting goals into small, scheduled, daily actions.

---

## 4. Core Value Proposition

GoalDesk AI helps users answer the question:

> “What should I do next, given my goals, deadlines, schedule, and available time?”

The app should:

1. Break big goals into small daily tasks.
2. Schedule those tasks into realistic free time.
3. Adapt when the user adds new goals or obligations.
4. Help users work through tasks using focus mode.
5. Use IoT hardware as a low-distraction reminder system.
6. Learn user preferences over time in future versions.

---

## 5. MVP Version Scope

### MVP Name

**GoalDesk AI v0**

### MVP Goal

The MVP should prove the following end-to-end workflow:

1. User creates a goal.
2. AI or mock AI breaks the goal into smaller tasks.
3. User adds fixed obligations such as class blocks.
4. Scheduler places tasks into available time slots.
5. User views scheduled tasks in the web app.
6. User starts a task in focus mode.
7. User marks the task complete.
8. Backend sends current or next task to the Particle Argon.
9. LCD displays the task/reminder message.

### MVP Strategy

Build the system as a full-stack vertical slice.

The MVP should not be feature-complete. It should be simple but complete enough to demonstrate the full product loop.

---

## 6. MVP In Scope

### 6.1 Web App

The MVP web app should include:

* Dashboard page
* Goals page
* Tasks page
* Calendar/availability page
* Focus mode page
* Device page
* Settings page

The web app should be responsive so it works reasonably on desktop and mobile browser.

A native mobile app is not required for MVP.

#### Technology Stack

* Framework: Next.js (App Router) — used as a fullstack framework for both the frontend UI and backend API routes
* Language: TypeScript
* Styling: Tailwind CSS v4 + shadcn/ui component library
* Database: SQLite (file-based, zero setup for MVP)
* ORM: Prisma with SQLite driver
* Authentication: Hardcoded demo user (user ID 1, seeded on first run). No real authentication for MVP.
* AI: Mock planner first, OpenAI API (GPT-4o-mini) later

#### Navigation

The app should use a sidebar navigation pattern with icons and labels on desktop (similar to Linear or Raycast). On mobile screens, the navigation should switch to a bottom tab bar with icons only. The Settings page can be accessed from the sidebar on desktop or from the bottom bar / a gear icon on mobile.

#### Design Direction

The visual design should be dark-mode-first with a calm aesthetic: subtle gradients, soft glows, and muted accent colors. The feel should match the product vision of a calm personal assistant rather than a stressful productivity tracker.

---

### 6.2 Goal Creation

Users should be able to create goals.

Each goal should include:

* Goal title
* Goal category
* Description
* Deadline
* Priority
* Preferred time of day
* Estimated daily time commitment
* Status

Example goal:

```text
Title: Learn AI engineering
Category: Learning
Deadline: 2026-09-01
Priority: High
Preferred time: Evening
Daily time commitment: 45 minutes
```

Goal categories for MVP:

* Learning
* School
* Career
* Project
* Wellness
* Personal
* Other

Goal priorities:

* Low
* Medium
* High

Goal statuses:

* Active
* Paused
* Completed
* Archived

---

### 6.3 AI Goal Breakdown

When a user creates a goal, the system should generate small daily tasks.

Each generation call should produce **7 days' worth of tasks** (one task per day), matching the 7-day scheduling window. The user can generate additional batches of tasks later as needed.

For MVP, this can be implemented in two stages:

#### Stage 1: Mock AI Planner

Use a deterministic mock planner that generates simple tasks without calling a real AI API. The mock planner should be used through all development phases until the Real AI Planner phase.

The mock planner should generate 7 tasks based on the goal's category. Each task's estimated duration should not exceed the goal's daily time commitment.

Example:

Goal: "Learn AI engineering" (category: Learning, daily minutes: 45)

Generated tasks (7 days' worth):

```text
1. Create a learning roadmap for AI engineering. (30 min)
2. Study Python basics. (45 min)
3. Watch an introduction to machine learning. (30 min)
4. Take notes on supervised vs unsupervised learning. (30 min)
5. Complete one small Python exercise. (45 min)
6. Read about neural network fundamentals. (30 min)
7. Review and summarize what you learned this week. (30 min)
```

#### Stage 2: Real AI Planner

Replace the mock planner with an OpenAI API call (GPT-4o-mini). The system should support a toggle via environment variable (`USE_AI_PLANNER=true|false`) to switch between mock and real planner. If the AI call fails or returns invalid data, the system should fall back to the mock planner gracefully.

The AI should return structured JSON, not plain text.

Required AI output format:

```json
[
  {
    "title": "Study Python functions",
    "description": "Review function syntax and write two small examples.",
    "estimated_minutes": 30,
    "goal_id": 1,
    "preferred_time_of_day": "evening",
    "priority": "medium"
  }
]
```

The backend must validate AI output before saving it.

Validation rules:

* Task title must exist.
* Estimated minutes must be positive.
* Estimated minutes must not exceed the user’s daily time commitment for that goal.
* Empty or vague tasks should be rejected or rewritten.
* The system should not save malformed AI output directly.

---

### 6.4 Obligatory Time Blocks

Users should be able to block off unavailable time.

Examples:

* Class
* Work
* Meeting
* Appointment
* Sleep
* Commute
* Meal
* Club activity
* Other obligation

Each calendar block should include:

* Title
* Block type
* Start time
* End time
* Recurrence type
* Hard block status

For MVP, recurrence can be simple:

* None
* Weekly

Example:

```text
Title: Circuits Class
Type: Class
Start: Monday 10:00 AM
End: Monday 11:15 AM
Recurrence: Weekly
Hard block: Yes
```

Hard blocks cannot be moved by the scheduler.

---

### 6.5 Task Scheduling

The scheduler should place tasks into available time slots across a **rolling 7-day window** (today through 6 days ahead). This allows the user to plan ahead and prioritize goals on a per-day basis.

When the user clicks "Schedule Tasks," the scheduler processes all unscheduled tasks and attempts to place them across the next 7 days.

MVP scheduling rules:

1. Get all unscheduled tasks.
2. Get all hard calendar blocks (including weekly recurring blocks expanded across the 7-day window).
3. Get all existing scheduled tasks in the 7-day window.
4. For each day in the 7-day window, find free time slots within the daily planning range.
5. Schedule tasks into free slots.
6. Avoid conflicts with hard blocks and already-scheduled tasks.
7. Prefer the goal's preferred time of day when possible.
8. Schedule higher-priority tasks first, then tasks with earlier deadlines.
9. Leave tasks unscheduled if there is not enough free time across the entire 7-day window.

The daily planning range is customizable per user via the Settings page.

Default daily planning range (used if the user has not changed it):

```text
9:00 AM to 10:00 PM
```

The user can change these values in Settings. For example, a night owl might set their planning range to 12:00 PM – 2:00 AM, while an early riser might set it to 6:00 AM – 8:00 PM.

The scheduler must read the user's planning range from their settings before scheduling.

Preferred time mappings:

```text
Morning: 8:00 AM - 12:00 PM
Afternoon: 12:00 PM - 5:00 PM
Evening: 5:00 PM - 9:00 PM
Night: 8:00 PM - 12:00 AM
Flexible: any free slot
```

If there is not enough time, the app should show a message such as:

```text
5 tasks were scheduled across the next 7 days. 2 tasks could not be scheduled because there was not enough free time. Try reducing task duration, moving low-priority tasks, or extending the deadline.
```

---

### 6.6 Task Management

Users should be able to:

* View tasks
* Generate tasks from a goal
* Schedule tasks
* Start a task in focus mode
* Mark a task complete
* Skip a task
* Move a task to another time slot
* View task status

Task statuses:

* Unscheduled
* Scheduled
* In Progress
* Completed
* Skipped

Each task should include:

* Title
* Description
* Goal reference
* Estimated minutes
* Scheduled start
* Scheduled end
* Status
* Priority
* Created timestamp

---

### 6.7 Manual Task Movement

Users should be able to move scheduled tasks to a different time.

For MVP, this can be a simple edit form instead of drag-and-drop.

Example user flow:

1. User clicks a task.
2. User selects “Move Task.”
3. User enters new start time and end time.
4. Backend checks for conflicts.
5. If no conflict exists, task is updated.
6. If conflict exists, app shows an error.

Conflict example:

```text
This task overlaps with Circuits Class from 10:00 AM to 11:15 AM.
```

Later versions can add drag-and-drop calendar movement.

---

### 6.8 Focus Mode

Users should be able to start a focus session for a specific task.

MVP focus mode should include:

* Selected task title
* Timer duration
* Start button
* Pause button
* Complete button
* Cancel button

When focus mode starts:

* Task status becomes `In Progress`.
* A focus session record is created.
* Hardware can display focus message.

Example LCD message:

```text
Focus: 25 min
Study Python
```

When focus mode completes:

* Task can be marked complete.
* Focus session stores actual duration.
* Hardware displays a completion message.

Example LCD message:

```text
Nice work
Task complete
```

MVP check-in behavior:

* App can show a simple message halfway through the focus session.
* Hardware check-ins are optional for MVP.

Future check-in behavior:

* Hardware asks “Still focused?”
* User presses button to confirm.
* Missed check-ins can be logged.

---

### 6.9 IoT Hardware Display

The MVP hardware device uses:

* Particle Argon
* 16x2 I2C LCD
* One push button
* Optional LED

The hardware should display short messages from the backend.

LCD constraints:

* 2 lines
* 16 characters per line

All backend messages must be formatted before being sent to hardware.

Example messages:

```text
Next Task:
Study Python
```

```text
Focus: 25 min
AI Basics
```

```text
Reminder:
Class at 10
```

```text
Tiny Step:
Read 5 pages
```

```text
Great job!
Task complete
```

The hardware should not run AI logic. The hardware only:

1. Connects to Wi-Fi.
2. Displays messages.
3. Sends button events.
4. Shows basic state.

---

### 6.10 Hardware Button

MVP button behavior:

* Short press: cycle display screens.
* Long press: send event to backend.

Possible screens:

1. Current task
2. Next task
3. Focus status
4. Motivational message
5. Device status

Button events sent to backend:

```json
{
  "event_type": "button_press",
  "press_type": "short",
  "device_id": "particle_device_id",
  "timestamp": "..."
}
```

For MVP, the backend can simply log the button event.

Later versions can use button events to:

* Mark task complete
* Start focus mode
* Pause focus mode
* Ask AI for next task
* Snooze reminder

---

### 6.11 Device Page

The web app should include a Device page.

MVP device page should show:

* Device name
* Particle device ID
* Device status
* Last message sent
* Button to send test message
* Button to send next task
* Preview of LCD line 1 and line 2

For MVP, device pairing can be manual through environment variables.

Later versions can add real device pairing.

---

## 7. MVP Out of Scope

The MVP should not include:

* Native iOS app
* Native Android app
* Full production authentication
* Payment system
* Multi-user production system
* Canvas integration
* Google Calendar integration
* Push notifications
* Voice assistant
* Advanced learning/personalization model
* 3D-printed enclosure
* Complex drag-and-drop calendar
* Social features
* Team collaboration
* Wearable integration
* Medical, diet, or clinical health advice

---

## 8. Future Features

### 8.1 User Accounts and Authentication

Future versions should support:

* Sign up
* Login
* Password reset
* OAuth login
* Multiple users
* User-specific goals/tasks/devices

For MVP, a demo user can be used.

---

### 8.2 Smart Device Pairing

Future device pairing flow:

1. Device boots in pairing mode.
2. Device displays a six-digit code.
3. User enters code in web app.
4. Backend links Particle device to user account.
5. Device confirms pairing on LCD.

Example LCD:

```text
Pair Code:
482913
```

---

### 8.3 Adaptive Preference Learning

The system should learn from user behavior over time.

Examples:

* User completes coding tasks more often at night.
* User often skips 60-minute tasks.
* User prefers 25-minute focus sessions.
* User completes wellness tasks more often in the morning.
* User frequently moves schoolwork to afternoons.

Future AI suggestions:

```text
You usually complete coding tasks after 8 PM. Should I schedule programming tasks at night by default?
```

```text
You often skip 60-minute tasks. I can split future tasks into 25-minute sessions.
```

---

### 8.4 Automatic Rescheduling

When a user skips or misses a task, the app should help reschedule it.

Possible behavior:

```text
You missed “Study Python basics.” Would you like to move it to tomorrow or split it into two smaller tasks?
```

---

### 8.5 Calendar Integrations

Future integrations:

* Google Calendar
* Apple Calendar
* Outlook Calendar

Purpose:

* Import existing obligations.
* Avoid scheduling conflicts.
* Sync planned tasks to external calendar.

---

### 8.6 Canvas / LMS Integration

For students, future versions can import:

* Assignments
* Due dates
* Exams
* Course events

The AI can then schedule study sessions and assignment work automatically.

---

### 8.7 Push Notifications

Future versions should support:

* Browser notifications
* Mobile PWA notifications
* Email reminders
* SMS reminders if needed

---

### 8.8 Weekly AI Review

The AI can generate a weekly summary:

```text
This week you completed 8 out of 12 planned tasks. You were most consistent at night. Next week, I recommend shorter morning tasks and longer evening study blocks.
```

---

### 8.9 Better Hardware

Future hardware improvements:

* 3D-printed enclosure
* RGB LED status indicator
* Multiple buttons
* Rotary encoder
* Buzzer
* OLED display
* Battery power
* Desk presence sensor
* Touch controls

---

### 8.10 Technical Debt & Refactoring

Once the backend and other core MVP features are fully set, the following technical debt should be addressed:
* **ESLint Strict Rules**: Re-enable strict rules in `eslint.config.mjs` (such as `@typescript-eslint/no-explicit-any`, `react-hooks/exhaustive-deps`, and `react-hooks/set-state-in-effect`).
* **Strict Typing**: Strictly type out all Next.js components to pass the linter. Remove any `any` types used during rapid MVP development.

---

## 9. User Workflows

### 9.1 New User Onboarding Workflow

#### Goal

Help user set up their assistant.

#### Steps

1. User opens web app.
2. User sees welcome screen.
3. User creates or uses demo profile.
4. User adds basic availability.
5. User adds first goal.
6. AI generates small tasks.
7. User reviews generated tasks.
8. User schedules tasks.
9. User optionally connects hardware.
10. Dashboard shows today’s plan.

#### MVP Simplification

For MVP, skip real authentication and use a demo user.

---

### 9.2 Add Goal Workflow

#### Goal

User creates a long-term goal.

#### Steps

1. User goes to Goals page.
2. User clicks “Add Goal.”
3. User enters:

   * Title
   * Category
   * Deadline
   * Priority
   * Preferred time
   * Daily minutes
4. User clicks “Create Goal.”
5. Backend saves goal.
6. User clicks “Generate Tasks.”
7. AI planner generates micro-tasks.
8. Tasks are saved as unscheduled tasks.
9. User sees generated tasks.

#### Acceptance Criteria

* Goal is saved.
* Goal appears in goal list.
* Generated tasks are connected to the goal.
* Generated tasks have estimated durations.
* Generated tasks are actionable and not vague.

---

### 9.3 Add Obligation Workflow

#### Goal

User blocks off unavailable time.

#### Steps

1. User goes to Calendar/Availability page.
2. User clicks “Add Block.”
3. User enters:

   * Title
   * Type
   * Start time
   * End time
   * Recurrence
4. User saves block.
5. Backend stores block.
6. Scheduler treats block as unavailable.

#### Acceptance Criteria

* Calendar block is saved.
* Calendar block appears in list.
* Scheduler does not place tasks during the block.

---

### 9.4 Schedule Tasks Workflow

#### Goal

Place unscheduled tasks into free time.

#### Steps

1. User goes to Tasks page.
2. User clicks “Schedule Tasks.”
3. Backend gets unscheduled tasks.
4. Backend gets calendar blocks.
5. Scheduler finds free time slots.
6. Scheduler places tasks.
7. Scheduled tasks appear with start and end times.

#### Acceptance Criteria

* Tasks are not scheduled during hard blocks.
* Higher-priority tasks are scheduled first.
* Tasks have scheduled start and end times.
* Tasks remain unscheduled if no valid slot exists.

---

### 9.5 Move Task Workflow

#### Goal

Allow user to adjust schedule manually.

#### Steps

1. User selects a scheduled task.
2. User clicks “Move.”
3. User enters new time.
4. Backend validates conflicts.
5. If valid, task time is updated.
6. If invalid, error message is shown.

#### Acceptance Criteria

* Task can be moved to a free slot.
* Task cannot be moved into a hard block.
* Updated task appears correctly.

---

### 9.6 Focus Mode Workflow

#### Goal

Help user complete a scheduled task.

#### Steps

1. User selects a task.
2. User clicks “Start Focus.”
3. Timer starts.
4. Task status becomes `In Progress`.
5. Hardware displays focus message.
6. User completes timer or manually clicks complete.
7. Task status becomes `Completed`.
8. Focus session is saved.
9. Hardware displays completion message.

#### Acceptance Criteria

* Focus timer starts.
* Task status updates.
* Completion is saved.
* Hardware message can be generated.

---

### 9.7 Send Task to Hardware Workflow

#### Goal

Display current/next task on IoT device.

#### Steps

1. User opens Device page.
2. User clicks “Send Next Task.”
3. Backend finds next scheduled task.
4. Backend formats LCD message.
5. Backend sends message to Particle Cloud.
6. Particle Argon receives message.
7. LCD updates.

#### Acceptance Criteria

* Backend returns a two-line LCD message.
* Each line is 16 characters or fewer.
* Particle Cloud function is called.
* LCD displays correct message.

---

### 9.8 Hardware Button Event Workflow

#### Goal

Let hardware send simple input back to backend.

#### Steps

1. User presses hardware button.
2. Particle Argon detects press.
3. Argon publishes event to Particle Cloud.
4. Particle webhook forwards event to backend.
5. Backend logs event.
6. Device page displays latest event.

#### Acceptance Criteria

* Button press is detected.
* Event reaches backend.
* Event is stored or logged.
* App can display latest event.

---

## 10. Key App Pages

### 10.1 Dashboard Page

Purpose:

Give the user a quick overview of their day.

Should show:

* Today’s tasks
* Next scheduled task
* Active goal
* Focus session status
* Device status
* Quick action buttons

Quick actions:

* Add goal
* Generate tasks
* Schedule tasks
* Start focus
* Send next task to device

---

### 10.2 Goals Page

Purpose:

Manage long-term goals.

Should show:

* Goal list
* Goal title
* Category
* Deadline
* Priority
* Status
* Daily minutes
* Preferred time

Actions:

* Create goal
* View goal details
* Generate tasks
* Pause goal
* Complete goal
* Archive goal

MVP required actions:

* Create goal
* List goals
* Generate tasks

---

### 10.3 Tasks Page

Purpose:

Manage daily tasks.

Should show:

* Task title
* Related goal
* Estimated duration
* Scheduled time
* Status
* Priority

Actions:

* Schedule tasks
* Start focus
* Complete task
* Skip task
* Move task
* Send task to device

---

### 10.4 Calendar / Availability Page

Purpose:

Manage obligations and blocked time.

Should show:

* List of calendar blocks
* Block type
* Start time
* End time
* Recurrence

Actions:

* Add block
* Edit block
* Delete block

MVP required actions:

* Add block
* List blocks

---

### 10.5 Focus Mode Page

Purpose:

Provide a distraction-light work mode.

Should show:

* Current task
* Timer
* Start/pause/cancel/complete controls
* Optional motivational message

MVP required actions:

* Start timer
* Complete task

---

### 10.6 Device Page

Purpose:

Manage Particle Argon device.

Should show:

* Device status
* Last message
* LCD preview
* Last button event

Actions:

* Send test message
* Send next task
* Preview next task
* View device logs

MVP required actions:

* Preview next task LCD message
* Send test message
* Send next task to hardware

### 10.7 Settings Page

Purpose:

Allow the user to customize their scheduling preferences.

Should show:

* Daily planning range start time
* Daily planning range end time
* Save button

MVP required actions:

* View current settings
* Update planning range

Future settings:

* Preferred focus session duration
* Default task priority
* Notification preferences
* Theme preferences

---

## 11. Functional Requirements

### Goal Requirements

| ID          | Requirement                            | Priority    |
| ----------- | -------------------------------------- | ----------- |
| FR-GOAL-001 | User can create a goal                 | High        |
| FR-GOAL-002 | User can list goals                    | High        |
| FR-GOAL-003 | User can generate tasks from a goal    | High        |
| FR-GOAL-004 | User can pause/archive/complete a goal | Low for MVP |

### Task Requirements

| ID          | Requirement                         | Priority |
| ----------- | ----------------------------------- | -------- |
| FR-TASK-001 | User can list tasks                 | High     |
| FR-TASK-002 | User can schedule tasks             | High     |
| FR-TASK-003 | User can complete tasks             | High     |
| FR-TASK-004 | User can skip tasks                 | Medium   |
| FR-TASK-005 | User can move tasks                 | Medium   |
| FR-TASK-006 | User can start focus mode from task | High     |

### Calendar Requirements

| ID         | Requirement                          | Priority |
| ---------- | ------------------------------------ | -------- |
| FR-CAL-001 | User can add hard calendar blocks    | High     |
| FR-CAL-002 | Scheduler avoids hard blocks         | High     |
| FR-CAL-003 | User can add weekly recurring blocks | Medium   |
| FR-CAL-004 | User can edit/delete blocks          | Medium   |

### Settings Requirements

| ID           | Requirement                                  | Priority |
| ------------ | -------------------------------------------- | -------- |
| FR-SET-001   | User can view current settings               | High     |
| FR-SET-002   | User can update daily planning range         | High     |
| FR-SET-003   | Settings are used by scheduler               | High     |

### AI Requirements

| ID        | Requirement                               | Priority |
| --------- | ----------------------------------------- | -------- |
| FR-AI-001 | AI generates micro-tasks from goal        | High     |
| FR-AI-002 | AI output is validated before saving      | High     |
| FR-AI-003 | AI can generate motivational LCD messages | Medium   |
| FR-AI-004 | AI learns user preferences over time      | Future   |

### Hardware Requirements

| ID        | Requirement                       | Priority |
| --------- | --------------------------------- | -------- |
| FR-HW-001 | Argon displays LCD message        | High     |
| FR-HW-002 | Backend can send message to Argon | High     |
| FR-HW-003 | Argon button can publish event    | Medium   |
| FR-HW-004 | Hardware can show focus timer     | Medium   |
| FR-HW-005 | Hardware can mark task complete   | Future   |

---

## 12. Non-Functional Requirements

| ID      | Requirement          | Description                                                        |
| ------- | -------------------- | ------------------------------------------------------------------ |
| NFR-001 | Simplicity           | MVP should be understandable for a beginner developer.             |
| NFR-002 | Modularity           | Backend, frontend, firmware, and hardware docs should be separate. |
| NFR-003 | Security             | API keys must never be committed to GitHub.                        |
| NFR-004 | Data privacy         | User goals and tasks should be treated as private.                 |
| NFR-005 | Reliability          | Scheduler should avoid obvious time conflicts.                     |
| NFR-006 | Hardware constraints | LCD messages must fit 16x2 format.                                 |
| NFR-007 | Recoverability       | Device should display a safe default message if backend fails.     |
| NFR-008 | Testability          | Each core feature should have a manual or automated test.          |
| NFR-009 | Documentation        | Every phase should include clear README or docs updates.           |

---

## 13. Technical Architecture

### MVP Architecture

The MVP uses Next.js as a fullstack framework. Both the frontend UI and backend API routes live in a single Next.js application. There is no separate backend service.

```text
Next.js App (Fullstack)
App Router + TypeScript + Tailwind v4 + shadcn/ui
  ├── Frontend Pages (React Server Components + Client Components)
  └── Backend API Routes (app/api/)
        ↓
Prisma ORM
        ↓
SQLite Database (file-based)
        ↓
AI Planner
Mock planner first, OpenAI GPT-4o-mini later
        ↓
Scheduling Engine
Rule-based scheduling (7-day rolling window)
        ↓
Particle Cloud Service
Backend sends LCD messages via Particle Cloud API
        ↓
Particle Argon Firmware
16x2 I2C LCD + push button
```

### Recommended Repository Structure

```text
GoalDesk_AI/
│
├── README.md
├── .gitignore
│
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── API_SPEC.md
│   ├── DATABASE_SCHEMA.md
│   ├── TEST_PLAN.md
│   └── HARDWARE_NOTES.md
│
├── frontend/
│   └── goaldesk-web/            ← Next.js fullstack app
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx          ← Dashboard
│       │   ├── goals/
│       │   ├── tasks/
│       │   ├── calendar/
│       │   ├── focus/
│       │   ├── device/
│       │   └── api/              ← API route handlers
│       │       ├── goals/
│       │       ├── tasks/
│       │       ├── calendar-blocks/
│       │       ├── focus/
│       │       └── device/
│       ├── components/
│       ├── lib/
│       │   ├── db.ts             ← Prisma client
│       │   ├── scheduler.ts      ← Scheduling engine
│       │   ├── mock-planner.ts
│       │   ├── ai-planner.ts     ← Real AI (Phase 4)
│       │   ├── lcd-formatter.ts
│       │   └── particle.ts       ← Particle Cloud service
│       ├── prisma/
│       │   └── schema.prisma
│       ├── __tests__/
│       ├── .env.local
│       ├── .env.example
│       └── package.json
│
├── firmware/
│   └── particle-argon/
│       ├── src/
│       │   └── goaldesk.ino
│       ├── wiring/
│       │   └── WIRING_GUIDE.md
│       └── README.md
│
├── hardware/
│   ├── BOM.md
│   ├── photos/
│   └── wiring/
│
└── demo/
    ├── screenshots/
    └── demo-script.md
```

---

## 14. Backend API Requirements

### Goals

```text
POST /goals
GET /goals
GET /goals/{goal_id}
PATCH /goals/{goal_id}
POST /goals/{goal_id}/generate-tasks
```

### Tasks

```text
GET /tasks
GET /tasks/{task_id}
PATCH /tasks/{task_id}
PATCH /tasks/{task_id}/complete
PATCH /tasks/{task_id}/skip
PATCH /tasks/{task_id}/move
POST /tasks/schedule
```

### Calendar Blocks

```text
POST /calendar-blocks
GET /calendar-blocks
PATCH /calendar-blocks/{block_id}
DELETE /calendar-blocks/{block_id}
```

### Focus Sessions

```text
POST /focus/start
POST /focus/{session_id}/pause
POST /focus/{session_id}/complete
GET /focus/sessions
```

### Device

```text
GET /device/status
POST /device/test-message
POST /device/preview-next-task
POST /device/send-next-task
POST /device/webhook
```

### Settings

```text
GET /settings
PATCH /settings
```

---

## 15. Data Model

### User

For MVP, use a demo user.

```text
id
name
email
planning_range_start
planning_range_end
created_at
```

Default values for planning range:

```text
planning_range_start: "09:00" (9:00 AM)
planning_range_end: "22:00" (10:00 PM)
```

These values are stored as time-of-day strings and used by the scheduler to determine the daily window for placing tasks.

### Goal

```text
id
user_id
title
category
description
deadline
priority
preferred_time_of_day
daily_minutes
status
created_at
updated_at
```

### Task

```text
id
user_id
goal_id
title
description
estimated_minutes
scheduled_start
scheduled_end
priority
status
is_ai_generated
is_user_moved
created_at
updated_at
```

### CalendarBlock

```text
id
user_id
title
block_type
start_time
end_time
recurrence
is_hard_block
created_at
updated_at
```

### FocusSession

```text
id
user_id
task_id
started_at
ended_at
planned_minutes
actual_minutes
status
created_at
```

### Device

```text
id
user_id
particle_device_id
name
status
last_seen
created_at
```

### DeviceMessage

```text
id
device_id
line1
line2
message_type
status
sent_at
created_at
```

### DeviceEvent

```text
id
device_id
event_type
payload
received_at
```

---

## 16. AI Planner Requirements

### AI Planner Input

The planner should receive:

```json
{
  "goal": {
    "title": "Learn AI engineering",
    "description": "I want to learn enough to build AI apps.",
    "deadline": "2026-09-01",
    "priority": "high",
    "preferred_time_of_day": "evening",
    "daily_minutes": 45
  },
  "user_context": {
    "current_date": "2026-06-23",
    "existing_tasks": [],
    "calendar_blocks": []
  }
}
```

### AI Planner Output

```json
[
  {
    "title": "Watch intro to machine learning",
    "description": "Watch a beginner-friendly video and write five bullet notes.",
    "estimated_minutes": 30,
    "priority": "medium",
    "preferred_time_of_day": "evening"
  }
]
```

### Prompt Requirements

The AI prompt should instruct the model to:

* Create small, specific tasks.
* Avoid vague tasks.
* Respect daily time limit.
* Keep tasks beginner-friendly.
* Return JSON only.
* Avoid unsafe advice.
* For wellness goals, focus on general healthy habits, not extreme plans.

### Wellness/Health Guardrail

For fitness or body-related goals, the assistant should provide general habit-based suggestions only.

Allowed examples:

* Take a 10-minute walk.
* Do a beginner workout.
* Stretch for 5 minutes.
* Drink water.
* Plan a balanced meal.
* Sleep on time.

Disallowed examples:

* Extreme dieting.
* Excessive exercise.
* Unsafe weight loss promises.
* Medical or clinical advice.

If a goal seems aggressive or health-sensitive, the assistant should suggest safer habit-based steps and recommend professional guidance for medical decisions.

---

## 17. Scheduling Rules

### Scheduling Inputs

The scheduler should use:

* Tasks
* Task duration
* Task priority
* Goal deadline
* Preferred time of day
* Calendar blocks
* Existing scheduled tasks

### Scheduling Output

Each scheduled task should receive:

* scheduled_start
* scheduled_end
* status = Scheduled

### Conflict Rules

A task cannot overlap with:

* Hard calendar blocks
* Other scheduled tasks
* Focus sessions already in progress

### Priority Rules

Scheduling order:

1. High-priority tasks
2. Tasks with earlier deadlines
3. Tasks matching preferred time of day
4. Shorter tasks that fit available time

### Overload Behavior

If there is not enough free time:

* Do not force tasks into invalid slots.
* Leave extra tasks unscheduled.
* Return a message explaining the issue.

Example:

```text
3 tasks were scheduled. 2 tasks could not be scheduled because there was not enough free time.
```

---

## 18. LCD Formatting Rules

All hardware messages must fit the LCD.

Rules:

* Line 1 maximum: 16 characters
* Line 2 maximum: 16 characters
* Do not send long raw AI output to the device.
* Backend must format messages before sending.
* Use clear short phrases.

Examples:

| Use Case   | Line 1        | Line 2        |
| ---------- | ------------- | ------------- |
| Next task  | Next Task:    | Study Python  |
| Focus      | Focus: 25 min | AI Basics     |
| Reminder   | Reminder:     | Class at 10   |
| Motivation | Tiny step now | Big win later |
| Complete   | Nice work!    | Task complete |

---

## 19. Hardware/Firmware Requirements

### Firmware Responsibilities

The Particle Argon firmware should:

1. Connect to Wi-Fi.
2. Connect to Particle Cloud.
3. Initialize LCD.
4. Display boot message.
5. Register cloud function for display updates.
6. Parse incoming display messages.
7. Update LCD.
8. Detect button presses.
9. Publish button events.

### Cloud Function

Firmware should expose a cloud function:

```text
setDisplay
```

Expected argument format:

```text
line1|line2
```

Example:

```text
Next Task:|Study Python
```

### Published Events

Firmware should publish events such as:

```text
goaldesk/button
goaldesk/status
```

Example payload:

```json
{
  "press_type": "short",
  "timestamp": "..."
}
```

---

## 20. Testing Requirements

### Backend Tests

Required:

* Root endpoint works.
* Goal creation works.
* Goal listing works.
* Task generation works.
* Task scheduling avoids hard blocks.
* Task completion works.
* LCD formatter limits lines to 16 characters.
* Device preview endpoint returns two LCD-safe lines.

### Frontend Manual Tests

Required:

* User can create goal.
* User can list goals.
* User can generate tasks.
* User can schedule tasks.
* User can complete tasks.
* User can start focus timer.
* User can preview hardware message.

### Hardware Tests

Required:

* Argon powers on.
* Argon connects to Particle Cloud.
* LCD displays boot message.
* Cloud function updates LCD.
* Button press is detected.
* Button event is published.

### End-to-End Test

The MVP passes when:

1. Backend is running.
2. Frontend is running.
3. User creates goal.
4. User generates tasks.
5. User adds class block.
6. Scheduler places tasks outside class time.
7. User starts focus mode.
8. User completes task.
9. Backend previews next task message.
10. Backend sends message to Particle Argon.
11. LCD displays correct message.

---

## 21. Development Phases

The project is structured into 4 main phases. Phase 1 is split into 7 sub-phases (1A–1G) so each backend feature can be tested individually before moving on. Each sub-phase and phase should end with a verification step (automated tests for backend, manual test checklists for frontend and hardware).

### Phase 1: Backend + Database

This phase builds all API routes and business logic inside the Next.js app using App Router API route handlers.

#### Phase 1A: Project Setup + Prisma Schema + Demo User

Deliverables:

* Initialize Next.js app in frontend/goaldesk-web/ with TypeScript, Tailwind v4, App Router
* Install and configure Prisma with SQLite
* Create full Prisma schema (all models, including planning range fields on User)
* Seed script that creates a demo user (id=1) with default planning range (9:00 AM – 10:00 PM)
* Create .env.example and .gitignore
* Root API health check: GET /api/health
* Settings API: GET /api/settings, PATCH /api/settings (read/update planning range)
* Set up top-level repo structure (docs/, firmware/, hardware/, demo/)

#### Phase 1B: Goal CRUD API Routes

Deliverables:

* POST /api/goals — create goal
* GET /api/goals — list goals
* GET /api/goals/[id] — single goal
* PATCH /api/goals/[id] — update goal

#### Phase 1C: Mock AI Task Generation + Task CRUD

Deliverables:

* Mock planner function in lib/mock-planner.ts
* POST /api/goals/[id]/generate-tasks — generates 7 days of tasks
* GET /api/tasks — list tasks (filter by goalId, status)
* GET /api/tasks/[id] — single task
* PATCH /api/tasks/[id] — update task
* PATCH /api/tasks/[id]/complete — mark complete
* PATCH /api/tasks/[id]/skip — mark skipped

#### Phase 1D: Calendar Block CRUD

Deliverables:

* POST /api/calendar-blocks — create block
* GET /api/calendar-blocks — list blocks
* PATCH /api/calendar-blocks/[id] — update block
* DELETE /api/calendar-blocks/[id] — delete block

#### Phase 1E: Scheduling Engine

Deliverables:

* Scheduling engine in lib/scheduler.ts
* POST /api/tasks/schedule — runs scheduler across 7-day rolling window
* Conflict avoidance, priority sorting, preferred time matching
* Overload messaging for unscheduled tasks

#### Phase 1F: Focus Session API

Deliverables:

* POST /api/focus/start — create session, set task to InProgress
* POST /api/focus/[id]/pause — pause session
* POST /api/focus/[id]/complete — complete session
* GET /api/focus/sessions — list sessions

#### Phase 1G: Device / LCD Formatter API

Deliverables:

* LCD formatter in lib/lcd-formatter.ts
* Mock Particle service in lib/particle.ts
* GET /api/device/status
* POST /api/device/test-message
* POST /api/device/preview-next-task
* POST /api/device/send-next-task (mocked)
* POST /api/device/webhook

---

### Phase 2: Frontend UI

Deliverables:

* Install and configure shadcn/ui components
* Dark-mode-first design system with calm aesthetic
* Sidebar navigation on desktop, bottom tab bar with icons on mobile
* Dashboard page — today's tasks, next task, active goals, quick actions
* Goals page — goal list, add goal form, generate tasks button
* Tasks page — task list by status, schedule button, complete/skip/move actions
* Calendar page — block list, add/edit/delete blocks
* Focus mode page — task timer with start/pause/complete/cancel
* Device page — LCD preview widget, send test message, send next task
* Settings page — daily planning range start/end time inputs, save button
* Responsive layout for desktop and mobile

---

### Phase 3: Hardware + Integration

Deliverables:

* Bill of Materials document in hardware/BOM.md
* Wiring guide in firmware/particle-argon/wiring/WIRING_GUIDE.md
* Particle Argon firmware in firmware/particle-argon/src/goaldesk.ino
* LCD boot message, cloud function (setDisplay), button event publish
* Replace mock Particle service with real Particle Cloud API calls
* Environment variables: PARTICLE_ACCESS_TOKEN, PARTICLE_DEVICE_ID
* Backend device endpoints connected to real hardware

---

### Phase 4: Real AI Planner + Polish

Deliverables:

* AI planner in lib/ai-planner.ts using OpenAI API (GPT-4o-mini)
* JSON validation and wellness guardrails
* Fallback to mock planner on failure
* Environment variable toggle: USE_AI_PLANNER=true|false
* Complete README with architecture, setup, demo flow
* Documentation updates (ARCHITECTURE.md, API_SPEC.md, etc.)
* End-to-end test of full demo flow
* Screenshots and demo script

---

## 22. Coding Agent Instructions

When implementing this project, follow these rules:

1. Build incrementally. Complete and test each sub-phase before moving on.
2. Do not implement future features before MVP features.
3. Keep frontend/backend (Next.js app), firmware, and docs separate in the folder structure.
4. Use clear beginner-friendly comments.
5. Do not hardcode API keys.
6. Use environment variables for secrets.
7. Prefer simple working features over complex incomplete features.
8. Add automated tests for each backend sub-phase and manual test checklists for frontend.
9. Commit after each meaningful milestone.
10. Keep the app functional after every phase.
11. Use Prisma for all database operations — do not write raw SQL.
12. Use Next.js App Router conventions (app/ directory, route.ts files for API routes).
13. Use shadcn/ui components for the frontend UI.
14. Mock the Particle Cloud API until Phase 3 (hardware integration).
15. Mock the AI planner until Phase 4 (real AI planner).

### Implementation Priority

Start with:

1. Project setup + Prisma schema + demo user seed (Phase 1A)
2. Goal CRUD API routes (Phase 1B)
3. Mock AI task generation + task CRUD (Phase 1C)
4. Calendar block CRUD (Phase 1D)
5. Scheduling engine (Phase 1E)
6. Focus session API (Phase 1F)
7. Device/LCD formatter API (Phase 1G)
8. Frontend UI — all pages with shadcn/ui (Phase 2)
9. Hardware assembly + firmware + real Particle integration (Phase 3)
10. Real AI planner with OpenAI + polish + documentation (Phase 4)

---

## 23. Acceptance Criteria for MVP v0

The MVP is complete when the following user story works:

> As a student, I can create a goal, generate small tasks for it, block off class time, schedule tasks into available time, start a focus timer, complete a task, and send my next task to a physical desktop display.

Detailed acceptance checklist:

* [ ] User can create a goal.
* [ ] User can generate tasks from a goal.
* [ ] User can add a class/obligation block.
* [ ] Scheduler avoids blocked time.
* [ ] User can see scheduled tasks.
* [ ] User can start focus mode for a task.
* [ ] User can complete a task.
* [ ] Backend can format LCD messages.
* [ ] Backend can preview next task message.
* [ ] Particle Argon can display a message.
* [ ] Backend can send a task message to Particle Argon.
* [ ] Documentation explains how to run backend, frontend, and firmware.
* [ ] GitHub README includes project overview, architecture, setup, and demo flow.

---

## 24. Final MVP Demo Script

The demo should show:

1. Open web app.
2. Create goal: “Learn AI engineering in 3 months.”
3. Generate AI tasks.
4. Add class block: “Circuits Class, Monday 10:00–11:15.”
5. Schedule tasks.
6. Show task placed outside class time.
7. Start focus mode.
8. Complete task.
9. Open Device page.
10. Click “Send Next Task.”
11. Show Particle Argon LCD updating with task message.

Example final LCD:

```text
Next Task:
Study Python
```

---

## 25. Final README Summary

Use this summary in the GitHub README:

GoalDesk AI is an AI-powered personal assistant for students that turns long-term goals into small daily tasks, schedules them around real obligations, and displays timely reminders on a Particle Argon-powered desktop device. The MVP demonstrates a full-stack IoT workflow using a Next.js fullstack application (App Router + TypeScript + Tailwind v4 + shadcn/ui), Prisma ORM with SQLite, AI task planning (mock planner + OpenAI), rule-based scheduling with a 7-day rolling window, and Particle Argon firmware for LCD notifications.
