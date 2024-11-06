import { Button, useToast } from '@chakra-ui/react';
import { useCallback, useMemo } from 'react';

import { createEventFormData } from '../../lib/eventUtils';
import { useEventContext } from '../../model/EventContext';

import { Event, EventForm } from '@/types';
import { findOverlappingEvents } from '@/utils/eventOverlap';

export const FormSubmitEventButton = () => {
  const { formValues, operationsValues, state } = useEventContext();
  const {
    formState,
    startTime,
    endTime,
    startTimeError,
    endTimeError,
    editingEvent,
    resetForm,
    repeatState,
  } = formValues;
  const { title, date } = formState;
  const { events, saveEvent } = operationsValues;
  const { handleOverlapDialogOpen } = state;

  const toast = useToast();

  const eventData: Event | EventForm = useMemo(() => {
    return createEventFormData({
      formState,
      repeatState,
      startTime,
      endTime,
      editingEvent,
    });
  }, [formState, startTime, endTime, editingEvent, repeatState]);

  const handleShowRequiredError = useCallback(() => {
    if (!title || !date || !startTime || !endTime) {
      toast({
        title: '필수 정보를 모두 입력해주세요.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  }, [toast, title, date, startTime, endTime]);

  const handleShowTimeError = useCallback(() => {
    if (startTimeError || endTimeError) {
      toast({
        title: '시간 설정을 확인해주세요.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast, startTimeError, endTimeError]);

  const handleOverlap = useCallback(() => {
    const overlapping = findOverlappingEvents(eventData, events);
    if (overlapping.length > 0) {
      handleOverlapDialogOpen(overlapping);
      return;
    }
  }, [eventData, events, handleOverlapDialogOpen]);

  const addOrUpdateEvent = async () => {
    handleShowRequiredError();
    handleShowTimeError();
    handleOverlap();
    await saveEvent(eventData);
    resetForm();
  };

  return (
    <Button data-testid="event-submit-button" onClick={addOrUpdateEvent} colorScheme="blue">
      {editingEvent ? '일정 수정' : '일정 추가'}
    </Button>
  );
};
