import ApprovedOrgsTable from "../../../components/Manager/Organizations/ApprovedOrgsTable/ApprovedOrgsTable";
import ManagerOrgsLayout from "../../../components/Manager/Organizations/Layout";


export default function Approved(){
    return(
        <ManagerOrgsLayout>
            <ApprovedOrgsTable/>
        </ManagerOrgsLayout>
    )
}