import { AuthContext } from '../../security/AuthProvider';
import { useContext, useState, useEffect } from 'react';
import avatar from '../../resources/avatar.png';

/**
 * @typedef {Object} HomePageHookResponse
 * @property {function(): void} logout
 * @property {User} user
 * @property {string} userLogin
 * @property {function(string): void} setUserLogin
 * @property {string} password
 * @property {function(string): void} setPassword
 * @property {Array<Subject>} subjectsList
 * @property {Array<Task>} tasksAssignedToUser
 * @property {Array<Update>} updatesList
 * @property {function(): void} isLoggedIn
 * @property {function(): void} setIsLoggedIn
 * @property {function(): void} openLogIn
 * @property {function(): void} openSignIn
 * @property {function(): void} registerResponseMessage,
 * @property {function(): void} loginResponseMessage,
 * @property {function(): void} handleOpenLogIn
 * @property {function(): void} handleOpenSignIn
 * @property {function(): void} handleCloseLogIn
 * @property {function(): void} handleCloseSignIn
 * @property {function(): void} handleProfileButtonClicked
 * @property {function(): void} handleSubmmitSignIn,
 * @property {function(): void} handleSubmmitLogIn,
 * @property {function(): void} handleAuthenticateWithUsos,
 * @property {function(): void} isUsosAuthenticated,
 */

/**
 * @returns {HomePageHookResponse}
 */
export function HomePageHook() {
    const { login, user, logout } = useContext(AuthContext);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isUsosAuthenticated, setIsUsosAuthenticated] = useState(false);
    const [userLogin, setUserLogin] = useState('');
    const [password, setPassword] = useState('');
    const [openLogIn, setOpenLogIn] = useState(false);
    const [openSignIn, setOpenSignIn] = useState(false);
    const [registerResponseMessage, setRegisterResponseMessage] = useState('');
    const [loginResponseMessage, setLoginResponseMessage] = useState('');
    const [generalResponseMessage, setGeneralResponseMessage] = useState('');
    const [subjectsList, setSubjectsList] = useState([]);

    const API_URL = process.env.REACT_APP_API_URL

    const handleOpenLogIn = () => {
        setOpenLogIn(true);
    }
    const handleOpenSignIn = () => {
        setOpenSignIn(true);
    };
    const handleCloseLogIn = () => {
        setOpenLogIn(false);
        setLoginResponseMessage('');
    };
    const handleCloseSignIn = () => {
        setOpenSignIn(false);
        setLoginResponseMessage('');
    };
    const handleProfileButtonClicked = () => {
        //
    }

    const updatesList = [
        {
            subject: {
                name: 'Subject Name',
                id: '1'
            },
            project: {
                name: 'Project Name',
                id: '1'
            },
            task: {
                name: 'Task Name',
                id: '1',
            },
            author: {
                avatar: avatar,
                id: '1'
            },
            type: 'Update Type',
            content: 'Update Content'
        },
        {
            subject: {
                name: 'Subject Name',
                id: '2'
            },
            project: {
                name: 'Project Name',
                id: '1'
            },
            task: {
                name: 'Task Name',
                id: '1',
            },
            author: {
                avatar: avatar,
                id: '1'
            },
            type: 'New Comment',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
        },
    ];

    // const subjectsList = [
    //     {
    //         name: 'TKOM',
    //         id: '1',
    //         active: true,
    //     },
    //     ,
    //     {
    //         name: 'SAD',
    //         id: '2',
    //         active: true,
    //     },
    //     {
    //         name: 'GKOM',
    //         id: '3',
    //         active: false,
    //     }
    // ];

    useEffect(() => {
        fetch(process.env.REACT_APP_API_URL + '/subjects', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            setGeneralResponseMessage(data.message);
            if (data.success) {
                setSubjectsList(data.subjects);
            }
        })
        .catch((error) => {
            setGeneralResponseMessage(error.toString());
            console.error('Error:', error);
        });
    }, []);

    const tasksAssignedToUser = [
        {
            subject: {
                name: 'Subject Name',
                id: '1'
            },
            project: {
                name: 'Project Name',
                id: '1'
            },
            name: 'Task Name',
            id: '1',
            active: true,
            points: 10
        },
        {
            subject: {
                name: 'Subject Name',
                id: '2'
            },
            project: {
                name: 'Project Name',
                id: '1'
            },
            name: 'Task Name',
            id: '1',
            active: false,
            points: 7
        }
    ];

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

    const handleAuthenticateWithUsos = async () => {
        const response = await fetch(API_URL + '/oauth/usos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (data.success) {
            setIsUsosAuthenticated(true);
        }
    }

    return {
        logout,
        user,
        userLogin,
        setUserLogin,
        password,
        setPassword,
        subjectsList,
        tasksAssignedToUser,
        updatesList,
        isLoggedIn,
        setIsLoggedIn,
        openLogIn,
        openSignIn,
        registerResponseMessage,
        loginResponseMessage,
        handleOpenLogIn,
        handleOpenSignIn,
        handleCloseLogIn,
        handleCloseSignIn,
        handleProfileButtonClicked,
        handleSubmmitSignIn,
        handleSubmmitLogIn,
        handleAuthenticateWithUsos,
        isUsosAuthenticated,
    }

}