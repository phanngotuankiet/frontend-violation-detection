import { ComponentType } from "react";
import Evaluate from "../components/evaluate/Evaluate";
import Login from "../components/authentication/Login";
import SignUp from "../components/authentication/SignUp";
import ProcessedVideos from "../components/history/ProcessedVideos";
import Profile from "../components/dashboard/Profile";
import SuperAdmin from "../components/admin/Admin";
import QuestionList from "../components/forum/Question/QuestionList";
import QuestionDetail from "../components/forum/Question/QuestionDetail";
import SearchMonitoringDashboard from "../components/admin/components/SearchMonitoringDashboard";
import Dashboard from "../components/dashboard/Dashboard";
import ManageForum from "../components/admin/components/ManageForum";
import ListUser from "../components/admin/components/ListUser";

interface Route {
  path: string;
  Component: ComponentType;
  protected: boolean;
  isNavbar: boolean;
}

export const LoggedInRoutes: Route[] = [
  { path: "/", Component: Evaluate, protected: false, isNavbar: true },
  {
    path: "/processedVideos",
    Component: ProcessedVideos,
    protected: false,
    isNavbar: true,
  },
  { path: "/profile", Component: Profile, protected: false, isNavbar: true },
  { path: "/evaluate", Component: Evaluate, protected: false, isNavbar: true },
  {
    path: "/superAdmin",
    Component: SuperAdmin,
    protected: true,
    isNavbar: true,
  },
  {
    path: "/superAdmin/forum",
    Component: ManageForum,
    protected: true,
    isNavbar: true,
  },
  {
    path: "/superAdmin/users",
    Component: ListUser,
    protected: true,
    isNavbar: true,
  },

  {
    path: "/superAdmin/monitoring",
    Component: SearchMonitoringDashboard,
    protected: true,
    isNavbar: true,
  },
  // {
  //   path: "/superAdmin/questions/:id",
  //   Component: QuestionDetail,
  //   protected: true,
  // },
  // { path: "/superAdmin/stats", Component: SearchStats, protected: true },

  { path: "/forum", Component: QuestionList, protected: false, isNavbar: true },
  {
    path: "questions/:id",
    Component: QuestionDetail,
    protected: false,
    isNavbar: true,
  },
  { path: "*", Component: Evaluate, protected: false, isNavbar: true },
];

export const LoggedOutRoutes: Route[] = [
  { path: "/login", Component: Login, protected: false, isNavbar: false },
  { path: "/signup", Component: SignUp, protected: false, isNavbar: false },
  { path: "/", Component: Dashboard, protected: false, isNavbar: false },
];
