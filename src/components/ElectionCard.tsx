import { Election } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users } from "lucide-react";
import { format } from "date-fns";

interface ElectionCardProps {
  election: Election;
  action?: React.ReactNode;
}

const ElectionCard: React.FC<ElectionCardProps> = ({ election, action }) => {
  const getStatusColor = (status: Election["status"]) => {
    switch (status) {
      case "UPCOMING":
        return "bg-info text-info-foreground";
      case "ONGOING":
        return "bg-warning text-warning-foreground";
      case "COMPLETED":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl">{election.title}</CardTitle>
          <Badge className={getStatusColor(election.status)}>{election.status}</Badge>
        </div>
        <CardDescription>{election.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {format(new Date(election.startDate), "MMM dd, yyyy")} - {format(new Date(election.endDate), "MMM dd, yyyy")}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{election.candidates.length} candidates</span>
        </div>
      </CardContent>

      {action && <CardFooter>{action}</CardFooter>}
    </Card>
  );
};

export default ElectionCard;
