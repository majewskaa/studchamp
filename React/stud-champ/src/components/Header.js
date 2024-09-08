import logo from '../resources/logo.png';
import person from '../resources/person.png';
import Button from '@material-ui/core/Button';

const Header = ({setIsLoggedIn, handleProfileButtonClicked, logout}) => (
    <header className="header">
        <img src={logo} className="logo" alt="logo" />
        <div className="header-end">
        <Button variant="contained" className="inside-button-person" size="medium" onClick={handleProfileButtonClicked}>
            <img src={person} className="person-img" alt="person" />
        </Button>
            <Button variant="contained"  className="inside-button" size="medium" onClick={logout}>Log Out</Button>
        </div>
    </header>
);

export default Header;