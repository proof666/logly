import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PageHome } from "../pages/home/page-home";
import { PageItemLogs } from "../pages/logs/page-item-logs";
import { PageRecord } from "../pages/record/page-record";
import { PageProfile } from "../pages/profile/page-profile";
import { AppLayout } from "./ui/app-layout";
import { PageItemEdit } from "../pages/item-edit/page-item-edit";

const base = import.meta.env.VITE_ROUTER_BASENAME || "/";
const basename = base.startsWith("/logly") ? "/logly" : undefined;

const router = createBrowserRouter(
    [
        {
            element: <AppLayout />,
            children: [
                { path: "/", element: <PageHome />, handle: { title: "Home" } },
                {
                    path: "/item/:itemId",
                    element: <PageItemLogs />,
                    handle: { title: "Item" },
                },
                {
                    path: "/item/:itemId/edit",
                    element: <PageItemEdit />,
                    handle: { title: "Edit item" },
                },
                {
                    path: "/item/:itemId/log/:logId",
                    element: <PageRecord />,
                    handle: { title: "Record" },
                },
                {
                    path: "/profile",
                    element: <PageProfile />,
                    handle: { title: "Profile" },
                },
            ],
        },
    ],
    basename ? { basename } : undefined,
);

export const AppRouter = () => {
    return <RouterProvider router={router} />;
};
