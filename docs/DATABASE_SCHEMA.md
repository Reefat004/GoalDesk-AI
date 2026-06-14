# Tables

## Users
Represents a person using the app.

- id
- name
- email
- created_at

## Goals
Represents a long-term target.

- id
- user_id
- title
- category
- deadline
- priority
- preferred_time_of_day
- daily_minutes
- status
- created_at


## Tasks
Represents small daily actions created from a goal.

- id
- user_id
- goal_id
- title
- description
- estimated_minutes
- scheduled_start
- scheduled_end
- status
- created_at

## Calendar_blocks
Represents unavailable time.

- id
- user_id
- title
- block_type
- start_time
- end_time
- recurrence
- is_hard_block
- created_at


## Focus_sessions
Represents timed work sessions.

- id
- user_id
- task_id
- started_at
- ended_at
- planned_minutes
- actual_minutes
- status


## Devices
Represents the Particle Argon.

- id
- user_id
- particle_device_id
- name
- status
- last_seen
- created_at


## Device_messages
Represents messages sent to the LCD.

- id
- device_id
- line1
- line2
- message_type
- sent_at
- status