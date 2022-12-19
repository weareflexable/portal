import { NextPage } from "next";

export const Lounge: NextPage = ()=>{

    // read current user role from context
    // if user is manager, then render view for manager
    // if user is admin, render view for admin

    return(
        <div>
            <div>View for org admin</div>
            <div>View for flexable manager</div>
        </div>
    )
}

export default Lounge