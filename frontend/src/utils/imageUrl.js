// Returns the correct image URL for backend-served images
export const getImageUrl = (path) => {
  if (!path) return '';
  // Use backend port 5000
  const backend = 'http://localhost:5000';
  if (path.startsWith('/uploads/')) return backend + path;
  return path;
};
