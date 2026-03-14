// Extract nested parents and put them to the root level, this improves response structure
export const formatResponse = {
  row(data) {
    const { hall, ...rowData } = data;
    const { cinema, ...hallData } = hall;
    return { ...rowData, hall: hallData, cinema };
  },

  seat(data) {
    const { row, ...seatData } = data;
    const { hall, ...rowData } = row;
    const { cinema, ...hallData } = hall;
    return { ...seatData, row: rowData, hall: hallData, cinema };
  },

  reservation(data) {
    const { showtime, seat, id, status } = data;
    const { movie, cinema, hall, ...showtimeData } = showtime;
    const { row, ...seatData } = seat ?? {}; // Seat is null when status is waitlist
    return {
      id,
      status,
      showtime: { ...showtimeData, movie, cinema, hall },
      ...(seat && { seat: { ...seatData, row } }),
    };
  },
};
