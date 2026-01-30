'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import CreateServiceModal from '@/components/admin/CreateServiceModal';
import EditServiceModal from '@/components/admin/EditServiceModal';
import EditServiceGroupModal from '@/components/admin/EditServiceGroupModal';
import AddServiceToGroupModal from '@/components/admin/AddServiceToGroupModal';

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  category: string | null;
  imageUrl: string | null;
  isActive: boolean;
  serviceGroupId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ServiceGroup {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  services: Service[];
}

export default function AdminServicesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditServiceModalOpen, setIsEditServiceModalOpen] = useState(false);
  const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false);
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedServiceGroup, setSelectedServiceGroup] = useState<ServiceGroup | null>(null);
  const [serviceGroups, setServiceGroups] = useState<ServiceGroup[]>([]);
  const [ungroupedServices, setUngroupedServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      if (response.ok) {
        const data = await response.json();
        setServiceGroups(data.serviceGroups || []);
        setUngroupedServices(data.ungroupedServices || []);
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
    fetchServices();
  };

  const handleEditServiceModalClose = () => {
    setIsEditServiceModalOpen(false);
    setSelectedService(null);
    fetchServices();
  };

  const handleEditGroupModalClose = () => {
    setIsEditGroupModalOpen(false);
    setSelectedServiceGroup(null);
    fetchServices();
  };

  const handleAddServiceModalClose = () => {
    setIsAddServiceModalOpen(false);
    setSelectedServiceGroup(null);
    fetchServices();
  };

  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setIsEditServiceModalOpen(true);
  };

  const handleEditServiceGroup = (group: ServiceGroup) => {
    setSelectedServiceGroup(group);
    setIsEditGroupModalOpen(true);
  };

  const handleAddServiceToGroup = (group: ServiceGroup) => {
    setSelectedServiceGroup(group);
    setIsAddServiceModalOpen(true);
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 bg-black min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading services...</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 md:p-8 bg-black min-h-screen">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Services</h1>
            <p className="text-gray-400 mt-2">Manage your salon services</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>Create Service Group</Button>
        </div>

        {serviceGroups.length === 0 && ungroupedServices.length === 0 ? (
          <Card variant="bordered">
            <CardContent className="py-12 text-center">
              <p className="text-gray-400 mb-4">No services found.</p>
              <Button onClick={() => setIsCreateModalOpen(true)}>Create Your First Service Group</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Service Groups */}
            {serviceGroups.map((group) => (
              <Card key={group.id} variant="bordered">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{group.name}</CardTitle>
                      {group.description && (
                        <p className="text-sm text-gray-400 mt-2">{group.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddServiceToGroup(group)}
                      >
                        + Add Service
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditServiceGroup(group)}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {group.services.length === 0 ? (
                    <p className="text-gray-400 text-sm">No services in this group.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-[#b0aeab]">
                            <th className="text-left py-3 px-4 font-semibold text-white">Service Name</th>
                            <th className="text-left py-3 px-4 font-semibold text-white">Price</th>
                            <th className="text-left py-3 px-4 font-semibold text-white">Duration</th>
                            <th className="text-left py-3 px-4 font-semibold text-white">Status</th>
                            <th className="text-right py-3 px-4 font-semibold text-white">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.services.map((service) => (
                            <tr key={service.id} className="border-b border-[#b0aeab] hover:bg-[#b0aeab]">
                              <td className="py-3 px-4">
                                <div>
                                  <p className="font-medium text-white">{service.name}</p>
                                  {service.description && (
                                    <p className="text-sm text-gray-400 mt-1">{service.description}</p>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-white font-semibold">{service.price} Kč</td>
                              <td className="py-3 px-4 text-gray-300">{service.duration} min</td>
                              <td className="py-3 px-4">
                                <span className={`inline-block px-2 py-1 text-xs font-medium ${
                                  service.isActive
                                    ? 'bg-[#b0aeab] text-white'
                                    : 'bg-gray-800 text-gray-400'
                                }`}>
                                  {service.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditService(service)}
                                  >
                                    Edit
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* Ungrouped Services (for backward compatibility) */}
            {ungroupedServices.length > 0 && (
              <Card variant="bordered">
                <CardHeader>
                  <CardTitle className="text-xl">Other Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ungroupedServices.map((service) => (
                      <Card key={service.id} variant="bordered">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{service.name}</CardTitle>
                              {service.category && (
                                <p className="text-sm text-gray-500 mt-1">{service.category}</p>
                              )}
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium ${
                              service.isActive
                                ? 'bg-[#b0aeab] text-white'
                                : 'bg-gray-800 text-gray-400'
                            }`}>
                              {service.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {service.description && (
                            <p className="text-gray-400 mb-4 text-sm">{service.description}</p>
                          )}
                          <div className="flex items-center justify-between pt-4 border-t-2 border-[#b0aeab]">
                            <div>
                              <p className="text-xl font-bold text-white">{service.price} Kč</p>
                              <p className="text-sm text-gray-400">{service.duration} min</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditService(service)}
                            >
                              Edit
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      <CreateServiceModal isOpen={isCreateModalOpen} onClose={handleCreateModalClose} />
      <EditServiceModal
        isOpen={isEditServiceModalOpen}
        onClose={handleEditServiceModalClose}
        service={selectedService}
      />
      <EditServiceGroupModal
        isOpen={isEditGroupModalOpen}
        onClose={handleEditGroupModalClose}
        serviceGroup={selectedServiceGroup}
      />
      {selectedServiceGroup && (
        <AddServiceToGroupModal
          isOpen={isAddServiceModalOpen}
          onClose={handleAddServiceModalClose}
          serviceGroupId={selectedServiceGroup.id}
          serviceGroupName={selectedServiceGroup.name}
        />
      )}
    </>
  );
}
