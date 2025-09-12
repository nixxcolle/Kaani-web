import { Scale, FileText, CheckSquare, AlertTriangle, Calendar, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Legal = () => {
  const legalAreas = [
    {
      title: "Permits & Licenses",
      description: "Essential permits for farming operations, fishing licenses, and business registrations.",
      icon: FileText,
      urgency: "High",
      guides: 12
    },
    {
      title: "Environmental Compliance",
      description: "Environmental impact assessments, waste management regulations, and conservation laws.",
      icon: Shield,
      urgency: "High",
      guides: 8
    },
    {
      title: "Labor & Safety Laws",
      description: "Worker safety regulations, employment laws, and agricultural labor standards.",
      icon: CheckSquare,
      urgency: "Medium",
      guides: 10
    },
    {
      title: "Water Rights & Usage",
      description: "Water allocation permits, irrigation rights, and aquaculture water usage regulations.",
      icon: AlertTriangle,
      urgency: "High",
      guides: 6
    }
  ];

  const recentAlerts = [
    {
      title: "New Seasonal Fishing Ban",
      description: "Updated regulations for marine fishing season effective December 2024",
      type: "Regulation Update",
      deadline: "Dec 1, 2024",
      severity: "High"
    },
    {
      title: "Organic Certification Changes",
      description: "Revised organic farming certification requirements and application process",
      type: "Certification",
      deadline: "Jan 15, 2025",
      severity: "Medium"
    },
    {
      title: "Agricultural Subsidy Applications",
      description: "Government subsidy applications now open for sustainable farming practices",
      type: "Opportunity",
      deadline: "Feb 28, 2025",
      severity: "Low"
    }
  ];

  const checklists = [
    {
      title: "Starting a Farm Business",
      description: "Complete legal checklist for new agricultural operations",
      items: 15,
      category: "Business Setup"
    },
    {
      title: "Aquaculture Licensing",
      description: "Step-by-step guide for fish farming permits and compliance",
      items: 12,
      category: "Fisheries"
    },
    {
      title: "Environmental Assessment",
      description: "Required documentation for environmental impact evaluation",
      items: 8,
      category: "Environment"
    },
    {
      title: "Export Documentation",
      description: "International trade requirements for agricultural products",
      items: 20,
      category: "Trade"
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High": return "border-red-200 bg-red-50";
      case "Medium": return "border-yellow-200 bg-yellow-50";
      case "Low": return "border-green-200 bg-green-50";
      default: return "border-gray-200 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-section">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Scale className="h-16 w-16 text-kaani-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-kaani-dark mb-6">
              Legal Guidance Hub
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Navigate complex agricultural and fisheries laws with simplified guides, interactive checklists, and real-time regulatory updates.
            </p>
          </div>
        </div>
      </section>

      {/* Recent Alerts */}
      <section className="py-16">
        <div className="container px-4">
          <div className="flex items-center gap-2 mb-8">
            <AlertTriangle className="h-6 w-6 text-kaani-primary" />
            <h2 className="text-2xl font-bold text-kaani-dark">Important Legal Updates</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {recentAlerts.map((alert, index) => (
              <Alert key={index} className={getSeverityColor(alert.severity)}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{alert.type}</Badge>
                      <Badge className={getUrgencyColor(alert.severity)}>{alert.severity}</Badge>
                    </div>
                    <h4 className="font-semibold">{alert.title}</h4>
                    <p className="text-sm">{alert.description}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Deadline: {alert.deadline}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Areas */}
      <section className="py-16 bg-gradient-section">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center text-kaani-dark mb-12">
            Legal Areas We Cover
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {legalAreas.map((area, index) => (
              <Card key={index} className="shadow-card hover:shadow-elevated transition-smooth">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-kaani-light flex items-center justify-center">
                        <area.icon className="h-5 w-5 text-kaani-primary" />
                      </div>
                      <Badge className={getUrgencyColor(area.urgency)}>{area.urgency} Priority</Badge>
                    </div>
                  </div>
                  <CardTitle className="text-kaani-dark">{area.title}</CardTitle>
                  <CardDescription>{area.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{area.guides} guides available</span>
                    <Button variant="outline">Explore Guides</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Checklists */}
      <section className="py-16">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center text-kaani-dark mb-12">
            Interactive Legal Checklists
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {checklists.map((checklist, index) => (
              <Card key={index} className="shadow-card hover:shadow-elevated transition-smooth">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit">{checklist.category}</Badge>
                  <CardTitle className="text-lg text-kaani-dark">{checklist.title}</CardTitle>
                  <CardDescription>{checklist.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">{checklist.items} items</span>
                    <CheckSquare className="h-4 w-4 text-kaani-primary" />
                  </div>
                  <Button className="w-full">Start Checklist</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-16 bg-gradient-section">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-kaani-dark mb-8">
              Need Legal Assistance?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center shadow-card">
                <CardHeader>
                  <FileText className="h-12 w-12 text-kaani-primary mx-auto mb-4" />
                  <CardTitle className="text-kaani-dark">Document Templates</CardTitle>
                  <CardDescription>Download legal document templates and forms</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline">Browse Templates</Button>
                </CardContent>
              </Card>
              
              <Card className="text-center shadow-card">
                <CardHeader>
                  <Scale className="h-12 w-12 text-kaani-primary mx-auto mb-4" />
                  <CardTitle className="text-kaani-dark">Legal Consultation</CardTitle>
                  <CardDescription>Connect with agricultural law experts</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline">Find Experts</Button>
                </CardContent>
              </Card>
              
              <Card className="text-center shadow-card">
                <CardHeader>
                  <AlertTriangle className="h-12 w-12 text-kaani-primary mx-auto mb-4" />
                  <CardTitle className="text-kaani-dark">Compliance Alerts</CardTitle>
                  <CardDescription>Get notified about important deadlines</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline">Set Up Alerts</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container px-4">
          <Card className="bg-gradient-hero text-white">
            <CardContent className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">Stay Legally Compliant</h2>
              <p className="text-xl mb-8 opacity-90">
                Don't let complex regulations hold back your agricultural or fisheries business. Get the guidance you need.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary">
                  Start Free Assessment
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-kaani-primary">
                  Contact Legal Expert
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

export default Legal;