export interface BookingStore{

  selectedStartDay: string;
  selectedEndDay: string;
  
  selectedStartTime: string | undefined;
  selectedEndTime: string | undefined;
  bookingType: "WASHING" | "DRYING";
  
  cso: number;
  floor: number;
  
  selectedSlotIds: string[];
  
  setSelectedStartDay: (dateString: string) => void;
  setSelectedEndDay: (dateString: string) => void;
  
  setSelectedStartTime: (date: string) => void;
  setSelectedEndTime: (date: string) => void;
  
  setCso: (cso: number) => void;
  setFloor: (floor: number) => void;
  
  setSelectedSlotIds: (ids: string[]) => void;
  addSlotId: (id: string) => void;
  removeSlotId: (id: string) => void;
  toggleSlotId: (id: string) => void;
  setBookingType: (str: "WASHING" | "DRYING") => void;
  
  reset: () => void;
}