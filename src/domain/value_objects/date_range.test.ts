import { DateRange } from "./date_range";
describe('DateRange Value Object', () => {
    it('Should throw an error if end date is before start date', () => {
        expect(() => {
            new DateRange(new Date('2024-12-25'), new Date('2024-12-20'))
        }).toThrow('The end date must be greater than the start date');
    });
    it('Should create a DateRange instance with startDate and endDate', () => {
        const startDate = new Date('2024-12-20');
        const endDate = new Date('2024-12-25');
        const dateRange = new DateRange(startDate, endDate);
        expect(dateRange.getStartDate()).toEqual(startDate);
        expect(dateRange.getEndDate()).toEqual(endDate);
    });
    it('Should correctly calculate the total number of nights', () => {
        const startDate = new Date('2024-12-20');
        const endDate = new Date('2024-12-25');
        const dateRange = new DateRange(startDate, endDate);

        const totalNights = dateRange.getTotalNights();

        expect(totalNights).toBe(5);
    });
});