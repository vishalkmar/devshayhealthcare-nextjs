import './globals.css';
import { Toaster } from 'react-hot-toast';
import { getSiteDetails } from '@/lib/data';

export async function generateMetadata() {
  const site = await getSiteDetails();
  const name = site.company || 'Devshay Healthcare';
  const description = site.description
    || 'Bulk supplier of quality medicines and pharmaceutical products to pharmacies and distributors.';
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    metadataBase: new URL(base),
    title: { default: `${name} — B2B Pharmaceutical Supplier`, template: `%s | ${name}` },
    description,
    keywords: [
      name, 'pharmacy', 'pharmaceutical supplier', 'B2B medicines', 'bulk medicines',
      'wholesale pharmacy', 'medicine distributor', 'pharma products',
    ],
    applicationName: name,
    // Use the uploaded logo as the favicon when available.
    icons: site.logo ? { icon: site.logo, shortcut: site.logo, apple: site.logo } : undefined,
    openGraph: {
      title: `${name} — B2B Pharmaceutical Supplier`,
      description,
      siteName: name,
      type: 'website',
      images: site.logo ? [site.logo] : undefined,
    },
    twitter: { card: 'summary', title: name, description },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      </body>
    </html>
  );
}
