import React, { useRef } from 'react'
import { FirebaseAuthType } from '../../../Firebase';

interface SignUpProps {
    onSignUp: FirebaseAuthType['AuthFunctions']['AuthSignUp']
}


const SignUp: React.FC<SignUpProps> = ({ onSignUp }) => {
    // HTML References
    const email = useRef<HTMLInputElement>(null)
    const password = useRef<HTMLInputElement>(null)

    // On Sign Up Event
    const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('checking if email and pass is good', email.current)
        if (email.current && password.current && email.current.value !== '' && password.current.value !== '') {
            console.log('authenticating user')
            onSignUp(email.current.value, password.current.value)
        }
    }

    return (
        <div className='sign-up'>
            <div className="sign-up__cont">
                <h2>Create an Account</h2>
                <p>Save your grades and easily track your progress by creating an account</p>
                <form onSubmit={onSubmitHandler}>
                    <label htmlFor="email-input">Email</label>
                    <input ref={email} type="text" id="email-input" className='form-input' />
                    <label htmlFor="password-input" className="input-label">Password</label>
                    <input ref={password} type="password" id="password-input" className="form-input" />
                    <button className="form-submit-btn">Sign Up</button>
                </form>
            </div>
        </div>
    )
}

export default SignUp
