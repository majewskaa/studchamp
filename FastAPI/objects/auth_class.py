import requests

class Auth:
    def __init__(self):
        self.jwt_token = None
        # self.client = self._create_client()

    def get_client(self):
        return self.client

    def is_logged(self):
        return self.jwt_token is not None

    def _create_client(self):
        headers = {}
        if self.jwt_token is not None:
            headers['Authorization'] = f'Bearer {self.jwt_token}'
        client = requests.Session()
        client.headers.update(headers)
        return client

auth = Auth()