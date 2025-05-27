import { colorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Topbar from "./scenes/global/Topbar";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Dashboard from "./scenes/dashboard/index";
import NavBar from "./scenes/global/NavBar";
import { useContext, useEffect } from "react";
import Login from "./scenes/Login/Login";
import { Toaster } from 'react-hot-toast';
import { AuthContext } from "./context/AuthContext";
import NotFound from "./components/NotFound";
import ManageMembers from "./scenes/ManageMembers/ManageMembers";
import ManageUsers from "./scenes/ManageUsers/ManageUsers";
import ClubDesignations from "./scenes/ClubDesignations/ClubDesignations";
import ClubProfile from "./scenes/ClubProfile/ClubProfile";
import ClubReporting from "./scenes/ClubReporting/ClubReporting";
import CabinetReporting from "./scenes/CabinetReporting/CabinetReporting";
import UserProfile from "./scenes/UserProfile/UserProfile";
import ClubCalendar from "./scenes/ClubCalendar/ClubCalendar";
import ViewClubReports from "./scenes/ViewClubReports/ViewClubReports";
import ViewCabinetReports from "./scenes/ViewCabinetReports/ViewCabinetReports";
import Grievances from "./scenes/Grievances/Grievances";
import Resources from "./scenes/Resources/Resources";
import ClubDashboard from "./scenes/ClubDashboard/ClubDashboard";
import CabinetDashboard from "./scenes/CabinetDashboard/CabinetDashboard";
import ClubCapacity from "./scenes/ClubCapacity/ClubCapacity";
import CabinetCalendar from "./scenes/CabinetCalendar/CabinetCalendar";
import AdminCalendar from "./scenes/AdminCalendar/AdminCalendar";
import AdminDashboard from "./scenes/AdminDashboard/AdminDashboard";
import TRF from "./scenes/TRF/TRF";

function App() {
  const [theme, colorMode] = useMode();
  const { user } = useContext(AuthContext);

  const renderRoutes = () => {
    if (!user) {
      return (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      );
    }

    if (user.userType == "3") {
      return (
        <>
          <NavBar className="navbar" />
          <main className="content">
            <Topbar />
            <Routes>
              <Route path="/club-dashboard" element={<ClubDashboard />} />
              <Route path="/manage-members" element={<ManageMembers />} />
              <Route path="/club-calendar" element={<ClubCalendar />} />
              <Route path="/club-reporting" element={<ClubReporting />} />
              <Route path="/my-club" element={<ClubProfile />} />
              <Route path="/club-desingations" element={<ClubDesignations />} />
              <Route path="/trf" element={<TRF />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/" element={<ClubDashboard />} />
            </Routes>
          </main>
        </>
      );
    }
    if (user.userType == "1") {
      return (
        <>
          <NavBar className="navbar" />
          <main className="content">
            <Topbar />
            <Routes>
              <Route path="/manage-users" element={<ManageUsers />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/admin-calendar" element={<AdminCalendar />} />
              <Route path="/cabinet-report-view" element={<ViewCabinetReports />} />
              <Route path="/club-report-view" element={<ViewClubReports />} />
              <Route path="/grievances" element={<Grievances />} />
              <Route path="/user-profile" element={<UserProfile />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </>
      )
    }
    // cabinet
    if (user.userType == "2") {
      // if treasurer
      if (user.cabinetDesignation == 18){
        return (
          <>
            <NavBar className="navbar" />
            <main className="content">
              <Topbar />
              <Routes>
                <Route path="/cabinet-dashboard" element={<CabinetDashboard />} />
                <Route path="/" element={<CabinetDashboard />} />
                <Route path="/cabinet-calendar" element={<CabinetCalendar />} />
                <Route path="/user-profile" element={<UserProfile />} />
                <Route path="/cabinet-reporting" element={<CabinetReporting />} />
                <Route path="/club-capacity" element={<ClubCapacity />} />
                <Route path="/grievances" element={<Grievances />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </>
        )
      }
      return (
        <>
          <NavBar className="navbar" />
          <main className="content">
            <Topbar />
            <Routes>
              <Route path="/cabinet-dashboard" element={<CabinetDashboard />} />
              <Route path="/" element={<CabinetDashboard />} />
              <Route path="/cabinet-calendar" element={<CabinetCalendar />} />
              <Route path="/cabinet-report-view" element={<ViewCabinetReports />} />
              <Route path="/club-report-view" element={<ViewClubReports />} />
              <Route path="/user-profile" element={<UserProfile />} />
              <Route path="/cabinet-reporting" element={<CabinetReporting />} />
              <Route path="/grievances" element={<Grievances />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </>
      );
    }

    if (user.userType == "4") {
      return (
        <>
          <NavBar className="navbar" />
          <main className="content">
            <Topbar />
            <Routes>
              <Route path="/user-profile" element={<UserProfile />} />
              <Route path="/" element={<UserProfile />} />
              <Route path="/grievances" element={<Grievances />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </>
      )
    }

    return (
      <>
        <NavBar className="navbar" />
        <main className="content">
          <Topbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/manage-users" element={<ManageUsers />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/admin-calendar" element={<AdminCalendar />} />
            <Route path="/cabinet-report-view" element={<ViewCabinetReports />} />
            <Route path="/club-report-view" element={<ViewClubReports />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </>
    );
  };

  return (
    <colorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster />
        <div className="app">
          {renderRoutes()}
        </div>
      </ThemeProvider>
    </colorModeContext.Provider>
  );
}

export default App;
