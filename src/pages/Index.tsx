import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Election } from "@/types";
import { electionsApi } from "@/services/api";
import ElectionCard from "@/components/ElectionCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import votingHero from "@/assets/voting-hero.jpg";
import ballotBox from "@/assets/ballot-box.jpg";
import votingLine from "@/assets/voting-line.jpg";

const Index = () => {
  const [elections, setElections] = useState<Election[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadElections();
  }, []);

  const loadElections = async () => {
    try {
      setIsLoading(true);
      const data = await electionsApi.getAll();
      setElections(data);
      setError(null);
    } catch (err) {
      setError("Failed to load elections. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const upcomingElections = elections.filter((e) => e.status === "UPCOMING");
  const ongoingElections = elections.filter((e) => e.status === "ONGOING");
  const completedElections = elections.filter((e) => e.status === "COMPLETED");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <img
          src={votingHero}
          alt="People participating in democratic voting"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/50" />
        <div className="relative container h-full flex items-center">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-5xl font-bold tracking-tight">
              Your Voice Matters
            </h1>
            <p className="text-xl text-muted-foreground">
              Participate in secure, transparent, and democratic elections. Make your vote count today.
            </p>
            <div className="flex gap-4">
              <Button size="lg" asChild>
                <Link to="/vote">Cast Your Vote</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/results">View Results</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">
                Secure & Transparent Voting
              </h2>
              <p className="text-muted-foreground">
                Our platform ensures every vote is counted accurately and securely. 
                With state-of-the-art encryption and transparent processes, 
                you can trust that your voice will be heard.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>End-to-end encrypted voting</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>Real-time result tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>Verified and auditable</span>
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src={ballotBox}
                alt="Ballot box representing democratic voting"
                className="rounded-lg shadow-lg"
              />
              <img
                src={votingLine}
                alt="Diverse group of people participating in elections"
                className="rounded-lg shadow-lg mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Elections Section */}
      <section className="py-16 container">
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Ongoing Elections */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Ongoing Elections</h2>
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[280px]" />
              ))}
            </div>
          ) : ongoingElections.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ongoingElections.map((election) => (
                <ElectionCard
                  key={election.id}
                  election={election}
                  action={
                    <Button className="w-full" asChild>
                      <Link to="/vote">Vote Now</Link>
                    </Button>
                  }
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No ongoing elections at the moment.</p>
          )}
        </div>

        {/* Upcoming Elections */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Upcoming Elections</h2>
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-[280px]" />
              ))}
            </div>
          ) : upcomingElections.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingElections.map((election) => (
                <ElectionCard key={election.id} election={election} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No upcoming elections scheduled.</p>
          )}
        </div>

        {/* Completed Elections */}
        <div>
          <h2 className="text-3xl font-bold mb-6">Completed Elections</h2>
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-[280px]" />
              ))}
            </div>
          ) : completedElections.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedElections.map((election) => (
                <ElectionCard
                  key={election.id}
                  election={election}
                  action={
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/results">View Results</Link>
                    </Button>
                  }
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No completed elections yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
