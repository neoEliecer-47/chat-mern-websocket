import jwt from "jsonwebtoken";

export const generateToken = (uid) => {
    try {
        const token = jwt.sign({ uid }, process.env.JWT_SECRET, {});
        return { token };
    } catch (error) {
        console.log(error.message);
    }
};
