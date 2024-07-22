import { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import Header from '../../components/Header';
import { AuthContext } from '../../security/AuthProvider';
import coinImage from '../../resources/gold-coin.svg';
import { Link } from 'react-router-dom';
import AddTaskModal from '../../components/AddTaskModal';

import './ProjectPage.css';

function ProjectPage() {
    let { subject_id, team_id, project_id } = useParams();
    const coinCount = 10;

    const [tasksList, setTasksList] = useState([]);
    const [responseMessage, setResponseMessage] = useState('');
    const { isLoggedIn, setIsLoggedIn, userId } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectDetails, setProjectDetails] = useState(null);

    const handleProfileButtonClicked = () => {
        //
    }

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/projects/${project_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                setProjectDetails(data.project);
            } else {
                // Handle the case where fetching project details was not successful
                console.error('Failed to fetch project details:', data.message);
            }
        })
        .catch((error) => {
            console.error('Error fetching project details:', error);
        });
    }, [project_id]);

    useEffect(() => {
        fetch(process.env.REACT_APP_API_URL + '/tasks/' + subject_id + '/' + team_id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            setResponseMessage(data.message);
            if (data.success) {
                setTasksList(data.tasks);
            }
        })
        .catch((error) => {
            setResponseMessage(error.toString());
            console.error('Error:', error);
        });
    }, [subject_id, team_id]);



    return (
        <div> {projectDetails ? (
            <div>
            <Header setIsLoggedIn={setIsLoggedIn} handleProfileButtonClicked={handleProfileButtonClicked}/>
            <div className="underheader">
                <div className='subject-outline'>
                    <Breadcrumb subject={subject_id} team={team_id}/>
                </div>
                <div className="coin-container">
                    <div className="coin-display">
                        <img src={coinImage} alt="Coin"  className='coin-image'/>
                        <span className="coin-count">{coinCount}</span>
                    </div>
                </div>
            </div>
            <div className="project-info">
                <div className="project-info-content">
                    <h2>{projectDetails.name}</h2>
                    <p>{projectDetails.description}</p>
                </div>
                <div className="project-info-buttons">
                    {projectDetails.gitRepoLink ? (
                        <a href={projectDetails.gitRepoLink} target="_blank" rel="noopener noreferrer">View Git Repo</a>
                    ) : (
                        <button>Bind Git Repo</button>
                    )}
                    <button>Edit Project</button> {/* Placeholder for future implementation */}
                </div>
            </div>
            <div className="secton-container-tasks">
                <div className="section section-large">
                    <h2 className="title">Your Tasks</h2>
                    {tasksList.map((task, index) => (
                        <div className='task-container' key={index}>
                        <span className='task-points'>{task.points}</span>
                        <Link className='task-title' to={`/subjects/${subject_id}/teams/${team_id}/projects/${project_id}/tasks/${task.id}`}>
                            <h3>{task.title}</h3>
                        </Link>
                        </div>
                    ))}
                    <button className="add-task-btn" onClick={() => setIsModalOpen(true)}>Add Task</button>
                </div>
            </div>
            <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} subjectId={subject_id} teamId={team_id} authorId={userId} projectId={project_id} />
            </div>) : (<div/>)}
            </div>
    );
}

export default ProjectPage;