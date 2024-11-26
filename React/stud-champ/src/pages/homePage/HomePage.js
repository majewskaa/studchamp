import './HomePage.css';
import Button from '@material-ui/core/Button';
import React from 'react';
import Modal from '@material-ui/core/Modal';
import { HomePageHook } from './HomePage-hook';
import Breadcrumb from '../../components/Breadcrumb';
import Header from '../../components/Header';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import avatar from '../../resources/avatar.png';

function HomePage() {
    const {
        pin,
        user,
        updatesList,
        subjectsList,
        tasksAssignedToUser,
        setPin,
        logout,
        setIsLoggedIn,
        showPinDialog,
        handlePinSubmit,
        setShowPinDialog,
        isUsosAuthenticated,
        handleProfileButtonClicked,
        handleAuthenticateWithUsos,
    } = HomePageHook();

  return (
    <div>
            <div className='loggedin-page'>
                <Header setIsLoggedIn={setIsLoggedIn} handleProfileButtonClicked={handleProfileButtonClicked} logout={logout}/>
                <div className="section-container">
                    <div className="section section-large">
                        <h2 className="title">Your Subjects</h2>
                        {isUsosAuthenticated && <p>{subjectsList.map((subject, index) => (
                            <Link  className='card subject-card' key={index} to={`/subjects/${subject}`}>
                                <h3 className='content'> {subject}</h3>
                            </Link>
                        ))}</p>}
                        {!isUsosAuthenticated && <div className='button-content-container'>
                        <Button variant="contained"  className="content" size="medium" onClick={handleAuthenticateWithUsos}>Authenticate with usos</Button>
                            <Modal
                                open={showPinDialog}
                                onClose={() => setShowPinDialog(false)}
                            >
                                <div className='pin-modal-box'>
                                <h2>Enter PIN</h2>
                                <TextField
                                    label="PIN"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                />
                                <Button variant="contained"  className="content" size="medium" onClick={handlePinSubmit}>Submit</Button>
                                </div>
                            </Modal>
                        </div>

                        }
                    </div>
                </div>
            </div>
    </div>
  );
}

export default HomePage;
