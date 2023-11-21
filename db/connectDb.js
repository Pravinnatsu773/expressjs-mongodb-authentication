const mongoose = require('mongoose')


const connectDB = (Url)=>{
   
    return mongoose.connect(Url).then(()=>console.log('CONNECTED TO DB....')).catch((err)=>console.log(err))
}

module.exports = connectDB