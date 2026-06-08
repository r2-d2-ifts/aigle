-- AgileMind AI — Supabase Schema
-- Run this in Supabase SQL Editor: supabase.com > SQL Editor > New query

-- Sprints
create table if not exists sprints (
  id text primary key,
  name text not null,
  start_date text,
  end_date text,
  status text default 'active',   -- active | closed
  velocity int default 0,
  planned_sp int default 0,
  done_sp int default 0,
  jira_id text,
  created_at timestamptz default now()
);

-- Backlog tasks
create table if not exists tasks (
  id text primary key,
  jira_id text,
  title text not null,
  description text,
  type text default 'story',       -- story | bug
  current_sp int,
  ai_sp int,
  confidence int,
  references_count int default 0,
  rationale text,
  passes boolean default true,
  reject_reason text,
  sprint_id text references sprints(id),
  status text default 'backlog',   -- backlog | in_progress | done | blocked
  labels text[] default '{}',
  created_at timestamptz default now()
);

-- Sub-tasks (decomposed from tasks)
create table if not exists subtasks (
  id uuid default gen_random_uuid() primary key,
  task_id text references tasks(id) on delete cascade,
  type text not null,              -- FE | BE | DB | Test
  name text not null,
  description text,
  sp int default 1,
  assignee text,
  dependencies text[] default '{}',
  created_at timestamptz default now()
);

-- Team members
create table if not exists team_members (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  skills text[] default '{}',
  current_load int default 0,
  domain_history jsonb default '[]'
);

-- Sprint health snapshots
create table if not exists sprint_health (
  id uuid default gen_random_uuid() primary key,
  sprint_id text references sprints(id),
  velocity_score int default 0,
  spillover_score int default 0,
  blocker_score int default 0,
  overcommit_score int default 0,
  health_score int default 0,
  spillover_rate numeric(5,2) default 0,
  cycle_time_days numeric(5,2) default 0,
  blocked_count int default 0,
  created_at timestamptz default now()
);

-- Assignment rationale (per subtask)
create table if not exists assignment_rationale (
  id uuid default gen_random_uuid() primary key,
  subtask_id uuid references subtasks(id) on delete cascade,
  person text not null,
  rationale_text text not null,
  created_at timestamptz default now()
);

-- Indexes for common queries
create index if not exists tasks_sprint_id_idx on tasks(sprint_id);
create index if not exists subtasks_task_id_idx on subtasks(task_id);
create index if not exists sprint_health_sprint_id_idx on sprint_health(sprint_id);
