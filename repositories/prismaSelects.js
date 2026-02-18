const BASE_MOVIE = { id: true, title: true, posterImage: true, slug: true };

const BASE_CINEMA = { id: true, name: true, address: true, slug: true };

const BASE_HALL = { id: true, name: true };

const BASE_ROW = { id: true, label: true };

const BASE_SEAT = { id: true, number: true };

const hallWithCinemaSelect = {
  select: { ...BASE_HALL, cinema: { select: BASE_CINEMA } },
};

const showtimeSelect = {
  id: true,
  price: true,
  startTime: true,
  endTime: true,
  language: true,
  movie: { select: BASE_MOVIE },
  cinema: { select: BASE_CINEMA },
  hall: { select: BASE_HALL },
};

const MOVIE_MINIMAL_SELECT = { id: true, title: true };

const CINEMA_MINIMAL_SELECT = { id: true, name: true };

// Used when fields are specified in request query string
export const selectForQueryFields = {
  showtime: () => ({
    id: true,
    startTime: true,
    price: true,
    movie: { select: MOVIE_MINIMAL_SELECT },
    cinema: { select: CINEMA_MINIMAL_SELECT },
    hall: { select: BASE_HALL },
  }),
  movie: () => MOVIE_MINIMAL_SELECT,
  cinema: () => CINEMA_MINIMAL_SELECT,
  hall: () => BASE_HALL,
  user: () => ({ id: true, firstName: true, lastName: true, photo: true }),
};

// Used when getting an array of documents, selects most important fields only
export const selectForManyDocs = {
  showtime: () => ({
    id: true,
    startTime: true,
    endTime: true,
    language: true,
    price: true,
    movie: { select: MOVIE_MINIMAL_SELECT },
    cinema: { select: CINEMA_MINIMAL_SELECT },
    hall: { select: BASE_HALL },
  }),

  cinema: () => ({
    ...BASE_CINEMA,
    city: true,
    phone: true,
    email: true,
  }),

  hall: () => ({
    ...BASE_HALL,
    maxRows: true,
  }),

  row: () => ({
    ...BASE_ROW,
    seatCapacity: true,
  }),

  seat: () => BASE_SEAT,

  reservation: () => ({
    id: true,
    status: true,
    showtime: { select: selectForQueryFields.showtime() },
    seat: { select: BASE_SEAT },
  }),
};

// Used for getting a single document
export const selectSingleDoc = {
  cinema: () => ({
    ...BASE_CINEMA,
    city: true,
    phone: true,
    email: true,
  }),

  showtime: () => showtimeSelect,

  hall: () => ({
    ...BASE_HALL,
    maxRows: true,
    cinema: { select: BASE_CINEMA },
  }),

  row: () => ({
    ...BASE_ROW,
    seatCapacity: true,
    hall: hallWithCinemaSelect,
  }),

  seat: () => ({
    ...BASE_SEAT,
    row: {
      select: {
        ...BASE_ROW,
        hall: hallWithCinemaSelect,
      },
    },
  }),

  reservation: () => ({
    id: true,
    status: true,
    showtime: { select: showtimeSelect },
    seat: {
      select: { id: true, number: true, row: { select: BASE_ROW } },
    },
  }),
};
