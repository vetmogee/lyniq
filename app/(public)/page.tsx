import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { getCachedGoogleReviews } from '@/lib/google-reviews';
import ReviewsSlider from '@/components/ReviewsSlider';

export default async function HomePage() {
  // Fetch reviews (server-side)
  let reviews: Array<{
    id: string;
    authorName: string;
    rating: number;
    text: string | null;
    relativeTime: string;
    reviewCreatedAt: Date;
  }> = [];

  try {
    reviews = await getCachedGoogleReviews();
  } catch (error) {
    console.error('Error loading reviews:', error);
    // Continue rendering page even if reviews fail to load
  }
  return (
    <div className="bg-[#202020]">
      {/* Sticky Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0"
      >
        <source src="/intro.mp4" type="video/mp4" />
      </video>
      {/* Overlay for better text readability and tint */}
      <div className="fixed inset-0 bg-[#141414] opacity-30 z-0" />
      
      {/* Hero Section */}
      <section className="relative w-full flex items-center justify-center py-20 md:py-32 z-10">
        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              PROFESIONÁLNÍ PÉČE O NEHTY
            </h1>
            <p className="text-lg md:text-xl text-white mb-8 max-w-2xl mx-auto">
              Zažijte preciznost a umění s našimi moderními službami nehtového studia. Ostré designy, odborné řemeslo a výjimečná péče.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center">
              <Link href="https://noona.app/cs/lyniqstudio/book" target="_blank" rel="noopener noreferrer" className="flex">
                <Button size="lg" className="w-full sm:w-auto">Rezervovat</Button>
              </Link>
              <Link href="/services" className="flex">
                <Button size="lg" className="w-full sm:w-auto">Zobrazit služby</Button>
              </Link>
              <Link href="/contact" className="flex">
                <Button size="lg" className="w-full sm:w-auto">Kontaktujte nás</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative bg-[#202020] py-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card variant="bordered">
              <CardHeader className="text-center">
                <CardTitle>Odborní technici</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-400">
                  Náš tým se skládá z certifikovaných profesionálů s mnohaletými zkušenostmi v nehtovém umění a péči.
                </p>
              </CardContent>
            </Card>

            <Card variant="bordered">
              <CardHeader className="text-center">
                <CardTitle>Prémiové produkty</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-400">
                  Používáme pouze nejkvalitnější produkty a nástroje, abychom zajistili trvalé výsledky.
                </p>
              </CardContent>
            </Card>

            <Card variant="bordered">
              <CardHeader className="text-center">
                <CardTitle>Moderní techniky</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-400">
                  Zůstaňte vpředu s nejnovějšími trendy a technikami v designu a péči o nehty.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <section className="relative max-w mx-auto bg-[#202020] px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12 ">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Co říkají naši zákazníci
            </h2>
            <p className="text-lg text-gray-400">
              Skutečné recenze z Google Maps
            </p>
          </div>
          <ReviewsSlider reviews={reviews} />
        </section>
      )}

      {/* CTA Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Připraveni proměnit své nehty?
          </h2>
          <p className="text-lg text-white mb-8">
            Kontaktujte nás ještě dnes a zažijte rozdíl.
          </p>
          <Link href="/contact">
            <Button size="lg">Začít</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
