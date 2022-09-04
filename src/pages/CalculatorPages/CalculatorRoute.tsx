import { Modal, MSwitch } from "@Components/Modal";
import { Route } from "react-router-dom";
import CalculatorDetails from "@Components/Calculator/Detail";
import CalculatorOverview from "@Components/Calculator/Overview";
import AddSubjects from "@Components/Modal/Froms/AddSubjects";
import RemoveSubjects from "@Components/Modal/Froms/RemoveSubjects";
import RemoveFilter from "@Components/Modal/Froms/RemoveFilter";
import { useFirestore } from "@useFirebase";
import { IUserDoc } from "Firebase/FirebaseDb";

/**
 * Calculator Route Component,
 * Used for routing the users to different calculator features
 * @returns JSX Element
 */
function CalculatorRoute() {
    const { userData } = useFirestore();
    // const userData = {} as IUserDoc;
    return (
        <div className="calculator-app">
            <Route exact path="/calculator">
                {userData ? <CalculatorOverview userData={userData} /> : <>Loading...</>}
            </Route>
            <Route path="/calculator/:subjectId">
                <CalculatorDetails />
            </Route>
            <Modal>
                <MSwitch key="0" type="add-subject">
                    <AddSubjects />
                </MSwitch>
                <MSwitch key="1" type="delete-subject">
                    <RemoveSubjects />
                </MSwitch>
                <MSwitch key="2" type="remove-filter">
                    <RemoveFilter />
                </MSwitch>
            </Modal>
        </div>
    );
}

export default CalculatorRoute;
