import { useAuthContext } from "../context/AuthContext";

export default function useRole(){
    const {currentUser} = useAuthContext()

    const isAdmin = currentUser.role == 2;
    const isManager = currentUser.role == 1;
    const isSupervisor = currentUser.role == 3;
    const isEmployee = currentUser.role == 4;
    const isUser = currentUser.role == 5;

    return {isAdmin, isManager, isSupervisor, isEmployee, isUser}
}