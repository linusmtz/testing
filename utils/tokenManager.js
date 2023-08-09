var jwt = require('jsonwebtoken');

//generate token with user ID

function generateToken(uid){
    const expiresIn = 60*15;
    try{
        const token = jwt.sign({uid},process.env.JWT_SECRET,{expiresIn})
        return {token,expiresIn};
    }catch(err){
        console.log(err);
    }
}


// when user log in we create refresh token in a cookie, then if user wanna see info then user must have
// the refresh token, for each request we generate a token with the refresh token.

function refreshTokenCookie(uid,res){
    const expiresIn = 60*60*24*30;
    try {
        const refreshTokenCookie = jwt.sign({uid},process.env.JWT_REFRESH,{expiresIn});
        res.cookie("refreshTokenCookie",refreshTokenCookie,{
            httpOnly:true,
            secure:!(process.env.MODO ==="developer"),
            expires:new Date(Date.now()+expiresIn*1000)
        });

    } catch (error) {
        console.log(error);
    }

}

module.exports = {
    generateToken,
    refreshTokenCookie
}