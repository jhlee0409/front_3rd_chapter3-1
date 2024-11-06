import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { useCalendarView } from '@/hooks/useCalendarView';
import { useEventForm } from '@/hooks/useEventForm';
import { useEventOperations } from '@/hooks/useEventOperations';
import { useNotifications } from '@/hooks/useNotifications';
import { useSearch } from '@/hooks/useSearch';
import { Event } from '@/types';

type EventContextType = {
  formValues: ReturnType<typeof useEventForm>;
  operationsValues: ReturnType<typeof useEventOperations>;
  notificationsValues: ReturnType<typeof useNotifications>;
  calendarViewValues: ReturnType<typeof useCalendarView>;
  searchValues: ReturnType<typeof useSearch>;
  state: {
    isOverlapDialogOpen: boolean;
    setIsOverlapDialogOpen: (isOpen: boolean) => void;
    overlappingEvents: Event[];
    setOverlappingEvents: (events: Event[]) => void;
    handleOverlapDialogOpen: (events: Event[]) => void;
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

  const handleOverlapDialogOpen = useCallback((events: Event[]) => {
    setIsOverlapDialogOpen(true);
    setOverlappingEvents(events);
  }, []);

  const state = useMemo(
    () => ({
      isOverlapDialogOpen,
      setIsOverlapDialogOpen,
      overlappingEvents,
      setOverlappingEvents,
      handleOverlapDialogOpen,
    }),
    [isOverlapDialogOpen, overlappingEvents, handleOverlapDialogOpen]
  );

  const values = useMemo(
    () => ({
      formValues,
      operationsValues,
      state,
      notificationsValues,
      calendarViewValues,
      searchValues,
    }),
    [formValues, operationsValues, state, notificationsValues, calendarViewValues, searchValues]
  );

  return <EventContext.Provider value={values}>{children}</EventContext.Provider>;
};

export default EventProvider;
