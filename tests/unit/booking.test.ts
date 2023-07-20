import ticketsRepository from "@/repositories/tickets-repository"
import { bookingService } from "@/services/booking-service"
import { bookingRepository } from "@/repositories/booking-repository.ts"
import faker from "@faker-js/faker"
import { Ticket, TicketType } from "@prisma/client"
import hotelRepository from "@/repositories/hotel-repository"
import enrollmentRepository from "@/repositories/enrollment-repository"


beforeEach(() => {
    jest.clearAllMocks()
})

describe("GET /booking error cases", () => {
    it("should return 404 when booking not found", async () => {
        const user = faker.datatype.number({ min: 1, max: 100 })
        const bookingMocks = jest.spyOn(bookingRepository, "getBooking").mockImplementationOnce((): any => {
            return undefined
        })

        const result = bookingService.getBooking(user)
        expect(bookingMocks).toBeCalledTimes(1);
        expect(result).rejects.toEqual({
            name: "NotFoundError",
            message: "No result for this search!"
        })
    })
})

describe("POST /booking errors cases", () => {
    it("should return 404 if the room does not exist", async () => {
        const roomMock = jest.spyOn(hotelRepository, "findCapacityRoom").mockImplementationOnce((): any => {
            return undefined
        })

        const result = bookingService.postBooking(1, 1)
        expect(roomMock).toBeCalledTimes(1)
        expect(result).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!',
        })
    })

    it("should return 403 when event is remote", () => {
        jest.spyOn(hotelRepository, "findCapacityRoom").mockImplementationOnce((): any => {
            return true
        })

        const ticketMock = jest.spyOn(ticketsRepository, "findTicketByUserId")
        ticketMock.mockImplementationOnce((): any => {
            return {
                status: "PAID",
                TicketType: {
                    includesHotel: true,
                    isRemote: true
                }
            }
        })

        const result = bookingService.postBooking(1, 1)
        expect(result).rejects.toEqual({
            name: 'ForBiddenBooking',
            message: 'You cannot make reservations',
        })
    })
    it("should return 403 when event has no hotel", () => {
        jest.spyOn(hotelRepository, "findCapacityRoom").mockImplementationOnce((): any => {
            return true
        })

        const ticketMock = jest.spyOn(ticketsRepository, "findTicketByUserId")
        ticketMock.mockImplementationOnce((): any => {
            return {
                status: "PAID",
                TicketType: {
                    includesHotel: false,
                    isRemote: false
                }
            }
        })

        const result = bookingService.postBooking(1, 1)
        expect(result).rejects.toEqual({
            name: 'ForBiddenBooking',
            message: 'You cannot make reservations',
        })
    })
    it("Returns status 403 if the user's ticket has not been paid", () => {
        jest.spyOn(hotelRepository, "findCapacityRoom").mockImplementationOnce((): any => {
            return true
        })

        const ticketMock = jest.spyOn(ticketsRepository, "findTicketByUserId")
        ticketMock.mockImplementationOnce((): any => {
            return {
                status: "RESERVED",
                TicketType: {
                    includesHotel: true,
                    isRemote: false
                }
            }
        })

        const result = bookingService.postBooking(1, 1)
        expect(result).rejects.toEqual({
            name: 'ForBiddenBooking',
            message: 'You cannot make reservations',
        })
    })

    it("should return 403 when room is full", () => {
        jest.spyOn(hotelRepository, "findCapacityRoom").mockImplementationOnce((): any => {
            return {
                capacity: 3,
                Booking: [1, 2, 3, 4]
            }
        })

        const ticketMock = jest.spyOn(ticketsRepository, "findTicketByUserId")
        ticketMock.mockImplementationOnce((): any => {
            return {
                status: "PAID",
                TicketType: {
                    includesHotel: true,
                    isRemote: false
                }
            }
        })

        const result = bookingService.postBooking(1, 1)
        expect(result).rejects.toEqual({
            name: 'ForBiddenBooking',
            message: 'You cannot make reservations',
        })
    })

})