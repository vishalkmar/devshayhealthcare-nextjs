import { Mail, MapPin, Phone, MessageCircle, Clock } from 'lucide-react';
import ContactForm from '@/components/site/ContactForm';
import PageBanner from '@/components/site/PageBanner';
import { SOCIAL_ICONS } from '@/components/site/socialIcons';
import { getSiteDetails, getContent } from '@/lib/data';
import { buildWhatsappLink } from '@/lib/helpers';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const site = await getSiteDetails();
  const name = site.company || 'Devshay Healthcare';
  return {
    title: 'Contact Us',
    description: `Get in touch with ${name} for bulk orders, pricing and partnership enquiries. Call, email or message us on WhatsApp.`,
    keywords: [name, 'contact', 'bulk order enquiry', 'pharmacy supplier contact', 'WhatsApp order'],
    alternates: { canonical: '/contact' },
  };
}

export default async function ContactPage() {
  const [site, c] = await Promise.all([getSiteDetails(), getContent('contact_page')]);
  const waHref = site.whatsappNumber
    ? buildWhatsappLink(site.whatsappNumber, `Hi ${site.company || ''}, I need assistance.`)
    : null;

  return (
    <>
      {/* Hero */}
      <PageBanner badge={c.badge} title={c.heroTitle} typeWords={[c.heroHighlight || 'Touch']} subtitle={c.heroSubtitle} />

      <section className="container-x pb-16 pt-4">
        <div className="grid gap-6 lg:grid-cols-3" data-aos="fade-up">
          {/* Form */}
          <div className="card p-6 lg:col-span-2 md:p-8">
            <h2 className="font-display text-2xl font-bold text-ink">{c.formHeading}</h2>
            <p className="mt-2 text-sm text-muted">{c.formSubtitle}</p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-display text-lg font-bold text-ink">Contact Information</h3>
              <ul className="mt-4 space-y-4 text-sm">
                {(site.addresses || []).map((a, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Icon><MapPin size={16} /></Icon>
                    <span className="text-ink/80">{a}</span>
                  </li>
                ))}
                {(site.emails || []).map((e, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Icon><Mail size={16} /></Icon>
                    <a href={`mailto:${e}`} className="text-ink/80 hover:text-brand">{e}</a>
                  </li>
                ))}
                {(site.phones || []).map((p, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Icon><Phone size={16} /></Icon>
                    <a href={`tel:${p}`} className="text-ink/80 hover:text-brand">{p}</a>
                  </li>
                ))}
              </ul>
            </div>

            {waHref && (
              <div className="card p-6">
                <h3 className="font-display text-lg font-bold text-ink">{c.whatsappHeading}</h3>
                <p className="mt-2 text-sm text-muted">{c.whatsappSubtitle}</p>
                <a href={waHref} target="_blank" rel="noopener noreferrer"
                  className="btn mt-4 w-full bg-[#25D366] py-3 text-white hover:brightness-95">
                  <MessageCircle size={17} /> Chat on WhatsApp
                </a>
                <p className="mt-3 flex items-center gap-2 text-xs text-emerald-600">
                  <Clock size={13} /> {c.availability}
                </p>
              </div>
            )}

            {(site.socials || []).length > 0 && (
              <div className="card p-6">
                <h3 className="font-display text-lg font-bold text-ink">Follow us</h3>
                <div className="mt-4 flex gap-2.5">
                  {site.socials.map((s, i) => {
                    const I = SOCIAL_ICONS[s.platform?.toLowerCase()] || SOCIAL_ICONS.default;
                    return (
                      <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 hover:bg-brand hover:text-white transition">
                        <I size={18} />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function Icon({ children }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
      {children}
    </span>
  );
}
