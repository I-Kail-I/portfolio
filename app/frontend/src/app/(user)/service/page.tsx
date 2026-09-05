import { CapabilitiesArcSection } from './_sections/capabilities-arc-section';
import { OfferingsSection } from './_sections/offerings-section';
import { HashScroll } from '@/components/hash-scroll';
import { BenefitSection } from './_sections/benefits-sections';

export default function Page() {
  return (
    <div>
      <HashScroll />
      <CapabilitiesArcSection />
      <BenefitSection />
      <OfferingsSection />
    </div>
  );
}
