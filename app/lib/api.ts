// app/lib/api.ts
// Adjusted to ensure API_URL is securely accessed on the server side.

const API_URL = process.env.API_URL;

type Cluster = {
  id: number;
  name: string;
  url: string;
  units: Unit[];
};

enum Role {
  Admin = 1,
  User = 2
}

export type User = {
  user_id: number;
  username: string;
  email: string;
  role: Role;
  password: string;
}

// Check if logged in
export async function checkLogin(token: string): Promise<boolean> {
  const response = await fetch(`${API_URL}/auth/user/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return false;
  }

  return true;
}

export async function getToken(username: string, password: string): Promise<string> {
  const response = await fetch(`${API_URL}/auth/token`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'password',
      username,
      password,
      scope: '',
      client_id: 'string',
      client_secret: 'string',
    }).toString(),
  });

  if (!response.ok) {
    throw new Error('Invalid credentials');
  }

  const data = await response.json();
  const token = data.access_token;
  if (!token) {
    throw new Error('Invalid token', token);
  }
  return data.access_token;
}

export async function getClusters(token: string): Promise<Cluster[]> {
  const response = await fetch(`${API_URL}/clusters/my-clusters`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch clusters');
  }

  const data = await response.json();
  return data;
}

export async function getUsers(token: string): Promise<User[]> {
  const response = await fetch(`${API_URL}/auth/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  const data = await response.json();
  return data;
}

export async function roleCheck(token: string): Promise<Role> {
  const response = await fetch(`${API_URL}/auth/user/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch role');
  }

  const data = await response.json();
  return data.role;
}

export async function createUser(token: string, userData: Partial<User>): Promise<User> {
  const response = await fetch(`${API_URL}/auth/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Failed to create user');
  }

  return response.json();
}

export async function updateUser(token: string, userId: number, userData: Partial<User>): Promise<User> {
  const response = await fetch(`${API_URL}/auth/user/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Failed to update user');
  }

  return response.json();
}

export async function deleteUser(token: string, userId: number): Promise<void> {
  const response = await fetch(`${API_URL}/auth/user/${userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
}

export type Unit = {
  id: number,
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export type UserShortened = {
  user_id: number;
  username: string;
}

export type ClusterFull = {
  name: string;
  id: number;
  units: Unit[];
  account: UserShortened;
  created: string;
  updated: string;
};

export async function getFullClusters(token: string): Promise<ClusterFull> {
  // Get token from cookie
  
  const response = await fetch(`${API_URL}/clusters`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch cluster');
  }

  return response.json();
}

export type CreateClusterData = {
  name: string;
  units: Partial<Unit[]>;
  account_id: number;
}

// Create a new cluster
//Body: {name: string, units: Unit[], account_id: number}
export async function createCluster(token: string, clusterData: CreateClusterData): Promise<ClusterFull> {
  const response = await fetch(`${API_URL}/clusters`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(clusterData),
  });

  if (!response.ok) {
    throw new Error('Failed to create cluster');
  }

  return response.json();
}
