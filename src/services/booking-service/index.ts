import { notFoundError } from "../../errors"
import { forBiddenBooking } from "../../errors/for-bidden"
import { bookingRepository } from "../../repositories/booking-repository.ts"
import enrollmentRepository from "../../repositories/enrollment-repository"
import hotelRepository from "../../repositories/hotel-repository"
import ticketsRepository from "../../repositories/tickets-repository"


async function getBooking(userId: number) {
    const booking = await bookingRepository.getBooking(userId)
    if (!booking) throw notFoundError()
    return booking
}

async function postBooking(userId: number, roomId: number) {
    const room = await hotelRepository.findRoomById(roomId)
    if (!room) throw notFoundError()
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id)
    if (ticket.TicketType.isRemote === true ||
        ticket.TicketType.includesHotel === false ||
        ticket.status !== "PAID" ||
        room.Booking.length >= room.capacity) throw forBiddenBooking()

    const booking = await bookingRepository.postBooking(userId, roomId)
    return booking
}

export const bookingService = {
    getBooking,
    postBooking
}