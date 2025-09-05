import React from 'react';

const PrivacyPolicyPage = () => (
  <div className="max-w-3xl mx-auto px-4 py-10 bg-white rounded-lg shadow-md mt-8 mb-16">
    <h1 className="text-3xl font-bold mb-4 text-center text-blue-900">Privacy Policy</h1>
    <div className="text-gray-700 space-y-6">
      <p className="italic text-center text-sm text-gray-500">Effective Date: [Insert Date] &nbsp;|&nbsp; Last Updated: [Insert Date]</p>
      <p>Welcome to <span className="font-semibold">Ceylone Travelgine</span>, an AI-powered smart tourism platform designed to enhance travel experiences in Sri Lanka. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use our platform.</p>
      <p>We are committed to safeguarding your privacy and complying with the Sri Lanka Data Protection Act (2023) and international best practices, including the General Data Protection Regulation (GDPR).</p>
      <p>By using Ceylone Travelgine, you agree to the terms outlined in this policy.</p>
      <h2 className="text-xl font-bold mt-8 mb-2 text-blue-800">1. Information We Collect</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li><span className="font-semibold">Personal Information:</span> Name, email, phone number, nationality (for account creation, communication, support)</li>
        <li><span className="font-semibold">Location Data:</span> GPS coordinates, city, visited attractions (for location-based recommendations, itinerary planning)</li>
        <li><span className="font-semibold">User Preferences:</span> Interests (e.g., culture, food, adventure), budget, travel dates (for personalized travel planning and AI recommendations)</li>
        <li><span className="font-semibold">Behavioral Data:</span> Search history, clicked recommendations, chatbot interactions (to improve AI models and user experience)</li>
        <li><span className="font-semibold">User-Generated Content:</span> Uploaded photos, reviews, feedback (for landmark recognition, community engagement)</li>
        <li><span className="font-semibold">Device & Usage Data:</span> IP address, browser type, device model, app usage (for analytics, performance monitoring, security)</li>
      </ul>
      <h2 className="text-xl font-bold mt-8 mb-2 text-blue-800">2. How We Use Your Data</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>To provide and personalize travel planning, chatbot support, and product recommendations.</li>
        <li>To identify landmarks from your uploaded photos using AI (image recognition).</li>
        <li>To forecast tourist demand and product trends for vendors and administrators.</li>
        <li>To improve platform functionality through AI/ML model training.</li>
        <li>To send real-time alerts (e.g., weather, safety, festivals).</li>
        <li>To comply with legal obligations and prevent fraud.</li>
      </ul>
      <h2 className="text-xl font-bold mt-8 mb-2 text-blue-800">3. Data Sharing & Disclosure</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>We do not sell your data. We only share information in the following cases:</li>
        <li>With verified tour guides or vendors — only the minimum data needed (e.g., booking request, contact info) with your consent.</li>
        <li>With Sri Lanka Tourism Department — aggregated and anonymized data (e.g., tourist flow trends, regional interest) for policy planning.</li>
        <li>With trusted third-party service providers (e.g., cloud hosting, analytics) under strict data processing agreements.</li>
        <li>When required by law or government authorities (e.g., emergency response).</li>
      </ul>
      <h2 className="text-xl font-bold mt-8 mb-2 text-blue-800">4. Data Security</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li><span role="img" aria-label="lock">🔒</span> Encryption of data in transit (HTTPS) and at rest.</li>
        <li><span role="img" aria-label="key">🔐</span> Role-based access control — only authorized personnel can access sensitive data.</li>
        <li><span role="img" aria-label="shield">🛡️</span> Regular security audits and vulnerability testing.</li>
        <li><span role="img" aria-label="file">📁</span> Data stored in secure cloud environments (e.g., Firebase, AWS) with backup and disaster recovery.</li>
      </ul>
      <h2 className="text-xl font-bold mt-8 mb-2 text-blue-800">5. Data Retention</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>Active accounts: Until you delete your account.</li>
        <li>Deleted accounts: Personal data removed within 30 days; anonymized data may be kept for research.</li>
        <li>Analytics data: Stored in aggregated form for up to 2 years.</li>
        <li>You can request data deletion at any time via the app or by emailing <a href="mailto:privacy@ceylone-travelgine.lk" className="text-blue-700 underline">privacy@ceylone-travelgine.lk</a>.</li>
      </ul>
      <h2 className="text-xl font-bold mt-8 mb-2 text-blue-800">6. Your Rights</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>✅ Access your personal data</li>
        <li>✅ Correct inaccurate information</li>
        <li>✅ Delete your data (“Right to be Forgotten”)</li>
        <li>✅ Object to automated decision-making (e.g., AI recommendations)</li>
        <li>✅ Withdraw consent at any time</li>
        <li>✅ Request a data portability report</li>
        <li>To exercise these rights, contact: <a href="mailto:privacy@ceylone-travelgine.lk" className="text-blue-700 underline">privacy@ceylone-travelgine.lk</a></li>
      </ul>
      <h2 className="text-xl font-bold mt-8 mb-2 text-blue-800">7. Children’s Privacy</h2>
      <p>Our platform is not intended for users under 16 years of age. We do not knowingly collect data from children.</p>
      <h2 className="text-xl font-bold mt-8 mb-2 text-blue-800">8. Changes to This Policy</h2>
      <p>We may update this Privacy Policy periodically. You will be notified of significant changes via email or in-app alert.</p>
      <h2 className="text-xl font-bold mt-8 mb-2 text-blue-800">9. Contact Us</h2>
      <p>For privacy-related questions or complaints, contact our Data Protection Officer:</p>
      <ul className="ml-6">
        <li><span className="font-semibold">Ceylone Travelgine Team</span></li>
        <li>Email: <a href="mailto:privacy@ceylone-travelgine.lk" className="text-blue-700 underline">privacy@ceylone-travelgine.lk</a></li>
        <li>Address: International College of Business & Technology, Colombo, Sri Lanka</li>
      </ul>
    </div>
  </div>
);

export default PrivacyPolicyPage;
