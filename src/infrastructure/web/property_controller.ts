import { dot } from "node:test/reporters";
import { CreatePropertyDTO } from "../../application/dtos/create_property_dto";
import { PropertyService } from "../../application/services/property_service";
import { Request, Response } from 'express';

export class PropertyController {
    private propertyService: PropertyService;

    constructor(propertyService: PropertyService) {
        this.propertyService = propertyService;
    }

    async createProperty(req: Request, res: Response): Promise<Response> {
        try {
            const dto: CreatePropertyDTO = {
                name: req.body.name,
                description: req.body.description,
                maxGuests: req.body.maxGuests,
                basePricePerNight: req.body.basePricePerNight,
            }

            if (!dto.basePricePerNight) {
                throw new Error('The base price per night is required');
            }

            const property = await this.propertyService.createProperty(dto);
            return res.status(201).json({
                message: 'Property created successfully',
                property: {
                    id: property.getId(),
                    name: property.getName(),
                    description: property.getDescription(),
                    maxGuests: property.getMaxGuests(),
                    basePricePerNight: property.getBasePricePerNight(),
                }
            });
        } catch (error: any) {
            return res.status(400).json({ error: error.message || 'An unexpected error occurred' });
        }
    }
}