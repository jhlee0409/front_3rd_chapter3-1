import { Button, Text } from '@chakra-ui/react';
import { useRef } from 'react';

import { createEventFormData } from '../lib/eventUtils';

import { useEventContext } from '@/features/event/model/EventContext';
import { AlertDialog } from '@/shared/ui';

export const EventAlert = () => {
  const { formValues, operationsValues, state } = useEventContext();
  const { formState, repeatState, startTime, endTime, editingEvent } = formValues;
  const { saveEvent } = operationsValues;
  const { isOverlapDialogOpen, setIsOverlapDialogOpen, overlappingEvents } = state;

  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    setIsOverlapDialogOpen(false);
  };

  const handleSave = () => {
    handleClose();
    const eventData = createEventFormData({
      startTime,
      endTime,
      formState,
      repeatState,
      editingEvent,
    });
    saveEvent(eventData);
  };

  return (
    <AlertDialog.Container
      isOpen={isOverlapDialogOpen}
      leastDestructiveRef={cancelRef}
      onClose={handleClose}
    >
      <AlertDialog.Header fontSize="lg" fontWeight="bold">
        일정 겹침 경고
      </AlertDialog.Header>

      <AlertDialog.Body>
        다음 일정과 겹칩니다:
        {overlappingEvents.map((event) => (
          <Text key={event.id}>
            {event.title} ({event.date} {event.startTime}-{event.endTime})
          </Text>
        ))}
        계속 진행하시겠습니까?
      </AlertDialog.Body>

      <AlertDialog.Footer>
        <Button ref={cancelRef} onClick={handleClose}>
          취소
        </Button>
        <Button colorScheme="red" onClick={handleSave} ml={3}>
          계속 진행
        </Button>
      </AlertDialog.Footer>
    </AlertDialog.Container>
  );
};
