import { MigrationInterface, QueryRunner } from "typeorm";

export class DropTaskDueDate1784658306059 implements MigrationInterface {
    name = 'DropTaskDueDate1784658306059'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "dueDate"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" ADD "dueDate" date`);
    }

}
