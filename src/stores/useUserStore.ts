import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { PageObject } from '../../generated';

interface State {
  paging: PageObject;
  setPaging: (pagingInfo: PageObject | undefined) => void;
}

interface ApiState {}

const initialStateCreator: StateCreator<State & ApiState, any> = (set, get, api) => {
  return {
    paging: {
      curPage: 1,
      pageRowCount: 20,
    },
    setPaging: (pageObject) => {
      set((state) => ({
        paging: {
          ...state.paging,
          ...pageObject,
        },
      }));
    },
  };
};

export const useUserStore = create<State & ApiState>()(devtools(immer(initialStateCreator)));
