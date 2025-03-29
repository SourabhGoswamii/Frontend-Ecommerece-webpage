import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    try {
      // Replace with actual API call when backend is ready
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitStatus({
        success: true,
        message: "Thank you for your message. We'll get back to you shortly!"
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: "Something went wrong. Please try again later."
      });
    } finally {
      setIsSubmitting(false);
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header Banner */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/40 to-slate-900/60 z-10"></div>
        <img 
          src="/contact-banner.jpg" 
          alt="Contact Us" 
          className="w-full h-48 sm:h-64 md:h-80 object-cover object-center"
          onError={(e) => {
            e.target.src = "/BANNER.png";
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-white p-4 z-20">
          <div className="max-w-3xl text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3 tracking-tight drop-shadow-lg">Contact Us</h1>
            <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto text-slate-100 drop-shadow-md">
              We're here to help! Reach out to our customer support team with any questions,
              feedback, or concerns.
            </p>
            <div className="flex justify-center mt-4 sm:mt-6 text-sm">
              <Link to="/" className="text-white hover:text-emerald-200 transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="font-medium">Contact Us</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Contact Information */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 relative inline-block mb-6">
                  Contact Information
                  <span className="absolute -bottom-2 left-0 w-12 h-1 bg-emerald-500 rounded-full"></span>
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 mr-4">
                      <FaMapMarkerAlt />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Our Address</h3>
                      <p className="text-slate-600 mt-1">
                        Plaza Chowk<br />
                        Ranchi, Jharkhand
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 mr-4">
                      <FaPhone />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Phone</h3>
                      <p className="text-slate-600 mt-1">+91 7544970609</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 mr-4">
                      <FaEnvelope />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Email</h3>
                      <p className="text-slate-600 mt-1">dptproducts0@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 mr-4">
                      <FaClock />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Business Hours</h3>
                      <p className="text-slate-600 mt-1">
                        Monday - Friday: 9am - 6pm<br />
                        Saturday: 10am - 4pm<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Social Media Links */}
                <div className="mt-8">
                  <h3 className="font-semibold text-slate-800 mb-3">Follow Us</h3>
                  <div className="flex space-x-3">
                    {[
                      { name: "Facebook", icon: <FaFacebookF /> },
                      { name: "Instagram", icon: <FaInstagram /> },
                      { name: "Twitter", icon: <FaTwitter /> },
                      { name: "LinkedIn", icon: <FaLinkedinIn /> }
                    ].map((social) => (
                      <a 
                        key={social.name}
                        href="https://www.instagram.com/dro.pshipping001?igsh=NjNqenVyazQwcDN2" 
                        className="bg-slate-100 hover:bg-emerald-100 transition-colors p-3 rounded-full text-slate-600 hover:text-emerald-600"
                      >
                        <span className="sr-only">{social.name}</span>
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 relative inline-block mb-6">
                  Send Us a Message
                  <span className="absolute -bottom-2 left-0 w-12 h-1 bg-emerald-500 rounded-full"></span>
                </h2>
                
                {submitStatus && (
                  <div className={`mb-6 p-4 rounded-xl ${
                    submitStatus.success ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500' : 'bg-red-50 text-red-700 border-l-4 border-red-500'
                  }`}>
                    {submitStatus.message}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-slate-700 font-medium mb-2">
                        Your Name*
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-slate-700 font-medium mb-2">
                        Your Email*
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="subject" className="block text-slate-700 font-medium mb-2">
                      Subject*
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="How can we help you?"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-slate-700 font-medium mb-2">
                      Your Message*
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Please describe your inquiry in detail..."
                      required
                    />
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-6 py-3 bg-emerald-600 text-white font-medium rounded-full transition-colors shadow-md ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-emerald-700'
                      }`}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          {/* Map Section */}
          <div className="mt-8 sm:mt-12">
            <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 relative inline-block mb-6">
                Find Us
                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-emerald-500 rounded-full"></span>
              </h2>
              <div className="h-80 sm:h-96 bg-slate-100 rounded-xl overflow-hidden">
                {/* Replace with actual map implementation */}
                <div className="w-full h-full flex items-center justify-center bg-slate-50 border border-slate-200">
                  <p className="text-slate-500">Map placeholder - integrate Google Maps or other map service here</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="mt-8 sm:mt-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 relative inline-block mb-6 text-center w-full">
              Frequently Asked Questions
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 sm:w-16 h-1 bg-emerald-500 rounded-full"></span>
            </h2>
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              {[
                {
                  question: "What are your customer service hours?",
                  answer: "Our customer service team is available Monday through Friday from 9am to 6pm, and Saturday from 10am to 4pm."
                },
                {
                  question: "How quickly do you respond to inquiries?",
                  answer: "We aim to respond to all inquiries within 24 business hours. For urgent matters, please call our customer service line."
                },
                {
                  question: "Can I visit your physical store?",
                  answer: "Yes, our showroom is open during business hours. We recommend scheduling an appointment for personalized assistance."
                },
                {
                  question: "Do you offer international shipping?",
                  answer: "Yes, we ship to many countries worldwide. Shipping rates and delivery times vary by location. You can see shipping options at checkout."
                },
                {
                  question: "What is your return policy?",
                  answer: "We accept returns within 30 days of delivery for most products. Please visit our Return Policy page for more details."
                }
              ].map((faq, index) => (
                <div key={index} className={`p-6 ${index !== 0 ? 'border-t border-slate-200' : ''} hover:bg-slate-50 transition-colors`}>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">{faq.question}</h3>
                  <p className="text-slate-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-1 lg:col-span-2">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">DPT-PRODUCTS</h3>
              <p className="text-sm sm:text-base text-slate-300 mb-4 sm:mb-6 max-w-md">
                We provide high-quality products at competitive prices. Our mission is to ensure customer satisfaction with every purchase.
              </p>
              <div className="flex space-x-3 sm:space-x-4">
                {[FaGithub, FaFacebookF, FaTwitter].map((Icon, index) => (
                  <a 
                    key={index} 
                    href="https://www.instagram.com/dro.pshipping001?igsh=NjNqenVyazQwcDN2" 
                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-emerald-600 hover:text-white transition-all"
                  >
                    <Icon className="text-base sm:text-lg" />
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-emerald-400">Quick Links</h3>
              <ul className="space-y-2 sm:space-y-3">
                {['Home', 'Orders', 'Cart', 'About Us', 'Contact', 'Privacy Policy'].map((name, i) => (
                  <li key={i}>
                    <Link 
                      to={i === 0 ? '/' : `/${name.toLowerCase().replace(' ', '-')}`} 
                      className="text-sm sm:text-base text-slate-300 hover:text-white transition-colors hover:underline underline-offset-4"
                    >
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-emerald-400">Contact Us</h3>
              <address className="not-italic text-sm sm:text-base text-slate-300 space-y-2 sm:space-y-3">
                <p className="flex items-start">
                  <FaMapMarkerAlt className="mr-2 mt-1 text-emerald-400 flex-shrink-0" />
                  <span>Plaza Chowk Ranchi Jharkhand</span>
                </p>
                <p className="flex items-start">
                  <FaEnvelope className="mr-2 mt-1 text-emerald-400 flex-shrink-0" />
                  <span>dptproducts0@gmail.com</span>
                </p>
                <p className="flex items-start">
                  <FaPhone className="mr-2 mt-1 text-emerald-400 flex-shrink-0" />
                  <span>+917544970609</span>
                </p>
              </address>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-6 sm:mt-10 pt-4 sm:pt-6 text-center text-xs sm:text-sm text-slate-400">
            <p>&copy; {new Date().getFullYear()} DPT-PRODUCTS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactUs;