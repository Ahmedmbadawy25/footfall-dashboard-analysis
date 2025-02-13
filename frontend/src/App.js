import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
// import Register from './pages/Register';
import Dashboard from "./pages/Dashboard";
import Unauthorized from "./pages/Unauthorized";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from './components/AuthContext';


const App = () => (
  <Router>
    <AuthProvider>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Private Routes */}
      <Route element={<PrivateRoute allowedRoles={'admin'}/>}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

    </Routes>
    </AuthProvider>
  </Router>
);

export default App;
