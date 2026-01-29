'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // In production, this would send to an API endpoint
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-black">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            CONTACT US
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Get in touch with us for any questions or inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Visit Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-white mb-1">Address</p>
                  <p className="text-gray-400">123 Salon Street</p>
                  <p className="text-gray-400">City, State 12345</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">Phone</p>
                  <p className="text-gray-400">(555) 123-4567</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">Email</p>
                  <p className="text-gray-400">info@nailsalon.com</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">Hours</p>
                  <p className="text-gray-400">Monday - Friday: 9:00 AM - 7:00 PM</p>
                  <p className="text-gray-400">Saturday: 10:00 AM - 6:00 PM</p>
                  <p className="text-gray-400">Sunday: Closed</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Input
                    label="Email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Message
                    </label>
                    <textarea
                      className="w-full px-4 py-3 border-2 border-gray-900 bg-black text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all duration-200"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                  
                  {submitStatus === 'success' && (
                    <p className="text-sm text-green-400">Message sent successfully!</p>
                  )}
                  {submitStatus === 'error' && (
                    <p className="text-sm text-red-400">Failed to send message. Please try again.</p>
                  )}

                  <Button type="submit" isLoading={isSubmitting} className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
