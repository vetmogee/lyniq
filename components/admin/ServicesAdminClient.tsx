'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import CreateServiceModal from './CreateServiceModal';
import EditServiceModal from './EditServiceModal';
import EditServiceGroupModal from './EditServiceGroupModal';
import AddServiceToGroupModal from './AddServiceToGroupModal';

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  position: number;
  category: string | null;
  imageUrl: string | null;
  serviceGroupId: string | null;
}

interface ServiceGroup {
  id: string;
  name: string;
  description: string | null;
  position: number;
  services: Service[];
}

interface ServicesAdminClientProps {
  serviceGroups: ServiceGroup[];
  ungroupedServices: Service[];
}

export default function ServicesAdminClient({ serviceGroups, ungroupedServices }: ServicesAdminClientProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditServiceModalOpen, setIsEditServiceModalOpen] = useState(false);
  const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false);
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedServiceGroup, setSelectedServiceGroup] = useState<ServiceGroup | null>(null);

  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setIsEditServiceModalOpen(true);
    // Close other modals to prevent wrong form submission (Edit vs Add)
    setIsAddServiceModalOpen(false);
    setSelectedServiceGroup(null);
    setIsCreateModalOpen(false);
    setIsEditGroupModalOpen(false);
  };

  const handleEditGroup = (group: ServiceGroup) => {
    setSelectedServiceGroup(group);
    setIsEditGroupModalOpen(true);
    setIsEditServiceModalOpen(false);
    setSelectedService(null);
    setIsAddServiceModalOpen(false);
    setIsCreateModalOpen(false);
  };

  const handleAddServiceToGroup = (group: ServiceGroup) => {
    setSelectedServiceGroup(group);
    setIsAddServiceModalOpen(true);
    setIsEditServiceModalOpen(false);
    setSelectedService(null);
    setIsCreateModalOpen(false);
    setIsEditGroupModalOpen(false);
  };

  return (
    <div className="p-6 md:p-8 bg-[#202020] min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Services</h1>
          <p className="text-gray-400 mt-2">Manage your salon services</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          + Add Service Group
        </Button>
      </div>

      {/* Service Groups */}
      {serviceGroups.length > 0 && (
        <div className="space-y-6 mb-8">
          {serviceGroups.map((group) => (
            <div
              key={group.id}
              className="bg-[#202020] border-2 border-gray-800 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{group.name}</h2>
                  {group.description && (
                    <p className="text-gray-300 text-sm">{group.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
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
                    onClick={() => handleEditGroup(group)}
                  >
                    Edit Group
                  </Button>
                </div>
              </div>

              {group.services.length === 0 ? (
                <p className="text-gray-400 text-sm">No services in this group</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.services.map((service) => (
                    <div
                      key={service.id}
                      className="bg-[#202020] border-2 border-gray-700 p-4 hover:border-white transition-colors cursor-pointer"
                      onClick={() => handleEditService(service)}
                    >
                      <h3 className="text-lg font-bold text-white mb-2">{service.name}</h3>
                      <p className="text-[#636362] text-xl font-semibold mb-2">
                        {service.price.toFixed(2)} Kč
                      </p>
                      {service.description && (
                        <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                          {service.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{service.duration} min</span>
                        {service.category && <span>{service.category}</span>}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditService(service);
                        }}
                        className="mt-2 text-white hover:text-gray-300 text-sm underline"
                      >
                        Edit
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Ungrouped Services */}
      {ungroupedServices.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Ungrouped Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ungroupedServices.map((service) => (
              <div
                key={service.id}
                className="bg-[#636362] border-2 border-gray-800 p-4 hover:border-white transition-colors cursor-pointer"
                onClick={() => handleEditService(service)}
              >
                <h3 className="text-lg font-bold text-white mb-2">{service.name}</h3>
                <p className="text-black text-xl font-semibold mb-2">
                  {service.price.toFixed(2)} Kč
                </p>
                {service.description && (
                  <p className="text-gray-300 text-sm line-clamp-2 mb-2">
                    {service.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{service.duration} min</span>
                  {service.category && <span>{service.category}</span>}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditService(service);
                  }}
                  className="mt-2 text-white hover:text-gray-300 text-sm underline"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {serviceGroups.length === 0 && ungroupedServices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No services yet</p>
          <p className="text-gray-500 text-sm">Add your first service group to get started</p>
        </div>
      )}

      <CreateServiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <EditServiceModal
        isOpen={isEditServiceModalOpen}
        onClose={() => {
          setIsEditServiceModalOpen(false);
          setSelectedService(null);
        }}
        service={selectedService}
      />

      <EditServiceGroupModal
        isOpen={isEditGroupModalOpen}
        onClose={() => {
          setIsEditGroupModalOpen(false);
          setSelectedServiceGroup(null);
        }}
        serviceGroup={selectedServiceGroup}
      />

      {selectedServiceGroup && (
        <AddServiceToGroupModal
          isOpen={isAddServiceModalOpen}
          onClose={() => {
            setIsAddServiceModalOpen(false);
            setSelectedServiceGroup(null);
          }}
          serviceGroupId={selectedServiceGroup.id}
          serviceGroupName={selectedServiceGroup.name}
        />
      )}
    </div>
  );
}
