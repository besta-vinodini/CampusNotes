import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ChevronUp,
} from "lucide-react";

export default function CampusNotesFooter() {
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setEmailSubscribed(true);
      setTimeout(() => {
        setEmailSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-white rounded-lg p-2 mr-2">
                <svg
                  className="w-8 h-8 text-blue-600"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold">CampusNotes</h2>
            </div>
            <p className="text-gray-300">
              Your ultimate platform for accessing academic resources, lecture
              notes, and study materials.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b border-blue-500 pb-2 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Subjects
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Resources
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Study Groups
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b border-blue-500 pb-2 mb-4">
              Contact Us
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin
                  className="mr-2 text-blue-400 mt-1 flex-shrink-0"
                  size={18}
                />
                <p className="text-gray-300">
                  123 University Avenue, Campus Center, Building 4
                </p>
              </div>
              <div className="flex items-center">
                <Phone className="mr-2 text-blue-400 flex-shrink-0" size={18} />
                <p className="text-gray-300">(123) 456-7890</p>
              </div>
              <div className="flex items-center">
                <Mail className="mr-2 text-blue-400 flex-shrink-0" size={18} />
                <p className="text-gray-300">info@campusnotes.com</p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b border-blue-500 pb-2 mb-4">
              Newsletter
            </h3>
            <p className="text-gray-300">
              Subscribe to get updates on new notes and resources.
            </p>
            <form onSubmit={handleSubscribe} className="mt-4">
              <div className="flex flex-col space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email"
                  className="px-4 py-2 bg-blue-800 border border-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-blue-300"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 transition-colors rounded-md font-medium"
                >
                  Subscribe
                </button>
                {emailSubscribed && (
                  <p className="text-green-400 mt-2 text-sm">
                    Thank you for subscribing!
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} CampusNotes. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-gray-300 hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white text-sm transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white text-sm transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <div className="fixed bottom-8 right-8">
        <button
          onClick={scrollToTop}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all hover:transform hover:scale-110"
          aria-label="Scroll to top"
        >
          <ChevronUp size={20} />
        </button>
      </div>
    </footer>
  );
}
