import React, { useRef, useState } from 'react'
import { User } from 'firebase/auth';
import { NavLink as Link, useHistory } from 'react-router-dom'
import { useFirestore } from '@useFirebase';

interface SignUpProps {
    onSignUp: (email: string, password: string) => Promise<User | null>
}


const SignUp: React.FC<SignUpProps> = ({ onSignUp }) => {
    const history = useHistory()
    // HTML References
    const email = useRef<HTMLInputElement>(null)
    const password = useRef<HTMLInputElement>(null)
    const [signing, setSigning] = useState(false)
    const { dbFunctions } = useFirestore()


    // On Sign Up Event
    const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSigning(true)
        console.log('checking if email and pass is good', email.current)
        if (email.current && password.current && email.current.value !== '' && password.current.value !== '') {
            console.log('authenticating user')
            onSignUp(email.current.value, password.current.value)
                .then(user => {
                    if (user) dbFunctions.fetchUserData(user.uid)
                    history.push('/')
                })
                .catch(() => setSigning(false))
        }
    }

    return (
        <div className='sign-up auth-form-cont'>
            <div className="sign-up__cont">
                <h2>Create an Account and <br /> Start Calculating Now</h2>
                <p>Already have an Account? <Link className="alter-link" to="/auth/login">Log In Now</Link> </p>
                <form onSubmit={onSubmitHandler}>
                    <input ref={email} type="text" id="email-input" className='form-input' placeholder="Email" />
                    <input ref={password} type="password" id="password-input" className="form-input" placeholder="Password" />
                    <button disabled={signing} className="form-submit-btn">Sign Up</button>
                </form>
            </div>
        </div>
    )
}

export default SignUp
