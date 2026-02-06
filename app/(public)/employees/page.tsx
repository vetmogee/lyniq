import { prisma } from '@/lib/prisma';
import EmployeeCards from '@/components/EmployeeCards';
import Image from 'next/image';

// Force dynamic rendering to ensure fresh data on each request
export const dynamic = 'force-dynamic';

export default async function EmployeesPage() {
  // Fetch all employees with their images
  const employees = await prisma.employee.findMany({
    include: {
      images: {
        where: {
          imageGroupId: null,
        },
        orderBy: { order: 'asc' },
        take: 1, // Get the first/main photo
      },
    },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="bg-[#202020]">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-12 relative">
          <Image
            src="/lyniq.svg"
            alt=""
            width={200}
            height={200}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 opacity-40 pointer-events-none"
            style={{ transform: 'translate(calc(-50% + 6rem), calc(-50% - 3rem))' }}
            aria-hidden="true"
          />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 relative z-10">
            NÁŠ TÝM
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Poznejte náš talentovaný tým profesionálních nehtových techniků a umělců.
          </p>
        </div>

        {employees.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400">V tuto chvíli nejsou k dispozici žádní členové týmu.</p>
          </div>
        ) : (
          <EmployeeCards employees={employees} />
        )}
      </section>
    </div>
  );
}
