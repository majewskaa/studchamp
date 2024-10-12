/**
 * @typedef {Object} ExternalHomePageHookResponse
 * @property {function(): void} handleOpenLogIn,
 * @property {function(): void} handleOpenSignIn,
 * @property {boolean} openLogIn,
 * @property {boolean} openSignIn,
 * @property {function(): void} handleSubmmitLogIn,
 * @property {function(): void} handleSubmmitSignIn,
 * @property {function(): void} handleCloseLogIn,
 * @property {function(): void} handleCloseSignIn,
 * @property {string} loginResponseMessage,
 * @property {string} registerResponseMessage,
 * @property {function(string): void} setUserLogin,
 * @property {function(string): void} setPassword,
 */

/**
 * @returns {ExternalHomePageHookResponse}
 */

export function ExternalHomePageHook() {
    const [openLogIn, setOpenLogIn] = useState(false);
    const [openSignIn, setOpenSignIn] = useState(false);
    const [loginResponseMessage, setLoginResponseMessage] = useState('');
    const [registerResponseMessage, setRegisterResponseMessage] = useState('');
    const [userLogin, setUserLogin] = useState('');
    const [password, setPassword] = useState('');

    const handleOpenLogIn = () => {
        setOpenLogIn(true);
    }

    const handleOpenSignIn = () => {
        setOpenSignIn(true);
    };

    const handleSubmmitLogIn = async (event) => {
        event.preventDefault();
        const data = await login(userLogin, password);
        setLoginResponseMessage(data.message);
        if(data.success) {
            handleCloseLogIn();
        }
    }

    const handleSubmmitSignIn = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const password = formData.get('password');
        const password2 = formData.get('repeat-password');
        const login = formData.get('login');

        if (password !== password2) {
            setRegisterResponseMessage("Passwords do not match");
            return;
        }
        fetch(API_URL + '/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            password,
            login
        })
        })
        .then(response => response.json())
        .then(data => {
            setRegisterResponseMessage(data.message.text);
            if (data.success) {
                setIsLoggedIn(true);
                handleCloseSignIn();
            }
        })
        .catch((error) => {
            setRegisterResponseMessage(error);
            console.error('Error:', error);
        });
    }

    const handleCloseLogIn = () => {
        setOpenLogIn(false);
        setLoginResponseMessage('');
    };

    const handleCloseSignIn = () => {
        setOpenSignIn(false);
        setLoginResponseMessage('');
    };

    return {
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
    };
}