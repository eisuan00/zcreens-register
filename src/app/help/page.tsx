"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  BookOpen,
  HelpCircle,
  Monitor,
  Upload,
  Shield,
  CreditCard,
  Settings,
  Users,
  ChevronDown,
  ChevronRight,
  Star,
  Clock,
  FileText,
  Video,
  MessageCircle
} from "lucide-react";
import Link from "next/link";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const categories = [
    {
      icon: BookOpen,
      title: "Getting Started",
      description: "Learn the basics of using zcreens",
      articles: 12,
      popular: true
    },
    {
      icon: Upload,
      title: "File Uploads",
      description: "Everything about uploading and managing files",
      articles: 8
    },
    {
      icon: Monitor,
      title: "Display & Presentation",
      description: "How to display content on smart TVs",
      articles: 15
    },
    {
      icon: Shield,
      title: "Security & Privacy",
      description: "Keeping your presentations secure",
      articles: 6
    },
    {
      icon: CreditCard,
      title: "Billing & Accounts",
      description: "Managing your subscription and billing",
      articles: 10
    },
    {
      icon: Settings,
      title: "Advanced Features",
      description: "Team management, analytics, and more",
      articles: 9
    }
  ];

  const popularArticles = [
    {
      title: "How to display a presentation on any smart TV",
      category: "Getting Started",
      readTime: "3 min read",
      views: "12.5K views"
    },
    {
      title: "Supported file formats and size limits",
      category: "File Uploads",
      readTime: "2 min read",
      views: "8.2K views"
    },
    {
      title: "Troubleshooting connection issues",
      category: "Display & Presentation",
      readTime: "5 min read",
      views: "6.8K views"
    },
    {
      title: "How to invite team members",
      category: "Advanced Features",
      readTime: "4 min read",
      views: "4.1K views"
    }
  ];

  const faqs = [
    {
      question: "How does zcreens work?",
      answer: "zcreens allows you to upload your presentation files to our secure cloud platform. You then receive a unique screen code that you can enter on any smart TV's web browser to instantly display your content. No apps or additional hardware required."
    },
    {
      question: "What file formats are supported?",
      answer: "We support PDF files, PowerPoint presentations (PPTX, PPT), images (PNG, JPG, GIF), and videos (MP4, MOV). File size is limited by your account's available storage space."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, absolutely. All files are encrypted using 256-bit SSL encryption during upload and storage. Files are automatically deleted after your presentation session ends, and each screen code is unique and expires after use."
    },
    {
      question: "Can I use zcreens offline?",
      answer: "While the initial upload requires an internet connection, you can download presentations for offline viewing with our Pro and Business plans. The smart TV will still need internet access to display the content."
    },
    {
      question: "How many screens can I connect to?",
      answer: "This depends on your plan: Starter (Free) allows 1 screen, Pro allows up to 10 screens simultaneously, and Business allows unlimited screens."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time with no penalties or fees. Your account will remain active until the end of your billing period."
    },
    {
      question: "What if the smart TV doesn't have a web browser?",
      answer: "Most modern smart TVs (2018+) include web browsers. For older TVs, you can use devices like Chromecast, Fire TV Stick, or Apple TV to access our platform through their browsers."
    },
    {
      question: "How do I get a refund?",
      answer: "We offer a 30-day money-back guarantee for all paid plans. Contact our support team with your account details and we'll process your refund within 5-7 business days."
    },
    {
      question: "What are the storage limits for each plan?",
      answer: "Free accounts get 100MB of storage, Pro accounts get 1GB (1000MB), and Business accounts get 5GB (5000MB). Your file uploads are limited by your available storage space rather than individual file size limits."
    }
  ];

  const quickActions = [
    {
      icon: Video,
      title: "Watch Tutorial Videos",
      description: "Step-by-step video guides"
    },
    {
      icon: MessageCircle,
      title: "Contact Support",
      description: "Get help from our team",
      link: "/support"
    },
    {
      icon: FileText,
      title: "Download Guides",
      description: "PDF guides and documentation"
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
              <Link href="/features">
                <Button variant="ghost">Features</Button>
              </Link>
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
        <section className="py-20 text-center bg-white">
          <div className="container mx-auto px-4">
            <Badge className="mb-4 bg-purple-100 text-purple-700">Help Center</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              How can we <span className="text-blue-600">help you?</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Find answers to your questions, learn how to use zcreens, and get the most out of your presentations
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for help articles, guides, and FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-4 text-lg"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                Search
              </Button>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <Card key={index} className="p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <action.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Help Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Find detailed guides and documentation organized by topic
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer relative">
                  {category.popular && (
                    <Badge className="absolute -top-2 -right-2 bg-yellow-500">Popular</Badge>
                  )}
                  <CardHeader className="pb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <category.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{category.articles} articles</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Articles */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Articles</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Most viewed help articles and guides
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {popularArticles.map((article, index) => (
                <Card key={index} className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="text-xs">{article.category}</Badge>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{article.readTime}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Star className="w-3 h-3" />
                          <span>{article.views}</span>
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{article.title}</h3>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Quick answers to the most common questions about zcreens
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                      {openFAQ === index ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </CardHeader>
                  {openFAQ === index && (
                    <CardContent className="border-t bg-gray-50">
                      <p className="text-gray-600">{faq.answer}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Support CTA */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <HelpCircle className="w-16 h-16 mx-auto mb-6 text-blue-200" />
            <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help you 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/support">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  Contact Support
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Live Chat
              </Button>
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
                <li><Button variant="link" className="p-0 h-auto text-gray-400">Help Center</Button></li>
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
