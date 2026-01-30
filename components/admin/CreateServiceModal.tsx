'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface Service {
  name: string;
  price: string;
  description?: string;
  duration?: string;
}

interface CreateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateServiceModal({ isOpen, onClose }: CreateServiceModalProps) {
  const router = useRouter();
  const [serviceGroupName, setServiceGroupName] = useState('');
  const [serviceGroupDescription, setServiceGroupDescription] = useState('');
  const [services, setServices] = useState<Service[]>([{ name: '', price: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const addService = () => {
    setServices([...services, { name: '', price: '' }]);
  };

  const removeService = (index: number) => {
    if (services.length > 1) {
      setServices(services.filter((_, i) => i !== index));
    }
  };

  const updateService = (index: number, field: keyof Service, value: string) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validation
    if (!serviceGroupName.trim()) {
      setError('Service group name is required');
      setIsSubmitting(false);
      return;
    }

    const validServices = services.filter(s => s.name.trim() && s.price.trim());
    if (validServices.length === 0) {
      setError('At least one service with name and price is required');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceGroupName: serviceGroupName.trim(),
          serviceGroupDescription: serviceGroupDescription.trim() || undefined,
          services: validServices.map(s => ({
            name: s.name.trim(),
            price: parseFloat(s.price),
            description: s.description?.trim() || undefined,
            duration: s.duration ? parseInt(s.duration) : 60,
          })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create service group');
      }

      // Reset form
      setServiceGroupName('');
      setServiceGroupDescription('');
      setServices([{ name: '', price: '' }]);
      setError('');
      
      // Close modal first, then refresh
      onClose();
      
      // Small delay to ensure modal closes smoothly before refresh
      setTimeout(() => {
        router.refresh();
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Service Group"
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting}>
            Create Service Group
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Service Group Name"
          value={serviceGroupName}
          onChange={(e) => setServiceGroupName(e.target.value)}
          placeholder="e.g., Manicure Services"
          required
        />

        <Input
          label="Service Group Description (optional)"
          value={serviceGroupDescription}
          onChange={(e) => setServiceGroupDescription(e.target.value)}
          placeholder="Describe this service group"
        />

        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-white">
              Services
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addService}
            >
              + Add Service
            </Button>
          </div>

          <div className="space-y-4">
            {services.map((service, index) => (
              <div
                key={index}
                className="p-4 border-2 border-[#b0aeab] bg-[#b0aeab]"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm font-medium text-gray-400">
                    Service {index + 1}
                  </span>
                  {services.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <Input
                    label="Service Name"
                    value={service.name}
                    onChange={(e) => updateService(index, 'name', e.target.value)}
                    placeholder="e.g., Classic Manicure"
                    required
                  />
                  <Input
                    label="Price (Kč)"
                    type="number"
                    step="0.01"
                    min="0"
                    value={service.price}
                    onChange={(e) => updateService(index, 'price', e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Duration (minutes)"
                    type="number"
                    min="1"
                    value={service.duration || '60'}
                    onChange={(e) => updateService(index, 'duration', e.target.value)}
                    placeholder="60"
                  />
                  <Input
                    label="Description (optional)"
                    value={service.description || ''}
                    onChange={(e) => updateService(index, 'description', e.target.value)}
                    placeholder="Service description"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-900 border-2 border-red-600">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
      </form>
    </Modal>
  );
}
