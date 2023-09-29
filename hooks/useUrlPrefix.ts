
import useRole from "./useRole";

export default function useUrlPrefix(){
    const {isAdmin, isManager, isSuperAdmin } = useRole()

    const urlPrefix = isManager ? 'manager': isAdmin?'admin': isSuperAdmin?'superadmin': 'user'
    return urlPrefix;
} 