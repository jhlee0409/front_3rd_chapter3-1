import { Event, EventForm } from '../types';

// ! Hard
// ! 이벤트는 생성, 수정 되면 fetch를 다시 해 상태를 업데이트 합니다. 이를 위한 제어가 필요할 것 같은데요. 어떻게 작성해야 테스트가 병렬로 돌아도 안정적이게 동작할까요?
// ! 아래 이름을 사용하지 않아도 되니, 독립적이게 테스트를 구동할 수 있는 방법을 찾아보세요. 그리고 이 로직을 PR에 설명해주세요.
export const createEventResolver = (
  initEvents = [] as Event[],
  event: EventForm,
  shouldFetch = true
) => {
  const _initEvents = shouldFetch ? initEvents : [...initEvents];
  const newEventWithId = { ...event, id: `${+_initEvents[_initEvents.length - 1].id + 1}` };
  _initEvents.push(newEventWithId);
  return { list: _initEvents, newEventWithId };
};

export const updateEventResolver = (
  initEvents = [] as Event[],
  event: Event,
  shouldFetch = true
) => {
  const _initEvents = shouldFetch ? initEvents : [...initEvents];
  const findEventIndex = _initEvents.findIndex((e) => e.id === event.id);
  if (findEventIndex === -1) {
    return { status: 404, message: 'Event not found' };
  }
  const updatedEvent = { ..._initEvents[findEventIndex], ...event };
  _initEvents[findEventIndex] = updatedEvent;
  return { status: 200, updatedEvent, list: _initEvents };
};

export const deleteEventResolver = (initEvents = [] as Event[], id: string, shouldFetch = true) => {
  const _initEvents = shouldFetch ? initEvents : [...initEvents];
  const findIndex = _initEvents.findIndex((e) => e.id === id);
  _initEvents.splice(findIndex, 1);
  return { status: 204, list: _initEvents };
};
