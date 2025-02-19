import { useState, FormEvent } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

function SignUp() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [password, setPassword] = useState('');

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.FormEvent<HTMLInputElement>) => {
    const newEmail = e.currentTarget.value;
    setEmail(newEmail);
    setIsEmailValid(isValidEmail(newEmail));
  };

  const handleSignUpSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isEmailValid) return;
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        navigate('/');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  return (
    <>
      <div>
        <h1> Sign Up </h1>
        <form>
          <label htmlFor='email-address'>Email Address:</label>
          <input
            type='email'
            value={email}
            onChange={handleEmailChange}
            required
            id='email-address'
            name='email-address'
            placeholder='name@example.com'
          ></input>
          {!isEmailValid && <p>Email is invalid.</p>}
          <label htmlFor='password'>Password: </label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id='password'
            name='password'
            placeholder='Password'
          ></input>
        </form>
        <button type='submit' onClick={handleSignUpSubmit}>
          Create Account
        </button>
      </div>
    </>
  );
}

export default SignUp;
