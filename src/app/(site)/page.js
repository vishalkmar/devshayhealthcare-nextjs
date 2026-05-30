import Link from 'next/link';
import { CheckCircle2, Truck, ShieldCheck, Award, Star, Heart, Pill } from 'lucide-react';
import HeroDisplay from '@/components/site/HeroDisplay';
import SectionHeader from '@/components/site/SectionHeader';
import ProductShowcase from '@/components/site/ProductShowcase';
import PromoBanners from '@/components/site/PromoBanners';
import Testimonials from '@/components/site/Testimonials';
import Faqs from '@/components/site/Faqs';
import {
  getHeroes, getCategories, getProducts, getPromoBanners,
  getTestimonials, getFaqs, getAboutSections, getSiteDetails, getContent,
} from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const site = await getSiteDetails();
  const name = site.company || 'Devrishi Pharma';
  return {
    title: `${name} — Bulk Medicines for Pharmacies & Distributors`,
    description: site.description || `${name} supplies quality medicines and pharmaceutical products in bulk to pharmacies and distributors across India.`,
    keywords: [name, 'bulk medicines', 'B2B pharmacy', 'pharmaceutical wholesaler', 'medicine supplier India'],
    alternates: { canonical: '/' },
  };
}

const TRUST_ICONS = { truck: Truck, shield: ShieldCheck, award: Award, check: CheckCircle2, star: Star, heart: Heart, pill: Pill };

export default async function HomePage() {
  const [heroes, categories, products, promos, testimonials, faqs, about, site, content] = await Promise.all([
    getHeroes('home'),
    getCategories(),
    getProducts({ take: 24 }),
    getPromoBanners('home'),
    getTestimonials(),
    getFaqs('home'),
    getAboutSections(),
    getSiteDetails(),
    getContent('home_sections'),
  ]);

  const aboutBlock = about.who_we_are || about.hero;
  const badges = content.trustBadges || [];

  return (
    <>
      {/* Hero */}
      {heroes.length > 0 ? (
        <HeroDisplay hero={heroes[0]} />
      ) : (
        <FallbackHero company={site.company} />
      )}

      {/* Trust strip */}
      {badges.length > 0 && (
        <section className="border-b border-line bg-cloud">
          <div className="container-x grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
            {badges.map((f, i) => {
              const Icon = TRUST_ICONS[f.icon] || CheckCircle2;
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <Icon size={20} />
                  </span>
                  <span className="text-sm font-medium text-ink">{f.label}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* About — circular framed image */}
      <section className="relative overflow-hidden py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-brand-50 blur-3xl" />
        </div>
        <div className="container-x relative grid items-center gap-12 md:grid-cols-2">
          <div data-aos="fade-right">
            <span className="section-eyebrow">{aboutBlock?.eyebrow || content.aboutEyebrow}</span>
            <h2 className="mt-3 font-display text-4xl font-extrabold leading-tight text-ink md:text-5xl">
              {aboutBlock?.heading || site.company}
            </h2>
            <p className="mt-5 max-w-xl leading-relaxed text-muted">
              {aboutBlock?.subheading || site.description}
            </p>
            {aboutBlock?.body && (
              <div className="rich-prose mt-4 max-w-xl" dangerouslySetInnerHTML={{ __html: aboutBlock.body }} />
            )}
            <Link href="/about" className="btn-brand mt-7">Learn more about us</Link>
          </div>

          <div className="relative mx-auto" data-aos="zoom-in" data-aos-delay="120">
            <div className="relative h-72 w-72 sm:h-80 sm:w-80 md:h-[26rem] md:w-[26rem]">
              <div className="absolute inset-0 animate-[spin_22s_linear_infinite] rounded-full border-2 border-dashed border-brand-200" />
              <div className="absolute inset-5 overflow-hidden rounded-full border-[8px] border-white bg-gradient-to-br from-brand-300 to-brand-600 shadow-soft">
                {aboutBlock?.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={aboutBlock.imageUrl} alt={site.company} className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-white/80"><Pill size={110} /></span>
                )}
              </div>
              <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-line bg-white px-4 py-2.5 shadow-card">
                <ShieldCheck size={18} className="text-brand" />
                <span className="text-sm font-semibold text-ink">Trusted B2B supplier</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="bg-cloud py-16">
        <div className="container-x">
          <SectionHeader eyebrow={content.productsEyebrow} title={content.productsTitle} highlight={content.productsHighlight} subtitle={content.productsSubtitle} />
          <ProductShowcase categories={categories} products={products} whatsappNumber={site.whatsappNumber} />
        </div>
      </section>

      {/* Promo banners */}
      {promos.length > 0 && (
        <section className="py-12">
          <PromoBanners banners={promos} />
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="container-x py-16">
          <SectionHeader eyebrow={content.testimonialsEyebrow} title={content.testimonialsTitle} highlight={content.testimonialsHighlight} subtitle={content.testimonialsSubtitle} />
          <Testimonials items={testimonials} />
        </section>
      )}

      {/* FAQs */}
      {faqs.length > 0 && (
        <section className="bg-cloud py-16">
          <div className="container-x">
            <SectionHeader eyebrow={content.faqsEyebrow} title={content.faqsTitle} highlight={content.faqsHighlight} subtitle={content.faqsSubtitle} />
            <Faqs items={faqs} centerEyebrow={content.faqsEyebrow} centerTitle={content.faqsTitle} centerHighlight={content.faqsHighlight} centerSubtitle={content.faqsSubtitle} />
          </div>
        </section>
      )}

    </>
  );
}

function FallbackHero({ company }) {
  return (
    <section className="relative flex min-h-[80vh] items-center bg-gradient-to-br from-brand-500 to-brand-700">
      <div className="container-x relative z-10 text-white">
        <div className="max-w-2xl animate-fadeUp">
          <h1 className="font-display text-4xl font-extrabold leading-tight md:text-6xl">
            {company || 'Devrishi Pharma'}
          </h1>
          <p className="mt-4 text-lg opacity-90">
            Your trusted B2B partner for bulk pharmaceutical supply. Quality medicines, competitive pricing, reliable delivery.
          </p>
          <div className="mt-7 flex gap-3">
            <Link href="/products" className="btn bg-white px-6 py-3 text-brand-700 hover:bg-brand-50">Browse Products</Link>
            <Link href="/contact" className="btn-outline border-white text-white hover:bg-white/10">Get in touch</Link>
          </div>
        </div>
      </div>
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/70">
        Add a hero from the admin panel to customise this section.
      </p>
    </section>
  );
}
