import React, { useRef } from 'react'
import { FirebaseAuthType } from '../../../Firebase'
import { NavLink as Link, useHistory } from 'react-router-dom'

interface LoginProps {
    onLogIn: FirebaseAuthType['AuthFunctions']['AuthLogIn']
}
const Login: React.FC<LoginProps> = ({ onLogIn }) => {
    const history = useHistory()
    // HTML References
    const email = useRef<HTMLInputElement>(null)
    const password = useRef<HTMLInputElement>(null)

    // on Log In Event
    const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (email.current && password.current && email.current.value !== '' && password.current.value !== '') {
            console.log('authenticating user')
            onLogIn(email.current.value, password.current.value).then(() => history.push('/'))
        }
    }
    return (
        <div className='log-in auth-form-cont'>
            <div className="log-in__cont">
                <h2>Log In To Your Account Now</h2>
                <p className='redirect-p'>Don't have an Account? <Link className="alter-link" to="/auth/signup">Create One Now</Link> </p>
                <form onSubmit={onSubmitHandler}>
                    <input ref={email} type="text" id="email-input" className='form-input' placeholder="Email" />
                    <input ref={password} type="password" id="password-input" className="form-input" placeholder='Password' />
                    <button className="form-submit-btn">Log In</button>
                </form>
            </div>
        </div>
    )
}

export default Login
