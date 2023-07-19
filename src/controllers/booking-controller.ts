import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares";
import { bookingService } from "../services/booking-service";
import httpStatus from "http-status";

async function getBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req
    try {
        const booking = await bookingService.getBooking(Number(userId))
        res.status(httpStatus.OK).send({
            bookingId: booking.id,
            Room: booking.Room
        })
    } catch (err) {
        if (err.name === 'ForBiddenBooking') {
            return res.status(httpStatus.FORBIDDEN).send(err.message)
        }
        if (err.name === 'NotFoundError') {
            return res.status(httpStatus.NOT_FOUND).send(err.message)
        }
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message)
    }
}

async function postBooking(req: AuthenticatedRequest, res: Response) {
    const roomId = parseInt(req.body.roomId)
    const { userId } = req
    try {
        if (isNaN(roomId) || roomId === 0) return res.sendStatus(httpStatus.FORBIDDEN)
        const result = await bookingService.postBooking(userId, roomId)
        res.status(httpStatus.OK).send({ bookingId: result.id })
    } catch (err) {
        if (err.name === 'NotFoundError') {
            return res.status(httpStatus.NOT_FOUND).send(err.message)
        }
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message)
    }
}

export const bookingControllers = {
    getBooking,
    postBooking
}