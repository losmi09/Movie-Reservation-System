import * as rowRepository from '../repositories/rowRepository.js';
import * as seatService from '../services/seatService.js';

export const isRowFullOfSeats = async rowId => {
  const [{ seatCapacity }, seatsInRow] = await Promise.all([
    rowRepository.getSeatCapacity(rowId),
    seatService.countSeatsInRow(rowId),
  ]);

  return seatCapacity <= seatsInRow;
};

export const getRowsInHall = async hallId =>
  await rowRepository.getRowsInHall(hallId);
