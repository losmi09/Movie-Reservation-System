import { checkIfRecordExists } from '../repositories/utils/checkIfRecordExists.js';
import { BusinessLogicError } from '../utils/BusinessLogicError.js';
import * as showtimeRepository from '../repositories/showtimeRepository.js';
import * as redisService from '../services/redisService.js';
import * as cinemaService from '../services/cinemaService.js';
import * as hallService from '../services/hallService.js';

export const getShowtime = (showtimeId, fields) =>
  showtimeRepository.getShowtime(showtimeId, fields);

export const getSeatStatus = async (showtimeId, hallId, seatId) => {
  const { isSeatReserved, areAllSeatsReserved } =
    await showtimeRepository.getSeatStatus(showtimeId, hallId, seatId);

  return { isSeatReserved, areAllSeatsReserved };
};

const invalidateShowtimeCache = () => redisService.invalidateCache('showtime');

const checkIfShowtimeIsOngoing = async (
  errorClass,
  cinemaId,
  hallId,
  startTime,
  endTime,
) => {
  // Verify that hall does not have an active showtime in the given time range
  const isShowtimeOngoing = await showtimeRepository.isShowtimeOngoing(
    cinemaId,
    hallId,
    startTime,
    endTime,
  );

  if (isShowtimeOngoing)
    errorClass.pushError(
      'startTime',
      'Hall already has an active showtime in the given time range',
    );
};

export const createShowtime = async data => {
  const { movieId, cinemaId, hallId, startTime, endTime } = data;

  // Verify that every showtime reference exists
  const [movieExists, cinema, hall] = await Promise.all([
    checkIfRecordExists('movie', movieId),
    cinemaService.getCinema(cinemaId, { id: true }),
    hallService.getHall(hallId, { cinemaId: true }),
  ]);

  const errorClass = new BusinessLogicError();

  if (!movieExists)
    errorClass.pushError('movieId', 'No movie found with this ID');

  if (!cinema) errorClass.pushError('cinemaId', 'No cinema found with this ID');

  if (!hall) errorClass.pushError('hallId', 'No hall found with this ID');

  // Verify that hall with provided ID belongs to cinema with provided ID
  if (cinema && hall && hall.cinemaId !== cinema.id)
    errorClass.pushError(
      'hallId',
      'Hall with this ID does not belong to this cinema',
    );

  await checkIfShowtimeIsOngoing(
    errorClass,
    cinemaId,
    hallId,
    startTime,
    endTime,
  );

  errorClass.throwIfNotEmpty();

  await invalidateShowtimeCache();

  return await showtimeRepository.createShowtime(data);
};

export const updateShowtime = async (showtimeId, data) => {
  const { startTime, endTime } = data;

  const showtime = await showtimeRepository.getShowtime(showtimeId, {
    cinemaId: true,
    hallId: true,
  });

  if (!showtime)
    throw new BusinessLogicError(
      'showtimeId',
      'No showtime found with this ID',
    );

  const errorClass = new BusinessLogicError();

  if (startTime && endTime) {
    await checkIfShowtimeIsOngoing(
      errorClass,
      showtime.cinemaId,
      showtime.hallId,
      startTime,
      endTime,
    );
  }

  errorClass.throwIfNotEmpty();

  await invalidateShowtimeCache();

  return showtimeRepository.updateShowtime(showtimeId, data);
};
