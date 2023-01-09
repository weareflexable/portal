import ManagerOrgsLayout from "../../../components/Manager/Organizations/Layout";
import RejectedOrgs from "../../../components/Manager/Organizations/RejectedOrgs/RejectedOrgs";


export default function Denied(){
    return(
        <ManagerOrgsLayout>
            <RejectedOrgs/>
        </ManagerOrgsLayout>
    )
}