import { MigrationInterface, QueryRunner } from "typeorm";

export class UserRoleEnum1784658353706 implements MigrationInterface {
    name = 'UserRoleEnum1784658353706'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Non-destructive varchar -> enum: create the type, then cast existing
        // values in place. The generated version DROPPED the column, which would
        // reset every existing role to the default and lose all admins.
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'admin')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" TYPE "public"."user_role_enum" USING "role"::text::"public"."user_role_enum"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'user'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" TYPE character varying USING "role"::text`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'user'`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    }

}
