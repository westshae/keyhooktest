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
  availabilityId?: number;
  tenantName?: string;
}

interface BackendAvailability {
  id: number;
  date: string;
  start_time: string;
  time_in_minutes: number;
}

interface BookingWithAvailability {
  id: number;
  tenant_id: number;
  tenant_name: string;
  availability_id: number;
  availability: BackendAvailability;
}

// Helper function to convert frontend card format to backend format
const cardToBackendFormat = (card: Card): BackendAvailability[] => {
  const availabilities: BackendAvailability[] = [];
  
  // Convert the card's time range to backend format
  const startMinutes = card.startHour * 60 + card.startSubCell * 15;
  const endMinutes = card.endHour * 60 + card.endSubCell * 15;
  const durationMinutes = Math.max(0, endMinutes - startMinutes);
  
  // Convert day index to date (assuming current week)
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const daysToAdd = (card.startDay - currentDayOfWeek + 7) % 7;
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + daysToAdd);
  
  // Format date as DD-MM-YYYY
  const day = targetDate.getDate().toString().padStart(2, '0');
  const month = (targetDate.getMonth() + 1).toString().padStart(2, '0');
  const year = targetDate.getFullYear();
  const dateString = `${day}-${month}-${year}`;
  
  // Convert minutes to HH:MM format
  const hours = Math.floor(startMinutes / 60);
  const minutes = startMinutes % 60;
  const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  
  // Extract numeric ID if it exists, otherwise use timestamp
  const numericId = card.id.startsWith('card-') ? 
    parseInt(card.id.replace('card-', '')) : 
    Date.now();
  
  availabilities.push({
    id: isNaN(numericId) ? Date.now() : numericId,
    date: dateString,
    start_time: timeString,
    time_in_minutes: durationMinutes,
  });
  
  return availabilities;
};

// Helper function to convert backend format to frontend card format
const backendToCardFormat = (availability: BackendAvailability): Card => {
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
    id: `card-${availability.id}`,
    title,
    startDay,
    startHour,
    startSubCell,
    endDay: startDay, // Same day for now
    endHour,
    endSubCell,
    color: 'bg-blue-500',
  };
};

// Helper function to convert booking to frontend card format
const bookingToCardFormat = (booking: BookingWithAvailability): Card => {
  const availability = booking.availability;
  
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
  
  const title = `${formatTime(startHour, startSubCell)} - ${formatTime(endHour, endSubCell)} (${booking.tenant_name})`;
  
  return {
    id: `booking-${booking.id}`,
    title,
    startDay,
    startHour,
    startSubCell,
    endDay: startDay, // Same day for now
    endHour,
    endSubCell,
    color: 'bg-purple-500', // Purple for bookings
    tenantName: booking.tenant_name,
  };
};

