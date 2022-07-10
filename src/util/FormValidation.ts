/**
 * function that validates user inputs
 * TODO: add warning prompts there is an invalid input
 * @returns a list of functions to validate user inputs
 */
export default function FormValidation() {
    function isStringInputValid(value: string): boolean;
    function isStringInputValid(inputEl: HTMLInputElement): boolean;

    function isStringInputValid(input: unknown) {
        // initialize input string var
        let stringInput: string;

        // if input is string
        if (typeof input === "string") {
            // set stringInput var to input value
            stringInput = input as string;
        } else {
            // else, check if input is an object if not, throw error
            if (typeof input !== "object") throw new Error("improper arguments");

            // else input is a input element then get the value
            const inputEl = input as HTMLInputElement;
            stringInput = inputEl.value;
        }

        // initialize test cases
        const stringIsEmpty = /^\s*$/.test(stringInput);
        const exceedLimit = stringInput.length > 50;

        // return if input is valid
        return !(stringIsEmpty || exceedLimit);
    }

    function isNumberInputValid(value: number): boolean;
    function isNumberInputValid(inputEl: HTMLInputElement): boolean;

    function isNumberInputValid(input: unknown) {
        // initialize input number var
        let numberInput: number;

        // if input is a number
        if (typeof input === "number") {
            numberInput = input as number;
        } else {
            // else, check if input is an object if not, throw error
            if (typeof input !== "object") throw new Error("improper arguments");

            // else input is an input element then get the value
            const inputEl = input as HTMLInputElement;
            const rawNumberInput = inputEl.value;

            // try converting raw number input to number
            try {
                numberInput = parseInt(rawNumberInput);
            } catch (e) {
                // if error then return false
                console.error(e);
                return false;
            }
        }

        // initialize test cases
        const isNegative = numberInput < 0;

        return !isNegative;
    }

    function isEmailValid(value: string): boolean;
    function isEmailValid(inputEl: HTMLInputElement): boolean;

    function isEmailValid(input: unknown) {
        let emailInput: string;

        if (typeof input === "string") {
            emailInput = input as string;
        } else {
            if (typeof input !== "object") throw new Error("improper arguments");

            const inputEl = input as HTMLInputElement;
            emailInput = inputEl.value;
        }

        // initialize test cases
        const hasMail = emailInput.includes("@");
        let firstCharIsNum: boolean;
        try {
            firstCharIsNum = typeof parseInt(emailInput[0]) === "number";
        } catch (e) {
            console.error(e);
            firstCharIsNum = false;
        }

        return !(hasMail || firstCharIsNum);
    }

    function isPasswordValid(value: string, confirmValue: string): boolean;
    function isPasswordValid(inputEl: HTMLInputElement, confirmInputEl: HTMLInputElement): boolean;

    function isPasswordValid(input: unknown, confirmInput: unknown) {
        let passwordInput: string;
        let confirmPasswordInput: string;

        if (typeof input === "string" && typeof confirmInput === "string") {
            passwordInput = input as string;
            confirmPasswordInput = confirmInput as string;
        } else {
            if (typeof input !== "object" || typeof confirmInput !== "object")
                throw new Error("improper arguments");

            const inputEl = input as HTMLInputElement;
            passwordInput = inputEl.value;

            const confirmInputEl = confirmInput as HTMLInputElement;
            confirmPasswordInput = confirmInputEl.value;
        }

        const passwordsDoesNotMatch = passwordInput === confirmPasswordInput;
        return !passwordsDoesNotMatch;
    }

    return { isStringInputValid, isNumberInputValid, isEmailValid, isPasswordValid };
}
