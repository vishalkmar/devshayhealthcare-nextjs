import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import WhatsAppFloat from '@/components/site/WhatsAppFloat';
import ScrollToTop from '@/components/site/ScrollToTop';
import AOSInit from '@/components/site/AOSInit';
import CtaBand from '@/components/site/CtaBand';
import { getSiteDetails, getContent, getProducts, getGlobalCta } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function SiteLayout({ children }) {
  const [site, footer, footerProducts, cta] = await Promise.all([
    getSiteDetails(),
    getContent('footer'),
    getProducts({ take: 4 }),
    getGlobalCta(),
  ]);
  return (
    <>
      <AOSInit />
      <Header site={site} />
      <main className="min-h-screen">{children}</main>
      <CtaBand cta={cta} />
      <Footer site={site} footer={footer} products={footerProducts} />
      <WhatsAppFloat number={site.whatsappNumber} company={site.company} />
      <ScrollToTop />
    </>
  );
}
