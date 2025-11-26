export type UserRole = "ADMIN" | "VOTER";

export type ElectionStatus = "UPCOMING" | "ONGOING" | "COMPLETED";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  image?: string;
}

export interface Election {
  id: string;
  title: string;
  description: string;
  status: ElectionStatus;
  startDate: string;
  endDate: string;
  candidates: Candidate[];
}

export interface Vote {
  electionId: string;
  candidateId: string;
  voterId: string;
}

export interface ElectionResult {
  electionId: string;
  results: {
    candidateId: string;
    candidateName: string;
    votes: number;
  }[];
  winner: {
    candidateId: string;
    candidateName: string;
    votes: number;
  };
}
