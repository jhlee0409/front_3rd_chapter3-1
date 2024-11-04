import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, within, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import App from '../App';

describe('일정 CRUD 및 기본 기능', () => {
  const newEvent = {
    title: '새로운 일정',
    date: '2024-11-15',
    startTime: '10:00',
    endTime: '11:00',
    description: '새로운 일정 설명',
    location: '새로운 장소',
    category: '업무',
    notificationTime: '10',
    repeatType: 'daily',
    repeatInterval: '1',
    repeatEndDate: '2024-12-31',
  };

  beforeEach(() => {
    render(<App />, { wrapper: ChakraProvider });
  });

  it('입력한 새로운 일정 정보에 맞춰 모든 필드가 이벤트 리스트에 정확히 저장된다.', async () => {
    // ! HINT. event를 추가 제거하고 저장하는 로직을 잘 살펴보고, 만약 그대로 구현한다면 어떤 문제가 있을 지 고민해보세요.

    // 일정 추가 시 추가되는 요소들
    const titleInput = screen.getByLabelText('제목');
    const dateInput = screen.getByLabelText('날짜');
    const startTimeInput = screen.getByLabelText('시작 시간');
    const endTimeInput = screen.getByLabelText('종료 시간');
    const descriptionInput = screen.getByLabelText('설명');
    const locationInput = screen.getByLabelText('위치');
    const categoryInput = screen.getByLabelText('카테고리');
    const repeatCheckbox = screen.getByLabelText('반복 일정');
    const notificationTimeSelect = screen.getByLabelText('알림 설정');

    // 반복 일정 체크 시 추가되는 요소들
    const repeatTypeSelect = screen.queryByLabelText('반복 유형');
    const repeatIntervalInput = screen.queryByLabelText('반복 간격');

    // 일정 추가 버튼
    const addEventButton = screen.getByTestId('event-submit-button');

    // ================================================================

    // 필드 입력
    await userEvent.type(titleInput, newEvent.title);
    await userEvent.type(dateInput, newEvent.date);
    await userEvent.type(startTimeInput, newEvent.startTime);
    await userEvent.type(endTimeInput, newEvent.endTime);
    await userEvent.type(descriptionInput, newEvent.description);
    await userEvent.type(locationInput, newEvent.location);
    await userEvent.selectOptions(categoryInput, newEvent.category);
    await userEvent.selectOptions(notificationTimeSelect, newEvent.notificationTime);
    await userEvent.click(repeatCheckbox);
    if (repeatTypeSelect) {
      await userEvent.selectOptions(repeatTypeSelect, newEvent.repeatType);
    }
    if (repeatIntervalInput) {
      await userEvent.type(repeatIntervalInput, newEvent.repeatInterval);
    }

    // ================================================================

    // 일정 추가 버튼 클릭 시 일정 정보가 저장되는지 확인
    await userEvent.click(addEventButton);
    const eventList = screen.getByTestId('event-list');
    const searchInput = within(eventList).getByPlaceholderText('검색어를 입력하세요');

    // ================================================================

    // 검색어 입력 후 검색 결과 확인
    await userEvent.type(searchInput, newEvent.title);

    expect(within(eventList).getByText(newEvent.title)).toBeInTheDocument();
  });

  it('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영된다', async () => {
    const updatesEvent = {
      ...newEvent,
      location: '수정된 장소',
    };
    // 수정할 일정 선택
    const eventList = screen.getByTestId('event-list');

    const searchInput = within(eventList).getByPlaceholderText('검색어를 입력하세요');

    await userEvent.type(searchInput, newEvent.title);

    await waitFor(() => {
      expect(within(eventList).getByText(newEvent.title)).toBeInTheDocument();
    });

    const editButton = within(eventList).getByLabelText(/edit event/i);
    await userEvent.click(editButton);

    // ================================================================

    const titleInput = screen.getByLabelText('제목');
    const dateInput = screen.getByLabelText('날짜');
    const startTimeInput = screen.getByLabelText('시작 시간');
    const endTimeInput = screen.getByLabelText('종료 시간');
    const descriptionInput = screen.getByLabelText('설명');
    const locationInput = screen.getByLabelText('위치');
    const categoryInput = screen.getByLabelText('카테고리');
    const notificationTimeSelect = screen.getByLabelText('알림 설정');

    const repeatTypeSelect = screen.queryByLabelText('반복 유형');
    const repeatIntervalInput = screen.queryByLabelText('반복 간격');

    const addEventButton = screen.getByTestId('event-submit-button');

    // 수정 버튼 클릭 시 기존값이 잘 들어갔는 지 확인
    expect(titleInput).toHaveValue(newEvent.title);
    expect(dateInput).toHaveValue(newEvent.date);
    expect(startTimeInput).toHaveValue(newEvent.startTime);
    expect(endTimeInput).toHaveValue(newEvent.endTime);
    expect(descriptionInput).toHaveValue(newEvent.description);
    expect(locationInput).toHaveValue(newEvent.location);
    expect(categoryInput).toHaveValue(newEvent.category);
    expect(notificationTimeSelect).toHaveValue(newEvent.notificationTime);
    if (repeatTypeSelect) {
      expect(repeatTypeSelect).toHaveValue(newEvent.repeatType);
    }
    if (repeatIntervalInput) {
      expect(repeatIntervalInput).toHaveValue(newEvent.repeatInterval);
    }

    // 장소를 지우고 수정한 장소 입력
    await userEvent.clear(locationInput);
    await userEvent.type(locationInput, updatesEvent.location);

    await userEvent.click(addEventButton);

    // 수정한 장소가 정확히 반영되었는지 확인
    await waitFor(() => {
      expect(within(eventList).getByText(updatesEvent.location)).toBeInTheDocument();
    });
  });

  it('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', async () => {
    const eventList = screen.getByTestId('event-list');
    const searchInput = within(eventList).getByPlaceholderText('검색어를 입력하세요');

    // 검색어 입력
    await userEvent.type(searchInput, newEvent.title);

    // 삭제 버튼 클릭
    const deleteButton = within(eventList).getByLabelText(/delete event/i);
    await userEvent.click(deleteButton);

    // 삭제된 일정이 더 이상 조회되지 않는지 확인
    expect(within(eventList).queryByText(newEvent.title)).not.toBeInTheDocument();
  });
});

