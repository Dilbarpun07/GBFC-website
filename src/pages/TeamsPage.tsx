import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TeamList from "@/components/teams/TeamList";

interface Team {
  id: string;
  name: string;
}

const TeamsPage: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [teamName, setTeamName] = React.useState("");
  const [teams, setTeams] = React.useState<Team[]>([]);

  const handleCreateTeam = () => {
    if (teamName.trim()) {
      const newTeam: Team = {
        id: Date.now().toString(), // Simple unique ID for now
        name: teamName.trim(),
      };
      setTeams((prevTeams) => [...prevTeams, newTeam]);
      setTeamName(""); // Clear input
      setIsDialogOpen(false); // Close dialog
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Teams</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Manage your sports teams here. You can add, edit, or remove teams.
      </p>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button>Create New Team</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Team</DialogTitle>
            <DialogDescription>
              Enter the name of your new team. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="teamName" className="text-right">
                Team Name
              </Label>
              <Input
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="col-span-3"
                placeholder="e.g., Falcons"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" onClick={handleCreateTeam}>
              Create Team
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Your Teams</h2>
        <TeamList teams={teams} />
      </div>
    </div>
  );
};

export default TeamsPage;