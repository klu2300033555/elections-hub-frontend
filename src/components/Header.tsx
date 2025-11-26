import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Vote, LogOut, Home, BarChart3, Shield } from "lucide-react";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Vote className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">VoteSecure</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>

          {isAuthenticated && user?.role === "VOTER" && (
            <Link to="/vote" className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary">
              <Vote className="h-4 w-4" />
              <span className="hidden sm:inline">Vote</span>
            </Link>
          )}

          <Link to="/results" className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Results</span>
          </Link>

          {isAuthenticated && user?.role === "ADMIN" && (
            <Link to="/admin" className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          )}

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {user?.name}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
