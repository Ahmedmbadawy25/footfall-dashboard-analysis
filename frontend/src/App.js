import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
// import Register from './pages/Register';
import Unauthorized from "./pages/Unauthorized";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from './components/AuthContext';
import { StoreProvider } from "./components/StoreContext";
import AdminLayout from "layouts/admin";


const App = () => (
    <AuthProvider>
      <StoreProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Private Routes */}
          <Route element={<PrivateRoute allowedRoles={'admin'}/>}>
            <Route path="/admin/*" element={<AdminLayout />} />
          </Route>

        </Routes>
      </StoreProvider>
    </AuthProvider>
);

export default App;
