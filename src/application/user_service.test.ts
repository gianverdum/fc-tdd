import { UserService } from "./user_service";
import { FakeUserRepository } from "../infrastructure/repositories/fake_user_repository";
import { User } from "../domain/entities/user";
describe('User service unit tests', () => {
    let userService: UserService;
    let fakeUserRepository: FakeUserRepository;

    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        userService = new UserService(fakeUserRepository);
    });

    it('should return null when an user id invalid is used', async () => {
        const user = await userService.findUserById('999');
        expect(user).toBeNull();
    });
    it('should return an user when an user id valid is used', async () => {
        const user = await userService.findUserById('1');
        expect(user).not.toBeNull();
        expect(user?.getId()).toBe('1');
        expect(user?.getName()).toBe('Jhon Doe');
    });
    it('should save a new user using fake repository and return the data', async () => {
        //Arrange
        const newUser = new User('3', 'Alice Dantas');

        await fakeUserRepository.save(newUser);
        // Act
        const user = await userService.findUserById('3');
        // Assert
        expect(user).not.toBeNull();
        expect(user?.getId()).toBe('3');
        expect(user?.getName()).toBe('Alice Dantas');
    });
});