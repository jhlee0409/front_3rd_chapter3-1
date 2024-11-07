import { Heading, Text, VStack } from '@chakra-ui/react';

import { CalendarDayCell } from './CalendarDayCell';

import { formatWeek, getWeekDates, isEqualDate } from '@/features/event/lib/dateUtils';
import { weekDays } from '@/shared/model/date-config';
import { Table } from '@/shared/ui';
import { Event } from '@/types';

type WeekViewCalendarProps = {
  currentDate: Date;
  events: Event[];
  notifiedEvents: string[];
};

export const WeekViewCalendar = ({
  currentDate,
  events,
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
                {events
                  .filter((event) => isEqualDate(new Date(event.date), date))
                  .map((event) => {
                    const isNotified = notifiedEvents.includes(event.id);
                    return <CalendarDayCell key={event.id} event={event} isNotified={isNotified} />;
                  })}
              </Table.Cell>
            ))}
          </Table.Row>
        </Table.Body>
      </Table.Container>
    </VStack>
  );
};
