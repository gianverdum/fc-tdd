import { Property } from '../../../domain/entities/property';
import { PropertyEntity } from '../entities/property_entity';
import { PropertyMapper } from './property_mapper';
describe('PropertyMapper', () => {
    it('should map PropertyEntity to Property', () => {
        const entity = new PropertyEntity();
        entity.id = '1';
        entity.name = 'Test Property';
        entity.description = 'A test property description';
        entity.maxGuests = 4;
        entity.basePricePerNight = 100;

        const domain = PropertyMapper.toDomain(entity);

        expect(domain.getId()).toBe('1');
        expect(domain.getName()).toBe('Test Property');
        expect(domain.getDescription()).toBe('A test property description');
        expect(domain.getMaxGuests()).toBe(4);
        expect(domain.getBasePricePerNight()).toBe(100);
    });
    it('should throw a validation error when name is missing in PropertyEntity', () => {
        const entity = new PropertyEntity();
        entity.id = '1';
        entity.name = '';
        entity.description = 'A test property description';
        entity.maxGuests = 4;
        entity.basePricePerNight = 100;

        expect(() => PropertyMapper.toDomain(entity)).toThrow(`The property's name is required`);
    });
    it('should throw a validation error when description is missing in PropertyEntity', () => {
        const entity = new PropertyEntity();
        entity.id = '1';
        entity.name = 'Test Property';
        entity.description = '';
        entity.maxGuests = 4;
        entity.basePricePerNight = 100;

        expect(() => PropertyMapper.toDomain(entity)).toThrow(`The property's description is required`);
    });
    it('should map Property to PropertyEntity', () => {
        const domain = new Property('1', 'Test Property', 'A test property description', 4, 100);

        const entity = PropertyMapper.toPersistence(domain);

        expect(entity.id).toBe('1');
        expect(entity.name).toBe('Test Property');
        expect(entity.description).toBe('A test property description');
        expect(entity.maxGuests).toBe(4);
        expect(entity.basePricePerNight).toBe(100);
    });
});