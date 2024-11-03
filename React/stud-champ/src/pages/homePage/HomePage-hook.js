import { useAuth } from '../../security/AuthProvider';
import { useState, useEffect } from 'react';
import avatar from '../../resources/avatar.png';

/**
 * @typedef {Object} HomePageHookResponse
 * @property {string} pin,
 * @property {User} user,
 * @property {Array<Update>} updatesList,
 * @property {Array<Subject>} subjectsList,
 * @property {Array<Task>} tasksAssignedToUser,
 * @property {function(): void} setPin,
 * @property {function(): void} logout
 * @property {function(): void} setIsLoggedIn,
 * @property {function(): void} showPinDialog,
 * @property {function(): void} handlePinSubmit,
 * @property {function(): void} setShowPinDialog,
 * @property {function(): void} isUsosAuthenticated,
 * @property {function(): void} handleProfileButtonClicked,
 * @property {function(): void} handleAuthenticateWithUsos,
 */

/**
 * @returns {HomePageHookResponse}
 */
export function HomePageHook() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isUsosAuthenticated, setIsUsosAuthenticated] = useState(false);
    const [generalResponseMessage, setGeneralResponseMessage] = useState('');
    const [subjectsList, setSubjectsList] = useState([]);
    const [showPinDialog, setShowPinDialog] = useState(false);
    const [pin, setPin] = useState('');
    const [oauthToken, setOauthToken] = useState('');
    const [oauthTokenSecret, setOauthTokenSecret] = useState('');

    const API_URL = process.env.REACT_APP_API_URL;

    const handleProfileButtonClicked = () => {
        //
    }

    const { user, login, logout } = useAuth();

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

    useEffect(() => {
        if (!user || !isUsosAuthenticated) {
            return;
        }
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

    useEffect(() => {
        if (!user) {
            console.log('User is not logged in');
            return;
        }
        fetch(process.env.REACT_APP_API_URL + '/is_usos_authenticated', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: user.user_id,
                user_token: user.token
            })
        })
        .then(response => response.json())
        .then(data => {
            setGeneralResponseMessage(data.message);
            if (data.success) {
                setIsUsosAuthenticated(true);
            }
        })
        .catch((error) => {
            setGeneralResponseMessage(error.toString());
            console.error('Error:', error);
        });
    }, [user]);

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

    const handleAuthenticateWithUsos = async () => {
        try {
            const response = await fetch(API_URL + '/oauth/usos', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.success && data.url) {

                console.info('URL:', data);
                console.info('oauth_token:', data.oauth_token );
                setOauthToken(data.oauth_token);
                setOauthTokenSecret(data.oauth_token_secret);
                window.open(data.url, '_blank');
                setShowPinDialog(true);
            } else {
                console.error('Failed to get the URL for authentication');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handlePinSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(API_URL + '/oauth/usos/pin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    user_id: user.user_id,
                    pin: pin,
                    oauth_token: oauthToken,
                    oauth_token_secret: oauthTokenSecret
                })
            });
            const data = await response.json();
            if (data.success) {
                console.info('PIN submitted successfully');
                setShowPinDialog(false);
            } else {
                console.error('Failed to submit PIN');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return {
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
    }

}