import { TSeat, TSeatType } from "../types";

export function calculateSeatsHumanPosition(allSeats: TSeat[], seatsToSelect: TSeat[]) {
  return allSeats
    .filter(
      (seat) =>
        ![TSeatType.DISABLED, TSeatType.VOID].includes(
          seat.type
        )
    )
    .map((seat, index) => ({ ...seat, column: index+1 }))
    .filter((seatGlobal) => seatsToSelect.map((seatToSelect) => seatToSelect.id).includes(seatGlobal.id));
}
