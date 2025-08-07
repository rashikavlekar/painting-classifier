import React from "react";
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
    url: "https://linkedin.com/in/mikechen",
  },
  {
    image: "https://i.pravatar.cc/300?img=3",
    title: "Emily Davis",
    subtitle: "UI/UX Designer",
    handle: "@emilydavis",
    borderColor: "#EC4899",
    gradient: "linear-gradient(145deg, #EC4899, #000)",
    url: "https://dribbble.com/emilydavis",
  },
  {
    image: "https://i.pravatar.cc/300?img=4",
    title: "Raj Patel",
    subtitle: "DevOps Engineer",
    handle: "@rajpatel",
    borderColor: "#F59E0B",
    gradient: "linear-gradient(180deg, #F59E0B, #000)",
    url: "https://linkedin.com/in/rajpatel",
  },
  {
    image: "https://i.pravatar.cc/300?img=5",
    title: "Anna Lee",
    subtitle: "Project Manager",
    handle: "@annalee",
    borderColor: "#8B5CF6",
    gradient: "linear-gradient(145deg, #8B5CF6, #000)",
    url: "https://github.com/annalee",
  },
];

const About = () => {
  return (
    <div style={{ position: "relative", background: "#000", color: "#fff", minHeight: "100vh", overflow: "hidden" }}>
      {/* Aurora background */}
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      {/* Content Wrapper */}
      <div style={{ position: "relative", zIndex: 1, padding: "80px 20px" }}>
        {/* About Us */}
        <section style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", marginBottom: "60px" }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>About Us</h1>
          <p style={{ fontSize: "1.1rem", color: "#ccc", lineHeight: "1.7" }}>
            We are a team of passionate individuals bringing art and technology together. Our goal is to make art exploration more intuitive, intelligent, and enjoyable through AI-driven tools and visually engaging design.
          </p>
        </section>

        {/* Our Vision */}
        <section style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", marginBottom: "80px" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "20px" }}>Our Vision</h2>
          <p style={{ fontSize: "1.1rem", color: "#ccc", lineHeight: "1.7" }}>
            To revolutionize how people interact with art using cutting-edge machine learning models, making it easier to classify, curate, and connect with creativity across generations.
          </p>
        </section>

        {/* Team Grid */}
        <h2 style={{ fontSize: "2.2rem", textAlign: "center", marginBottom: "40px" }}>Meet the Team</h2>
        <div style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "30px",
          maxWidth: "1100px",
          margin: "0 auto"
        }}>
          {items.map((item, index) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
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
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
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
              <h2 style={{ fontSize: "1.2rem", margin: "5px 0" }}>{item.title}</h2>
              <p style={{ fontSize: "0.9rem", color: "#ccc" }}>{item.subtitle}</p>
              <p style={{ fontSize: "0.85rem", color: "#888" }}>{item.handle}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
