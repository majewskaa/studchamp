import logo from '../../resources/logo.png';
import './HomePage.css';
import Button from '@material-ui/core/Button';
import React from 'react';
import Modal from '@material-ui/core/Modal';
import { HomePageHook } from './HomePage-hook';
import Breadcrumb from '../../components/Breadcrumb';
import Header from '../../components/Header';
import { Link } from 'react-router-dom';

function HomePage() {
    const {
        curent_user,
        subjectsList,
        tasksAssignedToUser,
        updatesList,
        isLoggedIn,
        setIsLoggedIn,
        openLogIn,
        openSignIn,
        responseMessage,
        handleOpenLogIn,
        handleOpenSignIn,
        handleCloseLogIn,
        handleCloseSignIn,
        handleProfileButtonClicked,
        handleSubmmitSignIn,
        handleSubmmitLogIn} = HomePageHook();

  return (
    <div>
        {
            isLoggedIn ?
            <div className='loggedin-page'>
                <Header setIsLoggedIn={setIsLoggedIn} handleProfileButtonClicked={handleProfileButtonClicked}/>
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
                        {subjectsList.map((subject, index) => (
                            <Link  className='card subject-card' key={index} to={`/subjects/${subject}`}>
                                <h3 className='content'> {subject}</h3>
                            </Link>
                        ))}
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
                                <img className='content avatar' src={curent_user.avatar} alt="person" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            :
            <div>
                <header className="header">
                    <img src={logo} className="logo" alt="logo" />
                    <div className="header-end">
                        <Button variant="contained"  className="button" size="medium" onClick={handleOpenLogIn}>Log in</Button>
                        <Button variant="contained"  className="button" size="medium" onClick={handleOpenSignIn}>Sign in</Button>
                    </div>
                </header>
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
        }
    </div>
  );
}

export default HomePage;
