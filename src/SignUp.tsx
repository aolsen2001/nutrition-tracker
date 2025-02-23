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
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

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

  const handleFocus = (input: string) => {
    setFocusedInput(input);
  };

  const handleBlur = () => {
    setFocusedInput(null);
  };

  const handleSignUpSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validEmail || !validPassword) {
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
        <h1 className='form-header'> Sign Up </h1>
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
              onFocus={() => handleFocus('email')}
              onBlur={handleBlur}
              onChange={handleEmailChange}
              id='email-address'
              name='email-address'
              placeholder='name@example.com'
            ></input>
            {focusedInput === 'email' &&
              (errors.get('email') ?? []).length > 0 && (
                <ul className='error-list'>
                  <li className='error-msg'>
                    {(errors.get('email') ?? [])[0]}
                  </li>
                </ul>
              )}
          </div>
          <div className='form-item'>
            <div className='password-item'>
              <label htmlFor='password'>Password: </label>
              <button type='button' onClick={togglePasswordVisibility}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              className={clsx({
                'form-input': password === '',
                'form-input invalid-form-input':
                  password !== '' && !validPassword,
                'form-input valid-form-input': password !== '' && validPassword,
              })}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onFocus={() => handleFocus('password')}
              onBlur={handleBlur}
              onChange={handlePasswordChange}
              id='password'
              name='password'
              placeholder='Password'
            ></input>
            {focusedInput === 'password' &&
              (errors.get('password') ?? []).length > 0 && (
                <ul className='error-list'>
                  {(errors.get('password') ?? []).map((errorMsg, index) => (
                    <li className='error-msg' key={index}>
                      {errorMsg}
                    </li>
                  ))}
                </ul>
              )}
          </div>
          <button
            className='form-button'
            type='submit'
            disabled={
              email === '' || password === '' || !validEmail || !validPassword
            }
          >
            Create Account
          </button>
        </form>
      </div>
    </>
  );
}

export default SignUp;
