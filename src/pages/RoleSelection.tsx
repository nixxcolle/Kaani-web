import { useText } from "@/lib/translate";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Sparkles, Sprout, Fish, GraduationCap, UserCheck } from "@/components/icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createGuestSession } from "@/lib/auth";

const RoleSelection = () => {
  const tx = useText();
  const navigate = useNavigate();

  const handleRoleSelect = (roleName: string) => {
    navigate(`/auth?role=user&profile=${encodeURIComponent(roleName)}`);
  };

  const handleInstantGuest = () => {
    createGuestSession("Guest Explorer");
    navigate("/quiz");
  };

  const personas = [
    {
      title: "Student & Researcher",
      icon: GraduationCap,
      description: "Preparing for fisheries or agriculture exams, participating in quizzes, and studying comprehensive modules.",
      badge: "Academic",
      color: "border-sky-200 bg-sky-50/50 hover:border-sky-400",
      iconColor: "text-sky-600 bg-sky-100"
    },
    {
      title: "Farmer or Fisherfolk",
      icon: Sprout,
      description: "Looking for practical sustainable techniques, solar drip blueprints, and simplified legal permit checklists.",
      badge: "Livelihood",
      color: "border-emerald-200 bg-emerald-50/50 hover:border-emerald-400",
      iconColor: "text-emerald-600 bg-emerald-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-section">
      <Header />

      <main className="container px-4 py-8 md:py-14">
        <div className="max-w-3xl mx-auto space-y-8">
          
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-muted-foreground hover:text-kaani-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{tx("Return to Homepage")}</span>
          </Link>

          {/* Heading */}
          <div className="text-center space-y-3">
            <Badge className="bg-emerald-100 text-kaani-primary border-emerald-200 font-bold uppercase tracking-wider text-xs">{tx("Personalized Experience")}</Badge>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading text-kaani-dark">{tx("Choose How You Want to Learn")}</h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">{tx("Sign in with your preferred profile to customize your experience, or jump right in as a guest!")}</p>
          </div>

          {/* Role Cards */}
          <div className="grid sm:grid-cols-2 gap-6">
            {personas.map((p, idx) => {
              const Icon = p.icon;
              return (
                <Card 
                  key={idx}
                  className={`rounded-3xl border-2 shadow-card hover:shadow-elevated transition-all duration-300 cursor-pointer p-6 flex flex-col justify-between group ${p.color}`}
                  onClick={() => handleRoleSelect(p.title)}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform ${p.iconColor}`}>
                        <Icon className="h-7 w-7" />
                      </div>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold border-current">
                        {tx(p.badge)}
                      </Badge>
                    </div>

                    <CardTitle className="text-xl font-bold font-heading text-slate-900 group-hover:text-kaani-primary transition-colors">
                      {tx(p.title)}
                    </CardTitle>

                    <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                      {tx(p.description)}
                    </CardDescription>
                  </div>

                  <div className="pt-6">
                    <Button 
                      className="w-full bg-kaani-primary hover:bg-kaani-dark text-white rounded-xl font-bold py-5"
                    >{tx("Continue as ")}{tx(p.title.split(" ")[0])}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Instant Guest Mode Box */}
          <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-md text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-kaani-primary font-bold text-sm">
              <UserCheck className="h-5 w-5" />
              <span>{tx("In a hurry?")}</span>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground max-w-md mx-auto">{tx("You can play quizzes and read all learning modules immediately without creating an account.")}</p>
            <Button
              variant="outline"
              onClick={handleInstantGuest}
              className="border-emerald-300 text-kaani-primary hover:bg-emerald-50 rounded-xl font-bold px-6"
            >{tx("Play Instantly as Guest")}</Button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RoleSelection;
