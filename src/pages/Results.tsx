import { useEffect, useState } from "react";
import { Election, ElectionResult } from "@/types";
import { electionsApi, resultsApi } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Results = () => {
  const [elections, setElections] = useState<Election[]>([]);
  const [results, setResults] = useState<Record<string, ElectionResult>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      setIsLoading(true);
      const electionsData = await electionsApi.getAll();
      const completed = electionsData.filter((e) => e.status === "COMPLETED");
      setElections(completed);

      const resultsData = await resultsApi.getAllResults();
      const resultsMap: Record<string, ElectionResult> = {};
      resultsData.forEach((result) => {
        resultsMap[result.electionId] = result;
      });
      setResults(resultsMap);

      setError(null);
    } catch (err) {
      setError("Failed to load results. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-8">Election Results</h1>
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
        <h1 className="text-4xl font-bold mb-2">Election Results</h1>
        <p className="text-muted-foreground">
          View results from completed elections
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
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No completed elections yet. Results will appear here once elections are finished.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-8">
          {elections.map((election) => {
            const result = results[election.id];
            if (!result) return null;

            const totalVotes = result.results.reduce((sum, r) => sum + r.votes, 0);

            return (
              <Card key={election.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{election.title}</CardTitle>
                      <CardDescription>{election.description}</CardDescription>
                    </div>
                    <Badge className="bg-success text-success-foreground">COMPLETED</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Winner */}
                  <div className="rounded-lg bg-success/10 p-6 border-2 border-success">
                    <div className="flex items-center gap-3 mb-2">
                      <Trophy className="h-6 w-6 text-success" />
                      <h3 className="text-xl font-bold">Winner</h3>
                    </div>
                    <p className="text-2xl font-bold">{result.winner.candidateName}</p>
                    <p className="text-muted-foreground">
                      {result.winner.votes.toLocaleString()} votes ({((result.winner.votes / totalVotes) * 100).toFixed(1)}%)
                    </p>
                  </div>

                  {/* All Results */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Detailed Results</h3>
                    {result.results.map((candidateResult) => {
                      const percentage = (candidateResult.votes / totalVotes) * 100;
                      return (
                        <div key={candidateResult.candidateId} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{candidateResult.candidateName}</span>
                            <span className="text-muted-foreground">
                              {candidateResult.votes.toLocaleString()} votes ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-sm text-muted-foreground pt-4 border-t">
                    Total votes cast: {totalVotes.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Results;
