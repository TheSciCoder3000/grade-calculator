import React, { useRef } from 'react'
import { FirebaseAuthType } from '../../../Firebase'

interface LoginProps {
    onLogIn: FirebaseAuthType['AuthFunctions']['AuthLogIn']
}
const Login: React.FC<LoginProps> = ({ onLogIn }) => {
    // HTML References
    const email = useRef<HTMLInputElement>(null)
    const password = useRef<HTMLInputElement>(null)

    // on Log In Event
    const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (email.current && password.current && email.current.value !== '' && password.current.value !== '') {
            console.log('authenticating user')
            onLogIn(email.current.value, password.current.value)
        }
    }
    return (
        <div className='log-in'>
            <div className="log-in__cont">
                <h2>Create an Account</h2>
                <p>Save your grades and easily track your progress by creating an account</p>
                <form onSubmit={onSubmitHandler}>
                    <label htmlFor="email-input">Email</label>
                    <input ref={email} type="text" id="email-input" className='form-input' />
                    <label htmlFor="password-input" className="input-label">Password</label>
                    <input ref={password} type="password" id="password-input" className="form-input" />
                    <button className="form-submit-btn">Log In</button>
                </form>
            </div>
        </div>
    )
}

export default Login
