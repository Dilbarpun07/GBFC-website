'use client';

import React from 'react';
import { useOutletContext } from 'react-router-dom';
import TeamOverviewCard from '@/components/dashboard/TeamOverviewCard';
import PlayerOverviewCard from '@/components/dashboard/PlayerOverviewCard';
import UpcomingMatchesCard from '@/components/dashboard/UpcomingMatchesCard';
import TrainingOverviewCard from '@/components/dashboard/TrainingOverviewCard';
import { Team, Player, Match, TrainingSession } from '@/types';

interface AppLayoutContext {
  teams: Team[];
  players: Player[];
  onAddPlayer: (player: Omit<Player, 'id'>) => void;
  onEditPlayer: (
    playerId: string,
    updatedPlayer: Partial<Omit<Player, 'id'>>
  ) => void;
  matches: Match[];
  onAddMatch: (match: Omit<Match, 'id'>) => void;
  onEditMatch: (
    matchId: string,
    updatedMatch: Partial<Omit<Match, 'id'>>
  ) => void; // Added onEditMatch to context
  trainingSessions: TrainingSession[];
  onAddTrainingSession: (session: Omit<TrainingSession, 'id'>) => void;
  onEditTrainingSession: (
    originalSession: TrainingSession,
    updatedSessionData: Partial<Omit<TrainingSession, 'id'>>
  ) => void;
  onCreateTeam: (teamName: string) => void;
  onDeleteTeam: (teamId: string) => void;
  onEditTeam: (teamId: string, newName: string) => void;
  onDeletePlayer: (playerId: string) => void;
  onDeleteMatch: (matchId: string) => void;
  onDeleteTrainingSession: (sessionId: string) => void;
}

const DashboardPage: React.FC = () => {
  const {
    teams,
    players,
    matches,
    trainingSessions,
    onCreateTeam,
    onAddPlayer,
    onAddMatch,
    onAddTrainingSession
  } = useOutletContext<AppLayoutContext>();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p className="text-lg text-muted-foreground">
        Welcome to GBFC app! This is your central hub for managing teams,
        players, and schedules.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <TeamOverviewCard teams={teams} onCreateTeam={onCreateTeam} />
        <PlayerOverviewCard players={players} teams={teams} onAddPlayer={onAddPlayer} />
        <TrainingOverviewCard trainingSessions={trainingSessions} teams={teams} onAddTrainingSession={onAddTrainingSession} />
        <UpcomingMatchesCard matches={matches} teams={teams} onAddMatch={onAddMatch} />
      </div>
    </div>
  );
};

export default DashboardPage;
