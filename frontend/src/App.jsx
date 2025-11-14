
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
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
import Home from "./components/Home";
import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/usuarios" element={<ListUsuarios />} />
            <Route path="/recursos" element={<ListRecursos />} />
            <Route path="/reservas" element={<ListReservas />} />
            <Route path="/login" element={<LoginUser />} />
            <Route path="/registrar-usuario" element={<RegisterUser />} />
            <Route path="/registrar-recurso" element={<RegisterRecurso />} />
            <Route path="/registrar-reserva" element={<RegisterReserva />} />
            <Route path="/editar-usuario/:id" element={<EditUsuario />} />
            <Route path="/editar-recurso/:id" element={<EditRecurso />} />
            <Route path="/editar-reserva/:id" element={<EditReserva />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App
