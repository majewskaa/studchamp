import { useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import Header from '../../components/Header';
import { SubjectPageHook } from './SubjectPage-hook';
import coinImage from '../../resources/gold-coin.svg';
import { Link } from 'react-router-dom';
import AddTeamModal from '../../components/AddTeamModal/AddTeamModal';
import Button from '@material-ui/core/Button';

import './SubjectPage.css';

function SubjectPage() {
    let { subject_id } = useParams();
    const {
        isModalOpen,
        setIsModalOpen,
        setIsLoggedIn,
        teamsList,
        taskList,
        handleProfileButtonClicked
    } = SubjectPageHook(subject_id);

    const coinCount = 10;

    return (
        <div>
            <Header setIsLoggedIn={setIsLoggedIn} handleProfileButtonClicked={handleProfileButtonClicked}/>
            <div className="underheader">
                <div className='subject-outline'>
                    <Breadcrumb subject={subject_id}/>
                </div>
                <div className="coin-container">
                    <div className="coin-display">
                        <img src={coinImage} alt="Coin"  className='coin-image'/>
                        <span className="coin-count">{coinCount}</span>
                    </div>
                </div>
            </div>
            <div className="secton-container">
                <div className="section section-large">
                    <h2 className="title">Teams</h2>
                    {teamsList.map((team, index) => (
                        <Link  className='card team-card' key={index} to={`/subjects/${subject_id}/teams/${team.id}`}>
                            <h3 className='content'> {team.name}</h3>
                        </Link>
                    ))}
                    <Button variant="contained" className="add-team-btn" size="medium" onClick={() => setIsModalOpen(true)}>Add Team</Button>
                </div>
                <div className="section section-large">
                    <h2 className="title">Colaboration Tasks</h2>
                    {taskList.map((task, index) => (
                        <div className='card task-card' key={index}>
                            <div className='content points'>
                                {task.points}
                            </div>
                            <div className="task-card">
                                <div className="task-name-container">
                                    <span>{task.name}</span>
                                </div>
                                <div className="task-team-name-container">
                                    <span>{task.team.name}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <AddTeamModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} groupId={subject_id} />
        </div>
    );
}

export default SubjectPage;