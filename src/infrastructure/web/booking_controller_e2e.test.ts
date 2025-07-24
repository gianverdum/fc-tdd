import express from 'express';
import request from 'supertest';
import { DataSource } from 'typeorm';
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

beforeAll(async () => {
    dataSource = new DataSource({
        type: 'sqlite',
        database: ':memory:',
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

    // app.post('/bookings/:id/cancel', (req, res, next) => {
    //     bookingController.cancelBooking(req, res).catch((err) => next(err));
    // });
});

afterAll(async () => {
    await dataSource.destroy();
});

describe('BookingController', () => {
    beforeEach(async () => {
        const propertyRepo = dataSource.getRepository(PropertyEntity);
        const userRepo = dataSource.getRepository(UserEntity);
        const bookingRepo = dataSource.getRepository(BookingEntity);

        await bookingRepo.clear();
        await propertyRepo.clear();
        await userRepo.clear();

        await propertyRepo.save({
            id: '1',
            name: 'Property 1',
            description: 'A nice property',
            maxGuests: 5,
            basePricePerNight: 100,
        });

        await userRepo.save({
            id: '1',
            name: 'User 1',
        });
    });
    it('should create a booking successfully', async () => {
        const response = await request(app).post('/bookings').send({
            propertyId: '1',
            guestId: '1',
            startDate: '2024-12-20',
            endDate: '2024-12-25',
            guestCount: 2,
        });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Booking created successfully');
        expect(response.body.booking).toHaveProperty('id');
        expect(response.body.booking).toHaveProperty('totalPrice');
    });
    it('should return 400 for invalid start date format', async () => {
        const response = await request(app).post('/bookings').send({
            propertyId: '1',
            guestId: '1',
            startDate: 'invalid-date',
            endDate: '2024-12-25',
            guestCount: 2,
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid start/end date format');
    });
    it('should return 400 for invalid end date format', async () => {
        const response = await request(app).post('/bookings').send({
            propertyId: '1',
            guestId: '1',
            startDate: '2024-12-20',
            endDate: 'invalid-date',
            guestCount: 2,
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid start/end date format');
    });
    it('should return 400 for a guest number less than 1', async () => {
        const response = await request(app).post('/bookings').send({
            propertyId: '1',
            guestId: '1',
            startDate: '2024-12-20',
            endDate: '2024-12-25',
            guestCount: 0,
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('The number of guests must be greater than zero');
    });
    it('should return 400 for an invalid propertyId', async () => {
        const response = await request(app).post('/bookings').send({
            propertyId: 'invalid-property-id',
            guestId: '1',
            startDate: '2024-12-20',
            endDate: '2024-12-25',
            guestCount: 2,
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Property not found');
    });
});