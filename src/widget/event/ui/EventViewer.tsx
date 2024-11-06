import { Flex } from '@chakra-ui/react';

import { FormEvent } from '@/features/event/ui';
import { EventCalendar } from '@/features/event/ui/EventCalendar';
import { EventSearcher } from '@/features/event/ui/EventSearcher';

export const EventViewer = () => {
  return (
    <Flex gap={6} h="full">
      {/* 일정 추가 */}
      <FormEvent />
      {/* 일정 보기 */}
      <EventCalendar />
      {/* 일정 검색 */}
      <EventSearcher />
    </Flex>
  );
};
