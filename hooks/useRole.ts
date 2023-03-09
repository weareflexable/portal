import { useAuthContext } from "../context/AuthContext";

export default function useRole(){
    const {currentUser} = useAuthContext()

    const isAdmin = currentUser && currentUser.role == 2;
    const isManager =currentUser && currentUser.role == 1;
    const isSupervisor =currentUser && currentUser.role == 3;
    const isEmployee = currentUser && currentUser.role == 4;
    const isUser = currentUser && currentUser.role == 5;

    return {isAdmin, isManager, isSupervisor, isEmployee, isUser}
}