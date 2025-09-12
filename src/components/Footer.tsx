import { Link } from "react-router-dom";
import { Leaf, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-section border-t mt-20">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-hero">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-kaani-primary">KaAni Web</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Empowering agriculture and fisheries through accessible education, legal guidance, and sustainable innovation.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-kaani-dark">Quick Links</h3>
            <nav className="space-y-2">
              <Link to="/learning" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                Learning Hub
              </Link>
              <Link to="/sustainability" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                Sustainability
              </Link>
              <Link to="/legal" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                Legal Guide
              </Link>
            </nav>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-kaani-dark">Resources</h3>
            <nav className="space-y-2">
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                Tutorials
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                Success Stories
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                Community Forum
              </a>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-kaani-dark">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@kaaniweb.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Agricultural District</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 KaAni Web. All rights reserved. Empowering sustainable agriculture and fisheries.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;