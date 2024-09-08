const API_URL = process.env.REACT_APP_API_URL
const USOS_LOGIN_ENDPOINT = `${API_URL}/oauth/usos`
const USOS_AUTHENTICATED_ENDPOINT = `${API_URL}/is_authenticated`

export async function checkToken() {
    const jwt_token = localStorage.getItem('jwt_token');
    try {
        const response = await fetch(USOS_AUTHENTICATED_ENDPOINT, {
            headers: {
                'token': `Bearer ${jwt_token}`
            }
        });
        if (response.status === 401) {
            //logout();
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

// export async function checkToken(token) {
//     try {
//         const response = await fetch(USOS_AUTHENTICATED_ENDPOINT, {
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         });
//         if (response.status === 401) {
//             console.log('Token is invalid or expired');
//             return false;
//         } else if (!response.ok) {
//             console.log(`HTTP error! status: ${response.status}`);
//             return false;
//         } else {
//             console.log('Token is valid');
//             return true;
//         }
//     } catch (error) {
//         console.log(error);
//         return false;
//     }
// }

export async function getUserId() {
    // TODO
    return 1;
}