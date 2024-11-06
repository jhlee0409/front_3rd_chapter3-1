import { BellIcon } from '@chakra-ui/icons';
import { Box, Heading, HStack, Text, VStack } from '@chakra-ui/react';

import { weekDays } from '@/shared/model/date-config';
import { Table } from '@/shared/ui';
import { Event } from '@/types';
import { formatWeek, getWeekDates, isEqualDate } from '@/utils/dateUtils';

type WeekViewCalendarProps = {
  currentDate: Date;
  filteredEvents: Event[];
  notifiedEvents: string[];
};

export const WeekViewCalendar = ({
  currentDate,
  filteredEvents,
  notifiedEvents,
}: WeekViewCalendarProps) => {
  const weekDates = getWeekDates(currentDate);
  return (
    <VStack data-testid="week-view" align="stretch" w="full" spacing={4}>
      <Heading size="md">{formatWeek(currentDate)}</Heading>
      <Table.Container variant="simple" w="full">
        <Table.Header>
          <Table.Row>
            {weekDays.map((day) => (
              <Table.Th key={day} width="14.28%">
                {day}
              </Table.Th>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            {weekDates.map((date) => (
              <Table.Cell
                key={date.toISOString()}
                height="100px"
                verticalAlign="top"
                width="14.28%"
              >
                <Text fontWeight="bold">{date.getDate()}</Text>
                {filteredEvents
                  .filter((event) => isEqualDate(new Date(event.date), date))
                  .map((event) => {
                    const isNotified = notifiedEvents.includes(event.id);
                    return (
                      <Box
                        key={event.id}
                        p={1}
                        my={1}
                        bg={isNotified ? 'red.100' : 'gray.100'}
                        borderRadius="md"
                        fontWeight={isNotified ? 'bold' : 'normal'}
                        color={isNotified ? 'red.500' : 'inherit'}
                      >
                        <HStack spacing={1}>
                          {isNotified && <BellIcon />}
                          <Text fontSize="sm" noOfLines={1}>
                            {event.title}
                          </Text>
                        </HStack>
                      </Box>
                    );
                  })}
              </Table.Cell>
            ))}
          </Table.Row>
        </Table.Body>
      </Table.Container>
    </VStack>
  );
};
