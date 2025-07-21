import { Booking } from "../../domain/entities/booking";
import { BookingService } from "../../application/services/booking_service";
import { PropertyService } from "../../application/services/property_service";
import { UserService } from "../../application/services/user_service";
import { CreateBookingDTO } from "../dtos/create_booking_dto";
import { FakeBookingRepository } from "../../infrastructure/repositories/fake_booking_repository";
import { DateRangeFactory } from "../factories/date_range_factory";

jest.mock('./property_service');
jest.mock('./user_service');

describe('BookingService', () => {
    let bookingService: BookingService;
    let fakeBookingRepository: FakeBookingRepository;
    let mockPropertyService: jest.Mocked<PropertyService>
    let mockUserService: jest.Mocked<UserService>
    let mockDateRangeFactory: jest.Mocked<DateRangeFactory>

    beforeEach(() => {
        const mockPropertyRepository = {} as any;
        const mockUserRepository = {} as any;
        const startDate = new Date('2024-12-20');
        const endDate = new Date('2024-12-25');

        mockPropertyService = new PropertyService(
            mockPropertyRepository
        ) as jest.Mocked<PropertyService>;

        mockUserService = new UserService(
            mockUserRepository
        ) as jest.Mocked<UserService>;

        fakeBookingRepository = new FakeBookingRepository();

        mockDateRangeFactory = {
            create: jest.fn().mockReturnValue({
                getStartDate: jest.fn().mockReturnValue(startDate),
                getEndDate: jest.fn().mockReturnValue(endDate),
            }),
        } as jest.Mocked<DateRangeFactory>;

        bookingService = new BookingService(
            fakeBookingRepository,
            mockPropertyService,
            mockUserService,
            mockDateRangeFactory
        );
    });

    it('should create a booking using fake repository', async () => {
        const mockProperty = {
            getId: jest.fn().mockReturnValue('1'),
            isAvailable: jest.fn().mockReturnValue(true),
            validateGuestCount: jest.fn(),
            calculateTotalPrice: jest.fn().mockReturnValue(500),
            addBooking: jest.fn(),
        } as any;

        const mockUser = {
            getId: jest.fn().mockReturnValue('1'),
        } as any;

        mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
        mockUserService.findUserById.mockResolvedValue(mockUser);

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
    it('should throw an error when the property is not found', async () => {
        mockPropertyService.findPropertyById.mockResolvedValue(null);

        const bookingDTO: CreateBookingDTO = {
            propertyId: '1',
            guestId: '1',
            startDate: new Date('2024-12-20'),
            endDate: new Date('2024-12-25'),
            guestCount: 2,
        };

        await expect(bookingService.createBooking(bookingDTO)).rejects.toThrow('Property not found');
    });
    it('should throw an error when the user is not found', async () => {
        const mockProperty = {
            getId: jest.fn().mockReturnValue('1'),
        } as any;

        mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
        mockUserService.findUserById.mockResolvedValue(null);

        const bookingDTO: CreateBookingDTO = {
            propertyId: '1',
            guestId: '1',
            startDate: new Date('2024-12-20'),
            endDate: new Date('2024-12-25'),
            guestCount: 2,
        };

        await expect(bookingService.createBooking(bookingDTO)).rejects.toThrow('User not found');
    });
    it('should throw an error while trying booking in a date range already booked', async () => {
        const mockProperty = {
            getId: jest.fn().mockReturnValue('1'),
            isAvailable: jest.fn().mockReturnValue(true),
            validateGuestCount: jest.fn(),
            calculateTotalPrice: jest.fn().mockReturnValue(500),
            addBooking: jest.fn(),
        } as any;

        const mockUser = {
            getId: jest.fn().mockReturnValue('1'),
        } as any;

        mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
        mockUserService.findUserById.mockResolvedValue(mockUser);

        const bookingDTO: CreateBookingDTO = {
            propertyId: '1',
            guestId: '1',
            startDate: new Date('2024-12-20'),
            endDate: new Date('2024-12-25'),
            guestCount: 2,
        };

        const result = await bookingService.createBooking(bookingDTO);

        mockProperty.isAvailable.mockReturnValue(false);
        mockProperty.addBooking.mockImplementationOnce(() => {
            throw new Error('The property is unavailable in the date range requested');
        });

        await expect(bookingService.createBooking(bookingDTO)).rejects
            .toThrow('The property is unavailable in the date range requested');
    });
    it('should cancel an existing booking using a fake repository', async () => {
        const mockProperty = {
            getId: jest.fn().mockReturnValue('1'),
            isAvailable: jest.fn().mockReturnValue(true),
            validateGuestCount: jest.fn(),
            calculateTotalPrice: jest.fn().mockReturnValue(500),
            addBooking: jest.fn(),
        } as any;

        const mockUser = {
            getId: jest.fn().mockReturnValue('1'),
        } as any;

        mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
        mockUserService.findUserById.mockResolvedValue(mockUser);

        const bookingDTO: CreateBookingDTO = {
            propertyId: '1',
            guestId: '1',
            startDate: new Date('2024-12-20'),
            endDate: new Date('2024-12-25'),
            guestCount: 2,
        };

        const booking = await bookingService.createBooking(bookingDTO);

        const spyFindById = jest.spyOn(fakeBookingRepository, 'findById');

        await bookingService.cancelBooking(booking.getId());

        const canceledBooking = await fakeBookingRepository.findById(
            booking.getId()
        );

        expect(canceledBooking?.getStatus()).toBe('CANCELLED');
        expect(spyFindById).toHaveBeenCalledWith(booking.getId());
        expect(spyFindById).toHaveBeenCalledTimes(2);
        spyFindById.mockRestore();
    });
});