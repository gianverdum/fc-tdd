import { CreateBookingDTO } from "../../application/dtos/create_booking_dto";
import { BookingService } from "../../application/services/booking_service";
import { Request, Response } from "express";

export class BookingController {
    private bookingService: BookingService;

    constructor(bookingService: BookingService) {
        this.bookingService = bookingService;
    }

    async createBooking(req: Request, res: Response): Promise<Response> {
        try {
            const startDate = new Date(req.body.startDate);
            const endDate = new Date(req.body.endDate);

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return res.status(400).json({ error: 'Invalid start/end date format'});
            }

            const dto: CreateBookingDTO = {
                propertyId: req.body.propertyId,
                guestId: req.body.userId,
                startDate: startDate,
                endDate: endDate,
                guestCount: req.body.guestCount,
            }

            const booking = await this.bookingService.createBooking(dto);

            return res.status(201).json({
                message: 'Booking created successfully',
                booking: {
                    id: booking.getId(),
                    propertyId: booking.getProperty().getId(),
                    guestId: booking.getGuest().getId(),
                    startDate: booking.getDateRange().getStartDate(),
                    endDate: booking.getDateRange().getEndDate(),
                    guestCount: booking.getGuestCount(),
                    totalPrice: booking.getTotalPrice(),
                    status: booking.getStatus(),
                }
            });
        } catch (error: any) {
            return res.status(400).json({ error: error.message || 'An unexpected error occurred' });
        }
    }
}