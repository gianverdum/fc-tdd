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
    it('should throw an error if id is empty', () => {
        expect(() => {
            new Property('', 'House', 'Description', 4, 2000)
        }).toThrow(`The property's id is required`);
    });
    it('should throw an error if name is empty', () => {
        expect(() => {
            new Property('1', '', 'Description', 4, 2000)
        }).toThrow(`The property's name is required`);
    });
    it('should throw an error if description is empty', () => {
        expect(() => {
            new Property('1', 'House', '', 4, 2000)
        }).toThrow(`The property's description is required`);
    });
    it('should throw an error if maximum number of guests is less than or equal to zero', () => {
        expect(() => {
            new Property('1', 'Home', 'Description', 0, 200);
        }).toThrow('The maximum number of guests must be greater than zero')
    });
    it('should throw an error if guest count exceeds the maximum allowed', () => {
        const property = new Property('1', 'Home', 'Description', 5, 200);

        expect(() => {
            property.validateGuestCount(6);
        }).toThrow(`Number of guests exceeded. Maximum allowed: ${property.getMaxGuests()}`);
    });
});