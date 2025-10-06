import React, { useState } from 'react';
import { format } from 'date-fns';
import { ChevronDown, ChevronRight, Calendar, Users, Edit2, Trash2 } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import EditTrainingSessionDialog from './EditTrainingSessionDialog';
import { TrainingSession, Team, Player } from '@/types';

interface TrainingSessionCollapsibleListProps {
  trainingSessions: TrainingSession[];
  teams: Team[];
  players: Player[];
  onDeleteTrainingSession: (sessionId: string) => void;
  onEditTrainingSession: (
    originalSession: TrainingSession,
    updatedSessionData: Partial<Omit<TrainingSession, 'id'>>
  ) => void;
}

interface TrainingSessionItemProps {
  session: TrainingSession;
  team?: Team;
  teams: Team[];
  players: Player[];
  onDeleteTrainingSession: (sessionId: string) => void;
  onEditTrainingSession: (
    originalSession: TrainingSession,
    updatedSessionData: Partial<Omit<TrainingSession, 'id'>>
  ) => void;
}

const TrainingSessionItem: React.FC<TrainingSessionItemProps> = ({
  session,
  team,
  teams,
  players,
  onDeleteTrainingSession,
  onEditTrainingSession,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const attendedPlayers = players.filter((player) =>
    session.attendedPlayerIds.includes(player.id)
  );

  const teamPlayers = players.filter((player) => player.teamId === session.teamId);
  const attendanceRate = teamPlayers.length > 0
    ? Math.round((attendedPlayers.length / teamPlayers.length) * 100)
    : 0;

  return (
    <>
      <Card className="mb-2">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">
                      {format(new Date(session.date), 'EEEE, MMMM do, yyyy')}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {team?.name || 'Unknown Team'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {attendedPlayers.length}/{teamPlayers.length}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the
                            training session from {format(new Date(session.date), 'MMMM do, yyyy')}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDeleteTrainingSession(session.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Training Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-muted-foreground">Attendance Rate</div>
                    <div className="text-2xl font-bold text-primary">{attendanceRate}%</div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-muted-foreground">Players Present</div>
                    <div className="text-2xl font-bold">{attendedPlayers.length}</div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-muted-foreground">Team Size</div>
                    <div className="text-2xl font-bold">{teamPlayers.length}</div>
                  </div>
                </div>

                {/* Attended Players */}
                <div>
                  <h4 className="font-semibold mb-2 text-primary">Players Present</h4>
                  {attendedPlayers.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {attendedPlayers.map((player) => (
                        <div
                          key={player.id}
                          className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md"
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium">{player.name}</span>
                          {player.position && (
                            <Badge variant="outline" className="text-xs">
                              {player.position}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No players recorded as present.</p>
                  )}
                </div>

                {/* Absent Players */}
                {teamPlayers.length > attendedPlayers.length && (
                  <div>
                    <h4 className="font-semibold mb-2 text-muted-foreground">Players Absent</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {teamPlayers
                        .filter((player) => !session.attendedPlayerIds.includes(player.id))
                        .map((player) => (
                          <div
                            key={player.id}
                            className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-md"
                          >
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="text-sm">{player.name}</span>
                            {player.position && (
                              <Badge variant="outline" className="text-xs">
                                {player.position}
                              </Badge>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <EditTrainingSessionDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        sessionToEdit={session}
        teams={teams}
        players={players}
        onEditTrainingSession={onEditTrainingSession}
      />
    </>
  );
};

const TrainingSessionCollapsibleList: React.FC<TrainingSessionCollapsibleListProps> = ({
  trainingSessions,
  teams,
  players,
  onDeleteTrainingSession,
  onEditTrainingSession,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (trainingSessions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No training sessions recorded yet. Add one above!
        </p>
      </div>
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
      <div className="space-y-2">
        {currentSessions.map((session) => {
          const team = teams.find((t) => t.id === session.teamId);
          return (
            <TrainingSessionItem
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

export default TrainingSessionCollapsibleList;