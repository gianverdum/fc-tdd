import { DateRange } from "../value_objects/date_range";
import { Property } from "./property";
import { User } from "./user";
import { Booking } from "./booking";

describe('Booking entity unit tests', () => {
    it('should instantiate a booking with all attributes', () => {
        const property = new Property('1', 'Home', 'Description', 4, 100);
        const user = new User('1', 'Jhon Doe');
        const dateRange = new DateRange(
            new Date('2024-12-20'),
            new Date('2024-12-25')
        );

        const booking = new Booking('1', property, user, dateRange, 2);

        expect(booking.getId()).toBe('1');
        expect(booking.getProperty()).toBe(property);
        expect(booking.getUser()).toBe(user);
        expect(booking.getDateRange()).toBe(dateRange);
        expect(booking.getGuestCount()).toBe(2);
    });
});