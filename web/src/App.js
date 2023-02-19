/** @format */

import { useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Auth from "./scenes/auth";
import FAQ from "./scenes/faq";
import Calendar from "./scenes/calendar/calendar";
import PatientDetails from "./components/PatientDetails";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import axios from "axios";

function App() {
  const [theme, colorMode] = useMode();
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname === "/";
  const [isSidebar, setIsSidebar] = useState(true);
  const handleFormSubmit = async (values) => {
    try {
      const response = await axios.post("http://192.168.4.21:8000/secure", {
        auth: {
          username: values.firstName,
          password: values.lastName,
        },
      });
      if (response.status === 200) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {!isAuthPage && <Sidebar isSidebar={isSidebar} />}
          <main className="content">
            {!isAuthPage && <Topbar setIsSidebar={setIsSidebar} />}
            <Routes>
              <Route
                path="/"
                element={<Auth handleFormSubmit={handleFormSubmit} />}
              />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/team" element={<Team />} />
              <Route path="/team/:id" element={<PatientDetails />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/faq" element={<FAQ />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
