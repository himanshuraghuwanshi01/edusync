const BASE_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== "undefined" ? "/api" : "http://127.0.0.1:5000/api");

export const api = {
  async register(name: string, email: string) {
    const res = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    if (!res.ok) throw new Error("Registration failed");
    return res.json();
  },

  async getMatches(userId: string) {
    const res = await fetch(`${BASE_URL}/matches/recommendations`, {
      headers: { "x-user-id": userId },
    });
    if (!res.ok) throw new Error("Failed to fetch matches");
    return res.json();
  },

  async getProfile(userId: string) {
    const res = await fetch(`${BASE_URL}/users/${userId}`, {
      headers: { "x-user-id": userId },
    });
    if (!res.ok) throw new Error("Failed to fetch profile");
    return res.json();
  },

  async updateProfile(userId: string, updates: any) {
    const res = await fetch(`${BASE_URL}/users/profile`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "x-user-id": userId 
      },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Failed to update profile");
    return res.json();
  },
};
