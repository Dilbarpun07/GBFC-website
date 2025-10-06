import React, { useState } from 'react';
import TrainingSessionCard from './TrainingSessionCard';
import { TrainingSession, Team, Player } from '@/types';
import { Button } from '@/components/ui/button';

interface TrainingSessionListProps {
  trainingSessions: TrainingSession[];
  teams: Team[];
  players: Player[];
  onDeleteTrainingSession: (sessionId: string) => void;
  onEditTrainingSession: (
    originalSession: TrainingSession,
    updatedSessionData: Partial<Omit<TrainingSession, 'id'>>
  ) => void;
}

const TrainingSessionList: React.FC<TrainingSessionListProps> = ({
  trainingSessions,
  teams,
  players,
  onDeleteTrainingSession,
  onEditTrainingSession,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // 3x3 grid

  if (trainingSessions.length === 0) {
    return (
      <p className="text-muted-foreground">
        No training sessions recorded yet. Add one above!
      </p>
    );
  }

  // Sort sessions by date, newest first
  const sortedSessions = [...trainingSessions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedSessions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSessions = sortedSessions.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentSessions.map((session) => {
          const team = teams.find((t) => t.id === session.teamId);
          return (
            <TrainingSessionCard
              key={session.id}
              session={session}
              team={team}
              teams={teams}
              players={players}
              onDeleteTrainingSession={onDeleteTrainingSession}
              onEditTrainingSession={onEditTrainingSession}
            />
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, sortedSessions.length)} of {sortedSessions.length} sessions
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => goToPage(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingSessionList;
