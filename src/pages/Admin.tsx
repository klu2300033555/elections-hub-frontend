import { useEffect, useState } from "react";
import { Election, ElectionStatus, Candidate } from "@/types";
import { electionsApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, AlertCircle } from "lucide-react";

const Admin = () => {
  const [elections, setElections] = useState<Election[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingElection, setEditingElection] = useState<Election | null>(null);
  const { toast } = useToast();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ElectionStatus>("UPCOMING");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([
    { id: "1", name: "", party: "" },
  ]);

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

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("UPCOMING");
    setStartDate("");
    setEndDate("");
    setCandidates([{ id: "1", name: "", party: "" }]);
    setEditingElection(null);
  };

  const handleOpenDialog = (election?: Election) => {
    if (election) {
      setEditingElection(election);
      setTitle(election.title);
      setDescription(election.description);
      setStatus(election.status);
      setStartDate(election.startDate);
      setEndDate(election.endDate);
      setCandidates(election.candidates);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleAddCandidate = () => {
    setCandidates([
      ...candidates,
      { id: (candidates.length + 1).toString(), name: "", party: "" },
    ]);
  };

  const handleRemoveCandidate = (id: string) => {
    if (candidates.length > 1) {
      setCandidates(candidates.filter((c) => c.id !== id));
    }
  };

  const handleCandidateChange = (id: string, field: "name" | "party", value: string) => {
    setCandidates(
      candidates.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const electionData = {
      title,
      description,
      status,
      startDate,
      endDate,
      candidates: candidates.filter((c) => c.name && c.party),
    };

    try {
      if (editingElection) {
        await electionsApi.update(editingElection.id, electionData);
        toast({
          title: "Election updated",
          description: "The election has been updated successfully.",
        });
      } else {
        await electionsApi.create(electionData);
        toast({
          title: "Election created",
          description: "The election has been created successfully.",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      loadElections();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save election. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this election?")) return;

    try {
      await electionsApi.delete(id);
      toast({
        title: "Election deleted",
        description: "The election has been deleted successfully.",
      });
      loadElections();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete election. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: ElectionStatus) => {
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
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage elections and monitor voting</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Election
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingElection ? "Edit Election" : "Create New Election"}
              </DialogTitle>
              <DialogDescription>
                Fill in the details for the election
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as ElectionStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UPCOMING">Upcoming</SelectItem>
                    <SelectItem value="ONGOING">Ongoing</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Candidates</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddCandidate}>
                    <Plus className="h-3 w-3 mr-1" />
                    Add Candidate
                  </Button>
                </div>

                <div className="space-y-3">
                  {candidates.map((candidate, index) => (
                    <div key={candidate.id} className="flex gap-2">
                      <Input
                        placeholder="Candidate Name"
                        value={candidate.name}
                        onChange={(e) => handleCandidateChange(candidate.id, "name", e.target.value)}
                        required
                      />
                      <Input
                        placeholder="Party"
                        value={candidate.party}
                        onChange={(e) => handleCandidateChange(candidate.id, "party", e.target.value)}
                        required
                      />
                      {candidates.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => handleRemoveCandidate(candidate.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingElection ? "Update" : "Create"} Election
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[200px]" />
          ))}
        </div>
      ) : elections.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No elections yet. Click "Add Election" to create your first election.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          {elections.map((election) => (
            <Card key={election.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      {election.title}
                      <Badge className={getStatusColor(election.status)}>
                        {election.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{election.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenDialog(election)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(election.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Start Date:</span> {startDate}
                  </div>
                  <div>
                    <span className="font-medium">End Date:</span> {endDate}
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium">Candidates:</span>{" "}
                    {election.candidates.map((c) => c.name).join(", ")}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
