import { prisma } from '@/lib/prisma';
import { getImageDataUrl } from '@/lib/image-utils';
import Link from 'next/link';

export default async function GalleryPage() {
  // Fetch all image groups with their images, ordered by creation date and image order
  const imageGroups = await prisma.imageGroup.findMany({
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Filter to only groups that have images
  const groupsWithImages = imageGroups.filter(group => group.images.length > 0);

  return (
    <div className="bg-black">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            GALLERY
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Browse our portfolio of stunning nail designs and transformations.
          </p>
        </div>

        {groupsWithImages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No image groups available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupsWithImages.map((group) => {
              // Get the first image as the preview/thumbnail
              const previewImage = group.images[0];
              const previewImageUrl = previewImage ? getImageDataUrl(previewImage.data) : null;
              const imageCount = group.images.length;

              return (
                <Link
                  key={group.id}
                  href={`/gallery/${group.id}`}
                  className="border-2 border-gray-900 bg-gray-900 aspect-square relative group overflow-hidden hover:border-white transition-colors cursor-pointer"
                >
                  {previewImageUrl ? (
                    <>
                      <img
                        src={previewImageUrl}
                        alt={group.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all flex flex-col justify-end p-4">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-lg font-semibold text-white mb-1">{group.name}</p>
                          {group.description && (
                            <p className="text-sm text-gray-300 line-clamp-2 mb-2">{group.description}</p>
                          )}
                          <p className="text-xs text-gray-400">
                            {imageCount} {imageCount === 1 ? 'image' : 'images'}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6">
                      <p className="text-lg font-semibold text-white mb-2">{group.name}</p>
                      {group.description && (
                        <p className="text-sm text-gray-400 text-center mb-2">{group.description}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        {imageCount} {imageCount === 1 ? 'image' : 'images'}
                      </p>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
