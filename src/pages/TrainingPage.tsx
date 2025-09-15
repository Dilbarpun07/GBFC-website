import React from "react";
import { Button } from "@/components/ui/button";
import AddTrainingSessionDialog from "@/components/training/AddTrainingSessionDialog";
import TrainingSessionList from "@/components/training/TrainingSessionList";
import { Team, Player, TrainingSession } from "@/types";

interface TrainingPageProps {
  trainingSessions: TrainingSession[];
  teams: Team[];
  players: Player[];
  onAddTrainingSession: (session: Omit<TrainingSession, "id">) => void;
  onDeleteTrainingSession: (sessionId: string) => void;
}

const TrainingPage: React.FC<TrainingPageProps> = ({
  trainingSessions,
  teams,
  players,
  onAddTrainingSession,
  onDeleteTrainingSession,
}) => {
  const [isAddSessionDialogOpen, setIsAddSessionDialogOpen] = React.useState(false);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Training Sessions</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Record and review your team's training sessions and player attendance.
      </p>

      <Button onClick={() => setIsAddSessionDialogOpen(true)}>Add New Training Session</Button>

      <AddTrainingSessionDialog
        isOpen={isAddSessionDialogOpen}
        onOpenChange={setIsAddSessionDialogOpen}
        onAddTrainingSession={onAddTrainingSession}
        teams={teams}
        players={players}
      />

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Recorded Sessions</h2>
        <TrainingSessionList
          trainingSessions={trainingSessions}
          teams={teams}
          players={players}
          onDeleteTrainingSession={onDeleteTrainingSession}
        />
      </div>
    </div>
  );
};

export default TrainingPage;