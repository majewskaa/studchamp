import requests

url = 'https://gitlab-stud.elka.pw.edu.pl/api/v4/groups'

access_token = 'glpat-emNL5hzNDTsSiXqxHGGh'

request_data = {
    'parent_id': '51805',
    'name': 'test_group',
    'path': 'test_group1',
    'visibility_level': '10',
    'setup_for_company': 'false',
}

headers = {
    "Authorization": f"Bearer {access_token}",
    "Content-Type": "application/json"
}

def create_new_usos_group(request_data):
    response = requests.post(url, json=request_data, headers=headers)

    if response.status_code == 201:
        print("Group created successfully!")
    else:
        print("Failed to create group:", response.text)

def create_new_usos_project(request_data):
    response = requests.post(url, json=request_data, headers=headers)

    if response.status_code == 201:
        print("Project created successfully!")
    else:
        print("Failed to create project:", response.text)
