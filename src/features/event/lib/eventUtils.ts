import { EventFormData, RepeatState } from '../model/types';

import { Event, EventForm, RepeatInfo } from '@/types';

export const createEventRepeatState = (repeatFormData: RepeatInfo) => {
  const { type, interval, endDate } = repeatFormData;
  return {
    isRepeating: type !== 'none',
    repeatType: type || 'none',
    repeatInterval: interval || 1,
    repeatEndDate: endDate || '',
  };
};

export const createEventRepeatFormData = (repeatState: RepeatState) => {
  const { isRepeating, repeatType, repeatInterval, repeatEndDate } = repeatState;
  return {
    type: isRepeating ? repeatType : 'none',
    interval: repeatInterval,
    endDate: repeatEndDate || undefined,
  };
};

export const createEventFormData = (data: EventFormData): Event | EventForm => {
  const { startTime, endTime, formState, repeatState } = data;
  return {
    ...formState,
    id: data.editingEvent ? data.editingEvent.id : undefined,
    startTime,
    endTime,
    repeat: createEventRepeatFormData(repeatState),
  };
};
