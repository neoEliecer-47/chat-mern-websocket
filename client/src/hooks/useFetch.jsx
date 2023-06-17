const useFetch = async (endpoint, method = "GET", userData = null) => {
    const res = await fetch("http://localhost:8080/api/v1" + endpoint, {
        method: method,
        credentials: "include",

        //mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    return res;
};

export default useFetch;
