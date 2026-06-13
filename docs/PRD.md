# GoalDesk AI — MVP Product Requirements Document

## 1. Product Name

GoalDesk AI

## 2. One-Sentence Pitch

GoalDesk AI is an AI-powered personal assistant for students that breaks long-term goals into small daily tasks, schedules them around real obligations, and displays helpful reminders on a physical IoT desktop device.

## 3. Target Users

The MVP is designed for students who manage multiple goals, deadlines, classes, projects, and personal routines.

Primary users:

* College students
* Engineering students
* Self-learners
* Students preparing for internships
* Students balancing school, fitness, projects, and personal goals

## 4. Problem Statement

Students often set large goals such as learning a new skill, completing a project, improving academic performance, or building better habits. These goals can feel overwhelming because users do not know what small action to take each day. Existing to-do apps require users to manually plan everything and often do not adapt to changing schedules or obligations.

## 5. MVP Goal

The MVP should prove that a user can create a long-term goal, have AI break it into small tasks, schedule those tasks around fixed obligations, track completion, and receive reminders on a Particle Argon-powered desktop display.

## 6. MVP Features

### 6.1 Goal Creation

Users can create a goal with:

* Title
* Category
* Deadline
* Priority
* Preferred time of day
* Estimated daily time commitment

Example:
"Learn AI engineering in 3 months, high priority, 45 minutes per day, evenings preferred."

### 6.2 AI Goal Breakdown

The backend sends the goal to an AI assistant, which returns:

* Milestones
* Small daily tasks
* Estimated duration for each task
* Suggested schedule window

### 6.3 Obligatory Time Blocks

Users can add fixed time blocks such as:

* Classes
* Work
* Meetings
* Appointments
* Sleep
* Commute

These blocks are treated as unavailable time.

### 6.4 Scheduling Engine

The backend schedules AI-generated tasks into available time slots based on:

* User free time
* Goal priority
* Deadline
* Preferred time of day
* Estimated duration
* Existing obligations

### 6.5 Task Management

Users can:

* View scheduled tasks
* Start a task in focus mode
* Mark a task complete
* Skip a task
* Move a task to another time slot

### 6.6 Focus Mode

Users can start a focus timer for a selected task.

MVP focus mode includes:

* Task title
* Timer duration
* Start button
* Complete button
* Basic completion logging

### 6.7 IoT Desktop Display

The Particle Argon device displays:

* Current task
* Next task
* Focus timer status
* Short motivational message
* Reminder notification

The device uses a 16x2 LCD, so all messages must be formatted into two lines of 16 characters or fewer.

### 6.8 Hardware Button

The hardware has one button.

MVP button actions:

* Short press: cycle display screens
* Long press: mark current task complete or send button event to backend

## 7. MVP Non-Goals

The MVP will not include:

* Native iOS or Android app
* Canvas integration
* Google Calendar integration
* Advanced machine learning personalization
* Multiple hardware devices per user
* Voice assistant
* Payment system
* Social sharing
* 3D-printed enclosure
* Production-grade authentication

## 8. Success Criteria

The MVP is successful when:

1. User creates a goal in the web app.
2. AI generates daily micro-tasks.
3. User adds class blocks.
4. Scheduler places tasks into free slots.
5. User starts a task in focus mode.
6. User marks the task complete.
7. Backend sends the current or next task to the Particle Argon.
8. LCD displays the correct task/reminder message.

## 9. Later Features

Post-MVP improvements:

* Learn user preferred work times based on completion behavior
* Learn realistic daily workload
* Auto-reschedule skipped tasks
* Google Calendar integration
* Canvas assignment import
* Push notifications
* Mobile PWA polish
* Multiple users and multiple devices
* Weekly AI progress summaries
* Smarter overload detection
* 3D-printed hardware enclosure
* Better hardware controls with multiple buttons or rotary encoder
* LED status indicators
* Habit streaks and analytics
