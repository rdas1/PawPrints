import { Outlet, Link, NavLink } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background-100 text-foreground font-body">
      <nav className="bg-background-100 text-white px-8 pt-4 flex items-center justify-between">
        <div className="text-xl font-display font-semibold">
          <Link to="/">PawPrints</Link></div>
        <div className="space-x-4 text-sm font-display">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "underline font-medium text-white" : "text-white hover:underline"
            }
          >
            Manage Pets
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "underline font-medium text-white" : "text-white hover:underline"
            }
          >
            About
          </NavLink>
        </div>
      </nav>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
