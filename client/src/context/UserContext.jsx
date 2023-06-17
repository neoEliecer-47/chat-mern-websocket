import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        
            axios
                .get("/auth/profile")
                .then((res) => {
                    setUser(res.data);
                    //console.log(res.data);
                })
                .catch((err) => console.log(err.message));
        
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
export const useUserContext = () => useContext(UserContext);
