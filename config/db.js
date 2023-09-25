const mongoose =require('mongoose');

const connnection = mongoose.createConnection(`mongodb://127.0.0.1:27017/newMedical`).on('open',()=>{
    console.log("MongoDb Connected");
}).on('error',()=>{
    console.log("MongoDb connection error");
});

module.exports= connnection;