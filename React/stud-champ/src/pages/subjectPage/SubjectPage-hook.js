import { AuthContext } from '../../security/AuthProvider';
import { useContext, useState, useEffect } from 'react';

export function SubjectPageHook(subject_id) {
    const { setIsLoggedIn } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [teamsList, setTeamsList] = useState([]);
    const [responseMessage, setResponseMessage] = useState('');

    const handleProfileButtonClicked = () => {
        //
    }

    useEffect(() => {
        fetch(process.env.REACT_APP_API_URL + '/teams/' + subject_id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            setResponseMessage(data.message);
            if (data.success) {
                setTeamsList(data.teams);
            }
        })
        .catch((error) => {
            setResponseMessage(error.toString());
            console.error('Error:', error);
        });
    }, []);

    const taskList = [
        {
            id: '1',
            name: 'Task 1',
            points: 10,
            subject: 'Subject 1',
            team: {
                id: '1',
                name: 'Team 1'
            }
        },
        {
            id: '2',
            name: 'Task 2',
            points: 20,
            subject: 'Subject 2',
            team: {
                id: '2',
                name:  'Team 2'
            }
        },
        {
            id: '3',
            name: 'Task 3',
            points: 30,
            subject: 'Subject 3',
            team: {
                id: '3',
                name: ' Team 3'
            }
        }
    ];



    return {
        isModalOpen,
        setIsModalOpen,
        setIsLoggedIn,
        teamsList,
        taskList,
        handleProfileButtonClicked
    }
}