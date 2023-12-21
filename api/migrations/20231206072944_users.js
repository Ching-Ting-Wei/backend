const knex = require("knex");
const moment = require('moment-timezone');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const taiwanTime = moment().tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss');

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
        table.timestamp('created_at').defaultTo(knex.raw(`'${taiwanTime}'`)); // 加入台灣當前時間
    });

 
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async knex =>{
    await knex.schema.dropTableIfExists('users')
  
};

