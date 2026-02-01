'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function ContactPage() {

  return (
    <div className="bg-[#202020]">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            KONTAKTUJTE NÁS
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Kontaktujte nás s jakýmikoli dotazy nebo dotazy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Navštivte nás</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-white mb-1">Adresa</p>
                  <p className="text-gray-400">
                    <a href="https://www.google.com/maps/search/?api=1&query=Želenická+1627/25/405+02,+405+02+Děčín+2-Letná" target="_blank" rel="noopener noreferrer" className="underline">
                      Želenická 1627/25/405 02
                    </a>
                  </p>
                  <p className="text-gray-400">
                    <a href="https://www.google.com/maps/search/?api=1&query=Želenická+1627/25/405+02,+405+02+Děčín+2-Letná" target="_blank" rel="noopener noreferrer" className="underline">
                      405 02 Děčín 2-Letná
                    </a>
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-semibold text-white mb-1">Otevírací doba</p>
                  <p className="text-gray-400">Sunday: Closed</p>
                  <p className="text-gray-400">Monday: 9 am–7 pm</p>
                  <p className="text-gray-400">Tuesday: 9 am–7 pm</p>
                  <p className="text-gray-400">Wednesday: 9 am–7 pm</p>
                  <p className="text-gray-400">Thursday: 9 am–7 pm</p>
                  <p className="text-gray-400">Friday: 9 am–7 pm</p>
                  <p className="text-gray-400">Saturday: 9 am–3 pm</p>
                </div>
              </CardContent>
            </Card>

            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Kontaktujte nás</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-white mb-1">Telefon</p>
                  <p className="text-gray-400"><a href="tel:+420775995611" className="underline">+420 775 995 611</a></p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">Instagram</p>
                  <p className="text-gray-400"><a href="https://www.instagram.com/lyniqstudio/?hl=en" target="_blank" rel="noopener noreferrer" className="underline">@lyniqstudio</a></p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">Facebook</p>
                  <p className="text-gray-400"><a href="https://www.facebook.com/profile.php?id=61576728607438" target="_blank" rel="noopener noreferrer" className="underline">LYNIQ studio</a></p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Mapa</CardTitle>
              </CardHeader>
              <CardContent>
                <iframe
                  src="https://www.google.com/maps/place/?q=place_id:ChIJ3VqQGwCfCUcRpJZDaZ232KU&output=embed"
                  width="100%"
                  height="500"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-md"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
