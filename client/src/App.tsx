import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { About } from "./pages/About";
import { SignUp } from "./pages/SignUp";
import { SignIn } from "./pages/SignIn";
import { Projects } from "./pages/Projects";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
