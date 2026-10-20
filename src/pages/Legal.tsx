import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Scale, 
  FileText, 
  CheckSquare, 
  AlertTriangle, 
  Calendar, 
  Shield, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  PhoneCall, 
  Building2, 
  Search,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Legal = () => {
  const [activeChecklistTab, setActiveChecklistTab] = useState<number>(0);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const interactiveChecklists = [
    {
      title: "Municipal Fisherfolk Registration (FishR / BoatR)",
      agency: "BFAR & Municipal LGU",
      description: "Mandatory statutory requirements to operate municipal fishing boats under 3 gross tons.",
      items: [
        { id: "c1-1", label: "Barangay Clearance certifying municipal coastal residency" },
        { id: "c1-2", label: "Government-issued ID or Fisherfolk Identification Card" },
        { id: "c1-3", label: "Vessel admeasurement inspection by Municipal Agriculturist / FARMC" },
        { id: "c1-4", label: "Compliance with non-destructive fishing gear (hook & line / gill net with legal mesh size)" },
        { id: "c1-5", label: "Safety gear onboard: life jackets, compass, and emergency signaling flare" }
      ]
    },
    {
      title: "Environmental Compliance Certificate (ECC)",
      agency: "DENR - Environmental Management Bureau",
      description: "Required for commercial aquaculture ponds, poultry farms, and processing plants.",
      items: [
        { id: "c2-1", label: "Project Description Report (PDR) or Initial Environmental Examination (IEE)" },
        { id: "c2-2", label: "Zoning certification and LGU Resolution of No Objection" },
        { id: "c2-3", label: "Effluent water discharge and biofiltration management plan" },
        { id: "c2-4", label: "Solid and hazardous waste disposal protocol" },
        { id: "c2-5", label: "Public consultation documentation with surrounding community" }
      ]
    },
    {
      title: "Agricultural Labor & Safety Compliance",
      agency: "DOLE & OSHC",
      description: "Protecting farm workers against occupational hazards and securing fair wages.",
      items: [
        { id: "c3-1", label: "Personal Protective Equipment (PPE) provided for pesticide and fertilizer handlers" },
        { id: "c3-2", label: "Safe potable drinking water and sanitary restroom facilities on site" },
        { id: "c3-3", label: "First aid medical kit accessible in field sheds" },
        { id: "c3-4", label: "Compliance with regional agricultural minimum wage orders" }
      ]
    }
  ];

  const legalAgencies = [
    {
      title: "BFAR – Fisheries & Aquatic Resources",
      role: "Fishing vessel licensing, aquaculture permits, closed-season notices",
      url: "https://www.bfar.da.gov.ph",
      tag: "Fisheries Authority",
      icon: Shield
    },
    {
      title: "DENR-EMB – Environmental Management",
      role: "Environmental Compliance Certificates (ECC) and water discharge permits",
      url: "https://emb.gov.ph",
      tag: "Environmental Law",
      icon: Scale
    },
    {
      title: "PAO – Public Attorney's Office",
      role: "Free legal representation and counsel for indigent farmers and fisherfolk",
      url: "https://pao.gov.ph/contact-us",
      tag: "Free Legal Aid",
      icon: Building2
    },
    {
      title: "NWRB – National Water Resources Board",
      role: "Water rights permits, commercial deep well extraction, and irrigation permits",
      url: "https://nwrb.gov.ph",
      tag: "Water Rights",
      icon: FileText
    }
  ];

  // Calculate progress for current checklist
  const currentList = interactiveChecklists[activeChecklistTab];
  const completedCount = currentList.items.filter(item => checkedItems[item.id]).length;
  const progressPercent = (completedCount / currentList.items.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-section">
      <Header />

      {/* Hero Section */}
      <section className="py-14 md:py-20">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-900 text-xs md:text-sm font-bold border border-purple-200">
              <Scale className="h-4 w-4 text-purple-700" />
              <span>Philippine Agricultural & Marine Jurisprudence</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold font-heading text-kaani-dark tracking-tight">
              Legal Guidance Hub
            </h1>

            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Understand your rights under RA 8550/10654, navigate municipal permits, and ensure hassle-free regulatory compliance with interactive checklists.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Compliance Checklist Tool */}
      <section className="py-6 pb-16">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto rounded-3xl bg-white shadow-elevated border border-purple-100 p-6 md:p-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-50 px-3 py-1 rounded-full mb-1">
                  <CheckSquare className="h-3.5 w-3.5 text-purple-600" />
                  <span>Interactive Compliance Checklist</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold font-heading text-slate-900">
                  {currentList.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">{currentList.description}</p>
              </div>

              {/* Progress counter */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Completed</span>
                  <p className="text-base font-extrabold text-purple-900">{completedCount} of {currentList.items.length}</p>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-purple-200 flex items-center justify-center font-bold text-xs text-purple-900">
                  {Math.round(progressPercent)}%
                </div>
              </div>
            </div>

            {/* Checklist Tabs */}
            <div className="flex flex-wrap gap-2">
              {interactiveChecklists.map((list, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveChecklistTab(idx)}
                  className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all border ${
                    activeChecklistTab === idx
                      ? "bg-purple-700 text-white border-purple-700 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-purple-50"
                  }`}
                >
                  {list.title.split("(")[0]}
                </button>
              ))}
            </div>

            {/* Checklist Items */}
            <div className="space-y-3 pt-2">
              {currentList.items.map((item) => {
                const isChecked = !!checkedItems[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3.5 select-none ${
                      isChecked
                        ? "bg-purple-50/80 border-purple-400 text-purple-950 font-medium"
                        : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isChecked ? "bg-purple-700 border-purple-700 text-white" : "border-slate-300 bg-white"
                    }`}>
                      {isChecked && <CheckCircle2 className="h-4 w-4" />}
                    </div>
                    <span className="text-sm md:text-base leading-snug">{item.label}</span>
                  </div>
                );
              })}
            </div>

            {progressPercent === 100 && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center animate-in fade-in duration-300">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto mb-1" />
                <h4 className="text-sm font-bold text-emerald-900">All Requirements Checked!</h4>
                <p className="text-xs text-emerald-700">You are ready to submit your documentation to {currentList.agency}.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Official Government Legal Directories */}
      <section className="py-14 bg-white border-t border-purple-100">
        <div className="container px-4">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-extrabold font-heading text-kaani-dark">
                Official Regulatory Agencies & Portals
              </h2>
              <p className="text-sm text-muted-foreground">
                Verified links to Philippine government agencies governing agriculture and fisheries.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {legalAgencies.map((agency, idx) => {
                const Icon = agency.icon;
                return (
                  <Card
                    key={idx}
                    className="rounded-3xl border border-slate-100 bg-white shadow-card hover:shadow-elevated transition-all p-6 flex flex-col justify-between group cursor-pointer"
                    onClick={() => window.open(agency.url, "_blank", "noopener,noreferrer")}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
                          <Icon className="h-6 w-6" />
                        </div>
                        <Badge variant="outline" className="text-[10px] font-bold uppercase border-purple-200 text-purple-800">
                          {agency.tag}
                        </Badge>
                      </div>

                      <CardTitle className="text-lg font-bold font-heading text-slate-900 group-hover:text-purple-700 transition-colors">
                        {agency.title}
                      </CardTitle>

                      <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                        {agency.role}
                      </CardDescription>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700 group-hover:underline">
                      <span>Visit Official Portal</span>
                      <ExternalLink className="h-4 w-4" />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Legal Knowledge Quiz Challenge CTA */}
      <section className="py-14 bg-gradient-section">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-8 md:p-12 text-center space-y-4 shadow-elevated">
            <Scale className="h-10 w-10 text-purple-300 mx-auto" />
            <h3 className="text-2xl md:text-3xl font-extrabold font-heading">
              Test Your Philippine Fisheries Law Knowledge
            </h3>
            <p className="text-sm md:text-base text-purple-100 max-w-lg mx-auto">
              How well do you know RA 8550 municipal boundaries, prohibited gears, and ECC protocols? Play the quiz and see your rank!
            </p>
            <div className="pt-2">
              <Button
                size="lg"
                className="bg-white hover:bg-purple-50 text-purple-950 font-bold rounded-2xl px-8 py-6 shadow-md text-base"
                asChild
              >
                <Link to="/quiz?start=true">
                  <Sparkles className="h-4 w-4 mr-2 text-amber-500" />
                  Take Fisheries Law Quiz
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Legal;