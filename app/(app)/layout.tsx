import { AppNavbar } from "../features/app-shell/components/AppNavbar/AppNavbar";
import { Sidebar } from "../features/app-shell/components/Sidebar/Sidebar";
import { BottomNav } from "../features/app-shell/components/BottomNav/BottomNav";
import { PageTransition } from "../features/app-shell/components/PageTransition/PageTransition";
import { FloatingParticles } from "../features/app-shell/components/FloatingParticles/FloatingParticles";
import AuthGuard from "./AuthGuard";
import SocketWrapper from "./SocketWrapper";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
    <SocketWrapper>
    <div className="bg-feed-gradient min-h-screen relative">
      {/* Breathing background blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary-container/15 blur-[100px] breathing-blob" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-secondary-fixed-dim/15 blur-[120px] breathing-blob-slow" />
      </div>

      <FloatingParticles />
      <AppNavbar />
      <div className="flex pt-14 sm:pt-16 h-screen">
        <Sidebar />
        <main className="flex-1 flex flex-col items-center justify-start px-3 pt-3 sm:px-6 sm:pt-6 pb-20 md:pb-8 overflow-y-auto min-h-0">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
      <BottomNav />
    </div>
    </SocketWrapper>
    </AuthGuard>
  );
}
