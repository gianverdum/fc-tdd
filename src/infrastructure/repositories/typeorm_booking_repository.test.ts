import { DataSource } from "typeorm";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { UserEntity } from "../persistence/entities/user_entity";
import { User } from "../../domain/entities/user";
import { v4 as uuidv4 } from 'uuid';
import { DateRange } from "../../domain/value_objects/date_range";
import { createTestPostgresDataSource, TestDBContext } from '../../test/utils/create_test_datasource';
import { Property } from "../../domain/entities/property";
import { Booking } from "../../domain/entities/booking";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { TypeORMBookingRepository } from "./typeorm_booking_repository";

let dataSource: DataSource;
let container: TestDBContext['container'];
let bookingRepository: TypeORMBookingRepository;

jest.setTimeout(20000);

beforeAll(async () => {
    const result = await createTestPostgresDataSource([
        BookingEntity,
        PropertyEntity,
        UserEntity,
    ]);

    dataSource = result.dataSource;
    container = result.container;

    bookingRepository = new TypeORMBookingRepository(
        dataSource.getRepository(BookingEntity)   
    );
});

afterAll(async () => {
    if (dataSource?.isInitialized) await dataSource.destroy();
    if (container) await container.stop();
});

describe('TypeORMBookingRepository', () => {

    it('should save a booking', async () => {
        const fixedId = uuidv4();
        const propertyRepository = dataSource.getRepository(PropertyEntity);
        const userRepository = dataSource.getRepository(UserEntity);
        const propertyEntity = propertyRepository.create({
            id: fixedId,
            name: 'Casa na praia',
            description: 'Uma linda casa na praia com vista para o mar.',
            maxGuests: 6,
            basePricePerNight: 200,
        });
        await propertyRepository.save(propertyEntity);

        const property = new Property(
            fixedId,
            'Casa na praia',
            'Uma linda casa na praia com vista para o mar.',
            6,
            200
        );

        const userEntity = userRepository.create({
            id: fixedId,
            name: 'João Silva',
        });
        await userRepository.save(userEntity);

        const user = new User(fixedId, 'João Silva');
        const dateRange = new DateRange(
            new Date('2024-12-20'),
            new Date('2024-12-25')
        );

        const booking = new Booking(fixedId, property, user, dateRange, 4);
        await bookingRepository.save(booking);

        const savedBooking = await bookingRepository.findById(fixedId);
        expect(savedBooking).not.toBeNull();
        expect(savedBooking?.getId()).toBe(fixedId);
        expect(savedBooking?.getProperty().getId()).toBe(fixedId);
        expect(savedBooking?.getGuest().getId()).toBe(fixedId);
    });
    it('should return null when booking not found', async () => {
        const nonExistingId = uuidv4();
        const booking = await bookingRepository.findById(nonExistingId);
        expect(booking).toBeNull();
    });
    it('should save a booking and then canceling', async () => {
        const fixedId = uuidv4();
        const propertyRepository = dataSource.getRepository(PropertyEntity);
        const userRepository = dataSource.getRepository(UserEntity);
        const propertyEntity = propertyRepository.create({
            id: fixedId,
            name: 'Casa na praia',
            description: 'Uma linda casa na praia com vista para o mar.',
            maxGuests: 6,
            basePricePerNight: 200,
        });
        await propertyRepository.save(propertyEntity);

        const property = new Property(
            fixedId,
            'Casa na praia',
            'Uma linda casa na praia com vista para o mar.',
            6,
            200
        );

        const userEntity = userRepository.create({
            id: fixedId,
            name: 'João Silva',
        });
        await userRepository.save(userEntity);

        const user = new User(fixedId, 'João Silva');
        const dateRange = new DateRange(
            new Date('2024-12-20'),
            new Date('2024-12-25')
        );

        const booking = new Booking(fixedId, property, user, dateRange, 4);
        await bookingRepository.save(booking);

        booking.cancel(new Date('2024-12-15'));
        await bookingRepository.save(booking);

        const updatedBooking = await bookingRepository.findById(fixedId);
        expect(updatedBooking).not.toBeNull();
        expect(updatedBooking?.getStatus()).toBe('CANCELLED');
    });
});