import { CreateUserDTO } from "../../application/dtos/create_user_dto";
import { UserService } from "../../application/services/user_service";
import { Request, Response } from 'express';

export class UserController {
    constructor(private userService: UserService) {}

    async createUser(req: Request, res: Response) {
        try{
            const dto: CreateUserDTO = {
                name: req.body.name,
            };

            const user = await this.userService.createUser(dto);
            return res.status(201).json({
                message: 'User created successfully',
                user: {
                    id: user.getId(),
                    name: user.getName(),
                }
            });
        } catch (error: any) {
            return res.status(400).json({ error: error.message || 'An unexpected error occurred' });
        }
    }
}