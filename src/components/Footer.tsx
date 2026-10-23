import { Link } from "react-router-dom";
import { 
  Sprout, 
  Mail, 
  Phone, 
  MapPin, 
  Heart, 
  ShieldCheck, 
  Trophy, 
  Sparkles,
  Store,
  BookOpen,
  Scale,
  Leaf
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0b3827] text-white border-t border-emerald-950 mt-20 relative overflow-hidden">
      {/* Decorative subtle background wave overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="container mx-auto px-4 lg:px-8 pt-16 pb-12 relative z-10">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-emerald-800/60">
          {/* Brand Column */}
          <div className="space-y-4 lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 group inline-flex">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 text-white shadow-sm">
                <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 21C7 13.5 13.5 6 25 7C25 18 18 25 10 25C8.3 25 7 23.7 7 21Z" fill="#34d399" />
                  <path d="M10 23C13 19 17 14 24 9" stroke="#064e3b" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M4 25.5C7.5 23.5 10.5 26.5 14 24.5C17.5 22.5 20.5 25.5 24 23.5C27 21.8 29.5 24 31 23" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" />
                  <path d="M6 28.5C9 26.5 12 28.8 15 27C18 25.2 21 28 24 26.5" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black uppercase tracking-wider text-white font-heading">
                  Kaani <span className="text-emerald-400">Web</span>
                </span>
                <span className="text-[11px] font-medium tracking-wide text-emerald-200/80">
                  Learn &bull; Sell &bull; Grow &bull; Innovate
                </span>
              </div>
            </Link>

            <p className="text-sm text-emerald-100/80 max-w-sm leading-relaxed">
              Empowering farmers and fisherfolk with digital marketplace access, accessible legal compliance, sustainable farming innovations, and interactive education.
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs font-semibold text-emerald-300 bg-emerald-900/60 border border-emerald-700/60 w-fit px-3 py-1.5 rounded-full">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Samar State University Research Initiative
            </div>
          </div>

          {/* Kaani Marketplace Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-300 font-heading flex items-center gap-2">
              <Store className="h-4 w-4 text-emerald-400" />
              Kaani Market
            </h3>
            <nav className="flex flex-col space-y-2.5">
              <Link to="/market" className="text-sm text-emerald-100/70 hover:text-white transition-colors">
                Browse All Harvests
              </Link>
              <Link to="/market?cat=Vegetables+%26+Fruits" className="text-sm text-emerald-100/70 hover:text-white transition-colors">
                Fresh Produce & Fruits
              </Link>
              <Link to="/market?cat=Fish+%26+Seafood" className="text-sm text-emerald-100/70 hover:text-white transition-colors">
                Coastal Fisheries & Seafood
              </Link>
              <Link to="/market?cat=Rice+%26+Grains" className="text-sm text-emerald-100/70 hover:text-white transition-colors">
                Local Rice & Grains
              </Link>
              <Link to="/market?action=sell" className="text-sm text-emerald-300 font-semibold hover:text-emerald-200 transition-colors flex items-center gap-1.5">
                Sell Your Products &rarr;
              </Link>
            </nav>
          </div>

          {/* Education & Resources */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-300 font-heading flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-400" />
              Resources & Learning
            </h3>
            <nav className="flex flex-col space-y-2.5">
              <Link to="/learning" className="text-sm text-emerald-100/70 hover:text-white transition-colors">
                Learning Modules
              </Link>
              <Link to="/quiz" className="text-sm text-emerald-100/70 hover:text-white transition-colors flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                Knowledge Recall Quiz
              </Link>
              <Link to="/legal" className="text-sm text-emerald-100/70 hover:text-white transition-colors">
                Legal Guides & RA 8550
              </Link>
              <Link to="/sustainability" className="text-sm text-emerald-100/70 hover:text-white transition-colors">
                Sustainability Hub
              </Link>
            </nav>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-300 font-heading">
              Connect With Us
            </h3>
            <div className="space-y-3 text-sm text-emerald-100/80">
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
                <a href="mailto:kaaniwebb@gmail.com" className="hover:text-white transition-colors">
                  kaaniwebb@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>+63 930 584 6861</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Samar State University, Catbalogan City, Samar, Philippines</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar Matching Reference Design */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
          {/* Quick legal navigation */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-emerald-200/90 font-medium">
            <Link to="/" className="hover:text-white transition-colors">About Us</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Privacy Policy</Link>
            <a href="mailto:kaaniwebb@gmail.com" className="hover:text-white transition-colors">Contact</a>
          </div>

          {/* Cursive script motto & social icons */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <span className="font-script text-2xl text-emerald-300 tracking-wide text-center">
              Together for a stronger agriculture and fisheries sector.
            </span>

            {/* Social Icons */}
            <div className="flex items-center gap-3 text-emerald-200">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-full bg-emerald-800/80 hover:bg-emerald-700 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
                </svg>
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-full bg-emerald-800/80 hover:bg-emerald-700 flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15V9l5.2 3-5.2 3z"/>
                </svg>
              </a>
              <a 
                href="https://bfar.da.gov.ph" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-full bg-emerald-800/80 hover:bg-emerald-700 flex items-center justify-center transition-colors"
                aria-label="BFAR Portal"
              >
                <Sprout className="w-4 h-4 text-emerald-300" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright notice */}
        <div className="mt-8 pt-4 border-t border-emerald-800/40 text-center text-xs text-emerald-300/60">
          &copy; {new Date().getFullYear()} KaAni Web. Made with dedication for Philippine agriculture and fisheries communities.
        </div>
      </div>
    </footer>
  );
};

export default Footer;