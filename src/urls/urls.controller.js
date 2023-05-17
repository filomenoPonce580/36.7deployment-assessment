const urls = require('../data/urls-data')
const uses = require('../data/uses-data')


let nextId = 3;

function list(req,res,next){
    res.send({ data: urls })
};

function validateHref(req,res,next){
  //checks for input data
    if(!req.body.data || !req.body.data.href ){
        next({
            status: 400,
            message: 'create request must include an href in the request body'
        });
    } else {
        res.locals.href = req.body.data.href
        next();
    }
}

function create(req,res,next){
    let newUrl ={
        id: nextId,
        href : req.body.data.href
    }
    nextId++
    urls.push(newUrl)
    res.status(201).send({ data : newUrl })
}

function validateUrlExists(req,res,next){

    let {urlId} = req.params; 
    urlId = Number(urlId);
    let index = urls.findIndex(url => url.id === urlId);
    if(index < 0){
        next({
            status: 404,
            message: `could not find url with id ${urlId}`
        })
    } else{
        res.locals.index = index;
        res.locals.url = urls[index];
        next();
    }
}

function read(req,res,next){
    uses.push({
        id: nextId,
        urlId: Number(req.params.urlId),
        time: Date.now()
    });
    nextId++;
    res.json({data:res.locals.url})
}

//------UPDATE-----------
function update(req, res, next) {
    //new data being input
    const newHref = res.locals.href;
    const url = res.locals.url;
     
    const { data: { href } = {} } = req.body;
  
    // update the href to be url
     url.href = newHref;
  
    res.json({ data: url });
  }


module.exports = {
    list,
    create: [validateHref, create],
    read: [validateUrlExists, read],
    update: [validateUrlExists, validateHref, update]
}