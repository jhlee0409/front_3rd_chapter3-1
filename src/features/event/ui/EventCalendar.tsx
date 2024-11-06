import { Heading, VStack } from '@chakra-ui/react';

import CalendarViewSelector from './CalendarViewSelector';
import { useEventContext } from '../model/EventContext';

import { MonthViewCalendar, WeekViewCalendar } from '@/entities/event/ui';

export const EventCalendar = () => {
  const { notificationsValues, calendarViewValues, searchValues } = useEventContext();

  const { view, currentDate, holidays } = calendarViewValues;
  const { filteredEvents } = searchValues;
  const { notifiedEvents } = notificationsValues;

  return (
    <VStack flex={1} spacing={5} align="stretch">
      <Heading>일정 보기</Heading>
      <CalendarViewSelector />
      {view === 'week' && (
        <WeekViewCalendar
          currentDate={currentDate}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
        />
      )}
      {view === 'month' && (
        <MonthViewCalendar
          currentDate={currentDate}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
          holidays={holidays}
        />
      )}
    </VStack>
  );
};