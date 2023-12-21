const knex = require("knex");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async knex => {
    await knex.schema.createTable('users',tbl =>{
        tbl.increments() // id 
        tbl.string('user', 256).notNullable().unique() // user
        tbl.string('pwd', 256).notNullable() //password
    })
    .createTable('Posts', function(table) {
        table.increments('post_id').primary();
        table.integer('user_id').unsigned(); 
        table.string('title'); // 標題
        table.text('content'); // 子題目有幾個

        table.foreign('user_id').references('Users.id'); 
    });

 
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async knex =>{
    await knex.schema.dropTableIfExists('users')
  
};

