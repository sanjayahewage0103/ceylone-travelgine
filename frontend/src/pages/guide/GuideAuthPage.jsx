import React from 'react';
import GuideRegisterSinglePage from '../../components/guide/GuideRegisterSinglePage';

const GuideAuthPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl p-8 bg-white rounded shadow">
        <GuideRegisterSinglePage />
      </div>
    </div>
  );
};

export default GuideAuthPage;
