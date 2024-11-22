import { ComponentType } from "react";
import Evaluate from "../components/evaluate/Evaluate";
import Login from "../components/authentication/Login";
import SignUp from "../components/authentication/SignUp";
import ProcessedVideos from "../components/history/ProcessedVideos";
import Profile from "../components/dashboard/Profile";
import SuperAdmin from "../components/admin/Admin";
import QuestionList from "../components/forum/Question/QuestionList";
import QuestionDetail from "../components/forum/Question/QuestionDetail";

interface Route {
  path: string;
  Component: ComponentType;
  protected: boolean;
}

export const routes: Route[] = [
  { path: "/", Component: Evaluate, protected: false },
  { path: "/evaluate", Component: Evaluate, protected: false },
  { path: "/login", Component: Login, protected: false },
  { path: "/signup", Component: SignUp, protected: false },
  { path: "/processedVideos", Component: ProcessedVideos, protected: false },
  { path: "/profile", Component: Profile, protected: false },
  { path: "/superAdmin", Component: SuperAdmin, protected: true },
  { path: "/forum", Component: QuestionList, protected: false },
  { path: "questions/:id", Component: QuestionDetail, protected: false },
];
