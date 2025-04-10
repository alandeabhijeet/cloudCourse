
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
