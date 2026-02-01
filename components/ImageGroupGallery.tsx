'use client';

import { useState, useEffect, useCallback } from 'react';
import { getImageDataUrl } from '@/lib/image-utils';
import Link from 'next/link';

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

interface ImageGroupGalleryProps {
  imageGroup: ImageGroup;
}

export default function ImageGroupGallery({ imageGroup }: ImageGroupGalleryProps) {
  // State for lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);

  const openLightbox = (imageIndex: number) => {
    setLightboxImageIndex(imageIndex);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const handleNextImage = useCallback(() => {
    if (imageGroup.images.length > 0) {
      setLightboxImageIndex((prev) => (prev + 1) % imageGroup.images.length);
    }
  }, [imageGroup.images.length]);

  const handlePreviousImage = useCallback(() => {
    if (imageGroup.images.length > 0) {
      setLightboxImageIndex((prev) => (prev - 1 + imageGroup.images.length) % imageGroup.images.length);
    }
  }, [imageGroup.images.length]);

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

  const currentLightboxImage = imageGroup.images[lightboxImageIndex];

  return (
    <div className="bg-[#202020]">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Header with back button */}
        <div className="mb-8">
          <Link
            href="/gallery"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4"
          >
            <svg
              className="w-5 h-5 mr-2"
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
            Zpět do galerie
          </Link>
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {imageGroup.name}
            </h1>
            {imageGroup.description && (
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                {imageGroup.description}
              </p>
            )}
          </div>
        </div>

        {imageGroup.images.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">V této skupině zatím nejsou žádné obrázky.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {imageGroup.images.map((image, index) => {
              const imageUrl = getImageDataUrl(image.data);
              return (
                <div
                  key={image.id}
                  className="border-2 border-[#677075] aspect-square relative group overflow-hidden cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  {imageUrl ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrl}
                        alt={image.title || imageGroup.name || 'Gallery image'}
                        className="w-full h-full object-cover"
                      />
                      {(image.title || image.description) && (
                        <div className="absolute inset-0 transition-all flex flex-col justify-end p-4">
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
            {imageGroup.images.length > 1 && (
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
                    alt={currentLightboxImage.title || imageGroup.name || 'Gallery image'}
                    className="max-w-full max-h-full object-contain"
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
            {imageGroup.images.length > 1 && (
              <div className="mt-2 text-center text-white text-sm">
                {lightboxImageIndex + 1} / {imageGroup.images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
