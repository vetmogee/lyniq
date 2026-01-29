'use client';

import { useState, useRef } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface ImageGroup {
  id: string;
  name: string;
}

interface AddImageToGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageGroup: ImageGroup | null;
}

export default function AddImageToGroupModal({ isOpen, onClose, imageGroup }: AddImageToGroupModalProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.');
        return;
      }

      // Validate file size (max 50MB)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        setError('File size too large. Maximum size is 50MB.');
        return;
      }

      setImageFile(file);
      setError('');

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageGroup) return;

    setError('');
    setIsSubmitting(true);
    setIsUploading(true);

    // Validation
    if (!imageFile) {
      setError('Please upload an image file');
      setIsSubmitting(false);
      setIsUploading(false);
      return;
    }

    try {
      // Upload file directly to image group endpoint
      const formData = new FormData();
      formData.append('file', imageFile);
      if (title.trim()) formData.append('title', title.trim());
      if (description.trim()) formData.append('description', description.trim());
      formData.append('order', order.toString());

      const response = await fetch(`/api/image-groups/${imageGroup.id}/images`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || data.details || 'Failed to add image');
      }

      // Reset form
      setImageFile(null);
      setImagePreview(null);
      setTitle('');
      setDescription('');
      setOrder(0);
      setError('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
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
      setIsUploading(false);
    }
  };

  if (!imageGroup) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add Image to ${imageGroup.name}`}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting || isUploading}>
            {isUploading ? 'Uploading...' : 'Add Image'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Image *
          </label>
          
          {imagePreview ? (
            <div className="mb-4">
              <div className="relative w-full h-48 bg-gray-900 border-2 border-gray-800 mb-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveImage}
              >
                Remove Image
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="block w-full px-4 py-2 bg-gray-900 border-2 border-gray-800 text-white cursor-pointer hover:border-white transition-colors text-center"
              >
                Choose Image
              </label>
            </div>
          )}
        </div>

        <Input
          label="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Image title"
        />

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Image description..."
            rows={3}
            className="w-full px-4 py-2 bg-gray-900 border-2 border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
          />
        </div>

        <Input
          label="Order (optional)"
          value={order.toString()}
          onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
          placeholder="0"
          type="number"
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
