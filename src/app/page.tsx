import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import UpdateSection from "@/components/landing/UpdateSection";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import FeatureShowcase from "@/components/landing/FeatureShowcase";
import TestimonialSection from "@/components/landing/TestimonialSection";
import CTASection from "@/components/landing/CTASection";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <UpdateSection />
        <ProblemSection />
        <SolutionSection />
        <FeatureShowcase />
        <TestimonialSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
