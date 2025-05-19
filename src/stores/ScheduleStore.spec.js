if (import.meta.vitest) {
    const { describe, it, expect, beforeEach } = import.meta.vitest;
    const { setActivePinia, createPinia } = await import('pinia');
    const { useScheduleStore } = await import('./ScheduleStore');
  
    describe('ScheduleStore', () => {
      beforeEach(() => {
        setActivePinia(createPinia());
      });
  
      it('returnerer kun opgaver med status "Overskredet"', () => {
        const store = useScheduleStore();
  
        store.tasks = [
          { title: 'A', status: 'Overskredet' },
          { title: 'B', status: 'Igangværende' },
          { title: 'C', status: 'Overskredet' },
          { title: 'D', status: 'Udført' },
        ];
  
        const result = store.overskredneTasks;
  
        expect(result.length).toBe(2);
        expect(result).toEqual([
          { title: 'A', status: 'Overskredet' },
          { title: 'C', status: 'Overskredet' },
        ]);
      });
  
      it('returnerer tom liste hvis ingen er overskredet', () => {
        const store = useScheduleStore();
  
        store.tasks = [
          { title: 'X', status: 'Udført' },
          { title: 'Y', status: 'Igangværende' },
        ];
  
        expect(store.overskredneTasks).toEqual([]);
      });
    });
  }