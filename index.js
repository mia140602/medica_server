const app=require('./app');
const db= require('./config/db')
const UserModel=require('./model/user_model')

const port =8000;

app.get('/',(req,res)=> {
    res.send("hello World");
})

app.listen(port,()=>{
    console.log(`Server Listening on Port http://localhost:${port}`);
});