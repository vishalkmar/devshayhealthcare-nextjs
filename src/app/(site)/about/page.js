import { CheckCircle2, Eye, Target } from 'lucide-react';
import SectionHeader from '@/components/site/SectionHeader';
import Faqs from '@/components/site/Faqs';
import AboutHero from '@/components/site/AboutHero';
import { getAboutSections, getFaqs, getSiteDetails } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const site = await getSiteDetails();
  const name = site.company || 'Devrishi Pharma';
  return {
    title: 'About Us',
    description: `Learn about ${name} — a trusted B2B pharmaceutical supplier delivering quality medicines in bulk to pharmacies and distributors.`,
    keywords: [name, 'about', 'pharmaceutical company', 'medicine supplier', 'B2B pharma'],
    alternates: { canonical: '/about' },
  };
}

export default async function AboutPage() {
  const [about, faqs, site] = await Promise.all([
    getAboutSections(),
    getFaqs('about'),
    getSiteDetails(),
  ]);

  const { hero, who_we_are: who, vision, mission, team, story } = about;

  return (
    <>
      {/* Hero with typing effect */}
      <AboutHero hero={hero} company={site.company} />

      {/* Who we are + stats — equal height columns */}
      {who && (
        <section className="container-x py-16">
          <div className="grid items-stretch gap-8 md:grid-cols-2">
            <div className="flex flex-col justify-center rounded-3xl border border-line bg-white p-8 shadow-card" data-aos="fade-right">
              {who.eyebrow && <span className="section-eyebrow">{who.eyebrow}</span>}
              <h2 className="mt-3 font-display text-3xl font-extrabold text-ink">{who.heading}</h2>
              {who.subheading && <p className="mt-4 leading-relaxed text-muted">{who.subheading}</p>}
              {who.body && <div className="rich-prose mt-4" dangerouslySetInnerHTML={{ __html: who.body }} />}
              {Array.isArray(who.data?.bullets) && who.data.bullets.length > 0 && (
                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {who.data.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-ink/80">
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand" /> {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="grid grid-cols-2 gap-5" data-aos="fade-left">
              {Array.isArray(who.data?.stats) && who.data.stats.map((s, i) => (
                <div key={i} className="flex flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 p-6 text-center text-white shadow-soft">
                  <p className="font-display text-4xl font-extrabold">{s.value}</p>
                  <p className="mt-1 text-sm text-white/85">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Vision & Mission — image in top-center circle */}
      {(vision || mission) && (
        <section className="bg-cloud py-16">
          <div className="container-x">
            <SectionHeader eyebrow="Our guiding light" title="Vision &" highlight="Mission" />
            <div className="grid gap-6 md:grid-cols-2">
              {vision && <VMCard data={vision} fallbackIcon={<Eye size={26} />} defaultEyebrow="Our Vision" />}
              {mission && <VMCard data={mission} fallbackIcon={<Target size={26} />} defaultEyebrow="Our Mission" dark />}
            </div>
          </div>
        </section>
      )}

      {/* Story — placed above the team */}
      {story && (
        <section className="bg-gradient-to-br from-brand-600 to-brand-800 py-16 text-white">
          <div className="container-x text-center" data-aos="fade-up">
            {story.eyebrow && <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">{story.eyebrow}</span>}
            <h2 className="mx-auto mt-4 max-w-3xl font-display text-3xl font-extrabold md:text-4xl">{story.heading}</h2>
            {story.subheading && <p className="mx-auto mt-4 max-w-2xl text-white/85">{story.subheading}</p>}
            {story.body && <div className="rich-prose mx-auto mt-4 max-w-2xl [&_*]:!text-white/90" dangerouslySetInnerHTML={{ __html: story.body }} />}
          </div>
        </section>
      )}

      {/* Team */}
      {team && Array.isArray(team.data?.members) && team.data.members.length > 0 && (
        <section className="container-x py-16">
          <SectionHeader eyebrow="Meet the team" title={team.heading || 'The people behind us'} subtitle={team.subheading} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.data.members.map((m, i) => (
              <div key={i} className="rounded-2xl border border-line bg-white p-6 text-center shadow-card transition hover:-translate-y-1 hover:shadow-soft" data-aos="fade-up" data-aos-delay={i * 80}>
                {m.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.image} alt={m.name} className="mx-auto h-28 w-28 rounded-full border-4 border-brand-50 object-cover" />
                ) : (
                  <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-brand-50 text-2xl font-bold text-brand-600">{(m.name || '?').charAt(0)}</div>
                )}
                <h4 className="mt-4 font-display text-lg font-bold text-ink">{m.name}</h4>
                <p className="text-sm font-medium text-brand-600">{m.role}</p>
                {m.bio && <p className="mt-2 text-sm text-muted">{m.bio}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {!hero && !who && !vision && !mission && !team && !story && (
        <section className="container-x py-24 text-center">
          <h1 className="font-display text-3xl font-bold text-ink">About {site.company}</h1>
          <p className="mx-auto mt-3 max-w-xl text-muted">{site.description} Configure this page from the admin panel → About.</p>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="container-x py-16">
          <SectionHeader eyebrow="FAQs" title="Frequently asked" highlight="questions" />
          <Faqs items={faqs} />
        </section>
      )}
    </>
  );
}

function VMCard({ data, fallbackIcon, defaultEyebrow, dark }) {
  return (
    <div
      data-aos="fade-up"
      className={`rounded-3xl p-8 pt-14 text-center shadow-card ${dark ? 'bg-gradient-to-br from-brand-700 to-ink text-white' : 'border border-line bg-white'}`}
      style={{ position: 'relative' }}
    >
      {/* Top-center circle image */}
      <span className="absolute -top-9 left-1/2 flex h-[72px] w-[72px] -translate-x-1/2 items-center justify-center overflow-hidden rounded-full border-[5px] border-white bg-brand-100 text-brand-600 shadow-soft">
        {data.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.imageUrl} alt={data.heading} className="h-full w-full object-cover" />
        ) : fallbackIcon}
      </span>
      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${dark ? 'bg-white/15' : 'bg-brand-50 text-brand-700'}`}>
        {data.eyebrow || defaultEyebrow}
      </span>
      <h3 className="mt-3 font-display text-2xl font-bold">{data.heading}</h3>
      {data.subheading && <p className={`mt-3 ${dark ? 'text-white/85' : 'text-muted'}`}>{data.subheading}</p>}
      {data.body && <div className={`rich-prose mt-3 ${dark ? '[&_*]:!text-white/90' : ''}`} dangerouslySetInnerHTML={{ __html: data.body }} />}
    </div>
  );
}
