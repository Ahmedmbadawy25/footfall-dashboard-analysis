import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from "./pages/Dashboard";
// import Unauthorized from "./pages/Unauthorized";
import PrivateRoute from "./components/PrivateRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />

      {/* Private Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* Role-Based Routes */}
      {/* <Route
        path="/admin-panel"
        element={
          <RoleBasedRoute allowedRoles={["admin"]}>
            <AdminPanel />
          </RoleBasedRoute>
        }
      /> */}

      {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}
    </Routes>
  </Router>
);

export default App;
