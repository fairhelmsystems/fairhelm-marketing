import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hello",
  robots: { index: false, follow: false },
};

/**
 * A quiet easter egg: greetings from across the Indian subcontinent,
 * fading in and out of a dark field. Pure CSS — no animation library.
 */
const GREETINGS = [
  { word: "Hello", left: 12, top: 18, delay: 0 },
  { word: "नमस्ते", left: 58, top: 12, delay: 1.4 },
  { word: "নমস্কার", left: 78, top: 32, delay: 2.8 },
  { word: "வணக்கம்", left: 22, top: 46, delay: 4.2 },
  { word: "నమస్కారం", left: 64, top: 56, delay: 5.6 },
  { word: "नमस्कार", left: 38, top: 26, delay: 7.0 },
  { word: "નમસ્તે", left: 8, top: 68, delay: 8.4 },
  { word: "ನಮಸ್ಕಾರ", left: 48, top: 76, delay: 9.8 },
  { word: "നമസ്കാരം", left: 80, top: 70, delay: 11.2 },
  { word: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", left: 26, top: 84, delay: 12.6 },
  { word: "ନମସ୍କାର", left: 70, top: 88, delay: 14.0 },
  { word: "নমস্কাৰ", left: 44, top: 40, delay: 15.4 },
  { word: "आदाब", left: 88, top: 14, delay: 16.8 },
  { word: "ᱡᱚᱦᱟᱨ", left: 14, top: 34, delay: 18.2 },
] as const;

export default function Hello() {
  return (
    <main tabIndex={-1} id="main-content" className="flex min-h-[100dvh] items-center justify-center bg-[rgb(4,8,16)] px-4">
      <div className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10">
        {GREETINGS.map((item) => (
          <span
            key={item.word + item.left}
            className="hello-word absolute select-none font-display text-2xl tracking-[-0.03em] text-white sm:text-4xl"
            style={{
              left: `${item.left}%`,
              top: `${item.top}%`,
              animationDelay: `${item.delay}s`,
            }}
          >
            {item.word}
          </span>
        ))}
        <p className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[0.6875rem] tracking-[0.12em] text-white/40">
          SquareCampus · Built with ❤️ in Bharath
        </p>
      </div>
    </main>
  );
}
