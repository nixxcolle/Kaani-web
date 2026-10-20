import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Sprout, ArrowLeft, Home, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: Non-existent route accessed:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-section flex flex-col justify-between">
      <Header />

      <main className="container px-4 py-16 flex-1 flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-6 bg-white p-8 md:p-12 rounded-3xl shadow-elevated border border-emerald-100">
          <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-kaani-primary mx-auto flex items-center justify-center shadow-inner">
            <Sprout className="h-10 w-10 text-kaani-primary animate-bounce" />
          </div>

          <div className="space-y-2">
            <h1 className="text-6xl font-black font-heading text-kaani-dark">404</h1>
            <h2 className="text-xl font-bold font-heading text-slate-800">Page Not Found</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Looks like this path hasn't been cultivated yet or the page was moved.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <Button className="bg-kaani-primary hover:bg-kaani-dark text-white rounded-xl py-5 font-bold" asChild>
              <Link to="/" className="flex items-center justify-center gap-2">
                <Home className="h-4 w-4" />
                <span>Return to Homepage</span>
              </Link>
            </Button>
            <Button variant="outline" className="border-emerald-200 rounded-xl py-5 font-bold" asChild>
              <Link to="/quiz" className="flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>Play Quiz Arena Instead</span>
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
