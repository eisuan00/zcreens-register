"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Mail,
  Phone,
  Clock,
  HelpCircle,
  FileText,
  Video,
  Users,
  Zap,
  CheckCircle,
  ArrowRight,
  BookOpen,
  LifeBuoy
} from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    priority: "",
    message: ""
  });

  const supportOptions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our support team",
      availability: "24/7 for Pro & Business plans",
      action: "Start Chat",
      badge: "Instant"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message about your issue",
      availability: "Response within 24 hours",
      action: "Send Email",
      badge: "Detailed"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with a support specialist",
      availability: "Business hours (9-5 GMT)",
      action: "Call Now",
      badge: "Personal"
    }
  ];

  const helpResources = [
    {
      icon: BookOpen,
      title: "Documentation",
      description: "Complete guides and tutorials",
      link: "/help"
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Step-by-step video guides"
    },
    {
      icon: HelpCircle,
      title: "FAQ",
      description: "Answers to common questions",
      link: "/help"
    },
    {
      icon: Users,
      title: "Community Forum",
      description: "Connect with other users"
    }
  ];

  const quickLinks = [
    "Getting Started Guide",
    "Troubleshooting Connection Issues",
    "File Format Support",
    "Account & Billing",
    "Security & Privacy",
    "API Documentation"
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
              <Link href="/features">
                <Button variant="ghost">Features</Button>
              </Link>
              <Button variant="default">Support</Button>
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
            <Badge className="mb-4 bg-green-100 text-green-700">Support Center</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              We're Here to <span className="text-blue-600">Help</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Get the support you need, when you need it. Our team is standing by to help you
              get the most out of zcreens.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>99.9% Satisfaction</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>&lt; 1hr Response</span>
              </div>
            </div>
          </div>
        </section>

        {/* Support Options */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How Can We Help You?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Choose the support method that works best for you
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {supportOptions.map((option, index) => (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="relative">
                      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <option.icon className="w-8 h-8 text-blue-600" />
                      </div>
                      <Badge className="absolute -top-2 -right-2 bg-green-500">{option.badge}</Badge>
                    </div>
                    <CardTitle className="text-xl">{option.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {option.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-4">{option.availability}</p>
                    <Button className="w-full" variant={index === 0 ? "default" : "outline"}>
                      {option.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card className="p-8">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        placeholder="Brief description of your issue"
                      />
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Please describe your issue or question in detail..."
                      rows={5}
                    />
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Send Message
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Help Resources */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Self-Help Resources</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Find answers quickly with our comprehensive help resources
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {helpResources.map((resource, index) => (
                <Card key={index} className="p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <resource.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{resource.title}</h3>
                  <p className="text-sm text-gray-600">{resource.description}</p>
                </Card>
              ))}
            </div>

            {/* Quick Links */}
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Popular Help Topics</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickLinks.map((link, index) => (
                  <Link key={index} href="/help" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                    <span>{link}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Emergency Support */}
        <section className="py-16 bg-red-50 border-l-4 border-red-500">
          <div className="container mx-auto px-4">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <LifeBuoy className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Emergency Support</h3>
                <p className="text-gray-600 mb-4">
                  Having a critical issue that's preventing you from presenting?
                  Business and Enterprise customers can access our emergency hotline.
                </p>
                <div className="flex items-center space-x-4">
                  <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50">
                    Call Emergency Line
                  </Button>
                  <span className="text-sm text-gray-500">+44 20 7946 0958</span>
                </div>
              </div>
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
                <li><Link href="/features"><Button variant="link" className="p-0 h-auto text-gray-400">Features</Button></Link></li>
                <li><Link href="/"><Button variant="link" className="p-0 h-auto text-gray-400">Pricing</Button></Link></li>
                <li><Button variant="link" className="p-0 h-auto text-gray-400">API</Button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/help"><Button variant="link" className="p-0 h-auto text-gray-400">Help Center</Button></Link></li>
                <li><Button variant="link" className="p-0 h-auto text-gray-400">Contact Us</Button></li>
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
