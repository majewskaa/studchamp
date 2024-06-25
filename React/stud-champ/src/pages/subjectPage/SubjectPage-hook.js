import { AuthContext } from '../../security/AuthProvider';
import { useContext } from 'react';

export function SubjectPageHook() {
    const { setIsLoggedIn } = useContext(AuthContext);

    const handleProfileButtonClicked = () => {
        //
    }

    const teamsList = [
        {
            id: '1',
            name: 'Team 1'
        },
        {
            id: '2',
            name: 'Team 2'
        },
        {
            id: '3',
            name: 'Team 3'
        }
    ];

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
        setIsLoggedIn,
        teamsList,
        taskList,
        handleProfileButtonClicked
    }
}