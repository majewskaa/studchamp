import React, { useState, useEffect } from 'react';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import { useAuth } from '../../security/AuthProvider';

import './AddTeamModal.css';

function AddTeamModal({ isOpen, onClose, groupId }) {
    const { user } = useAuth();
    const [teamMembers, setTeamMembers] = useState(['']);
    const [groupMembers, setGroupMembers] = useState([]);
    const [responseMessage, setResponseMessage] = useState('');
    const [groupMembersToSelect, setGroupMembersToSelect] = useState([]);
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchGroupMembers = async () => {
            try {
                const response = await fetch(`${API_URL}/users_in_group/${groupId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}` // Include the token in the Authorization header
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
    }, [groupId, user.token]);

    const handleInputChange = (index, event) => {
        const newTeamMembers = [...teamMembers];
        newTeamMembers[index] = event.target.value;
        console.log(newTeamMembers);
        setTeamMembers(newTeamMembers);
        const selectedIds = newTeamMembers.map((member) => parseInt(member));
        const newGroupMembers = groupMembers.filter((groupMember) => !selectedIds.includes(groupMember.id));
        console.log(newGroupMembers);
        setGroupMembersToSelect(newGroupMembers);

        if (index === teamMembers.length - 1 && event.target.value !== '') {
            setTeamMembers([...newTeamMembers, '']);
        }
    };

    const handleSubmmitCreateTeam = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const teamName = formData.get('team-name');
        let selectedTeamMembers = [];
        for (let i = 0; i < teamMembers.length; i++) {
            const teamMember = formData.get(`team-member-${i}`);
            if(teamMember && teamMember.length > 0) {
                selectedTeamMembers.push(teamMember);
            }
        }

        const payload = {
            name: teamName,
            group_code: groupId,
            users: selectedTeamMembers,
        };

        fetch(API_URL + '/teams', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
        })
        .then(response => response.json())
        .then(data => {
            setResponseMessage(data.message);
            if (data.success) {
                onClose();
            }
        })
        .catch((error) => {
            setResponseMessage(error.toString());
            console.error('Error:', error);
        });
        window.location.reload();
    }

    const handleClose = () => {
        setGroupMembersToSelect(groupMembers);
        setTeamMembers(['']);
        onClose();
    };

    return (
            <Modal
            open={isOpen}
            onClose={handleClose}
            >
            <div className='modal-box'>
                <h2 className="modal-box-header">Add new Team</h2>
                <form noValidate autoComplete="off" className='modal-box-form' onSubmit={handleSubmmitCreateTeam}>
                    <input className='modal-box-form-content' name="team-name" type="text" placeholder="Team Name"/>
                    {teamMembers.map((member, index) => (
                        <div key={index}>
                        <select className='modal-box-form-content' name={`team-member-${index}`} value={member} onChange={(e) => handleInputChange(index, e)}>
                            <option value="">Select Member</option>
                            {groupMembers.map((groupMember) => (
                                <option key={groupMember.id} value={groupMember.id}>{groupMember.login}</option>
                            ))}
                        </select>
                    </div>
                    ))}
                    <div className="modal-box-form-footer">
                        <Button variant="contained" size="medium" onClick={handleClose}>Cancel</Button>
                        <Button variant="contained" size="medium" type="submit" >Add</Button>
                    </div>
                </form>
            </div>
            </Modal>
    );
}

export default AddTeamModal;