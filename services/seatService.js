import * as seatRepository from '../repositories/seatRepository.js';

export const countSeatsInRow = async rowId =>
  await seatRepository.countSeatsInRow(rowId);

export const countSeatsInHall = async rowIds =>
  await seatRepository.countSeatsInHall(rowIds);
