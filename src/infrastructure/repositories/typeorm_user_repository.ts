import { Repository } from "typeorm";
import { User } from "../../domain/entities/user";
import { UserRepository } from "../../domain/repositories/user_repository";
import { UserEntity } from "../persistence/entities/user_entity";

export class TypeORMUserRepository implements UserRepository {
    private readonly repository: Repository<UserEntity>;

    constructor(repository: Repository<UserEntity>) {
        this.repository = repository;
    }

    async save(user: User): Promise<void> {
        const entity= new UserEntity();
        entity.id = user.getId();
        entity.name = user.getName();
        await this.repository.save(entity);
    }

    findById(id: string): Promise<User | null> {
        throw new Error("Method not implemented.");
    }
}