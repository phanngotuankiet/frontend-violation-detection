import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { routes } from "./navigation/Routes";
import ProtectedRoute from "./navigation/ProtectedRouteProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.Component />}
            />
          ))}
          <Route path="*" element={<Navigate to="/evaluate" />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </>
  );
}

export default App;
