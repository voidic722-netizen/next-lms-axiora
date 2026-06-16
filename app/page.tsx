import { Navbar } from "@/components/landing/navbar/Navbar";
import { HeroSection } from "@/components/landing/hero/HeroSection";
import { CoreFeatures } from "@/components/landing/features/CoreFeatures";
import { LearningWorkflow } from "@/components/landing/workflow/LearningWorkflow";
import { RoleOverview } from "@/components/landing/roles/RoleOverview";
import { AssignmentOverview } from "@/components/landing/assignment/AssignmentOverview";
import { ExamSystemOverview } from "@/components/landing/exam/ExamSystemOverview";
import { FAQSection } from "@/components/landing/faq/FAQSection";
import { CTASection } from "@/components/landing/cta/CTASection";
import { Footer } from "@/components/landing/footer/Footer";
import { Chatbot } from "@/components/landing/Chatbot";

export default function LandingPage() {
  return (
    <>
      <main className="min-h-screen bg-white antialiased">
        <Navbar />
        <HeroSection />
        <CoreFeatures />
        <LearningWorkflow />
        <RoleOverview />
        <AssignmentOverview />
        <ExamSystemOverview />
        <FAQSection />
        <CTASection />
        <Footer />
      </main>
      <Chatbot />
    </>
  );
}