import { notFoundError } from "../../errors"
import { bookingRepository } from "../../repositories/booking-repository.ts"


async function getBooking(userId: number) {
    const booking = await bookingRepository.getBooking(userId)
    if (!booking) throw notFoundError()
    return booking
}

async function postBooking(userId: number, roomId: number) {
    const booking = await bookingRepository.postBooking(userId, roomId)
    return booking
}

export const bookingService = {
    getBooking,
    postBooking
}