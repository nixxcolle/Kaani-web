import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Sprout, Trophy, BookOpen, Sparkles, User, LogOut, CheckCircle2 } from "lucide-react";
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
    { name: "Learning Hub", href: "/learning", icon: BookOpen },
    { name: "Quiz Arena", href: "/quiz", icon: Sparkles, badge: "Interactive" },
    { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
    { name: "Sustainability", href: "/sustainability" },
    { name: "Legal Guide", href: "/legal" },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-100/80 bg-white/90 backdrop-blur-md transition-all shadow-sm">
      <div className="container flex h-16 md:h-18 items-center justify-between px-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-hero text-white shadow-sm transition-transform duration-200 group-hover:scale-105 group-hover:shadow-glow">
            <Sprout className="h-5 w-5 text-emerald-100" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold font-heading tracking-tight text-kaani-dark group-hover:text-kaani-primary transition-colors flex items-center gap-1.5">
              KaAni <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold uppercase tracking-wider">Web</span>
            </span>
            <span className="text-[10px] text-muted-foreground font-medium -mt-1 hidden sm:block">Agri-Fisheries Platform</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  active
                    ? "bg-emerald-100/80 text-kaani-primary font-bold shadow-xs"
                    : "text-muted-foreground hover:text-kaani-dark hover:bg-emerald-50/60"
                }`}
              >
                {item.icon && <item.icon className={`h-4 w-4 ${active ? 'text-kaani-primary' : 'text-muted-foreground'}`} />}
                <span>{item.name}</span>
                {item.badge && (
                  <span className="ml-1 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Actions & Profile */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 bg-emerald-50/80 border border-emerald-100/80 rounded-full pl-2 pr-3 py-1">
              <div className="w-8 h-8 rounded-full bg-kaani-primary text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-kaani-dark max-w-[110px] truncate leading-tight">
                  {user.name || "Learner"}
                </span>
                <span className="text-[10px] text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="h-2.5 w-2.5" />
                  {user.is_guest ? "Guest Player" : "Member"}
                </span>
              </div>
              <button
                onClick={handleLogout}
                title="Sign out"
                className="ml-1 p-1 rounded-full text-muted-foreground hover:text-destructive hover:bg-red-50 transition-colors"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-sm font-semibold text-muted-foreground hover:text-kaani-dark hover:bg-emerald-50 rounded-xl"
                asChild
              >
                <Link to="/role-selection">Sign In</Link>
              </Button>
              <Button
                size="sm"
                className="bg-kaani-primary hover:bg-kaani-dark text-white font-semibold rounded-xl shadow-xs transition-all hover:shadow-md"
                asChild
              >
                <Link to="/quiz" className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-200" />
                  Take Quiz
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden text-kaani-dark p-2 rounded-xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Navigation"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-emerald-100 bg-white/98 px-4 py-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200 shadow-lg">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-base font-semibold transition-all ${
                  active
                    ? "bg-emerald-100/90 text-kaani-primary"
                    : "text-muted-foreground hover:text-kaani-dark hover:bg-emerald-50/70"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  {item.icon && <item.icon className="h-5 w-5 text-kaani-primary" />}
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    {item.badge}
                  </span>
                )}
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
                    <p className="text-xs text-muted-foreground">{user.is_guest ? "Guest Player" : "Member"}</p>
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
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button variant="outline" className="rounded-xl border-emerald-200" asChild onClick={() => setIsMenuOpen(false)}>
                  <Link to="/role-selection">Sign In</Link>
                </Button>
                <Button className="bg-kaani-primary hover:bg-kaani-dark text-white rounded-xl" asChild onClick={() => setIsMenuOpen(false)}>
                  <Link to="/quiz">Take Quiz</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;