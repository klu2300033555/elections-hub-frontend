import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Election } from "@/types";
import { electionsApi, votingApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Vote as VoteIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Vote = () => {
  const { user } = useAuth();
  const [elections, setElections] = useState<Election[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCandidates, setSelectedCandidates] = useState<Record<string, string>>({});
  const [votedElections, setVotedElections] = useState<Set<string>>(new Set());
  const [votingInProgress, setVotingInProgress] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadElections();
  }, []);

  const loadElections = async () => {
    try {
      setIsLoading(true);
      const data = await electionsApi.getAll();
      const ongoing = data.filter((e) => e.status === "ONGOING");
      setElections(ongoing);

      // Check which elections user has voted in
      if (user) {
        const voted = new Set<string>();
        for (const election of ongoing) {
          const hasVoted = await votingApi.hasVoted(user.id, election.id);
          if (hasVoted) {
            voted.add(election.id);
          }
        }
        setVotedElections(voted);
      }

      setError(null);
    } catch (err) {
      setError("Failed to load elections. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (electionId: string) => {
    const candidateId = selectedCandidates[electionId];
    if (!candidateId || !user) return;

    setVotingInProgress(electionId);

    try {
      await votingApi.castVote({
        electionId,
        candidateId,
        voterId: user.id,
      });

      setVotedElections((prev) => new Set(prev).add(electionId));
      toast({
        title: "Vote submitted successfully!",
        description: "Thank you for participating in this election.",
      });
    } catch (err) {
      toast({
        title: "Failed to submit vote",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setVotingInProgress(null);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-8">Cast Your Vote</h1>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-[400px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Cast Your Vote</h1>
        <p className="text-muted-foreground">
          Select your preferred candidate in each ongoing election
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {elections.length === 0 ? (
        <Alert>
          <VoteIcon className="h-4 w-4" />
          <AlertDescription>
            There are no ongoing elections at the moment. Please check back later.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-8">
          {elections.map((election) => {
            const hasVoted = votedElections.has(election.id);
            const isVoting = votingInProgress === election.id;

            return (
              <Card key={election.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {election.title}
                    {hasVoted && (
                      <span className="flex items-center gap-2 text-sm font-normal text-success">
                        <CheckCircle2 className="h-4 w-4" />
                        Voted
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>{election.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  {hasVoted ? (
                    <Alert>
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertDescription>
                        You have already cast your vote in this election. Results will be announced after the election ends.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <>
                      <RadioGroup
                        value={selectedCandidates[election.id] || ""}
                        onValueChange={(value) =>
                          setSelectedCandidates((prev) => ({ ...prev, [election.id]: value }))
                        }
                        className="space-y-3"
                      >
                        {election.candidates.map((candidate) => (
                          <div
                            key={candidate.id}
                            className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                          >
                            <RadioGroupItem value={candidate.id} id={candidate.id} />
                            <Label htmlFor={candidate.id} className="flex-1 cursor-pointer">
                              <div className="font-semibold">{candidate.name}</div>
                              <div className="text-sm text-muted-foreground">{candidate.party}</div>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>

                      <Button
                        className="w-full mt-6"
                        onClick={() => handleVote(election.id)}
                        disabled={!selectedCandidates[election.id] || isVoting}
                      >
                        {isVoting ? "Submitting..." : "Submit Vote"}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Vote;
