import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import EmployeePhoto from '@/components/EmployeePhoto';

export default async function EmployeesPage() {
  // Fetch all employees with their images
  const employees = await prisma.employee.findMany({
    include: {
      images: {
        orderBy: { order: 'asc' },
        take: 1, // Get the first/main photo
      },
    },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="bg-black">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            OUR TEAM
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Meet our talented team of professional nail technicians and artists.
          </p>
        </div>

        {employees.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No team members available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <EmployeePhoto photo={photoUrl} name={employee.name} isImageData={!!employeeImage} />
                  <CardHeader>
                    <CardTitle>{employee.name}</CardTitle>
                    {employee.title && (
                      <p className="text-sm text-gray-400 mt-1">{employee.title}</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    {employee.description && (
                      <p className="text-gray-400">{employee.description}</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
