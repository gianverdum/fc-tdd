import { v4 as uuidv4 } from 'uuid';
import { DataSource, Repository } from "typeorm";
import { createTestPostgresDataSource, TestDBContext } from '../../test/utils/create_test_datasource';
import { Property } from "../../domain/entities/property";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { TypeORMPropertyRepository } from "./typeorm_property_repository";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { UserEntity } from "../persistence/entities/user_entity";

let dataSource: DataSource;
let container: TestDBContext['container'];
let propertyRepository: TypeORMPropertyRepository;
let repository: Repository<PropertyEntity>;

beforeAll(async () => {
    const result = await createTestPostgresDataSource([
        BookingEntity,
        PropertyEntity,
        UserEntity,
    ]);

    dataSource = result.dataSource;
    container = result.container;

    repository = dataSource.getRepository(PropertyEntity);
    propertyRepository = new TypeORMPropertyRepository(repository);
}, 20000);

afterAll(async () => {
    if (dataSource?.isInitialized) await dataSource.destroy();
    if (container) await container.stop();
});

describe('TypeORMPropertyRepository', () => {
    it('should save a property', async () => {
        const fixedId = uuidv4();
        const property = new Property(
            fixedId,
            'Casa na praia',
            'Uma linda casa na praia com vista para o mar.',
            6,
            200
        );
        await propertyRepository.save(property);
        const savedProperty = await repository.findOne({ where: { id: fixedId } });
        expect(savedProperty).toBeDefined();
        expect(savedProperty?.id).toBe(fixedId);
    });
    it('should find a property by id', async () => {
        const fixedId = uuidv4();
        const property = new Property(
            fixedId,
            'Apartamento no centro',
            'Um apartamento aconchegante no centro da cidade.',
            4,
            150
        );
        await propertyRepository.save(property);
        const savedProperty = await propertyRepository.findById(fixedId);
        expect(savedProperty).not.toBeNull();
        expect(savedProperty?.getId()).toBe(fixedId);
        expect(savedProperty?.getName()).toBe('Apartamento no centro');
    });
    it('should return null when property not found', async () => {
        const property = await propertyRepository.findById(uuidv4());
        expect(property).toBeNull();
    });
});