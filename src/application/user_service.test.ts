import { UserService } from "./user_service";
import { FakeUserRepository } from "../infrastructure/repositories/fake_user_repository";
describe('User service unit tests', () => {
    let userService: UserService;
    let fakeUserRepository: FakeUserRepository;

    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        userService = new UserService(fakeUserRepository);
    });

    it('shouuld return null when an user id invalid is used', async () => {
        const user = await userService.findUserById('999');
        expect(user).toBeNull();
    });
    it('shouuld return an user when an user id valid is used', async () => {
        const user = await userService.findUserById('1');
        expect(user).not.toBeNull();
        expect(user?.getId()).toBe('1');
        expect(user?.getName()).toBe('Jhon Doe');
    });
});