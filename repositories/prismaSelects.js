const movieSelect = {
  select: { id: true, title: true, posterImage: true, slug: true },
};

const cinemaSelect = {
  select: { id: true, name: true, address: true, slug: true },
};

const hallSelect = { select: { id: true, name: true } };

const hallWithCinemaSelect = {
  select: {
    id: true,
    name: true,
    cinema: cinemaSelect,
  },
};

const showtimeSelect = {
  id: true,
  startTime: true,
  endTime: true,
  language: true,
  movie: movieSelect,
  cinema: cinemaSelect,
  hall: hallSelect,
};

const selectParents = {
  cinema() {
    return {
      id: true,
      name: true,
      city: true,
      address: true,
      phone: true,
      email: true,
      slug: true,
    };
  },

  showtime() {
    return showtimeSelect;
  },

  hall() {
    return {
      id: true,
      name: true,
      maxRows: true,
      cinema: cinemaSelect,
    };
  },

  row() {
    return {
      id: true,
      label: true,
      seatCapacity: true,
      hall: hallWithCinemaSelect,
    };
  },

  seat() {
    return {
      id: true,
      number: true,
      row: {
        select: {
          id: true,
          label: true,
          hall: hallWithCinemaSelect,
        },
      },
    };
  },

  reservation() {
    return {
      id: true,
      status: true,
      showtime: { select: showtimeSelect },
      seat: {
        select: {
          id: true,
          number: true,
          row: { select: { id: true, label: true } },
        },
      },
    };
  },
};

export default selectParents;
