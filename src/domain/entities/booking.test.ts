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
    it('should throw an error if number of guests is equal or less than zero', () => {
        const property = new Property('1', 'Home', 'Description', 5, 150);
        const user = new User('1', 'Jhon Doe');
        const dateRange = new DateRange(
            new Date('2024-12-10'),
            new Date('2024-12-15')
        );

        expect(() => {
            new Booking('1', property, user, dateRange, 0);
        }).toThrow('The number of guests must be greater than zero');
    });
    it('should throw an error when booking if guest count exceeds the maximum allowed', () => {
        const property = new Property('1', 'Home', 'Description', 5, 150);
        const user = new User('1', 'Jhon Doe');
        const dateRange = new DateRange(
            new Date('2024-12-10'),
            new Date('2024-12-15')
        );

        expect(() => {
            new Booking('1', property, user, dateRange, 6);
        }).toThrow(`Number of guests exceeded. Maximum allowed: ${property.getMaxGuests()}`);
    });
    it('should calculate the total price with discount', () => {
        // Arrange
        const property = new Property('1', 'Home', 'Description', 5, 300);
        const user = new User('1', 'Jhon Doe');
        const dateRange = new DateRange(
            new Date('2024-12-01'),
            new Date('2024-12-10')
        );
        // Act
        const booking = new Booking('1', property, user, dateRange, 4);
        // Assert
        expect(booking.getTotalPrice()).toBe(300*9*0.9);
    });
    it('should not book when a property is unavailable', () => {
        // Arrange
        const property = new Property('1', 'Home', 'Description', 5, 300);
        const user = new User('1', 'Jhon Doe');
        const dateRange = new DateRange(
            new Date('2024-12-01'),
            new Date('2024-12-10')
        );
        const booking = new Booking('1', property, user, dateRange, 4);
        const dateRange2 = new DateRange(
            new Date('2024-12-02'),
            new Date('2024-12-09')
        );
        // Act & Assert
        expect(() => {
            new Booking('1', property, user, dateRange2, 4);
        }).toThrow('The property is unavailable in the date range requested');
    });
    it('should cancel a booking without reimbursement when there is less than one day left before check-in', () => {
        // Arrange
        const property = new Property('1', 'Home', 'Description', 5, 300);
        const user = new User('1', 'Jhon Doe');
        const dateRange = new DateRange(
            new Date('2024-12-20'),
            new Date('2024-12-22')
        );
        const booking = new Booking('1', property, user, dateRange, 4);

        const currentDate = new Date('2024-12-20');
        booking.cancel(currentDate);

        expect(booking.getStatus()).toBe('CANCELLED');
        expect(booking.getTotalPrice()).toBe(600);
    });
    it('should cancel a booking with full reimbursement when there is more than seven days before check-in', () => {
        // Arrange
        const property = new Property('1', 'Home', 'Description', 5, 300);
        const user = new User('1', 'Jhon Doe');
        const dateRange = new DateRange(
            new Date('2024-12-20'),
            new Date('2024-12-25')
        );
        const booking = new Booking('1', property, user, dateRange, 4);

        const currentDate = new Date('2024-12-10');
        booking.cancel(currentDate);

        expect(booking.getStatus()).toBe('CANCELLED');
        expect(booking.getTotalPrice()).toBe(0);
    });
    it('should cancel a booking with partial reimbursement when there is between one to seven days before check-in', () => {
        // Arrange
        const property = new Property('1', 'Home', 'Description', 5, 300);
        const user = new User('1', 'Jhon Doe');
        const dateRange = new DateRange(
            new Date('2024-12-20'),
            new Date('2024-12-25')
        );
        const booking = new Booking('1', property, user, dateRange, 4);

        const currentDate = new Date('2024-12-13');
        booking.cancel(currentDate);

        expect(booking.getStatus()).toBe('CANCELLED');
        expect(booking.getTotalPrice()).toBe(300 * 5 * 0.5);
    });
    it('should not cancel the same booking more than once', () => {
        // Arrange
        const property = new Property('1', 'Home', 'Description', 5, 300);
        const user = new User('1', 'Jhon Doe');
        const dateRange = new DateRange(
            new Date('2024-12-20'),
            new Date('2024-12-25')
        );
        const booking = new Booking('1', property, user, dateRange, 4);

        const currentDate = new Date('2024-12-13');
        booking.cancel(currentDate);
        expect(() => {
            booking.cancel(currentDate);
        }).toThrow('This booking is already cancelled');
    });
});