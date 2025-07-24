import { BookingMapper } from './booking_mapper';
import { BookingEntity } from '../entities/booking_entity';
import { Booking } from '../../../domain/entities/booking';
import { Property } from '../../../domain/entities/property';
import { DateRange } from '../../../domain/value_objects/date_range';
import { User } from '../../../domain/entities/user';
describe('BookingMapper', () => {
    it('should map BookingEntity to Booking domain object', () => {
        const entity = new BookingEntity();
        entity.id = '1';
        entity.startDate = new Date('2023-01-01');
        entity.endDate = new Date('2023-01-10');
        entity.guestCount = 2;
        entity.totalPrice = 1000;
        entity.status = 'CONFIRMED';
        entity.guest = { id: '1', name: 'John Doe' };
        entity.property = {
            id: 'property1',
            name: 'Beach House',
            description: 'A lovely beach house',
            maxGuests: 6,
            basePricePerNight: 200,
            bookings: [],
        };

        const booking = BookingMapper.toDomain(entity);

        expect(booking.getId()).toBe('1');
        expect(booking.getDateRange().getStartDate()).toEqual(new Date('2023-01-01'));
        expect(booking.getDateRange().getEndDate()).toEqual(new Date('2023-01-10'));
        expect(booking.getGuestCount()).toBe(2);
        expect(booking.getTotalPrice()).toBe(1000);
        expect(booking.getStatus()).toBe('CONFIRMED');
    });
    it('should throw a validation error when booking id is missing', () => {
        const entity = new BookingEntity();
        entity.startDate = new Date('2023-01-01');
        entity.endDate = new Date('2023-01-10');
        entity.guestCount = 2;
        entity.status = 'CONFIRMED';
        entity.guest = { id: '1', name: 'John Doe' };
        entity.property = {
            id: 'property1',
            name: 'Beach House',
            description: 'A lovely beach house',
            maxGuests: 6,
            basePricePerNight: 200,
            bookings: [],
        };

        expect(() => BookingMapper.toDomain(entity)).toThrow('Booking ID is required');
    });
    it('should throw a validation error when guest count is missing', () => {
        const entity = new BookingEntity();
        entity.id = '1';
        entity.property = {
            id: 'property1',
            name: 'Beach House',
            description: 'A lovely beach house',
            maxGuests: 6,
            basePricePerNight: 200,
            bookings: [],
        };
        entity.startDate = new Date('2023-01-01');
        entity.endDate = new Date('2023-01-10');
        entity.guestCount = 0;
        entity.status = 'CONFIRMED';
        entity.guest = { id: '1', name: 'John Doe' };

        expect(() => BookingMapper.toDomain(entity)).toThrow('The number of guests must be greater than zero');
    });
    it('should map Booking domain object to BookingEntity', () => {
        const property = new Property('property1', 'Beach House', 'A lovely beach house', 6, 200);
        const dateRange = new DateRange(new Date('2023-01-01'), new Date('2023-01-10'));
        const guest = new User('1', 'John Doe');
        const booking = new Booking('1', property, guest, dateRange, 2);
        booking['totalPrice'] = 1000;
        booking['status'] = 'CONFIRMED';

        const entity = BookingMapper.toPersistence(booking);

        expect(entity.id).toBe('1');
        expect(entity.startDate).toEqual(new Date('2023-01-01'));
        expect(entity.endDate).toEqual(new Date('2023-01-10'));
        expect(entity.guestCount).toBe(2);
        expect(entity.totalPrice).toBe(1000);
        expect(entity.status).toBe('CONFIRMED');
    });
});