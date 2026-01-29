'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface AddServiceToGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceGroupId: string;
  serviceGroupName: string;
}

export default function AddServiceToGroupModal({ isOpen, onClose, serviceGroupId, serviceGroupName }: AddServiceToGroupModalProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      const response = await fetch(`/api/service-groups/${serviceGroupId}/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          price: parseFloat(price),
          duration: parseInt(duration) || 60,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create service');
      }

      // Reset form
      setName('');
      setDescription('');
      setPrice('');
      setDuration('');
      setError('');

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add Service to ${serviceGroupName}`}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting}>
            Add Service
          </Button>
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
            placeholder="60"
          />
        </div>

        <Input
          label="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Service description"
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
