import { Button, useToast } from '@chakra-ui/react';
import { useMemo } from 'react';

import { useEventContext } from '../../model/EventContext';

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
    eventFormData,
  } = formValues;
  const { title, date } = formState;
  const { saveEvent } = operationsValues;
  const { handleOverlap } = state;

  const toast = useToast();

  const isInvalidForm = useMemo(
    () => !title || !date || !startTime || !endTime,
    [title, date, startTime, endTime]
  );
  const isTimeError = useMemo(() => startTimeError || endTimeError, [startTimeError, endTimeError]);

  const addOrUpdateEvent = async () => {
    if (isInvalidForm) {
      toast({
        title: '필수 정보를 모두 입력해주세요.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (isTimeError) {
      toast({
        title: '시간 설정을 확인해주세요.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    handleOverlap();
    await saveEvent(eventFormData);
    resetForm();
  };

  return (
    <Button data-testid="event-submit-button" onClick={addOrUpdateEvent} colorScheme="blue">
      {editingEvent ? '일정 수정' : '일정 추가'}
    </Button>
  );
};
