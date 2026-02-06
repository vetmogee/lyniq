'use client';

import { useState, useRef } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface CreateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateEmployeeModal({ isOpen, onClose }: CreateEmployeeModalProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [photo, setPhoto] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
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

      // Validate file size (max 10MB for base64 storage)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setError('File size too large. Maximum size is 5MB.');
        return;
      }

      setPhotoFile(file);
      setPhoto(''); // Clear URL input if file is selected
      setError('');

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhoto('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    setIsUploading(true);

    // Validation
    if (!name.trim()) {
      setError('Employee name is required');
      setIsSubmitting(false);
      setIsUploading(false);
      return;
    }

    try {
      // Create employee first
      const createResponse = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          title: title.trim() || undefined,
          photo: photo.trim() || null,
          description: description.trim() || undefined,
        }),
      });

      if (!createResponse.ok) {
        const data = await createResponse.json();
        throw new Error(data.error || 'Failed to create employee');
      }

      const employeeData = await createResponse.json();
      const employeeId = employeeData.employee?.id;

      // If a file is uploaded, create Image record linked to employee
      if (photoFile && employeeId) {
        const formData = new FormData();
        formData.append('file', photoFile);
        formData.append('employeeId', employeeId);

        const uploadResponse = await fetch('/api/images/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          throw new Error(uploadData.error || uploadData.details || 'Failed to upload photo');
        }

        // Update employee photo field with data URL for backward compatibility
        const uploadData = await uploadResponse.json();
        const imageResponse = await fetch(`/api/images/${uploadData.id}`);
        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          if (imageData.image?.data) {
            const imageJson = JSON.parse(imageData.image.data);
            const photoUrl = `data:${imageJson.mimeType};base64,${imageJson.data}`;
            
            // Update employee with photo URL
            await fetch(`/api/employees/${employeeId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: name.trim(),
                title: title.trim() || undefined,
                photo: photoUrl,
                description: description.trim() || undefined,
              }),
            });
          }
        }
      }

      // Reset form
      setName('');
      setTitle('');
      setPhoto('');
      setPhotoFile(null);
      setPhotoPreview(null);
      setDescription('');
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Employee"
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting || isUploading}>
            {isUploading ? 'Uploading...' : 'Create Employee'}
          </Button>
        </>
      }

    >
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Employee Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Jane Smith"
          required
        />

        <Input
          label="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Senior Nail Technician"
        />

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Photo (optional)
          </label>
          
          {photoPreview ? (
            <div className="mb-4">
              <div className="relative w-full aspect-square bg-[#202020] border-2 border-gray-800 mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemovePhoto}
              >
                Remove Photo
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
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="block w-full px-4 py-2 bg-[#202020] border-2 border-[#636362] text-white cursor-pointer hover:border-white transition-colors text-center"
              >
                Choose Photo
              </label>
              <p className="text-xs text-gray-500 text-center">or</p>
              <Input
                value={photo}
                onChange={(e) => {
                  setPhoto(e.target.value);
                  setPhotoFile(null);
                  setPhotoPreview(null);
                }}
                placeholder="Enter photo URL (optional)"
                type="url"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Employee description and bio..."
            rows={4}
            className="w-full px-4 py-2 bg-[#202020] border-2 border-[#636362] text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
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
