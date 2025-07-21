import { Booking } from "../../domain/entities/booking";
import { CreateBookingDTO } from "../dtos/create_booking_dto";
describe('BookingService', () => {
    it('should create a booking using fake repository', () => {
        const bookingDTO: CreateBookingDTO = {
            propertyId: '1',
            guestId: '1',
            startDate: new Date('2024-12-20'),
            endDate: new Date('2024-12-25'),
            guestCount: 2,
        };

        const result = await bookingService.createBooking(bookingDTO);

        expect(result).toBeInstanceOf(Booking);
        expect(result.getStatus()).toBe('CONFIRMED');
        expect(result.getTotalPrice()).toBe(500);

        const savedBooking = await fakeBookingRepository.findById(result.getId());
        expect(savedBooking).not.toBeNull();
        expect(savedBooking?.getId()).toBe(result.getId());
    });
});