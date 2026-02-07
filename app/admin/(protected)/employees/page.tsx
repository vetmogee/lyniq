import { prisma } from '@/lib/prisma';
import EmployeesAdminClient from '@/components/admin/EmployeesAdminClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Employees Admin - Lyniq',
  description: 'Manage employees and team members',
};

export default async function AdminEmployeesPage() {
  const employees = await prisma.employee.findMany({
    include: {
      images: {
        where: {
          imageGroupId: null,
        },
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const serializedEmployees = employees.map((employee) => ({
    id: employee.id,
    name: employee.name,
    title: employee.title,
    photo: employee.photo,
    description: employee.description,
    images: employee.images.map((image) => ({
      id: image.id,
      data: image.data,
      mimeType: image.mimeType,
      filename: image.filename,
      title: image.title,
      description: image.description,
      order: image.order,
    })),
  }));

  return <EmployeesAdminClient employees={serializedEmployees} />;
}
