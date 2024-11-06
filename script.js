const apiBaseUrl = 'http://localhost:8080/api/simulator'; // Base URL of your API simulator backend

document.addEventListener('DOMContentLoaded', function() {
    loadProjects();

    // Form submissions
    document.getElementById('projectForm').addEventListener('submit', createProject);
    document.getElementById('endpointForm').addEventListener('submit', createEndpoint);
});

async function loadProjects() {
    const response = await fetch(`${apiBaseUrl}/projects`);
    const projects = await response.json();
    
    const projectSelect = document.getElementById('projectSelect');
    const projectList = document.getElementById('projectList');
    
    projectSelect.innerHTML = '';  // Clear previous options
    projectList.innerHTML = '';    // Clear previous project list

    projects.forEach(project => {
        // Populate the project dropdown in the Endpoint form
        const option = document.createElement('option');
        option.value = project.name;
        option.textContent = project.name;
        projectSelect.appendChild(option);

        // Display project and endpoints
        const projectItem = document.createElement('div');
        projectItem.className = 'list-group-item';

        let endpointListHtml = '';
        project.endpoints.forEach(endpoint => {
            endpointListHtml += `
                <div>
                    <strong>${endpoint.method}</strong> ${project.name}/${endpoint.path}
                </div>
            `;
        });

        projectItem.innerHTML = `
            <h5>${project.name}</h5>
            ${endpointListHtml}
        `;

        projectList.appendChild(projectItem);
    });
}

async function createProject(event) {
    event.preventDefault();
    const projectName = document.getElementById('projectName').value;

    await fetch(`${apiBaseUrl}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: projectName })
    });

    document.getElementById('projectName').value = '';
    loadProjects();  // Refresh the project list
}

async function createEndpoint(event) {
    event.preventDefault();

    const projectName = document.getElementById('projectSelect').value;
    const endpointPath = document.getElementById('endpointPath').value;
    const httpMethod = document.getElementById('httpMethod').value;

    await fetch(`${apiBaseUrl}/projects/${projectName}/configure`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: endpointPath, method: httpMethod })
    });

    document.getElementById('endpointPath').value = '';
    document.getElementById('httpMethod').value = 'GET';
    loadProjects();  // Refresh the project list
}
