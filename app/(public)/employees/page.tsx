import { prisma } from '@/lib/prisma';
import { Card, CardTitle } from '@/components/ui/Card';
import EmployeePhoto from '@/components/EmployeePhoto';

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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            NÁŠ TÝM
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Poznejte náš talentovaný tým profesionálních nehtových techniků a umělců.
          </p>
        </div>

        {employees.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">V tuto chvíli nejsou k dispozici žádní členové týmu.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {employees.map((employee) => {
              // Get photo from Image relation or fallback to photo field (backward compatibility)
              const employeeImage = employee.images && employee.images.length > 0 
                ? employee.images[0] 
                : null;
              const photoUrl = employeeImage 
                ? employeeImage.data 
                : employee.photo;
              
              return (
                <Card key={employee.id} variant="bordered">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-64 md:flex-shrink-0">
                      <EmployeePhoto photo={photoUrl} name={employee.name} isImageData={!!employeeImage} />
                    </div>
                    <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
                      <CardTitle className="text-xl mb-2">{employee.name}</CardTitle>
                      {employee.title && (
                        <p className="text-sm text-gray-400 mb-3">{employee.title}</p>
                      )}
                      {employee.description && (
                        <p className="text-gray-400">{employee.description}</p>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
