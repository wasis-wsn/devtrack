# Skill Test: Simple Project and Issue Tracking Tool

Create a simple project and issue tracking tool. This tool is used to:

- Track projects
- Track issues (bugs/tasks/improvements)
- Assign work
- Log working hours
- Produce basic reports

## Roles

- **Manager**
	- Owns projects
	- Can see all data
	- Can create issue
- **Engineer**
	- Can be assigned to issue
	- Can log work on assigned issues

## Features

### A. Project Management

- List all projects
- View project details:
	- Project name
	- Manager who owns the project
	- Start & end date
	- Issues
- Project status (in progress/finished/not started)

**Rules**

- Manager can see all projects
- Engineer can only see projects they’re assigned to

### B. Issues Management

- List issues per project
- View issue detail
- Create new issue
- Update issue status

Issue fields:

- Type (bug/improvement)
- Status (open/in progress/done)
- Priority (1 - 5)
- Assignee
- Working hours

**Rules**

- Only manager can create issue and assign issue to engineer
- Assigned engineer can update the issue status and spent working hours on the issue

### C. Basic Report

- Show all issues for the selected project
- For each issue, show:
	- Assigned engineer
	- Issue type and status
	- Total working hour for the issue

**Rules**

- Both manager and engineer can access this feature

## Criteria

### Mandatory

The test must be done with the following criteria:

- Use Laravel, min version 12
- PostgreSQL, min version 15
- Use Docker. There will be 2 docker containers:
	- 1 for the application
	- 1 for the database

### Optional

- Provide API endpoint
- Using NextJS to serve the frontend/dashboard

### Note

- Use GitHub/GitLab public repository to contain the project.