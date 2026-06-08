export type Sprint = { id: string; name: string; range: string };

export type BacklogTask = {
  id: string;
  title: string;
  type: "story" | "bug";
  currentSP: number | null;
  aiSP: number;
  confidence: number;
  references: number;
  rationale: string;
  passes: boolean;
  rejectReason?: string;
};

export type Subtask = {
  type: "FE" | "BE" | "DB" | "Test";
  name: string;
  sp: number;
  assignee: string;
};