export default function Availability() {
  const [isEditing, setIsEditing] = useState(false);
  const [viewEvents, setViewEvents] = useState<Card[]>([]);
  const [editEvents, setEditEvents] = useState<Card[]>([]);
  const [deletedCardIds, setDeletedCardIds] = useState<string[]>([]);
  const [deletedBookingIds, setDeletedBookingIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<Card | null>(null);

  // Load data from backend on component mount
  useEffect(() => {
    loadAvailability();
  }, []);

  const loadAvailability = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Load availability slots
      const availabilityResponse = await fetch('/api/availability');
      if (!availabilityResponse.ok) {
        throw new Error('Failed to load availability');
      }
      const availabilityResult = await availabilityResponse.json();
      const availabilityCards = availabilityResult.data.map(backendToCardFormat);
      
      // Load bookings
      const bookingsResponse = await fetch('/api/bookings/pm');
      if (!bookingsResponse.ok) {
        throw new Error('Failed to load bookings');
      }
      const bookingsResult = await bookingsResponse.json();
      const bookingCards = bookingsResult.data.map(bookingToCardFormat);
      
      // Filter out availability slots that are booked
      const bookedAvailabilityIds = new Set(bookingsResult.data.map((booking: BookingWithAvailability) => booking.availability_id));
      const availableCards = availabilityCards.filter((card: Card) => {
        const cardId = parseInt(card.id.replace('card-', ''));
        return !bookedAvailabilityIds.has(cardId);
      });
      
      // Combine available slots and bookings
      const allCards = [...availableCards, ...bookingCards];
      setViewEvents(allCards);
    } catch (error) {
      console.error('Error loading availability:', error);
      setError('Failed to load availability data');
    } finally {
      setIsLoading(false);
    }
  };

  const saveAvailability = async (cards: Card[]) => {
    try {
      setIsSaving(true);
      setError(null);
      
      // Filter out booking cards - only process availability cards
      const availabilityCards = cards.filter(card => card.id.startsWith('card-'));
      
      // Delete the specific availability cards that were marked for deletion
      if (deletedCardIds.length > 0) {
        // Convert card IDs to numeric IDs for the backend
        const numericIds = deletedCardIds
          .map(id => {
            const numericId = parseInt(id.replace('card-', ''));
            return isNaN(numericId) ? null : numericId;
          })
          .filter((id): id is number => id !== null);
        
        if (numericIds.length > 0) {
          const deleteResponse = await fetch('/api/availability', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(numericIds),
          });
          
          if (!deleteResponse.ok) {
            throw new Error('Failed to delete availability records');
          }
        }
      }

      // Delete the specific booking cards that were marked for deletion
      if (deletedBookingIds.length > 0) {
        // Convert booking IDs to numeric IDs for the backend
        const numericIds = deletedBookingIds
          .map(id => {
            const numericId = parseInt(id.replace('booking-', ''));
            return isNaN(numericId) ? null : numericId;
          })
          .filter((id): id is number => id !== null);
        
        if (numericIds.length > 0) {
          // Delete each booking individually
          for (const bookingId of numericIds) {
            const deleteResponse = await fetch('/api/bookings/pm', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ booking_id: bookingId }),
            });
            
            if (!deleteResponse.ok) {
              throw new Error('Failed to delete booking records');
            }
          }
        }
      }
      
      // Convert all availability cards to backend format and save
      const backendData = availabilityCards.flatMap(cardToBackendFormat);
      
      if (backendData.length > 0) {
        const response = await fetch('/api/availability', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(backendData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to save availability');
        }
      }
      
      // Reload the data to get the updated view with bookings
      await loadAvailability();
      // Clear the deleted card IDs since they've been processed
      setDeletedCardIds([]);
      setDeletedBookingIds([]);
    } catch (error) {
      console.error('Error saving availability:', error);
      setError('Failed to save availability data');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleEdit = async () => {
    if (isEditing) {
      // Save: Transfer edit state to backend
      await saveAvailability(editEvents);
      setIsEditing(false);
    } else {
      // Enter edit mode: Copy all cards to edit state (include booking cards)
      setEditEvents([...viewEvents]);
      setDeletedCardIds([]); // Clear any previous deletion tracking
      setDeletedBookingIds([]); // Clear any previous booking deletion tracking
      setIsEditing(true);
    }
  };

  const handleRefresh = () => {
    // Refresh: Reset edit state to match current data (include booking cards)
    setEditEvents([...viewEvents]);
    setDeletedCardIds([]); // Clear deletion tracking
    setDeletedBookingIds([]); // Clear booking deletion tracking
  };

  const handleReturnWithoutSaving = () => {
    // Exit edit mode without saving - revert to original view state
    setIsEditing(false);
    setDeletedCardIds([]); // Clear deletion tracking
    setDeletedBookingIds([]); // Clear booking deletion tracking
  };

  const handleCellClick = (day: number, hour: number, subCell: number) => {
    console.log(`Clicked: Day ${day}, Hour ${hour}, Sub-cell ${subCell} in ${isEditing ? 'edit' : 'view'} mode`);
  };

  const handleCardCreate = (cardData: Omit<Card, 'id'>) => {
    const newCard: Card = {
      ...cardData,
      id: `card-${Date.now()}-${Math.random()}`,
    };
    
    if (isEditing) {
      setEditEvents(prev => [...prev, newCard]);
    } else {
      setViewEvents(prev => [...prev, newCard]);
    }
  };

  const handleCardDelete = (cardId: string) => {
    if (isEditing) {
      // Find the card to get additional info for confirmation
      const card = editEvents.find(c => c.id === cardId);
      
      if (card?.id.startsWith('booking-')) {
        // This is a booking - show confirmation modal
        setCardToDelete(card);
        setShowDeleteConfirmation(true);
      } else {
        // This is an availability card - delete immediately
        setEditEvents(prev => prev.filter(card => card.id !== cardId));
        setDeletedCardIds(prev => [...prev, cardId]);
      }
    } else {
      // In view mode, we shouldn't be able to delete cards
      console.warn('Attempted to delete card in view mode');
    }
  };

  const handleConfirmBookingDelete = () => {
    if (cardToDelete) {
      // Remove from edit state
      setEditEvents(prev => prev.filter(card => card.id !== cardToDelete.id));
      // Track the deleted booking ID for later deletion from database
      setDeletedBookingIds(prev => [...prev, cardToDelete.id]);
    }
    setShowDeleteConfirmation(false);
    setCardToDelete(null);
  };

  const handleCancelBookingDelete = () => {
    setShowDeleteConfirmation(false);
    setCardToDelete(null);
  };

  // Check if there are unsaved changes
  const hasUnsavedChanges = () => {
    if (!isEditing) return false;
    
    // Check if any cards were deleted
    if (deletedCardIds.length > 0 || deletedBookingIds.length > 0) return true;
    
    // Filter to only availability cards for comparison
    const viewAvailabilityCards = viewEvents.filter(card => card.id.startsWith('card-'));
    const editAvailabilityCards = editEvents.filter(card => card.id.startsWith('card-'));
    
    // Check if the number of availability cards changed
    if (viewAvailabilityCards.length !== editAvailabilityCards.length) return true;
    
    // Create maps for easier comparison by ID
    const viewCardsMap = new Map(viewAvailabilityCards.map(card => [card.id, card]));
    const editCardsMap = new Map(editAvailabilityCards.map(card => [card.id, card]));
    
    // Check if any cards were added or removed
    for (const [id, viewCard] of viewCardsMap) {
      const editCard = editCardsMap.get(id);
      if (!editCard) return true; // Card was removed
      
      // Check if card properties changed
      if (
        viewCard.title !== editCard.title ||
        viewCard.startDay !== editCard.startDay ||
        viewCard.startHour !== editCard.startHour ||
        viewCard.startSubCell !== editCard.startSubCell ||
        viewCard.endDay !== editCard.endDay ||
        viewCard.endHour !== editCard.endHour ||
        viewCard.endSubCell !== editCard.endSubCell ||
        viewCard.color !== editCard.color
      ) {
        return true;
      }
    }
    
    // Check if any new cards were added
    for (const [id] of editCardsMap) {
      if (!viewCardsMap.has(id)) return true;
    }
    
    return false;
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-lg">Loading availability...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {isEditing ? 'Edit state' : 'View state'}
            </h2>
            <div className="flex gap-2">
              {isEditing && (
                <>
                  <button
                    onClick={handleRefresh}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    disabled={isSaving}
                  >
                    Refresh
                  </button>
                  <button
                    onClick={handleReturnWithoutSaving}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    disabled={isSaving}
                  >
                    Return without saving
                  </button>
                </>
              )}
              <button
                onClick={toggleEdit}
                className={`px-4 py-2 rounded disabled:opacity-50 ${
                  isEditing 
                    ? hasUnsavedChanges() 
                      ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : isEditing ? (hasUnsavedChanges() ? 'Save Changes' : 'Save') : 'Edit'}
              </button>
            </div>
          </div>
          {error && (
            <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Grid Container */}
      <div className="flex-1 p-6 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full">
          {/* View Mode Grid */}
          {!isEditing && (
            <div className="h-full">
              <div className="h-full overflow-x-auto border-2 border-blue-200 rounded-lg">
                <Grid 
                  onCellClick={handleCellClick} 
                  events={viewEvents}
                  isEditMode={false}
                />
              </div>
            </div>
          )}

          {/* Edit Mode Grid */}
          {isEditing && (
            <div className="h-full">
              <div className="h-full overflow-x-auto border-2 border-orange-200 rounded-lg">
                <Grid 
                  onCellClick={handleCellClick} 
                  events={editEvents}
                  isEditMode={true}
                  onCardCreate={handleCardCreate}
                  onCardDelete={handleCardDelete}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Deletion Confirmation Modal */}
      <Dialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking with {cardToDelete?.tenantName}?
            </DialogDescription>
          </DialogHeader>
          <div className="bg-gray-50 p-3 rounded mb-4">
            <p className="text-sm text-gray-700">
              <strong>Time:</strong> {cardToDelete?.title}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Tenant:</strong> {cardToDelete?.tenantName}
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelBookingDelete}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmBookingDelete}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Confirm Cancellation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 