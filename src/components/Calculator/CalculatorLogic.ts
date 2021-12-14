// import ls from 'local-storage'

import { useState } from "react";

export function useCalculatorDb() {
    const [dbDocs, setDbDocs] = useState(null)

    return [dbDocs, setDbDocs]
}