describe('일정 뷰', () => {
  beforeEach(() => {
    const date = new Date('2024-10-01T00:00:00');
    vi.setSystemTime(date);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('주별 뷰를 선택 후 해당 주에 일정이 없으면, 일정이 표시되지 않는다.', async () => {
    render(<App />, { wrapper: ChakraProvider });

    const viewSelect = screen.getByLabelText('view');
    await userEvent.selectOptions(viewSelect, 'week');

    const weekView = screen.getByTestId('week-view');

    expect(within(weekView).queryByText('기존 회의')).not.toBeInTheDocument();
  });

  it('주별 뷰 선택 후 해당 일자에 일정이 존재한다면 해당 일정이 정확히 표시된다', async () => {
    const date = new Date('2024-10-15T00:00:00');
    vi.setSystemTime(date);

    render(<App />, { wrapper: ChakraProvider });

    const viewSelect = screen.getByLabelText('view');
    await userEvent.selectOptions(viewSelect, 'week');

    const weekView = screen.getByTestId('week-view');
    expect(within(weekView).getByText('기존 회의')).toBeInTheDocument();
  });

  it('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {
    render(<App />, { wrapper: ChakraProvider });

    const viewSelect = screen.getByLabelText('view');
    await userEvent.selectOptions(viewSelect, 'month');

    const nextButton = screen.getByLabelText('Next');
    await userEvent.click(nextButton);

    const monthView = screen.getByTestId('month-view');

    expect(within(monthView).queryByText('기존 회의')).not.toBeInTheDocument();
  });

  it('월별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {
    render(<App />, { wrapper: ChakraProvider });

    const viewSelect = screen.getByLabelText('view');
    await userEvent.selectOptions(viewSelect, 'month');
    const monthView = screen.getByTestId('month-view');
    expect(within(monthView).getByText('기존 회의')).toBeInTheDocument();
  });

  it('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다', async () => {
    const date = new Date('2024-01-01T00:00:00');
    vi.setSystemTime(date);

    render(<App />, { wrapper: ChakraProvider });

    const viewSelect = screen.getByLabelText('view');
    await userEvent.selectOptions(viewSelect, 'month');

    const monthView = screen.getByTestId('month-view');
    expect(within(monthView).getByText('신정')).toBeInTheDocument();
  });
});

