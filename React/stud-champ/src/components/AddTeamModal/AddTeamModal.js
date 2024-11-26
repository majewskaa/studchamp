import React, { useState, useEffect, useRef } from 'react';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import { useAuth } from '../../security/AuthProvider';
import Dropdown from '../Dropdown/Dropdown';
import ChoosenList from '../ChoosenList/ChoosenList';
import useClickOutside from '../../hooks/useClickOutside';

import './AddTeamModal.css';

function AddTeamModal({ isOpen, onClose, groupId }) {
    const { user } = useAuth();
    const [teamMembers, setTeamMembers] = useState([]);
    const [groupMembers, setGroupMembers] = useState([]);
    const [responseMessage, setResponseMessage] = useState('');
    const [groupMembersToSelect, setGroupMembersToSelect] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownContainerRef = useRef(null);
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchGroupMembers = async () => {
            try {
                const response = await fetch(`${API_URL}/users_in_group/${groupId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        //'Authorization': `Bearer ${user.token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch group members');
                }
                const data = await response.json();
                const users_without_active_user = data.filter((user) => user.id !== parseInt(localStorage.getItem('user_id')));
                setGroupMembers(users_without_active_user);
                setGroupMembersToSelect(users_without_active_user);
            } catch (error) {
                console.error('Error fetching group members:', error);
                setResponseMessage('Error fetching group members');
            }
        };

        if (groupId) {
            fetchGroupMembers();
        }
    }, [groupId]);

    const handleSubmitCreateTeam = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const teamName = formData.get('team-name');
        let selectedTeamMembers = [];
        for (const teamMember of teamMembers) {
            selectedTeamMembers.push(teamMember.id);
        }
        selectedTeamMembers.push(parseInt(localStorage.getItem('user_id')));
        if (teamName.length === 0) {
            setResponseMessage('Team name is required');
            return;
        }

        const payload = {
            name: teamName,
            group_code: groupId,
            users: selectedTeamMembers,
        };

        try {
            const response = await fetch(`${API_URL}/teams`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(payload),
            });
            const data = await response.json();

            if (data.success) {
                handleClose();
                window.location.reload();
            } else {
                setResponseMessage(data.message);
            }
        } catch (error) {
            setResponseMessage('Error creating team');
        }
    };

    const handleClose = () => {
        setGroupMembersToSelect(groupMembers);
        setResponseMessage('');
        setTeamMembers([]);
        onClose();
    };

    useClickOutside(dropdownContainerRef, () => {
        setIsDropdownOpen(false);
    });

    return (
            <Modal
            open={isOpen}
            onClose={handleClose}
            >
            <div className='modal-box'>
                <h2 className="modal-box-header">Add a New Team</h2>
                <form noValidate autoComplete="off" className='modal-box-form' onSubmit={handleSubmitCreateTeam}>
                    <input className='add-team-modal-box-form-content' name="team-name" type="text" placeholder="Team Name"/>
                        <div className="dropdown-container" ref={dropdownContainerRef}>
                            <h4 >
                            <Dropdown
                                choice={groupMembersToSelect}
                                isDropdownOpen={isDropdownOpen}
                                setIsDropdownOpen={setIsDropdownOpen}
                                selected={teamMembers}
                                setSelected={setTeamMembers}
                            />
                            <ChoosenList
                                selected={teamMembers}
                                setSelected={setTeamMembers}
                            />
                            </h4>
                        </div>

                    <div className="add-team-modal-box-form-footer">
                        {responseMessage && <div className="add-team-modal-footer-element-message">{responseMessage}</div>}
                        <Button variant="contained" size="medium" onClick={handleClose}>Cancel</Button>
                        <Button variant="containedPrimary" size="medium" type="submit">Add</Button>
                    </div>
                </form>
            </div>
            </Modal>
    );
}

export default AddTeamModal;