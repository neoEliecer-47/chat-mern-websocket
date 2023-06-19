
import { Formik } from "formik";
import ChatIcon from "../assets/icons/ChatIcon";
import useFetch from "../hooks/useFetch";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

const LoginPage = () => {
    const { user, setUser } = useUserContext();
    const navigate = useNavigate();
    console.log(user);
    

    const onSubmit = async (
        values,
        { setSubmitting, setErrors, resetForm }
    ) => {
        try {
            /*  await axios
                .post("http://localhost:8080/api/v1/auth/register", {
                    name: values.name,
                    country: values.country,
                    phone: values.phone,
                    email: values.email,
                    password: values.password,
                })
                .then((res) => console.log(res))
                .catch((err) => console.log(err.message));*/
            const res = await useFetch("/auth/login", "POST", {
                email: values.email,
                password: values.password,
            });

            if (res.status === 404)
                //not found
                return setErrors({
                    email: "¡este email no está registrado! verifique o regístrese",
                });
            if (res.status === 400)
                //bad request
                return setErrors({
                    password: "¡contraseña incorrecta!",
                });
            const data = await res.json();
            setUser(data);
            alert("bienvenido");
            resetForm();
            return navigate("/chat");
        } catch (error) {
            console.log(error);
        } finally {
            setSubmitting(false);
        }
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("ingrese un email válido")
            .trim()
            .required("el email es requerido"),
        password: Yup.string()
            .trim()
            .min(3, "mínimo 3 caracteres")
            .required("la contraseña es requerida"),
    });

    
    if(user) return navigate('/chat')
    
    return (
        <div className="bg-blue-50 h-screen">
            <h2 className="text-blue-900 text-2xl font-extrabold flex gap-2 underline p-6">
                <ChatIcon fill={"#FFF"} />
                E-chat
            </h2>
            <h1 className="text-center text-3xl text-gray-800 my-4 font-semibold ">
                Login
            </h1>
            <Formik
                initialValues={{
                    email: "guestUser@test.com",
                    password: "123",
                }}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                {({
                    values,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    errors,
                    touched,
                    handleBlur,
                }) => (
                    <form className="w-80 mx-auto" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={values.email}
                            name="email"
                            placeholder="email"
                            onChange={handleChange}
                            className={`block w-full rounded-sm p-2 mb-1 border`}
                            onBlur={handleBlur}
                        />
                        <p className={errors.name && "text-red-500 font-sans"}>
                            {errors.email && touched.email && errors.email}
                        </p>

                        <input
                            type="password"
                            value={values.password}
                            name="password"
                            placeholder="password"
                            onChange={handleChange}
                            className="block w-full rounded-sm p-2 mb-1 border"
                            onBlur={handleBlur}
                        />
                        <p
                            className={
                                errors.password && "text-red-500 font-sans"
                            }
                        >
                            {errors.password &&
                                touched.password &&
                                errors.password}
                        </p>
                        <button
                            className="font-semibold bg-primary-blue text-white block w-56 sm:w-full rounded-sm p-1 sm:p-3 hover:bg-hover-blue duration-500"
                            disabled={isSubmitting}
                            type="submit"
                        >
                            Entrar
                        </button>
                        <p className="mt-1 text-gray-500">
                            no tienes cuenta todavia?{" "}
                            <Link
                                to={"/register"}
                                className="underline text-hover-blue hover:text-blue-600 duration-500"
                            >
                                regístrate
                            </Link>
                        </p>
                    </form>
                )}
            </Formik>
        </div>
    );
};

export default LoginPage;
