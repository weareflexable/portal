import { useAuthContext } from "../context/AuthContext";
import useRole from "./useRole";

export default function useUrlPrefix(){
    const {currentUser} =  useAuthContext()
    const {isAdmin, isManager, isSuperAdmin } = useRole()

    const urlPrefix = isManager ? 'manager': isAdmin?'admin': isSuperAdmin?'superadmin': 'users'
    return urlPrefix;
} 