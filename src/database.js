const mongoose = require('mongoose');
//Connecting to mongoDB
// seNewUrlParser: true, == Requerido desde mongo v>=4.0
// useUnifiedTopology: true, == Requerido desde mongose v>=5.7
mongoose.connect('mongodb://localhost/mongo-DB', { 
	useCreateIndex: true, 
	useNewUrlParser: true, 
	useFindAndModify: false, 
	useUnifiedTopology: true 
}) 
.then(db => console.log('DB connected'))
.catch(err => console.log(err));