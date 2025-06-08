import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table: Knex.TableBuilder) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email').unique().notNullable();
    table.string('username').unique().notNullable();
    table.string('password').notNullable();
    table.string('firstName').notNullable();
    table.string('lastName').notNullable();
    table.string('avatar').nullable();
    table.enum('role', ['user', 'admin', 'developer']).defaultTo('user');
    table.boolean('isActive').defaultTo(true);
    table.boolean('isEmailVerified').defaultTo(false);
    table.timestamp('emailVerifiedAt').nullable();
    table.string('emailVerificationToken').nullable();
    table.string('passwordResetToken').nullable();
    table.timestamp('passwordResetTokenExpires').nullable();
    table.timestamp('lastLoginAt').nullable();
    table.timestamps(true, true);
    
    // Indexes
    table.index(['email']);
    table.index(['username']);
    table.index(['role']);
    table.index(['isActive']);
    table.index(['isEmailVerified']);
    table.index(['createdAt']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
} 