import React from 'react';

function RegistrationStepC({ agree, setAgree, submit, back }) {
  return (
    <div>
      <h3>Legal Agreement</h3>
      <p>By registering, you agree to the terms and conditions...</p>
      <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
      <label>I agree to the terms</label>
      <button type="button" onClick={back}>Back</button>
      <button type="button" disabled={!agree} onClick={submit}>Complete Registration</button>
    </div>
  );
}

export default RegistrationStepC;
