import { prisma } from '@/lib/prisma';
import { getImageDataUrl } from '@/lib/image-utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ imageGroupId: string }>;
}

export default async function ImageGroupPage({ params }: PageProps) {
  // Await params (Next.js 15+)
  const { imageGroupId } = await params;

  // Fetch the specific image group with its images
  const imageGroup = await prisma.imageGroup.findUnique({
    where: { id: imageGroupId },
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
    },
  });

  // If group doesn't exist, show 404
  if (!imageGroup) {
    notFound();
  }

  return (
    <div className="bg-black">
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
            {imageGroup.images.map((image) => {
              const imageUrl = getImageDataUrl(image.data);
              return (
                <div
                  key={image.id}
                  className="border-2 border-[#b0aeab] bg-[#b0aeab] aspect-square relative group overflow-hidden"
                >
                  {imageUrl ? (
                    <>
                      <img
                        src={imageUrl}
                        alt={image.title || imageGroup.name || 'Gallery image'}
                        className="w-full h-full object-cover"
                      />
                      {(image.title || image.description) && (
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all flex flex-col justify-end p-4">
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
    </div>
  );
}
