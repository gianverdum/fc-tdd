import { Booking } from "../../domain/entities/booking";
import { BookingService } from "../../application/services/booking_service";
import { PropertyService } from "../../application/services/property_service";
import { UserService } from "../../application/services/user_service";
import { CreateBookingDTO } from "../dtos/create_booking_dto";
import { FakeBookingRepository } from "../../infrastructure/repositories/fake_booking_repository";

jest.mock('./property_service');
jest.mock('./user_service');

describe('BookingService', () => {
    let bookingService: BookingService;
    let fakeBookingRepository: FakeBookingRepository;
    let mockPropertyService: jest.Mocked<PropertyService>
    let mockUserService: jest.Mocked<UserService>

    beforeEach(() => {
        const mockPropertyRepository = {} as any;
        const mockUserRepository = {} as any;

        mockPropertyService = new PropertyService(
            mockPropertyRepository
        ) as jest.Mocked<PropertyService>;

        mockUserService = new UserService(
            mockUserRepository
        ) as jest.Mocked<UserService>;

        bookingService = new BookingService(
            fakeBookingRepository,
            mockPropertyService,
            mockUserService
        );

        fakeBookingRepository = new FakeBookingRepository();
    });

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