import { createContext,useState } from "react";

const UserType = createContext();

const UserContext = ({children}) => {

    const [userId, setUserId] = useState("");
    const [expoPushToken, setExpoPushToken] = useState("");

    return (
        <UserType.Provider value= {{userId,setUserId , expoPushToken, setExpoPushToken}}>
            {children}
        </UserType.Provider>
    )
}

export { UserType , UserContext }