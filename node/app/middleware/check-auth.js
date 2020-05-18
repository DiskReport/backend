const jwt = require('jsonwebtoken');

const tokenInCookies = cookies => {
    try {
        if('jwtToken' in cookies){
            return cookies.jwtToken
        }else{
            return cookies['auth._token.local'].split(" ")[1]
        }
    }catch(error){
        console.log(error)
        return ""
    }
}

exports.isLogged = (req, res, next) => {
    try {
        const token = 'authorization' in req.headers? req.headers.authorization.split(" ")[1]: tokenInCookies(req.cookies)
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next()
    } catch(error){
        console.log("auth middleware error:"+JSON.stringify(error))
        return res.status(401)
            .cookie('jwtToken', '', { maxAge: 0 })
            .json({
                message: "Auth failed"
            });
    };
}

