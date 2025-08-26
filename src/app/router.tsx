import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "../pages/home/HomePage";
import { ItemLogsPage } from "../pages/logs/ItemLogsPage";
import { RecordPage } from "../pages/record/RecordPage";
import { ProfilePage } from "../pages/profile/ProfilePage";
import { AppLayout } from "./ui/app-layout";
import { ItemEditPage } from "../pages/item-edit/ItemEditPage";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomePage />, handle: { title: "Home" } },
      {
        path: "/item/:itemId",
        element: <ItemLogsPage />,
        handle: { title: "Item" },
      },
      {
        path: "/item/:itemId/edit",
        element: <ItemEditPage />,
        handle: { title: "Edit item" },
      },
      {
        path: "/item/:itemId/log/:logId",
        element: <RecordPage />,
        handle: { title: "Record" },
      },
      {
        path: "/profile",
        element: <ProfilePage />,
        handle: { title: "Profile" },
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
