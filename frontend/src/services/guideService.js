// GuideService: Handles API calls for guide profile
class GuideService {
  async getProfile(token) {
    const response = await fetch('/api/guides/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch guide profile');
    return data;
  }
}

export default new GuideService();
