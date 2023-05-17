const express = require("express");
const app = express();

app.use(express.json());

// TODO: Add code to meet the requirements and make the tests pass.
const urlsRouter = require('./urls/urls.router')
const usesRouter = require('./uses/uses.router')
app.use('/urls', urlsRouter)
app.use('/uses', usesRouter)


//not found
app.use((req,res,next)=>{
    //console.log(req)
    next({
        status: 404,
        message: `URL not found: ${req.originalUrl}`
    })
})


//error handler
app.use((err, req, res, next) => {
    let {status = 500, message = ' server error'} = err;
    res.status(status).send({error: message})
})
module.exports = app;
