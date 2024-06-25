import { AuthContext } from '../../security/AuthProvider';
import { useContext, useState, useEffect } from 'react';
import avatar from '../../resources/avatar.png';

/**
 * @typedef {Object} HomePageHookResponse
 * @property {User} curent_user
 * @property {Array<Subject>} subjectsList
 * @property {Array<Task>} tasksAssignedToUser
 * @property {Array<Update>} updatesList
 * @property {function(): void} isLoggedIn
 * @property {function(): void} setIsLoggedIn
 * @property {function(): void} openLogIn
 * @property {function(): void} openSignIn
 * @property {function(): void} responseMessage
 * @property {function(): void} handleOpenLogIn
 * @property {function(): void} handleOpenSignIn
 * @property {function(): void} handleCloseLogIn
 * @property {function(): void} handleCloseSignIn
 * @property {function(): void} handleProfileButtonClicked
 * @property {function(): void} handleSubmmitSignIn,
 * @property {function(): void} handleSubmmitLogIn
 */

/**
 * @returns {HomePageHookResponse}
 */
export function HomePageHook() {
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const [openLogIn, setOpenLogIn] = useState(false);
    const [openSignIn, setOpenSignIn] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
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
        setResponseMessage('');
    };
    const handleCloseSignIn = () => {
        setOpenSignIn(false);
        setResponseMessage('');
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

    const curent_user = {
        id: 1,
        avatar: avatar
    }

    useEffect(() => {
        fetch(process.env.REACT_APP_API_URL + '/subjects', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            setResponseMessage(data.message);
            if (data.success) {
                setSubjectsList(data.subjects);
            }
        })
        .catch((error) => {
            setResponseMessage(error.toString());
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
    return {
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
        handleSubmmitLogIn
    }

}