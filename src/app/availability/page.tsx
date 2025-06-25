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
import { Edit3, Save, RefreshCw, X, Calendar, Eye, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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
  
  // Create title from time range
  const formatTime = (hour: number, subCell: number) => {
    const minutes = subCell * 15;
    if (hour === 0) return `12:${minutes.toString().padStart(2, '0')} AM`;
    if (hour === 12) return `12:${minutes.toString().padStart(2, '0')} PM`;
    if (hour > 12) return `${hour - 12}:${minutes.toString().padStart(2, '0')} PM`;
    return `${hour}:${minutes.toString().padStart(2, '0')} AM`;
  };
  
  // Calculate the end time to match how findAvailableSlots creates slots (next sub-cell)
  const startTime = formatTime(startHour, startSubCell);
  const endSubCell = (startSubCell + 1) % 4;
  const endHour = startSubCell === 3 ? startHour + 1 : startHour; // If we wrap to next hour
  const endTime = formatTime(endHour, endSubCell);
  
  const title = `${startTime} - ${endTime}`;
  
  return {
    id: `card-${availability.id}`,
    title,
    startDay,
    startHour,
    startSubCell,
    endDay: startDay, // Same day for now
    endHour,
    endSubCell,
    color: 'bg-gradient-to-r from-blue-500 to-blue-600',
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
  
  // Create title from time range
  const formatTime = (hour: number, subCell: number) => {
    const minutes = subCell * 15;
    if (hour === 0) return `12:${minutes.toString().padStart(2, '0')} AM`;
    if (hour === 12) return `12:${minutes.toString().padStart(2, '0')} PM`;
    if (hour > 12) return `${hour - 12}:${minutes.toString().padStart(2, '0')} PM`;
    return `${hour}:${minutes.toString().padStart(2, '0')} AM`;
  };
  
  // Calculate the end time to match how findAvailableSlots creates slots (next sub-cell)
  const startTime = formatTime(startHour, startSubCell);
  const endSubCell = (startSubCell + 1) % 4;
  const endHour = startSubCell === 3 ? startHour + 1 : startHour; // If we wrap to next hour
  const endTime = formatTime(endHour, endSubCell);
  
  const title = `${startTime} - ${endTime} (${booking.tenant_name})`;
  
  return {
    id: `booking-${booking.id}`,
    title,
    startDay,
    startHour,
    startSubCell,
    endDay: startDay, // Same day for now
    endHour,
    endSubCell,
    color: 'bg-gradient-to-r from-purple-500 to-purple-600', // Purple for bookings
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-lg text-muted-foreground">Loading availability...</div>
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
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-purple-600 rounded-xl flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Availability Management</h1>
                <p className="text-muted-foreground">
                  {isEditing ? 'Edit Mode' : 'View Mode'} • Manage your property viewing schedule
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {isEditing && (
                <>
                  <Button
                    onClick={handleRefresh}
                    variant="outline"
                    size="sm"
                    disabled={isSaving}
                    className="gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                  <Button
                    onClick={handleReturnWithoutSaving}
                    variant="destructive"
                    size="sm"
                    disabled={isSaving}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </>
              )}
              <Button
                onClick={toggleEdit}
                disabled={isSaving}
                className={`gap-2 ${
                  isEditing 
                    ? hasUnsavedChanges() 
                      ? 'bg-orange-500 hover:bg-orange-600' 
                      : 'bg-green-500 hover:bg-green-600'
                    : 'bg-primary hover:bg-primary/90'
                }`}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : isEditing ? (
                  <>
                    <Save className="h-4 w-4" />
                    {hasUnsavedChanges() ? 'Save Changes' : 'Save'}
                  </>
                ) : (
                  <>
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl">
              <div className="flex items-center gap-2">
                <X className="h-4 w-4" />
                {error}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Mode Indicator */}
          <div className="mb-6">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              isEditing 
                ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800'
                : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
            }`}>
              {isEditing ? (
                <>
                  <Edit3 className="h-4 w-4" />
                  Edit Mode - Drag to create new slots
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  View Mode - View all bookings and availability
                </>
              )}
            </div>
          </div>

          {/* Grid Container */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="h-[calc(100vh-280px)] min-h-[600px]">
              <Grid 
                onCellClick={handleCellClick} 
                events={isEditing ? editEvents : viewEvents}
                isEditMode={isEditing}
                dynamicTimeRange={false}
                onCardCreate={handleCardCreate}
                onCardDelete={isEditing ? handleCardDelete : undefined}
              />
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-6 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded"></div>
              <span className="text-sm text-muted-foreground">Available Slots</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded"></div>
              <span className="text-sm text-muted-foreground">Booked Appointments</span>
            </div>
            {isEditing && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-200/50 dark:bg-blue-800/30 rounded"></div>
                <span className="text-sm text-muted-foreground">Drag Preview</span>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Booking Deletion Confirmation Modal */}
      <Dialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Cancel Booking
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking with {cardToDelete?.tenantName}?
            </DialogDescription>
          </DialogHeader>
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl mb-4">
            <p className="text-sm text-foreground">
              <strong>Time:</strong> {cardToDelete?.title}
            </p>
            <p className="text-sm text-foreground">
              <strong>Tenant:</strong> {cardToDelete?.tenantName}
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelBookingDelete}
              disabled={isSaving}
            >
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmBookingDelete}
              disabled={isSaving}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Confirm Cancellation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 