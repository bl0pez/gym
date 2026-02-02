import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dumbbell } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <div className="flex min-h-screen flex-col bg-black text-white selection:bg-primary selection:text-primary-foreground font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-2xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Dumbbell className="text-primary-foreground w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">{t("title")}</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/auth/login" className="text-sm font-medium hover:text-primary transition-colors">
              {t("login")}
            </Link>
            <Link href="/auth/register">
              <Button className="rounded-full px-8 bg-white text-black hover:bg-zinc-200 font-bold">
                {t("cta")}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Subtle Background Effect */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-primary font-bold tracking-[0.2em] uppercase mb-4 text-sm md:text-base animate-in fade-in slide-in-from-bottom-4 duration-700">
              {t("subtitle")}
            </h2>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-both">
              YOUR NOTES, <br />
              <span className="text-transparent bg-clip-text bg-linear-to-b from-white to-white/40 italic">YOUR PROGRESS</span>
            </h1>
            <p className="text-lg md:text-2xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
              {t("description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-10 duration-1000 fill-mode-both">
              <Link href="/auth/register">
                <Button size="lg" className="rounded-full px-12 h-16 text-lg font-black uppercase tracking-wider group shadow-xl shadow-primary/20">
                  {t("cta")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-white/5 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-50">
             <Dumbbell className="text-primary w-5 h-5" />
            <span className="text-lg font-bold tracking-tight uppercase">{t("title")}</span>
          </div>
          <div className="text-white/30 text-sm font-medium">
            © 2026 {t("title")}. Precision engineering for the elite.
          </div>
        </div>
      </footer>
    </div>
  );
}
