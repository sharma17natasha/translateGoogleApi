const express= require('express');
const router=express.Router();
const {cache }=require('../middlewares/cache');
const {validateTranslateApi} = require('../middlewares/validation')

const {translateText}= require('../controllers/translateText');

router.post('/translate',validateTranslateApi,cache,translateText);

module.exports=router;