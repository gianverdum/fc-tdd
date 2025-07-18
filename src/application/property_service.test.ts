import { PropertyService } from "./property_service";
import { FakePropertyRepository } from "../infrastructure/repositories/fake_property_repository";
import { Property } from "../domain/entities/property";
describe('PropertyService unit tests', () => {
    let propertyService: PropertyService;
    let fakePropertyRepository: FakePropertyRepository;

    beforeEach(() => {
        fakePropertyRepository = new FakePropertyRepository();
        propertyService = new PropertyService(fakePropertyRepository);
    })
    it('should return null when invalid id is used', async () => {
        const property = await propertyService.findPropertyById('999');
        expect(property).toBeNull();
    });
    it('should return a property when a valid id is used', async () => {
        const property = await propertyService.findPropertyById('1');
        expect(property).not.toBeNull();
        expect(property?.getId()).toBe('1');
        expect(property?.getName()).toBe('Apartamento');
    });
    it('should save a new property using a fake repository and return the data', async () => {
        const newProperty = new Property('3', 'Casa de Campo', 'Casa com vista para a natureza', 8, 300);
        await fakePropertyRepository.save(newProperty);

        const property = await propertyService.findPropertyById('3');
        expect(property).not.toBeNull();
        expect(property?.getId()).toBe('3');
        expect(property?.getName()).toBe('Casa de Campo');
    });
});