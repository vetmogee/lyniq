'use client';

import { useState, useEffect, useRef } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface Employee {
  id: string;
  name: string;
  title: string | null;
  photo: string | null;
  description: string | null;
}

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

export default function EditEmployeeModal({ isOpen, onClose, employee }: EditEmployeeModalProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [photo, setPhoto] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (employee) {
      setName(employee.name);
      setTitle(employee.title || '');
      setPhoto('');
      setPhotoFile(null);
      setPhotoPreview(null);
      setCurrentPhotoUrl(employee.photo);
      setDescription(employee.description || '');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [employee]);

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
      setCurrentPhotoUrl(null); // Clear current photo preview
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
    setCurrentPhotoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee) return;

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
      let photoUrl: string | null = null;

      // If a new file is uploaded, upload it and link to employee
      if (photoFile) {
        const formData = new FormData();
        formData.append('file', photoFile);
        formData.append('employeeId', employee.id);

        const uploadResponse = await fetch('/api/images/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          throw new Error(uploadData.error || uploadData.details || 'Failed to upload photo');
        }

        const uploadData = await uploadResponse.json();
        
        // Fetch the image to get its data URL
        const imageResponse = await fetch(`/api/images/${uploadData.id}`);
        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          if (imageData.image?.data) {
            const imageJson = JSON.parse(imageData.image.data);
            photoUrl = `data:${imageJson.mimeType};base64,${imageJson.data}`;
          }
        }
      } else if (photo.trim()) {
        // Use URL if provided (for backward compatibility)
        photoUrl = photo.trim();
      } else if (currentPhotoUrl && !photoFile && !photo.trim()) {
        // Keep existing photo if no changes
        photoUrl = currentPhotoUrl;
      }

      // Update employee
      const response = await fetch(`/api/employees/${employee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          title: title.trim() || null,
          photo: photoUrl,
          description: description.trim() || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update employee');
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
    if (!employee) return;
    
    if (!confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/employees/${employee.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete employee');
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

  if (!employee) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Employee"
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
          
          {(photoPreview || currentPhotoUrl) ? (
            <div className="mb-4">
              <div className="relative w-full h-48 bg-[#b0aeab] border-2 border-gray-800 mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoPreview || currentPhotoUrl || ''}
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
                id="photo-upload-edit"
              />
              <label
                htmlFor="photo-upload-edit"
                className="block w-full px-4 py-2 bg-[#b0aeab] border-2 border-gray-800 text-white cursor-pointer hover:border-white transition-colors text-center"
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
                  setCurrentPhotoUrl(null);
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
