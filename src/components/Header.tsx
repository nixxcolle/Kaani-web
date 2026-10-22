import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Leaf, LogOut, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name?: string; email?: string; is_guest?: boolean } | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const readUser = () => {
      const authStatus = localStorage.getItem('isAuthenticated');
      const storedUser = localStorage.getItem('user');
      if (authStatus === 'true' && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    readUser();
    window.addEventListener('storage', readUser);
    window.addEventListener('auth-change', readUser);
    return () => {
      window.removeEventListener('storage', readUser);
      window.removeEventListener('auth-change', readUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    setUser(null);
    window.dispatchEvent(new Event('auth-change'));
    navigate('/');
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Learning Hub", href: "/learning" },
    { name: "Sustainability", href: "/sustainability" },
    { name: "Legal Guide", href: "/legal" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-100/80 bg-white/95 backdrop-blur-md transition-all shadow-xs">
      <div className="container flex h-16 md:h-18 items-center justify-between px-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-hero text-white shadow-xs transition-transform duration-200 group-hover:scale-105">
            <Leaf className="h-5 w-5 text-emerald-100" />
          </div>
          <span className="text-xl font-extrabold font-heading tracking-tight text-kaani-primary">
            KaAni <span className="text-kaani-dark">Web</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1.5 lg:space-x-2">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-emerald-100/80 text-kaani-primary font-bold shadow-xs"
                    : "text-muted-foreground hover:text-kaani-dark hover:bg-emerald-50/60"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Right side Profile / Auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2.5 bg-emerald-50/80 border border-emerald-100 rounded-full pl-2 pr-3 py-1">
              <div className="w-7 h-7 rounded-full bg-kaani-primary text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <span className="text-xs font-bold text-kaani-dark max-w-[110px] truncate leading-tight">
                {user.name || "Learner"}
              </span>
              <button
                onClick={handleLogout}
                title="Sign out"
                className="ml-1 p-1 rounded-full text-muted-foreground hover:text-destructive hover:bg-red-50 transition-colors"
                aria-label="Logout"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs font-semibold text-muted-foreground hover:text-kaani-dark hover:bg-emerald-50 rounded-xl px-3"
              asChild
            >
              <Link to="/role-selection">Sign In</Link>
            </Button>
          )}
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden text-kaani-dark p-2 rounded-xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Navigation"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-emerald-100 bg-white/98 px-4 py-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200 shadow-lg">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-base font-semibold transition-all ${
                  active
                    ? "bg-emerald-100/90 text-kaani-primary font-bold"
                    : "text-muted-foreground hover:text-kaani-dark hover:bg-emerald-50/70"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span>{item.name}</span>
              </Link>
            );
          })}

          <div className="pt-3 border-t border-emerald-100">
            {user ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-kaani-primary text-white flex items-center justify-center font-bold text-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-kaani-dark">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.is_guest ? "Guest Learner" : "Member"}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="text-xs text-destructive border-red-200 hover:bg-red-50"
                >
                  <LogOut className="h-3.5 w-3.5 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                className="w-full rounded-xl border-emerald-200 text-sm font-semibold" 
                asChild 
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to="/role-selection">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;