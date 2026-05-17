import { FloatingHearts } from "./features/landing/components/FloatingHearts/FloatingHearts";
import { Navbar } from "./features/landing/components/Navbar/Navbar";
import { Hero } from "./features/landing/components/Hero/Hero";
import { MatchCard } from "./features/landing/components/MatchCard/MatchCard";
import { QuoteCard } from "./features/landing/components/QuoteCard/QuoteCard";

export default function Home() {
  return (
    <div className="bg-romantic-dawn min-h-screen flex flex-col overflow-x-hidden">
      {/* Ambient floating hearts */}
      <FloatingHearts />

      {/* Navigation */}
      <Navbar />

      {/* Main content — fills remaining space */}
      <main className="relative z-10 flex-1 flex flex-col px-4 sm:px-6 pt-20 pb-6 md:max-w-[1200px] md:mx-auto w-full">
        {/* Spacer — pushes hero down from navbar */}
        <div className="hidden md:block flex-1 min-h-4" />

        {/* Hero section */}
        <Hero />

        {/* Spacer between hero and grid */}
        <div className="h-6 md:flex-1 md:min-h-4" />

        {/* Bento grid section */}
        <section className="shrink-0 grid grid-cols-1 md:grid-cols-3 gap-4">
          <MatchCard />
          <QuoteCard />
        </section>
      </main>
    </div>
  );
}
