import Link from 'next/link';
import Image from 'next/image';
import { Link as LocaleLink } from '@/i18n/navigation';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { getGoogleReviews } from '@/lib/google-reviews';
import ReviewsSlider from '@/components/ReviewsSlider';
import { Metadata } from 'next';
import { OG_IMAGE, SITE_NAME, SITE_URL, localizedPath, pageMetadata } from '@/lib/site';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return pageMetadata({
    locale,
    title: t('homeTitle'),
    description: t('homeDescription'),
  });
}

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;

  // Requests for missing root files (e.g. /lyniq.svg) land here as a "locale" -
  // bail out before calling SerpAPI (the layout's check runs in parallel)
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const t = await getTranslations('Home');
  const tCommon = await getTranslations('Common');

  // Fetch reviews (server-side, cached for 24h)
  const { reviews, placeInfo } = await getGoogleReviews(locale);
  const tMeta = await getTranslations('Metadata');

  // Structured data so search engines can show the salon as a local business
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NailSalon',
    name: SITE_NAME,
    url: `${SITE_URL}${localizedPath(locale)}`,
    logo: `${SITE_URL}/icon-512.png`,
    image: `${SITE_URL}${OG_IMAGE.url}`,
    description: tMeta('description'),
    telephone: '+420775995611',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Želenická 1627/25',
      addressLocality: 'Děčín',
      postalCode: '405 02',
      addressCountry: 'CZ',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 50.7593947,
      longitude: 14.1895123,
    },
    hasMap: 'https://maps.app.goo.gl/LjDxHHrtcxPfdSgX7',
    sameAs: [
      'https://www.instagram.com/lyniqstudio/',
      'https://www.facebook.com/profile.php?id=61576728607438',
    ],
    ...(placeInfo?.rating && placeInfo.reviewCount
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: placeInfo.rating,
            reviewCount: placeInfo.reviewCount,
          },
        }
      : {}),
  };

  return (
    <div className="bg-[#202020]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      {/* Sticky Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0"
      >
        <source src="/lyniq.webm" type="video/webm" />
        <source src="/lyniq.mp4" type="video/mp4" />
      </video>
      {/* Overlay for better text readability and tint */}
      <div className="fixed inset-0 bg-[#141414] opacity-30 z-0" />
      
      {/* Hero Section */}
      <section className="relative w-full flex items-center justify-center py-30 md:py-50 z-10">
        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Image
              src="/lyniq.svg"
              alt="Lyniq Beauty Studio"
              width={200}
              height={100}
              priority
              className="mx-auto mb-6 w-40 md:w-56 h-auto animate-[slideDown_0.8s_ease-out]"
            />
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-[slideDown_0.8s_ease-out]">
              {t('heroTitle')}
            </h1>
            <p className="text-lg md:text-xl text-white mb-8 max-w-2xl mx-auto animate-[slideDown_0.8s_ease-out_0.2s_both]">
              {t('heroText')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center animate-[slideDown_0.8s_ease-out_0.4s_both]">
              <Link href="https://noona.app/cs/lyniqstudio/book" target="_blank" rel="noopener noreferrer" className="flex">
                <Button size="lg" className="w-full sm:w-auto">{tCommon('book')}</Button>
              </Link>
              <LocaleLink href="/services" className="flex">
                <Button size="lg" className="w-full sm:w-auto">{t('viewServices')}</Button>
              </LocaleLink>
              <LocaleLink href="/contact" className="flex">
                <Button size="lg" className="w-full sm:w-auto">{t('contactUs')}</Button>
              </LocaleLink>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative bg-[#202020] py-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card variant="bordered" className="animate-[slideDown_0.8s_ease-out_0.6s_both]">
              <CardHeader className="text-center">
                <CardTitle>{t('expertsTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-400 text-xl">
                  {t('expertsText')}
                </p>
              </CardContent>
            </Card>

            <Card variant="bordered" className="animate-[slideDown_0.8s_ease-out_0.8s_both]">
              <CardHeader className="text-center">
                <CardTitle>{t('productsTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-400 text-xl">
                  {t('productsText')}
                </p>
              </CardContent>
            </Card>

            <Card variant="bordered" className="animate-[slideDown_0.8s_ease-out_1s_both]">
              <CardHeader className="text-center ">
                <CardTitle>{t('techniquesTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-400 text-xl">
                  {t('techniquesText')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <>
        {/* Divider between features and reviews */}
        <div className="relative bg-[#202020] z-10">
          <hr className="mx-auto w-[90%] md:w-[80%] lg:w-[70%] border-0 h-px bg-white" />
        </div>

        <section className="relative max-w mx-auto bg-[#202020] px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12 ">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-[slideDown_0.8s_ease-out_1.2s_both]">
              {t('reviewsTitle')}
            </h2>
            {placeInfo && placeInfo.rating && placeInfo.reviewCount && (
              <div className="flex items-center justify-center gap-2 mb-4 animate-[slideDown_0.8s_ease-out_1.4s_both]">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-lg ${
                        star <= Math.round(placeInfo.rating!) ? 'text-yellow-400' : 'text-gray-600'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-white font-semibold">
                  {placeInfo.rating.toFixed(1)}
                </span>
                <span className="text-gray-400">
                  {t('reviewCount', { count: placeInfo.reviewCount })}
                </span>
              </div>
            )}
            <p className="text-lg text-gray-400 animate-[slideDown_0.8s_ease-out_1.6s_both]">
              {t('reviewsSource')}
            </p>
          </div>
          <div className="animate-[slideDown_0.8s_ease-out_1.8s_both]">
            <ReviewsSlider reviews={reviews} />
          </div>
        </section>
        </>
      )}

      {/* CTA Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-[slideDown_0.8s_ease-out_2s_both]">
            {t('ctaTitle')}
          </h2>
          <p className="text-lg text-white mb-8 animate-[slideDown_0.8s_ease-out_2.2s_both]">
            {t('ctaText')}
          </p>
          <div className="animate-[slideDown_0.8s_ease-out_2.4s_both]">
            <LocaleLink href="/contact">
              <Button size="lg">{t('ctaButton')}</Button>
            </LocaleLink>
          </div>
        </div>
      </section>
    </div>
  );
}