describe('검색 기능', () => {
  beforeEach(() => {
    const date = new Date('2024-10-01T00:00:00');
    vi.setSystemTime(date);
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  it('검색 결과가 없으면, "검색 결과가 없습니다."가 표시되어야 한다.', async () => {
    render(<App />, { wrapper: ChakraProvider });

    const eventList = screen.getByTestId('event-list');
    const searchInput = within(eventList).getByPlaceholderText('검색어를 입력하세요');

    // ================================================================

    // 검색어 입력 후 검색 결과 확인
    await userEvent.type(searchInput, '없는 검색어');

    expect(within(eventList).getByText('검색 결과가 없습니다.')).toBeInTheDocument();
  });

  it("'팀 회의'를 검색하면 해당 제목을 가진 일정이 리스트에 노출된다", async () => {
    render(<App />, { wrapper: ChakraProvider });

    const eventList = screen.getByTestId('event-list');
    const searchInput = within(eventList).getByPlaceholderText('검색어를 입력하세요');

    await userEvent.type(searchInput, '회의');

    await waitFor(() => {
      expect(within(eventList).getByText(/기존 회의/i)).toBeInTheDocument();
    });
  });

  it('검색어를 지우면 모든 일정이 다시 표시되어야 한다', async () => {
    render(<App />, { wrapper: ChakraProvider });

    const eventList = screen.getByTestId('event-list');
    const searchInput = within(eventList).getByPlaceholderText('검색어를 입력하세요');

    await waitFor(() => {
      expect(within(eventList).getByText(/기존 회의/i)).toBeInTheDocument();
    });

    await userEvent.clear(searchInput);

    await waitFor(() => {
      expect(within(eventList).getByText(/기존 회의/i)).toBeInTheDocument();
    });
  });
});

describe('일정 충돌', () => {
  beforeEach(() => {
    const date = new Date('2024-10-01T00:00:00');
    vi.setSystemTime(date);
    render(<App />, { wrapper: ChakraProvider });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const newEvent = {
    title: '새로운 일정',
    date: '2024-10-15',
    startTime: '09:00',
    endTime: '11:00',
    description: '새로운 일정 설명',
    location: '새로운 장소',
    category: '업무',
    notificationTime: '10',
    repeatType: 'daily',
    repeatInterval: '1',
    repeatEndDate: '2024-12-31',
  };

  it('겹치는 시간에 새 일정을 추가할 때 경고가 표시된다', async () => {
    // 일정 추가 시 추가되는 요소들
    const titleInput = screen.getByLabelText('제목');
    const dateInput = screen.getByLabelText('날짜');
    const startTimeInput = screen.getByLabelText('시작 시간');
    const endTimeInput = screen.getByLabelText('종료 시간');
    const descriptionInput = screen.getByLabelText('설명');
    const locationInput = screen.getByLabelText('위치');
    const categoryInput = screen.getByLabelText('카테고리');
    const repeatCheckbox = screen.getByLabelText('반복 일정');
    const notificationTimeSelect = screen.getByLabelText('알림 설정');

    // 반복 일정 체크 시 추가되는 요소들
    const repeatTypeSelect = screen.queryByLabelText('반복 유형');
    const repeatIntervalInput = screen.queryByLabelText('반복 간격');

    // 일정 추가 버튼
    const addEventButton = screen.getByTestId('event-submit-button');

    // ================================================================

    // 필드 입력
    await userEvent.type(titleInput, newEvent.title);
    await userEvent.type(dateInput, newEvent.date);
    await userEvent.type(startTimeInput, newEvent.startTime);
    await userEvent.type(endTimeInput, newEvent.endTime);
    await userEvent.type(descriptionInput, newEvent.description);
    await userEvent.type(locationInput, newEvent.location);
    await userEvent.selectOptions(categoryInput, newEvent.category);
    await userEvent.selectOptions(notificationTimeSelect, newEvent.notificationTime);
    await userEvent.click(repeatCheckbox);
    if (repeatTypeSelect) {
      await userEvent.selectOptions(repeatTypeSelect, newEvent.repeatType);
    }
    if (repeatIntervalInput) {
      await userEvent.type(repeatIntervalInput, newEvent.repeatInterval);
    }

    // ================================================================

    // 일정 추가 버튼 클릭 시 일정이 겹치면 경고가 노출되는지 확인
    await userEvent.click(addEventButton);
    expect(screen.getByText('일정 겹침 경고')).toBeInTheDocument();
  });

  it('기존 일정의 시간을 수정하여 충돌이 발생하면 경고가 노출된다', async () => {
    // 수정할 일정 선택
    const eventList = screen.getByTestId('event-list');

    await waitFor(() => {
      expect(within(eventList).getByText('기존 회의')).toBeInTheDocument();
    });

    const editButton = within(eventList).getByLabelText(/edit event/i);
    await userEvent.click(editButton);

    // ================================================================

    const titleInput = screen.getByLabelText('제목');
    const dateInput = screen.getByLabelText('날짜');
    const startTimeInput = screen.getByLabelText('시작 시간');
    const endTimeInput = screen.getByLabelText('종료 시간');
    const descriptionInput = screen.getByLabelText('설명');
    const locationInput = screen.getByLabelText('위치');
    const categoryInput = screen.getByLabelText('카테고리');
    const notificationTimeSelect = screen.getByLabelText('알림 설정');

    const repeatTypeSelect = screen.queryByLabelText('반복 유형');
    const repeatIntervalInput = screen.queryByLabelText('반복 간격');

    const addEventButton = screen.getByTestId('event-submit-button');

    // 수정 버튼 클릭 시 기존값이 잘 들어갔는 지 확인
    expect(titleInput).toHaveValue('기존 회의');
    expect(dateInput).toHaveValue('2024-10-15');
    expect(startTimeInput).toHaveValue('09:00');
    expect(endTimeInput).toHaveValue('10:00');
    expect(descriptionInput).toHaveValue('기존 팀 미팅');
    expect(locationInput).toHaveValue('회의실 B');
    expect(categoryInput).toHaveValue('업무');
    expect(notificationTimeSelect).toHaveValue('10');
    if (repeatTypeSelect) {
      expect(repeatTypeSelect).toHaveValue('daily');
    }
    if (repeatIntervalInput) {
      expect(repeatIntervalInput).toHaveValue('1');
    }

    // 시간을 잘못 입력
    await userEvent.clear(startTimeInput);
    await userEvent.type(startTimeInput, '14:00');

    await userEvent.click(addEventButton);

    // 시간 설정 오류 노출 확인
    expect(screen.getByText(/시간 설정을 확인해주세요/i)).toBeInTheDocument();
  });
});

it('notificationTime을 10으로 하면 지정 시간 10분 전 알람 텍스트가 노출된다', async () => {
  const date = new Date('2024-10-15T09:50:00');
  vi.setSystemTime(date);

  render(<App />, { wrapper: ChakraProvider });

  const eventList = screen.getByTestId('event-list');

  await waitFor(() => {
    expect(within(eventList).getByText('기존 회의')).toBeInTheDocument();
  });

  expect(screen.getByText('10분 전')).toBeInTheDocument();
});
