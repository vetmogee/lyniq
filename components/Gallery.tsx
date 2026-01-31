'use client';

import { useState } from 'react';
import { getImageDataUrl } from '@/lib/image-utils';
import Button from './ui/Button';

interface Image {
  id: string;
  data: string;
  mimeType: string;
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

interface GalleryProps {
  imageGroups: ImageGroup[];
}

export default function Gallery({ imageGroups }: GalleryProps) {
  // Filter to only groups that have images
  const groupsWithImages = imageGroups.filter(group => group.images.length > 0);
  
  // State to track selected gallery group
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(
    groupsWithImages.length > 0 ? groupsWithImages[0].id : null
  );

  const selectedGroup = groupsWithImages.find(group => group.id === selectedGroupId);

  if (groupsWithImages.length === 0) {
    return (
      <div className="bg-black">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              GALERIE
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Prohlédněte si naše portfolio úžasných designů nehtů a transformací.
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-400">Zatím nejsou k dispozici žádné skupiny obrázků.</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-black">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            GALERIE
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Prohlédněte si naše portfolio úžasných designů nehtů a transformací.
          </p>
        </div>

        {/* Gallery Group Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {groupsWithImages.map((group) => (
            <Button
              key={group.id}
              variant={selectedGroupId === group.id ? 'primary' : 'outline'}
              onClick={() => setSelectedGroupId(group.id)}
              className="min-w-[120px]"
            >
              {group.name}
            </Button>
          ))}
        </div>

        {/* Selected Group Images */}
        {selectedGroup && (
          <div>
            {selectedGroup.description && (
              <div className="text-center mb-8">
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  {selectedGroup.description}
                </p>
              </div>
            )}

            {selectedGroup.images.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">V této skupině zatím nejsou žádné obrázky.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                {selectedGroup.images.map((image) => {
                  const imageUrl = getImageDataUrl(image.data);
                  // Debug logging
                  if (typeof window !== 'undefined') {
                    console.log('Image data:', {
                      id: image.id,
                      dataType: typeof image.data,
                      dataLength: typeof image.data === 'string' ? image.data.length : 'N/A',
                      imageUrl: imageUrl ? 'generated' : 'null',
                      mimeType: image.mimeType
                    });
                  }
                  return (
                    <div
                      key={image.id}
                      className="border-2 border-[#b0aeab] bg-[#b0aeab] aspect-square relative group overflow-hidden"
                    >
                      {imageUrl ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imageUrl}
                            alt={image.title || selectedGroup.name || 'Gallery image'}
                            className="w-full h-full object-cover"
                          />
                          {(image.title || image.description) && (
                            <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-70 transition-all flex flex-col justify-end p-4">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                {image.title && (
                                  <p className="text-lg font-semibold text-white mb-1">{image.title}</p>
                                )}
                                {image.description && (
                                  <p className="text-sm text-gray-300 line-clamp-2">{image.description}</p>
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <p className="text-gray-500">Obrázek není k dispozici</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
