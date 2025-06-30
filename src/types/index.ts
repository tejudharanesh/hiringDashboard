export interface Candidate {
  id: string;
  name: string;
  roleApplied: string;
  interviewDate: string;
  status: "Selected" | "Rejected" | "On Hold";
  interviewerName: string;
}

export interface User {
  username: string;
  companyName: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}
