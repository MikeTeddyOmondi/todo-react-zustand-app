import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = async () => {
    try {
      await axios.post("logout", {}, { withCredentials: true });
    } catch (_err) {
      // logout may fail, but we still clear auth
    }
    // Always clear local auth
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login", { replace: true });
  };

  return (
    <header className="border-b">
      <div className="container flex items-center justify-between px-4 py-4 mx-auto">
        <Link to="/" className="text-2xl font-bold">
          Todo App
        </Link>
        <nav className="flex items-center gap-4">
          {!token ? (
            <>
              <Button variant="ghost" onClick={() => navigate("/register")}>
                Sign Up
              </Button>
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Login
              </Button>
            </>
          ) : (
            <Button onClick={handleLogout} variant="outline" className="border-outline">
              Logout
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
