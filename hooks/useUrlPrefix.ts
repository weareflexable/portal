import { useAuthContext } from "../context/AuthContext";
import useRole from "./useRole";

export default function useUrlPrefix(){
    const {currentUser} =  useAuthContext()
    const {isAdmin, isManager } = useRole()
    const urlPrefix = isManager? 'manager': isAdmin?'admin': 'users'
    return urlPrefix;
} 