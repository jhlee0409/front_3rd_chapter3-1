import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { createEventFormData } from '../lib/eventUtils';

import { useCalendarView } from '@/hooks/useCalendarView';
import { useEventForm } from '@/hooks/useEventForm';
import { useEventOperations } from '@/hooks/useEventOperations';
import { useNotifications } from '@/hooks/useNotifications';
import { useSearch } from '@/hooks/useSearch';
import { Event, EventForm } from '@/types';
import { findOverlappingEvents } from '@/utils/eventOverlap';

type EventContextType = {
  formValues: ReturnType<typeof useEventForm> & {
    eventFormData: Event | EventForm;
  };
  operationsValues: ReturnType<typeof useEventOperations>;
  notificationsValues: ReturnType<typeof useNotifications>;
  calendarViewValues: ReturnType<typeof useCalendarView>;
  searchValues: ReturnType<typeof useSearch>;
  state: {
    isOverlapDialogOpen: boolean;
    handleCloseOverlapDialog: () => void;
    overlappingEvents: Event[];
    handleOverlap: () => void;
  };
};

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
};

export const EventProvider = ({ children }: { children: React.ReactNode }) => {
  const formValues = useEventForm();

  const operationsValues = useEventOperations(Boolean(formValues.editingEvent), () =>
    formValues.setEditingEvent(null)
  );

  const notificationsValues = useNotifications(operationsValues.events);
  const calendarViewValues = useCalendarView();
  const searchValues = useSearch(
    operationsValues.events,
    calendarViewValues.currentDate,
    calendarViewValues.view
  );

  const [isOverlapDialogOpen, setIsOverlapDialogOpen] = useState(false);
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);

  const eventFormData: Event | EventForm = useMemo(() => {
    return createEventFormData({
      formState: formValues.formState,
      repeatState: formValues.repeatState,
      startTime: formValues.startTime,
      endTime: formValues.endTime,
      editingEvent: formValues.editingEvent,
    });
  }, [
    formValues.formState,
    formValues.startTime,
    formValues.endTime,
    formValues.editingEvent,
    formValues.repeatState,
  ]);

  const handleOverlapDialogOpen = useCallback((events: Event[]) => {
    setIsOverlapDialogOpen(true);
    setOverlappingEvents(events);
  }, []);

  const handleCloseOverlapDialog = useCallback(() => {
    setIsOverlapDialogOpen(false);
  }, []);

  const handleOverlap = useCallback(() => {
    const overlapping = findOverlappingEvents(eventFormData, operationsValues.events);
    if (overlapping.length > 0) {
      handleOverlapDialogOpen(overlapping);
      return;
    }
  }, [eventFormData, operationsValues.events, handleOverlapDialogOpen]);

  const state = useMemo(
    () => ({
      isOverlapDialogOpen,
      handleCloseOverlapDialog,
      overlappingEvents,
      handleOverlap,
    }),
    [isOverlapDialogOpen, overlappingEvents, handleOverlap, handleCloseOverlapDialog]
  );

  const values = useMemo(
    () => ({
      formValues: { ...formValues, eventFormData },
      operationsValues,
      state,
      notificationsValues,
      calendarViewValues,
      searchValues,
    }),
    [
      formValues,
      operationsValues,
      state,
      notificationsValues,
      calendarViewValues,
      searchValues,
      eventFormData,
    ]
  );

  return <EventContext.Provider value={values}>{children}</EventContext.Provider>;
};

export default EventProvider;
