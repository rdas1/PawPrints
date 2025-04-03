import Home from "@/pages/Home";
import 'sonner/dist/index.css';
import { Toaster } from "sonner"; // ✅ Add this

function App() {
  return (
    <>
      <div className="min-h-screen bg-muted text-foreground font-sans">
        <Home />
      </div>
      <Toaster position="top-center" /> {/* ✅ Render this once at root level */}
    </>
  );
}

export default App;
