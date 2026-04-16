import { useLocation, Outlet } from "react-router";
import BottomNav from "./BottomNav";

export default function MainLayout() {
  const location = useLocation();
  
  // Define paths where we DON'T want the bottom nav (like the actual exam)
  const hideNavPaths = ["/quiz", "/login", "/admin", "/"];
  const shouldHideNav = hideNavPaths.includes(location.pathname) || location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* This is where the specific page content will load */}
      <main className={`flex-1 ${!shouldHideNav ? "pb-20" : ""}`}>
        <Outlet />
      </main>

      {/* Only show nav if we aren't in a quiz or login screen */}
      {!shouldHideNav && <BottomNav />}
    </div>
  );
}