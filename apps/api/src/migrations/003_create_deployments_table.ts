import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('deployments', (table: Knex.TableBuilder) => {
    table.increments('id').primary();
    table.integer('project_id').unsigned().notNullable().references('id').inTable('projects').onDelete('CASCADE');
    table.string('status').notNullable().defaultTo('PENDING');
    table.string('url').unique();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('deployments');
} 