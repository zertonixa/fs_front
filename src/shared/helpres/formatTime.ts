export const formatDateMSK = (iso: string) => {
  return new Date(iso).toLocaleString("ru-RU", {
    timeZone: "Europe/Moscow",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const splitDateTime = (iso: string) => {
  const date = new Date(iso);

  return {
    day: date.toISOString().slice(0, 10),
    time: date.toISOString().slice(11, 16),
    date
  };
};