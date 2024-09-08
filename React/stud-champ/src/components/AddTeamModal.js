import React, { useState, useEffect } from 'react';

function AddTeamModal({ isOpen, onClose, groupId }) {
    const [teamMembers, setTeamMembers] = useState(['']);
    const [groupMembers, setGroupMembers] = useState([]);
    const [responseMessage, setResponseMessage] = useState('');
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchGroupMembers = async () => {
            try {
                const response = await fetch(`${API_URL}/subject/${groupId}/members`);
                if (!response.ok) {
                    throw new Error('Failed to fetch group members');
                }
                const data = await response.json();
                setGroupMembers(data.users);
            } catch (error) {
                console.error('Error fetching group members:', error);
                setResponseMessage('Error fetching group members');
            }
        };

        if (groupId) {
            fetchGroupMembers();
        }
    }, [groupId]);

    const handleInputChange = (index, event) => {
        const newTeamMembers = [...teamMembers];
        newTeamMembers[index] = event.target.value;
        setTeamMembers(newTeamMembers);

        if (index === teamMembers.length - 1 && teamMembers.length < 10 && event.target.value !== '') {
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
        setTeamMembers(['']);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2 className="modal-box-header">Add new Team</h2>
                <form noValidate autoComplete="off" className='modal-box-form' onSubmit={handleSubmmitCreateTeam}>
                    <input className='modal-box-form-content' name="team-name" type="text" placeholder="Team Name"/>
                    {teamMembers.map((member, index) => (
                        <div key={index}>
                        <select name={`team-member-${index}`} value={member} onChange={(e) => handleInputChange(index, e)}>
                            <option value="">Select Member</option>
                            {groupMembers.map((groupMember) => (
                                <option key={groupMember.id} value={groupMember.id}>{groupMember.login}</option>
                            ))}
                        </select>
                    </div>
                    ))}
                    <div className="modal-box-form-footer">
                        <button type="button" onClick={handleClose}>Cancel</button>
                        <input type="submit" value="Add"/>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddTeamModal;