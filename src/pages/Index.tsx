
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ContentSection from "@/components/ContentSection";
import EventsSection from "@/components/EventsSection";
import CommunitySection from "@/components/CommunitySection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-lesbian-gradient-subtle">
      <Header />
      <HeroSection />
      <ContentSection />
      <EventsSection />
      <CommunitySection />
      <Footer />
    </div>
  );
};

export default Index;
