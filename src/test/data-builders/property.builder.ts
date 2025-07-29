import { faker } from '@faker-js/faker'
import { Property } from '../../domain/entities/property'

export class PropertyBuilder {
    private _id: string;
    private _name: string;
    private _description: string;
    private _maxGuests: number;
    private _basePricePerNight: number;

    constructor() {
        this._id = faker.string.uuid();
        this._name = faker.commerce.productName();
        this._description = faker.lorem.paragraph();
        this._maxGuests = faker.number.int({ min: 1, max: 14 });
        this._basePricePerNight = faker.number.int({ min: 50, max: 500 });
    }

    static aProperty(): PropertyBuilder {
        return new PropertyBuilder();
    }

    withId(id: string): PropertyBuilder {
        this._id = id;
        return this;
    }

    withName(name: string): PropertyBuilder {
        this._name = name;
        return this;
    }

    withDescription(description: string): PropertyBuilder {
        this._description = description;
        return this;
    }

    withMaxGuests(maxGuests: number): PropertyBuilder {
        this._maxGuests = maxGuests;
        return this;
    }

    withBasePricePerNight(basePricePerNight: number): PropertyBuilder {
        this._basePricePerNight = basePricePerNight;
        return this;
    }

    build(): Property {
        return new Property(
            this._id,
            this._name,
            this._description,
            this._maxGuests,
            this._basePricePerNight
        );
    }
}