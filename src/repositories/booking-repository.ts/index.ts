import { prisma } from "@/config";

function getBooking(userId: number) {
    return prisma.booking.findFirst({
        where: {
            userId
        }, include: {
            Room: true
        }
    })
}

function postBooking(userId: number, roomId: number) {
    return prisma.booking.create({
        data: {
            roomId,
            userId
        }
    })
}

export const bookingRepository = {
    getBooking,
    postBooking
}