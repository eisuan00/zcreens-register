"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Monitor,
  Shield,
  Zap,
  Upload,
  Users,
  Globe,
  Smartphone,
  FileText,
  Presentation,
  Lock,
  BarChart3,
  Settings,
  Wifi,
  Clock,
  CheckCircle,
  Star,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function FeaturesPage() {
  const mainFeatures = [
    {
      icon: Monitor,
      title: "Any Smart TV Compatible",
      description: "Works with any TV that has a web browser - Samsung, LG, Sony, and more. No dongles, no apps to install.",
      benefits: ["Universal compatibility", "No hardware required", "Instant setup"]
    },
    {
      icon: Zap,
      title: "Instant Display",
      description: "Share your screen in seconds. Upload your file, get a unique code, enter it on any TV browser.",
      benefits: ["Under 10 seconds to display", "No waiting for downloads", "Real-time updates"]
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption, secure screen codes, and automatic file deletion ensure your content stays private.",
      benefits: ["256-bit SSL encryption", "Unique session codes", "Auto-delete after use"]
    },
    {
      icon: FileText,
      title: "Multiple Formats",
      description: "Support for PDF, PowerPoint, images, videos, and more. Upload once, display anywhere.",
      benefits: ["PDF & PowerPoint", "Images & videos", "Web presentations"]
    }
  ];

  const allFeatures = [
    {
      icon: Upload,
      title: "Drag & Drop Upload",
      description: "Simple file upload with progress tracking"
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Access from anywhere in the world"
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Invite team members and manage permissions"
    },
    {
      icon: BarChart3,
      title: "Usage Analytics",
      description: "Track presentation views and engagement"
    },
    {
      icon: Lock,
      title: "Password Protection",
      description: "Add extra security with password-protected presentations"
    },
    {
      icon: Settings,
      title: "Custom Branding",
      description: "White-label solution for enterprise customers"
    },
    {
      icon: Wifi,
      title: "Offline Mode",
      description: "Download presentations for offline viewing"
    },
    {
      icon: Clock,
      title: "Scheduled Displays",
      description: "Schedule presentations to auto-display at specific times"
    }
  ];

  const useCases = [
    {
      title: "Business Presentations",
      description: "Perfect for boardrooms, client meetings, and sales presentations",
      icon: Presentation,
      features: ["Professional templates", "Real-time collaboration", "Client access codes"]
    },
    {
      title: "Education & Training",
      description: "Ideal for classrooms, training sessions, and workshops",
      icon: Users,
      features: ["Student-friendly interface", "Multi-screen support", "Progress tracking"]
    },
    {
      title: "Digital Signage",
      description: "Transform any TV into digital signage for restaurants, shops, offices",
      icon: Monitor,
      features: ["Scheduled content", "Remote updates", "Multiple locations"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white font-bold text-2xl w-10 h-10 rounded-lg flex items-center justify-center">
                Z
              </div>
              <span className="text-xl font-semibold text-gray-900">creens</span>
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="default">Features</Button>
              <Link href="/support">
                <Button variant="ghost">Support</Button>
              </Link>
              <Link href="/">
                <Button variant="outline">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <Badge className="mb-4 bg-blue-100 text-blue-700">Features</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Everything You Need for
              <br />
              <span className="text-blue-600">Smart Presentations</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              zcreens makes it incredibly easy to display your content on any smart TV.
              No hardware, no setup, no complexity - just instant, professional presentations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Start Free Today
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Main Features */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Core Features</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Built for modern teams who need to present anywhere, anytime
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {mainFeatures.map((feature, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-600">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* All Features Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete Feature Set</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Everything you need for professional presentations and digital displays
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {allFeatures.map((feature, index) => (
                <Card key={index} className="p-6 text-center hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Built for Every Use Case</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                From boardrooms to classrooms, zcreens adapts to your needs
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {useCases.map((useCase, index) => (
                <Card key={index} className="p-8">
                  <CardHeader className="text-center pb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <useCase.icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{useCase.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {useCase.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {useCase.features.map((feature, i) => (
                        <li key={i} className="flex items-center space-x-3">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Presentations?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of teams already using zcreens to create amazing presentations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/support">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-blue-600 text-white font-bold text-lg w-8 h-8 rounded flex items-center justify-center">
                  Z
                </div>
                <span className="font-semibold">creens</span>
              </div>
              <p className="text-gray-400 text-sm">
                Display presentations on any screen, instantly.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Button variant="link" className="p-0 h-auto text-gray-400">Features</Button></li>
                <li><Link href="/"><Button variant="link" className="p-0 h-auto text-gray-400">Pricing</Button></Link></li>
                <li><Button variant="link" className="p-0 h-auto text-gray-400">API</Button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/help"><Button variant="link" className="p-0 h-auto text-gray-400">Help Center</Button></Link></li>
                <li><Link href="/support"><Button variant="link" className="p-0 h-auto text-gray-400">Contact Us</Button></Link></li>
                <li><Button variant="link" className="p-0 h-auto text-gray-400">Status</Button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Button variant="link" className="p-0 h-auto text-gray-400">Privacy Policy</Button></li>
                <li><Button variant="link" className="p-0 h-auto text-gray-400">Terms of Service</Button></li>
                <li><Button variant="link" className="p-0 h-auto text-gray-400">Security</Button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2024 zcreens. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
