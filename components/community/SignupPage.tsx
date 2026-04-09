"use client";

import React, { useState } from 'react';
import './SignupPage.css';

interface SignupPageProps {
  onBack: () => void;
  initialEmail?: string;
}

const SignupPage: React.FC<SignupPageProps> = ({ onBack, initialEmail }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [selectedLookingFor, setSelectedLookingFor] = useState<string[]>([]);
  const [selectedPerk, setSelectedPerk] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    const data = {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      linkedin: formData.get('linkedin'),
      startupName: formData.get('startupName'),
      startupUrl: formData.get('startupUrl'),
      stage: formData.get('stage'),
      industry: formData.get('industry'),
      lookingFor: selectedLookingFor,
      betaPerk: selectedPerk
    };

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          onBack();
        }, 3000);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Registration failed. Please try again.');
        setIsSubmitting(false);
      }
    } catch (err) {
      setErrorMessage('Could not connect to the server. Please ensure the backend is running.');
      setIsSubmitting(false);
    }
  };

  const toggleLookingFor = (value: string) => {
    setSelectedLookingFor(prev => 
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  if (success) {
    return (
      <div className="signup-page-success">
        <div className="success-content">
          <div className="success-icon">✓</div>
          <h2>Welcome Aboard!</h2>
          <p>Your application is being reviewed. We&apos;ll be in touch via LinkedIn soon.</p>
          <div className="success-loader">Redirecting to software...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-page">
      <div className="signup-left">
        {/* Using the branded background image set via CSS */}
      </div>

      {/* Right Column: Community Form */}
      <div className="signup-right">
        <div className="signup-nav">
          <div className="app-logo-mini" style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1', gap: '0px', alignItems: 'flex-start', marginTop: '-2.5rem' }}>
              <span className="gradient-text" style={{ 
                fontSize: '1.8rem', 
                fontWeight: 800, 
                letterSpacing: '-1px'
              }}>Leadnius</span>
              <span className="gradient-text" style={{ 
                fontSize: '1rem', 
                fontWeight: 800, 
                letterSpacing: '0px',
                paddingLeft: '0.8rem',
                marginTop: '-4px'
              }}>Community</span>
          </div>
          <button className="btn-back" onClick={onBack}>
            <i className="fas fa-arrow-left"></i> Back to Software
          </button>
        </div>

        <div className="signup-form-scrollable">
          <div className="form-intro">
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
              Register Now
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="community-form">

            <div className="form-block">
              <h4 className="block-title">IDENTITY & AUTHENTICITY</h4>
              <div className="block-row">
                 <div className="input-wrap">
                    <label>Full Name</label>
                    <span className="input-hint">For community trust</span>
                    <input type="text" name="fullName" placeholder="e.g. John Doe" required />
                 </div>
                 <div className="input-wrap">
                    <label>Email Address</label>
                    <span className="input-hint">For application updates</span>
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="e.g. name@company.com" 
                      defaultValue={initialEmail} 
                      required 
                    />
                 </div>
              </div>
              <div className="block-row">
                 <div className="input-wrap">
                    <label>LinkedIn Profile</label>
                    <span className="input-hint">Verification required</span>
                    <input type="url" name="linkedin" placeholder="https://linkedin.com/in/..." required />
                 </div>
                  <div className="input-wrap">
                    <label>Startup Name</label>
                    <span className="input-hint">Current project</span>
                    <input type="text" name="startupName" placeholder="e.g. Acme AI" required />
                  </div>
               </div>
               <div className="block-row">
                  <div className="input-wrap">
                     <label>Startup URL</label>
                     <span className="input-hint">Landing page or product</span>
                     <input type="url" name="startupUrl" placeholder="https://..." required />
                  </div>
               </div>
            </div>

            <div className="form-block">
              <h4 className="block-title">PRODUCT & INDUSTRY</h4>
              <div className="block-row">
                 <div className="input-wrap">
                    <label>Product Stage</label>
                    <select name="stage" required defaultValue="">
                      <option value="" disabled>Select current stage</option>
                      <option value="Ideation">Ideation</option>
                      <option value="MVP/Beta">MVP / Beta</option>
                      <option value="Launched/Scaling">Launched / Scaling</option>
                    </select>
                 </div>
                 <div className="input-wrap">
                    <label>Industry</label>
                    <select name="industry" required defaultValue="">
                      <option value="" disabled>Select industry</option>
                      <option value="SaaS">SaaS</option>
                      <option value="AI">AI</option>
                      <option value="FinTech">FinTech</option>
                      <option value="HealthTech">HealthTech</option>
                      <option value="Other">Other</option>
                    </select>
                 </div>
              </div>
            </div>

            <div className="form-block">
              <h4 className="block-title">COMMUNITY ALIGNMENT</h4>
              <div className="choice-section">
                <label className="choice-label">What are you looking for most?</label>
                <div className="hybrid-choice-grid">
                   {[
                      { val: "Beta Testers & Feedback", icon: "🚀", desc: "Get early feedback" },
                      { val: "First Paying Customers", icon: "💰", desc: "Initial early-adopters" },
                      { val: "Networking & Peer Collaboration", icon: "🤝", desc: "Connect with builders" }
                   ].map(item => (
                      <div 
                        key={item.val}
                        className={`hybrid-card ${selectedLookingFor.includes(item.val) ? 'selected' : ''}`}
                        onClick={() => toggleLookingFor(item.val)}
                      >
                         <span className="card-emoji">{item.icon}</span>
                         <span className="card-name">{item.val}</span>
                      </div>
                   ))}
                </div>
              </div>

              <div className="choice-section">
                <label className="choice-label">Proposed &quot;Beta Perk&quot;</label>
                <div className="hybrid-choice-grid">
                   {[
                      { val: "Lifetime Access (LTD)", icon: "✨" },
                      { val: "Extended Free Trial (e.g., 6 months)", icon: "⏳" },
                      { val: "Significant Discount (e.g., 70% off for early birds)", icon: "🏷️" },
                      { val: "None (Networking/Barter only)", icon: "🌐" }
                   ].map(item => (
                      <div 
                        key={item.val}
                        className={`hybrid-card ${selectedPerk === item.val ? 'selected' : ''}`}
                        onClick={() => setSelectedPerk(item.val)}
                      >
                         <span className="card-emoji">{item.icon}</span>
                         <span className="card-name">{item.val}</span>
                      </div>
                   ))}
                </div>
              </div>
            </div>

            {errorMessage && <div className="error-indicator">{errorMessage}</div>}

            <div className="privacy-consent">
              <input type="checkbox" id="consent" required />
              <label htmlFor="consent">I verify that all information provided is accurate for verification.</label>
            </div>

            <button type="submit" className="btn-hybrid-complete" disabled={isSubmitting}>
              {isSubmitting ? 'Processing Application...' : 'Complete Registration'}
            </button>
            <div className="form-footer-alt">
               <p>Already have an account? <a href="#">Log in</a></p>
               <span className="soc2-footer">SOC2 Type II Compliant & Encrypted</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
