import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, PlusCircle } from "lucide-react";
import { Team, Player } from "@/types";
import AddPlayerDialog from "@/components/players/AddPlayerDialog";

interface TeamCardProps {
  team: Team;
  onAddPlayer: (player: Omit<Player, "id">) => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, onAddPlayer }) => {
  const [isAddPlayerDialogOpen, setIsAddPlayerDialogOpen] = React.useState(false);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{team.name}</CardTitle>
        <Users className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Manage players and schedule for this team.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => setIsAddPlayerDialogOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Player
        </Button>
        <AddPlayerDialog
          isOpen={isAddPlayerDialogOpen}
          onOpenChange={setIsAddPlayerDialogOpen}
          onAddPlayer={onAddPlayer}
          teamId={team.id}
        />
      </CardContent>
    </Card>
  );
};

export default TeamCard;