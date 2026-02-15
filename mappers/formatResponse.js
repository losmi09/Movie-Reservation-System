// Extract nested parents and put them to the root level, this improves response structure
const formatResponse = {
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
    const { showtime, seat, ...reservationData } = data;
    const { movie, cinema, hall, ...showtimeData } = showtime;
    const { row, ...seatData } = seat;
    return {
      ...reservationData,
      showtime: showtimeData,
      seat: seatData,
      row,
      movie,
      cinema,
      hall,
    };
  },
};

export default formatResponse;
