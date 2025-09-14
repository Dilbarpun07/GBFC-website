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
import TrainingPage from "./pages/TrainingPage";
import NotFound from "./pages/NotFound";
import { Team, Player, Match, TrainingSession } from "./types";
import { supabase } from "./integrations/supabase/client"; // Import Supabase client
import { toast } from "sonner";

const queryClient = new QueryClient();

const App = () => {
  const [teams, setTeams] = React.useState<Team[]>([]);
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [matches, setMatches] = React.useState<Match[]>([]);
  const [trainingSessions, setTrainingSessions] = React.useState<TrainingSession[]>([]);
  const [loading, setLoading] = React.useState(true);

  // --- Data Fetching from Supabase ---
  const fetchTeams = async () => {
    const { data, error } = await supabase.from("teams").select("*");
    if (error) {
      console.error("Error fetching teams:", error);
      toast.error("Failed to load teams.");
    } else {
      setTeams(data || []);
    }
  };

  const fetchPlayers = async () => {
    const { data, error } = await supabase.from("players").select("*");
    if (error) {
      console.error("Error fetching players:", error);
      toast.error("Failed to load players.");
    } else {
      setPlayers(data || []);
    }
  };

  const fetchMatches = async () => {
    const { data, error } = await supabase.from("matches").select("*");
    if (error) {
      console.error("Error fetching matches:", error);
      toast.error("Failed to load matches.");
    } else {
      setMatches(data || []);
    }
  };

  const fetchTrainingSessions = async () => {
    const { data, error } = await supabase.from("training_sessions").select("*");
    if (error) {
      console.error("Error fetching training sessions:", error);
      toast.error("Failed to load training sessions.");
    } else {
      setTrainingSessions(data || []);
    }
  };

  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchTeams(), fetchPlayers(), fetchMatches(), fetchTrainingSessions()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // --- Handlers for adding/updating data via Supabase ---
  const handleCreateTeam = async (teamName: string) => {
    const { data, error } = await supabase.from("teams").insert({ name: teamName }).select();
    if (error) {
      console.error("Error creating team:", error);
      toast.error("Failed to create team.");
    } else {
      toast.success("Team created successfully!");
      fetchTeams(); // Re-fetch teams to update state
    }
  };

  const handleAddPlayer = async (newPlayer: Omit<Player, "id">) => {
    const { data, error } = await supabase.from("players").insert(newPlayer).select();
    if (error) {
      console.error("Error adding player:", error);
      toast.error("Failed to add player.");
    } else {
      toast.success("Player added successfully!");
      fetchPlayers(); // Re-fetch players to update state
    }
  };

  const handleAddMatch = async (newMatch: Omit<Match, "id">) => {
    const { data, error } = await supabase.from("matches").insert(newMatch).select();
    if (error) {
      console.error("Error adding match:", error);
      toast.error("Failed to add match.");
    } else {
      toast.success("Match added successfully!");
      fetchMatches(); // Re-fetch matches to update state
    }
  };

  const handleAddTrainingSession = async (newSession: Omit<TrainingSession, "id">) => {
    const { data, error } = await supabase.from("training_sessions").insert(newSession).select();
    if (error) {
      console.error("Error adding training session:", error);
      toast.error("Failed to add training session.");
    } else {
      toast.success("Training session added successfully!");
      fetchTrainingSessions(); // Re-fetch training sessions

      // Update players' training attendance
      for (const playerId of newSession.attendedPlayerIds) {
        const playerToUpdate = players.find(p => p.id === playerId);
        if (playerToUpdate) {
          const { error: updateError } = await supabase
            .from("players")
            .update({ trainings_attended: playerToUpdate.trainingsAttended + 1 })
            .eq("id", playerId);
          if (updateError) {
            console.error(`Error updating training count for player ${playerId}:`, updateError);
          }
        }
      }
      fetchPlayers(); // Re-fetch players to update their stats
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading data...</p>
      </div>
    );
  }

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
                  setTeams={setTeams} // This will be replaced by handleCreateTeam in TeamsPage
                  players={players}
                  onAddPlayer={handleAddPlayer}
                  matches={matches}
                  onAddMatch={handleAddMatch}
                  trainingSessions={trainingSessions}
                  onAddTrainingSession={handleAddTrainingSession}
                  onCreateTeam={handleCreateTeam} // Pass new team creation handler
                />
              }
            >
              <Route index element={<DashboardPage />} />
              <Route
                path="teams"
                element={
                  <TeamsPage
                    teams={teams}
                    setTeams={setTeams} // This will be replaced by onCreateTeam
                    onAddPlayer={handleAddPlayer}
                    onCreateTeam={handleCreateTeam} // Pass new team creation handler
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
              <Route
                path="training"
                element={<TrainingPage trainingSessions={trainingSessions} teams={teams} players={players} onAddTrainingSession={handleAddTrainingSession} />}
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;