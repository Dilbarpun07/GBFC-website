import React from "react";
import { Outlet } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Team, Player, Match, TrainingSession } from "@/types";

interface AppLayoutProps {
  teams: Team[];
  players: Player[];
  onAddPlayer: (player: Omit<Player, "id">) => void;
  onEditPlayer: (playerId: string, updatedPlayer: Partial<Omit<Player, "id">>) => void;
  matches: Match[];
  onAddMatch: (match: Omit<Match, "id">) => void;
  onEditMatch: (matchId: string, updatedMatch: Partial<Omit<Match, "id">>) => void; // Added onEditMatch prop
  trainingSessions: TrainingSession[];
  onAddTrainingSession: (session: Omit<TrainingSession, "id">) => void;
  onEditTrainingSession: (
    originalSession: TrainingSession,
    updatedSessionData: Partial<Omit<TrainingSession, "id">>
  ) => void;
  onCreateTeam: (teamName: string) => void;
  onDeleteTeam: (teamId: string) => void;
  onEditTeam: (teamId: string, newName: string) => void;
  onDeletePlayer: (playerId: string) => void;
  onDeleteMatch: (matchId: string) => void;
  onDeleteTrainingSession: (sessionId: string) => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  teams,
  players,
  onAddPlayer,
  onEditPlayer,
  matches,
  onAddMatch,
  onEditMatch, // Destructure new prop
  trainingSessions,
  onAddTrainingSession,
  onEditTrainingSession,
  onCreateTeam,
  onDeleteTeam,
  onEditTeam,
  onDeletePlayer,
  onDeleteMatch,
  onDeleteTrainingSession,
}) => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  const handleMenuClick = () => {
    setIsSidebarOpen(true);
  };

  const handleSidebarCollapse = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  if (isMobile) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header onMenuClick={handleMenuClick} />
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent side="left" className="p-0 w-64">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b">
                <h1 className="text-xl font-bold text-primary">SportEasy</h1>
              </div>
              <Sidebar />
              <div className="mt-auto">
                <MadeWithDyad />
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <main className="flex-1 overflow-auto">
          <Outlet
            context={{
              teams,
              players,
              onAddPlayer,
              onEditPlayer,
              matches,
              onAddMatch,
              onEditMatch, // Pass new prop to context
              trainingSessions,
              onAddTrainingSession,
              onEditTrainingSession,
              onCreateTeam,
              onDeleteTeam,
              onEditTeam,
              onDeletePlayer,
              onDeleteMatch,
              onDeleteTrainingSession,
            }}
          />
        </main>
      </div>
    );
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-screen items-stretch"
    >
      <ResizablePanel
        defaultSize={20}
        minSize={15}
        maxSize={25}
        collapsedSize={4}
        collapsible={true}
        onCollapse={(collapsed) => handleSidebarCollapse(collapsed)}
        className={
          isSidebarCollapsed
            ? "min-w-[50px] transition-all duration-300 ease-in-out"
            : "min-w-[200px]"
        }
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            {!isSidebarCollapsed && (
              <h1 className="text-xl font-bold text-primary">GBFC</h1>
            )}
            {isSidebarCollapsed && (
              <h1 className="text-xl font-bold text-primary text-center">SE</h1>
            )}
          </div>
          <Sidebar isCollapsed={isSidebarCollapsed} />
          <div className="mt-auto">
            <MadeWithDyad />
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={80}>
        <div className="flex flex-col h-full">
          <Header />
          <main className="flex-1 overflow-auto">
            <Outlet
              context={{
                teams,
                players,
                onAddPlayer,
                onEditPlayer,
                matches,
                onAddMatch,
                onEditMatch, // Pass new prop to context
                trainingSessions,
                onAddTrainingSession,
                onEditTrainingSession,
                onCreateTeam,
                onDeleteTeam,
                onEditTeam,
                onDeletePlayer,
                onDeleteMatch,
                onDeleteTrainingSession,
              }}
            />
          </main>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default AppLayout;