
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import RegisterUser from "./components/RegisterUser";
import LoginUser from "./components/LoginUser";
import RegisterRecurso from "./components/RegisterRecurso";
import RegisterReserva from "./components/RegisterReserva";
import ListUsuarios from "./components/ListUsuarios";
import ListRecursos from "./components/ListRecursos";
import ListReservas from "./components/ListReservas";
import EditUsuario from "./components/EditUsuario";
import EditRecurso from "./components/EditRecurso";
import EditReserva from "./components/EditReserva";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import DashboardHome from "./components/DashboardHome";
import Home from "./components/Home";
import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public/Standalone Routes */}
          <Route path="/login" element={<LoginUser />} />
          <Route path="/registrar-usuario" element={<RegisterUser />} />

          {/* Dashboard Routes */}
          {/* Dashboard Routes (Protected) */}
          <Route element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/usuarios" element={<ListUsuarios />} />
            <Route path="/recursos" element={<ListRecursos />} />
            <Route path="/reservas" element={<ListReservas />} />

            <Route path="/registrar-recurso" element={<RegisterRecurso />} />
            <Route path="/registrar-reserva" element={<RegisterReserva />} />

            <Route path="/editar-usuario/:id" element={<EditUsuario />} />
            <Route path="/editar-recurso/:id" element={<EditRecurso />} />
            <Route path="/editar-reserva/:id" element={<EditReserva />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App
