import Header from "./components/Header/Header";
import Todos from "./components/Todos/Todos";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <ProtectedRoute>
                <Todos />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
