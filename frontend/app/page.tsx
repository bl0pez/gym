import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Dumbbell, 
  LineChart, 
  Target, 
  Zap, 
  ArrowRight,
  ChevronRight
} from "lucide-react";

export default function Home() {
  const categories = [
    { name: "Chest", img: "/assets/categories/Chest.png" },
    { name: "Back", img: "/assets/categories/Back.png" },
    { name: "Legs", img: "/assets/categories/Legs.png" },
    { name: "Shoulders", img: "/assets/categories/Shoulders.png" },
    { name: "Arms", img: "/assets/categories/Arms.png" },
    { name: "Core", img: "/assets/categories/Core.png" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-black text-white selection:bg-primary selection:text-primary-foreground">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Dumbbell className="text-primary-foreground w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tighter">ANTIGRAVITY</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="rounded-full px-6">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button className="rounded-full px-6 shadow-[0_0_20px_rgba(255,255,255,0.15)]">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/assets/hero-bg.png"
              alt="Anatomical Training"
              fill
              className="object-cover opacity-40 scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold leading-none mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <Zap className="w-3 h-3 fill-current" />
                <span>ULTIMATE TRAINING INTELLIGENCE</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-both">
                TRAIN WITH <span className="text-primary">PRECISION</span>
              </h1>
              <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
                Experience the next evolution of fitness tracking. Anatomically driven routines, real-time progress analytics, and intelligent goal setting.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 fill-mode-both">
                <Link href="/auth/register">
                  <Button size="lg" className="rounded-full px-8 h-14 text-lg font-bold group shadow-lg shadow-primary/20">
                    Join the Elite <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg font-bold border-white/10 hover:bg-white/5">
                    View Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="py-24 bg-zinc-950">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors group">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Target className="text-primary w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Muscular Focus</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Every routine is mapped to anatomical models, ensuring you never miss a muscle group in your transformation journey.
                </p>
              </div>
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors group">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <LineChart className="text-primary w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Progress Logic</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Advanced data visualization tracks your 1RM, volume, and intensity over time with high-fidelity charts.
                </p>
              </div>
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors group">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="text-primary w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Instant Logging</h3>
                <p className="text-zinc-400 leading-relaxed">
                  The most intuitive workout interface ever made. Log sets in seconds so you can focus on the pump.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Anatomical Showcase */}
        <section className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
              <div className="max-w-2xl text-center md:text-left">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                  Visual <span className="text-primary tracking-tighter italic">Intelligence</span>
                </h2>
                <p className="text-zinc-400 text-lg leading-relaxed">
                  Our unique anatomical engine highlights exactly which muscles you're targeting in real-time. Gain deeper insight into your training.
                </p>
              </div>
              <Link href="/auth/register">
                <Button variant="outline" className="rounded-full border-white/10 px-8 h-12">See All Muscles <ChevronRight className="ml-1 w-4 h-4" /></Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((cat) => (
                <div key={cat.name} className="group relative aspect-square rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:border-primary/40 transition-all cursor-pointer">
                   <div className="absolute inset-0 opacity-20 group-hover:opacity-60 transition-opacity">
                      <Image 
                        src={cat.img} 
                        alt={cat.name} 
                        fill 
                        className="object-contain p-4 scale-110 group-hover:scale-125 transition-transform duration-500" 
                      />
                   </div>
                   <div className="absolute bottom-4 left-4">
                      <p className="text-sm font-bold tracking-wider uppercase text-zinc-300 group-hover:text-white transition-colors">
                        {cat.name}
                      </p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,transparent_70%)]" />
          <div className="container mx-auto px-6 relative z-10 text-center">
            <h2 className="text-4xl md:text-6xl font-black text-primary-foreground mb-8 tracking-tighter">
              READY TO DEFY GRAVITY?
            </h2>
            <p className="text-xl md:text-2xl text-primary-foreground/80 mb-12 max-w-2xl mx-auto font-medium">
              Join thousands of athletes who use Antigravity to achieve peak physical performance.
            </p>
            <Link href="/auth/register">
              <Button size="lg" variant="secondary" className="rounded-full px-12 h-16 text-xl font-black uppercase tracking-widest hover:scale-105 transition-transform">
                Start Training Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-white/10 bg-black">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
              <Dumbbell className="text-primary w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight">ANTIGRAVITY</span>
          </div>
          <div className="text-zinc-500 text-sm">
            © 2026 ANTIGRAVITY. All rights reserved. Precision engineering for the elite.
          </div>
        </div>
      </footer>
    </div>
  );
}
