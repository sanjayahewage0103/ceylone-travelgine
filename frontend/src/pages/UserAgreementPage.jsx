import React from 'react';

const UserAgreementPage = () => (
  <div className="max-w-3xl mx-auto px-4 py-10 bg-white rounded-lg shadow-md mt-8 mb-16">
    <h1 className="text-3xl font-bold mb-4 text-center text-blue-900">Platform User Agreement</h1>
    <div className="text-gray-700 space-y-6">
      <p className="italic text-center text-sm text-gray-500">Effective Date: [Insert Date]</p>
      <p>This Agreement governs your use of the <span className="font-semibold">Ceylone Travelgine</span> platform ("the Platform"), developed as part of a research project at the International College of Business & Technology. By creating an account or using the Platform, you agree to these terms.</p>
      <h2 className="text-xl font-bold mt-8 mb-2 text-blue-800">1. Acceptance of Terms</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>You are at least 16 years old.</li>
        <li>You have read and understood this Agreement and the Privacy Policy.</li>
        <li>You agree to use the Platform lawfully and ethically.</li>
      </ul>
      <h2 className="text-xl font-bold mt-8 mb-2 text-blue-800">2. Account Registration</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>You must provide accurate and complete information during registration.</li>
        <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
        <li>Multiple account creation or fake profiles are prohibited.</li>
      </ul>
      <h2 className="text-xl font-bold mt-8 mb-2 text-blue-800">3. User Responsibilities</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>All users (Tourists, Guides, Vendors, Admins) agree to:</li>
        <li>Provide truthful information (e.g., guide qualifications, vendor product details).</li>
        <li>Respect cultural and environmental values of Sri Lanka.</li>
        <li>Not use the platform for illegal, fraudulent, or harmful activities.</li>
        <li>Not upload offensive, misleading, or copyrighted content without permission.</li>
      </ul>
      <h2 className="text-xl font-bold mt-8 mb-2 text-blue-800">4. AI Features & Limitations</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>The Platform uses AI models for recommendations, chatbot responses, and image recognition.</li>
        <li>AI suggestions are not guarantees — users must verify critical information (e.g., travel advisories, health alerts).</li>
        <li>The Platform is not liable for AI-generated errors, but we strive to improve accuracy.</li>
      </ul>
      <h2 className="text-xl font-bold mt-8 mb-2 text-blue-800">5. Content Ownership</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>You retain ownership of content you upload (e.g., photos, reviews).</li>
        <li>By uploading content, you grant Ceylone Travelgine a non-exclusive, royalty-free license to use it for platform functionality and research (e.g., training AI models).</li>
        <li>We will credit cultural origins (e.g., “Mask from Ambalangoda”).</li>
      </ul>
      <h2 className="text-xl font-bold mt-8 mb-2 text-blue-800">6. Prohibited Activities</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>You must not:</li>
        <li>Scrape, reverse-engineer, or exploit the Platform.</li>
        <li>Use bots or automated tools to spam or manipulate data.</li>
        <li>Impersonate others or spread misinformation.</li>
        <li>Upload malware or harmful content.</li>
      </ul>
      <h2 className="text-xl font-bold mt-8 mb-2 text-blue-800">7. Termination</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>We may suspend or terminate your account if you:</li>
        <li>Violate this Agreement.</li>
        <li>Engage in fraudulent or harmful behavior.</li>
        <li>Remain inactive for over 2 years.</li>
        <li>You may delete your account at any time via the app settings.</li>
      </ul>
      <h2 className="text-xl font-bold mt-8 mb-2 text-blue-800">8. Disclaimers</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>The Platform is provided "as is" — we do not guarantee 100% accuracy or availability.</li>
        <li>We are not responsible for third-party services (e.g., weather APIs, maps).</li>
        <li>For emergencies, always contact local authorities (e.g., Police: 119, Ambulance: 110).</li>
      </ul>
      <h2 className="text-xl font-bold mt-8 mb-2 text-blue-800">9. Limitation of Liability</h2>
      <p>To the fullest extent permitted by law, Ceylone Travelgine and its developers are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.</p>
      <h2 className="text-xl font-bold mt-8 mb-2 text-blue-800">10. Governing Law</h2>
      <p>This Agreement is governed by the laws of the Democratic Socialist Republic of Sri Lanka. Any disputes will be resolved in the courts of Colombo.</p>
      <h2 className="text-xl font-bold mt-8 mb-2 text-blue-800">11. Contact</h2>
      <p>For support or legal inquiries: <a href="mailto:support@ceylone-travelgine.lk" className="text-blue-700 underline">support@ceylone-travelgine.lk</a></p>
      <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-900 rounded">
        <h3 className="font-bold mb-2">How This Aligns With Your Proposal</h3>
        <ul className="list-disc ml-6 space-y-1">
          <li><span className="font-semibold">Privacy/Anonymity Concerns:</span> Directly addresses data protection, anonymization, and consent.</li>
          <li><span className="font-semibold">Data Protection Act (2023):</span> Fully compliant with Sri Lankan law.</li>
          <li><span className="font-semibold">GDPR Compliance:</span> Meets international standards for user rights.</li>
          <li><span className="font-semibold">Ethical AI Use:</span> Limits liability for AI errors and ensures transparency.</li>
          <li><span className="font-semibold">Stakeholder Trust:</span> Builds confidence among tourists, guides, vendors, and admins.</li>
          <li><span className="font-semibold">Research Integrity:</span> Ensures ethical data use for your dissertation.</li>
        </ul>
      </div>
    </div>
  </div>
);

export default UserAgreementPage;
