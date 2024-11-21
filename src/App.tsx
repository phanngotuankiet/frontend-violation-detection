import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { routes } from "./navigation/Routes";
import ProtectedRoute from "./navigation/ProtectedRouteProvider";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {routes.map((route) => {
            if (route.protected) {
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <ProtectedRoute>
                      <route.Component />
                    </ProtectedRoute>
                  }
                />
              );
            }
            return (
              <Route
                key={route.path}
                path={route.path}
                element={<route.Component />}
              />
            );
          })}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
