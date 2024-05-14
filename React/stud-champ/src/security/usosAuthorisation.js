const API_URL = process.env.REACT_APP_API_URL
const USOS_LOGIN_ENDPOINT = `${API_URL}/oauth/usos`
const USOS_AUTHENTICATED_ENDPOINT = `${API_URL}/is_authenticated`

export async function login() {
    //window.location.href = USOS_LOGIN_ENDPOINT

}

function logout() {
    localStorage.removeItem('jwt_token');
   // window.location.href = '/login';
}

export async function isAuthenticated() {
    const jwt_token = localStorage.getItem('jwt_token');
    try {
        const response = await fetch(USOS_AUTHENTICATED_ENDPOINT, {
            headers: {
                'token': `Bearer ${jwt_token}`
            }
        });
        if (response.status === 401) {
            logout();
            return false;
        } else if (!response.ok) {
            console.log(`HTTP error! status: ${response.status}`);
            return false;
        } else {
            console.log('Authenticated');
            return true;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}