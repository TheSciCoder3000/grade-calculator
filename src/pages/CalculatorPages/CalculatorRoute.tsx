import { Modal, MSwitch } from "@Components/Modal";
import { Route } from "react-router-dom";
import CalculatorDetails from "@Components/Calculator/Detail";
import CalculatorOverview from "@Components/Calculator/Overview";
import AddSubjects from "@Components/Modal/Froms/AddSubjects";
import RemoveSubjects from "@Components/Modal/Froms/RemoveSubjects";
import RemoveFilter from "@Components/Modal/Froms/RemoveFilter";

/**
 * Calculator Route Component,
 * Used for routing the users to different calculator features
 * @returns JSX Element
 */
function CalculatorRoute() {
    return (
        <div className="calculator-app">
            <Route exact path="/calculator">
                <CalculatorOverview />
            </Route>
            <Route path="/calculator/:subjectId">
                <CalculatorDetails />
            </Route>
            <Modal>
                <MSwitch type="add-subject">
                    <AddSubjects />
                </MSwitch>
                <MSwitch type="delete-subject">
                    <RemoveSubjects />
                </MSwitch>
                <MSwitch type="remove-filter">
                    <RemoveFilter />
                </MSwitch>
            </Modal>
        </div>
    );
}

export default CalculatorRoute;
