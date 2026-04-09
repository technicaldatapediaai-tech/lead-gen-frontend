"use client";

import React, { useState } from 'react';

interface SidebarProps {
  onCategoryChange: (category: string) => void;
  currentCategory: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onCategoryChange, currentCategory }) => {
  const [isShopByCategoryOpen, setIsShopByCategoryOpen] = useState(false);
  const [selectedShopByCategory, setSelectedShopByCategory] = useState<string[]>([]);
  const [expandedSubCategories, setExpandedSubCategories] = useState<string[]>([]);

  const [isBestForOpen, setIsBestForOpen] = useState(false);
  const [showAllBestFor, setShowAllBestFor] = useState(false);
  const [selectedBestFor, setSelectedBestFor] = useState<string[]>([]);

  const [isAlternativeOpen, setIsAlternativeOpen] = useState(false);
  const [showAllAlternative, setShowAllAlternative] = useState(false);
  const [selectedAlternative, setSelectedAlternative] = useState<string[]>([]);

  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const [isPlanTypeOpen, setIsPlanTypeOpen] = useState(false);
  const [selectedPlanType, setSelectedPlanType] = useState<string[]>([]);

  const [isPriceRangeOpen, setIsPriceRangeOpen] = useState(false);
  const [priceType, setPriceType] = useState<'custom' | 'free'>('custom');
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');

  const toggleFilter = (selected: string[], setSelected: React.Dispatch<React.SetStateAction<string[]>>, name: string) => {
    setSelected(prev => 
      prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]
    );
  };

  const categories = [
    { name: 'SHOP BY CATEGORY', icon: 'fas fa-th-large', filter: 'shop' },
    { name: 'BEST FOR', icon: 'fas fa-star', filter: 'best' },
    { name: 'ALTERNATIVE TO', icon: 'fas fa-random', filter: 'alternative' },
    { name: 'FEATURES', icon: 'fas fa-list', filter: 'features' },
    { name: 'PLAN TYPE', icon: 'fas fa-layer-group', filter: 'plan' },
    { name: 'PRICE RANGE', icon: 'fas fa-tags', filter: 'price' },
  ];

  const shopByCategoryList = [
    { 
      name: 'Operations', 
      count: 12,
      subCategories: [
        { name: 'Calendar & scheduling', count: 4 },
        { name: 'Email management', count: 5 },
        { name: 'HR', count: 3 },
        { name: 'Legal', count: 2 },
        { name: 'Productivity', count: 8 },
        { name: 'Project management', count: 6 },
        { name: 'Remote collaboration', count: 5 }
      ]
    },
    { 
      name: 'Marketing & sales', 
      count: 45,
      subCategories: [
        { name: 'Content marketing', count: 12 },
        { name: 'CRM', count: 8 },
        { name: 'Ecommerce', count: 14 },
        { name: 'Email marketing', count: 22 },
        { name: 'Lead generation', count: 18 },
        { name: 'Marketing management', count: 6 },
        { name: 'Sales management', count: 5 },
        { name: 'SEO', count: 15 },
        { name: 'SMS', count: 4 },
        { name: 'Social media', count: 25 },
        { name: 'Social proof', count: 7 },
        { name: 'Webinars & streaming', count: 9 }
      ]
    },
    { 
      name: 'Build it yourself', 
      count: 8,
      subCategories: [
        { name: 'Community builders', count: 2 },
        { name: 'Course builders', count: 3 },
        { name: 'Form builders', count: 6 },
        { name: 'Native app builders', count: 2 },
        { name: 'Web builders', count: 5 }
      ]
    },
    { 
      name: 'Media tools', 
      count: 14,
      subCategories: [
        { name: 'Audio', count: 3 },
        { name: 'Media management', count: 4 },
        { name: 'Photo', count: 5 },
        { name: 'Video', count: 2 },
        { name: 'Visual design', count: 6 }
      ]
    },
    { 
      name: 'Finance', 
      count: 6,
      subCategories: [
        { name: 'Accounting', count: 2 },
        { name: 'Crypto', count: 1 },
        { name: 'Financial analytics', count: 2 },
        { name: 'Investing', count: 1 },
        { name: 'Personal finance', count: 0 }
      ]
    },
    { 
      name: 'Development & IT', 
      count: 22,
      subCategories: [
        { name: 'Augmented reality / VR', count: 3 },
        { name: 'Cloud services & hosting', count: 7 },
        { name: 'Development tools', count: 5 },
        { name: 'Privacy', count: 2 },
        { name: 'Security', count: 4 },
        { name: 'Website analytics', count: 1 }
      ]
    },
    { 
      name: 'Customer experience', 
      count: 9,
      subCategories: [
        { name: 'Customer onboarding', count: 2 },
        { name: 'Customer support', count: 4 },
        { name: 'Feedback management', count: 1 },
        { name: 'Survey software', count: 2 },
        { name: 'User testing', count: 0 }
      ]
    }
  ];

  const bestForList = [
    { name: 'Small businesses', count: 85 },
    { name: 'Marketing agencies', count: 81 },
    { name: 'Marketers', count: 79 },
    { name: 'Content creators', count: 52 },
    { name: 'Solopreneurs', count: 48 },
    { name: 'Bloggers', count: 35 },
    { name: 'Ecommerce', count: 35 },
    { name: 'Developers', count: 34 },
    { name: 'Freelancers', count: 33 },
    { name: 'SaaS', count: 25 },
    { name: 'Web design agencies', count: 25 },
    { name: 'Customer support', count: 22 },
    { name: 'Consultants', count: 21 },
    { name: 'Educators', count: 21 },
    { name: 'Sales managers', count: 18 },
    { name: 'Course creators', count: 17 },
    { name: 'Entrepreneur-curious', count: 14 },
    { name: 'Web designers', count: 14 },
    { name: 'Online coaches', count: 11 },
    { name: 'Project managers', count: 11 },
    { name: 'C-suite', count: 10 },
    { name: 'IT/security agencies', count: 10 },
    { name: 'Remote teams', count: 10 },
    { name: 'Event organizers', count: 9 },
    { name: 'Graphic designers', count: 9 },
    { name: 'Product managers', count: 9 },
    { name: 'Social media managers', count: 9 },
    { name: 'Influencers', count: 8 },
    { name: 'Social media marketers', count: 8 },
    { name: 'Copywriters', count: 7 },
    { name: 'YouTubers', count: 7 },
    { name: 'Real estate', count: 6 },
    { name: 'Task Automation', count: 6 },
    { name: 'Crypto', count: 5 },
    { name: 'Recruiters', count: 5 },
    { name: 'Videographers', count: 5 },
    { name: 'Accountants', count: 4 },
    { name: 'Authors', count: 4 },
    { name: 'Photographers', count: 4 },
    { name: 'Podcasters', count: 4 },
    { name: 'Product designers', count: 2 },
    { name: 'QA', count: 2 },
    { name: 'Virtual assistants', count: 2 },
    { name: 'Visual artists', count: 1 }
  ];

  const alternativeList = [
    { name: 'Canva', count: 16 },
    { name: 'Jasper', count: 13 },
    { name: 'Typeform', count: 13 },
    { name: 'Copy.ai', count: 12 },
    { name: 'Intercom', count: 12 },
    { name: 'Ahrefs', count: 8 },
    { name: 'Linktree', count: 7 },
    { name: 'SEMrush', count: 7 },
    { name: 'SurveyMonkey', count: 7 },
    { name: 'Zapier', count: 7 },
    { name: 'Zendesk', count: 7 },
    { name: 'Bitly', count: 6 },
    { name: 'Calendly', count: 6 },
    { name: 'Notion', count: 6 },
    { name: 'Buffer', count: 5 },
    { name: 'Descript', count: 5 },
    { name: 'DocuSign', count: 5 },
    { name: 'Gravity Forms', count: 5 },
    { name: 'Hootsuite', count: 5 },
    { name: 'Lemlist', count: 5 },
    { name: 'Lusha', count: 5 },
    { name: 'Make', count: 5 },
    { name: 'Acuity Scheduling', count: 4 },
    { name: 'Adobe Photoshop', count: 4 },
    { name: 'Airtable', count: 4 },
    { name: 'Asana', count: 4 },
    { name: 'BirdEye', count: 4 },
    { name: 'ClickUp', count: 4 },
    { name: 'Drift', count: 4 },
    { name: 'Evernote', count: 4 },
    { name: 'Figma', count: 4 },
    { name: 'Monday.com', count: 4 },
    { name: 'Rebrandly', count: 4 },
    { name: 'Teachable', count: 4 },
    { name: 'ZoomInfo', count: 4 },
    { name: 'Adobe Sign', count: 3 },
    { name: 'ClickFunnels', count: 3 },
    { name: 'Google Analytics', count: 3 },
    { name: 'Help Scout', count: 3 },
    { name: 'Hotjar', count: 3 },
    { name: 'Mailchimp', count: 3 },
    { name: 'Microsoft Excel', count: 3 },
    { name: 'Microsoft OneNote', count: 3 },
    { name: 'Outreach', count: 3 },
    { name: 'Salesforce', count: 3 },
    { name: 'Screaming Frog', count: 3 },
    { name: 'Thinkific', count: 3 },
    { name: 'Twilio', count: 3 },
    { name: 'UiPath', count: 3 },
    { name: 'Vimeo', count: 3 }
  ];

  const featuresList = [
    { name: 'AI', count: 118 },
    { name: 'CNAME', count: 61 },
    { name: 'White label', count: 45 }
  ];

  const planTypeList = [
    { name: 'All', count: 154 },
    { name: 'Lifetime deal', count: 82 },
    { name: 'Annual', count: 41 },
    { name: 'Freebie', count: 12 },
    { name: 'Subscription', count: 19 },
    { name: 'Digital download', count: 7 }
  ];

  const renderDropdown = (
    title: string, 
    showAll: boolean, 
    setShowAll: React.Dispatch<React.SetStateAction<boolean>>, 
    list: any[], 
    selected: string[], 
    setSelected: React.Dispatch<React.SetStateAction<string[]>>, 
    isOpen: boolean, 
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, 
    limit = 10
  ) => {
    const displayedItems = showAll ? list : list.slice(0, limit);
    const categoryIcon = categories.find(c => c.name === title)?.icon || 'fas fa-filter';
    
    return (
      <div className="sidebar-dropdown-wrapper">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(!isOpen);
          }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', whiteSpace: 'nowrap' }}>
            <i className={categoryIcon}></i> {title}
          </div>
          <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`} style={{ fontSize: '0.75rem', opacity: 0.6 }}></i>
        </a>
        
        {isOpen && (
          <div className="sidebar-list-content" style={{ 
            paddingLeft: '1.25rem', paddingRight: '1rem', display: 'flex', flexDirection: 'column', 
            gap: '0.65rem', marginTop: '0.75rem', marginBottom: '1.25rem' 
          }}>
            {displayedItems.map((item) => (
              <React.Fragment key={item.name}>
                <div 
                  className="sidebar-filter-item"
                  onClick={(e) => {
                    if (item.subCategories) {
                      e.stopPropagation();
                      setExpandedSubCategories(prev => 
                        prev.includes(item.name) ? prev.filter(i => i !== item.name) : [...prev, item.name]
                      );
                    } else {
                      toggleFilter(selected, setSelected, item.name);
                    }
                  }}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.825rem', 
                    color: selected.includes(item.name) ? '#2563eb' : '#64748b', cursor: 'pointer', transition: 'all 0.2s', padding: '2px 0'
                  }}
                >
                  <div style={{ 
                    width: '18px', height: '18px', border: `1.5px solid ${selected.includes(item.name) ? '#2563eb' : '#cbd5e1'}`,
                    borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: selected.includes(item.name) ? '#2563eb' : 'white', transition: 'all 0.2s', flexShrink: 0
                  }}>
                    {selected.includes(item.name) && <i className="fas fa-check" style={{ color: 'white', fontSize: '9px' }}></i>}
                  </div>
                  <span style={{ 
                    flex: 1, fontWeight: (selected.includes(item.name) || expandedSubCategories.includes(item.name)) ? '600' : '500', 
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>{item.name}</span>
                  {item.subCategories ? (
                    <i className={`fas fa-chevron-${expandedSubCategories.includes(item.name) ? 'up' : 'down'}`} style={{ fontSize: '0.65rem', opacity: 0.5 }}></i>
                  ) : (
                    <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>{item.count}</span>
                  )}
                </div>

                {item.subCategories && expandedSubCategories.includes(item.name) && (
                  <div className="sidebar-sub-list" style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
                    {item.subCategories.map((sub: any) => (
                      <div 
                        key={sub.name}
                        onClick={() => toggleFilter(selected, setSelected, sub.name)}
                        style={{ 
                          display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.775rem', 
                          color: selected.includes(sub.name) ? '#2563eb' : '#64748b', cursor: 'pointer'
                        }}
                      >
                         <div style={{ 
                          width: '14px', height: '14px', border: `1.2px solid ${selected.includes(sub.name) ? '#2563eb' : '#cbd5e1'}`,
                          borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          backgroundColor: selected.includes(sub.name) ? '#2563eb' : 'white'
                        }}>
                          {selected.includes(sub.name) && <i className="fas fa-check" style={{ color: 'white', fontSize: '7.5px' }}></i>}
                        </div>
                        <span style={{ flex: 1 }}>{sub.name}</span>
                        <span style={{ fontSize: '0.65rem', opacity: 0.5 }}>{sub.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
            
            {list.length > limit && (
              <div 
                onClick={(e) => { e.stopPropagation(); setShowAll(!showAll); }}
                style={{ 
                  color: '#2563eb', fontSize: '0.775rem', fontWeight: 700, cursor: 'pointer', 
                  marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '4px 0'
                }}
              >
                {showAll ? 'Show less' : `Show all (${list.length})`}
                <i className={`fas fa-chevron-${showAll ? 'up' : 'down'}`} style={{ fontSize: '0.6rem' }}></i>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="community-sidebar">
      <nav className="sidebar-nav">
        {/* SHOP BY CATEGORY Dropdown */}
        {renderDropdown('SHOP BY CATEGORY', false, () => {}, shopByCategoryList, selectedShopByCategory, setSelectedShopByCategory, isShopByCategoryOpen, setIsShopByCategoryOpen)}

        {/* BEST FOR Dropdown */}
        {renderDropdown('BEST FOR', showAllBestFor, setShowAllBestFor, bestForList, selectedBestFor, setSelectedBestFor, isBestForOpen, setIsBestForOpen)}

        {/* ALTERNATIVE TO Dropdown */}
        {renderDropdown('ALTERNATIVE TO', showAllAlternative, setShowAllAlternative, alternativeList, selectedAlternative, setSelectedAlternative, isAlternativeOpen, setIsAlternativeOpen)}

        {/* FEATURES Dropdown */}
        {renderDropdown('FEATURES', false, () => {}, featuresList, selectedFeatures, setSelectedFeatures, isFeaturesOpen, setIsFeaturesOpen)}

        {/* PLAN TYPE Dropdown */}
        {renderDropdown('PLAN TYPE', false, () => {}, planTypeList, selectedPlanType, setSelectedPlanType, isPlanTypeOpen, setIsPlanTypeOpen)}

        {/* PRICE RANGE Section */}
        <div className="sidebar-dropdown-wrapper">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setIsPriceRangeOpen(!isPriceRangeOpen); }}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <i className="fas fa-tags"></i> PRICE RANGE
            </div>
            <i className={`fas fa-chevron-${isPriceRangeOpen ? 'up' : 'down'}`} style={{ fontSize: '0.75rem', opacity: 0.6 }}></i>
          </a>
          
          {isPriceRangeOpen && (
            <div className="sidebar-price-content" style={{ 
              paddingLeft: '1.25rem', paddingRight: '1rem', paddingTop: '0.75rem', paddingBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem'
            }}>
              <div onClick={() => setPriceType('free')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <div style={{ 
                  width: '18px', height: '18px', borderRadius: '50%', border: `1.5px solid ${priceType === 'free' ? '#2563eb' : '#cbd5e1'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'
                }}>
                  {priceType === 'free' && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563eb' }}></div>}
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Free</span>
              </div>
              <div onClick={() => setPriceType('custom')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <div style={{ 
                  width: '18px', height: '18px', borderRadius: '50%', border: `1.5px solid ${priceType === 'custom' ? '#2563eb' : '#cbd5e1'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'
                }}>
                  {priceType === 'custom' && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563eb' }}></div>}
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Custom range</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.25rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.875rem' }}>$</span>
                  <input type="text" placeholder="from" value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)} onFocus={() => setPriceType('custom')}
                    style={{ width: '100%', padding: '8px 8px 8px 24px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.875rem', outline: 'none', color: '#1e293b' }} />
                </div>
                <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>to</span>
                <div style={{ position: 'relative', flex: 1 }}>
                  <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.875rem' }}>$</span>
                  <input type="text" placeholder="to" value={priceTo} onChange={(e) => setPriceTo(e.target.value)} onFocus={() => setPriceType('custom')}
                    style={{ width: '100%', padding: '8px 8px 8px 24px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.875rem', outline: 'none', color: '#1e293b' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
      <div className="premium-card" style={{ marginTop: 'auto' }}>
        <h4>PREMIUM DEALS</h4>
        <p>Get exclusive access to the highest performing software assets.</p>
        <button className="btn-primary">Explore All</button>
      </div>
    </aside>
  );
};

export default Sidebar;
