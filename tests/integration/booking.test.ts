import supertest from "supertest";
import app, { init } from "@/app";
import httpStatus from "http-status";
import faker from "@faker-js/faker";
import { createEnrollmentWithAddress, createHotel, createRoomWithHotelId, createTicket, createTicketTypeWithHotel, createUser } from "../factories";
import * as jwt from "jsonwebtoken"
import { cleanDb, generateValidToken } from "../helpers";
import { TicketStatus } from "@prisma/client";
import { createBooking, findBooking } from "../factories/booking-factory";

const server = supertest(app)

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb()
})

describe('GET /booking', () => {
    it('should respond with status 401 if no token is given', async () => {
        const result = await server.get("/booking")

        expect(result.status).toBe(httpStatus.UNAUTHORIZED)
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word()

        const result = await server.get("/booking").set("Authorization", `Bearer ${token}`)

        expect(result.status).toBe(httpStatus.UNAUTHORIZED)
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const user = await createUser()
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET)

        const result = await server.get("/booking").set("Authorization", `Bearer ${token}`)
        expect(result.status).toBe(httpStatus.UNAUTHORIZED)
    });

})

describe("token is valid", () => {
    it("should return 200 to fetch reservations", async () => {
        const user = await createUser()
        const token = await generateValidToken(user)
        const hotel = await createHotel()
        const room = await createRoomWithHotelId(hotel.id)
        await createBooking(user.id, room.id)
        const booking = await findBooking(user.id)

        const result = await server.get("/booking").set("Authorization", `Bearer ${token}`)
        expect(result.status).toBe(httpStatus.OK)
        expect(result.body).toEqual({
            id: booking.id,
            Room: {
                id: expect.any(Number),
                capacity: expect.any(Number),
                hotelId: expect.any(Number),
                name: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String)
            }
        })
    })
})

describe('POST /booking', () => {
    it('should respond with status 401 if no token is given', async () => {
        const result = await server.post("/booking")

        expect(result.status).toBe(httpStatus.UNAUTHORIZED)
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word()

        const result = await server.post("/booking").set("Authorization", `Bearer ${token}`)

        expect(result.status).toBe(httpStatus.UNAUTHORIZED)
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const user = await createUser()
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET)

        const result = await server.post("/booking").set("Authorization", `Bearer ${token}`)
        expect(result.status).toBe(httpStatus.UNAUTHORIZED)
    });

})

describe("token is valid", () => {
    it("should return 200 to create reservations", async () => {
        const user = await createUser()
        const token = await generateValidToken(user)
        const enrollment = await createEnrollmentWithAddress(user)
        const ticketType = await createTicketTypeWithHotel()
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
        const hotel = await createHotel()
        const room = await createRoomWithHotelId(hotel.id)

        const body = { roomId: room.id }

        const result = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body)

        expect(result.status).toBe(httpStatus.OK)
        expect(result.body).toEqual({
            bookingId: expect.any(Number)
        })
    })
})