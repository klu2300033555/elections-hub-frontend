import axios from "axios";
import { Election, ElectionResult, Vote } from "@/types";
import { mockElections, mockResults, addVote, hasVoted } from "@/data/mockData";

// Mock API service - replace with real API calls later
const API_BASE_URL = "/api"; // This would be your actual API URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Elections API
export const electionsApi = {
  getAll: async (): Promise<Election[]> => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockElections), 500);
    });
  },

  getById: async (id: string): Promise<Election | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const election = mockElections.find((e) => e.id === id);
        resolve(election);
      }, 300);
    });
  },

  create: async (election: Omit<Election, "id">): Promise<Election> => {
    return new Promise((resolve) => {
      const newElection: Election = {
        ...election,
        id: Math.random().toString(36).substr(2, 9),
      };
      mockElections.push(newElection);
      setTimeout(() => resolve(newElection), 500);
    });
  },

  update: async (id: string, election: Partial<Election>): Promise<Election> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockElections.findIndex((e) => e.id === id);
        if (index !== -1) {
          mockElections[index] = { ...mockElections[index], ...election };
          resolve(mockElections[index]);
        } else {
          reject(new Error("Election not found"));
        }
      }, 500);
    });
  },

  delete: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      const index = mockElections.findIndex((e) => e.id === id);
      if (index !== -1) {
        mockElections.splice(index, 1);
      }
      setTimeout(() => resolve(), 300);
    });
  },
};

// Voting API
export const votingApi = {
  castVote: async (vote: Vote): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (hasVoted(vote.voterId, vote.electionId)) {
          reject(new Error("You have already voted in this election"));
        } else {
          addVote(vote);
          resolve();
        }
      }, 500);
    });
  },

  hasVoted: async (voterId: string, electionId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(hasVoted(voterId, electionId));
      }, 200);
    });
  },
};

// Results API
export const resultsApi = {
  getResults: async (electionId: string): Promise<ElectionResult | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = mockResults.find((r) => r.electionId === electionId);
        resolve(result);
      }, 300);
    });
  },

  getAllResults: async (): Promise<ElectionResult[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockResults), 500);
    });
  },
};

export default api;
