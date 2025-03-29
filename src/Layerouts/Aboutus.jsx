import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaAward, FaUsers, FaHandshake, FaCheckCircle, FaHeadset, FaThumbsUp, FaLightbulb,FaLinkedin,FaTwitter,FaMapMarkerAlt,FaEnvelope,FaPhone  } from "react-icons/fa";

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header Banner - matching home page styling */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/40 to-slate-900/60 z-10"></div>
        <img 
          src="/company-banner.jpg" 
          alt="About Us" 
          className="w-full h-48 sm:h-64 md:h-80 object-cover object-center"
          onError={(e) => {
            e.target.src = "/BANNER.png";
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-white p-4 z-20">
          <div className="max-w-3xl text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3 tracking-tight drop-shadow-lg">About Us</h1>
            <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto text-slate-100 drop-shadow-md">
              Learn about our story, mission, and the team behind our products.
            </p>
            <div className="flex justify-center mt-4 sm:mt-6 text-sm">
              <Link to="/" className="text-white hover:text-emerald-200 transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="font-medium">About Us</span>
            </div>
          </div>
        </div>
      </div>

      {/* About Content */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
          {/* Our Story */}
          <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 mb-6 sm:mb-8">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 md:pr-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 relative inline-block mb-6">
                  Our Story
                  <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 sm:w-16 h-1 bg-emerald-500 rounded-full"></span>
                </h2>
                <p className="text-slate-600 mb-4">
                  Founded in 2025, our company began with a simple vision: to provide high-quality products that make everyday life better. What started as a small operation in a garage has grown into a trusted brand serving customers worldwide.
                </p>
                <p className="text-slate-600 mb-4">
                  Our journey has been driven by continuous innovation and a deep commitment to customer satisfaction. We've expanded our product line over the years, but our core values remain unchanged.
                </p>
                <p className="text-slate-600">
                  Today, we're proud to serve thousands of customers across the globe, offering solutions that combine quality, functionality, and style.
                </p>
              </div>
              <div className="md:w-1/2 mt-6 md:mt-0">
                <div className="bg-slate-200 rounded-2xl h-full flex items-center justify-center overflow-hidden shadow-inner">
                  <img 
                    src="/company-history.jpg" 
                    alt="Company History" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.parentElement.innerHTML = '<p class="text-slate-500 p-8">Company timeline image placeholder</p>';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Our Mission & Values */}
          <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 relative inline-block mb-6 text-center w-full">
              Our Mission & Values
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 sm:w-16 h-1 bg-emerald-500 rounded-full"></span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-emerald-50 p-6 rounded-2xl border-l-4 border-emerald-500">
                <h3 className="text-xl font-semibold mb-3 text-slate-800">Our Mission</h3>
                <p className="text-slate-600">
                  To enrich lives by providing innovative, high-quality products that solve real problems and exceed customer expectations, while maintaining a commitment to sustainability and ethical business practices.
                </p>
              </div>
              <div className="bg-emerald-50 p-6 rounded-2xl border-l-4 border-emerald-500">
                <h3 className="text-xl font-semibold mb-3 text-slate-800">Our Vision</h3>
                <p className="text-slate-600">
                  To become the most trusted and beloved brand in our industry, recognized for exceptional product quality, outstanding customer service, and positive impact on communities worldwide.
                </p>
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {[
                {
                  icon: <FaAward className="text-emerald-600 text-3xl mb-4" />,
                  title: "Excellence",
                  description: "We strive for excellence in everything we do, from product design to customer service."
                },
                {
                  icon: <FaUsers className="text-emerald-600 text-3xl mb-4" />,
                  title: "Customer Focus",
                  description: "Our customers are at the heart of every decision we make."
                },
                {
                  icon: <FaHandshake className="text-emerald-600 text-3xl mb-4" />,
                  title: "Integrity",
                  description: "We conduct business with honesty, transparency, and ethical standards."
                }
              ].map((value, index) => (
                <div key={index} className="bg-slate-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4 sm:mb-5 text-xl sm:text-2xl">
                    {value.icon}
                  </div>
                  <h4 className="text-lg font-bold mb-2 text-slate-800">{value.title}</h4>
                  <p className="text-sm sm:text-base text-slate-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Our Team */}
          <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 relative inline-block mb-6 text-center w-full">
              Meet Our Team
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 sm:w-16 h-1 bg-emerald-500 rounded-full"></span>
            </h2>
            <p className="text-slate-600 mb-6 text-center max-w-3xl mx-auto">
              Behind every great product is a team of dedicated professionals. Meet the people who make our vision a reality.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {[
                {
                  name: "Jane Doe",
                  position: "CEO & Founder",
                  bio: "With over 15 years of industry experience, Jane leads our company with vision and passion."
                },
                {
                  name: "John Smith",
                  position: "Chief Product Officer",
                  bio: "John oversees product development, ensuring innovation and quality in everything we create."
                },
                {
                  name: "Emily Johnson",
                  position: "Customer Experience Manager",
                  bio: "Emily ensures that every customer interaction exceeds expectations."
                },
                {
                  name: "Michael Wong",
                  position: "Head of Design",
                  bio: "Michael brings creativity and user-focused design to all our products."
                }
              ].map((member, index) => (
                <div key={index} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white overflow-hidden">
                    <span className="text-2xl font-bold">{member.name.charAt(0)}</span>
                  </div>
                  <h4 className="text-lg font-semibold text-center mb-1 text-slate-800">{member.name}</h4>
                  <p className="text-emerald-600 text-center text-sm mb-3">{member.position}</p>
                  <p className="text-slate-600 text-center text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Why Choose Us */}
          <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 relative inline-block mb-6 text-center w-full">
              Why Choose Us
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 sm:w-16 h-1 bg-emerald-500 rounded-full"></span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: <FaCheckCircle className="text-emerald-600" />,
                  title: "Quality Products",
                  description: "Every product undergoes rigorous testing to ensure it meets our high standards."
                },
                {
                  icon: <FaHeadset className="text-emerald-600" />,
                  title: "Exceptional Service",
                  description: "Our dedicated customer support team is always ready to assist you."
                },
                {
                  icon: <FaThumbsUp className="text-emerald-600" />,
                  title: "Satisfaction Guarantee",
                  description: "We stand behind our products with a 100% satisfaction guarantee."
                },
                {
                  icon: <FaLightbulb className="text-emerald-600" />,
                  title: "Continuous Innovation",
                  description: "We're constantly developing new solutions to meet evolving customer needs."
                }
              ].map((point, index) => (
                <div key={index} className="flex items-start hover:bg-emerald-50 p-4 rounded-lg transition-colors duration-300">
                  <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 mr-4 h-12 w-12 flex items-center justify-center shrink-0">
                    {point.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">{point.title}</h3>
                    <p className="text-slate-600">{point.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Link 
                to="/products" 
                className="px-4 sm:px-8 py-2 sm:py-3 bg-emerald-600 text-white rounded-full text-sm sm:text-base font-medium transition-all duration-300 hover:bg-emerald-700 shadow-md"
              >
                Browse Our Products
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - matching home page footer */}
      <footer className="bg-slate-900 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-1 lg:col-span-2">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">DPT-PRODUCTS</h3>
              <p className="text-sm sm:text-base text-slate-300 mb-4 sm:mb-6 max-w-md">
                We provide high-quality products at competitive prices. Our mission is to ensure customer satisfaction with every purchase.
              </p>
              <div className="flex space-x-3 sm:space-x-4">
                {[FaGithub, FaLinkedin, FaTwitter].map((Icon, index) => (
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
                {['Home', 'Products', 'About Us', 'Contact', 'Privacy Policy'].map((name, i) => (
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

export default AboutUs;