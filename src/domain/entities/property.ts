import { DateRange } from "../value_objects/date_range";

export class Property {
    
    constructor(
        private id: string,
        private name: string,
        private description: string,
        private maxGuests: number,
        private basePricePerNight: number,
    ) {
        this.id = id,
        this.name = name,
        this.description = description,
        this.maxGuests = maxGuests,
        this.basePricePerNight = basePricePerNight
        this.validate();
    }

    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getDescription(): string {
        return this.description;
    }

    getMaxGuests(): number {
        return this.maxGuests;
    }

    getBasePricePerNight(): number {
        return this.basePricePerNight;
    }

    validateGuestCount(guestCount: number): void {
        if (guestCount > this.maxGuests) {
            throw new Error(`Number of guests exceeded. Maximum allowed: ${this.maxGuests}`)
        }
    }

    calculateTotalPrice(dateRange: DateRange): number {
        const totalNights = dateRange.getTotalNights();
        let totalPrice = totalNights * this.basePricePerNight;
        if (totalNights < 7) {
            return totalPrice;
        }
        return totalPrice * 0.9;
    }

    private validate(): void {
        if (!this.id) {
            throw new Error(`The property's id is required`);
        }
        if (!this.name) {
            throw new Error(`The property's name is required`);
        }
        if (!this.description) {
            throw new Error(`The property's description is required`);
        }
        if (this.maxGuests <= 0) {
            throw new Error('The maximum number of guests must be greater than zero');
        }
    }
}