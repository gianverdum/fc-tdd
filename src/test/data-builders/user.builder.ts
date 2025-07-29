import { faker } from '@faker-js/faker'
import { User } from '../../domain/entities/user'

export class UserBuilder {
    private _id: string;
    private _name: string;

    constructor() {
        this._id = faker.string.uuid()
        this._name = faker.person.fullName()
    }

    static aUser(): UserBuilder {
        return new UserBuilder()
    }

    withId(id: string): UserBuilder {
        this._id = id
        return this
    }

    withName(name: string): UserBuilder {
        this._name = name
        return this
    }

    build(): User {
        return new User(this._id, this._name)
    }
}