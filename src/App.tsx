import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Lab } from './components/Lab';
import { Nav } from './components/Nav';
import { CursorField, ScrollHUD } from './components/Overlays';
import { Process } from './components/Process';
import { Services } from './components/Services';
import { Work } from './components/Work';
import { LangProvider } from './i18n';

export default function App() {
  return (
    <LangProvider>
      <CursorField />
      <Nav />
      <main className="relative z-[2]">
        <Hero />
        <Work />
        <Services />
        <Lab />
        <Process />
        <Contact />
      </main>
      <div className="relative z-[2]">
        <Footer />
      </div>
      <ScrollHUD />
    </LangProvider>
  );
}
