var express = require ('express');
var router = express.Router();
var db = require.main.require ('./models/db_controller');
var bodyPaser = require ('body-parser');
router.get('*', function(req, res, next){
	if(req.cookies['username'] == null){
		res.redirect('/login');
	}else{
		next();
	}
});

router.get('/',async function(req,res){
    try {
        const result= await db.getcomplain();
		const data = await db.getInbox(req);
        res.render('inbox.ejs',{list :result, data: data});
    } catch(err) {
        console.error(err);
        res.status(500).send(err);
    }
	
});












module.exports =router;

