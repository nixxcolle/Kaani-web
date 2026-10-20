import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Leaf, 
  Recycle, 
  Lightbulb, 
  TrendingUp, 
  Star, 
  Calendar, 
  ExternalLink, 
  Droplet, 
  Fish, 
  Calculator, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Sustainability = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  // Interactive Impact Calculator state
  const [farmHectares, setFarmHectares] = useState<number>(2);
  const [irrigationType, setIrrigationType] = useState<"flood" | "drip">("drip");

  const estimatedWaterSavedLiters = irrigationType === "drip" ? farmHectares * 1800000 : 0;
  const estimatedFuelSavedPhp = irrigationType === "drip" ? farmHectares * 24000 : 0;

  const innovations = [
    {
      title: "Recirculating Aquaculture Systems (RAS)",
      description: "Closed-loop biofiltration setups that recycle up to 98% of culture water while preventing effluent pollution in coastal waters.",
      category: "Aquaculture & Ocean",
      impact: "High",
      adoption: "Growing",
      icon: Fish,
      metrics: "90% less water consumed",
      url: "https://farmonaut.com/blogs/sustainable-fish-farming-technology-7-eco-innovations"
    },
    {
      title: "Solar-Powered Precision Drip Irrigation",
      description: "Low-pressure micro-tubing powered by solar PV pumps delivers nutrients and moisture directly to plant roots, eliminating diesel costs.",
      category: "Smart Irrigation",
      impact: "High",
      adoption: "Widespread",
      icon: Droplet,
      metrics: "60% water savings & 0 emissions",
      url: "https://masschallenge.org/articles/agriculture-innovation/"
    },
    {
      title: "African Nightcrawler Vermicomposting",
      description: "Biological decomposition of farm waste, banana trunks, and manure into enzyme-rich organic worm castings that restore acidic soil.",
      category: "Circular Bioeconomy",
      impact: "High",
      adoption: "Widespread",
      icon: Recycle,
      metrics: "5x more bioavailable nitrogen",
      url: "https://www.wastex.io/post/what-is-vertical-farming"
    },
    {
      title: "Controlled-Environment Vertical Hydroponics",
      description: "Stacked vertical towers utilizing nutrient-film technique for year-round high-value vegetable yields in urban and peri-urban centers.",
      category: "Vertical Farming",
      impact: "Medium",
      adoption: "Emerging",
      icon: Leaf,
      metrics: "10x yield per square meter",
      url: "https://www.wastex.io/post/what-is-vertical-farming"
    }
  ];

  const successStories = [
    {
      title: "Agriloops: Circular Shrimp and Vegetable Co-Culture",
      location: "European Coastal Lab",
      description: "Pioneering zero-waste aquaculture that captures shrimp metabolic nutrients to fertilize saline-tolerant greens.",
      url: "https://oceans-and-fisheries.ec.europa.eu/news/agriloops-sustainable-shrimp-and-vegetables-thanks-blueinvest-2025-01-31_en",
      date: "2025",
      tag: "Blue Economy"
    },
    {
      title: "Evangeline's Journey: Sustainable Agriculture in the Philippines",
      location: "Philippines (MEDA Project)",
      description: "How climate-smart agricultural training and organic composting empowered rural women smallholders across Region VIII.",
      url: "https://www.meda.org/news/success-stories/evangelines-journey-environmental-innovation-in-the-philippines-transforms-opportunities-for-women-farmers/",
      date: "2024",
      tag: "Community Impact"
    },
    {
      title: "Fostering Innovation in High-Efficiency Agriculture",
      location: "UNDP Global Initiative",
      description: "Startups driving technology adoption for off-grid precision farming and clean river basin protection.",
      url: "https://www.undp.org/egypt/stories/fostering-innovation-egypts-agriculture-success-stories-startups-driving-change",
      date: "2024",
      tag: "Tech Transfer"
    }
  ];

  const filterCategories = ["All", "Aquaculture & Ocean", "Smart Irrigation", "Circular Bioeconomy", "Vertical Farming"];

  const filteredInnovations = selectedFilter === "All"
    ? innovations
    : innovations.filter(i => i.category === selectedFilter);

  return (
    <div className="min-h-screen bg-gradient-section">
      <Header />

      {/* Hero Section */}
      <section className="py-14 md:py-20">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-kaani-primary text-xs md:text-sm font-bold border border-emerald-200">
              <Leaf className="h-4 w-4" />
              <span>Climate-Smart Agriculture & Fisheries</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold font-heading text-kaani-dark tracking-tight">
              Sustainability Hub
            </h1>

            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explore eco-friendly aquaculture, circular soil regeneration, and zero-emission irrigation solutions reshaping livelihoods.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Resource Savings Calculator */}
      <section className="py-8 pb-14">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto rounded-3xl bg-white shadow-elevated border border-emerald-100 p-6 md:p-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full mb-1">
                  <Calculator className="h-3.5 w-3.5" />
                  <span>Interactive Estimator</span>
                </div>
                <h3 className="text-xl font-bold font-heading text-slate-900">
                  Solar Drip Irrigation Impact Estimator
                </h3>
              </div>
              <Badge className="bg-emerald-600 text-white w-fit">Live Calculation</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Farmland Size (Hectares): <span className="text-kaani-primary text-base font-extrabold">{farmHectares} ha</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={farmHectares}
                    onChange={(e) => setFarmHectares(parseFloat(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                  <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                    <span>1 ha</span>
                    <span>5 ha</span>
                    <span>10 ha</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Irrigation Method</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setIrrigationType("drip")}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                        irrigationType === "drip"
                          ? "bg-kaani-primary text-white border-kaani-primary shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      Solar Drip (Eco)
                    </button>
                    <button
                      onClick={() => setIrrigationType("flood")}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                        irrigationType === "flood"
                          ? "bg-slate-700 text-white border-slate-700 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      Traditional Furrow
                    </button>
                  </div>
                </div>
              </div>

              {/* Output Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 flex flex-col justify-between">
                  <div className="text-xs text-sky-800 font-bold uppercase tracking-wider">Est. Water Saved</div>
                  <div className="text-2xl font-black font-heading text-sky-950 mt-2">
                    {(estimatedWaterSavedLiters / 1000).toLocaleString()} m³
                  </div>
                  <div className="text-[11px] text-sky-700 mt-1">Per harvest season</div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex flex-col justify-between">
                  <div className="text-xs text-emerald-800 font-bold uppercase tracking-wider">Est. Diesel Saved</div>
                  <div className="text-2xl font-black font-heading text-emerald-950 mt-2">
                    ₱{estimatedFuelSavedPhp.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-700 mt-1">Pumping fuel savings</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainable Innovations Directory */}
      <section className="py-14 bg-white border-t border-emerald-100">
        <div className="container px-4">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold font-heading text-kaani-dark">
                  Featured Sustainable Technologies
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Proven low-impact innovations ready for practical deployment.
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-1.5">
                {filterCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedFilter(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                      selectedFilter === cat
                        ? "bg-kaani-primary text-white border-kaani-primary shadow-xs"
                        : "bg-white text-muted-foreground border-slate-200 hover:bg-emerald-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {filteredInnovations.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={idx}
                    className="rounded-3xl border border-slate-100 bg-white shadow-card hover:shadow-elevated transition-all p-6 flex flex-col justify-between group cursor-pointer"
                    onClick={() => window.open(item.url, "_blank", "noopener,noreferrer")}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-kaani-primary flex items-center justify-center">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] uppercase font-bold border-emerald-200 text-emerald-800">
                            {item.category}
                          </Badge>
                          <Badge className="text-[10px] bg-emerald-600 text-white">
                            {item.impact} Impact
                          </Badge>
                        </div>
                      </div>

                      <CardTitle className="text-xl font-bold font-heading text-slate-900 group-hover:text-kaani-primary transition-colors">
                        {item.title}
                      </CardTitle>

                      <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </CardDescription>

                      <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs font-semibold text-emerald-900 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>Key Metric: {item.metrics}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-kaani-primary group-hover:underline">
                      <span>Explore Technical Guide</span>
                      <ExternalLink className="h-4 w-4" />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Verified Success Stories */}
      <section className="py-14 bg-gradient-section">
        <div className="container px-4">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-extrabold font-heading text-kaani-dark">
                Real-World Impact Stories
              </h2>
              <p className="text-sm text-muted-foreground">
                Documented initiatives creating lasting transformation in coastal and farming communities.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {successStories.map((story, idx) => (
                <Card
                  key={idx}
                  className="rounded-3xl border border-slate-100 bg-white shadow-card hover:shadow-elevated transition-all p-6 flex flex-col justify-between group cursor-pointer"
                  onClick={() => window.open(story.url, "_blank", "noopener,noreferrer")}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {story.tag}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {story.date}
                      </span>
                    </div>

                    <CardTitle className="text-base font-bold font-heading text-slate-900 group-hover:text-kaani-primary transition-colors leading-snug">
                      {story.title}
                    </CardTitle>

                    <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                      {story.description}
                    </CardDescription>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-kaani-primary">
                    <span>Read Publication</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </div>
                </Card>
              ))}
            </div>

            {/* Quiz Banner CTA */}
            <div className="p-8 rounded-3xl bg-gradient-hero text-white text-center space-y-4 shadow-elevated">
              <Sparkles className="h-8 w-8 text-amber-300 mx-auto" />
              <h3 className="text-2xl font-bold font-heading">
                How Much Did You Learn About Sustainable Practices?
              </h3>
              <p className="text-sm text-emerald-50/90 max-w-lg mx-auto">
                Test your understanding in the Quiz Arena. Select the "Sustainable Agriculture" category to earn points!
              </p>
              <Button 
                size="lg" 
                className="bg-white hover:bg-emerald-50 text-kaani-primary font-bold rounded-2xl px-6 py-6 shadow-md"
                asChild
              >
                <Link to="/quiz?start=true">
                  Take Sustainability Quiz
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

export default Sustainability;