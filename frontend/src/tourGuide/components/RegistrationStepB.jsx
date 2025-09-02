import React from 'react';

function RegistrationStepB({ guideDetails, setGuideDetails, next, back }) {
  return (
    <form onSubmit={e => { e.preventDefault(); next(); }}>
      <input type="text" placeholder="SLTDA Reg. Number" value={guideDetails.sltdaRegNum} onChange={e => setGuideDetails(g => ({ ...g, sltdaRegNum: e.target.value }))} required />
      <input type="number" placeholder="Experience Years" value={guideDetails.experienceYears} onChange={e => setGuideDetails(g => ({ ...g, experienceYears: e.target.value }))} required />
      <input type="text" placeholder="Languages Spoken (comma separated)" value={guideDetails.languagesSpoken} onChange={e => setGuideDetails(g => ({ ...g, languagesSpoken: e.target.value.split(',').map(s => s.trim()) }))} required />
      <input type="text" placeholder="Tour Types Offered (comma separated)" value={guideDetails.tourTypesOffered} onChange={e => setGuideDetails(g => ({ ...g, tourTypesOffered: e.target.value.split(',').map(s => s.trim()) }))} required />
      <textarea placeholder="Bio" value={guideDetails.bio} onChange={e => setGuideDetails(g => ({ ...g, bio: e.target.value }))} />
      <input type="file" onChange={e => setGuideDetails(g => ({ ...g, profilePic: e.target.files[0] }))} required />
      <input type="file" onChange={e => setGuideDetails(g => ({ ...g, verificationPhoto: e.target.files[0] }))} required />
      <input type="file" onChange={e => setGuideDetails(g => ({ ...g, sltdaLicensePic: e.target.files[0] }))} required />
      <input type="file" onChange={e => setGuideDetails(g => ({ ...g, documentPdf: e.target.files[0] }))} required />
      <button type="button" onClick={back}>Back</button>
      <button type="submit">Next</button>
    </form>
  );
}

export default RegistrationStepB;
