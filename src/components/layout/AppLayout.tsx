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
import { Team, Player, Match, TrainingSession } from "@/types"; // Updated import

interface AppLayoutProps {
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  players: Player[];
  onAddPlayer: (player: Omit<Player, "id">) => void;
  matches: Match[];
  onAddMatch: (match: Omit<Match, "id">) => void;
  trainingSessions: TrainingSession[]; // New prop
  onAddTrainingSession: (session: Omit<TrainingSession, "id">) => void; // New prop
}

const AppLayout: React.FC<AppLayoutProps> = ({
  teams,
  setTeams,
  players,
  onAddPlayer,
  matches,
  onAddMatch,
  trainingSessions, // Destructure new prop
  onAddTrainingSession, // Destructure new prop
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
              setTeams,
              players,
              onAddPlayer,
              matches,
              onAddMatch,
              trainingSessions, // Pass to context
              onAddTrainingSession, // Pass to context
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
              <h1 className="text-xl font-bold text-primary">SportEasy</h1>
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
                setTeams,
                players,
                onAddPlayer,
                matches,
                onAddMatch,
                trainingSessions, // Pass to context
                onAddTrainingSession, // Pass to context
              }}
            />
          </main>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default AppLayout;