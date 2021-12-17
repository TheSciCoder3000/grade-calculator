// import ls from 'local-storage'

import { useFirebaseAuth, useFirestore } from "@useFirebase";
import { useState } from "react";

export function useCalculatorDb() {
    const { AuthStatus } = useFirebaseAuth()
    // const {  } = useFirestore()
    const [dbDocs, setDbDocs] = useState(null)

    if (AuthStatus) {

    }
}