import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
// import PetDetailPage from "@/pages/PetDetailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
//   {
//     path: "/pets/:id",
//     element: <PetDetailPage />,
//   },
]);
