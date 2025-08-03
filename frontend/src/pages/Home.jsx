import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import NewsSection from '../components/NewsSection';
import WhyChooseUs from '../components/WhyChooseUs';
import ServicesSection from '../components/ServicesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import CTASection from '../components/CTASection';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <HeroSection />
      <NewsSection />
      <WhyChooseUs />
      <ServicesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Home;