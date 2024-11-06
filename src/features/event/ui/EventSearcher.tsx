import { FormControl, FormLabel, Input, VStack } from '@chakra-ui/react';

import { useEventContext } from '../model/EventContext';

import { SearchedEvents } from '@/entities/event/ui';

export const EventSearcher = () => {
  const { formValues, operationsValues, notificationsValues, searchValues } = useEventContext();

  const { editEvent } = formValues;
  const { deleteEvent } = operationsValues;
  const { searchTerm, filteredEvents, setSearchTerm } = searchValues;
  const { notifiedEvents } = notificationsValues;

  return (
    <VStack data-testid="event-list" w="500px" h="full" overflowY="auto">
      <FormControl>
        <FormLabel>일정 검색</FormLabel>
        <Input
          placeholder="검색어를 입력하세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </FormControl>

      <SearchedEvents
        filteredEvents={filteredEvents}
        notifiedEvents={notifiedEvents}
        editEvent={editEvent}
        deleteEvent={deleteEvent}
      />
    </VStack>
  );
};
