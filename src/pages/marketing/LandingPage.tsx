import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, ArrowRight, Clock, Bell, Shield, CreditCard, CheckCircle, Menu, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Helmet } from 'react-helmet-async';

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>Shiftless - Restaurant Order Management Made Simple</title>
        <meta name="description" content="Shiftless automates phone order management, customer notifications, and pickup coordination so you can focus on making great food." />
      </Helmet>
      
      <div className="min-h-screen bg-white overflow-hidden">
        {/* Header/Navigation */}
        <header className="relative bg-white shadow-sm">
          <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-primary-500 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">Shiftless</h1>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-base font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-base font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </a>
              <div className="flex space-x-3">
                <Link to="/login">
                  <Button variant="outline">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="group">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
          
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-b border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a
                  href="#features"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </a>
                <div className="mt-4 px-3 space-y-3">
                  <Link to="/login">
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-primary-50 via-primary-100 to-primary-50 overflow-hidden">
          <div className="absolute inset-y-0 right-0 hidden md:block md:w-1/2 lg:w-2/3">
            <svg className="absolute inset-0 h-full w-full text-white" preserveAspectRatio="none" viewBox="0 0 100 100" fill="currentColor">
              <polygon points="0,0 100,0 50,100 0,100" />
            </svg>
          </div>
          <div className="px-4 pt-16 pb-24 mx-auto max-w-7xl sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col justify-center md:pr-8 lg:pr-16 xl:pr-24">
                <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                  Run your restaurant,<br />
                  <span className="text-primary-600 inline-block relative">
                    not your phone
                    <svg className="absolute -bottom-1 left-0 w-full h-3 text-primary-200 hidden sm:block" viewBox="0 0 358 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 8.5C62.1598 2.95604 242.5 -1.5 356 8.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                    </svg>
                  </span>
                </h2>
                <p className="mt-4 text-lg text-gray-700 sm:text-xl">
                  Shiftless automates phone order management, customer notifications, and pickup coordination so you can focus on what matters most - making great food.
                </p>
                <div className="mt-8 md:mt-10 flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
                  <Link to="/signup">
                    <Button size="lg" className="w-full sm:w-auto group shadow">
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <a href="#features">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      See How It Works
                    </Button>
                  </a>
                </div>
              </div>
              <div className="hidden lg:flex items-center justify-center relative z-10">
                <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transform rotate-1 transition-all hover:rotate-0 hover:scale-105 duration-300">
                  <div className="p-5">
                    <div className="p-3 mb-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-md">
                          <Bell className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-blue-800">New Order!</h3>
                          <p className="text-xs text-blue-600">Just now</p>
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-white rounded-md border border-blue-100">
                        <p className="text-sm font-medium">2x Chicken Parmesan</p>
                        <p className="text-xs text-gray-500">Customer: (555) 123-4567</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          <button className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-md mr-1">Ready in 15 min</button>
                          <button className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md">Custom time</button>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-md">
                          <Clock className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-green-800">Order Ready</h3>
                          <p className="text-xs text-green-600">Customer notified</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-16 sm:py-24 bg-white">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                How Shiftless Works
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Simple, efficient, and designed for busy restaurants
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-y-10 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm transform transition-all duration-300 hover:shadow-md hover:translate-y-[-5px]">
                <div className="p-3 bg-primary-100 rounded-full w-14 h-14 flex items-center justify-center mb-5">
                  <Bell className="h-7 w-7 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Automated Order Intake</h3>
                <p className="mt-3 text-gray-600">
                  Vapi handles customer calls, taking orders automatically and sending them directly to your dashboard in real-time.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="ml-2 text-sm text-gray-600">24/7 order processing</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="ml-2 text-sm text-gray-600">Natural language understanding</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm transform transition-all duration-300 hover:shadow-md hover:translate-y-[-5px]">
                <div className="p-3 bg-primary-100 rounded-full w-14 h-14 flex items-center justify-center mb-5">
                  <Clock className="h-7 w-7 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">One-Click Prep Times</h3>
                <p className="mt-3 text-gray-600">
                  Set pickup times with one click, and we'll automatically notify customers when their order is ready for pickup.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="ml-2 text-sm text-gray-600">Automatic SMS notifications</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="ml-2 text-sm text-gray-600">Customizable prep times</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm transform transition-all duration-300 hover:shadow-md hover:translate-y-[-5px]">
                <div className="p-3 bg-primary-100 rounded-full w-14 h-14 flex items-center justify-center mb-5">
                  <Shield className="h-7 w-7 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Secure & Reliable</h3>
                <p className="mt-3 text-gray-600">
                  Industry-standard security keeps your order data safe, with 99.9% uptime so you never miss an order.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="ml-2 text-sm text-gray-600">End-to-end data encryption</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="ml-2 text-sm text-gray-600">Real-time status updates</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Customer testimonial section */}
            <div className="mt-20 bg-primary-50 py-10 px-6 rounded-2xl">
              <div className="max-w-3xl mx-auto text-center">
                <h3 className="text-2xl font-bold text-gray-900">What Our Customers Say</h3>
                
                <div className="mt-8">
                  <blockquote className="relative">
                    <svg className="absolute top-0 left-0 transform -translate-x-6 -translate-y-8 h-16 w-16 text-primary-100" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                    <p className="relative text-lg text-gray-700 font-medium mt-2">
                      "Since implementing Shiftless, we've cut our order processing time by 70%. Our staff can focus on cooking great food instead of juggling phone orders."
                    </p>
                  </blockquote>
                  <div className="mt-4">
                    <p className="text-base font-semibold text-gray-900">Maria Rodriguez</p>
                    <p className="text-sm text-gray-600">Owner, Taqueria El Sol</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 bg-gray-50 sm:py-24">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Simple Pricing
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Get started today with a 7-day free trial
              </p>
            </div>

            <div className="mt-16 max-w-lg mx-auto">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transform transition-all hover:shadow-xl hover:scale-[1.01] duration-300">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                  <div>
                    <h3 className="inline-flex items-center text-2xl font-bold text-gray-900">
                      Pro Plan
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        Most Popular
                      </span>
                    </h3>
                    <p className="mt-2 text-gray-600">Everything you need to manage orders efficiently</p>
                  </div>
                </div>
                
                <div className="mt-6 flex items-baseline">
                  <span className="text-5xl font-extrabold text-gray-900">$39</span>
                  <span className="ml-1 text-xl text-gray-600">/month</span>
                </div>
                
                <ul className="mt-8 space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="ml-3 text-gray-600">Unlimited orders per month</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="ml-3 text-gray-600">Automated SMS notifications</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="ml-3 text-gray-600">Full dashboard access</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="ml-3 text-gray-600">Priority support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="ml-3 text-gray-600">Custom phone number (optional)</span>
                  </li>
                </ul>
                
                <div className="mt-8">
                  <Link to="/signup">
                    <Button size="lg" className="w-full group shadow">
                      <CreditCard className="mr-2 h-5 w-5" />
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <p className="mt-3 text-center text-sm text-gray-500">
                    No credit card required for trial. Cancel anytime.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-12">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center md:justify-between">
              <div className="flex items-center mb-6 md:mb-0">
                <ChefHat className="h-8 w-8 text-primary-500 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Shiftless</h2>
              </div>
              <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-6 md:mb-0">
                <a href="#features" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
                  Features
                </a>
                <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
                  Pricing
                </a>
                <a href="#" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
                  Terms
                </a>
                <a href="#" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
                  Privacy
                </a>
                <a href="#" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
                  Contact
                </a>
              </nav>
            </div>
            <div className="mt-8 border-t border-gray-200 pt-8">
              <p className="text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Shiftless. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}