import { FiChevronDown } from "react-icons/fi";
import { GiCheckMark } from "react-icons/gi";
import avatar from '../../resources/avatar.png';
import Button from '@material-ui/core/Button';

import './Dropdown.css';

const Dropdown = ({ choice, setIsDropdownOpen, isDropdownOpen, selected, setSelected }) => {
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const nothing = (e) => {
        e.stopPropagation();
    };

    function handleAssign(user) {
        setSelected((prevList) => {
          if (hasOptionWithId(prevList, user.id)) {
            const updatedList = prevList.filter((item) => item.id !== user.id);
            return updatedList;
          } else {
            return [...prevList, user];
          }
        });
    }

    function hasOptionWithId(list, id) {
        return list.some((item) => item.id === id);
    }

    return (
        <div>

        <Button variant="contained" className="dropdown-button" onClick={toggleDropdown}>
            <span className="dropdown-block">
            <FiChevronDown color="#1A2044" size={24} />
            </span>
            { isDropdownOpen && (
            <div className="dropdown-selectable" onClick={nothing}>
                <ul className="dropdown-container">
                {choice.map((option) => (
                    <li
                    key={option.id}
                    className="dropdown-item"
                    onClick={() => handleAssign(option)}>
                        {hasOptionWithId(selected, option.id) && <GiCheckMark />}
                    <img
                        className="user-avatar"
                        src={avatar}
                        alt={`${option.login} image`}
                    />
                    <span>{option.login}</span>
                    </li>
                ))}
                </ul>
            </div>
            )}
        </Button>
        </div>
    );
};
export default Dropdown;