import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('projects', (table: Knex.TableBuilder) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.text('description').nullable();
    table.string('repository').nullable();
    table.string('framework').notNullable();
    table.string('domain').nullable();
    table.string('subdomain').nullable();
    table.enum('status', ['active', 'inactive', 'building', 'error']).defaultTo('active');
    table.json('envVariables').nullable();
    table.json('buildSettings').nullable();
    table.string('rootDirectory').defaultTo('./');
    table.string('outputDirectory').defaultTo('./dist');
    table.string('installCommand').defaultTo('npm install');
    table.string('buildCommand').defaultTo('npm run build');
    table.string('devCommand').defaultTo('npm run dev');
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.jsonb('config');
    table.timestamps(true, true);
    
    // Indexes
    table.index(['user_id']);
    table.index(['status']);
    table.index(['framework']);
    table.index(['createdAt']);
    table.index(['name']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('projects');
} 