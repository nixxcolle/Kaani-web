import { Link } from "react-router-dom";
import { BookOpen, Leaf, Scale, Users, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-agriculture.jpg";

const Index = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Learning Hub",
      description: "Organized modules, tutorials, and interactive quizzes for farmers, fishers, and students.",
      href: "/learning",
      color: "text-blue-600"
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description: "Eco-friendly innovations, success stories, and modern agricultural solutions.",
      href: "/sustainability",
      color: "text-green-600"
    },
    {
      icon: Scale,
      title: "Legal Guide",
      description: "Simplified legal guidance, permits, regulations, and compliance checklists.",
      href: "/legal",
      color: "text-purple-600"
    }
  ];

  const benefits = [
    "Complex laws made simple and accessible",
    "Practical guides for real-world applications",
    "Interactive learning with quizzes and tutorials",
    "Community connection and knowledge sharing",
    "Up-to-date regulatory information",
    "Sustainable farming and fishing practices"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
        <div className="relative container px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Empowering Agriculture & Fisheries
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Simplifying laws, sharing practical guides, and connecting communities to maximize harvests and sustainable practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/learning" className="flex items-center gap-2">
                  Start Learning <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-kaani-primary" asChild>
                <Link to="/legal">Legal Guidance</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-16 bg-gradient-section">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-kaani-dark mb-6">
              Addressing Critical Challenges
            </h2>
            <p className="text-lg text-muted-foreground">
              We tackle the complex issues facing agriculture and fisheries communities through accessible education and practical solutions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-kaani-dark">The Problems We Solve</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-destructive mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Complex Legal Framework</h4>
                    <p className="text-sm text-muted-foreground">Agricultural and fisheries laws are scattered, technical, and hard to understand.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-destructive mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Knowledge Gaps</h4>
                    <p className="text-sm text-muted-foreground">Learning materials are too technical and not accessible in rural areas.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-destructive mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Sustainability Issues</h4>
                    <p className="text-sm text-muted-foreground">Limited access to modern, eco-friendly farming and fishing solutions.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-kaani-dark">Our Solution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-kaani-primary mt-0.5" />
                    <p className="text-sm">{benefit}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-kaani-dark mb-6">
              Comprehensive Platform Features
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to succeed in modern agriculture and fisheries, all in one place.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-card hover:shadow-elevated transition-smooth group">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-kaani-light flex items-center justify-center mb-4 group-hover:bg-kaani-primary transition-smooth">
                    <feature.icon className="h-8 w-8 text-kaani-primary group-hover:text-white transition-smooth" />
                  </div>
                  <CardTitle className="text-kaani-dark">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button asChild variant="outline" className="group-hover:border-kaani-primary group-hover:text-kaani-primary transition-smooth">
                    <Link to={feature.href} className="flex items-center gap-2">
                      Explore <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 bg-gradient-section">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Users className="h-16 w-16 text-kaani-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-kaani-dark mb-6">
              Join Our Growing Community
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Connect with students, farmers, fishers, and experts. Share knowledge, ask questions, and grow together in a supportive environment.
            </p>
            <Button size="lg" asChild>
              <Link to="/learning" className="flex items-center gap-2">
                Get Started Today <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;