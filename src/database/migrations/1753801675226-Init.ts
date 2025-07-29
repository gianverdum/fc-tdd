import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1753801675226 implements MigrationInterface {
    name = 'Init1753801675226'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "properties" ("id" uuid NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "max_guests" integer NOT NULL, "base_price_per_night" numeric NOT NULL, CONSTRAINT "PK_2d83bfa0b9fcd45dee1785af44d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bookings" ("id" uuid NOT NULL, "start_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP NOT NULL, "guest_count" integer NOT NULL, "total_price" numeric NOT NULL, "status" character varying NOT NULL, "property_id" uuid NOT NULL, "guest_id" uuid NOT NULL, CONSTRAINT "PK_bee6805982cc1e248e94ce94957" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_afa260d0e51f81520a480817702" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_b4403309538387262d97fdf2462" FOREIGN KEY ("guest_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_b4403309538387262d97fdf2462"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_afa260d0e51f81520a480817702"`);
        await queryRunner.query(`DROP TABLE "bookings"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "properties"`);
    }

}
