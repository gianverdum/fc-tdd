import { DataSource } from "typeorm";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { UserEntity } from "../persistence/entities/user_entity";
import { User } from "../../domain/entities/user";
import { DateRange } from "../../domain/value_objects/date_range";
import { Property } from "../../domain/entities/property";
import { Booking } from "../../domain/entities/booking";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { TypeORMBookingRepository } from "./typeorm_booking_repository";
describe('TypeORMBookingRepository', () => {
    let dataSource: DataSource;
    let bookingRepository: TypeORMBookingRepository;

    beforeAll(async () => {
        dataSource = new DataSource({
            type: 'sqlite',
            database: ':memory:',
            dropSchema: true,
            logging: false,
            synchronize: true,
            entities: [UserEntity, PropertyEntity, BookingEntity],
        });
        await dataSource.initialize();
        bookingRepository = new TypeORMBookingRepository(
            dataSource.getRepository(BookingEntity)   
        );
    });

    afterAll(async () => {
        await dataSource.destroy();
    });

    it('should save a booking', async () => {
        const propertyRepository = dataSource.getRepository(PropertyEntity);
        const userRepository = dataSource.getRepository(UserEntity);
        const propertyEntity = propertyRepository.create({
            id: '1',
            name: 'Casa na praia',
            description: 'Uma linda casa na praia com vista para o mar.',
            maxGuests: 6,
            basePricePerNight: 200,
        });
        await propertyRepository.save(propertyEntity);

        const property = new Property(
            '1',
            'Casa na praia',
            'Uma linda casa na praia com vista para o mar.',
            6,
            200
        );

        const userEntity = userRepository.create({
            id: '1',
            name: 'João Silva',
        });
        await userRepository.save(userEntity);

        const user = new User('1', 'João Silva');
        const dateRange = new DateRange(
            new Date('2024-12-20'),
            new Date('2024-12-25')
        );

        const booking = new Booking('1', property, user, dateRange, 4);
        await bookingRepository.save(booking);

        const savedBooking = await bookingRepository.findById('1');
        expect(savedBooking).not.toBeNull();
        expect(savedBooking?.getId()).toBe('1');
        expect(savedBooking?.getProperty().getId()).toBe('1');
        expect(savedBooking?.getGuest().getId()).toBe('1');
    });
    it('should return null when booking not found', async () => {
        const booking = await bookingRepository.findById('non-existing-id');
        expect(booking).toBeNull();
    });
    it('should save a booking and then canceling', async () => {
        const propertyRepository = dataSource.getRepository(PropertyEntity);
        const userRepository = dataSource.getRepository(UserEntity);
        const propertyEntity = propertyRepository.create({
            id: '1',
            name: 'Casa na praia',
            description: 'Uma linda casa na praia com vista para o mar.',
            maxGuests: 6,
            basePricePerNight: 200,
        });
        await propertyRepository.save(propertyEntity);

        const property = new Property(
            '1',
            'Casa na praia',
            'Uma linda casa na praia com vista para o mar.',
            6,
            200
        );

        const userEntity = userRepository.create({
            id: '1',
            name: 'João Silva',
        });
        await userRepository.save(userEntity);

        const user = new User('1', 'João Silva');
        const dateRange = new DateRange(
            new Date('2024-12-20'),
            new Date('2024-12-25')
        );

        const booking = new Booking('1', property, user, dateRange, 4);
        await bookingRepository.save(booking);

        booking.cancel(new Date('2024-12-15'));
        await bookingRepository.save(booking);

        const updatedBooking = await bookingRepository.findById('1');
        expect(updatedBooking).not.toBeNull();
        expect(updatedBooking?.getStatus()).toBe('CANCELLED');
    });
});