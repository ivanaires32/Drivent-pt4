import { notFoundError } from "../../errors"
import { forBiddenBooking } from "../../errors/for-bidden"
import { bookingRepository } from "../../repositories/booking-repository.ts"
import hotelRepository from "../../repositories/hotel-repository"
import ticketsRepository from "../../repositories/tickets-repository"


async function getBooking(userId: number) {
    const booking = await bookingRepository.getBooking(userId)
    if (!booking) throw notFoundError()
    return booking
}

async function postBooking(userId: number, roomId: number) {
    const room = await hotelRepository.findCapacityRoom(roomId)
    if (!room) throw notFoundError()
    const ticket = await ticketsRepository.findTicketByUserId(userId)
    if (!ticket ||
        ticket.TicketType.isRemote === true ||
        ticket.TicketType.includesHotel === false ||
        ticket.status !== "PAID" ||
        room.Booking.length >= room.capacity) throw forBiddenBooking()

    const booking = await bookingRepository.postBooking(userId, roomId)
    return booking
}

async function roomChange(userId: number, roomId: number, bookingId: number) {
    const booking = await bookingRepository.getBooking(userId)
    if (!booking) throw forBiddenBooking()
    const room = await hotelRepository.findCapacityRoom(roomId)
    if (!room) throw notFoundError()
    if (room.Booking.length >= room.capacity) throw forBiddenBooking()
    const result = await bookingRepository.roomChange(bookingId, roomId)
    return result
}

export const bookingService = {
    getBooking,
    postBooking,
    roomChange
}