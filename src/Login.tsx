import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleEmailChange = (e: React.FormEvent<HTMLInputElement>) => {
    const newEmail = e.currentTarget.value;
    setEmail(newEmail);
  };

  const handlePasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    const newPassword = e.currentTarget.value;
    setPassword(newPassword);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignInSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        navigate('/dashboard');
      })
      .catch(() => {
        setError('Error: Invalid Credentials');
      });
  };

  return (
    <>
      <div className='form-container'>
        <h1 className='form-header'> Login </h1>
        <form noValidate onSubmit={handleSignInSubmit}>
          <div className='form-item'>
            <label htmlFor='email-address'>Email Address:</label>
            <input
              className='form-input'
              type='email'
              value={email}
              onChange={handleEmailChange}
              id='email-address'
              name='email-address'
              placeholder='name@example.com'
            ></input>
          </div>
          <div className='form-item'>
            <div className='password-item'>
              <label htmlFor='password'>Password: </label>
              <button type='button' onClick={togglePasswordVisibility}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              className='form-input'
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              id='password'
              name='password'
              placeholder='Password'
            ></input>
          </div>
          <button className='form-button' type='submit'>
            Login
          </button>
          {error !== '' && <p className='error-msg'>{error}</p>}
        </form>
      </div>
    </>
  );
}

export default Login;
