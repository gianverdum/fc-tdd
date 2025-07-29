import { faker } from '@faker-js/faker'
import { DateRange } from '../../domain/value_objects/date_range';

export class DateRangeBuilder {
    private _startDate: Date;
    private _endDate: Date;

    constructor() {
        this._startDate = new Date();

        const daysAhead = faker.number.int({ min: 1, max: 14 });
        this._endDate = new Date(
            this._startDate.getTime() + daysAhead * 24 * 60 * 60 * 1000
    );
    }

    static aDateRange(): DateRangeBuilder {
        return new DateRangeBuilder();
    }

    withStartDate(startDate: Date): DateRangeBuilder {
        this._startDate = startDate;
        return this;
    }

    withEndDate(endDate: Date): DateRangeBuilder {
        this._endDate = endDate;
        return this;
    }

    withRangeOfDays(days: number): DateRangeBuilder {
        this._endDate = new Date(this._startDate.getTime() + days * 24 * 60 * 60 * 1000);
        return this;
    }


    build(): DateRange {
        return new DateRange(this._startDate, this._endDate);
    }
}   