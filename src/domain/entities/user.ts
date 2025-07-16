export class User {

    private readonly id: string;
    private readonly name: string;

    constructor(id: string, name: string) {
        if (!name) {
            throw new Error('User name is required');
        }
        if (!id) {
            throw new Error('User id is required');
        }
        this.id = id;
        this.name = name;
    }

    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }
}