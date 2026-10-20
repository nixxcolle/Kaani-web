import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  Leaf, 
  Scale, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  Sparkles, 
  Trophy, 
  Fish, 
  Sprout, 
  ShieldCheck, 
  Lightbulb, 
  Cpu, 
  ChevronRight,
  TrendingUp,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-agriculture.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [quickAnswer, setQuickAnswer] = useState<string | null>(null);
  const [quickRevealed, setQuickRevealed] = useState<boolean>(false);

  // Quick challenge question for homepage teaser
  const quickQuestion = {
    q: "Under Philippine law (RA 8550/10654), how far do municipal waters extend for artisanal fisherfolk?",
    options: [
      { id: "A", text: "5 kilometers" },
      { id: "B", text: "15 kilometers", isCorrect: true },
      { id: "C", text: "25 kilometers" },
      { id: "D", text: "50 nautical miles" },
    ],
    explanation: "Under RA 8550 and RA 10654, municipal waters extend up to 15 kilometers (approx. 8.1 nautical miles) from the coastline, reserved exclusively for local small-scale fisherfolk!"
  };

  const handleQuickSelect = (id: string) => {
    setQuickAnswer(id);
    setQuickRevealed(true);
  };

  const features = [
    {
      icon: BookOpen,
      title: "Interactive Learning Hub",
      description: "Step-by-step modular courses on aquaculture, soil biology, RAS setups, and modern cultivation.",
      href: "/learning",
      tag: "Self-Paced Courses",
      color: "text-emerald-600 bg-emerald-50 border-emerald-100"
    },
    {
      icon: Sparkles,
      title: "Gamified Quiz Arena",
      description: "Test your skills with multiple difficulty tiers, timed speed challenges, and combo streak bonuses.",
      href: "/quiz",
      tag: "Interactive & Fun",
      color: "text-amber-600 bg-amber-50 border-amber-100"
    },
    {
      icon: Scale,
      title: "Philippine Legal Guide",
      description: "Simplified regulations, BFAR permits, ECC compliance, water rights, and interactive checklists.",
      href: "/legal",
      tag: "RA 8550 & Compliances",
      color: "text-purple-600 bg-purple-50 border-purple-100"
    },
    {
      icon: Leaf,
      title: "Sustainability Innovations",
      description: "Discover vertical farming, solar-powered drip irrigation, biofilters, and circular shrimp setups.",
      href: "/sustainability",
      tag: "Eco-Friendly Tech",
      color: "text-sky-600 bg-sky-50 border-sky-100"
    }
  ];

  const statMetrics = [
    { number: "100%", label: "Free Open-Access Education" },
    { number: "15 km", label: "Municipal Coastal Coverage" },
    { number: "4 Core", label: "Pillars: Crops, Fish, Law & Tech" },
    { number: "24/7", label: "Accessible on Mobile & Desktop" }
  ];

  const challengesSolved = [
    {
      problem: "Dense Legal Jargon",
      solution: "Simplified, plain-language guides to BFAR permits, RA 8550/10654, and DENR regulations with interactive checklists."
    },
    {
      problem: "Expensive Chemical Inputs",
      solution: "Low-cost regenerative farming, vermicomposting, and natural biological pest management techniques."
    },
    {
      problem: "Overfished & Polluted Waters",
      solution: "Eco-friendly Recirculating Aquaculture Systems (RAS), mangrove restoration, and sustainable pond stocking."
    },
    {
      problem: "Lack of Knowledge Feedback",
      solution: "Interactive quizzes with instant explanations, community leaderboard, and rewarding skill progression."
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden hero-mesh text-white py-20 md:py-28 lg:py-32">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>

        <div className="relative container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-xs md:text-sm font-bold shadow-glow">
              <Sprout className="h-4 w-4 text-emerald-400 animate-pulse" />
              <span>Samar State University • Agriculture & Fisheries Innovation</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-heading tracking-tight leading-[1.1]">
              Empowering Filipino <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-sky-300">
                Farmers & Fisherfolk
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl md:text-2xl text-emerald-50/90 font-normal max-w-2xl mx-auto leading-relaxed">
              Demystifying laws, sharing practical sustainable techniques, and connecting communities with interactive learning to maximize every harvest.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-8 py-6 rounded-2xl shadow-elevated transition-all hover:scale-105 flex items-center justify-center gap-2 text-base"
                asChild
              >
                <Link to="/quiz">
                  <Sparkles className="h-5 w-5 text-emerald-900" />
                  <span>Enter Quiz Arena</span>
                </Link>
              </Button>

              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/40 bg-white/10 hover:bg-white hover:text-emerald-950 text-white font-bold px-8 py-6 rounded-2xl backdrop-blur-sm transition-all text-base"
                asChild
              >
                <Link to="/learning" className="flex items-center gap-2">
                  <span>Explore Modules</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="bg-white border-y border-emerald-100 shadow-sm py-6 md:py-8">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center max-w-5xl mx-auto">
            {statMetrics.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-2xl sm:text-3xl font-black font-heading text-kaani-primary">
                  {item.number}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Quick-Test Challenge Teaser */}
      <section className="py-16 bg-gradient-section">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-elevated border border-emerald-100 p-6 md:p-8 relative overflow-hidden">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-kaani-primary bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <HelpCircle className="h-3.5 w-3.5" />
                <span>10-Second Quick Challenge</span>
              </div>
              <span className="text-xs text-muted-foreground font-medium">Test your knowledge right here</span>
            </div>

            <h3 className="text-lg md:text-xl font-bold font-heading text-slate-900 mb-6">
              {quickQuestion.q}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {quickQuestion.options.map((opt) => {
                const isSelected = quickAnswer === opt.id;
                let btnStyle = "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50";
                
                if (quickRevealed) {
                  if (opt.isCorrect) {
                    btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-300";
                  } else if (isSelected && !opt.isCorrect) {
                    btnStyle = "border-rose-400 bg-rose-50 text-rose-900";
                  }
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleQuickSelect(opt.id)}
                    className={`p-3.5 rounded-xl border-2 text-left text-sm font-semibold transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt.id}. {opt.text}</span>
                    {quickRevealed && opt.isCorrect && <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {quickRevealed && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs md:text-sm text-emerald-900 animate-in fade-in duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <p>
                  <strong>Insight:</strong> {quickQuestion.explanation}
                </p>
                <Button 
                  size="sm" 
                  className="bg-kaani-primary hover:bg-kaani-dark text-white rounded-xl shrink-0 font-bold"
                  asChild
                >
                  <Link to="/quiz">Play Full Quiz Arena <ArrowRight className="h-3.5 w-3.5 ml-1" /></Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Comprehensive Features Showcase */}
      <section className="py-20 bg-white">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center mb-14 space-y-3">
            <h2 className="text-3xl md:text-5xl font-extrabold font-heading text-kaani-dark">
              Everything You Need to Succeed
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Designed specifically for Philippine coastal and agricultural communities, bridging research from academia directly to the field.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={idx} 
                  className="rounded-3xl border border-slate-100 shadow-card hover:shadow-elevated transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 bg-white"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs ${feature.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider border-slate-200 text-muted-foreground">
                        {feature.tag}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold font-heading text-slate-900 group-hover:text-kaani-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button 
                      variant="ghost" 
                      className="w-full text-kaani-primary hover:text-kaani-dark hover:bg-emerald-50 rounded-xl justify-between font-bold text-sm"
                      asChild
                    >
                      <Link to={feature.href}>
                        <span>Explore</span>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Challenges & Solutions */}
      <section className="py-20 bg-gradient-section">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center mb-14 space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-wider text-kaani-primary bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
              Transforming Challenges into Opportunities
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold font-heading text-kaani-dark">
              How KaAni Bridges the Gap
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Smallholder farmers and municipal fisherfolk face complex hurdles. We provide practical, actionable solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {challengesSolved.map((item, idx) => (
              <div 
                key={idx} 
                className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    The Challenge
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">{item.problem}</h4>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                    The KaAni Solution
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.solution}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Call to Action */}
      <section className="py-20 bg-white">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-hero text-white p-8 md:p-14 text-center shadow-elevated relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md text-emerald-200 flex items-center justify-center mx-auto border border-white/20">
                <Users className="h-8 w-8" />
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading">
                Join Our Growing Agri Community
              </h2>

              <p className="text-base md:text-lg text-emerald-50/90 max-w-xl mx-auto leading-relaxed">
                Whether you are a student preparing for board exams, a smallholder farmer exploring organic techniques, or a fisherfolk championing marine reserves, KaAni is here for you.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Button 
                  size="lg" 
                  className="bg-white hover:bg-emerald-50 text-kaani-primary font-bold px-8 py-6 rounded-2xl shadow-md text-base"
                  asChild
                >
                  <Link to="/quiz">
                    Start Playing Quiz Arena <Sparkles className="h-4 w-4 ml-2 text-amber-500" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/40 text-white hover:bg-white/10 font-bold px-8 py-6 rounded-2xl text-base"
                  asChild
                >
                  <Link to="/learning">Browse All Modules</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;