'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import CreateImageGroupModal from '@/components/admin/CreateImageGroupModal';
import EditImageGroupModal from '@/components/admin/EditImageGroupModal';
import AddImageToGroupModal from '@/components/admin/AddImageToGroupModal';
import EditImageModal from '@/components/admin/EditImageModal';
import { getImageDataUrl } from '@/lib/image-utils';

interface Image {
  id: string;
  data: string; // JSON string with base64 image data
  mimeType: string;
  filename: string | null;
  title: string | null;
  description: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ImageGroup {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  images: Image[];
}

export default function AdminGalleryPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false);
  const [isAddImageModalOpen, setIsAddImageModalOpen] = useState(false);
  const [isEditImageModalOpen, setIsEditImageModalOpen] = useState(false);
  const [selectedImageGroup, setSelectedImageGroup] = useState<ImageGroup | null>(null);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [imageGroups, setImageGroups] = useState<ImageGroup[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchImageGroups = async () => {
    try {
      const response = await fetch('/api/image-groups');
      if (response.ok) {
        const data = await response.json();
        setImageGroups(data.imageGroups || []);
      }
    } catch (error) {
      console.error('Failed to fetch image groups:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImageGroups();
  }, []);

  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
    fetchImageGroups();
  };

  const handleEditGroupModalClose = () => {
    setIsEditGroupModalOpen(false);
    setSelectedImageGroup(null);
    fetchImageGroups();
  };

  const handleAddImageModalClose = () => {
    setIsAddImageModalOpen(false);
    setSelectedImageGroup(null);
    fetchImageGroups();
  };

  const handleEditImageModalClose = () => {
    setIsEditImageModalOpen(false);
    setSelectedImage(null);
    fetchImageGroups();
  };

  const handleEditImageGroup = (group: ImageGroup) => {
    setSelectedImageGroup(group);
    setIsEditGroupModalOpen(true);
  };

  const handleAddImageToGroup = (group: ImageGroup) => {
    setSelectedImageGroup(group);
    setIsAddImageModalOpen(true);
  };

  const handleEditImage = (image: Image) => {
    setSelectedImage(image);
    setIsEditImageModalOpen(true);
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 bg-black min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading gallery...</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 md:p-8 bg-black min-h-screen">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Gallery</h1>
            <p className="text-gray-400 mt-2">Manage your image gallery</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>Create Image Group</Button>
        </div>

        {imageGroups.length === 0 ? (
          <Card variant="bordered">
            <CardContent className="py-12 text-center">
              <p className="text-gray-400 mb-4">No image groups found.</p>
              <Button onClick={() => setIsCreateModalOpen(true)}>Create Your First Image Group</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {imageGroups.map((group) => (
              <Card key={group.id} variant="bordered">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{group.name}</CardTitle>
                      {group.description && (
                        <p className="text-gray-400 text-sm">{group.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddImageToGroup(group)}
                      >
                        Add Image
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditImageGroup(group)}
                      >
                        Edit Group
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {group.images.length === 0 ? (
                    <div className="py-8 text-center">
                      <p className="text-gray-400 mb-4">No images in this group.</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddImageToGroup(group)}
                      >
                        Add First Image
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {group.images.map((image) => (
                        <div
                          key={image.id}
                          className="relative group border-2 border-[#b0aeab] hover:border-white transition-colors"
                        >
                          <div className="relative w-full aspect-square bg-[#b0aeab] overflow-hidden">
                            <img
                              src={getImageDataUrl(image.data) || ''}
                              alt={image.title || 'Gallery image'}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditImage(image)}
                              >
                                Edit
                              </Button>
                            </div>
                          </div>
                          {(image.title || image.description) && (
                            <div className="p-3 bg-[#b0aeab]">
                              {image.title && (
                                <p className="text-white font-medium text-sm mb-1">{image.title}</p>
                              )}
                              {image.description && (
                                <p className="text-gray-400 text-xs line-clamp-2">{image.description}</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <CreateImageGroupModal isOpen={isCreateModalOpen} onClose={handleCreateModalClose} />
      <EditImageGroupModal
        isOpen={isEditGroupModalOpen}
        onClose={handleEditGroupModalClose}
        imageGroup={selectedImageGroup}
      />
      <AddImageToGroupModal
        isOpen={isAddImageModalOpen}
        onClose={handleAddImageModalClose}
        imageGroup={selectedImageGroup}
      />
      <EditImageModal
        isOpen={isEditImageModalOpen}
        onClose={handleEditImageModalClose}
        image={selectedImage as any}
      />
    </>
  );
}
