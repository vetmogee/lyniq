'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface ImageGroup {
  id: string;
  name: string;
  description: string | null;
}

interface EditImageGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageGroup: ImageGroup | null;
}

export default function EditImageGroupModal({ isOpen, onClose, imageGroup }: EditImageGroupModalProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (imageGroup) {
      setName(imageGroup.name);
      setDescription(imageGroup.description || '');
    }
  }, [imageGroup]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageGroup) return;

    setError('');
    setIsSubmitting(true);

    // Validation
    if (!name.trim()) {
      setError('Image group name is required');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/image-groups/${imageGroup.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update image group');
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
    if (!imageGroup) return;
    
    if (!confirm('Are you sure you want to delete this image group? All images in this group will also be deleted. This action cannot be undone.')) {
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/image-groups/${imageGroup.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete image group');
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

  if (!imageGroup) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Image Group"
      size="lg"
      footer={
        <>
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={isSubmitting}
            className="text-red-400 border-red-400 hover:bg-red-900"
          >
            Delete
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
          label="Group Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Nail Art Gallery"
          required
        />

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Group description..."
            rows={4}
            className="w-full px-4 py-2 bg-[#636362] border-2 border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
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
