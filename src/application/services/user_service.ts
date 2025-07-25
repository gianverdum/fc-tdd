import { User } from "../../domain/entities/user";
import { UserRepository } from "../../domain/repositories/user_repository";
import { CreateUserDTO } from "../dtos/create_user_dto";
import { v4 as uuidv4 } from "uuid";

export class UserService {
    constructor(private readonly userRepository: UserRepository) {}
    
    async createUser(dto: CreateUserDTO): Promise<User> {
        const user = new User(uuidv4(), dto.name);
        if (!user.getName()) {
            throw new Error('User name is required');
        }
        await this.userRepository.save(user);
        return user;
    }
    
    async findUserById(id: string): Promise<User | null> {
        return this.userRepository.findById(id);
    }
}