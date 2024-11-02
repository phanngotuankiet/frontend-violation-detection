import "./App.css";
import SignUp from "./components/authentication/SignUp";
import Login from "./components/authentication/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Evaluate from "./components/evaluate/Evaluate";
import ProcessedVideos from "./components/history/ProcessedVideos";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/evaluate" />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/evaluate" element={<Evaluate />} />
          <Route path="/processedVideos" element={<ProcessedVideos />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
