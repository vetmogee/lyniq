'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import CreateImageGroupModal from './CreateImageGroupModal';
import EditImageGroupModal from './EditImageGroupModal';
import EditImageModal from './EditImageModal';
import AddImageToGroupModal from './AddImageToGroupModal';
import { getImageDataUrl } from '@/lib/image-utils';

interface Image {
  id: string;
  data: string;
  mimeType: string;
  filename: string | null;
  title: string | null;
  description: string | null;
  order: number;
}

interface ImageGroup {
  id: string;
  name: string;
  description: string | null;
  images: Image[];
}

interface GalleryAdminClientProps {
  imageGroups: ImageGroup[];
}

export default function GalleryAdminClient({ imageGroups }: GalleryAdminClientProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false);
  const [isEditImageModalOpen, setIsEditImageModalOpen] = useState(false);
  const [isAddImageModalOpen, setIsAddImageModalOpen] = useState(false);
  const [selectedImageGroup, setSelectedImageGroup] = useState<ImageGroup | null>(null);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  const handleEditGroup = (group: ImageGroup) => {
    setSelectedImageGroup(group);
    setIsEditGroupModalOpen(true);
  };

  const handleEditImage = (image: Image) => {
    setSelectedImage(image);
    setIsEditImageModalOpen(true);
  };

  const handleAddImageToGroup = (group: ImageGroup) => {
    setSelectedImageGroup(group);
    setIsAddImageModalOpen(true);
  };

  return (
    <div className="p-6 md:p-8 bg-[#202020] min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Gallery</h1>
          <p className="text-gray-400 mt-2">Manage your gallery images</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          + Add Image Group
        </Button>
      </div>

      {imageGroups.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No image groups yet</p>
          <p className="text-gray-500 text-sm">Add your first image group to get started</p>
        </div>
      ) : (
        <div className="space-y-8">
          {imageGroups.map((group) => (
            <div
              key={group.id}
              className="bg-[#636362] border-2 border-gray-800 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{group.name}</h2>
                  {group.description && (
                    <p className="text-gray-300 text-sm mt-1">{group.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddImageToGroup(group)}
                  >
                    + Add Image
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditGroup(group)}
                  >
                    Edit Group
                  </Button>
                </div>
              </div>

              {group.images.length === 0 ? (
                <p className="text-black text-md">No images in this group</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {group.images
                    .map((image) => {
                      const imageUrl = getImageDataUrl(image.data);
                      return imageUrl ? { image, imageUrl } : null;
                    })
                    .filter((item): item is { image: Image; imageUrl: string } => item !== null)
                    .map(({ image, imageUrl }) => (
                      <div
                        key={image.id}
                        className="bg-[#202020] border-2 border-gray-700 overflow-hidden hover:border-white transition-colors cursor-pointer group"
                        onClick={() => handleEditImage(image)}
                      >
                        <div className="aspect-square bg-gray-800 relative overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imageUrl}
                            alt={image.title || 'Gallery image'}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-[#202020] opacity-0 group-hover:opacity-50 transition-opacity flex items-center justify-center">
                            <span className="text-white opacity-0 group-hover:opacity-100 text-sm">
                              Edit
                            </span>
                          </div>
                        </div>
                        {(image.title || image.description) && (
                          <div className="p-2">
                            {image.title && (
                              <p className="text-white text-md font-semibold truncate">
                                {image.title}
                              </p>
                            )}
                            {image.description && (
                              <p className="text-gray-400 text-md line-clamp-2">
                                {image.description}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <CreateImageGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <EditImageGroupModal
        isOpen={isEditGroupModalOpen}
        onClose={() => {
          setIsEditGroupModalOpen(false);
          setSelectedImageGroup(null);
        }}
        imageGroup={selectedImageGroup}
      />

      <EditImageModal
        isOpen={isEditImageModalOpen}
        onClose={() => {
          setIsEditImageModalOpen(false);
          setSelectedImage(null);
        }}
        image={selectedImage}
      />

      {selectedImageGroup && (
        <AddImageToGroupModal
          isOpen={isAddImageModalOpen}
          onClose={() => {
            setIsAddImageModalOpen(false);
            setSelectedImageGroup(null);
          }}
          imageGroup={selectedImageGroup}
        />
      )}
    </div>
  );
}
