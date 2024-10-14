// app/lib/api.ts
// Adjusted to ensure API_URL is securely accessed on the server side.

const API_URL = process.env.API_URL;

type Unit = {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
};

type Cluster = {
  id: number;
  name: string;
  url: string;
  units: Unit[];
};

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
