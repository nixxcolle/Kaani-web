import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, UserCheck, ArrowRight, ArrowLeft } from "lucide-react";
import { createGuestSession } from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem('isAuthenticated');
      const user = localStorage.getItem('user');
      
      if (authStatus === 'true' && user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
    window.addEventListener('auth-change', checkAuth);
    return () => window.removeEventListener('auth-change', checkAuth);
  }, []);

  const handleContinueAsGuest = () => {
    createGuestSession("Guest Learner");
    setIsAuthenticated(true);
  };

  if (isAuthenticated === null) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-section flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-elevated border-emerald-100 bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden">
          <div className="h-2 bg-gradient-accent"></div>
          <CardHeader className="text-center pt-8 pb-4">
            <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-emerald-100/80 flex items-center justify-center shadow-inner">
              <Sparkles className="h-8 w-8 text-kaani-primary" />
            </div>
            <CardTitle className="text-2xl font-bold font-heading text-kaani-dark">
              Welcome to KaAni Learning
            </CardTitle>
            <CardDescription className="text-sm mt-2 text-muted-foreground leading-relaxed">
              Sign in to keep your high scores on the community leaderboard, or continue as a guest for instant access!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pb-8 px-6">
            <Button 
              className="w-full bg-kaani-primary hover:bg-kaani-dark text-white font-semibold py-6 rounded-xl shadow-md transition-all hover:shadow-lg flex items-center justify-center gap-2" 
              size="lg"
              asChild
            >
              <Link to="/auth?role=user">
                Sign In or Create Account <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full border-emerald-200 text-kaani-dark hover:bg-emerald-50 hover:text-kaani-primary font-medium py-6 rounded-xl flex items-center justify-center gap-2 transition-all" 
              size="lg"
              onClick={handleContinueAsGuest}
            >
              <UserCheck className="h-4 w-4 text-emerald-600" />
              Play Instantly as Guest
            </Button>

            <Button 
              variant="ghost" 
              className="w-full text-muted-foreground hover:text-foreground text-sm pt-2" 
              size="sm"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              Return to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
