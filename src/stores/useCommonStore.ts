import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface State {
  isClosing: boolean;
  setIsClosing: (isClosing: boolean) => void;
}

interface ApiState {}

const initialStateCreator: StateCreator<State & ApiState, any> = (set, get, api) => {
  return {
    isClosing: false,
    setIsClosing: (isClosing) => {
      set((state) => ({
        isClosing: isClosing,
      }));
    },
  };
};

export const useCommonStore = create<State & ApiState>()(devtools(immer(initialStateCreator)));
