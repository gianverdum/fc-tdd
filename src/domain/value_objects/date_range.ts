export class DateRange {
    private readonly startDate: Date;
    private readonly endDate: Date;

    constructor(startDate: Date, endDate: Date) {
        this.validateDates(startDate, endDate);
        this.startDate = startDate;
        this.endDate = endDate;
    }

    getStartDate(): Date {
        return this.startDate;
    }

    getEndDate(): Date {
        return this.endDate;
    }

    getTotalNights(): number {
        const diffTime = this.endDate.getTime() - this.startDate.getTime();
        return Math.ceil(diffTime / (1000 * 3600 * 24));
    }

    overlaps(other: DateRange): boolean {
        return (
            this.startDate  < other.getEndDate() && other.getStartDate() < this.endDate
        )
    }

    private validateDates(startDate: Date, endDate: Date): void {
        if (startDate == endDate) {
            throw new Error('Start and end dates cannot be identical');
        }
        if (endDate < startDate) {
            throw new Error('The end date must be greater than the start date');
        }
    }
}