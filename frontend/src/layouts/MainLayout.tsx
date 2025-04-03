import { Outlet, Link } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background-100 text-foreground font-body">
      <nav className="bg-background-100 text-white px-6 pt-4 flex items-center justify-between">
        <div className="text-xl font-display font-semibold">PawPrints</div>
        <div className="space-x-4 text-sm font-display">
          <Link to="/" className="hover:underline active:underline">
            Manage Pets
          </Link>
          <Link to="/about" className="hover:underline">
            About
          </Link>
        </div>
      </nav>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
