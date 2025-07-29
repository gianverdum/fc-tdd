import express from 'express';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { createTestPostgresDataSource, TestDBContext } from '../../test/utils/create_test_datasource';
import { PropertyService } from '../../application/services/property_service';
import { TypeORMPropertyRepository } from '../repositories/typeorm_property_repository';
import { PropertyEntity } from '../persistence/entities/property_entity';
import { BookingEntity } from '../persistence/entities/booking_entity';
import { UserEntity } from '../persistence/entities/user_entity';
import { PropertyController } from './property_controller';

const app = express();
app.use(express.json());

let dataSource: DataSource;
let container: TestDBContext['container'];
let propertyRepository: TypeORMPropertyRepository;
let propertyService: PropertyService;
let propertyController: PropertyController;

jest.setTimeout(20000);

beforeAll(async () => {
    const result = await createTestPostgresDataSource([
        BookingEntity,
        PropertyEntity,
        UserEntity,
    ]);

    dataSource = result.dataSource;
    container = result.container;

    propertyRepository = new TypeORMPropertyRepository(dataSource.getRepository(PropertyEntity));

    propertyService = new PropertyService(propertyRepository);

    propertyController = new PropertyController(propertyService);

    app.post('/properties', (req, res, next) => {
        propertyController.createProperty(req, res).catch((err) => next(err));
    });
});

afterAll(async () => {
    if (dataSource?.isInitialized) await dataSource.destroy();
    if (container) await container.stop();
});

describe('PropertyController', () => {
    it('should create a property successfully', async () => {
        const response = await request(app)
            .post('/properties')
            .send({
                name: 'Luxury Villa',
                description: 'A beautiful luxury villa with sea view',
                maxGuests: 10,
                basePricePerNight: 500,
            });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Property created successfully');
        expect(response.body.property).toHaveProperty('id');
        expect(response.body.property.name).toBe('Luxury Villa');
        expect(response.body.property.description).toBe('A beautiful luxury villa with sea view');
        expect(response.body.property.maxGuests).toBe(10);
        expect(response.body.property.basePricePerNight).toBe(500);

    });

    it('should return an error if property name is missing', async () => {
        const response = await request(app)
            .post('/properties')
            .send({
                description: 'A beautiful luxury villa with sea view',
                maxGuests: 10,
                basePricePerNight: 500,
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe(`The property's name is required`);
    });
    it('should return an error if maxGuests is less than 1', async () => {
        const response = await request(app)
            .post('/properties')
            .send({
                name: 'Luxury Villa',
                description: 'A beautiful luxury villa with sea view',
                maxGuests: -1,
                basePricePerNight: 500,
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('The maximum number of guests must be greater than zero');
    });
    it('should return an error is basePricePerNight is missing', async () => {
        const response = await request(app)
            .post('/properties')
            .send({
                name: 'Luxury Villa',
                description: 'A beautiful luxury villa with sea view',
                maxGuests: 10,
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('The base price per night is required');
    });
});