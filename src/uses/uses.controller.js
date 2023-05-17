const uses = require('../data/uses-data')
const urls = require('../data/urls-data')

let nextId = 3;

function list(req,res,next){
    let {urlId} = req.params
    if(urlId){
        urlId = Number(urlId)
        const filteredUses = uses.filter(use=> use.urlId === urlId);
        res.send({data: filteredUses})
    }else{
        res.send({data: uses})
    }
}

function validateUseExists(req,res,next){
    let index = uses.findIndex(use => use.id === Number(req.params.useId));
    if (index > -1){
        res.locals.index = index;
        res.locals.use = uses[index];
        next();
    }else{
        next({
            status: 404,
            message: `could not find use with id ${req.params.useId}`
        })
    }
}


function read(req,res,next){
    res.send({data: res.locals.use})
}

function destroy(req,res,next){
    uses.splice(res.locals.index, 1);
    res.status(204).send();
}


//------ validate url exists
function validateUrlExists(req,res,next){

    let {urlId} = req.params; 
    
    if(urlId){
      urlId = Number(urlId);
      let index = urls.findIndex(url => url.id === urlId);
      if(index < 0){
          next({
              status: 404,
              message: `could not find url with id ${urlId}`
          })
      } else{
          next();
      }      
    }else{
      next()
    }

}

module.exports = {
    list: [validateUrlExists, list],
    read: [validateUrlExists, validateUseExists, read],
    destroy:[validateUseExists, destroy]
}