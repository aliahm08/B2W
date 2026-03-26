import { useEffect } from 'react';
import CapabilitiesKitchen from '../../archived/CapabilitiesKitchen';
import Seo from '../../components/Seo';

export default function KitchenPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <article className="min-h-screen bg-white text-black pt-24 pb-24">
      <Seo />
      <section id="capabilities-kitchen">
        <CapabilitiesKitchen />
      </section>
    </article>
  );
}
