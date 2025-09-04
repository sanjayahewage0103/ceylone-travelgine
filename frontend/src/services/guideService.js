// GuideService: Handles API calls for guide profile
class GuideService {
  async getProfile(token) {
    console.log('DEBUG: Sending JWT for profile API:', token);
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
  async updateProfile(token, profileData, isFormData = false) {
    let options = {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    if (isFormData) {
      options.body = profileData;
    } else {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(profileData);
    }
    const response = await fetch('/api/guides/me', options);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to update guide profile');
    return data;
  }
}

export default new GuideService();
