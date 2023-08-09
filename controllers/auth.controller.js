var UserModel = require('../models/User');
var jwt = require('jsonwebtoken');
const { generateToken, refreshTokenCookie } = require('../utils/tokenManager');
var bcryptjs = require('bcryptjs');


async function register(req,res){

    const {email,password} = req.body;
 //   console.log(req.body.email);
   // console.log(req.body.password);
    //res.json({ok:true});    
    try{
        const exists = await UserModel.findOne({email:req.body.email});
        const User = new UserModel({email,password});
        
        if(!exists){
            await User.save();
            //jwt token
    
            return res.json({ok:true});    
        }else{
            return res.status(400).send({msg:"Este user ya existe"})
        }

    }catch(err){
        console.log(err);
    }

}

async function login(req,res){
    try{
        var {email,password} = req.body;
        let user = await UserModel.findOne({email});

        // IMPORTANTEEEEE 

        // LA PALABRA THROW HACE QUE TE MANDE DIRECTAMENTE AL APARTADO CATCH

        if(!user){ 
            res.status(400).send({msg:"No existe este user"});
        }else{
            console.log(password);
            console.log(user.password);    
            var respuesta = await user.comparePassword(password);
//            var respuesta2 = await bcryptjs.compare(password,user.password);

            if(respuesta){
                // se genera el token
                    
                //const token = generateToken(user.id);
                //console.log(token);
                
                //COOKIEEEEEEE
                /*
                res.cookie("token",token.token,{
                    httpOnly:true,
                    secure:!(process.env.MODO ==="developer")
                });
                */
                refreshTokenCookie(user.id,res);
                
                res.json({ok:true});
                
               // res.json({ok:true,token:token});

            }else{
                res.status(400).send({msg:"Respuesta incorrecta"});
            }


            
        }

    }catch(err){

    }


}


async function infoUser(req,res){
    try{
        //Si el token es valido entonces tendremos el userID en el req
        //buscamos la info del usuario en base la userID que tenemos en el req
        const user = await UserModel.findById(req.uid).lean(); 
        console.log(user);
        return res.json({email:user.email,uid:user.id});
    }catch(err){
        console.log(err);
    }

}

function refreshToken(req,res){
    try {
        const refreshToken = req.cookies.refreshTokenCookie;
        if(!refreshToken){
            throw new Error('No existe token');
        }        
        console.log(refreshToken);
        const {uid} = jwt.verify(refreshToken,process.env.JWT_REFRESH)

        const {token,expiresIn} = generateToken(uid);

        return res.json({token,expiresIn});
    } catch (error) {
        
        console.log(error);

    }

    


}

function logout(req,res){

    try{
        res.clearCookie('refreshTokenCookie');
        res.json({ok:true});
    
    }catch(err){
        console.log(err);
    }

}

module.exports = {
    register,
    login,
    infoUser,
    refreshToken,
    logout
}