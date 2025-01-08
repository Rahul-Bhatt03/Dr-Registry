import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegistryForm from "./pages/SectionA";
import SectionB from "./pages/SectionB";
import SectionC from "./pages/SectionC";
import SectionD from "./pages/SectionD";
import SectionE from "./pages/SectionE";
import SectionF from "./pages/SectionF";
import SectionG from "./pages/SectionG";
import SectionH from "./pages/SectionH";
import SectionI from "./pages/SectionI";
import SectionJ from "./pages/SectionJ";
import SignUp from "./pages/login-info/SignUp";
import SignIn from "./pages/login-info/SignIn";
import "../global.css";
import Layout from "./pages/layout/Layout";
import Home from "./pages/homePage/Home";
import EthnicGroupsCrudPage from "./pages/crudPages/EthnicGroupCrud";
import AdminManagementPage from "./pages/crudPages/AdminsCrud";
import History from "./pages/history/History";
import PatientDetails from "./pages/history/PatientDetails";
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from "./protectedRoute/ProtectedRoute";
import Superadmin from "./pages/superadmin page/Superadmin";
import IndividualHistory from "./pages/history/IndividualHistory";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={["USER", "ADMIN","GROUPADMIN"]}>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Routes that include the Appbar */}
        <Route
          path="/section-Demographic-History"
          element={
            <ProtectedRoute allowedRoles={["USER", "ADMIN","GROUPADMIN"]}>
              <Layout>
                <RegistryForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/section-Medical-History"
          element={
            <ProtectedRoute allowedRoles={["USER", "ADMIN","GROUPADMIN"]}>
              <Layout>
                <SectionB />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/section-Smoking-History"
          element={
            <ProtectedRoute allowedRoles={["USER", "ADMIN","GROUPADMIN"]}>
              <Layout>
                <SectionC />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/section-Systemic-Complications"
          element={
            <ProtectedRoute allowedRoles={["USER", "ADMIN","GROUPADMIN"]}>
              <Layout>
                <SectionD />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/section-Investigation"
          element={
            <ProtectedRoute allowedRoles={["USER", "ADMIN","GROUPADMIN"]}>
              <Layout>
                <SectionE />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/section-Ocular-History"
          element={
            <ProtectedRoute allowedRoles={["USER", "ADMIN","GROUPADMIN"]}>
              <Layout>
                <SectionF />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/section-External-Examination"
          element={
            <ProtectedRoute allowedRoles={["USER", "ADMIN","GROUPADMIN"]}>
              <Layout>
                <SectionG />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/section-Slit-Lamp-Examination"
          element={
            <ProtectedRoute allowedRoles={["USER", "ADMIN","GROUPADMIN"]}>
              <Layout>
                <SectionH />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/section-Fundus-Examination"
          element={
            <ProtectedRoute allowedRoles={["USER", "ADMIN","GROUPADMIN"]}>
              <Layout>
                <SectionI />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/section-DIABETIC-RETINOPATHY"
          element={
            <ProtectedRoute allowedRoles={["USER", "ADMIN","GROUPADMIN"]}>
              <Layout>
                <SectionJ />
              </Layout>
            </ProtectedRoute>
          }
        />
        {/* <Route path="/view-details" element={<ViewDetails />} /> */}

        {/* path for logging in */}
        <Route path="/" element={<SignIn />} />
        <Route path="/signUp" element={<SignUp />} />

        <Route
          path="/ethnicGroup"
          element={
            <ProtectedRoute allowedRoles={[ "ADMIN"]}>
              <EthnicGroupsCrudPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminsGroup"
          element={
            <ProtectedRoute allowedRoles={[ "ADMIN"]}>
              <AdminManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute allowedRoles={["GROUPADMIN",'ADMIN']}>
              {" "}
              <History />
            </ProtectedRoute>
          }
        />
   <Route
          path="/individualHistory"
          element={
            <ProtectedRoute allowedRoles={["USER", "ADMIN","GROUPADMIN"]}>
              {" "}
              <IndividualHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/:id"
          element={
            <ProtectedRoute allowedRoles={["USER", "ADMIN","GROUPADMIN"]}>
              {" "}
              <PatientDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN","GROUPADMIN"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/superadmin"
          element={
            <ProtectedRoute allowedRoles={["SUPERADMIN"]}>
              <Superadmin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
