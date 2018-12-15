const express  = require('express');
const app      = express();
const port     = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const cors = require('cors')
require('dotenv').config()
const registerRoute = require('./routes/register')
const articleRoute = require('./routes/article')
const commentRoute = require('./routes/comment')
const adsRoute = require('./routes/ads')

const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/blogYF_' + NODE_ENV,{useNewUrlParser: true}); //Use this for testing

const mongodbUri = 'mongodb://@ds157503.mlab.com:57503/blog'
mongoose.connect(mongodbUri,
    {
      useNewUrlParser: true,
      auth: {
        user: process.env.mlab_user,
        password: process.env.mlab_password
      }
    });
    
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

app.use('/register', registerRoute)
app.use('/articles', articleRoute)
app.use('/comments', commentRoute)
app.use('/ads', adsRoute)

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})

module.exports = app;
