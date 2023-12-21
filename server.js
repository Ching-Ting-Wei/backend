const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const server = express()
const session = require('express-session');
const db = require('./api/dbConfig')
const bcrypt = require('bcrypt')
const saltRound = 10

const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
    
}

server.use(cors(corsOptions))
server.use(helmet())
server.use(express.json())
server.use(session({
    secret: '2a80268408105f37d37ccb00cc2dcc35c5cb9171df353f2bb853feb3c15a5f2ef76d3929b133f129dc60568178ce56acfba3eadc32f4cdc4030cb7710d12093c', // 建議使用一個隨機的字符串作為密鑰
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60 * 60 * 10000 // 1 小時的毫秒數
    }
  }));
  
// npx knex migrate:make users
// npx knex migrate:latest
// npx knex seed:make 001
// npx knex seed:run

server.get('/test', async(req, res) => {
    try {
        const posts = await db('Posts')
        res.json(posts); // 回傳所有貼文及使用者資訊
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

server.get('/getmessage', async(req, res) => {
    try {
        const posts = await db.select('Posts.*', 'Users.user')
            .from('Posts')
            .innerJoin('Users', 'Posts.user_id', 'Users.id')
            .orderBy('Posts.post_id', 'desc');
        
        res.json(posts); // 回傳所有貼文及使用者資訊
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


server.get('/users', async(req, res)=>{
    // GET all users
    try{
        const users = await db('users')
        res.json(users)
        
    }catch(err){
        console.log(err)
    }
});


server.get('/checkLoginStatus', (req, res) => {
    console.log(req.session)
    console.log(req.session.userId)
    if (req.session && req.session.userId) {
      db('users').where({ id: req.session.userId }).first()
        .then(user => {
          if (user) {
            res.status(200).json({ loggedIn: true, user });
          } else {
            res.status(401).json({ loggedIn: false });
          }
        })
        .catch(() => {
          res.status(500).send('Error checking login status');
        });
    } else {
      res.status(401).json({ loggedIn: false });
    }
});


server.post('/newMessage', async(req, res) => {
    const newPost = req.body
     try{
        await db('Posts').insert(newPost)
        res.status(201).json({message: 'success'})
    }catch(err){
        console.log(err)
    }
}); 

server.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        res.status(500).send('Error logging out');
      } else {
        res.clearCookie('connect.sid'); // 清除 session cookie
        res.status(200).json({ message: 'Logout successful' });
      }
    });
});
  
server.post('/register', async(req, res)=>{

    const {user, pwd} = req.body
    const salt = await bcrypt.genSalt(saltRound)
    const hash = await bcrypt.hash(pwd, salt)

    if(!user){
        return res.status(400).json({message: 'check'})
    }
    try{
        await db('users').insert({user: user, pwd: hash})
        res.status(201).json({message: 'success'})
    }catch(err){
        console.log(err)
    }
})


server.post('/auth', async(req, res)=>{
    const {user, pwd} = req.body
    try{
        u = await db('users').where("user", user)
        users = await db('users').where("user", user).select('pwd')
        .then(async (result) => {
        if (result.length > 0) {
            const storedPassword = result[0].pwd;
            const auth = await bcrypt.compare(pwd,  storedPassword)
            if (auth) {
                req.session.userId = u[0].id;
                res.status(200).json({ loggedIn: true, user ,userId: u[0].id});
                
            } else {
                res.status(401).json({ message: 'Invalid password' });
            }
        } else {
            res.status(400).json({ message: 'User not found' });
        }
    })
    }catch(err){
        console.log(err)
    }
})

server.put('/users/:id', async (req, res)=>{
    // PUT a user
    const {id} = req.params
    const {nickname} = req.body
    if(!nickname){
        return res.status(400).json({message: 'check'})
    } 

    try{
        await db('users').where({id}).update({nickname})
        res.status(200).json({message: 'update success'})
        
    }catch(err){
        console.log(err)
    }
})

server.delete('/users/:id', async (req, res)=>{
    // DELETE a user
    const {id} = req.params
    try{
        await db('users').where({id}).del()
        res.status(200).json({message: 'delete success'})
    }catch(err){
        console.log(err)
    }

})

server.delete('/posts/:post_id', async (req, res)=>{
    // DELETE a user
    const {post_id} = req.params
    try{
        await db('Posts').where({post_id}).del()
        res.status(200).json({message: 'delete success'})
    }catch(err){
        console.log(err)
    }

})

module.exports = server