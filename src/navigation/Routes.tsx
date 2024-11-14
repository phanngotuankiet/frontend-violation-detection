import { ComponentType } from "react";
import Evaluate from "../components/evaluate/Evaluate";
import Login from "../components/authentication/Login";
import SignUp from "../components/authentication/SignUp";
import ProcessedVideos from "../components/history/ProcessedVideos";

interface Route {
  path: string;
  Component: ComponentType;
}

export const routes: Route[] = [
  { path: "/", Component: Evaluate },
  { path: "/evaluate", Component: Evaluate },
  { path: "/login", Component: Login },
  { path: "/signup", Component: SignUp },
  { path: "/processedVideos", Component: ProcessedVideos },
];
