'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import CreateEmployeeModal from './CreateEmployeeModal';
import EditEmployeeModal from './EditEmployeeModal';
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
  images: Image[];
}

interface EmployeesAdminClientProps {
  employees: Employee[];
}

export default function EmployeesAdminClient({ employees }: EmployeesAdminClientProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-6 md:p-8 bg-[#202020] min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Employees</h1>
          <p className="text-gray-400">Manage your salon employees</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          + Add Employee
        </Button>
      </div>

      {employees.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No employees yet</p>
          <p className="text-gray-500 text-sm mt-2">Add your first employee to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {employees.map((employee) => {
            const photoUrl = employee.photo || (employee.images.length > 0 ? getImageDataUrl(employee.images[0].data) : null);
            
            return (
              <div
                key={employee.id}
                className="bg-[#636362] border-2 border-gray-800 w-100 p-4 hover:border-white transition-colors cursor-pointer"
                onClick={() => handleEdit(employee)}
              >
                {photoUrl && (
                  <div className="w-full h-90 bg-gray-800 mb-3 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoUrl}
                      alt={employee.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h3 className="text-lg font-bold text-black mb-1">{employee.name}</h3>
                {employee.title && (
                  <p className="text-black text-md mb-1">{employee.title}</p>
                )}
                {employee.description && (
                  <p className="text-black text-md line-clamp-2 mb-2">{employee.description}</p>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(employee);
                  }}
                  className="text-white hover:text-gray-300 text-sm underline"
                >
                  Edit
                </button>
              </div>
            );
          })}
        </div>
      )}

      <CreateEmployeeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <EditEmployeeModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
      />
    </div>
  );
}
