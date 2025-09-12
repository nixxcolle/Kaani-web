import { Leaf, Recycle, Lightbulb, TrendingUp, Star, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Sustainability = () => {
  const innovations = [
    {
      title: "Hydroponic Farming Systems",
      description: "Soil-less cultivation methods that use 90% less water while increasing yields by 30-50%.",
      category: "Water Conservation",
      impact: "High",
      adoption: "Growing",
      image: "🌱"
    },
    {
      title: "Solar-Powered Irrigation",
      description: "Renewable energy solutions for irrigation systems, reducing electricity costs by up to 80%.",
      category: "Renewable Energy",
      impact: "High",
      adoption: "Moderate",
      image: "☀️"
    },
    {
      title: "Aquaponics Integration",
      description: "Combined fish and plant farming systems that create sustainable food production cycles.",
      category: "Integrated Systems",
      impact: "Medium",
      adoption: "Emerging",
      image: "🐟"
    },
    {
      title: "Precision Agriculture",
      description: "GPS and sensor technology for optimized planting, fertilizing, and harvesting.",
      category: "Technology",
      impact: "High",
      adoption: "Growing",
      image: "🛰️"
    },
    {
      title: "Organic Composting",
      description: "Converting agricultural waste into nutrient-rich soil amendments naturally.",
      category: "Waste Management",
      impact: "Medium",
      adoption: "Widespread",
      image: "♻️"
    },
    {
      title: "Vertical Farming",
      description: "Multi-layer growing systems that maximize yield per square foot in controlled environments.",
      category: "Space Optimization",
      impact: "High",
      adoption: "Emerging",
      image: "🏢"
    }
  ];

  const successStories = [
    {
      title: "Maria's Hydroponic Success",
      location: "Rural Philippines",
      description: "Increased tomato yield by 300% while reducing water usage by 85% using hydroponic systems.",
      impact: "₱50,000 monthly income increase",
      date: "2024"
    },
    {
      title: "Coastal Community Fish Farming",
      location: "Bangladesh",
      description: "Sustainable aquaculture project supporting 200 families with eco-friendly practices.",
      impact: "40% increase in local fish production",
      date: "2023"
    },
    {
      title: "Solar Irrigation Cooperative",
      location: "Kenya",
      description: "50 farmers adopted solar-powered irrigation, reducing costs and improving crop yields.",
      impact: "60% reduction in irrigation costs",
      date: "2024"
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAdoptionColor = (adoption: string) => {
    switch (adoption) {
      case "Widespread": return "bg-blue-100 text-blue-800";
      case "Growing": return "bg-purple-100 text-purple-800";
      case "Moderate": return "bg-orange-100 text-orange-800";
      case "Emerging": return "bg-pink-100 text-pink-800";
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
            <Leaf className="h-16 w-16 text-kaani-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-kaani-dark mb-6">
              Sustainability Hub
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover eco-friendly innovations, success stories, and sustainable solutions that are transforming agriculture and fisheries worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Overview */}
      <section className="py-16">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center text-kaani-dark mb-12">
            Why Sustainable Practices Matter
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center shadow-card">
              <CardHeader>
                <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Recycle className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg text-kaani-dark">Environmental Protection</CardTitle>
                <CardDescription>Preserve natural resources and reduce environmental impact</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center shadow-card">
              <CardHeader>
                <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg text-kaani-dark">Increased Yields</CardTitle>
                <CardDescription>Modern techniques often produce higher crop and fish yields</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center shadow-card">
              <CardHeader>
                <div className="mx-auto w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg text-kaani-dark">Cost Efficiency</CardTitle>
                <CardDescription>Reduce long-term operational costs and improve profitability</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center shadow-card">
              <CardHeader>
                <div className="mx-auto w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg text-kaani-dark">Future-Ready</CardTitle>
                <CardDescription>Prepare for climate change and market demands</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Eco-Friendly Innovations */}
      <section className="py-16 bg-gradient-section">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center text-kaani-dark mb-12">
            Innovative Sustainable Solutions
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {innovations.map((innovation, index) => (
              <Card key={index} className="shadow-card hover:shadow-elevated transition-smooth">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{innovation.image}</span>
                    <div className="flex gap-2">
                      <Badge className={getImpactColor(innovation.impact)}>{innovation.impact} Impact</Badge>
                    </div>
                  </div>
                  <CardTitle className="text-kaani-dark">{innovation.title}</CardTitle>
                  <CardDescription>{innovation.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline">{innovation.category}</Badge>
                    <Badge className={getAdoptionColor(innovation.adoption)}>{innovation.adoption}</Badge>
                  </div>
                  <Button variant="outline" className="w-full">Learn More</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center text-kaani-dark mb-12">
            Real Success Stories
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {successStories.map((story, index) => (
              <Card key={index} className="shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{story.location}</Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {story.date}
                    </div>
                  </div>
                  <CardTitle className="text-kaani-dark">{story.title}</CardTitle>
                  <CardDescription>{story.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-kaani-light p-3 rounded-lg">
                    <p className="font-semibold text-kaani-dark">{story.impact}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-section">
        <div className="container px-4">
          <Card className="bg-gradient-hero text-white">
            <CardContent className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Go Sustainable?</h2>
              <p className="text-xl mb-8 opacity-90">
                Start implementing eco-friendly practices today and join the sustainable agriculture movement.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary">
                  Browse Solutions
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-kaani-primary">
                  Share Your Story
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Sustainability;