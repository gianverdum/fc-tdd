import { config } from 'dotenv';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { DataSource, EntitySchema } from 'typeorm';

config();

export type TestDBContext = {
  container: StartedTestContainer;
  dataSource: DataSource;
};

function getEnvOrThrow(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}
/**
 * Creates a PostgreSQL test container with a TypeORM DataSource configured.
 * @param entities - Array of entities to register in the DataSource.
 */
export async function createTestPostgresDataSource(
  entities: (string | Function | EntitySchema<any>)[]
): Promise<TestDBContext> {
  const POSTGRES_USER = getEnvOrThrow('POSTGRES_USER');
  const POSTGRES_PASSWORD = getEnvOrThrow('POSTGRES_PASSWORD');
  const POSTGRES_DB = getEnvOrThrow('POSTGRES_DB');
  const POSTGRES_PORT = parseInt(getEnvOrThrow('POSTGRES_PORT') || '5432', 10);

  const container = await new GenericContainer('postgres')
    .withEnvironment({
      POSTGRES_USER,
      POSTGRES_PASSWORD,
      POSTGRES_DB,
    })
    .withExposedPorts(POSTGRES_PORT)
    .start();

  const dataSource = new DataSource({
    type: 'postgres',
    host: container.getHost(),
    port: container.getMappedPort(POSTGRES_PORT),
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB,
    synchronize: false,
    logging: false,
    entities,
    migrations: ['src/database/migrations/*.ts'],
  });

  await dataSource.initialize();
  await dataSource.runMigrations();

  return { container, dataSource };
}