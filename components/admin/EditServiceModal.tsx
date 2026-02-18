'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number | null;
  position: number;
  category: string | null;
  imageUrl: string | null;
  serviceGroupId: string | null;
}

interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
}

export default function EditServiceModal({ isOpen, onClose, service }: EditServiceModalProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [position, setPosition] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (service) {
      setName(service.name);
      setDescription(service.description || '');
      setPrice(service.price.toString());
      setDuration(service.duration ? service.duration.toString() : '');
      setPosition(service.position.toString());
      setCategory(service.category || '');
      setImageUrl(service.imageUrl || '');
    }
  }, [service]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service?.id) {
      setError('Cannot save: service not loaded. Please close and try again.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    // Validation
    if (!name.trim()) {
      setError('Service name is required');
      setIsSubmitting(false);
      return;
    }

    if (!price.trim() || parseFloat(price) <= 0) {
      setError('Valid price is required');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/services/${service.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          price: parseFloat(price),
          duration: duration ? parseInt(duration) : null,
          position: parseInt(position) || 0,
          category: category.trim() || null,
          imageUrl: imageUrl.trim() || null,
          serviceGroupId: service.serviceGroupId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update service');
      }

      onClose();
      setTimeout(() => {
        router.refresh();
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!service) return;
    
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/services/${service.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete service');
      }

      onClose();
      setTimeout(() => {
        router.refresh();
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!service) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Service"
      size="lg"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={handleDelete}
            disabled={isSubmitting}
            className="text-red-400 border-red-400 hover:bg-red-900"
          >
            Delete
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit} isLoading={isSubmitting}>
              Save Changes
            </Button>
          </div>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Service Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Classic Manicure"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price (Kč)"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            required
          />
          <Input
            label="Duration (minutes)"
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="(optional) Leave empty if not applicable"
          />
        </div>

        <Input
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="(optional) Service description"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="(optional) e.g., Manicure, Pedicure"
          />
          <Input
            label="Position"
            type="number"
            min="0"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="0"
            required
          />
        </div>

        <Input
          label="Image URL"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="(optional) https://example.com/image.jpg"
        />

        {error && (
          <div className="p-3 bg-red-900 border-2 border-red-600">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
      </form>
    </Modal>
  );
}
