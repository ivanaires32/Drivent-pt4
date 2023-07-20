import { Router } from "express";
import { authenticateToken, validateBody } from "../middlewares";
import { bookingControllers } from "../controllers/booking-controller";
import { bookingSchema } from "../schemas/booking-schema";

const bookingRouter = Router()

bookingRouter
    .all("/*", authenticateToken)
    .get("/", bookingControllers.getBooking)
    .post("/", validateBody(bookingSchema), bookingControllers.postBooking)
    .put("/:bookingId", validateBody(bookingSchema), bookingControllers.roomChange)
//middlewres schemas

export { bookingRouter }