import express from 'express';
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { DataSource, Not, IsNull } from 'typeorm';
import { TypeORMBookingRepository } from '../repositories/typeorm_booking_repository';
import { TypeORMPropertyRepository } from '../repositories/typeorm_property_repository';
import { TypeORMUserRepository } from '../repositories/typeorm_user_repository';
import { BookingService } from '../../application/services/booking_service';
import { PropertyService } from '../../application/services/property_service';
import { UserService } from '../../application/services/user_service';
import { BookingController } from './booking_controller';
import { BookingEntity } from '../persistence/entities/booking_entity';
import { PropertyEntity } from '../persistence/entities/property_entity';
import { UserEntity } from '../persistence/entities/user_entity';
import { DateRangeFactory } from '../../application/factories/date_range_factory';
import { PropertyBuilder } from '../../test/data-builders/property.builder';
import { UserBuilder } from '../../test/data-builders/user.builder';
import { BookingBuilder } from '../../test/data-builders/booking.builder';
import { PropertyMapper } from '../../infrastructure/persistence/mappers/property_mapper';
import { UserMapper } from '../../infrastructure/persistence/mappers/user_mappers';
import { User } from '../../domain/entities/user';
import { Property } from '../../domain/entities/property';

const app = express();
app.use(express.json());

let dataSource: DataSource;
let bookingRepository: TypeORMBookingRepository;
let propertyRepository: TypeORMPropertyRepository;
let userRepository: TypeORMUserRepository;
let bookingService: BookingService;
let dataRange: DateRangeFactory;
let propertyService: PropertyService;
let userService: UserService;
let bookingController: BookingController;
let container: StartedTestContainer;

beforeAll(async () => {
    container = await new GenericContainer('postgres')
        .withEnvironment({
            POSTGRES_USER: 'test',
            POSTGRES_PASSWORD: 'test',
            POSTGRES_DB: 'test',
        })
        .withExposedPorts(5432)
        .start();
    
    const port = container.getMappedPort(5432);
    const host = container.getHost();

    dataSource = new DataSource({
        type: 'postgres',
        host,
        port,
        username: 'test',
        password: 'test',
        database: 'test',
        synchronize: true,
        logging: false,
        entities: [BookingEntity, PropertyEntity, UserEntity],
    });

    await dataSource.initialize();

    bookingRepository = new TypeORMBookingRepository(dataSource.getRepository(BookingEntity));
    propertyRepository = new TypeORMPropertyRepository(dataSource.getRepository(PropertyEntity));
    userRepository = new TypeORMUserRepository(dataSource.getRepository(UserEntity));
    dataRange = new DateRangeFactory();

    propertyService = new PropertyService(propertyRepository);
    userService = new UserService(userRepository);
    bookingService = new BookingService(
        bookingRepository,
        propertyService,
        userService,
        dataRange
    );

    bookingController = new BookingController(bookingService);

    app.post('/bookings', (req, res, next) => {
        bookingController.createBooking(req, res).catch((err) => next(err));
    });

    app.post('/bookings/:id/cancel', (req, res, next) => {
        bookingController.cancelBooking(req, res).catch((err) => next(err));
    });
}, 20000);

afterAll(async () => {
    if (dataSource?.isInitialized) {
        await dataSource.destroy();
    }
    if (container) {
        await container.stop();
    }
});

describe('BookingController', () => {
    let savedProperty: PropertyEntity;
    let savedUser: UserEntity;
    let property: Property;
    let guest: User;

    beforeEach(async () => {
        const propertyRepo = dataSource.getRepository(PropertyEntity);
        const userRepo = dataSource.getRepository(UserEntity);
        const bookingRepo = dataSource.getRepository(BookingEntity);

        await dataSource.getRepository(BookingEntity).delete({ id: Not(IsNull()) });
        await dataSource.getRepository(PropertyEntity).delete({ id: Not(IsNull()) });
        await dataSource.getRepository(UserEntity).delete({ id: Not(IsNull()) });

        const builtProperty = PropertyBuilder.aProperty().withId(uuidv4()).withMaxGuests(6).build();
        const builtUser = UserBuilder.aUser().withId(uuidv4()).build();

        savedProperty = await propertyRepo.save({
            id: builtProperty.getId(),
            name: builtProperty.getName(),
            description: builtProperty.getDescription(),
            maxGuests: builtProperty.getMaxGuests(),
            basePricePerNight: builtProperty.getBasePricePerNight(),
        });

        savedUser = await userRepo.save({
            id: builtUser.getId(),
            name: builtUser.getName(),
        });

        property = PropertyMapper.toDomain(savedProperty);
        guest = UserMapper.toDomain(savedUser);
    });
    it('should create a booking successfully', async () => {
        const booking = BookingBuilder.aBooking()
            .withProperty(property)
            .withGuest(guest)
            .withGuestCount(2)
            .build();

        const response = await request(app).post('/bookings').send({
            propertyId: booking.getProperty().getId(),
            guestId: booking.getGuest().getId(),
            startDate: booking.getDateRange().getStartDate(),
            endDate: booking.getDateRange().getEndDate(),
            guestCount: booking.getGuestCount(),
        });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Booking created successfully');
        expect(response.body.booking).toHaveProperty('id');
        expect(response.body.booking).toHaveProperty('totalPrice');
    });
    it('should return 400 for invalid start date format', async () => {
        const response = await request(app).post('/bookings').send({
            propertyId: property.getId(),
            guestId: guest.getId(),
            startDate: 'invalid-date',
            endDate: '2024-12-25',
            guestCount: 2,
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid start/end date format');
    });
    it('should return 400 for invalid end date format', async () => {
        const response = await request(app).post('/bookings').send({
            propertyId: property.getId(),
            guestId: guest.getId(),
            startDate: '2024-12-20',
            endDate: 'invalid-date',
            guestCount: 2,
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid start/end date format');
    });
    it('should return 400 for a guest number less than 1', async () => {
        const response = await request(app).post('/bookings').send({
            propertyId: property.getId(),
            guestId: guest.getId(),
            startDate: '2024-12-20',
            endDate: '2024-12-25',
            guestCount: 0,
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('The number of guests must be greater than zero');
    });
    it('should return 400 for a non-existent propertyId', async () => {
        const response = await request(app).post('/bookings').send({
            propertyId: uuidv4(),
            guestId: guest.getId(),
            startDate: '2024-12-20',
            endDate: '2024-12-25',
            guestCount: 2,
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Property not found');
    });
    it('should cancel a booking successfully', async () => {
        const booking = BookingBuilder.aBooking()
            .withProperty(property)
            .withGuest(guest)
            .withGuestCount(2)
            .build();

        const response = await request(app).post('/bookings').send({
            propertyId: booking.getProperty().getId(),
            guestId: booking.getGuest().getId(),
            startDate: booking.getDateRange().getStartDate(),
            endDate: booking.getDateRange().getEndDate(),
            guestCount: booking.getGuestCount(),
        });

        const bookingId = response.body.booking.id;

        const cancelResponse = await request(app)
            .post(`/bookings/${bookingId}/cancel`);

        expect(cancelResponse.status).toBe(200);
        expect(cancelResponse.body.message).toBe('Booking canceled successfully');
    });
    it('should return 400 for canceling a non-existent booking', async () => {
        const nonExistentBookingId = uuidv4();

        const response = await request(app).post(`/bookings/${nonExistentBookingId}/cancel`);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Booking not found');
    });
});