// src/database/datasource-cli.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { BookingEntity } from '../infrastructure/persistence/entities/booking_entity';
import { PropertyEntity } from '../infrastructure/persistence/entities/property_entity';
import { UserEntity } from '../infrastructure/persistence/entities/user_entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  migrations: ['src/database/migrations/*.ts'],
  entities: [BookingEntity, PropertyEntity, UserEntity],
});
