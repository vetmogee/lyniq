'use client';

import { useState, useEffect, useRef } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { getImageDataUrl } from '@/lib/image-utils';

interface Image {
  id: string;
  data: string; // JSON string with base64 image data
  mimeType: string;
  filename: string | null;
  title: string | null;
  description: string | null;
  order: number;
}

interface EditImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: Image | null;
}

export default function EditImageModal({ isOpen, onClose, image }: EditImageModalProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImageDataUrl, setCurrentImageDataUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (image) {
      setImageFile(null);
      setImagePreview(null);
      setCurrentImageDataUrl(image.data ? getImageDataUrl(image.data) : null);
      setTitle(image.title || '');
      setDescription(image.description || '');
      setOrder(image.order);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [image]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.');
        return;
      }

      // Validate file size (max 10MB for base64 storage)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setError('File size too large. Maximum size is 50MB.');
        return;
      }

      setImageFile(file);
      setCurrentImageDataUrl(null); // Clear current image preview
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
    setCurrentImageDataUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;

    setError('');
    setIsSubmitting(true);
    setIsUploading(true);

    try {
      // If a new file is uploaded, convert to base64 and update
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);

        // Upload new image
        const uploadResponse = await fetch('/api/images/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const uploadErrorData = await uploadResponse.json();
          throw new Error(uploadErrorData.error || uploadErrorData.details || 'Failed to upload image');
        }

        await uploadResponse.json();
        
        // Update image with new data
        const response = await fetch(`/api/images/${image.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: title.trim() || null,
            description: description.trim() || null,
            order: order || 0,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || data.details || 'Failed to update image');
        }
      } else {
        // Just update metadata without changing image
        const response = await fetch(`/api/images/${image.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: title.trim() || null,
            description: description.trim() || null,
            order: order || 0,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || data.details || 'Failed to update image');
        }
      }


      onClose();
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

  const handleDelete = async () => {
    if (!image) return;
    
    if (!confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/images/${image.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete image');
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

  if (!image) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Image"
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
            <Button onClick={handleSubmit} isLoading={isSubmitting || isUploading}>
              {isUploading ? 'Uploading...' : 'Save Changes'}
            </Button>
          </div>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Image *
          </label>
          
          {(imagePreview || currentImageDataUrl) ? (
            <div className="mb-4">
              <div className="relative w-full h-48 bg-[#636362] border-2 border-gray-800 mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview || currentImageDataUrl || ''}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveImage}
                >
                  Remove New Image
                </Button>
                {currentImageDataUrl && !imagePreview && (
                  <p className="text-xs text-gray-400 self-center">Current image shown above</p>
                )}
              </div>
            </div>
          ) : (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                className="hidden"
                id="image-upload-edit"
              />
              <label
                htmlFor="image-upload-edit"
                className="block w-full px-4 py-2 bg-[#636362] border-2 border-gray-800 text-white cursor-pointer hover:border-white transition-colors text-center"
              >
                Choose New Image
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
            className="w-full px-4 py-2 bg-[#636362] border-2 border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
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
