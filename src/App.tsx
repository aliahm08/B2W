/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Work from './components/Work';
import Industries from './components/Industries';
import Team from './components/Team';
import CTA from './components/CTA';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="bg-white text-black min-h-screen font-sans selection:bg-black selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Work />
        <section id="industries">
          <Industries />
        </section>
        <section id="team">
          <Team />
        </section>
        <section id="contact">
          <CTA />
        </section>
      </main>
      <Footer />
    </div>
  );
}
