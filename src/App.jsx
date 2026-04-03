import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Header.jsx";
import Home from "./components/Home.jsx";
import Services from "./components/Services.jsx";
import ReadyToGetStarted from "./components/ReadyToGetStarted.jsx";
import About from "./components/About.jsx";
import Contact from "./components/Contact.jsx";
import Locations from "./components/Location.jsx";
import Footer from "./components/Footer.jsx";
import Hero from "./components/Hero.jsx";
import Login from "./components/Login.jsx"; // 👈 create this
import ScrollToTop from "./components/ScrollToTop";
import MainServicesPage from "./admin/ManageMainServicesPage.jsx";
import { Navigate } from "react-router-dom";

import { useAuth } from "./context/AuthContext";
import { useApp } from "./context/AppProvider.jsx";
import LeadsNavigation from "./LeadsForGpgs/LeadsNavigation.jsx";
import EditServicePage from "./admin/EditServicePage.jsx";

// const ProtectedRoute = ({ children }) => {
//   const isAuthenticated = localStorage.getItem("user");

//   // or check from context if you have AuthContext

//   if (!isAuthenticated) {
//     return <Navigate to="/my-account" replace />;
//   }
//   return children;
// };

const PublicRoute = ({ children }) => {
  const { user } = useAuth();

  // if already logged in → block login page
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  // check login
  if (!user) {
    return <Navigate to="/my-account" replace />;
  }

  // check admin role
  if (user.Role !== "admin") {
    return <Navigate to="/" replace />; // or show "Unauthorized"
  }

  return children;
};
const App = () => {
  const { user } = useAuth();
  useEffect(() => {
    if (user) {
      //console.log("Decrypted User:", user);
      //   console.log("User Role:", user.Role);
    }
  }, [user]);

  const location = useLocation();
  const { logout } = useAuth();
  const { username } = useApp();

  const isAdminPage = location.pathname.startsWith("/dashboard");
  const isLeadsPage = location.pathname.startsWith("/gpms-leads");
  // console.log(11111111, isAdminPage, isLeadsPage);

  // useEffect(() => {
  //   const hasHash = window.location.hash;

  //   if (
  //     location.pathname !== "/" ||
  //     (location.pathname !== "/my-account" &&
  //       !location.pathname.startsWith("/dashboard")) ||
  //     hasHash
  //   ) {
  //     navigate("/", { replace: true });
  //   }
  // }, []);
  return (
    <div
      // className="bg-red-600"
      // className="min-h-screen w-full bg-cover bg-center bg-fixed"
      // className="min-h-screen w-full bg-cover bg-center bg-scroll"
      // style={{ backgroundImage: `url(${background9})` }}
      // className="min-h-screen w-full bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: "url('/images/aa.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
      }}
    >
      <Header />
      <ScrollToTop />
      <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Home />
              <Services />
              <About />
              <Contact />
              <Locations />
              {/* <ReadyToGetStarted /> */}
            </>
          }
        />

        {/* Login Page */}
        <Route
          path="/my-account"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        {/*  services dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainServicesPage />
            </ProtectedRoute>
          }
        />
        {/* gpms leads */}
        <Route
          path="/gpms-leads"
          element={
            <ProtectedRoute>
              <LeadsNavigation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-service/:id"
          element={
            <ProtectedRoute>
              <EditServicePage />
            </ProtectedRoute>
          }
        />
      </Routes>
      {!isLeadsPage && !isAdminPage && <Footer />}
    </div>
  );
};

export default App;

// import React from "react";
// import Header from "./components/Header.jsx";
// import Home from "./components/Home.jsx";
// import Services from "./components/Services.jsx";
// import ReadyToGetStarted from "./components/ReadyToGetStarted.jsx";
// import About from "./components/About.jsx";
// import Contact from "./components/Contact.jsx";
// import Locations from "./components/Location.jsx";
// import Footer from "./components/Footer.jsx";
// import Hero from "./components/Hero.jsx";
// const App = () => {
//   return (
//     <div>
//       <Header />
//       <Hero />
//       <Home />
//       <Services />

//       <About />
//       <Contact />
//       <Locations />
//       <ReadyToGetStarted />
//       <Footer />
//     </div>
//   );
// };

// export default App;
