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
import NotFound from "./pages/NotFound";
import { Team, Player, Match } from "./types";

const queryClient = new QueryClient();

const App = () => {
  const [teams, setTeams] = React.useState<Team[]>([]);
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [matches, setMatches] = React.useState<Match[]>([]); // Added for future schedule management

  const handleAddPlayer = (newPlayer: Omit<Player, "id">) => {
    setPlayers((prevPlayers) => [
      ...prevPlayers,
      { ...newPlayer, id: Date.now().toString() }, // Assign a simple unique ID
    ]);
  };

  const handleAddMatch = (newMatch: Omit<Match, "id">) => {
    setMatches((prevMatches) => [
      ...prevMatches,
      { ...newMatch, id: Date.now().toString() }, // Assign a simple unique ID
    ]);
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