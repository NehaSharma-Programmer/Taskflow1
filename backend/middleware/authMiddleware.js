const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    console.log(req.headers.authorization);
    console.log(process.env.JWT_SECRET);

    console.log("HEADERS =>", req.headers);

    let token = req.headers.authorization;

    console.log("AUTH =>", token);

    if (!token) {
        return res.status(401).json({
            message: "No Token"
        });
    }

    token = token.split(" ")[1];

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("DECODED =>", decoded);

        req.user = decoded;

        next();

    } catch (error) {

        console.log(error);

        return res.status(401).json({
            message: "Invalid Token"
        });

    }

};

module.exports = protect;