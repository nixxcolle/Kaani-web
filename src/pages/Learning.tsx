import { BookOpen, PlayCircle, Users, Award, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Learning = () => {
  const modules = [
    {
      title: "Sustainable Farming Basics",
      description: "Learn fundamental principles of sustainable agriculture and soil management.",
      duration: "2 hours",
      lessons: 8,
      difficulty: "Beginner",
      category: "Agriculture"
    },
    {
      title: "Aquaculture Fundamentals",
      description: "Introduction to fish farming techniques and water quality management.",
      duration: "3 hours",
      lessons: 12,
      difficulty: "Beginner",
      category: "Fisheries"
    },
    {
      title: "Integrated Pest Management",
      description: "Eco-friendly approaches to pest control and crop protection.",
      duration: "2.5 hours",
      lessons: 10,
      difficulty: "Intermediate",
      category: "Agriculture"
    },
    {
      title: "Marine Conservation",
      description: "Understanding marine ecosystems and sustainable fishing practices.",
      duration: "2 hours",
      lessons: 9,
      difficulty: "Intermediate",
      category: "Fisheries"
    },
    {
      title: "Modern Irrigation Systems",
      description: "Smart irrigation technologies and water conservation methods.",
      duration: "1.5 hours",
      lessons: 6,
      difficulty: "Advanced",
      category: "Technology"
    },
    {
      title: "Agricultural Economics",
      description: "Market analysis, pricing strategies, and financial planning for farmers.",
      duration: "3 hours",
      lessons: 15,
      difficulty: "Advanced",
      category: "Business"
    }
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Interactive Modules",
      description: "Comprehensive learning modules with practical examples and case studies."
    },
    {
      icon: PlayCircle,
      title: "Video Tutorials",
      description: "Step-by-step video guides demonstrating real-world applications."
    },
    {
      icon: Users,
      title: "Community Forums",
      description: "Connect with peers, ask questions, and share your experiences."
    },
    {
      icon: Award,
      title: "Certificates",
      description: "Earn completion certificates to showcase your new skills and knowledge."
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-section">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <BookOpen className="h-16 w-16 text-kaani-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-kaani-dark mb-6">
              Learning Hub
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Master agriculture and fisheries through interactive modules, video tutorials, and community-driven learning.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search courses, topics, or skills..." 
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center text-kaani-dark mb-12">
            Why Choose Our Learning Platform?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center shadow-card">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 rounded-full bg-kaani-light flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-kaani-primary" />
                  </div>
                  <CardTitle className="text-lg text-kaani-dark">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Modules */}
      <section className="py-16 bg-gradient-section">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center text-kaani-dark mb-12">
            Featured Learning Modules
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <Card key={index} className="shadow-card hover:shadow-elevated transition-smooth">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{module.category}</Badge>
                    <Badge className={getDifficultyColor(module.difficulty)}>{module.difficulty}</Badge>
                  </div>
                  <CardTitle className="text-kaani-dark">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>{module.lessons} lessons</span>
                    <span>{module.duration}</span>
                  </div>
                  <Button className="w-full">Start Learning</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container px-4">
          <Card className="bg-gradient-hero text-white">
            <CardContent className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Your Learning Journey?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of farmers, fishers, and students who are already transforming their practices.
              </p>
              <Button size="lg" variant="secondary">
                Create Free Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Learning;