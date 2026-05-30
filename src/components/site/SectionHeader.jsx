export default function SectionHeader({ eyebrow, title, highlight, subtitle, center = true }) {
  return (
    <div className={`mb-10 ${center ? 'text-center' : ''}`} data-aos="fade-up">
      {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
      <h2 className="mt-3 font-display text-3xl font-extrabold text-ink md:text-4xl">
        {title} {highlight && <span className="text-brand">{highlight}</span>}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-muted ${center ? 'mx-auto max-w-2xl' : ''}`}>{subtitle}</p>
      )}
    </div>
  );
}
