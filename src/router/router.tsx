import { createBrowserRouter } from "react-router";
import PrivateRoute from "./PrivateRouter";

import App from "../App";
import MainContent from "../layout/Main/MainContent/MainContent";

import InProgress from "../pages/InProgress/InProgress";
import Completed from "../pages/Completed/Completed";
import Canceled from "../pages/Canceled/Canceled";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ProjectPage from "../pages/ProjectPage/ProjectPage";

export const router = createBrowserRouter([
    {path: "/login", element: <Login />}, 
    {path: "/register", element: <Register />},

    {
        path: "/",
        element: (
            <PrivateRoute>
                <App />
            </PrivateRoute>
        ),
        children: [
            {index: true, element: <MainContent />},

            {path: "inprogress", element: <InProgress />},
            {path: "completed", element: <Completed />},
            {path: "canceled", element: <Canceled />},

            {path: "/project/:id", element: <ProjectPage />}
        ]
    }
])
