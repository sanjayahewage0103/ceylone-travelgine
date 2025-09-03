

import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-8">Ceylone Travelgine</h1>
    </div>
  );
};

export default DashboardPage;
