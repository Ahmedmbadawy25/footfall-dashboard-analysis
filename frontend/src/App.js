import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
// import Register from './pages/Register';
import Unauthorized from "./pages/Unauthorized";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from './components/AuthContext';
import AdminLayout from "layouts/admin";


const App = () => (
    <AuthProvider>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Private Routes */}
      <Route element={<PrivateRoute allowedRoles={'admin'}/>}>
        <Route path="/admin/*" element={<AdminLayout />} />
      </Route>

    </Routes>
    </AuthProvider>
);

export default App;
