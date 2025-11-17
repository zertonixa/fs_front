import { useSearchParams } from "react-router-dom";

export function useBookingParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const togglePlace = (place: number) => {
    const placeStr = String(place);

    setSearchParams((prev) => {
      const sp = new URLSearchParams(prev);

      const raw = sp.get("places");
      const list = raw ? raw.split(",").filter(Boolean) : [];

      const exists = list.includes(placeStr);

      let next: string[];

      if (exists) {
        next = list.filter((p) => p !== placeStr);
      } else {
        if (list.length >= 6) return sp;
        next = [...list, placeStr];
      }

      if (next.length === 0) sp.delete("places");
      else sp.set("places", next.join(","));

      return sp;
    });
  };

  const selectedPlaces = (() => {
    const raw = searchParams.get("places");
    return raw ? raw.split(",").filter(Boolean) : [];
  })();

  return {
    selectedPlaces,
    togglePlace,
  };
}
