/* eslint-disable no-console */
// Seeds the admin account + starter content so the site looks complete.
// Run with: npm run seed
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const slugify = require('slugify');

const prisma = new PrismaClient();
const slug = (s) => slugify(String(s), { lower: true, strict: true });

async function main() {
  // ---- Admin ----
  const email = (process.env.ADMIN_EMAIL || 'admin@devrishi.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'Admin@12345';
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.admin.upsert({
    where: { email },
    update: { passwordHash, name: process.env.ADMIN_NAME || 'Super Admin' },
    create: { email, passwordHash, name: process.env.ADMIN_NAME || 'Super Admin', role: 'super' },
  });
  console.log(`✓ Admin ready: ${email} / ${password}`);

  // ---- Site details ----
  await prisma.siteSetting.upsert({
    where: { key: 'site_details' },
    update: {},
    create: {
      key: 'site_details',
      value: {
        company: 'Devshay Healthcare',
        tagline: 'Trusted B2B pharmaceutical supplier',
        description: 'Devshay Healthcare is committed to delivering quality pharmaceutical products with trust, integrity, and excellence. We strive to support healthier communities through reliable healthcare solutions and customer-focused service.',
        logo: '',
        whatsappNumber: '919876543210',
        emails: ['info@devshayhealthcare.com'],
        phones: ['+91 98765 43210'],
        addresses: ['Industrial Area, Delhi, India'],
        socials: [{ platform: 'Instagram', url: 'https://instagram.com' }, { platform: 'LinkedIn', url: 'https://linkedin.com' }],
      },
    },
  });
  console.log('✓ Site details');

  // ---- Categories ----
  const catData = [
    { name: 'Antibiotics', description: 'Bacterial infection treatments' },
    { name: 'Pain Relief', description: 'Analgesics & anti-inflammatories' },
    { name: 'Gastro', description: 'Acidity, digestion & gut health' },
    { name: 'Vitamins & Supplements', description: 'Nutritional support' },
  ];
  const categories = {};
  for (let i = 0; i < catData.length; i++) {
    const c = catData[i];
    const cat = await prisma.category.upsert({
      where: { slug: slug(c.name) },
      update: {},
      create: { name: c.name, slug: slug(c.name), description: c.description, sortOrder: i },
    });
    categories[c.name] = cat.id;
  }
  console.log('✓ Categories');

  // ---- Products ----
  const products = [
    {
      name: 'Azithro 500 Tablet', genericName: 'Azithromycin', strength: '500 mg', form: 'Tablet',
      category: 'Antibiotics', packSize: '3 tablets/strip', packagingType: 'Strip',
      saltComposition: 'Azithromycin 500mg', uses: 'Broad-spectrum antibiotic for respiratory, skin and ENT infections.',
      symptoms: 'Bacterial throat infection, sinusitis, bronchitis', sideEffects: 'Nausea, abdominal pain, diarrhoea.',
      howToUse: 'One tablet daily for 3 days or as prescribed.', prescriptionRequired: true,
      pricePerStrip: 62, pricePer10: 590, mrp: 130, manufacturer: 'Devshay Healthcare', schedule: 'Schedule H',
    },
    {
      name: 'Devshay Multivit Capsule', genericName: 'Multivitamin & Minerals', form: 'Capsule',
      category: 'Vitamins & Supplements', packSize: '10 capsules/strip', packagingType: 'Strip',
      saltComposition: 'Multivitamins, Multiminerals, Antioxidants', uses: 'Daily nutritional supplement for immunity and energy.',
      symptoms: 'Fatigue, weakness, nutritional deficiency', sideEffects: 'Generally well tolerated.',
      howToUse: 'One capsule daily after a meal.',
      pricePerStrip: 75, pricePerBox: 1400, mrp: 150, manufacturer: 'Devshay Healthcare', isFeatured: true,
    },
  ];
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const { category, ...rest } = p;
    await prisma.product.upsert({
      where: { slug: slug(p.name) },
      update: {},
      create: { ...rest, slug: slug(p.name), categoryId: categories[category] || null, currency: 'INR', sortOrder: i, isActive: true },
    });
  }
  console.log('✓ Products');

  // ---- Hero ----
  const heroCount = await prisma.hero.count();
  if (heroCount === 0) {
    await prisma.hero.create({
      data: {
        name: 'Home main banner', type: 'image_text', pageKey: 'home',
        heading: 'Quality Medicines, Delivered in Bulk',
        subheading: 'Your trusted B2B partner for pharmaceutical supply across India.',
        ctaLabel: 'Browse Products', ctaUrl: '/products', height: 'lg', overlayOpacity: 45,
        media: { create: [{ url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1600', mediaType: 'image', sortOrder: 0 }] },
      },
    });
    console.log('✓ Hero');
  }

  // ---- Testimonials ----
  const tCount = await prisma.testimonial.count();
  if (tCount === 0) {
    await prisma.testimonial.createMany({
      data: [
        { type: 'text', authorName: 'Rajesh Medicos', authorLocation: 'Delhi', rating: 5, content: 'Reliable supply and great bulk pricing. Our go-to distributor for the last 2 years.' },
        { type: 'text', authorName: 'HealthPlus Pharmacy', authorLocation: 'Jaipur', rating: 5, content: 'Genuine products, on-time delivery and responsive team. Highly recommended.' },
        { type: 'text', authorName: 'CareWell Distributors', authorLocation: 'Mumbai', rating: 4, content: 'Wide product range and competitive margins. Smooth ordering over WhatsApp.' },
      ],
    });
    console.log('✓ Testimonials');
  }

  // ---- FAQs ----
  const fCount = await prisma.faq.count();
  if (fCount === 0) {
    await prisma.faq.createMany({
      data: [
        { question: 'What is the minimum order quantity?', answer: 'MOQ varies by product. Check each product page or message us on WhatsApp for bulk rates.', page: 'home', sortOrder: 0 },
        { question: 'Do you supply across India?', answer: 'Yes, we ship pan-India to licensed pharmacies and distributors.', page: 'home', sortOrder: 1 },
        { question: 'How do I place an order?', answer: 'Click "Book now on WhatsApp" on any product and our team will confirm pricing and availability.', page: 'home', sortOrder: 2 },
        { question: 'Are all products genuine and certified?', answer: 'All products are sourced from WHO-GMP certified manufacturers with proper documentation.', page: 'home', sortOrder: 3 },
      ],
    });
    console.log('✓ FAQs');
  }

  // ---- CTA ----
  const ctaCount = await prisma.cta.count();
  if (ctaCount === 0) {
    await prisma.cta.create({
      data: { name: 'Partner CTA', page: 'all', badge: 'Become a partner', heading: 'Ready to stock quality medicines?', subheading: 'Partner with us for reliable bulk supply and competitive margins.', ctaLabel: 'Contact us', ctaUrl: '/contact' },
    });
    console.log('✓ CTA');
  }

  // ---- About ----
  const aboutSections = [
    { sectionKey: 'hero', eyebrow: 'About us', heading: 'About Devshay Healthcare', subheading: 'A trusted name in B2B pharmaceutical supply, committed to quality and reliability.', sortOrder: 0 },
    { sectionKey: 'who_we_are', eyebrow: 'Who we are', heading: 'Led by quality, driven by trust', subheading: 'We supply genuine, certified medicines in bulk to pharmacies and distributors across India.', sortOrder: 1, data: { stats: [{ value: '15+', label: 'Years of experience' }, { value: '5,000+', label: 'Pharmacies served' }, { value: '28+', label: 'States covered' }, { value: '100%', label: 'Genuine products' }], bullets: ['WHO-GMP certified sourcing', 'Pan-India logistics network', 'Competitive bulk pricing', 'Responsive support team'] } },
    { sectionKey: 'vision', eyebrow: 'Our Vision', heading: 'Accessible healthcare for every pharmacy', subheading: 'To be the most trusted pharmaceutical supply partner in the country.', sortOrder: 2 },
    { sectionKey: 'mission', eyebrow: 'Our Mission', heading: 'Reliable supply, every time', subheading: 'Bridging manufacturers and pharmacies with quality products and dependable service.', sortOrder: 3 },
    { sectionKey: 'story', eyebrow: 'Our story', heading: 'From a small distributor to a trusted supplier', subheading: 'What began as a single warehouse now serves thousands of pharmacies nationwide.', sortOrder: 5 },
  ];
  for (const s of aboutSections) {
    await prisma.aboutSection.upsert({ where: { sectionKey: s.sectionKey }, update: {}, create: s });
  }
  console.log('✓ About sections');

  console.log('\nSeed complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
