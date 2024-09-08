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

def fetch_commits_of_project(project_id):
    url = f'https://gitlab-stud.elka.pw.edu.pl/api/v4/projects/{project_id}/repository/commits'
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        print("Commits fetched successfully!")
    else:
        print("Failed to fetch commits:", response.text)

    resp = count_commits_by_user(response.json())
    print(resp)
    return resp

def count_commits_by_user(commits):
    commit_counts = {}
    for commit in commits:
        email = commit['author_email']
        if email in commit_counts:
            commit_counts[email] += 1
        else:
            commit_counts[email] = 1
    return commit_counts

fetch_commits_of_project("48628")