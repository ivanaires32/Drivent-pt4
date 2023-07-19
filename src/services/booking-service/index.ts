import { notFoundError } from "../../errors"
import { forBiddenBooking } from "../../errors/for-bidden"
import { bookingRepository } from "../../repositories/booking-repository.ts"
import enrollmentRepository from "../../repositories/enrollment-repository"
import ticketsRepository from "../../repositories/tickets-repository"

async function getBooking(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)
    if (!enrollment) throw forBiddenBooking()
    const ticket = await ticketsRepository.findTickeWithTypeById(enrollment.id)
    if (!ticket || ticket.status !== "PAID" || ticket.TicketType.includesHotel !== true) throw forBiddenBooking()
    const booking = await bookingRepository.getBooking(userId)
    if (!booking) throw notFoundError()
    return booking
}

async function postBooking(userId: number, roomId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)
    if (!enrollment) throw forBiddenBooking()
    const ticket = await ticketsRepository.findTickeWithTypeById(enrollment.id)
    if (!ticket || ticket.status !== "PAID" || ticket.TicketType.includesHotel !== true) throw forBiddenBooking()
    const booking = await bookingRepository.postBooking(userId, roomId)
    return booking
}

export const bookingService = {
    getBooking,
    postBooking
}