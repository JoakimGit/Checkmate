function authenticate(req, res, next) {
    if (!req.session || !req.session.username) {
        res.redirect("/login");
        return;
    }
    next();
}

module.exports = authenticate;