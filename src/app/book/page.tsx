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
import { Clock, Users, CheckCircle, ArrowLeft, Calendar, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

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
  
  // Create title from time range
  const formatTime = (hour: number, subCell: number) => {
    const minutes = subCell * 15;
    if (hour === 0) return `12:${minutes.toString().padStart(2, '0')} AM`;
    if (hour === 12) return `12:${minutes.toString().padStart(2, '0')} PM`;
    if (hour > 12) return `${hour - 12}:${minutes.toString().padStart(2, '0')} PM`;
    return `${hour}:${minutes.toString().padStart(2, '0')} AM`;
  };
  
  // Calculate the end time to match how findAvailableSlots creates slots (next sub-cell)
  // Since all slots are 30 minutes (2 sub-cells), we add 1 to the sub-cell
  const startTime = formatTime(startHour, startSubCell);
  const endSubCell = (startSubCell + 1) % 4;
  const endHour = startSubCell === 3 ? startHour + 1 : startHour; // If we wrap to next hour
  const endTime = formatTime(endHour, endSubCell);
  
  const title = `${startTime} - ${endTime}`;
  
  return {
    id: `availability-${availability.id}`,
    title,
    startDay,
    startHour,
    startSubCell,
    endDay: startDay, // Same day for now
    endHour,
    endSubCell,
    color: 'bg-gradient-to-r from-green-500 to-green-600', // Green for available slots
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

// Helper function to generate a random meeting place address
const getMeetingPlace = (tenantId: number) => {
  const meetingPlaces = [
    '123 Main Street, Downtown District',
    '456 Oak Avenue, Riverside Heights',
    '789 Pine Boulevard, Westside Gardens',
    '321 Elm Court, Eastside Commons',
    '654 Maple Drive, Northside Plaza',
    '987 Cedar Lane, Southside Village',
    '147 Birch Road, Central Park Area',
    '258 Spruce Way, Harbor View District',
    '369 Willow Street, Mountain View Heights',
    '741 Aspen Circle, Lakefront Promenade'
  ];
  
  // Use tenant ID to consistently get the same address for each tenant
  const index = (tenantId - 1) % meetingPlaces.length;
  return meetingPlaces[index] || meetingPlaces[0];
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-lg text-muted-foreground">Loading available time slots...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="relative overflow-hidden border-b border-border/50 bg-white dark:bg-slate-800 shadow-sm">
        <div className="absolute inset-0 gradient-bg opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <Link 
                href="/"
                className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-foreground" />
              </Link>
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Book Viewing</h1>
                <p className="text-muted-foreground">
                  Select a time slot to schedule your property viewing
                </p>
              </div>
            </div>
            
            {/* Tenant Selector */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Booking for:</span>
              </div>
              <select
                value={selectedTenant.id}
                onChange={(e) => {
                  const tenant = tenantData.find(t => t.id === parseInt(e.target.value));
                  if (tenant) setSelectedTenant(tenant);
                }}
                className="px-4 py-2 border border-border/50 rounded-xl bg-white dark:bg-slate-700 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              >
                {tenantData.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {error}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Instructions */}
          <div className="mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    How to book your viewing
                  </h3>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    Click on any green time slot below to book a viewing for <strong>{selectedTenant.name}</strong>. 
                    Available slots are shown in green, and you&apos;ll receive a confirmation email once booked.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Container */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="h-[calc(100vh-320px)] min-h-[600px]">
              <Grid 
                onCellClick={() => {}} // No cell click functionality needed
                events={availableSlots}
                isEditMode={false}
                dynamicTimeRange={true} // Enable dynamic time range based on available slots
                onCardClick={handleCardClick}
              />
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-6 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded"></div>
              <span className="text-sm text-muted-foreground">Available Time Slots</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <span className="text-sm text-muted-foreground">Unavailable Times</span>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Confirm Booking
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to book this time slot for a viewing?
            </DialogDescription>
          </DialogHeader>
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl mb-4">
            <div className="space-y-2">
              <p className="text-sm text-foreground">
                <strong>Time:</strong> {selectedCard?.title}
              </p>
              <p className="text-sm text-foreground">
                <strong>Tenant:</strong> {selectedTenant.name}
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-3 w-3" />
                <span>{obfuscateEmail(selectedTenant.email)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-3 w-3" />
                <span>{selectedTenant.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span><strong>Meeting Place:</strong> {getMeetingPlace(selectedTenant.id)}</span>
              </div>
            </div>
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
              className="gap-2"
            >
              {isBooking ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Booking...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Confirm Booking
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Popup */}
      <Dialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
        <DialogContent className="sm:max-w-md text-center">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <DialogTitle className="text-xl">Booking Confirmed!</DialogTitle>
            <DialogDescription className="text-base">
              We&apos;ve sent the confirmation to <span className="font-medium text-foreground">{obfuscateEmail(selectedTenant.email)}</span>
            </DialogDescription>
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">
                Please check your email for viewing details and any additional instructions.
              </p>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button
              onClick={handleReturnToHome}
              className="w-full gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Home
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 