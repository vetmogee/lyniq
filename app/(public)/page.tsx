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
    <div className="bg-black">
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
      <div className="fixed inset-0 bg-black opacity-30 z-0" />
      
      {/* Hero Section */}
      <section className="relative w-full flex items-center justify-center py-20 md:py-32 z-10">
        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              PROFESSIONAL NAIL CARE
            </h1>
            <p className="text-lg md:text-xl text-black mb-8 max-w-2xl mx-auto">
              Experience precision and artistry with our modern nail salon services.
              Sharp designs, expert craftsmanship, and exceptional care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/services">
                <Button size="lg">View Services</Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">Contact Us</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Expert Technicians</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Our team consists of certified professionals with years of experience in nail art and care.
                </p>
              </CardContent>
            </Card>

            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Premium Products</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  We use only the highest quality products and tools to ensure lasting results.
                </p>
              </CardContent>
            </Card>

            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Modern Techniques</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Stay ahead with the latest trends and techniques in nail design and care.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <section className="relative mx-auto px-4 sm:px-6 lg:px-8 py-16 z-10 bg-black">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-400">
              Real reviews from Google Maps
            </p>
          </div>
          <ReviewsSlider reviews={reviews} />
        </section>
      )}

      {/* CTA Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Nails?
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            Contact us today and experience the difference.
          </p>
          <Link href="/contact">
            <Button size="lg">Get Started</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
