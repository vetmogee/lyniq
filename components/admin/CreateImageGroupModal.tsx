'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface CreateImageGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateImageGroupModal({ isOpen, onClose }: CreateImageGroupModalProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validation
    if (!name.trim()) {
      setError('Image group name is required');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/image-groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create image group');
      }

      // Reset form
      setName('');
      setDescription('');
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
      title="Create Image Group"
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting}>
            Create Group
          </Button>
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
            className="w-full px-4 py-2 bg-[#b0aeab] border-2 border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
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
