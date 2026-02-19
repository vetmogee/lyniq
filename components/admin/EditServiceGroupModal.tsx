'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface ServiceGroup {
  id: string;
  name: string;
  description: string | null;
  position: number;
}

interface EditServiceGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceGroup: ServiceGroup | null;
}

export default function EditServiceGroupModal({ isOpen, onClose, serviceGroup }: EditServiceGroupModalProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [position, setPosition] = useState('0');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (serviceGroup) {
      setName(serviceGroup.name);
      setDescription(serviceGroup.description || '');
      setPosition(serviceGroup.position.toString());
    }
  }, [serviceGroup]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceGroup) return;

    setError('');
    setIsSubmitting(true);

    // Validation
    if (!name.trim()) {
      setError('Service group name is required');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/service-groups/${serviceGroup.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          position: parseInt(position) || 0,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update service group');
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
    if (!serviceGroup) return;
    
    if (!confirm('Are you sure you want to delete this service group? All services in this group will also be deleted. This action cannot be undone.')) {
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/service-groups/${serviceGroup.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete service group');
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

  if (!serviceGroup) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Service Group"
      size="lg"
      footer={
        <>
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={isSubmitting}
            className="text-red-400 border-red-400 hover:bg-red-900"
          >
            Delete Group
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={isSubmitting}>
              Save Changes
            </Button>
          </div>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Service Group Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Manicure Services"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Position"
            type="number"
            min="0"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="0"
            required
          />
          <Input
            label="Service Group Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe this service group"
          />
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
