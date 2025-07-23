import { DataSource, Repository } from "typeorm";
import { Property } from "../../domain/entities/property";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { TypeORMPropertyRepository } from "./typeorm_property_repository";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { UserEntity } from "../persistence/entities/user_entity";
describe('TypeORMPropertyRepository', () => {
    let dataSource: DataSource;
    let propertyRepository: TypeORMPropertyRepository;
    let repository: Repository<PropertyEntity>;

    beforeAll(async () => {
        dataSource = new DataSource({
            type: 'sqlite',
            database: ':memory:',
            dropSchema: true,
            logging: false,
            synchronize: true,
            entities: [PropertyEntity, BookingEntity, UserEntity],
        });
        await dataSource.initialize();
        repository = dataSource.getRepository(PropertyEntity);
        propertyRepository = new TypeORMPropertyRepository(repository);
    });

    afterAll(async () => {
        await dataSource.destroy();
    });

    it('should save a property', async () => {
        const property = new Property(
            '1',
            'Casa na praia',
            'Uma linda casa na praia com vista para o mar.',
            6,
            200
        );
        await propertyRepository.save(property);
        const savedProperty = await repository.findOne({ where: { id: '1' } });
        expect(savedProperty).toBeDefined();
        expect(savedProperty?.id).toBe('1');
    });
    it('should find a property by id', async () => {
        const property = new Property(
            '2',
            'Apartamento no centro',
            'Um apartamento aconchegante no centro da cidade.',
            4,
            150
        );
        await propertyRepository.save(property);
        const savedProperty = await propertyRepository.findById('2');
        expect(savedProperty).not.toBeNull();
        expect(savedProperty?.getId()).toBe('2');
        expect(savedProperty?.getName()).toBe('Apartamento no centro');
    });
    it('should return null when property not found', async () => {
        const property = await propertyRepository.findById('999');
        expect(property).toBeNull();
    });
});