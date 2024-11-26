import './TeamPage.css';
import { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import Header from '../../components/Header';
import { AuthContext } from '../../security/AuthProvider';
import coinImage from '../../resources/gold-coin.svg';
import { Link } from 'react-router-dom';
import AddProjectModal from '../../components/AddProjectModal';
import Button from '@material-ui/core/Button';
import EditTeamModal from '../../components/EditTeamModal/EditTeamModal.js';

function TeamPage() {
    let { subject_id, team_id } = useParams();
    const coinCount = 10;

    const [projectsList, setProjectsList] = useState([]);
    const [responseMessage, setResponseMessage] = useState('');
    const [teamMembers, setTeamMembers] = useState([]);
    const [teamName, setTeamName] = useState('');
    const { isLoggedIn, setIsLoggedIn, userId } = useContext(AuthContext);
    const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
    const [isEditTeamModalOpen, setIsEditTeamModalOpen] = useState(false);

    const handleProfileButtonClicked = () => {
        //
    }

    function setTeam(team) {
        setTeamName(team.name);
        setTeamMembers(team.members);
    };

    useEffect(() => {
        fetch(process.env.REACT_APP_API_URL + '/projects/' + subject_id + '/' + team_id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            setResponseMessage(data.message);
            if (data.success) {
                setProjectsList(data.projects);
            }
        })
        .catch((error) => {
            setResponseMessage(error.toString());
            console.error('Error:', error);
        });
        fetch(process.env.REACT_APP_API_URL + '/team/' + team_id + '/members', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            setResponseMessage(data.message);
            if (data.success) {
                setTeamMembers(data.users);
            }
        })
        .catch((error) => {
            setResponseMessage(error.toString());
            console.error('Error:', error);
        }
        );
    }, [subject_id, team_id]);

    return (
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
            <div className='teams-page-section-large'>
            <div className="section-container-projects">
                <div className="section section-large">
                    <h2 className="title">Projects</h2>
                    {projectsList.map((project, index) => (
                        <div className='project-container' key={index}>
                            <Link className='project-title' to={`/subjects/${subject_id}/teams/${team_id}/projects/${project.id}`}>
                                <h3>{project.name}</h3>
                            </Link>
                        </div>
                    ))}
                    <div className='button-container'>
                        <Button  variant="contained" size="medium" onClick={() => setIsAddProjectModalOpen(true)}>Add Project</Button>
                    </div>
                </div>
                <AddProjectModal isOpen={isAddProjectModalOpen} onClose={() => setIsAddProjectModalOpen(false)} subjectId={subject_id} teamId={team_id} authorId={userId} />
            </div>
            <div className="section-container-team-members">
                <div className="section section-large">
                    <h2 className="title">Team Members</h2>
                    {teamMembers.map((teamMember, index) => (
                        <div className='project-container' key={index}>
                            <Link className='project-title' to={``}>
                                <h3>{teamMember.login}</h3>
                            </Link>
                        </div>
                    ))}
                    <div className='button-container'>
                        <Button  variant="contained" size="medium" onClick={() => setIsEditTeamModalOpen(true)}>Edit</Button>
                    </div>
                </div>
                <EditTeamModal isOpen={isEditTeamModalOpen} onClose={() => setIsEditTeamModalOpen(false)} teamId={team_id} setTeam={setTeam} />
            </div>
            </div>
        </div>
    );
}

export default TeamPage;