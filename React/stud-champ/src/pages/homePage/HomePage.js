import './HomePage.css';
import Button from '@material-ui/core/Button';
import React from 'react';
import Modal from '@material-ui/core/Modal';
import { HomePageHook } from './HomePage-hook';
import Breadcrumb from '../../components/Breadcrumb';
import Header from '../../components/Header';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';

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
                <div className="secton-container">
                    <div className="section">
                        <h2 className="title">Last Updates</h2>
                        {updatesList.map((update, index) => (
                            <div className='card' key={index}>
                                <div className='card update-card'>
                                    <img className='content avatar' src={update.author.avatar} alt="person" />
                                    <h3 className='right-side-card-content'>
                                        <Breadcrumb subject={update.subject.id} project={update.project} task={update.task} />
                                        <span className='content'>{update.type}: {update.content}</span>
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
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
                    <div className="section">
                        <h2 className="title">Assigned to You</h2>
                        {tasksAssignedToUser.map((task, index) => (
                            <div className='card task-card' key={index}>
                                <div className='content points'>
                                    {task.points}
                                </div>
                                <div>
                                    <Breadcrumb subject={task.subject.id} project={task.project} />
                                    <h3 className='content'>{task.name}</h3>
                                </div>
                                <img className='content avatar' src={user.avatar} alt="person" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
    </div>
  );
}

export default HomePage;
