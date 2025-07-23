import { DataSource, Repository } from "typeorm";
import { Property } from "../../domain/entities/property";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { TypeORMPropertyRepository } from "./typeorm_property_repository";
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
            entities: [PropertyEntity],
        });
        await dataSource.initialize();
        repository = dataSource.getRepository(PropertyEntity);
        propertyRepository = new TypeORMPropertyRepository(repository);
    });

    afterAll(async () => {
        await dataSource.destroy();
    });

    it('should create a property', async () => {
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
});