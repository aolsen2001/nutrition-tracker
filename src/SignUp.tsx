import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { clsx } from 'clsx';
import './styles.css';

function SignUp() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(true);
  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState(new Map<string, string[]>());

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleEmailChange = (e: React.FormEvent<HTMLInputElement>) => {
    const newEmail = e.currentTarget.value;
    const newErrors = new Map(errors);

    setEmail(newEmail);

    if (!emailRegex.test(newEmail)) {
      newErrors.set('email', ['Email is invalid']);
      setValidEmail(false);
    } else {
      newErrors.set('email', []);
      setValidEmail(true);
    }

    setErrors(newErrors);
  };

  const getPasswordErrors = (
    newPassword: string,
    errorMap: Map<string, string[]>
  ) => {
    errorMap.set('password', []);
    if (newPassword.length < 12 || newPassword.length > 64) {
      errorMap
        .get('password')
        ?.push('Password must be between 12 and 64 characters.');
    }
    if (!/[a-z]/.test(newPassword)) {
      errorMap
        .get('password')
        ?.push('Password must contain at least one lowercase letter.');
    }
    if (!/[A-Z]/.test(newPassword)) {
      errorMap
        .get('password')
        ?.push('Password must contain at least one uppercase letter.');
    }
    if (!/[0-9]/.test(newPassword)) {
      errorMap
        .get('password')
        ?.push('Password must contain at least one number.');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      errorMap
        .get('password')
        ?.push(
          'Password must contain at least one special character (eg. !, @, #, $).'
        );
    }
  };

  const handlePasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    const newPassword = e.currentTarget.value;
    const newErrors = new Map(errors);
    getPasswordErrors(newPassword, newErrors);

    setPassword(newPassword);

    console.log(newErrors.get('password')?.length);

    const arr = newErrors.get('password');

    if (arr !== undefined) {
      for (let i = 0; i < arr.length; ++i) {
        console.log(arr[i]);
      }
    }

    if (newErrors.get('password')?.length === 0) {
      setValidPassword(true);
    } else {
      setValidPassword(false);
    }

    setErrors(newErrors);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUpSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('In Form Submit');

    if (!validEmail || !validPassword) {
      console.log(
        `Returned due to invalid email (${validEmail}) or invalid password (${validPassword})`
      );
      return;
    }

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
      <div className='form-container'>
        <h1> Sign Up </h1>
        <form noValidate onSubmit={handleSignUpSubmit}>
          <div className='form-item'>
            <label htmlFor='email-address'>Email Address:</label>
            <input
              className={clsx({
                'form-input': email === '',
                'form-input invalid-form-input': email !== '' && !validEmail,
                'form-input valid-form-input': email !== '' && validEmail,
              })}
              type='email'
              value={email}
              onChange={handleEmailChange}
              id='email-address'
              name='email-address'
              placeholder='name@example.com'
            ></input>
            {(errors.get('email') ?? []).length > 0 && (
              <ul>
                <li className='error-msg'>{(errors.get('email') ?? [])[0]}</li>
              </ul>
            )}
          </div>
          <label htmlFor='password'>Password: </label>
          <input
            className={clsx({
              '': password === '',
              'invalid-form-input': password !== '' && !validPassword,
              'valid-form-input': password !== '' && validPassword,
            })}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordChange}
            id='password'
            name='password'
            placeholder='Password'
          ></input>
          <button type='button' onClick={togglePasswordVisibility}>
            {showPassword ? 'Hide Password' : 'Show Password'}
          </button>
          {(errors.get('password') ?? []).length > 0 && (
            <ul>
              {(errors.get('password') ?? []).map((errorMsg, index) => (
                <li className='error-msg' key={index}>
                  {errorMsg}
                </li>
              ))}
            </ul>
          )}
          <button type='submit'>Create Account</button>
        </form>
      </div>
    </>
  );
}

export default SignUp;
