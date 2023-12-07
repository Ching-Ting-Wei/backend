/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  return knex('users').truncate().
    then(function(){

      return knex('users').insert([{
          user:'qqqs',
          pwd:'aaa'
      }]).then(function(){
        const newPost = {
        user_id: 1,
        title: 'New Post Title',
        content: 'This is the content of the new post.',
        };

        return knex('Posts').insert(newPost)
      })
    })
};

// const newPost = {
//   user_id: 1,
//   title: 'New Post Title',
//   content: 'This is the content of the new post.',
// };

// return knex('Posts').insert(newPost)