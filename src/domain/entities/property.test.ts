import { Property } from './property';

describe('Property entity unit tests', () => {
    it('should create a property entity with all the attributes', () => {
        const property = new Property(
            '1',
            'Casa de praia',
            'Uma bela casa na praia',
            4,
            200
        );

        expect(property.getId()).toBe('1');
        expect(property.getName()).toBe('Casa de praia');
        expect(property.getDescription()).toBe('Uma bela casa na praia');
        expect(property.getMaxGuests()).toBe(4);
        expect(property.getBasePricePerNight()).toBe(200);
    });
});