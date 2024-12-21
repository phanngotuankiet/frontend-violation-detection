import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { LoggedInRoutes, LoggedOutRoutes } from "./navigation/Routes";
import ProtectedRoute from "./navigation/ProtectedRouteProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./context/AuthContext";
import { useEffect, useState } from "react";
import Navbar from "./components/dashboard/Navbar";

function App() {
  const { accessToken, user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    setIsAdmin(user?.role === "admin");
  }, [user]);

  const routes = accessToken ? LoggedInRoutes : LoggedOutRoutes;

  return (
    <>
      <BrowserRouter>
        {/* Hiển thị Navbar nếu có route cần */}
        {routes.some((route) => route.isNavbar) && (
          <Navbar
            isAdmin={isAdmin}
            setIsLogoutModalOpen={setIsLogoutModalOpen}
          />
        )}
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.protected ? (
                  <ProtectedRoute>
                    <route.Component />
                  </ProtectedRoute>
                ) : (
                  <route.Component />
                )
              }
            />
          ))}
          {/* Điều hướng mặc định khi route không tồn tại */}
          <Route
            path="*"
            element={<Navigate to={accessToken ? "/" : "/login"} />}
          />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </>
  );
}

export default App;
