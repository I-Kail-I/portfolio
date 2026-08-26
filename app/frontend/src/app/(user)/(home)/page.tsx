import { HeroSection } from './_sections/hero-section';
import HowIWorkSection from './_sections/how-i-work-section';
import ServiceSection from './_sections/service-section';
import { MovingTextSection } from './_sections/moving-text-section';
import SelectedWorkSection from './_sections/selected-work-section';

export default function page() {
  return (
    <div>
      <HeroSection />
      <MovingTextSection />
      <SelectedWorkSection />
      <HowIWorkSection />
      <ServiceSection />
    </div>
  );
}
