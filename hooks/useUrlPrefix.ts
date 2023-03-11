import { useAuthContext } from "../context/AuthContext";
import useRole from "./useRole";

export default function useUrlPrefix(){
    const {currentUser} =  useAuthContext()
    const {isAdmin, isManager, isSuperAdmin } = useRole()
    
    const urlPrefix = isManager || isSuperAdmin ? 'manager': isAdmin?'admin': 'users'
    return urlPrefix;
} 