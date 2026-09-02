import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutPageContent from "@/components/AboutPageContent";
import "./hakkimizda.css";

export default function HakkimizdaPage() {
    return (
        <div style={{ minHeight: "100vh", background: "var(--background)" }}>
            <Navbar />
            <AboutPageContent />
            <Footer />
        </div>
    );
}
