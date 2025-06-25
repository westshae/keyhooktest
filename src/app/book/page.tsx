'use client';

import { useState } from 'react';

interface Tenant {
  id: number;
  name: string;
  email: string;
  phone: string;
}

const tenantData: Tenant[] = [
  {
    id: 1,
    name: 'Tenant 1',
    email: 'tenant1@example.com',
    phone: '+1 (555) 123-4567'
  },
  {
    id: 2,
    name: 'Tenant 2',
    email: 'tenant2@example.com',
    phone: '+1 (555) 234-5678'
  },
  {
    id: 3,
    name: 'Tenant 3',
    email: 'tenant3@example.com',
    phone: '+1 (555) 345-6789'
  }
];

export default function Book() {
  const [selectedTenant, setSelectedTenant] = useState<Tenant>(tenantData[0]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page-width header */}
      <header className="w-full bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Tenant Management</h1>
            </div>
            <div className="flex items-center">
              <label htmlFor="tenant-select" className="sr-only">
                Select Tenant
              </label>
              <select
                id="tenant-select"
                value={selectedTenant.id}
                onChange={(e) => {
                  const tenant = tenantData.find(t => t.id === parseInt(e.target.value));
                  if (tenant) setSelectedTenant(tenant);
                }}
                className="block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {tenantData.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Content div below header */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tenant Details</h2>
          
          <div className="p-8 text-center">
            <p className="text-lg text-gray-600 mb-4">Selected Tenant:</p>
            <p className="text-3xl font-bold text-blue-600">{selectedTenant.name}</p>
            <p className="text-sm text-gray-500 mt-2">This content will be replaced later</p>
          </div>
        </div>
      </main>
    </div>
  );
} 