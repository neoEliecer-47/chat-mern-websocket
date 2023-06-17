import { Formik } from "formik";
import ChatIcon from "../assets/icons/ChatIcon";
import useFetch from "../hooks/useFetch";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

const RegisterPage = () => {
    const navigate = useNavigate();
    const { setUser } = useUserContext()
    //
        
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
            const res = await useFetch("/auth/register", "POST", {
                name: values.name,
                country: values.country,
                phone: values.phone,
                email: values.email,
                password: values.password,
            });

            if (res.status === 400)
                return setErrors({
                    email: "¡email ya registrado! ingrese otro",
                });
            if (res.ok === true) {
                const data = await res.json()
                alert("cuenta creada correctamente, ¡Bienvenido! ☺");
                setUser(data)
                navigate("/chat");
            }
            resetForm();
        } catch (error) {
            console.log(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const validationSchema = Yup.object().shape({
        phone: Yup.string().required("número es requerido"),

        name: Yup.string().trim().required("el usuario es requerido"),
        email: Yup.string()
            .email("ingrese un email válido")
            .trim()
            .required("el email es requerido"),
        password: Yup.string()
            .trim()
            .min(3, "mínimo 3 caracteres")
            .required("la contraseña es requerida"),
    });

    return (
        <div className="bg-blue-50 h-screen">
            <h2 className="text-blue-900 text-2xl font-extrabold flex gap-2 underline p-6">
                <ChatIcon fill={"#FFF"} />
                E-chat
            </h2>
            <h1 className="text-center text-3xl text-gray-800 my-4 font-semibold ">
                Registro
            </h1>
            <Formik
                initialValues={{
                    name: "",
                    country: "",
                    phone: "",
                    email: "",
                    password: "",
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
                            value={values.name}
                            name="name"
                            placeholder="Nombre o usuario"
                            onChange={handleChange}
                            className={`block w-full rounded-sm p-2 mb-1 border`}
                            onBlur={handleBlur}
                        />
                        <p className={errors.name && "text-red-500 font-sans"}>
                            {errors.name && touched.name && errors.name}
                        </p>
                        <section className="flex gap-2 rounded-sm p-2 mb-1 border">
                            <select
                                value={values.country}
                                name="country"
                                onChange={handleChange}
                            >
                                <option value={null}>Sel</option>
                                <option value="Venezuela">Ven</option>
                                <option value="México">Mex</option>
                                <option value="Colombia">Col</option>
                                <option value="Chile">Chi</option>
                                <option value="Argentina">Arg</option>
                            </select>

                            <input
                                type="text"
                                value={values.phone}
                                name="phone"
                                placeholder="teléfono"
                                onChange={handleChange}
                                className="block w-full rounded-sm p-2 mb-1 border"
                                onBlur={handleBlur}
                            />
                            <p
                                className={
                                    errors.phone && "text-red-500 font-sans"
                                }
                            >
                                {errors.phone && touched.phone && errors.phone}
                            </p>
                        </section>

                        <input
                            type="email"
                            value={values.email}
                            name="email"
                            placeholder="email"
                            onChange={handleChange}
                            className="block w-full rounded-sm p-2 mb-1 border"
                            onBlur={handleBlur}
                        />
                        <p className={errors.email && "text-red-500 font-sans"}>
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
                            Registrarse
                        </button>
                        <p className="mt-1 text-gray-500">
                            ya tienes cuenta?{" "}
                            <Link
                                to={"/login"}
                                className="underline text-hover-blue hover:text-blue-600 duration-500"
                            >
                                ir a login
                            </Link>
                        </p>
                    </form>
                )}
            </Formik>
        </div>
    );
};

export default RegisterPage;
