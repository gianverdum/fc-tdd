import { DataSource, Repository } from 'typeorm';
import { User } from '../../domain/entities/user';
import { UserEntity } from '../persistence/entities/user_entity';
import { TypeORMUserRepository } from './typeorm_user_repository';
describe('TypeORMUserRepository', () => {
    let dataSource: DataSource;
    let userRepository: TypeORMUserRepository;
    let repository: Repository<UserEntity>;

    beforeAll(async () => {
        dataSource = new DataSource({
            type: 'sqlite',
            database: ':memory:',
            dropSchema: true,
            logging: false,
            synchronize: true,
            entities: [UserEntity],
        });
        await dataSource.initialize();
        repository = dataSource.getRepository(UserEntity);
        userRepository = new TypeORMUserRepository(repository);
    });

    afterAll(async () => {
        await dataSource.destroy();
    });

    it('should save a user', async () => {
        const user = new User('1', 'John Doe',);
        await userRepository.save(user);

        const savedUser = await repository.findOne({ where: { id: '1' } });
        expect(savedUser).not.toBeNull();
        expect(savedUser?.id).toBe('1');
        expect(savedUser?.name).toBe('John Doe');
    });
    it('should find a user by id', async () => {
        const user = new User('2', 'Jane Doe');
        await userRepository.save(user);

        const savedUser = await userRepository.findById('2');
        expect(savedUser).not.toBeNull();
        expect(savedUser?.getId()).toBe('2');
        expect(savedUser?.getName()).toBe('Jane Doe');
    });
    it('should return null if user not found', async () => {
        const user = await userRepository.findById('non-existing-id');
        expect(user).toBeNull();
    });
});