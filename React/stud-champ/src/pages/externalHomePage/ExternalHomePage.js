import logo from '../../resources/logo.png';

function ExternalHomePage() {
    const {
        handleOpenLogIn,
        handleOpenSignIn,
        openLogIn,
        openSignIn,
        handleSubmmitLogIn,
        handleSubmmitSignIn,
        handleCloseLogIn,
        handleCloseSignIn,
        loginResponseMessage,
        registerResponseMessage,
        setUserLogin,
        setPassword,
    } = ExternalHomePageHook();
    return(
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
            <h2 className='modal-box-header'>Login</h2>
            {loginResponseMessage && <p className="response-message">{loginResponseMessage}</p>}
            <form noValidate autoComplete="off" className='modal-box-form' onSubmit={handleSubmmitLogIn}>
                <input  className='modal-box-form-content' name="login" type="login" placeholder="Login" onChange={(e) => setUserLogin(e.target.value)} required/>
                <input className="modal-box-form-content" name="password" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value) } required />
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
            {registerResponseMessage && <p className="response-message">{registerResponseMessage}</p>}
            <form noValidate autoComplete="off" className='modal-box-form' onSubmit={handleSubmmitSignIn}>
                <input className='modal-box-form-content' name="login" type="login" placeholder="Login"/>
                <input className="modal-box-form-content" name="password"  type="password" placeholder="Password"/>
                <input className="modal-box-form-content" name="repeat-password"  type="password" placeholder="Repeat Password"/>
                <input className="modal-box-form-footer" type="submit" value="Sign In"/>
            </form>
        </div>
        </Modal>
    </div>)
}

export default ExternalHomePage;