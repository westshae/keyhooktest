'use client';

import { useState, useEffect } from 'react';
import Grid from '@/components/custom/Grid';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Tenant {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Availability {
  id: number;
  date: string;
  start_time: string;
  time_in_minutes: number;
}

interface Card {
  id: string;
  title: string;
  startDay: number;
  startHour: number;
  startSubCell: number;
  endDay: number;
  endHour: number;
  endSubCell: number;
  color?: string;
  availabilityId: number; // Add this to track the backend availability ID
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

// Helper function to convert backend availability to frontend card format
const availabilityToCardFormat = (availability: Availability): Card => {
  // Parse the date to get day of week
  const [day, month, year] = availability.date.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const startDay = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Parse the start time
  const [hours, minutes] = availability.start_time.split(':').map(Number);
  const startHour = hours;
  const startSubCell = Math.floor(minutes / 15);
  
  // Calculate end time
  const totalStartMinutes = hours * 60 + minutes;
  const totalEndMinutes = totalStartMinutes + availability.time_in_minutes;
  const endHour = Math.floor(totalEndMinutes / 60);
  const endSubCell = Math.floor((totalEndMinutes % 60) / 15);
  
  // Create title from time range
  const formatTime = (hour: number, subCell: number) => {
    const minutes = subCell * 15;
    if (hour === 0) return `12:${minutes.toString().padStart(2, '0')} AM`;
    if (hour === 12) return `12:${minutes.toString().padStart(2, '0')} PM`;
    if (hour > 12) return `${hour - 12}:${minutes.toString().padStart(2, '0')} PM`;
    return `${hour}:${minutes.toString().padStart(2, '0')} AM`;
  };
  
  const title = `${formatTime(startHour, startSubCell)} - ${formatTime(endHour, endSubCell)}`;
  
  return {
    id: `availability-${availability.id}`,
    title,
    startDay,
    startHour,
    startSubCell,
    endDay: startDay, // Same day for now
    endHour,
    endSubCell,
    color: 'bg-green-500', // Green for available slots
    availabilityId: availability.id,
  };
};

// Helper function to obfuscate email address
const obfuscateEmail = (email: string): string => {
  const [localPart, domain] = email.split('@');
  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`;
  }
  return `${localPart[0]}***${localPart[localPart.length - 1]}@${domain}`;
};

export default function Book() {
  const [selectedTenant, setSelectedTenant] = useState<Tenant>(tenantData[0]);
  const [availableSlots, setAvailableSlots] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  // Load available slots from backend
  useEffect(() => {
    loadAvailableSlots();
  }, []);

  const loadAvailableSlots = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/bookings/tenant');
      if (!response.ok) {
        throw new Error('Failed to load available slots');
      }
      const result = await response.json();
      const cards = result.data.map(availabilityToCardFormat);
      setAvailableSlots(cards);
    } catch (error) {
      console.error('Error loading available slots:', error);
      setError('Failed to load available time slots');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (card: {
    id: string;
    title: string;
    startDay: number;
    startHour: number;
    startSubCell: number;
    endDay: number;
    endHour: number;
    endSubCell: number;
    color?: string;
    availabilityId?: number;
  }) => {
    // Find the corresponding card from availableSlots to get the full Card object
    const fullCard = availableSlots.find(slot => slot.id === card.id);
    if (fullCard) {
      setSelectedCard(fullCard);
      setShowConfirmation(true);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedCard) return;

    try {
      setIsBooking(true);
      setError(null);

      const response = await fetch('/api/bookings/tenant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenant_id: selectedTenant.id,
          tenant_name: selectedTenant.name,
          availability_id: selectedCard.availabilityId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      // Remove the booked slot from the available slots
      setAvailableSlots(prev => prev.filter(card => card.id !== selectedCard.id));
      
      // Close confirmation dialog and show success popup
      setShowConfirmation(false);
      setSelectedCard(null);
      setShowSuccessPopup(true);
    } catch (error) {
      console.error('Error creating booking:', error);
      setError('Failed to create booking. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const handleCancelBooking = () => {
    setShowConfirmation(false);
    setSelectedCard(null);
  };

  const handleReturnToHome = () => {
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading available time slots...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Page-width header */}
      <header className="flex-shrink-0 w-full bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Book Viewing</h1>
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
      <main className="flex-1 p-6 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full">
          <div className="bg-white shadow rounded-lg p-6 h-full flex flex-col">
            <div className="mb-6 flex-shrink-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Time Slots</h2>
              <p className="text-gray-600">Click on any green time slot to book a viewing for {selectedTenant.name}</p>
              {error && (
                <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
            </div>
            
            {/* Grid Container - same size as availability page */}
            <div className="flex-1 overflow-x-auto border-2 border-green-200 rounded-lg">
              <Grid 
                onCellClick={() => {}} // No cell click functionality needed
                events={availableSlots}
                isEditMode={false}
                onCardClick={handleCardClick}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to book this time slot for a viewing?
            </DialogDescription>
          </DialogHeader>
          <div className="bg-gray-50 p-3 rounded mb-4">
            <p className="text-sm text-gray-700">
              <strong>Time:</strong> {selectedCard?.title}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Tenant:</strong> {selectedTenant.name}
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelBooking}
              disabled={isBooking}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmBooking}
              disabled={isBooking}
            >
              {isBooking ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Popup */}
      <Dialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
        <DialogContent>
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <DialogTitle>Booking Confirmed!</DialogTitle>
            <DialogDescription>
              We&apos;ve sent the confirmation to <span className="font-medium">{obfuscateEmail(selectedTenant.email)}</span>
            </DialogDescription>
          </div>
          <DialogFooter>
            <Button
              onClick={handleReturnToHome}
              className="w-full"
            >
              Return to Home
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 