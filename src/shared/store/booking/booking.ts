import { create } from 'zustand';
import type {BookingStore} from "./types";


export const useBookingStore = create<BookingStore>((set, _) => ({

  selectedStartDay: new Date().toISOString().split('T')[0],
  selectedEndDay: new Date().toISOString().split('T')[0],
  selectedStartTime: undefined,
  selectedEndTime: undefined,
  bookingType: "WASHING",
  cso: 4,
  floor: 1,
  selectedSlotIds: [],
  
  setSelectedStartDay: (dateString) => set({ selectedStartDay: dateString, selectedEndTime: undefined, selectedStartTime: undefined }),
  setSelectedEndDay: (dateString) => set({ selectedEndDay: dateString }),
  
  setSelectedStartTime: (date) => set({ selectedStartTime: date, selectedEndDay: undefined}),
  setSelectedEndTime: (date) => set({ selectedEndTime: date }),
  
  setCso: (cso) => set({ cso }),
  setFloor: (floor) => set({ floor }),
  
  setSelectedSlotIds: (ids) => set({ selectedSlotIds: ids }),
  
  addSlotId: (id) => 
    set((state) => ({
      selectedSlotIds: [...state.selectedSlotIds, id]
    })),
  
  removeSlotId: (id) =>
    set((state) => ({
      selectedSlotIds: state.selectedSlotIds.filter(slotId => slotId !== id)
    })),

  setBookingType: (bookingType) => set({bookingType}),
  
  toggleSlotId: (id) =>
    set((state) => ({
      selectedSlotIds: state.selectedSlotIds.includes(id)
        ? state.selectedSlotIds.filter(slotId => slotId !== id)
        : [...state.selectedSlotIds, id]
    })),
  
  reset: () => set({
    selectedStartDay: new Date().toISOString().split('T')[0],
    selectedEndDay: new Date().toISOString().split('T')[0],
    selectedStartTime: new Date().toISOString().split('T')[0],
    selectedEndTime: new Date().toISOString().split('T')[0],
    bookingType: "WASHING",
    cso: 4,
    floor: 1,
    selectedSlotIds: [],
  }),
}));
