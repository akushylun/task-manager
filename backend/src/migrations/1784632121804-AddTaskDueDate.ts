import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTaskDueDate1784632121804 implements MigrationInterface {
    name = 'AddTaskDueDate1784632121804'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" ADD "dueDate" date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "dueDate"`);
    }

}
