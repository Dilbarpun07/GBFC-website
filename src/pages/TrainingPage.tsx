import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { List, LayoutGrid } from 'lucide-react';
import AddTrainingSessionDialog from '@/components/training/AddTrainingSessionDialog';
import TrainingSessionList from '@/components/training/TrainingSessionList';
import TrainingSessionCollapsibleList from '@/components/training/TrainingSessionCollapsibleList';
import { Team, Player, TrainingSession } from '@/types';

interface TrainingPageProps {
  trainingSessions: TrainingSession[];
  teams: Team[];
  players: Player[];
  onAddTrainingSession: (session: Omit<TrainingSession, 'id'>) => void;
  onDeleteTrainingSession: (sessionId: string) => void;
  onEditTrainingSession: (
    originalSession: TrainingSession,
    updatedSessionData: Partial<Omit<TrainingSession, 'id'>>
  ) => void;
}

const TrainingPage: React.FC<TrainingPageProps> = ({
  trainingSessions,
  teams,
  players,
  onAddTrainingSession,
  onDeleteTrainingSession,
  onEditTrainingSession,
}) => {
  const [isAddSessionDialogOpen, setIsAddSessionDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Training Sessions</h1>
          <p className="text-lg text-muted-foreground">
            Record and review your team's training sessions and player attendance.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4 mr-2" />
            List View
          </Button>
          <Button
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('cards')}
          >
            <LayoutGrid className="w-4 h-4 mr-2" />
            Card View
          </Button>
        </div>
      </div>

      <Button onClick={() => setIsAddSessionDialogOpen(true)}>
        Add New Training Session
      </Button>

      <AddTrainingSessionDialog
        isOpen={isAddSessionDialogOpen}
        onOpenChange={setIsAddSessionDialogOpen}
        onAddTrainingSession={onAddTrainingSession}
        teams={teams}
        players={players}
      />

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Recorded Sessions</h2>
        {viewMode === 'list' ? (
          <TrainingSessionCollapsibleList
            trainingSessions={trainingSessions}
            teams={teams}
            players={players}
            onDeleteTrainingSession={onDeleteTrainingSession}
            onEditTrainingSession={onEditTrainingSession}
          />
        ) : (
          <TrainingSessionList
            trainingSessions={trainingSessions}
            teams={teams}
            players={players}
            onDeleteTrainingSession={onDeleteTrainingSession}
            onEditTrainingSession={onEditTrainingSession}
          />
        )}
      </div>
    </div>
  );
};

export default TrainingPage;
