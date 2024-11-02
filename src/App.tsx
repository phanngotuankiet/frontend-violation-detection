import "./App.css";
import SignUp from "./components/authentication/SignUp";
import Login from "./components/authentication/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Evaluate from "./components/evaluate/Evaluate";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/evaluate" />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/evaluate" element={<Evaluate />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
