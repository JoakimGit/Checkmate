function authenticate(req, res, next) {
    if (!req.session || !req.session.username) {
        console.log("Requested path:", req.originalUrl);
        console.log("Session:", req.session);
        const error = new Error("Not authenticated");
        error.statusCode = 401;
        next(error);
    }
    next();
}

module.exports = authenticate;