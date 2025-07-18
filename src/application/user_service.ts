import { User } from "../domain/entities/user";
import { FakeUserRepository } from "../infrastructure/repositories/fake_user_repository";

export class UserService {
    constructor(private readonly userRepository: FakeUserRepository) {}
    async findUserById(id: string): Promise<User | null> {
        return this.userRepository.findById(id);
    }
}