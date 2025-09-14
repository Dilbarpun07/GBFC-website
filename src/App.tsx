import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import TeamsPage from "./pages/TeamsPage";
import PlayersPage from "./pages/PlayersPage";
import SchedulePage from "./pages/SchedulePage";
import TrainingPage from "./pages/TrainingPage"; // New import
import NotFound from "./pages/NotFound";
import { Team, Player, Match, TrainingSession } from "./types"; // Updated import

const queryClient = new QueryClient();

const App = () => {
  const [teams, setTeams] = React.useState<Team[]>([]);
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [matches, setMatches] = React.useState<Match[]>([]);
  const [trainingSessions, setTrainingSessions] = React.useState<TrainingSession[]>([]); // New state

  const handleAddPlayer = (newPlayer: Omit<Player, "id">) => {
    setPlayers((prevPlayers) => [
      ...prevPlayers,
      { ...newPlayer, id: Date.now().toString() },
    ]);
  };

  const handleAddMatch = (newMatch: Omit<Match, "id">) => {
    setMatches((prevMatches) => [
      ...prevMatches,
      { ...newMatch, id: Date.now().toString() },
    ]);
  };

  // New handler for adding training sessions
  const handleAddTrainingSession = (newSession: Omit<TrainingSession, "id">) => {
    setTrainingSessions((prevSessions) => [
      ...prevSessions,
      { ...newSession, id: Date.now().toString() },
    ]);

    // Update players' training attendance
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        newSession.attendedPlayerIds.includes(player.id)
          ? { ...player, trainingsAttended: player.trainingsAttended + 1 }
          : player
      )
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <AppLayout
                  teams={teams}
                  setTeams={setTeams}
                  players={players}
                  onAddPlayer={handleAddPlayer}
                  matches={matches}
                  onAddMatch={handleAddMatch}
                  trainingSessions={trainingSessions} // Pass new state
                  onAddTrainingSession={handleAddTrainingSession} // Pass new handler
                />
              }
            >
              <Route index element={<DashboardPage />} />
              <Route
                path="teams"
                element={
                  <TeamsPage
                    teams={teams}
                    setTeams={setTeams}
                    onAddPlayer={handleAddPlayer}
                  />
                }
              />
              <Route
                path="players"
                element={<PlayersPage players={players} teams={teams} />}
              />
              <Route
                path="schedule"
                element={<SchedulePage matches={matches} teams={teams} onAddMatch={handleAddMatch} />}
              />
              {/* New route for TrainingPage */}
              <Route
                path="training"
                element={<TrainingPage trainingSessions={trainingSessions} teams={teams} players={players} onAddTrainingSession={handleAddTrainingSession} />}
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;