
exports.isAdmin = (req, res, next) => {
    if (req.userData.admin) {
        next()
    } else {
        return res.status(403).json({
            message: "Forbidden"
        });
    };
}

