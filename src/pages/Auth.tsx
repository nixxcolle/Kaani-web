import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, Sparkles, UserCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { signUp, login, createGuestSession } from "@/lib/auth";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const profileParam = searchParams.get('profile') || '';

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: profileParam ? `Learner (${profileParam})` : '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!isLogin && formData.password !== formData.confirmPassword) {
        setError('Passwords do not match!');
        setIsLoading(false);
        return;
      }

      if (!isLogin && formData.password.length < 6) {
        setError('Password must be at least 6 characters long!');
        setIsLoading(false);
        return;
      }

      if (isLogin) {
        const result = await login({
          email: formData.email,
          password: formData.password
        });

        if (result.success && result.user) {
          localStorage.setItem('user', JSON.stringify(result.user));
          localStorage.setItem('isAuthenticated', 'true');
          window.dispatchEvent(new Event('auth-change'));
          navigate('/quiz');
        } else {
          setError(result.error || 'Login failed. Please verify credentials.');
        }
      } else {
        const result = await signUp({
          email: formData.email,
          password: formData.password,
          name: formData.name || formData.email.split('@')[0],
          role: 'user'
        });

        if (result.success && result.user) {
          localStorage.setItem('user', JSON.stringify(result.user));
          localStorage.setItem('isAuthenticated', 'true');
          window.dispatchEvent(new Event('auth-change'));
          navigate('/quiz');
        } else {
          setError(result.error || 'Sign up failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = () => {
    createGuestSession("KaAni Scholar");
    navigate("/quiz");
  };

  return (
    <div className="min-h-screen bg-gradient-section">
      <Header />

      <main className="container px-4 py-8 md:py-14">
        <div className="max-w-lg mx-auto space-y-6">
          
          <Link 
            to="/role-selection" 
            className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold text-muted-foreground hover:text-kaani-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Roles</span>
          </Link>

          <Card className="rounded-3xl shadow-elevated border border-emerald-100 bg-white overflow-hidden">
            <div className="h-2 bg-gradient-accent"></div>
            
            <CardHeader className="text-center pt-8 pb-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-kaani-primary mx-auto flex items-center justify-center mb-3 shadow-inner">
                <User className="h-7 w-7" />
              </div>
              <CardTitle className="text-2xl md:text-3xl font-extrabold font-heading text-kaani-dark">
                {isLogin ? "Welcome Back!" : "Create Free Account"}
              </CardTitle>
              <CardDescription className="text-xs md:text-sm text-muted-foreground">
                Join the Philippine agriculture and fisheries learning platform
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 p-6 md:p-8 pt-0">
              
              {/* Tab Selector */}
              <Tabs 
                value={isLogin ? 'login' : 'signup'} 
                onValueChange={(val) => {
                  setIsLogin(val === 'login');
                  setError(null);
                }} 
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 rounded-2xl p-1 bg-slate-100">
                  <TabsTrigger value="login" className="rounded-xl text-xs md:text-sm font-bold">
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="rounded-xl text-xs md:text-sm font-bold">
                    Create Account
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs md:text-sm text-rose-700 animate-in fade-in duration-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-bold text-slate-700">Full Name / Nickname</Label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        placeholder="e.g. Maria Santos"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pl-10 rounded-xl border-slate-200"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-bold text-slate-700">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="youremail@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 rounded-xl border-slate-200"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs font-bold text-slate-700">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10 rounded-xl border-slate-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-xs font-bold text-slate-700">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-10 rounded-xl border-slate-200"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-kaani-primary hover:bg-kaani-dark text-white font-bold py-6 rounded-xl shadow-md text-base mt-2"
                >
                  {isLoading ? "Processing..." : isLogin ? "Sign In" : "Register Account"}
                </Button>
              </form>

              {/* 1-Click Guest Access Option */}
              <div className="pt-2">
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-4 text-xs font-semibold text-muted-foreground uppercase">Or Quick Access</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleQuickDemo}
                  className="w-full mt-2 border-emerald-200 text-kaani-dark hover:bg-emerald-50 rounded-xl py-5 font-bold text-xs md:text-sm flex items-center justify-center gap-2"
                >
                  <UserCheck className="h-4 w-4 text-kaani-primary" />
                  <span>Continue Instantly as Guest</span>
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Auth;
