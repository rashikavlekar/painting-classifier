import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Aurora from "../components/Aurora";
import "../components/about.css";

const items = [
  {
    image: "https://i.pravatar.cc/300?img=1",
    title: "Sarah Johnson",
    subtitle: "Frontend Developer",
    handle: "@sarahjohnson",
    borderColor: "#3B82F6",
    gradient: "linear-gradient(145deg, #3B82F6, #000)",
    url: "https://github.com/sarahjohnson",
  },
  {
    image: "https://i.pravatar.cc/300?img=2",
    title: "Mike Chen",
    subtitle: "Backend Engineer",
    handle: "@mikechen",
    borderColor: "#10B981",
    gradient: "linear-gradient(180deg, #10B981, #000)",
    url: "",
  },
  {
    image: "https://i.pravatar.cc/300?img=3",
    title: "Emily Davis",
    subtitle: "UI/UX Designer",
    handle: "@emilydavis",
    borderColor: "#EC4899",
    gradient: "linear-gradient(145deg, #EC4899, #000)",
    url: "",
  },
  {
    image: "https://i.pravatar.cc/300?img=4",
    title: "Raj Patel",
    subtitle: "DevOps Engineer",
    handle: "@rajpatel",
    borderColor: "#F59E0B",
    gradient: "linear-gradient(180deg, #F59E0B, #000)",
    url: "",
  },
  {
    image: "https://i.pravatar.cc/300?img=5",
    title: "Anna Lee",
    subtitle: "Project Manager",
    handle: "@annalee",
    borderColor: "#8B5CF6",
    gradient: "linear-gradient(145deg, #8B5CF6, #000)",
    url: "",
  },
];

const About = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Aurora colors remain constant for both themes
  const auroraColors = ["#3A29FF", "#FF94B4", "#FF3232"];

  const links = [
    { name: "Upload Artwork", path: "/upload" },
    { name: "Gallery", path: "/gallery" },
    { name: "About Us", path: "/about" },
    { name: "History", path: "/history" },
    { name: "Home", path: "/" },
  ];

  return (
    <div className="relative bg-white dark:bg-black text-black dark:text-white min-h-screen overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
      <Aurora
  className="absolute top-0 left-0 w-1/2 h-full"
  colorStops={['#3A29FF', '#FF94B4', '#FF3232']}
  blend={0.6}        // stronger blending for smoother fades
  amplitude={0.3}    // small waves
  speed={0.25}   // slower speed (was 0.4)
/>

      </div>

      {/* Main Content */}
      <div className="relative z-10 px-5 py-20">
    {/* About Us */}
<section className="max-w-3xl mx-auto text-center mb-16">
  <h1 className="text-4xl font-bold mb-6 text-black dark:text-white">About Us</h1>
  <p className="text-black dark:text-white text-lg leading-7">
    We are a team of passionate individuals bringing art and technology together.
    Our goal is to make art exploration more intuitive, intelligent, and enjoyable
    through AI-driven tools and visually engaging design.
  </p>
</section>

{/* Our Vision */}
<section className="max-w-3xl mx-auto text-center mb-20">
  <h2 className="text-3xl font-semibold mb-6 text-black dark:text-white">Our Vision</h2>
  <p className="text-black dark:text-white text-lg leading-7">
    To revolutionize how people interact with art using cutting-edge machine learning models,
    making it easier to classify, curate, and connect with creativity across generations.
  </p>
</section>


        {/* Team Section */}
        <h2 className="text-3xl text-center mb-10 font-semibold">Meet the Team</h2>
        <div className="flex justify-center flex-wrap gap-8 max-w-6xl mx-auto">
          {items.map((item, index) => (
            <a
              key={index}
              href={item.url || "#"}
              target={item.url ? "_blank" : undefined}
              rel={item.url ? "noopener noreferrer" : undefined}
              style={{
                width: "180px",
                padding: "10px",
                borderRadius: "16px",
                textDecoration: "none",
                color: "inherit",
                background: item.gradient,
                boxShadow: `0 4px 15px ${item.borderColor}80`,
                transition: "transform 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  marginBottom: "10px",
                  border: `3px solid ${item.borderColor}`,
                }}
              />
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-200">{item.subtitle}</p>
              <p className="text-xs text-gray-400">{item.handle}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-12 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          {/* About Footer */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              About Art Curator
            </h3>
            <p className="text-sm md:text-base leading-relaxed">
              Art Curator is your go-to platform for exploring and understanding
              the styles behind your favorite artworks. Join us and start your
              artistic journey today.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm md:text-base">
              {links
                .filter((link) => link.path !== location.pathname)
                .map((link) => (
                  <li key={link.path}>
                    <button
                      onClick={() => navigate(link.path)}
                      className="hover:underline text-left"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Contact Us
            </h3>
            <address className="not-italic text-sm md:text-base space-y-2">
              <p>
                Email:{" "}
                <a
                  href="mailto:support@artcurator.com"
                  className="underline hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  support@artcurator.com
                </a>
              </p>
              <p>
                Phone:{" "}
                <a
                  href="tel:+1234567890"
                  className="underline hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  +1 (234) 567-890
                </a>
              </p>
              <p>Address: 123 Art Street, Creativity City, Artland</p>
            </address>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Follow Us
            </h3>
            <div className="flex space-x-4 text-2xl">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <i className="fab fa-facebook" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <i className="fab fa-twitter" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <i className="fab fa-instagram" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <i className="fab fa-linkedin" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-gray-300 dark:border-gray-700 pt-6 text-center text-xs md:text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Art Curator. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default About;
