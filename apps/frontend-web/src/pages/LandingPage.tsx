import React from 'react';
import { Header } from '../components/landing/Header';
import { Footer } from '../components/landing/Footer';
import { 
  HeroSection, 
  PlayersSection, 
  OrganizersSection, 
  CommunitySection, 
  CtaSection 
} from '../components/landing/LandingSections';

export default function LandingPage() {
  return (
    <div className="text-on-surface">
      <Header />
      <main className="overflow-x-hidden">
        <HeroSection />
        <PlayersSection />
        <OrganizersSection />
        <CommunitySection />
        
        {/* Trusted Partners */}
        <section className="py-xxl bg-surface-container-low transition-all duration-1000 ease-out">
          <div className="max-w-7xl mx-auto px-margin-desktop text-center">
            <h3 className="font-title-lg text-title-lg text-on-surface-variant mb-xl">Đối Tác Tin Cậy</h3>
            <div className="flex flex-wrap justify-center items-center gap-xxl opacity-60 hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-sm">
                <div className="w-10 h-10 bg-on-surface/10 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined">fitness_center</span>
                </div>
                <span className="font-title-lg text-title-lg font-bold">DN Sport Club</span>
              </div>
              <div className="flex items-center gap-sm">
                <div className="w-10 h-10 bg-on-surface/10 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined">stadium</span>
                </div>
                <span className="font-title-lg text-title-lg font-bold">Sơn Trà Arena</span>
              </div>
              <div className="flex items-center gap-sm">
                <div className="w-10 h-10 bg-on-surface/10 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined">emoji_events</span>
                </div>
                <span className="font-title-lg text-title-lg font-bold">Victory League</span>
              </div>
            </div>
          </div>
        </section>

        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
