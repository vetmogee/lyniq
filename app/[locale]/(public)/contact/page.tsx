'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function ContactPage() {
  const t = useTranslations('Contact');
  const locale = useLocale();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await fetch('/api/google-maps-key');
        const data = await response.json();
        
        if (response.ok && data.apiKey) {
          setApiKey(data.apiKey);
        } else {
          console.error('Failed to fetch API key:', data.error);
        }
      } catch (error) {
        console.error('Error fetching API key:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiKey();
  }, []);

  const mapSrc = apiKey 
    ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyAV_0ohWRAt0ILMsF1hLgkk-xqFICQnla0&q=place_id:ChIJ3VqQGwCfCUcRpJZDaZ232KU&language=${locale}`
    : '';

  return (
    <div className="bg-[#202020]">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-12 animate-[slideDown_0.6s_ease-out]">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="order-1 lg:order-1 animate-[slideDown_0.6s_ease-out_0.2s_both]">
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>{t('contactUs')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xl font-semibold text-white mb-1">{t('phone')}</p>
                  <p className="text-gray-400 text-md"><a href="tel:+420775995611" className="underline">+420 775 995 611</a></p>
                </div>
                <div>
                  <p className="text-xl font-semibold text-white mb-1">Instagram</p>
                  <p className="text-gray-400 text-md"><a href="https://www.instagram.com/lyniqstudio/?hl=en" target="_blank" rel="noopener noreferrer" className="underline">@lyniqstudio</a></p>
                </div>
                <div>
                  <p className="text-xl font-semibold text-white mb-1">Facebook</p>
                  <p className="text-gray-400 text-md"><a href="https://www.facebook.com/profile.php?id=61576728607438" target="_blank" rel="noopener noreferrer" className="underline">LYNIQ studio</a></p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="order-2 lg:order-3 animate-[slideDown_0.6s_ease-out_0.4s_both]">
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>{t('visitUs')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="pb-3">
                  <p className="text-xl font-semibold text-white mb-1">{t('address')}</p>
                  <p className="text-gray-400">
                    <a href="https://maps.app.goo.gl/LjDxHHrtcxPfdSgX7" target="_blank" rel="noopener noreferrer" className="underline">
                      Želenická 1627/25/405 02
                    </a>
                  </p>
                  <p className="text-gray-400">
                    <a href="https://maps.app.goo.gl/LjDxHHrtcxPfdSgX7" target="_blank" rel="noopener noreferrer" className="underline">
                      405 02 Děčín 2-Letná
                    </a>
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-md">
                  <div>
                  <p className="text-xl font-semibold text-white mb-1">{t('openingHours')}</p>
                  <p className="text-gray-400">{t('weekdays')}</p>
                  <p className="text-gray-400">{t('saturday')}</p>
                  <p className="text-gray-400">{t('sunday')}</p>
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-white mb-1 invisible">{t('openingHours')}</p>
                    <p className="text-gray-400">09:00 - 19:00</p>
                    <p className="text-gray-400">09:00 - 15:00</p>
                    <p className="text-gray-400">{t('closed')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="order-3 lg:order-2 lg:col-span-1 lg:row-span-2 animate-[slideDown_0.6s_ease-out_0.6s_both]">
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>{t('map')}</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center h-[500px] text-gray-400">
                    {t('mapLoading')}
                  </div>
                ) : apiKey ? (
                  <iframe
                    src={mapSrc}
                    width="100%"
                    height="500"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-md"
                  />
                ) : (
                  <div className="flex items-center justify-center h-[500px] text-gray-400">
                    {t('mapError')}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
