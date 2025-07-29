import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { DataSource } from 'typeorm';

export type TestDBContext = {
  container: StartedTestContainer;
  dataSource: DataSource;
};

/**
 * Creates a PostgreSQL test container with a TypeORM DataSource configured.
 * @param entities - Array of entities to register in the DataSource.
 */
export async function createTestPostgresDataSource(
  entities: (string | Function | import('typeorm').EntitySchema<any>)[]
): Promise<TestDBContext> {
  const container = await new GenericContainer('postgres')
    .withEnvironment({
      POSTGRES_USER: 'test',
      POSTGRES_PASSWORD: 'test',
      POSTGRES_DB: 'test',
    })
    .withExposedPorts(5432)
    .start();

  const port = container.getMappedPort(5432);
  const host = container.getHost();

  const dataSource = new DataSource({
    type: 'postgres',
    host,
    port,
    username: 'test',
    password: 'test',
    database: 'test',
    synchronize: true,
    logging: false,
    entities,
  });

  await dataSource.initialize();

  return { container, dataSource };
}