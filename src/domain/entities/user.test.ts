import { User } from './user';
describe('User entity unit tests', () => {
    it('should create a user instance with valid id and name', () => {
        const user = new User('1', 'Jhon Doe');
        expect(user.getId()).toBe('1');
        expect(user.getName()).toBe('Jhon Doe');
    });
    it('should throw an error if id is empty', () => {
        expect(() => new User('', 'Jhon')).toThrow('User id is required');
    });
    it('should throw an error if name is empty', () => {
        expect(() => new User('1', '')).toThrow('User name is required');
    });
});