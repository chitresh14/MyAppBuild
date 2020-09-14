const apiTimeout = function(req, res, next){
	setTimeout(function(){
		res.status(408).send({ code: 408, msg: 'API TIMEOUT' });
	},10000);
	next();
}

module.exports = {
    apiTimeout: apiTimeout
}