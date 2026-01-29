const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: 'manager' | 'engineer';
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'manager' | 'engineer';
}

export interface AuthResponse {
  token: string;
  user: User;
}

class ApiClient {
  private getHeaders(includeAuth = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  }

  async register(data: RegisterData): Promise<{ message: string; user: User }> {
    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    return response.json();
  }

  async logout(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/logout`, {
      method: 'POST',
      headers: this.getHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }
  }

  async getMe(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/me`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return response.json();
  }

  async getEngineers(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/users/engineers`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch engineers');
    }

    return response.json();
  }

  async getProjects(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/projects`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }

    return response.json();
  }

  async getProject(id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch project');
    }

    return response.json();
  }

  async createProject(data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/projects`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create project');
    }

    return response.json();
  }

  async updateProject(id: number, data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update project');
    }

    return response.json();
  }

  async deleteProject(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Failed to delete project');
    }
  }

  async getProjectIssues(projectId: number): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/issues`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch issues');
    }

    return response.json();
  }

  async createIssue(projectId: number, data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/issues`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create issue');
    }

    return response.json();
  }

  async getIssue(id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/issues/${id}`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch issue');
    }

    return response.json();
  }

  async updateIssue(id: number, data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/issues/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update issue');
    }

    return response.json();
  }

  async getProjectReport(projectId: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/report`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch report');
    }

    return response.json();
  }

  async getIssueWorkLogs(issueId: number): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/issues/${issueId}/work-logs`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch work logs');
    }

    return response.json();
  }

  async createWorkLog(issueId: number, data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/issues/${issueId}/work-logs`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create work log');
    }

    return response.json();
  }
}

export const api = new ApiClient();
