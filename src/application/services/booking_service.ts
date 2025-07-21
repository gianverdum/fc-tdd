import { Booking } from "../../domain/entities/booking";
import { CreateBookingDTO } from "../dtos/create_booking_dto";

export class BookingService {
    
    async createBooking(dto: CreateBookingDTO): Promise<Booking> {}
}