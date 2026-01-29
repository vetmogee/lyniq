'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import CreateEmployeeModal from '@/components/admin/CreateEmployeeModal';
import EditEmployeeModal from '@/components/admin/EditEmployeeModal';

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

interface Employee {
  id: string;
  name: string;
  title: string | null;
  photo: string | null;
  description: string | null;
  images?: Image[];
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminEmployeesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees');
      if (response.ok) {
        const data = await response.json();
        setEmployees(data.employees || []);
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
    fetchEmployees();
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedEmployee(null);
    fetchEmployees();
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 bg-black min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading employees...</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 md:p-8 bg-black min-h-screen">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Employees</h1>
            <p className="text-gray-400 mt-2">Manage your salon employees</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>Add Employee</Button>
        </div>

        {employees.length === 0 ? (
          <Card variant="bordered">
            <CardContent className="py-12 text-center">
              <p className="text-gray-400 mb-4">No employees found.</p>
              <Button onClick={() => setIsCreateModalOpen(true)}>Add Your First Employee</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.map((employee) => (
              <Card key={employee.id} variant="bordered">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{employee.name}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {(() => {
                    // Get photo from Image relation or fallback to photo field
                    const employeeImage = employee.images && employee.images.length > 0 
                      ? employee.images[0] 
                      : null;
                    const photoUrl = employeeImage 
                      ? getImageDataUrl(employeeImage.data)
                      : employee.photo;
                    
                    return photoUrl ? (
                      <div className="mb-4">
                        <img
                          src={photoUrl}
                          alt={employee.name}
                          className="w-full h-48 object-cover border-2 border-gray-900"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    ) : null;
                  })()}
                  {employee.description && (
                    <p className="text-gray-400 mb-4 text-sm line-clamp-3">{employee.description}</p>
                  )}
                  <div className="flex items-center justify-end pt-4 border-t-2 border-gray-900">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditEmployee(employee)}
                    >
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <CreateEmployeeModal isOpen={isCreateModalOpen} onClose={handleCreateModalClose} />
      <EditEmployeeModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        employee={selectedEmployee}
      />
    </>
  );
}
