const path = require('path');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');


const app = express();


//Connecting to mongoDB
// seNewUrlParser: true, == Requerido desde mongo v>=4.0
// useUnifiedTopology: true, == Requerido desde mongose v>=5.7
mongoose.connect('mongodb://localhost/mongo-BD', { useNewUrlParser: true, useUnifiedTopology: true }) 
.then(db => console.log('DB connected'))
.catch(err => console.log(err));

//Importing routes
const indexRoutes = require('./routes/index');

//Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//Middlwares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));

//Routes
app.use('/', indexRoutes);

// Starting the server
app.listen(app.get('port'), () => {
	console.log(`Server on port ${app.get('port')}`);
});