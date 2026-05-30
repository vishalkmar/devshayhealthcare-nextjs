import Typewriter from './Typewriter';

// Shared decorative page banner (used by Products & Contact pages).
// `typeWords` enables a typing effect on the highlighted word instead of static text.
export default function PageBanner({ badge, title, highlight, typeWords, subtitle, children }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 pb-28 pt-28 text-white md:pt-36">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-16 top-20 h-80 w-80 rounded-full bg-brand-300/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-white/5 blur-2xl" />
      </div>

      <div className="container-x relative z-10 text-center" data-aos="fade-up">
        {badge && (
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-brand-200" /> {badge}
          </span>
        )}
        <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight md:text-6xl">
          {title}{' '}
          {typeWords ? (
            <Typewriter words={typeWords} className="text-brand-200" caretClassName="text-brand-200" />
          ) : (
            highlight && <span className="text-brand-200">{highlight}</span>
          )}
        </h1>
        {subtitle && <p className="mx-auto mt-4 max-w-2xl text-white/85">{subtitle}</p>}
        {children}
      </div>

      {/* Smooth wave divider (blends into the white page below) */}
      <svg className="absolute -bottom-px left-0 w-full" viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none" style={{ height: 70 }}>
        <path d="M0 120V60C240 100 480 110 720 90C960 70 1200 20 1440 40V120H0Z" fill="white" />
      </svg>
    </section>
  );
}
