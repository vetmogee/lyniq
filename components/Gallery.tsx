'use client';

import { useState, useEffect, useCallback } from 'react';
import { getImageDataUrl } from '@/lib/image-utils';
import Button from './ui/Button';
import Image from 'next/image';

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

  // State for lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);

  // State for animations - separate states for initial elements and changing content
  const [initialMounted, setInitialMounted] = useState(false);
  const [contentMounted, setContentMounted] = useState(false);
  const [triggerAnimation, setTriggerAnimation] = useState(0);

  // Trigger initial animation on component mount (for header and buttons)
  useEffect(() => {
    setInitialMounted(true);
    // Also trigger content animation on initial mount
    setTriggerAnimation(prev => prev + 1);
  }, []);

  // Trigger content animation when selected group changes
  useEffect(() => {
    setTriggerAnimation(prev => prev + 1);
  }, [selectedGroupId]);

  // Handle content animation whenever trigger changes
  useEffect(() => {
    if (triggerAnimation === 0) return; // Skip initial render
    
    // Reset animation
    setContentMounted(false);
    // Delay to ensure animation resets before triggering again
    const timer = setTimeout(() => {
      setContentMounted(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [triggerAnimation]);

  const selectedGroup = groupsWithImages.find(group => group.id === selectedGroupId);
  const currentImages = selectedGroup?.images || [];

  // Function to handle image group change with animation reset
  const handleGroupChange = (groupId: string) => {
    // Do nothing if clicking on already selected group
    if (groupId === selectedGroupId) return;
    
    // Reset animation state
    setContentMounted(false);
    // Small delay to ensure animation resets
    setTimeout(() => {
      setSelectedGroupId(groupId);
    }, 100);
  };

  const openLightbox = (imageIndex: number) => {
    setLightboxImageIndex(imageIndex);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const handleNextImage = useCallback(() => {
    if (currentImages.length > 0) {
      setLightboxImageIndex((prev) => (prev + 1) % currentImages.length);
    }
  }, [currentImages.length]);

  const handlePreviousImage = useCallback(() => {
    if (currentImages.length > 0) {
      setLightboxImageIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length);
    }
  }, [currentImages.length]);

  // Handle keyboard navigation in lightbox and body scroll lock
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePreviousImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      } else if (e.key === 'Escape') {
        closeLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [lightboxOpen, handleNextImage, handlePreviousImage]);

  const currentLightboxImage = currentImages[lightboxImageIndex];

  if (groupsWithImages.length === 0) {
    return (
      <div className="bg-[#202020]">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div 
            className="text-center mb-12 relative"
            style={{
              opacity: initialMounted ? 1 : 0,
              transform: initialMounted ? 'translateY(0)' : 'translateY(-20px)',
              transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
            }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 relative z-10">
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
    <div className="bg-[#202020]">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div 
          className="text-center mb-12 relative"
          style={{
            opacity: initialMounted ? 1 : 0,
            transform: initialMounted ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
          }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            GALERIE
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Prohlédněte si naše portfolio úžasných designů nehtů a transformací.
          </p>
        </div>

        {/* Gallery Group Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {groupsWithImages.map((group, index) => (
            <Button
              key={group.id}
              variant={selectedGroupId === group.id ? 'outline' : 'primary'}
              onClick={() => handleGroupChange(group.id)}
              className="min-w-[120px]"
              style={{
                opacity: initialMounted ? 1 : 0,
                transform: initialMounted ? 'translateY(0)' : 'translateY(-20px)',
                transition: `opacity 0.6s ease-out ${(index + 1) * 0.1}s, transform 0.6s ease-out ${(index + 1) * 0.1}s`
              }}
            >
              {group.name}
            </Button>
          ))}
        </div>

        {/* Selected Group Images */}
        {selectedGroup && (
          <div 
            style={{
              opacity: contentMounted ? 1 : 0,
              transform: contentMounted ? 'translateY(0)' : 'translateY(-60px)',
              transition: 'opacity 0.3s ease-out, transform 0.3s ease-out'
            }}
          >
            <div>
              {selectedGroup.description && (
                <div 
                  className="text-center mb-8"
                  style={{
                    opacity: contentMounted ? 1 : 0,
                    transform: contentMounted ? 'translateY(0)' : 'translateY(-40px)',
                    transition: 'opacity 0.5s ease-out 0.15s, transform 0.6s ease-out 0.15s'
                  }}
                >
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
                  {selectedGroup.images.map((image, index) => {
                    const descriptionOffset = selectedGroup.description ? 1 : 0;
                    const imageIndex = descriptionOffset + index;
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
                        className="border-2 border-[#677075] bg-[#677075] aspect-square relative group overflow-hidden cursor-pointer"
                        onClick={() => openLightbox(index)}
                        style={{
                          opacity: contentMounted ? 1 : 0,
                          transform: contentMounted ? 'translateY(0)' : 'translateY(-50px)',
                          transition: `opacity 0.5s ease-out ${0.2 + imageIndex * 0.08}s, transform 0.6s ease-out ${0.2 + imageIndex * 0.08}s`
                        }}
                      >
                      {imageUrl ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imageUrl}
                            alt={image.title || selectedGroup.name || 'Gallery image'}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          {(image.title || image.description) && (
                            <div className="absolute inset-0 bg-[#141414] opacity-10 group-hover:opacity-70 transition-all flex flex-col justify-end p-4">
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
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && currentLightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-7xl max-h-full w-full h-full flex flex-col">
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-400 transition-colors bg-black bg-opacity-50 rounded-full p-2"
              aria-label="Close lightbox"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Navigation buttons */}
            {currentImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreviousImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-400 transition-colors bg-black bg-opacity-50 rounded-full p-3"
                  aria-label="Previous image"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-400 transition-colors bg-black bg-opacity-50 rounded-full p-3"
                  aria-label="Next image"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}

            {/* Image */}
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              {(() => {
                const lightboxImageUrl = getImageDataUrl(currentLightboxImage.data);
                return lightboxImageUrl ? (
                  <img
                    src={lightboxImageUrl}
                    alt={currentLightboxImage.title || selectedGroup?.name || 'Gallery image'}
                    className="max-w-full max-h-full object-contain"
                    loading="lazy"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <div className="text-white">Obrázek není k dispozici</div>
                );
              })()}
            </div>

            {/* Image info */}
            {(currentLightboxImage.title || currentLightboxImage.description) && (
              <div className="mt-4 text-center text-white bg-black bg-opacity-50 p-4 rounded">
                {currentLightboxImage.title && (
                  <h3 className="text-xl font-semibold mb-2">{currentLightboxImage.title}</h3>
                )}
                {currentLightboxImage.description && (
                  <p className="text-gray-300">{currentLightboxImage.description}</p>
                )}
              </div>
            )}

            {/* Image counter */}
            {currentImages.length > 1 && (
              <div className="mt-2 text-center text-white text-sm">
                {lightboxImageIndex + 1} / {currentImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
