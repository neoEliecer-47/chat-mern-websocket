import User from "../models/userModel.js";
import { generateToken } from "../utils/tokenManager.js";

export const register = async (req, res) => {
    const { name, phone, country, email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user)
            return res.status(400).json({
                data: "usuario ya registrado, ingrese un email válido",
            });

        const userDoc = new User({ name, phone, country, email, password });
        await userDoc.save();

        const { token } = generateToken(userDoc._id);
        res.cookie("token",token, { sameSite: "none", secure: true } ).status(201).json(userDoc);
    } catch (error) {
        console.log(error);
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(404).json("este usuario no existe");
        const reqPassword = await user.comparePassword(password); //esto es una promesa, retorna true o false, por eso el uso del await

        if (!reqPassword)
            return res.status(400).json({ error: "contraseña incorrecta" }); //bad request
        const { name, _id } = user;
        const { token } = generateToken(user._id);
        res.cookie("token", token, { sameSite: "none", secure: true }).json({
            name,
            _id,
        });
    } catch (error) {
        res.status(500).json(error.message);
    }
};

export const profile = async (req, res) => {
    try {
        const { name, _id, country, email } = await User.findById(req.uid);
        res.status(200).json({ name, _id, country, email });
    } catch (error) {
        res.status(500).json(error.message);
    }
};


export const getOnlinePeople =  async (req, res) => {
    try {
        const users = await User.find({}, {'_id': 1, name: 1})
        res.status(200).json(users)
    } catch (error) {
        
    }
}


export const logout = (req, res) => {
    res.cookie("token", "", {sameSite: 'none', secure: true}).json('token elimiinada')

}