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
      title: "Bureau of Fisheries and Aquatic Resources (BFAR)",
      subTitle: "Republic of the Philippines • Department of Agriculture",
      role: "Commercial and municipal fishing vessel licensing, aquaculture permits, closed-season notices, and municipal water boundary compliance.",
      url: "https://www.bfar.da.gov.ph",
      domain: "www.bfar.da.gov.ph",
      tag: "Fisheries Authority",
      icon: Shield,
      themeBg: "from-[#082847] via-[#0c3e6d] to-[#072440]",
      badgeBg: "bg-blue-950/90 text-cyan-300 border-cyan-500/50",
      accentBorder: "border-cyan-200/50 group-hover:border-cyan-400",
      hoverGlow: "group-hover:shadow-[0_12px_30px_rgba(0,163,173,0.22)]"
    },
    {
      title: "Environmental Management Bureau (DENR-EMB)",
      subTitle: "Department of Environment and Natural Resources",
      role: "Issuance of Environmental Compliance Certificates (ECC), discharge permits for aquaculture, water quality monitoring, and solid waste compliance.",
      url: "https://emb.gov.ph",
      domain: "emb.gov.ph",
      tag: "Environmental Law",
      icon: Scale,
      themeBg: "from-[#09351e] via-[#105631] to-[#072a18]",
      badgeBg: "bg-emerald-950/90 text-emerald-300 border-emerald-500/50",
      accentBorder: "border-emerald-200/50 group-hover:border-emerald-500",
      hoverGlow: "group-hover:shadow-[0_12px_30px_rgba(16,185,129,0.22)]"
    },
    {
      title: "Public Attorney's Office (PAO)",
      subTitle: "Republic of the Philippines • Department of Justice",
      role: "Free legal representation, legal advice, and affidavits for indigent farmers, municipal fisherfolk, and agrarian reform beneficiaries.",
      url: "https://pao.gov.ph/contact-us",
      domain: "pao.gov.ph",
      tag: "Free Legal Aid",
      icon: Building2,
      themeBg: "from-[#420b11] via-[#6e131d] to-[#36090e]",
      badgeBg: "bg-rose-950/90 text-amber-300 border-amber-400/50",
      accentBorder: "border-rose-200/50 group-hover:border-rose-400",
      hoverGlow: "group-hover:shadow-[0_12px_30px_rgba(218,165,32,0.20)]"
    },
    {
      title: "National Water Resources Board (NWRB)",
      subTitle: "Republic of the Philippines • Water Permitting Authority",
      role: "Water rights permits, commercial deep well extraction licenses, river intake regulation, and agricultural irrigation allocations.",
      url: "https://nwrb.gov.ph",
      domain: "nwrb.gov.ph",
      tag: "Water Rights",
      icon: FileText,
      themeBg: "from-[#052e3c] via-[#0a4b5f] to-[#042430]",
      badgeBg: "bg-teal-950/90 text-teal-300 border-teal-500/50",
      accentBorder: "border-teal-200/50 group-hover:border-teal-400",
      hoverGlow: "group-hover:shadow-[0_12px_30px_rgba(23,126,137,0.22)]"
    },
    {
      title: "Department of Agriculture (DA)",
      subTitle: "Republic of the Philippines • Executive Department",
      role: "National agricultural food security policies, farm input subsidies, machinery modernization grants, and statutory sanitary inspections.",
      url: "https://www.da.gov.ph",
      domain: "www.da.gov.ph",
      tag: "Agricultural Authority",
      icon: Shield,
      themeBg: "from-[#103a1d] via-[#1a5b2f] to-[#0c2f17]",
      badgeBg: "bg-emerald-950/90 text-amber-300 border-amber-400/50",
      accentBorder: "border-amber-200/50 group-hover:border-emerald-500",
      hoverGlow: "group-hover:shadow-[0_12px_30px_rgba(30,107,56,0.22)]"
    },
    {
      title: "Philippine Coast Guard (PCG)",
      subTitle: "Marine Environmental Protection Command",
      role: "Maritime safety enforcement, prevention of illegal fishing in municipal waters, vessel seaworthiness inspection, and marine pollution response.",
      url: "https://coastguard.gov.ph",
      domain: "coastguard.gov.ph",
      tag: "Maritime Law Enforcement",
      icon: Scale,
      themeBg: "from-[#071626] via-[#0d2745] to-[#05111f]",
      badgeBg: "bg-blue-950/90 text-orange-400 border-orange-500/50",
      accentBorder: "border-blue-200/50 group-hover:border-orange-400",
      hoverGlow: "group-hover:shadow-[0_12px_30px_rgba(255,85,0,0.20)]"
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

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-heading text-kaani-dark tracking-tight">
              Legal Guidance Hub
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
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
                  <div
                    key={idx}
                    className={`rounded-3xl border border-slate-200 bg-white shadow-card hover:shadow-elevated transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer ${agency.accentBorder} ${agency.hoverGlow}`}
                    onClick={() => window.open(agency.url, "_blank", "noopener,noreferrer")}
                  >
                    {/* Official .gov.ph Browser Header */}
                    <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 text-slate-300 text-xs font-mono border-b border-slate-800">
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block animate-pulse"></span>
                        <span className="text-slate-400">https://</span>
                        <span className="text-white font-bold tracking-tight truncate">{agency.domain}</span>
                      </div>
                      <span className="flex items-center gap-1 text-[10px] text-cyan-300 bg-cyan-950/90 px-2.5 py-0.5 rounded-full border border-cyan-800 shrink-0 font-medium">
                        <ExternalLink className="h-3 w-3" />
                        <span>Official Portal</span>
                      </span>
                    </div>

                    {/* Authentic Government Agency Banner */}
                    <div className={`p-5 bg-gradient-to-r ${agency.themeBg} text-white flex items-center justify-between gap-4`}>
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs uppercase font-black tracking-wider text-white">
                              {agency.domain.replace("www.", "").toUpperCase()}
                            </span>
                            <Badge className={`text-[9px] py-0 px-1.5 uppercase font-bold ${agency.badgeBg}`}>
                              {agency.tag}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-white/75 line-clamp-1 mt-0.5 font-medium">
                            {agency.subTitle}
                          </p>
                        </div>
                      </div>

                      <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/80 shrink-0">
                        <ExternalLink className="h-4 w-4" />
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="text-lg md:text-xl font-bold font-heading text-slate-900 group-hover:text-kaani-primary transition-colors leading-snug">
                          {agency.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {agency.role}
                        </p>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>Statutory Scope: <strong className="text-slate-900">Official National & Municipal Jurisdiction</strong></span>
                      </div>
                    </div>

                    {/* Footer Action */}
                    <div className="px-6 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-kaani-primary transition-colors">
                      <span className="flex items-center gap-1.5">
                        <span>Open Agency Portal</span>
                        <span className="text-slate-400 font-normal">({agency.domain})</span>
                      </span>
                      <ExternalLink className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Legal Assistance & Guidance CTA */}
      <section className="py-14 bg-gradient-section">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-8 md:p-12 text-center space-y-4 shadow-elevated">
            <Scale className="h-10 w-10 text-emerald-300 mx-auto" />
            <h3 className="text-2xl md:text-3xl font-extrabold font-heading">
              Need Help Navigating Fisheries & Agricultural Policies?
            </h3>
            <p className="text-sm md:text-base text-emerald-100 max-w-xl mx-auto leading-relaxed">
              Access our curated learning modules and statutory guides for municipal waters, licensing protocols, and environmental compliance.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="bg-white hover:bg-emerald-50 text-emerald-950 font-bold rounded-2xl px-8 py-6 shadow-md text-base"
                asChild
              >
                <Link to="/learning">
                  Browse Educational Modules
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