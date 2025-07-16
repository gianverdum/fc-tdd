import { DateRange } from "./date_range";
describe('DateRange Value Object', () => {
    it('should throw an error if end date is before start date', () => {
        expect(() => {
            new DateRange(new Date('2024-12-25'), new Date('2024-12-20'))
        }).toThrow('The end date must be greater than the start date');
    });
    it('should create a DateRange instance with startDate and endDate', () => {
        const startDate = new Date('2024-12-20');
        const endDate = new Date('2024-12-25');
        const dateRange = new DateRange(startDate, endDate);
        expect(dateRange.getStartDate()).toEqual(startDate);
        expect(dateRange.getEndDate()).toEqual(endDate);
    });
    it('should correctly calculate the total number of nights', () => {
        const startDate = new Date('2024-12-20');
        const endDate = new Date('2024-12-25');
        const dateRange = new DateRange(startDate, endDate);

        const totalNights = dateRange.getTotalNights();

        expect(totalNights).toBe(5);

        const startDate1 = new Date('2024-12-10');
        const endDate1 = new Date('2024-12-25');
        const dateRange1 = new DateRange(startDate1, endDate1);

        const totalNights1 = dateRange1.getTotalNights();

        expect(totalNights1).toBe(15);
    });
    it('should detect when two date ranges overlap', () => {
        const dateRange1 = new DateRange(
            new Date('2024-12-20'),
            new Date('2024-12-25')
        );
        const dateRange2 = new DateRange(
            new Date('2024-12-22'),
            new Date('2024-12-27')
        );
        const overlaps = dateRange1.overlaps(dateRange2);

        expect(overlaps).toBe(true);
    });
    it('should throw an error when startDate equals endDate', () => {
        const date = new Date('2024-12-20');
        expect(() => {
            new DateRange(date, date);
        }).toThrow('Start and end dates cannot be identical');
    });
});