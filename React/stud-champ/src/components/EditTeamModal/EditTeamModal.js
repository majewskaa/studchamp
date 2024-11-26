import './EditTeamModal.css';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import React, { useState, useEffect, useRef } from 'react';
import Dropdown from '../Dropdown/Dropdown';
import ChoosenList from '../ChoosenList/ChoosenList';

function EditTeamModal({ isOpen, onClose, teamId, setTeam }) {
    const [responseMessage, setResponseMessage] = useState('');
    const [teamMembers, setTeamMembers] = useState([]);
    const [groupMembers, setGroupMembers] = useState([]);
    const [newTeamMembers, setNewTeamMembers] = useState([]);
    const [teamName, setTeamName] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [fetchTrigger, setFetchTrigger] = useState(false);
    const dropdownContainerRef = useRef(null);
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}/edit_team_modal_data/${teamId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        //'Authorization': `Bearer ${user.token}`
                    }
                });
                if (!response.ok) {
                    setResponseMessage(response.message);
                }
                const data = await response.json();

                setTeamMembers(data.team_members);
                setGroupMembers(data.group_members);
                setNewTeamMembers(data.team_members);
                setTeamName(data.team_name);
            } catch
            (error) {
                console.error('Error fetching data:', error);
            }
        };
        if (teamId) {
            fetchData();
        };
    }, [teamId, fetchTrigger]);

    const handleSubmitEditTeam = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        let newTeamName = formData.get('team-name');
        let selectedTeamMembers = [];
        for (const teamMember of newTeamMembers) {
            selectedTeamMembers.push(teamMember.id);
        }
        if (newTeamName.length === 0) {
            newTeamName = teamName;
        }
        try {
            const response = await fetch(`${API_URL}/update_team`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    id: teamId,
                    name: newTeamName,
                    members: selectedTeamMembers
                })
            });
            const data = await response.json();
            if (data.success === false) {
                setResponseMessage('Failed to edit team');
            } else {
                setTeam(data.team);
                setFetchTrigger(!fetchTrigger);
                handleClose();
            }
        } catch (error) {
            console.error('Error editing team:', error);
            setResponseMessage(error.toString());
        }
    };


    const handleClose = () => {
        setResponseMessage('');
        setNewTeamMembers(teamMembers);
        setIsDropdownOpen(false);
        onClose();
    };
    return (
        <Modal
        open={isOpen}
        onClose={handleClose}>
            <div className='modal-box'>
            <h2 className="modal-box-header">Edit {teamName}</h2>
            <form noValidate autoComplete="off" className='modal-box-form' onSubmit={handleSubmitEditTeam}>
                <input className='add-team-modal-box-form-content' name="team-name" type="text" placeholder="New Team Name"/>
                <div className="dropdown-container">
                    <h4 >
                            <Dropdown
                                choice={groupMembers}
                                isDropdownOpen={isDropdownOpen}
                                setIsDropdownOpen={setIsDropdownOpen}
                                selected={newTeamMembers}
                                setSelected={setNewTeamMembers}
                            />
                            <ChoosenList
                                selected={newTeamMembers}
                                setSelected={setNewTeamMembers}
                            />
                    </h4>
                </div>
                <div className="add-team-modal-box-form-footer">
                    {responseMessage && <div className="add-team-modal-footer-element-message">{responseMessage}</div>}
                    <Button variant="contained" size="medium" onClick={handleClose}>Cancel</Button>
                    <Button variant="containedPrimary" size="medium" type="submit">Edit</Button>
                </div>
            </form>
            </div>
        </Modal>
    );
};

export default EditTeamModal;