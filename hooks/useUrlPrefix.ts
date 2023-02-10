import { useAuthContext } from "../context/AuthContext";

export default function useUrlPrefix(){
    const {currentUser} =  useAuthContext()
    const urlPrefix = currentUser.role == 1? 'manager': 'admin'
    return urlPrefix;
}