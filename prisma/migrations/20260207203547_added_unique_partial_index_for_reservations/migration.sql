CREATE UNIQUE INDEX unique_reserved_seat_per_showtime
ON reservations (showtime_id, seat_id)
WHERE status = 'reserved'