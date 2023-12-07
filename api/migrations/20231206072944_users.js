const knex = require("knex");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async knex => {
    await knex.schema.createTable('users',tbl =>{
        tbl.increments()
        tbl.string('user', 256).notNullable().unique()
        tbl.string('pwd', 256).notNullable()
    })
    .createTable('Posts', function(table) {
        table.increments('post_id').primary();
        table.integer('user_id').unsigned(); 
        table.string('title');
        table.text('content');

        table.foreign('user_id').references('Users.user_id'); 
    });

 
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async knex =>{
    await knex.schema.dropTableIfExists('users')
  
};

