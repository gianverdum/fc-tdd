import { DateRange } from "../../domain/value_objects/date_range";

export class DateRangeFactory {
    create(start: Date, end: Date): DateRange {
        return new DateRange(start, end);
    }
}