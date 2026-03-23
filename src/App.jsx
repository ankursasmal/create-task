import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminLayout from "./pages/AdminLayout";
 import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./context/AdminRoute";
 

 
 
function App() {
  return (
    <Routes>

       <Route path="/login" element={<Login />} />

       <Route element={<PrivateRoute />}>
        
         <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Route>

      </Route>

      {/* 🔁 DEFAULT */}
      <Route path="*" element={<Navigate to="/login" />} />

    </Routes>
  );
}

export default App;