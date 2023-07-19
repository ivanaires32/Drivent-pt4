import { Router } from "express";
import { authenticateToken } from "../middlewares";
import { bookingControllers } from "../controllers/booking-controller";

const bookingRouter = Router()

bookingRouter
    .all("/*", authenticateToken)
    .get("/", bookingControllers.getBooking)
    .post("/", bookingControllers.postBooking)


export { bookingRouter }