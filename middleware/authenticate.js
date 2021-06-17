function authenticate(req, res, next) {
    if (!req.session || !req.session.username) {
        /* const error = new Error("Not authenticated");
        error.statusCode = 401;
        next(error); */
        res.redirect("/login");
    }
    next();
}

module.exports = authenticate;