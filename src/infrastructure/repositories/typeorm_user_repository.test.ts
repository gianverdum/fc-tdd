import { DataSource, Repository } from 'typeorm';
import { User } from '../../domain/entities/user';
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

        const savedUser = await userRepository.findOne({ where: { id: '1' } });
        expect(savedUser).not.toBeNull();
        expect(savedUser?.id).toBe('1');
        expect(savedUser?.name).toBe('John Doe');
    });
});