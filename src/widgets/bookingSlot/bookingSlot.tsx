import { BookingSlot } from "@/entities/bookingSlots/ui";
import styles from "./bookingSlot.module.scss";
import { Button } from "@/shared/ui/button";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useSlots, useOverlaps } from "@/entities/bookingSlots/hooks/hooks";
import { LoadingSpinner } from "@/shared/ui/button/loading/loading";
import { CreateButton } from "@/features/createBooking/ui";
import { useBookingStore } from "@/shared/store/booking/booking";

export const BookingSlotWidget = React.memo(() => {

  const selectedStartTime = useBookingStore((state) => state.selectedStartTime)
  const selectedEndTime = useBookingStore((state) => state.selectedEndTime)
  const cso = useBookingStore((state) => state.cso)
  const floor = useBookingStore((state) => state.floor)
  const bookingType = useBookingStore((state) => state.bookingType)

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [selectedPlaces, setSelectedPlaces] = useState<Set<number>>(
    () => new Set(),
  );

  const handleToggle = (placeId: number) => {
    
    setSelectedPlaces((prev) => {
      const next = new Set(prev);
      if (next.has(placeId)) {
        next.delete(placeId);
      } else if (next.size < 6) {
        next.add(placeId);
      }
      return next;
    });
    
  };

  const isSelected = (placeId: number) => selectedPlaces.has(placeId);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [selectedPlaces]);

  const slotsQuery = useSlots({
    type: bookingType,
    floor: floor,
    cso: cso,
  });

  const overlapsDates = useMemo(() => {
    if (!selectedStartTime || !selectedEndTime) return null;
    
    try {
      const startDate = new Date(selectedStartTime);
      const endDate = new Date(selectedEndTime);
      
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        return { startDate, endDate };
      }
    } catch (error) {
      console.error("Error parsing dates:", error);
    }
    return null;
  }, [selectedStartTime, selectedEndTime]);

  const overlapsQuery = useOverlaps(
    overlapsDates 
      ? {
          type: bookingType,
          floor: floor,
          cso: cso,
          starts_at: overlapsDates.startDate,
          ends_at: overlapsDates.endDate,
          enabled: true
        }
      : {
          type: bookingType,
          floor: floor,
          cso: cso,
          starts_at: new Date(),
          ends_at: new Date(Date.now() + 3600000),
          enabled: false
        }
  );

  const displayData = useMemo(() => {
    if (overlapsDates && overlapsQuery.data) {
      return overlapsQuery.data;
    }
    return slotsQuery.data;
  }, [slotsQuery.data, overlapsQuery.data, overlapsDates]);

  const isLoading = slotsQuery.isPending || (overlapsDates && overlapsQuery.isPending);
  const hasError = slotsQuery.error || (overlapsDates && overlapsQuery.error);

  const bookingData = useMemo(() => {
    if (!selectedStartTime || !selectedEndTime || selectedPlaces.size === 0) return null;
    
    const slotIds: string[] = [];
    displayData?.forEach(row => {
      row.forEach(slot => {
        if (selectedPlaces.has(slot.place)) {
          if (slot.id) {
            slotIds.push(slot.id);
          }
        }
      });
    });
    
    return {
      type: bookingType,
      floor: floor,
      cso: cso,
      starts_at: selectedStartTime,
      ends_at: selectedEndTime,
      slot_ids: slotIds,
      selected_places: Array.from(selectedPlaces).map(String),
    };
  }, [selectedStartTime, selectedEndTime, selectedPlaces, displayData, bookingType, floor, cso]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner/>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--error)' }}>
          Ошибка при загрузке слотов
        </div>
      </div>
    );
  }

  if (!displayData || displayData.length === 0) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Нет доступных слотов
        </div>
        <div className={styles.containerButton}>
          <Button
            text="Забронировать"
            onClick={console.log}
            backgroundColor="var(--attention)"
            width="150px"
            height="40px"
            borderRadius="5px"
            fontSize="16px"
          />
        </div>
      </div>
    );
  }

  const cols = displayData[0]?.length || 1;

  return (
    <div className={styles.container} >
      <div className={styles.containerGrid} style={{ ["--cols" as any]: cols }}>
        {displayData.map((row, rowIndex) => 
          row.map((place) => (
            <BookingSlot
              key={`${rowIndex}-${place.place}`}
              isEnter={false}
              place={place.place}
              isSelected={isSelected(place.place)}
              isDisabled={!place.isAvailable}
              onClick={() => handleToggle(place.place)}
            />
          ))
        )}
      </div>
      <div className={styles.containerButton}>
          <CreateButton
            bookingData={bookingData}
            disabled={selectedPlaces.size === 0 || !selectedStartTime || !selectedEndTime}
          />
      </div>
    </div>
  );
});