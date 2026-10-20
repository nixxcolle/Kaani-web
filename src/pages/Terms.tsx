import { Link } from "react-router-dom";
import { Scale, ArrowLeft, ShieldCheck, FileText, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-section">
      <Header />
      
      {/* Hero Section */}
      <section className="py-14 md:py-18">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <Link 
              to="/" 
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-kaani-primary transition-colors mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-kaani-primary text-xs font-bold border border-emerald-200">
              <Scale className="h-4 w-4" />
              <span>Platform Policies</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold font-heading text-kaani-dark tracking-tight">
              Terms & Conditions
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Last Updated: March 2026 • Samar State University Research Initiative
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-4 pb-20">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="rounded-3xl shadow-elevated border border-emerald-100 bg-white p-6 md:p-12 space-y-8">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs md:text-sm text-emerald-950 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  KaAni Web is an educational and public-service information initiative. By accessing our learning modules, legal checklists, and interactive quizzes, you acknowledge and agree to the guidelines set forth below.
                </p>
              </div>

              <div className="space-y-6 text-slate-800 text-sm md:text-base leading-relaxed divide-y divide-slate-100">
                <div className="pt-4 first:pt-0">
                  <h2 className="text-xl font-bold font-heading text-slate-900 mb-2">1. Educational & Non-Commercial Purpose</h2>
                  <p className="text-muted-foreground">
                    All guides, modular course materials, and legal summaries provided on KaAni Web are developed for academic research, extension services, and public educational reference for Filipino smallholders, fisherfolk, and students.
                  </p>
                </div>

                <div className="pt-6">
                  <h2 className="text-xl font-bold font-heading text-slate-900 mb-2">2. Regulatory Disclaimer (No Substitute for Formal Legal Counsel)</h2>
                  <p className="text-muted-foreground">
                    While our summaries of RA 8550/10654, BFAR guidelines, and DENR-EMB environmental rules are thoroughly researched, they do not constitute formal legal counsel. For specific boundary litigations or statutory compliance audits, users must consult licensed attorneys, the Public Attorney’s Office (PAO), or official BFAR/DENR legal divisions.
                  </p>
                </div>

                <div className="pt-6">
                  <h2 className="text-xl font-bold font-heading text-slate-900 mb-2">3. Accuracy & Continuous Updates</h2>
                  <p className="text-muted-foreground">
                    Agricultural practices and municipal fisheries ordinances adapt over time. While we strive to maintain current data, KaAni Web encourages cross-verification with your local Municipal Agriculture Office (MAO) or City Fisheries Council.
                  </p>
                </div>

                <div className="pt-6">
                  <h2 className="text-xl font-bold font-heading text-slate-900 mb-2">4. User Account & Community Conduct</h2>
                  <p className="text-muted-foreground">
                    Learners participating in the Quiz Arena and Leaderboard agree to maintain genuine representation, avoid automated scripting or exploits, and foster a respectful environment for peer learning.
                  </p>
                </div>

                <div className="pt-6">
                  <h2 className="text-xl font-bold font-heading text-slate-900 mb-2">5. Privacy & Data Handling</h2>
                  <p className="text-muted-foreground">
                    We value learner privacy. Personal details such as email addresses are utilized strictly for account session verification and leaderboard scores. We never sell or distribute user records to third-party commercial marketing entities.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Terms;
