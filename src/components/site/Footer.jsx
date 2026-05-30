import Link from 'next/link';
import { Mail, Phone, MapPin, Pill } from 'lucide-react';
import { SOCIAL_ICONS } from './socialIcons';
import FooterContactForm from './FooterContactForm';

export default function Footer({ site = {}, footer = {}, products = [] }) {
  const emails = site.emails || [];
  const phones = site.phones || [];
  const addresses = site.addresses || [];
  const socials = site.socials || [];
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white/80">
      <div className="container-x py-14">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-2">
              {site.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={site.logo} alt={site.company} className="h-10 w-auto" />
              ) : (
                <span className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white"><Pill size={18} /></span>
                  <span className="font-display text-lg font-extrabold text-white">{site.company || 'Devshay Healthcare'}</span>
                </span>
              )}
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              {site.description || 'Bulk supplier of quality medicines and pharmaceutical products to pharmacies and distributors.'}
            </p>

            {/* Product thumbnails */}
            {products.length > 0 && (
              <div className="mt-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">Featured products</p>
                <div className="flex gap-2.5">
                  {products.slice(0, 4).map((p) => (
                    <Link key={p.id} href={`/products/${p.slug}`}
                      className="h-14 w-14 overflow-hidden rounded-lg border border-white/10 bg-white/5 transition hover:border-brand">
                      {p.primaryImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.primaryImage} alt={p.name} className="h-full w-full object-cover" />
                      ) : <span className="flex h-full w-full items-center justify-center text-brand-300"><Pill size={20} /></span>}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {socials.length > 0 && (
              <div className="mt-5 flex gap-2.5">
                {socials.map((s, i) => {
                  const Icon = SOCIAL_ICONS[s.platform?.toLowerCase()] || SOCIAL_ICONS.default;
                  return (
                    <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.platform}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-brand">
                      <Icon size={17} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Explore */}
          <div className="md:col-span-2">
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="hover:text-brand">Home</Link></li>
              <li><Link href="/about" className="hover:text-brand">About Us</Link></li>
              <li><Link href="/products" className="hover:text-brand">Products</Link></li>
              <li><Link href="/contact" className="hover:text-brand">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">Get in touch</h4>
            <ul className="space-y-3 text-sm">
              {emails.map((e, i) => (
                <li key={`e${i}`} className="flex items-start gap-3"><Mail size={16} className="mt-0.5 shrink-0 text-brand" /><a href={`mailto:${e}`} className="hover:text-brand">{e}</a></li>
              ))}
              {phones.map((p, i) => (
                <li key={`p${i}`} className="flex items-start gap-3"><Phone size={16} className="mt-0.5 shrink-0 text-brand" /><a href={`tel:${p}`} className="hover:text-brand">{p}</a></li>
              ))}
              {addresses.map((a, i) => (
                <li key={`a${i}`} className="flex items-start gap-3"><MapPin size={16} className="mt-0.5 shrink-0 text-brand" /><span>{a}</span></li>
              ))}
            </ul>
          </div>

          {/* Quick enquiry */}
          <div className="md:col-span-3">
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">Quick enquiry</h4>
            <FooterContactForm />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/50 sm:flex-row">
          <span>© {year} {site.company || 'Devshay Healthcare'}. All rights reserved.</span>
          <span>{footer.tagline || 'B2B Pharmaceutical Supplier'}</span>
        </div>
      </div>
    </footer>
  );
}
