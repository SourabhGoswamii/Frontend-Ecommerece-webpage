import React from "react";
import { Link } from "react-router-dom";
import { FaShieldAlt, FaUserShield, FaDatabase, FaClipboardList, FaLock, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import Loading from "../components/Loading";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header Banner */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/40 to-slate-900/60 z-10"></div>
        <img 
          src="/privacy-banner.jpg" 
          alt="Privacy Policy" 
          className="w-full h-48 sm:h-64 md:h-80 object-cover object-center"
          onError={(e) => {
            e.target.src = "/BANNER.png";
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-white p-4 z-20">
          <div className="max-w-3xl text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3 tracking-tight drop-shadow-lg">Privacy Policy</h1>
            <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto text-slate-100 drop-shadow-md">
              Learn how we collect, use, and protect your personal information.
            </p>
            <div className="flex justify-center mt-4 sm:mt-6 text-sm">
              <Link to="/" className="text-white hover:text-emerald-200 transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="font-medium">Privacy Policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
          <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 relative inline-block mb-6 text-center w-full">
              Your Privacy Matters
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 sm:w-16 h-1 bg-emerald-500 rounded-full"></span>
            </h2>
            <p className="text-slate-600 mb-8 text-center max-w-3xl mx-auto">
              At DPT Products, we value your privacy and are committed to protecting your personal information. This policy outlines how we collect, use, and safeguard your data when you use our services.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  icon: <FaDatabase className="text-emerald-600" />,
                  title: "Information We Collect",
                  description: "We collect data such as your name, email, address, and payment details when you make a purchase or create an account."
                },
                {
                  icon: <FaClipboardList className="text-emerald-600" />,
                  title: "How We Use Your Information",
                  description: "We use your data to process orders, improve our services, send you relevant communications, and personalize your shopping experience."
                },
                {
                  icon: <FaShieldAlt className="text-emerald-600" />,
                  title: "Data Protection",
                  description: "We implement security measures including encryption and access controls to protect your information against unauthorized access."
                }
              ].map((item, index) => (
                <div key={index} className="bg-slate-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4 sm:mb-5 text-xl sm:text-2xl">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-slate-800">{item.title}</h3>
                  <p className="text-sm sm:text-base text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-emerald-50 p-6 rounded-2xl border-l-4 border-emerald-500 mb-8">
              <h3 className="text-xl font-semibold mb-3 text-slate-800">Information We Collect</h3>
              <p className="text-slate-600 mb-4">
                We may collect the following types of information:
              </p>
              <ul className="list-disc pl-5 text-slate-600 space-y-2">
                <li>Personal Information (name, email, phone number, shipping address)</li>
                <li>Transaction Information (purchase history, payment details)</li>
                <li>Device Information (IP address, browser type, operating system)</li>
                <li>Usage Data (how you interact with our website)</li>
                <li>Marketing Preferences (your communication preferences)</li>
              </ul>
            </div>

            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="md:w-1/2 bg-slate-50 p-6 rounded-2xl">
                <h3 className="text-xl font-semibold mb-3 text-slate-800 flex items-center">
                  <FaUserShield className="text-emerald-500 mr-2" /> Your Privacy Rights
                </h3>
                <p className="text-slate-600 mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-5 text-slate-600 space-y-2">
                  <li>Access and receive a copy of your personal data</li>
                  <li>Request correction of your personal data</li>
                  <li>Request deletion of your personal data</li>
                  <li>Withdraw consent for data processing</li>
                  <li>Object to processing of your personal data</li>
                  <li>Request restrictions on processing your data</li>
                </ul>
              </div>
              
              <div className="md:w-1/2 bg-slate-50 p-6 rounded-2xl">
                <h3 className="text-xl font-semibold mb-3 text-slate-800 flex items-center">
                  <FaLock className="text-emerald-500 mr-2" /> Data Security
                </h3>
                <p className="text-slate-600 mb-4">
                  We take the following measures to protect your data:
                </p>
                <ul className="list-disc pl-5 text-slate-600 space-y-2">
                  <li>Secure Socket Layer (SSL) technology for secure transactions</li>
                  <li>Regular security assessments and monitoring</li>
                  <li>Limited access to personal information by authorized personnel</li>
                  <li>Encryption of sensitive data</li>
                  <li>Regular updates to security practices to address new threats</li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <p className="text-slate-600 mb-6 max-w-3xl mx-auto">
                This privacy policy was last updated on March 29, 2025. If you have any questions about our privacy practices or would like to exercise your privacy rights, please contact us.
              </p>
              <Link 
                to="/contact" 
                className="px-4 sm:px-8 py-2 sm:py-3 bg-emerald-600 text-white rounded-full text-sm sm:text-base font-medium transition-all duration-300 hover:bg-emerald-700 shadow-md"
              >
                Contact Us About Privacy
              </Link>
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

export default PrivacyPolicy;