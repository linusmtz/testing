var mongoose = require('mongoose');
var bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,  //limpia los campos a la izq o der
        unique:true,    //unicos 
        lowercase:true, // los convierte todos en lowercase
        index:{ // para que se genere como un id? maybe
            unique:true
        }

    },
    password:{
        type:String,
        required:true
    }
})

userSchema.pre("save",async function(next){
    const user = this;
    if(!user.isModified('password')){
        return next();
    }
    try{
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(user.password,salt);
    
        next();
    }catch(err){
        console.log(err);
        throw new Error('fallo el hash de contrasena')
    }
})

userSchema.methods.comparePassword = async function(clientPassword){ // password con la que se intenta logear user
    return await bcryptjs.compare(clientPassword,this.password);
}


const User = mongoose.model('User',userSchema);

module.exports = User;