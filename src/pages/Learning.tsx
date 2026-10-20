import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  Fish, 
  Sprout, 
  Scale, 
  Cpu, 
  CheckCircle2, 
  GraduationCap, 
  FileText,
  Clock,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Learning = () => {
  const learningPaths = [
    {
      role: "For Fisherfolk & Coastal Communities",
      icon: Fish,
      badge: "Fisheries Focus",
      color: "bg-sky-50 border-sky-200 text-sky-900",
      accent: "text-sky-600",
      topics: [
        "Recirculating Aquaculture Systems (RAS) basics",
        "Water quality parameters: DO, Ammonia, and pH balance",
        "Philippine Fisheries Code (RA 8550/10654) compliance",
        "Mangrove preservation and nursery reef protection"
      ],
      linkText: "Explore Fisheries Modules",
      categoryParam: "Fisheries & Marine"
    },
    {
      role: "For Smallholder Crop Farmers",
      icon: Sprout,
      badge: "Agriculture Focus",
      color: "bg-emerald-50 border-emerald-200 text-emerald-900",
      accent: "text-emerald-600",
      topics: [
        "African Nightcrawler vermicomposting setups",
        "Solar-powered drip irrigation blueprints",
        "Integrated Pest Management (IPM) techniques",
        "Organic soil organic matter restoration"
      ],
      linkText: "Explore Agriculture Modules",
      categoryParam: "Sustainable Crops"
    },
    {
      role: "For Students & Agri-Entrepreneurs",
      icon: GraduationCap,
      badge: "Academic & Tech",
      color: "bg-purple-50 border-purple-200 text-purple-900",
      accent: "text-purple-600",
      topics: [
        "Environmental Compliance Certificates (ECC) via DENR",
        "Hydroponic & vertical farming unit economics",
        "Agricultural precision drone multispectral imaging",
        "Preparation for national quiz competitions"
      ],
      linkText: "Explore Agri-Tech & Law",
      categoryParam: "Agri-Tech"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-section">
      <Header />

      {/* Hero Section */}
      <section className="py-14 md:py-20">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-kaani-primary text-xs md:text-sm font-bold border border-emerald-200">
              <BookOpen className="h-4 w-4" />
              <span>Comprehensive Knowledge Center</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold font-heading text-kaani-dark tracking-tight">
              Fisheries & Agriculture <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600">
                Learning Hub
              </span>
            </h1>

            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Step-by-step modular training, practical blueprints, and gamified quizzes designed to build sustainable livelihoods across the Philippines.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                className="bg-kaani-primary hover:bg-kaani-dark text-white rounded-2xl py-6 px-8 shadow-elevated font-bold text-base"
                asChild
              >
                <Link to="/modules">
                  Browse All Modules <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-emerald-200 text-kaani-dark hover:bg-emerald-50 rounded-2xl py-6 px-8 font-bold text-base"
                asChild
              >
                <Link to="/quiz">
                  <Sparkles className="h-4 w-4 mr-2 text-amber-500" />
                  Test Skills in Quiz Arena
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Dual Feature Banners */}
      <section className="py-8 pb-14">
        <div className="container px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            
            {/* Learning Modules Card */}
            <Card className="rounded-3xl border border-emerald-100 bg-white shadow-elevated overflow-hidden group hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div className="h-3 bg-emerald-500"></div>
              <CardHeader className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100/80 text-kaani-primary flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <BookOpen className="h-7 w-7" />
                </div>
                <Badge className="w-fit text-[10px] font-bold uppercase tracking-wider mb-2 bg-emerald-100 text-emerald-800 border-emerald-200">
                  Interactive Library
                </Badge>
                <CardTitle className="text-2xl font-bold font-heading text-slate-900">
                  Modular Training Library
                </CardTitle>
                <CardDescription className="text-sm md:text-base text-muted-foreground mt-2 leading-relaxed">
                  Structured reading modules with key takeaways, diagrams, water quality monitoring, and downloadable references.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <Button 
                  className="w-full bg-kaani-primary hover:bg-kaani-dark text-white font-bold py-6 rounded-xl shadow-xs"
                  asChild
                >
                  <Link to="/modules">
                    Open Modules Library <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quiz Arena Card */}
            <Card className="rounded-3xl border border-amber-200 bg-white shadow-elevated overflow-hidden group hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div className="h-3 bg-amber-500"></div>
              <CardHeader className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-amber-100/80 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Sparkles className="h-7 w-7 text-amber-600" />
                </div>
                <Badge className="w-fit text-[10px] font-bold uppercase tracking-wider mb-2 bg-amber-100 text-amber-800 border-amber-200">
                  Interactive Quiz
                </Badge>
                <CardTitle className="text-2xl font-bold font-heading text-slate-900">
                  Knowledge Quiz Arena
                </CardTitle>
                <CardDescription className="text-sm md:text-base text-muted-foreground mt-2 leading-relaxed">
                  Put what you've learned to the test! Earn XP, maintain combo streaks, and rise on the national community scoreboard.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <Button 
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-6 rounded-xl shadow-xs"
                  asChild
                >
                  <Link to="/quiz">
                    Launch Quiz Arena <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Recommended Learning Pathways */}
      <section className="py-14 bg-white border-t border-emerald-100">
        <div className="container px-4">
          <div className="max-w-5xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-kaani-primary bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Curated Roadmaps
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold font-heading text-kaani-dark">
                Tailored Learning Pathways
              </h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
                Select your focus area to access targeted modules tailored to your daily challenges and objectives.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {learningPaths.map((path, idx) => {
                const Icon = path.icon;
                return (
                  <div
                    key={idx}
                    className={`rounded-3xl border p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all ${path.color}`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-xs">
                          <Icon className={`h-6 w-6 ${path.accent}`} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 border border-current">
                          {path.badge}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold font-heading mb-3">{path.role}</h3>

                      <ul className="space-y-2.5 text-xs md:text-sm mb-6">
                        {path.topics.map((topic, tidx) => (
                          <li key={tidx} className="flex items-start gap-2">
                            <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${path.accent}`} />
                            <span className="opacity-90">{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      className="w-full bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 rounded-xl font-bold text-xs"
                      asChild
                    >
                      <Link to={`/modules?category=${encodeURIComponent(path.categoryParam)}`}>
                        {path.linkText} <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Learning;