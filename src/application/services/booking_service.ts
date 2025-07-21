import { Booking } from "../../domain/entities/booking";
import { BookingRepository } from "../../domain/repositories/booking_repository";
import { CreateBookingDTO } from "../dtos/create_booking_dto";
import { DateRangeFactory } from "../factories/date_range_factory";
import { PropertyService } from "./property_service";
import { UserService } from "./user_service";
import { v4 as uuidv4 } from "uuid";

export class BookingService {
    constructor(
        private readonly bookingRepository: BookingRepository,
        private readonly propertyService: PropertyService,
        private readonly userService: UserService,
        private readonly dateRangeFactory: DateRangeFactory
    ) {}
    async createBooking(dto: CreateBookingDTO): Promise<Booking> {
        const property = await this.propertyService.findPropertyById(dto.propertyId);
        if (!property) {
            throw new Error('Property not found');
        }
        const guest = await this.userService.findUserById(dto.guestId);
        if (!guest) {
            throw new Error('User not found');
        }
        const dateRange = this.dateRangeFactory.create(dto.startDate, dto.endDate);

        const booking = new Booking(
            uuidv4(),
            property,
            guest,
            dateRange,
            dto.guestCount
        );

        await this.bookingRepository.save(booking);

        return booking;
    }
}