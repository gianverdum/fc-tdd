import { v4 as uuidv4 } from 'uuid';
import { DataSource, Repository } from 'typeorm';
import { createTestPostgresDataSource, TestDBContext } from '../../test/utils/create_test_datasource';
import { User } from '../../domain/entities/user';
import { UserEntity } from '../persistence/entities/user_entity';
import { TypeORMUserRepository } from './typeorm_user_repository';

let dataSource: DataSource;
let container: TestDBContext['container'];
let userRepository: TypeORMUserRepository;
let repository: Repository<UserEntity>;

jest.setTimeout(20000);

beforeAll(async () => {
    const result = await createTestPostgresDataSource([
        UserEntity,
    ]);

    dataSource = result.dataSource;
    container = result.container;

    repository = dataSource.getRepository(UserEntity);
    userRepository = new TypeORMUserRepository(repository);
});

afterAll(async () => {
    if (dataSource?.isInitialized) await dataSource.destroy();
    if (container) await container.stop();
});

describe('TypeORMUserRepository', () => {

    it('should save a user', async () => {
        const fixeIdId = uuidv4();
        const user = new User(fixeIdId, 'John Doe',);
        await userRepository.save(user);

        const savedUser = await repository.findOne({ where: { id: fixeIdId } });
        expect(savedUser).not.toBeNull();
        expect(savedUser?.id).toBe(fixeIdId);
        expect(savedUser?.name).toBe('John Doe');
    });
    it('should find a user by id', async () => {
        const fixeIdId = uuidv4();
        const user = new User(fixeIdId, 'Jane Doe');
        await userRepository.save(user);

        const savedUser = await userRepository.findById(fixeIdId);
        expect(savedUser).not.toBeNull();
        expect(savedUser?.getId()).toBe(fixeIdId);
        expect(savedUser?.getName()).toBe('Jane Doe');
    });
    it('should return null if user not found', async () => {
        const user = await userRepository.findById(uuidv4());
        expect(user).toBeNull();
    });
});