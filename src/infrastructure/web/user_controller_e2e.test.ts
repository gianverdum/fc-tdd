import express from 'express';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { UserService } from '../../application/services/user_service';
import { TypeORMUserRepository } from '../repositories/typeorm_user_repository';
import { UserEntity } from '../persistence/entities/user_entity';
import { UserController } from './user_controller';

const app = express();
app.use(express.json());

let dataSource: DataSource;
let userRepository: TypeORMUserRepository;
let userService: UserService;
let userController: UserController;

beforeAll(async () => {
    dataSource = new DataSource({
        type: 'sqlite',
        database: ':memory:',
        synchronize: true,
        logging: false,
        entities: [UserEntity],
    });

    await dataSource.initialize();

    userRepository = new TypeORMUserRepository(dataSource.getRepository(UserEntity));

    userService = new UserService(userRepository);

    userController = new UserController(userService);

    app.post('/users', (req, res, next) => {
        userController.createUser(req, res).catch((err) => next(err));
    });
});

afterAll(async () => {
    await dataSource.destroy();
});

describe('UserController', () => {
    it('should create a user successfully', async () => {
        const response = await request(app)
            .post('/users')
            .send({ name: 'John Doe' });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User created successfully');
        expect(response.body.user).toHaveProperty('id');
        expect(response.body.user.name).toBe('John Doe');
    });

    it('should return an error if user name is missing', async () => {
        const response = await request(app)
            .post('/users')
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('User name is required');
    });
});