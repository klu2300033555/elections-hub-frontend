import { Election, ElectionResult, Vote } from "@/types";

export const mockElections: Election[] = [
  {
    id: "1",
    title: "Presidential Election 2024",
    description: "National presidential election to elect the next president",
    status: "UPCOMING",
    startDate: "2024-11-01",
    endDate: "2024-11-01",
    candidates: [
      { id: "c1", name: "John Smith", party: "Democratic Party" },
      { id: "c2", name: "Sarah Johnson", party: "Republican Party" },
      { id: "c3", name: "Michael Brown", party: "Independent" },
    ],
  },
  {
    id: "2",
    title: "City Mayor Election",
    description: "Local election for city mayor position",
    status: "ONGOING",
    startDate: "2024-10-15",
    endDate: "2024-10-30",
    candidates: [
      { id: "c4", name: "Emily Davis", party: "Progressive Alliance" },
      { id: "c5", name: "Robert Wilson", party: "Conservative Union" },
    ],
  },
  {
    id: "3",
    title: "State Governor Election 2023",
    description: "State-level governor election completed",
    status: "COMPLETED",
    startDate: "2023-09-01",
    endDate: "2023-09-15",
    candidates: [
      { id: "c6", name: "Jennifer Martinez", party: "Democratic Party" },
      { id: "c7", name: "David Anderson", party: "Republican Party" },
      { id: "c8", name: "Lisa Thompson", party: "Green Party" },
    ],
  },
  {
    id: "4",
    title: "School Board Election",
    description: "Election for school board members",
    status: "UPCOMING",
    startDate: "2024-12-01",
    endDate: "2024-12-05",
    candidates: [
      { id: "c9", name: "Patricia White", party: "Education First" },
      { id: "c10", name: "James Taylor", party: "Community Choice" },
    ],
  },
  {
    id: "5",
    title: "County Commissioner Election",
    description: "County-level commissioner election",
    status: "COMPLETED",
    startDate: "2023-08-01",
    endDate: "2023-08-10",
    candidates: [
      { id: "c11", name: "Mary Johnson", party: "Democratic Party" },
      { id: "c12", name: "Thomas Lee", party: "Republican Party" },
    ],
  },
];

export const mockResults: ElectionResult[] = [
  {
    electionId: "3",
    results: [
      { candidateId: "c6", candidateName: "Jennifer Martinez", votes: 45230 },
      { candidateId: "c7", candidateName: "David Anderson", votes: 38910 },
      { candidateId: "c8", candidateName: "Lisa Thompson", votes: 12340 },
    ],
    winner: { candidateId: "c6", candidateName: "Jennifer Martinez", votes: 45230 },
  },
  {
    electionId: "5",
    results: [
      { candidateId: "c11", candidateName: "Mary Johnson", votes: 23450 },
      { candidateId: "c12", candidateName: "Thomas Lee", votes: 21890 },
    ],
    winner: { candidateId: "c11", candidateName: "Mary Johnson", votes: 23450 },
  },
];

// Store votes in memory (in real app, this would be in backend)
export let mockVotes: Vote[] = [];

export const addVote = (vote: Vote) => {
  mockVotes.push(vote);
};

export const hasVoted = (voterId: string, electionId: string): boolean => {
  return mockVotes.some(
    (vote) => vote.voterId === voterId && vote.electionId === electionId
  );
};
