  var createError = require('http-errors');
  var express = require('express');
  var path = require('path');
  var cookieParser = require('cookie-parser');
  var logger = require('morgan');
  var mongoose = require('mongoose');
  require('dotenv').config();

  //import routes

  var indexRouter = require('./routes/index');
  var authRouter = require('./routes/auth.route');
  

  var app = express();

  
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));



/*
esto es la conexion para type:"module"
  try{
    await mongoose.connect(process.env.URI_MONGO);
    console.log('Se conecto correctamente')
  }catch(err){  
    console.log(err);
  }
*/  


  mongoose.connect(process.env.URI_MONGO)
  .then(()=>{
    console.log('Se conecto correctamente')
  })
  .catch((err)=>{
    console.log(err); 
  })

  //routes

  //app.use('/', indexRouter); useful if we have views
  app.use('/api/v1', authRouter);


  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  module.exports = app;
