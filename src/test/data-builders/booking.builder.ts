import { faker } from '@faker-js/faker'
import { Booking } from '../../domain/entities/booking'
import { PropertyBuilder } from './property.builder';
import { UserBuilder } from './user.builder';
import { Property } from '../../domain/entities/property';
import { User } from '../../domain/entities/user';
import { DateRange } from '../../domain/value_objects/date_range';
import { DateRangeBuilder } from './date_range.builder';

export class BookingBuilder {
    private _id: string;
    private _property: Property;
    private _guest: User;
    private _dateRange: DateRange;
    private _guestCount: number;

    constructor() {
        this._id = faker.string.uuid();
        this._property = PropertyBuilder.aProperty().build();
        this._guest = UserBuilder.aUser().build();
        this._dateRange = DateRangeBuilder.aDateRange().build();
        this._guestCount = faker.number.int({ min: 1, max: 14 });
    }

    static aBooking(): BookingBuilder {
        return new BookingBuilder();
    }

    withId(id: string): BookingBuilder {
        this._id = id;
        return this;
    }

    withProperty(property: Property): BookingBuilder {
        this._property = property;
        return this;
    }

    withGuest(guest: User): BookingBuilder {
        this._guest = guest;
        return this;
    }

    withDateRange(dateRange: DateRange): BookingBuilder {
        this._dateRange = dateRange;
        return this;
    }

    withGuestCount(guestCount: number): BookingBuilder {
        this._guestCount = guestCount;
        return this;
    }

    build(): Booking {
        if (!this._property || !this._guest || !this._dateRange) {
            throw new Error('Property, Guest, and DateRange must be set before building a Booking');
        }
        return new Booking(
            this._id,
            this._property,
            this._guest,
            this._dateRange,
            this._guestCount
        );
    }
}