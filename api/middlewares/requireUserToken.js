import jwt from "jsonwebtoken";

const requireUserToken = (req, res, next) => {
    const { token } = req?.cookies;

    if (token) {
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = uid;
        next();
    } else {
        res.status(401).json("no token");
    }

    try {
    } catch (error) {
        console.log(error.message);
    }
};

export default requireUserToken;
