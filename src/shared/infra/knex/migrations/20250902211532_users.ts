import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('nome').notNullable();
    table.string('email').unique().notNullable();
    table.string('rua').notNullable();
    table.string('numero').notNullable();
    table.string('bairro').notNullable();
    table.string('complemento').notNullable();
    table.string('cidade').notNullable();
    table.string('estado').notNullable();
    table.string('cep').notNullable();
    table.enum('status', ['ativo', 'inativo']).notNullable().defaultTo('ativo');
    table.boolean('is_deleted').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
