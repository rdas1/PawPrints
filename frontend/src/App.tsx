import { RouterProvider } from "react-router-dom";
import { router } from "@/router";
// import { Toaster } from "@/components/ui/sonner"; // or wherever you placed this

function App() {
  console.log("App.tsx loaded ✅")
  return (
    <div className="min-h-screen bg-background-100 text-white font-body">
      <RouterProvider router={router} />
      {/* <Toaster position="bottom-right" /> */}
    </div>
  );
}

export default App;
