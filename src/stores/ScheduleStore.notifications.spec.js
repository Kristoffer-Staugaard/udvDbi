import { vi, describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useScheduleStore } from './ScheduleStore';

vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    getDocs: vi.fn(),
    updateDoc: vi.fn(),
    collection: actual.collection,
    query: actual.query,
    where: actual.where,
    doc: vi.fn(),
  };
});

describe('checkAndUpdateTaskStatuses', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    setActivePinia(createPinia());  // Aktiver Pinia for hver test
  });

  it('skal opdatere opgaver med overskredet deadline', async () => {
    const fakeUid = '123';
    const now = new Date('2025-05-19T12:00:00Z');

    vi.useFakeTimers();
    vi.setSystemTime(now);

    // Importer de mockede funktioner
    const { getDocs, updateDoc, doc } = await import('firebase/firestore');

    const mockDocs = [
      {
        id: 'task1',
        data: () => ({
          status: 'Igangværende',
          deadline: '2025-05-18T10:00:00Z',
        }),
      },
      {
        id: 'task2',
        data: () => ({
          status: 'Igangværende',
          deadline: '2025-05-20T10:00:00Z',
        }),
      },
    ];

    getDocs.mockResolvedValue({ docs: mockDocs });
    updateDoc.mockResolvedValue();
    doc.mockImplementation((db, col, id) => ({ id }));

    const store = useScheduleStore();
    await store.checkAndUpdateTaskStatuses(fakeUid);

    expect(updateDoc).toHaveBeenCalledTimes(1);
    expect(updateDoc).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'task1' }),
      { status: 'Overskredet' }
    );

    vi.useRealTimers();
  });
});
