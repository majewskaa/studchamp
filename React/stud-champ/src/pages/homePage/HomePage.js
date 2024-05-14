import logo from './logo.png';
import './HomePage.css';
import Button from '@material-ui/core/Button';
import React, { useContext, useState } from 'react';
import { AuthContext } from '../../security/AuthProvider';
import Modal from '@material-ui/core/Modal';

function HomePage() {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [openLogIn, setOpenLogIn] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const API_URL = process.env.REACT_APP_API_URL

  const handleOpenLogIn = () => {
    setOpenLogIn(true);
  }
  const handleOpenSignIn = () => {
    setOpenSignIn(true);
  };
  const handleCloseLogIn = () => {
    setOpenLogIn(false);
    setResponseMessage('');
  };
  const handleCloseSignIn = () => {
    setOpenSignIn(false);
    setResponseMessage('');
  };
  const handleSubmmitLogIn = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');

    fetch(API_URL + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
      })
      .then(response => response.json())
      .then(data => {
        setResponseMessage(data.message);
        if (data.success) {
          setIsLoggedIn(true);
          handleCloseLogIn();
        }
      })
      .catch((error) => {
        setResponseMessage(error);
        console.error('Error:', error);
    });
  }
  const handleSubmmitSignIn = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const password = formData.get('password');
    const password2 = formData.get('repeat-password');
    const email = formData.get('email');

    if (password !== password2) {
        setResponseMessage("Passwords do not match");
        return;
    }
    fetch(API_URL + '/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password,
        email
      })
    })
    .then(response => response.json())
    .then(data => {
        setResponseMessage(data.message.text);
        if (data.success) {
            setIsLoggedIn(true);
            handleCloseSignIn();
        }
    })
    .catch((error) => {
        setResponseMessage(error);
        console.error('Error:', error);
    });
  }
  return (
    <div>
        {
            isLoggedIn ?
            <header className="header">
                <img src={logo} className="logo" alt="logo" />
                <div className="header-end">
                    <Button variant="contained"  className="inside-button" size="medium" onClick={() => setIsLoggedIn(false)}>Log out</Button>
                </div>
            </header>
            :
            <header className="header">
                <img src={logo} className="logo" alt="logo" />
                <div className="header-end">
                    <Button variant="contained"  className="button" size="medium" onClick={handleOpenLogIn}>Log in</Button>
                    <Button variant="contained"  className="button" size="medium" onClick={handleOpenSignIn}>Sign in</Button>
                </div>
            </header>
        }
        <Modal
          open={openLogIn}
          onClose={handleCloseLogIn}
        >
          <div className="login-modal-box">
            <h2 className='modal-box-header'>Log in</h2>
            {responseMessage && <p className="response-message">{responseMessage}</p>}
            <form noValidate autoComplete="off" className='modal-box-form' onSubmit={handleSubmmitLogIn}>
                <input  className='modal-box-form-content' name="email" type="email" placeholder="Email"/>
                <input className="modal-box-form-content" name="password" type="password" placeholder="Password" />
                <input className="modal-box-form-footer" type="submit" value="Log In"/>
            </form>
          </div>
        </Modal>
        <Modal
          open={openSignIn}
          onClose={handleCloseSignIn}
        >
          <div className="signin-modal-box">
            <h2 className='modal-box-header'>Sign in</h2>
            {responseMessage && <p className="response-message">{responseMessage}</p>}
            <form noValidate autoComplete="off" className='modal-box-form' onSubmit={handleSubmmitSignIn}>
                <input className='modal-box-form-content' name="email" type="email" placeholder="Email"/>
                <input className="modal-box-form-content" name="password"  type="password" placeholder="Password"/>
                <input className="modal-box-form-content" name="repeat-password"  type="password" placeholder="Repeat Password"/>
                <input className="modal-box-form-footer" type="submit" value="Sign In"/>
            </form>
          </div>
        </Modal>
    </div>
  );
}

export default HomePage;
