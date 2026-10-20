import { Link } from "react-router-dom";
import { Sprout, Mail, Phone, MapPin, Heart, ShieldCheck, Trophy, Sparkles } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-white to-emerald-50/50 border-t border-emerald-100/80 mt-20">
      <div className="container px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-hero text-white shadow-sm">
                <Sprout className="h-5 w-5 text-emerald-100" />
              </div>
              <span className="text-2xl font-bold font-heading text-kaani-dark">
                KaAni <span className="text-kaani-primary">Web</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Empowering farmers, fisherfolk, and students with accessible legal guidance, modern sustainable agriculture techniques, and interactive educational quizzes.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-100/70 w-fit px-3 py-1.5 rounded-full border border-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
              Samar State University Research Initiative
            </div>
          </div>

          {/* Learning & Quizzes */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-kaani-dark font-heading">Interactive Learning</h3>
            <nav className="flex flex-col space-y-2.5">
              <Link to="/quiz" className="text-sm text-muted-foreground hover:text-kaani-primary transition-colors flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                Quiz Arena
              </Link>
              <Link to="/leaderboard" className="text-sm text-muted-foreground hover:text-kaani-primary transition-colors flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5 text-amber-500" />
                Community Leaderboard
              </Link>
              <Link to="/learning" className="text-sm text-muted-foreground hover:text-kaani-primary transition-colors">
                Learning Modules
              </Link>
              <Link to="/modules" className="text-sm text-muted-foreground hover:text-kaani-primary transition-colors">
                Downloadable Guides
              </Link>
            </nav>
          </div>

          {/* Policies & Guides */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-kaani-dark font-heading">Resources</h3>
            <nav className="flex flex-col space-y-2.5">
              <Link to="/sustainability" className="text-sm text-muted-foreground hover:text-kaani-primary transition-colors">
                Sustainability Hub
              </Link>
              <Link to="/legal" className="text-sm text-muted-foreground hover:text-kaani-primary transition-colors">
                Philippine Fisheries Code (RA 8550)
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-kaani-primary transition-colors">
                Terms of Service & Privacy
              </Link>
              <a 
                href="https://www.bfar.da.gov.ph" 
                target="_blank" 
                rel="noreferrer"
                className="text-sm text-muted-foreground hover:text-kaani-primary transition-colors"
              >
                BFAR Official Portal
              </a>
            </nav>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-kaani-dark font-heading">Get in Touch</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-kaani-primary shrink-0" />
                <a href="mailto:kaaniwebb@gmail.com" className="hover:text-kaani-dark transition-colors">kaaniwebb@gmail.com</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-kaani-primary shrink-0" />
                <span>09305846861</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-kaani-primary shrink-0 mt-0.5" />
                <span>Samar State University, Catbalogan City, Samar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-emerald-100/80 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} KaAni Web. Built with dedication for Philippine agriculture and fisheries.</p>
          <p className="flex items-center gap-1">
            Empowering sustainable harvests with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;