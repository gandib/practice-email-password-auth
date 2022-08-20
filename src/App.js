import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './App.css';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import app from './firebase.init';
import { useState } from 'react';


const auth = getAuth(app);

function App() {
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [registered, setRegistered] = useState(false);
  const [name, setName] = useState('');
  const [user, setUser] = useState(false);
  const [resetPassword, setResetPassword] = useState('');

  const handleNameBlur = event => {
    setName(event.target.value);
  }
  const handleEmailBlur = event => {
    setEmail(event.target.value);
  }
  const handlePasswordBlur = event => {
    setPassword(event.target.value);
  }

  const handleRegisteredChange = event => {
    setRegistered(event.target.checked);
  }


  const handleFormSubmit = event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }
    if (!/(?=.*?[#?!@$%^&*-])/.test(password)) {
      setError('Password should contain at least one special character')
      return;
    }

    setValidated(true);
    setError('');



    if (registered) {
      signInWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          console.log(user.emailVerified)
          if (user.emailVerified === false) {
            setError('Please verify your email!');;
            return;
          }
          console.log(user)
        })
        .catch(error => {
          setError(error.message);
          console.log(error);
        })
    }
    else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          setUser(user);
          console.log(user);
          setUserName();
          verifyEmail();
        })
        .catch(error => {
          setError(error.message);
          console.error(error);
        })
    }
    event.preventDefault();
  }


  const setUserName = () => {
    updateProfile(auth.currentUser, {
      displayName: name
    })
      .then(() => {
        console.log('updating name');
      })
      .catch(error => {
        setError(error.message);
      })
  }

  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('sent password reset mail');
        setResetPassword('Sent password to your mail');
      })
  }

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        console.log('Send email verification.');
      })
  }



  return (
    <div>
      <div className='registration w-50 mx-auto mt-2'>
        <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
          <h2 className='text-primary'>Please {registered ? 'Login' : 'Register'}!</h2>
          {!registered && <Form.Group className="mb-3" controlId="formPlaintext">
            <Form.Label>Your name</Form.Label>
            <Form.Control onBlur={handleNameBlur} type="text" placeholder="Your name" required />
            <Form.Control.Feedback type="invalid">
              Please provide your name.
            </Form.Control.Feedback>
          </Form.Group>}

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control onBlur={handleEmailBlur} type="email" placeholder="Enter email" required />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control onBlur={handlePasswordBlur} type="password" placeholder="Password" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check onChange={handleRegisteredChange} type="checkbox" label="Already Registered?" />
          </Form.Group>
          {resetPassword && 'Sent password to your mail'}
          {user && 'Registration Successful! Sent you a verification email.'}
          <p className='text-danger'>{error}</p>
          <Button onClick={handleResetPassword} variant='link'>Forget Password?</Button>
          <br />
          <Button variant="primary" type="submit">
            {registered ? 'Login' : 'Register'}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default App;
