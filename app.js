/* ============================================================
   SMART BHARAT – APP.JS
   Core Application Logic
   ============================================================ */

'use strict';

// ── State ──────────────────────────────────────────────────
const STATE = {
  currentSection: 'home',
  theme: localStorage.getItem('sb_theme') || 'light',
  contrast: localStorage.getItem('sb_contrast') || 'normal',
  fontScale: parseFloat(localStorage.getItem('sb_font') || '1'),
  lang: localStorage.getItem('sb_lang') || 'en',
  geminiKey: localStorage.getItem('sb_gemini_key') || '',
  ttsEnabled: false,
  isRecording: false,
  recognition: null,
  issues: JSON.parse(localStorage.getItem('sb_issues') || '[]'),
  checkedDocs: JSON.parse(localStorage.getItem('sb_docs') || '{}'),
  currentDocService: 'aadhaar',
  mapInstance: null,
  mapMarker: null,
  issueCoords: null,
  chatHistory: [],
  typingTimeout: null,
};

// ── i18n Translations ──────────────────────────────────────
const TRANSLATIONS = {
  en: {
    hero_title: 'Namaste! 🙏 Welcome to Smart Bharat',
    hero_sub: 'Your AI-powered gateway to every government service in India. Ask Seva Sathi, find yojanas, report civic issues — all in one place.',
    btn_chat: 'Talk to Seva Sathi',
    btn_schemes: 'Find Schemes',
    btn_report: 'Report Issue',
    nav_home: 'Dashboard',
    nav_chat: 'Seva Sathi AI',
    nav_schemes: 'Yojana Finder',
    nav_report: 'Report Issue',
    nav_tracker: 'Track Complaints',
    nav_docs: 'Document Guide',
    chat_title: '🤖 Seva Sathi – AI Companion',
    chat_sub: 'Ask anything about government services, schemes, and civic help in any language.',
    schemes_title: '📋 Yojana Finder',
    report_title: '📍 Report Civic Issue',
    tracker_title: '📊 Track Complaints',
    docs_title: '📄 Document Guide',
    bot_name: 'Seva Sathi',
    welcome_msg: "Namaste! 🙏 I'm Seva Sathi, your AI-powered civic companion. I can help you with:\n\n• 🏛️ Government schemes & yojanas\n• 📄 Document requirements\n• 📍 Reporting civic issues\n• 🎓 Education scholarships\n• 🏥 Health & insurance schemes\n• 💼 Business & MSME support\n\nAsk me anything in **English, Hindi, Tamil, Telugu, Bangla, or Marathi**! How can I assist you today?",
    sug_1: 'How to apply for Aadhaar?',
    sug_2: 'PM-KISAN eligibility',
    sug_3: 'Passport documents needed',
    sug_4: 'Senior citizen pension scheme',
    sug_5: 'Beti Bachao Beti Padhao',
  },
  hi: {
    hero_title: 'नमस्ते! 🙏 स्मार्ट भारत में आपका स्वागत है',
    hero_sub: 'भारत में हर सरकारी सेवा का आपका AI-संचालित प्रवेशद्वार। सेवा साथी से पूछें, योजनाएं खोजें, नागरिक समस्याएं रिपोर्ट करें — सब एक जगह।',
    btn_chat: 'सेवा साथी से बात करें',
    btn_schemes: 'योजनाएं खोजें',
    btn_report: 'समस्या रिपोर्ट करें',
    nav_home: 'डैशबोर्ड',
    nav_chat: 'सेवा साथी AI',
    nav_schemes: 'योजना खोजक',
    nav_report: 'समस्या रिपोर्ट',
    nav_tracker: 'शिकायत ट्रैकर',
    nav_docs: 'दस्तावेज़ मार्गदर्शिका',
    chat_title: '🤖 सेवा साथी – AI सहायक',
    chat_sub: 'किसी भी भाषा में सरकारी सेवाओं, योजनाओं और नागरिक सहायता के बारे में कुछ भी पूछें।',
    schemes_title: '📋 योजना खोजक',
    report_title: '📍 नागरिक समस्या रिपोर्ट करें',
    tracker_title: '📊 शिकायत ट्रैक करें',
    docs_title: '📄 दस्तावेज़ मार्गदर्शिका',
    bot_name: 'सेवा साथी',
    welcome_msg: 'नमस्ते! 🙏 मैं सेवा साथी हूं, आपका AI नागरिक सहायक। मैं आपकी इन चीज़ों में मदद कर सकता हूं:\n\n• 🏛️ सरकारी योजनाएं\n• 📄 दस्तावेज़ आवश्यकताएं\n• 📍 नागरिक समस्याएं\n• 🎓 शिक्षा छात्रवृत्ति\n• 🏥 स्वास्थ्य बीमा\n\nआज मैं आपकी कैसे सहायता कर सकता हूं?',
    sug_1: 'आधार कार्ड कैसे बनवाएं?',
    sug_2: 'PM-KISAN पात्रता',
    sug_3: 'पासपोर्ट के लिए दस्तावेज़',
    sug_4: 'वरिष्ठ नागरिक पेंशन',
    sug_5: 'बेटी बचाओ बेटी पढ़ाओ',
  },
  ta: {
    hero_title: 'வணக்கம்! 🙏 Smart Bharat-க்கு வரவேற்கிறோம்',
    hero_sub: 'இந்திய அரசு சேவைகளுக்கான உங்கள் AI தளம். செவா சாத்தியிடம் கேளுங்கள், திட்டங்கள் கண்டறியுங்கள்.',
    btn_chat: 'செவா சாத்தியிடம் பேசு',
    btn_schemes: 'திட்டங்கள் கண்டறி',
    btn_report: 'பிரச்சினை தெரிவி',
    nav_home: 'முகப்பு',
    nav_chat: 'செவா சாத்தி AI',
    nav_schemes: 'யோஜனா தேடல்',
    nav_report: 'புகார் தெரிவி',
    nav_tracker: 'புகார் கண்காணி',
    nav_docs: 'ஆவண வழிகாட்டி',
    chat_title: '🤖 செவா சாத்தி – AI உதவியாளர்',
    chat_sub: 'எந்த மொழியிலும் அரசு சேவைகள் பற்றி கேளுங்கள்.',
    schemes_title: '📋 யோஜனா தேடல்',
    report_title: '📍 குடிமகன் பிரச்சினை தெரிவிக்கவும்',
    tracker_title: '📊 புகார்களை கண்காணி',
    docs_title: '📄 ஆவண வழிகாட்டி',
    bot_name: 'செவா சாத்தி',
    welcome_msg: 'வணக்கம்! 🙏 நான் செவா சாத்தி, உங்கள் AI குடிமகன் உதவியாளர். அரசு திட்டங்கள், ஆவணங்கள், புகார்கள் பற்றி கேளுங்கள்!',
    sug_1: 'ஆதார் கார்டு எப்படி பெறுவது?',
    sug_2: 'PM-KISAN தகுதி',
    sug_3: 'பாஸ்போர்ட் ஆவணங்கள்',
    sug_4: 'மூத்த குடிமகன் திட்டங்கள்',
    sug_5: 'பெண் கல்வி திட்டங்கள்',
  },
};
TRANSLATIONS.te = { ...TRANSLATIONS.en, hero_title: 'నమస్కారం! 🙏 స్మార్ట్ భారత్‌కు స్వాగతం', bot_name: 'సేవా సాథీ', welcome_msg: 'నమస్కారం! 🙏 నేను సేవా సాథీని, మీ AI పౌర సహాయకుడు. ప్రభుత్వ సేవలు, పథకాలు గురించి అడగండి!' };
TRANSLATIONS.bn = { ...TRANSLATIONS.en, hero_title: 'নমস্কার! 🙏 স্মার্ট ভারতে স্বাগতম', bot_name: 'সেবা সাথী', welcome_msg: 'নমস্কার! 🙏 আমি সেবা সাথী, আপনার AI নাগরিক সহায়ক। সরকারি সেবা ও প্রকল্প সম্পর্কে জিজ্ঞাসা করুন!' };
TRANSLATIONS.mr = { ...TRANSLATIONS.en, hero_title: 'नमस्कार! 🙏 स्मार्ट भारतमध्ये आपले स्वागत आहे', bot_name: 'सेवा साथी', welcome_msg: 'नमस्कार! 🙏 मी सेवा साथी आहे, तुमचा AI नागरिक सहाय्यक. सरकारी योजना, कागदपत्रे याबद्दल विचारा!' };

// ── AI Knowledge Base ──────────────────────────────────────
const AI_RESPONSES = {
  aadhaar: {
    keywords: ['aadhaar', 'aadhar', 'आधार', 'uid', 'unique id'],
    response: `**🪪 Aadhaar Card – Complete Guide**

**What is Aadhaar?**
A 12-digit unique identity number issued by UIDAI to every resident of India.

**How to Apply (New Enrollment):**
1. Visit nearest **Aadhaar Enrolment Centre** (check uidai.gov.in)
2. Fill Enrolment Form (Name, Address, DOB, Mobile)
3. Provide **biometric data** (fingerprints + iris scan)
4. Get Acknowledgement Slip with Enrollment ID (EID)
5. Download e-Aadhaar from uidai.gov.in in **4–7 working days**

**Documents Required:**
- Identity Proof: PAN, Voter ID, Passport, or Birth Certificate
- Address Proof: Utility Bill, Bank Statement, Passport
- Date of Birth Proof: Birth Certificate, Marksheet, Passport

**Online Services:** uidai.gov.in
- Update Address Online
- Download e-Aadhaar
- Lock/Unlock Biometrics
- Check Aadhaar Authentication History

**Helpline:** 1947 (toll-free) | help@uidai.gov.in`
  },
  passport: {
    keywords: ['passport', 'पासपोर्ट', 'travel document'],
    response: `**🛂 Indian Passport – Complete Guide**

**Types of Passport:**
- **Regular Passport** (Blue) – 10-year validity for adults
- **Tatkal Passport** – Expedited in 1–3 days (extra fee)

**Apply Online (Recommended):**
1. Register on **passportindia.gov.in**
2. Fill Online Application Form (Part A & B)
3. Pay fee online (₹1,500 for 36 pages / ₹2,000 for 60 pages)
4. Book appointment at nearest **Passport Seva Kendra (PSK)**
5. Visit PSK with original documents
6. Police Verification (usually completed in 7–14 days)
7. Receive passport by **post within 3 weeks**

**Documents Required:**
- Proof of Identity: Aadhaar, Voter ID, or PAN Card
- Proof of Address: Aadhaar, Utility Bill, Bank Statement
- Date of Birth: Birth Certificate or Matriculation Certificate
- 2 recent passport-size photographs
- Self-attested photocopies of all documents

**Tatkal Fee:** Additional ₹2,000
**Helpline:** 1800-258-1800`
  },
  'pm-kisan': {
    keywords: ['pm kisan', 'pm-kisan', 'kisan', 'किसान', 'farmer scheme', 'agriculture'],
    response: `**🌾 PM-KISAN Scheme – Pradhan Mantri Kisan Samman Nidhi**

**Benefit:** ₹6,000 per year in **3 installments of ₹2,000** directly to farmer's bank account.

**Eligibility:**
✅ Small and Marginal Farmers (owning up to 2 hectares)
✅ Indian citizen with valid land ownership records
❌ Income Tax payers are NOT eligible
❌ Government employees and pensioners NOT eligible

**How to Register:**
1. Visit **pmkisan.gov.in** or nearest Common Service Centre (CSC)
2. Submit Aadhaar, Bank Account, and Land Records
3. State/District Agriculture Officer verifies
4. Benefits credited to Aadhaar-linked bank account

**Check Payment Status:** pmkisan.gov.in → Beneficiary Status
**Helpline:** PM-KISAN Helpline: 155261 / 011-24300606

**Next Installment:** Check pmkisan.gov.in for current status`
  },
  ration: {
    keywords: ['ration', 'ration card', 'राशन', 'pds', 'food subsidy'],
    response: `**🛒 Ration Card – Public Distribution System**

**Types of Ration Cards:**
- **BPL (Below Poverty Line)** – Below poverty income
- **APL (Above Poverty Line)** – Above poverty, reduced subsidy
- **AAY (Antyodaya Anna Yojana)** – Poorest of the poor, max subsidy
- **PHH (Priority Household)** – Eligible under NFSA

**Benefits:**
- Subsidized **rice at ₹3/kg**, wheat at ₹2/kg
- Access to kerosene, cooking oil at reduced rates
- Used as address proof for other documents

**Apply Online:** your state's Food & Civil Supplies portal (e.g., nfsa.gov.in)

**Documents Required:**
- Aadhaar cards of all family members
- Existing Ration Card (for additions/corrections)
- Electricity Bill or Bank Passbook (address proof)
- Income Certificate / BPL Certificate
- Passport size photos of Head of Family

**Track Status:** nfsa.gov.in or your state portal`
  },
  pension: {
    keywords: ['pension', 'पेंशन', 'senior citizen', 'old age', 'vridha'],
    response: `**🏦 Senior Citizen Schemes – Complete Guide**

**1. Pradhan Mantri Vaya Vandana Yojana (PMVVY)**
- Guaranteed Pension: ₹1,000 – ₹9,250/month
- For: Citizens aged 60+
- Investment: Up to ₹15 lakh in LIC
- Tenure: 10 years

**2. Indira Gandhi National Old Age Pension Scheme (IGNOAPS)**
- For: BPL citizens aged 60–79: ₹200/month; 80+: ₹500/month
- Apply: District Social Welfare Office or Gram Panchayat

**3. Atal Pension Yojana (APY)**
- For: Unorganized sector workers aged 18–40
- Pension: ₹1,000–₹5,000/month after age 60
- Apply: Any bank or post office

**4. Senior Citizen Savings Scheme (SCSS)**
- Interest Rate: 8.2% per annum (quarterly)
- For: 60+ years (55+ for VRS retirees)
- Max Deposit: ₹30 lakh
- Apply at any post office or authorized bank

**Helpline:** 14567 (Elder Line, Toll-Free)`
  },
  scholarship: {
    keywords: ['scholarship', 'छात्रवृत्ति', 'education', 'student', 'bursary'],
    response: `**🎓 National Scholarship Schemes for Students**

**1. National Scholarship Portal (NSP)**
- Platform: scholarships.gov.in
- Covers: Pre-matric, Post-matric, Merit-cum-Means scholarships
- For: SC/ST/OBC/Minority/Disabled students

**2. PM Scholarship Scheme**
- For: Wards of Ex-Servicemen & Police personnel
- Amount: ₹2,500–₹3,000/month
- Apply: desw.gov.in

**3. Begum Hazrat Mahal National Scholarship**
- For: Minority girls (Class 9 to 12)
- Amount: ₹10,000–₹12,000/year

**4. INSPIRE Scholarship (DST)**
- For: Top 1% in Class 12, pursuing Science
- Amount: ₹80,000/year

**5. Post-Matric Scholarship for SC Students**
- For: SC students for higher education
- Income Limit: ₹2.5 lakh/year for family

**How to Apply:**
1. Register on scholarships.gov.in
2. Select the right scholarship
3. Upload required documents (Marksheet, Income Certificate, Caste Certificate, Bank details)
4. Submit and track on the portal`
  },
  health: {
    keywords: ['ayushman', 'health', 'hospital', 'insurance', 'pmjay', 'jan arogya'],
    response: `**🏥 Ayushman Bharat – PM Jan Arogya Yojana (PM-JAY)**

**What it provides:**
- Health coverage of ₹5 lakh per family per year
- Covers 1,949+ medical procedures
- Cashless treatment at empaneled hospitals
- **Covers secondary & tertiary care** hospitalizations

**Eligibility:**
- Families listed in **SECC 2011 Database**
- Recently extended to ALL citizens aged **70+**
- No income limit for senior citizens

**How to Use:**
1. Check eligibility: pmjay.gov.in or call 14555
2. Visit any **empaneled government/private hospital**
3. Show Aadhaar or Ration Card at Ayushman counter
4. Treatment starts immediately (NO pre-authorization for 3-day pre-hospitalization)

**To Get Ayushman Card:**
- pmjay.gov.in → Beneficiary Login
- Common Service Centre (CSC) across India
- Any empaneled hospital

**Helpline:** 14555 (Toll-Free)`
  },
  driving: {
    keywords: ['driving license', 'dl', 'licence', 'driving', 'vehicle'],
    response: `**🚗 Driving License – Step-by-Step Guide**

**Step 1: Learner's License (LL)**
1. Apply online at **parivahan.gov.in**
2. Fill Form 2 + upload documents
3. Pay fee (₹200-500 depending on vehicle class)
4. Schedule slot for Learner's Licence Test (online MCQ)
5. LL valid for 6 months

**Step 2: Permanent License**
1. Practice driving for minimum 30 days after LL
2. Apply online at parivahan.gov.in (Form 4)
3. Book appointment at nearest **RTO**
4. Appear for **Driving Test** at RTO
5. License issued within 7 days on success

**Documents Required:**
- Aadhaar Card (Identity + Address proof)
- Date of Birth proof (Class 10 Certificate, Aadhaar)
- 3 recent passport-size photographs
- Medical Certificate (Form 1A for commercial)
- Learner's License (for permanent DL)

**Fee Structure:**
- LL Test: ₹200 | Permanent DL: ₹300-700
- International DL: ₹500

**Track Status:** parivahan.gov.in → License Status`
  },
  pothole: {
    keywords: ['pothole', 'road', 'damage', 'repair', 'sinkhole'],
    response: `**🚧 Reporting Road Damage / Potholes**

You can report road potholes through:

**1. Smart Bharat (This Platform)**
- Click **"Report Issue"** in the left sidebar
- Select "Pothole / Road Damage"
- Add location (GPS or manual)
- Upload a photo as evidence
- Submit and track with your complaint ID

**2. Official Portals:**
- **National Highway:** nhb.gov.in/complaint
- **CPGRAMS:** pgportal.gov.in (central grievances)
- **State PWD websites** for state roads
- **Municipal Corporation apps** for city roads

**3. Mobile Apps:**
- **MyGov** App
- **311 City Connect** (available in select cities)

**Important Information to Include:**
- Exact location (nearest landmark)
- GPS coordinates if possible
- Photo of the damage
- When you first noticed it
- Estimated size of the damage

**Expected Resolution Time:** 7–30 days depending on severity and road ownership`
  },
  housing: {
    keywords: ['house', 'home', 'housing', 'pm awas', 'awas yojana', 'pmay'],
    response: `**🏠 Pradhan Mantri Awas Yojana (PMAY) – Housing for All**

**Two Components:**
- **PMAY-Urban** – For cities (pmaymis.gov.in)
- **PMAY-Gramin** – For villages (pmayg.nic.in)

**Benefits:**
- Subsidy on home loan interest (up to ₹2.67 lakh)
- Free house construction assistance (Gramin: ₹1.2 – ₹1.3 lakh)
- Connected to piped water, electricity, toilet

**Eligibility (Urban):**
- EWS: Annual income up to ₹3 lakh
- LIG: Annual income ₹3–6 lakh
- MIG-I: ₹6–12 lakh | MIG-II: ₹12–18 lakh
- No existing pucca house in family

**Apply:**
1. Visit pmaymis.gov.in (Urban)
2. Click "Citizen Assessment" → Select category
3. Fill Aadhaar-verified form
4. Submit and note Application ID

**Documents:** Aadhaar, Income Certificate, Bank Account, Land ownership/Lease deed

**Helpline:** 1800-11-6163`
  },
  default: {
    response: `**🤖 I can help you with:**

• **Government Schemes:** PM-KISAN, Ayushman Bharat, PMAY, Scholarship schemes
• **Document Requirements:** Aadhaar, Passport, Ration Card, Driving License
• **Civic Issues:** Report potholes, garbage, water, electricity problems
• **Senior Citizen:** Pension schemes, health benefits, concessions
• **Education:** Scholarships, Navodaya Vidyalaya, IIT/NIT help
• **Business:** MSME loans, Mudra Yojana, Startup India

**Try asking:**
- "How to apply for Aadhaar?"
- "PM-KISAN eligibility criteria"
- "Documents for passport renewal"
- "Senior citizen pension scheme"

Or just type your question naturally! 🙏`
  }
};

// ── Government Schemes Data ────────────────────────────────
const SCHEMES_DATA = [
  { id: 1, name: 'PM-KISAN', icon: '🌾', category: 'farmer', income: ['bpl', 'low'], desc: 'Direct income support of ₹6,000/year to small & marginal farmers in 3 installments.', benefit: '₹6,000/year directly to bank account', tags: ['Farmer', 'Agriculture', 'Direct Benefit Transfer'], url: 'pmkisan.gov.in' },
  { id: 2, name: 'Ayushman Bharat PM-JAY', icon: '🏥', category: 'health', income: ['bpl', 'low', 'mid'], desc: 'Cashless health coverage of ₹5 lakh per family per year at empaneled hospitals.', benefit: '₹5 lakh/year health cover', tags: ['Health', 'Insurance', 'Hospitalization'], url: 'pmjay.gov.in' },
  { id: 3, name: 'PM Awas Yojana', icon: '🏠', category: 'housing', income: ['bpl', 'low', 'mid'], desc: 'Affordable housing scheme providing subsidy on home loans and free houses for the poor.', benefit: 'Up to ₹2.67 lakh interest subsidy', tags: ['Housing', 'Urban', 'Rural'], url: 'pmaymis.gov.in' },
  { id: 4, name: 'Beti Bachao Beti Padhao', icon: '👧', category: 'women', income: ['all'], desc: 'Scheme to promote welfare of the girl child and ensure her education and protection.', benefit: 'Education grants + awareness programs', tags: ['Women', 'Girl Child', 'Education'], url: 'wcd.nic.in' },
  { id: 5, name: 'PM Jan Dhan Yojana', icon: '🏦', category: 'all', income: ['bpl', 'low'], desc: 'Zero-balance bank account with RuPay debit card, life & accident insurance.', benefit: '₹2 lakh accident insurance + overdraft', tags: ['Banking', 'Financial Inclusion'], url: 'pmjdy.gov.in' },
  { id: 6, name: 'NSP Post-Matric Scholarship', icon: '🎓', category: 'student', income: ['bpl', 'low', 'mid'], desc: 'Scholarships for SC/ST/OBC/Minority students for higher education.', benefit: 'Up to ₹1,200/month + tuition fee', tags: ['Education', 'Scholarship', 'SC/ST/OBC'], url: 'scholarships.gov.in' },
  { id: 7, name: 'Atal Pension Yojana', icon: '👴', category: 'senior', income: ['all'], desc: 'Guaranteed pension of ₹1,000–₹5,000/month for unorganized sector workers.', benefit: '₹1,000–₹5,000/month pension', tags: ['Pension', 'Senior', 'Retirement'], url: 'npscra.nsdl.co.in' },
  { id: 8, name: 'Mudra Yojana', icon: '💼', category: 'business', income: ['all'], desc: 'Micro-finance loans up to ₹10 lakh for small businesses and entrepreneurs.', benefit: 'Loans up to ₹10 lakh, no collateral', tags: ['Business', 'MSME', 'Entrepreneur', 'Loan'], url: 'mudra.org.in' },
  { id: 9, name: 'PM Fasal Bima Yojana', icon: '🌿', category: 'farmer', income: ['all'], desc: 'Crop insurance scheme providing financial support to farmers in case of crop failure.', benefit: 'Full crop loss coverage at minimal premium', tags: ['Farmer', 'Insurance', 'Crop'], url: 'pmfby.gov.in' },
  { id: 10, name: 'Sukanya Samriddhi Yojana', icon: '💕', category: 'women', income: ['all'], desc: 'High-interest savings scheme for girl child with tax benefits.', benefit: '8.2% p.a. interest, tax free maturity', tags: ['Women', 'Girl Child', 'Savings'], url: 'nsiindia.gov.in' },
  { id: 11, name: 'Pradhan Mantri Kaushal Vikas', icon: '🛠️', category: 'student', income: ['all'], desc: 'Skill development training scheme for unemployed youth with certification.', benefit: 'Free training + ₹8,000 stipend', tags: ['Skills', 'Employment', 'Youth', 'Training'], url: 'pmkvyofficial.org' },
  { id: 12, name: 'IGNOAPS Old Age Pension', icon: '🧓', category: 'senior', income: ['bpl'], desc: 'Monthly pension for Below Poverty Line senior citizens aged 60 and above.', benefit: '₹200–₹500/month pension', tags: ['Senior', 'Pension', 'BPL'], url: 'nsap.nic.in' },
  { id: 13, name: 'Startup India', icon: '🚀', category: 'business', income: ['all'], desc: 'Support for startups including tax benefits, funding, and faster approvals.', benefit: '3-year tax holiday + DPIIT recognition', tags: ['Startup', 'Business', 'Innovation'], url: 'startupindia.gov.in' },
  { id: 14, name: 'Stand Up India', icon: '🌟', category: 'women', income: ['all'], desc: 'Bank loans for SC/ST and women entrepreneurs to set up greenfield enterprises.', benefit: 'Loans ₹10 lakh–₹1 crore', tags: ['Women', 'SC/ST', 'Business', 'Loan'], url: 'standupmitra.in' },
];

// ── Document Requirements Data ─────────────────────────────
const DOC_DATA = {
  aadhaar: {
    label: '🪪 Aadhaar Card',
    docs: [
      { name: 'Proof of Identity', note: 'PAN Card, Voter ID, or School Certificate', required: true },
      { name: 'Proof of Address', note: 'Utility Bill (last 3 months), Bank Statement, or Passport', required: true },
      { name: 'Date of Birth Proof', note: 'Birth Certificate, Class 10 Marksheet, or Passport', required: true },
      { name: 'Mobile Number', note: 'For OTP verification (highly recommended)', required: false },
      { name: 'Email Address', note: 'For digital communication (optional)', required: false },
    ],
    steps: [
      { step: '1', text: 'Find nearest Aadhaar Enrolment Centre at uidai.gov.in' },
      { step: '2', text: 'Fill the Enrolment Form with personal details' },
      { step: '3', text: 'Submit biometric data (fingerprints & iris scan)' },
      { step: '4', text: 'Receive acknowledgement slip with 14-digit EID' },
      { step: '5', text: 'Download e-Aadhaar in 4-7 days from uidai.gov.in' },
    ],
    links: [
      { label: 'Book Appointment', url: 'https://appointments.uidai.gov.in/' },
      { label: 'Find Enrolment Centre', url: 'https://uidai.gov.in/locate-enrolment-centre.html' },
      { label: 'Download e-Aadhaar', url: 'https://eaadhaar.uidai.gov.in/' },
    ],
  },
  passport: {
    label: '🛂 Passport',
    docs: [
      { name: 'Proof of Identity', note: 'Aadhaar, Voter ID, or PAN Card', required: true },
      { name: 'Proof of Address', note: 'Aadhaar, Bank Statement, or Utility Bill', required: true },
      { name: 'Date of Birth Proof', note: 'Birth Certificate or Class 10 Certificate', required: true },
      { name: 'Passport-size Photographs', note: '2 recent colour photographs (3.5x3.5 cm, white background)', required: true },
      { name: 'Old Passport (Renewal only)', note: 'Original + self-attested photocopy of all pages', required: false },
    ],
    steps: [
      { step: '1', text: 'Register on passportindia.gov.in' },
      { step: '2', text: 'Fill Online Application Form (Part A & B)' },
      { step: '3', text: 'Pay application fee online' },
      { step: '4', text: 'Book appointment at nearest Passport Seva Kendra (PSK)' },
      { step: '5', text: 'Attend appointment with original documents' },
      { step: '6', text: 'Police verification (7-14 days) → receive passport by post' },
    ],
    links: [
      { label: 'Apply Online', url: 'https://passportindia.gov.in/' },
      { label: 'Find Passport Seva Kendra', url: 'https://www.passportindia.gov.in/AppOnlineProject/online/findPskPop' },
      { label: 'Track Application', url: 'https://www.passportindia.gov.in/AppOnlineProject/statusTracker/trackStatusInpNew' },
    ],
  },
  ration: {
    label: '🛒 Ration Card',
    docs: [
      { name: 'Aadhaar of all family members', note: 'Mandatory for NFSA linkage', required: true },
      { name: 'Proof of Address', note: 'Electricity Bill, Bank Passbook, or existing Ration Card', required: true },
      { name: 'Income Certificate or BPL Certificate', note: 'From Tehsildar or Revenue Officer', required: true },
      { name: 'Passport-size photo of head of family', note: '1 recent colour photograph', required: true },
      { name: 'Family composition details', note: 'Names and ages of all members to be included', required: true },
    ],
    steps: [
      { step: '1', text: 'Visit your state Food & Civil Supplies portal' },
      { step: '2', text: 'Fill application form with family details' },
      { step: '3', text: 'Submit at nearest Fair Price Shop (FPS) or CSC' },
      { step: '4', text: 'Verification by Food Inspector' },
      { step: '5', text: 'Ration Card issued within 15-30 days' },
    ],
    links: [
      { label: 'National Food Security Act Portal', url: 'https://nfsa.gov.in/' },
      { label: 'Track Ration Card Status', url: 'https://nfsa.gov.in/Default.aspx' },
      { label: 'One Nation One Ration Card', url: 'https://onorcpin.nic.in/' },
    ],
  },
  driving: {
    label: '🚗 Driving License',
    docs: [
      { name: 'Proof of Identity', note: 'Aadhaar, Voter ID, or PAN Card', required: true },
      { name: 'Proof of Address', note: 'Aadhaar, Utility Bill, or Bank Statement', required: true },
      { name: 'Date of Birth Proof', note: 'Birth Certificate or Class 10 Marksheet', required: true },
      { name: 'Passport-size Photographs', note: '3 recent colour photographs', required: true },
      { name: 'Learner\'s License', note: 'Required for Permanent DL application', required: false },
      { name: 'Medical Certificate (Form 1A)', note: 'Required for commercial/heavy vehicles', required: false },
    ],
    steps: [
      { step: '1', text: 'Apply online for Learner\'s License at parivahan.gov.in' },
      { step: '2', text: 'Pass LL test at nearest RTO (online MCQ)' },
      { step: '3', text: 'Practice driving for at least 30 days' },
      { step: '4', text: 'Apply for Permanent DL online, book driving test slot' },
      { step: '5', text: 'Attend driving test at RTO, receive DL in 7 days' },
    ],
    links: [
      { label: 'Apply at Parivahan Sewa', url: 'https://parivahan.gov.in/parivahan/' },
      { label: 'Track DL Application', url: 'https://sarathi.parivahan.gov.in/' },
      { label: 'Vehicle Registration Check', url: 'https://vahan.parivahan.gov.in/vahanservice/' },
    ],
  },
  birth: {
    label: '📜 Birth Certificate',
    docs: [
      { name: 'Hospital Discharge Certificate', note: 'For hospital births (mandatory)', required: true },
      { name: 'Father\'s/Mother\'s Aadhaar', note: 'Both parents\' identity proof', required: true },
      { name: 'Marriage Certificate of Parents', note: 'To establish parentage', required: true },
      { name: 'Proof of Residence', note: 'Utility Bill or Aadhaar of parent', required: true },
      { name: 'For Home/Unregistered Births', note: 'Affidavit from Notary / Gram Panchayat record', required: false },
    ],
    steps: [
      { step: '1', text: 'Register birth within 21 days at municipal/panchayat office' },
      { step: '2', text: 'Submit hospital certificate and parents\' documents' },
      { step: '3', text: 'After 21 days but within 30 days: late fee applies' },
      { step: '4', text: 'After 30 days: requires magistrate/court order' },
      { step: '5', text: 'Collect birth certificate (usually same day or within 3 days)' },
    ],
    links: [
      { label: 'Online Birth Certificate (Select States)', url: 'https://crsorgi.gov.in/' },
      { label: 'Civil Registration System', url: 'https://crs.gov.in/' },
    ],
  },
  pension: {
    label: '🏦 Pension / PPF',
    docs: [
      { name: 'Aadhaar Card', note: 'Primary identity and KYC', required: true },
      { name: 'PAN Card', note: 'For tax declaration and investment', required: true },
      { name: 'Bank Account Details', note: 'Passbook copy with IFSC code', required: true },
      { name: 'Proof of Age', note: 'Birth Certificate or Class 10 Certificate', required: true },
      { name: 'Pension Sanction Order (for govt.)', note: 'From employing office for govt. employees', required: false },
      { name: 'Service Records (for govt.)', note: 'Form 5 and Form 10 (government employees)', required: false },
    ],
    steps: [
      { step: '1', text: 'Choose scheme: APY/PPF/SCSS/NPS based on your profile' },
      { step: '2', text: 'Visit nearest bank, post office, or apply online' },
      { step: '3', text: 'Submit KYC documents and nomination form' },
      { step: '4', text: 'Open account and start regular contributions' },
      { step: '5', text: 'Track contributions on bank/NPS portal' },
    ],
    links: [
      { label: 'National Pension System (NPS)', url: 'https://www.npscra.nsdl.co.in/' },
      { label: 'Atal Pension Yojana', url: 'https://npscra.nsdl.co.in/apy.php' },
      { label: 'Senior Citizens\' Corner (Finance Ministry)', url: 'https://financialservices.gov.in/' },
    ],
  },
  income: {
    label: '💰 Income Certificate',
    docs: [
      { name: 'Aadhaar Card', note: 'Primary identity proof', required: true },
      { name: 'Ration Card / Voter ID', note: 'Additional address proof', required: true },
      { name: 'Salary Slips (last 3 months)', note: 'For salaried employees', required: false },
      { name: 'ITR / Form 16', note: 'Income Tax Return for previous year', required: false },
      { name: 'Self-Declaration Affidavit', note: 'Notarized statement of income', required: true },
      { name: 'Land Records (for farmers)', note: 'To declare agricultural income', required: false },
    ],
    steps: [
      { step: '1', text: 'Visit nearest tehsildar/revenue office or apply online (e-District portal)' },
      { step: '2', text: 'Fill income declaration form with all income sources' },
      { step: '3', text: 'Submit documents including Aadhaar and income proof' },
      { step: '4', text: 'Verification by Revenue Inspector' },
      { step: '5', text: 'Certificate issued within 7–15 working days' },
    ],
    links: [
      { label: 'DigiLocker (Certificates)', url: 'https://www.digilocker.gov.in/' },
      { label: 'UMANG App', url: 'https://web.umang.gov.in/' },
    ],
  },
};

// ── Utilities ──────────────────────────────────────────────
function $(id) { return document.getElementById(id); }
function $$(sel) { return document.querySelectorAll(sel); }
function generateId() { return 'SB' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2,4).toUpperCase(); }
function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}
function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ── Notification System ────────────────────────────────────
function showNotification(message, type = 'info', duration = 4000) {
  const container = $('notification-container');
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const notif = document.createElement('div');
  notif.className = `notification ${type}`;
  notif.innerHTML = `<span class="notif-icon">${icons[type]}</span><span>${message}</span>`;
  container.appendChild(notif);
  setTimeout(() => {
    notif.style.animation = 'notifIn 0.3s var(--ease-out) reverse forwards';
    setTimeout(() => notif.remove(), 300);
  }, duration);
}

// ── i18n ───────────────────────────────────────────────────
function applyTranslations() {
  const t = TRANSLATIONS[STATE.lang] || TRANSLATIONS.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });
  document.querySelectorAll('[data-i18n-query]').forEach(el => {
    const key = el.getAttribute('data-i18n-query');
    if (t[key]) { el.textContent = t[key]; el.dataset.query = t[key]; }
  });
  document.documentElement.lang = STATE.lang;
}

// ── Navigation ─────────────────────────────────────────────
function navigateTo(sectionId) {
  $$('.page-section').forEach(s => s.classList.remove('active'));
  $$('.nav-item').forEach(b => { b.classList.remove('active'); b.removeAttribute('aria-current'); });
  const section = $(sectionId);
  const navBtn  = $(`nav-${sectionId}`);
  if (section) section.classList.add('active');
  if (navBtn)  { navBtn.classList.add('active'); navBtn.setAttribute('aria-current', 'page'); }
  STATE.currentSection = sectionId;
  if (sectionId === 'report') initMap();
  if (sectionId === 'tracker') renderTracker();
  if (sectionId === 'schemes') renderSchemes();
  if (sectionId === 'docs') renderDocChecklist(STATE.currentDocService);
}

// ── Theme & Accessibility ──────────────────────────────────
function setTheme(theme) {
  STATE.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('sb_theme', theme);
  $('theme-toggle').textContent = theme === 'dark' ? '☀️' : '🌙';
  $('theme-toggle').setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
}

function setContrast(on) {
  STATE.contrast = on ? 'high' : 'normal';
  document.documentElement.setAttribute('data-contrast', STATE.contrast);
  localStorage.setItem('sb_contrast', STATE.contrast);
  $('contrast-toggle').style.background = on ? 'var(--saffron)' : '';
}

function setFontScale(scale) {
  STATE.fontScale = Math.max(0.8, Math.min(1.5, scale));
  document.documentElement.style.setProperty('--font-scale', STATE.fontScale);
  localStorage.setItem('sb_font', STATE.fontScale);
}

// ── AI Chat Logic ──────────────────────────────────────────
function getAIResponse(query) {
  const q = query.toLowerCase();
  for (const [, data] of Object.entries(AI_RESPONSES)) {
    if (data.keywords && data.keywords.some(kw => q.includes(kw))) {
      return data.response;
    }
  }
  // Smart fallback – try to extract intent
  if (q.includes('report') || q.includes('complain') || q.includes('issue')) {
    return `I can help you **report a civic issue**! 🚧\n\nClick **"Report Issue"** in the left sidebar, or I can guide you:\n\n1. Select the issue type (Pothole, Garbage, Water, etc.)\n2. Add your location (GPS works best)\n3. Upload a photo as evidence\n4. Submit and get a tracking ID!\n\nYou can track your complaint status anytime in the **"Track Complaints"** section.`;
  }
  if (q.includes('scheme') || q.includes('yojana') || q.includes('योजना')) {
    return `I can help find the right government scheme for you! 📋\n\nVisit the **"Yojana Finder"** section and filter by:\n- Your category (Farmer, Student, Women, Senior Citizen)\n- Your state\n- Income group\n\nSome popular schemes:\n- **PM-KISAN** (Farmers: ₹6,000/year)\n- **Ayushman Bharat** (Health: ₹5 lakh/year)\n- **PMAY** (Housing subsidy)\n- **Mudra Yojana** (Business loans up to ₹10 lakh)\n\nWhich category are you looking for?`;
  }
  return AI_RESPONSES.default.response;
}

async function callGeminiAPI(query) {
  const key = STATE.geminiKey;
  if (!key) return null;
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are Seva Sathi, an AI civic companion for Indian citizens. 
            Answer this question about government services, schemes, or civic issues in a helpful, structured way.
            If the question is in Hindi or another Indian language, respond in the same language.
            Question: ${query}`
          }]
        }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
      })
    });
    const data = await res.json();
    if (data.candidates && data.candidates[0]) {
      return data.candidates[0].content.parts[0].text;
    }
    return null;
  } catch (e) {
    console.warn('Gemini API error:', e);
    return null;
  }
}

function renderMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
}

function addMessage(role, text, animate = true) {
  const container = $('chat-messages');
  const isBot = role === 'bot';
  const time = formatTime(Date.now());
  const div = document.createElement('div');
  div.className = `chat-msg ${role}`;
  div.innerHTML = `
    <div class="msg-avatar ${isBot ? 'bot-av' : 'user-av'}">${isBot ? '🤖' : '👤'}</div>
    <div>
      <div class="msg-bubble">${isBot ? renderMarkdown(text) : text.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</div>
      <span class="msg-time">${time}</span>
    </div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  if (STATE.ttsEnabled && isBot) speakText(text.replace(/\*\*/g,'').replace(/\*/g,'').substring(0,250));
  return div;
}

function showTyping() {
  const container = $('chat-messages');
  const div = document.createElement('div');
  div.className = 'chat-msg bot';
  div.id = 'typing-indicator';
  div.innerHTML = `<div class="msg-avatar bot-av">🤖</div><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}
function hideTyping() { const el = $('typing-indicator'); if (el) el.remove(); }

async function sendMessage(query) {
  if (!query.trim()) return;
  addMessage('user', query);
  $('chat-input').value = '';
  $('chat-input').style.height = '42px';
  showTyping();
  // Try Gemini API first
  const delay = 800 + Math.random() * 700;
  await new Promise(r => setTimeout(r, delay));
  let response;
  if (STATE.geminiKey) {
    response = await callGeminiAPI(query);
  }
  if (!response) response = getAIResponse(query);
  hideTyping();
  addMessage('bot', response);
}

function speakText(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = STATE.lang === 'hi' ? 'hi-IN' : STATE.lang === 'ta' ? 'ta-IN' : 'en-IN';
  utt.rate = 0.9;
  window.speechSynthesis.speak(utt);
}

function initVoiceInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) { showNotification('Voice input not supported in this browser. Try Chrome.', 'warning'); return; }
  const rec = new SpeechRecognition();
  rec.continuous = false;
  rec.interimResults = true;
  rec.lang = STATE.lang === 'hi' ? 'hi-IN' : STATE.lang === 'ta' ? 'ta-IN' : 'en-IN';
  rec.onresult = (e) => {
    const transcript = Array.from(e.results).map(r => r[0].transcript).join('');
    $('chat-input').value = transcript;
    $('chat-input').style.height = 'auto';
    $('chat-input').style.height = $('chat-input').scrollHeight + 'px';
  };
  rec.onend = () => {
    STATE.isRecording = false;
    $('voice-btn').classList.remove('recording');
    const val = $('chat-input').value.trim();
    if (val) sendMessage(val);
  };
  rec.onerror = () => { STATE.isRecording = false; $('voice-btn').classList.remove('recording'); showNotification('Voice recognition failed. Please try again.', 'error'); };
  STATE.recognition = rec;
}

// ── Map ────────────────────────────────────────────────────
function initMap() {
  if (STATE.mapInstance) return;
  const defaultLat = 20.5937, defaultLng = 78.9629;
  STATE.mapInstance = L.map('issue-map', { zoomControl: true }).setView([defaultLat, defaultLng], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(STATE.mapInstance);
  STATE.mapInstance.on('click', (e) => {
    const { lat, lng } = e.latlng;
    STATE.issueCoords = { lat, lng };
    if (STATE.mapMarker) STATE.mapMarker.remove();
    STATE.mapMarker = L.marker([lat, lng]).addTo(STATE.mapInstance).bindPopup('📍 Issue Location').openPopup();
    $('issue-location').value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  });
}

function getGPSLocation() {
  if (!navigator.geolocation) { showNotification('Geolocation not supported by your browser.', 'error'); return; }
  showNotification('Getting your GPS location...', 'info', 2500);
  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude: lat, longitude: lng } = pos.coords;
      STATE.issueCoords = { lat, lng };
      if (STATE.mapInstance) {
        STATE.mapInstance.setView([lat, lng], 15);
        if (STATE.mapMarker) STATE.mapMarker.remove();
        STATE.mapMarker = L.marker([lat, lng]).addTo(STATE.mapInstance).bindPopup('📍 Your Location').openPopup();
      }
      $('issue-location').value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      showNotification('GPS location captured!', 'success');
    },
    err => { showNotification('Could not get location. Please enter address manually.', 'warning'); }
  );
}

// ── AI Image Analysis Simulator ────────────────────────────
const AI_ISSUE_ANALYSIS = {
  image: [
    { type: 'Pothole', severity: 'HIGH', desc: 'Deep road cavity detected (~30cm). Requires immediate patching.', category: 'pothole' },
    { type: 'Garbage Dump', severity: 'MEDIUM', desc: 'Unauthorized waste dump detected. Requires municipal clearance.', category: 'garbage' },
    { type: 'Waterlogging', severity: 'HIGH', desc: 'Stagnant water detected. Possible drainage blockage.', category: 'water' },
    { type: 'Broken Streetlight', severity: 'MEDIUM', desc: 'Non-functional streetlight identified. Safety hazard at night.', category: 'electric' },
    { type: 'Road Crack', severity: 'LOW', desc: 'Surface crack detected. Should be sealed before monsoon.', category: 'pothole' },
  ],
};

function simulateAIAnalysis() {
  const analysis = AI_ISSUE_ANALYSIS.image[Math.floor(Math.random() * AI_ISSUE_ANALYSIS.image.length)];
  const box = $('ai-analysis-box');
  $('ai-analysis-text').innerHTML = `
    <strong style="color:${analysis.severity === 'HIGH' ? 'var(--danger)' : analysis.severity === 'MEDIUM' ? 'var(--warning)' : 'var(--success)'}">[${analysis.severity} SEVERITY]</strong>
    Issue Type: <strong>${analysis.type}</strong><br/>
    ${analysis.desc}<br/>
    <em style="font-size:0.75rem;color:var(--text-muted)">AI Confidence: ${(85 + Math.random() * 14).toFixed(1)}%</em>
  `;
  box.classList.add('visible');
  const typeSelect = $('issue-type');
  if (typeSelect.value === '') typeSelect.value = analysis.category;
}

// ── Issue Reporter ─────────────────────────────────────────
function submitIssue() {
  const type  = $('issue-type').value;
  const title = $('issue-title').value.trim();
  const desc  = $('issue-desc').value.trim();
  const loc   = $('issue-location').value.trim();
  const name  = $('reporter-name').value.trim();
  const phone = $('reporter-phone').value.trim();

  if (!type)  { showNotification('Please select issue type.', 'warning'); return; }
  if (!title) { showNotification('Please provide an issue title.', 'warning'); return; }
  if (!loc)   { showNotification('Please provide a location.', 'warning'); return; }

  const issue = {
    id: generateId(),
    type, title, desc, loc, name, phone,
    coords: STATE.issueCoords,
    timestamp: Date.now(),
    status: 'submitted',
    timeline: [
      { label: 'Issue Submitted', status: 'done', time: Date.now() },
      { label: 'Under Review', status: 'active', time: null },
      { label: 'Assigned to Department', status: 'pending', time: null },
      { label: 'Work in Progress', status: 'pending', time: null },
      { label: 'Resolved', status: 'pending', time: null },
    ]
  };

  STATE.issues.push(issue);
  localStorage.setItem('sb_issues', JSON.stringify(STATE.issues));

  // Reset form
  ['issue-type','issue-title','issue-desc','issue-location','reporter-name','reporter-phone'].forEach(id => $(id).value = '');
  $('ai-analysis-box').classList.remove('visible');
  if (STATE.mapMarker) { STATE.mapMarker.remove(); STATE.mapMarker = null; }
  STATE.issueCoords = null;

  showNotification(`✅ Issue reported! Tracking ID: ${issue.id}`, 'success', 6000);
  navigateTo('tracker');
  updateIssueCount();
}

// ── Issue Tracker ──────────────────────────────────────────
function renderTracker(filter = '') {
  const grid = $('tracker-grid');
  let issues = [...STATE.issues].reverse();
  if (filter) issues = issues.filter(i => i.id.toLowerCase().includes(filter.toLowerCase()) || i.loc.toLowerCase().includes(filter.toLowerCase()) || i.title.toLowerCase().includes(filter.toLowerCase()));

  if (!issues.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">📭</div><p>${filter ? 'No issues found matching your search.' : 'No issues reported yet. Use "Report Issue" to submit your first complaint!'}</p></div>`;
    return;
  }

  grid.innerHTML = issues.map(issue => {
    const badgeClass = `badge-${issue.type || 'other'}`;
    const typeLabel  = { pothole: '🚧 Pothole', garbage: '🗑️ Garbage', water: '💧 Water', electric: '⚡ Electricity', sewer: '🚿 Sewer', encroach: '🏗️ Encroachment', other: '📌 Other' }[issue.type] || '📌 Other';
    const stepsHTML = issue.timeline.map(s => `
      <div class="timeline-step ${s.status}">
        <div class="timeline-dot"></div>
        <span class="timeline-text">${s.label}${s.status === 'done' ? ` · ${formatTime(s.time)}` : ''}</span>
      </div>`).join('');
    return `
      <div class="issue-card">
        <div class="issue-card-top">
          <span class="issue-type-badge ${badgeClass}">${typeLabel}</span>
          <span class="issue-track-id">#${issue.id}</span>
        </div>
        <div class="issue-card-body">
          <p style="font-size:0.9rem;font-weight:700;margin-bottom:4px;">${issue.title}</p>
          <div class="issue-location">📍 ${issue.loc}</div>
          <p style="font-size:0.72rem;color:var(--text-muted);margin-bottom:10px;">Reported: ${formatDate(issue.timestamp)}</p>
          <div class="status-timeline">${stepsHTML}</div>
        </div>
      </div>`;
  }).join('');
}

function updateIssueCount() {
  const el = $('stat-issues');
  if (el) el.textContent = STATE.issues.length;
}

// ── Scheme Finder ──────────────────────────────────────────
function renderSchemes(filter = {}) {
  const container = $('schemes-results');
  let schemes = SCHEMES_DATA;
  if (filter.category && filter.category !== 'all') schemes = schemes.filter(s => s.category === filter.category || s.category === 'all');
  if (filter.income && filter.income !== 'all') schemes = schemes.filter(s => !s.income || s.income.includes(filter.income) || s.income.includes('all'));

  if (!schemes.length) {
    container.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">🔍</div><p>No schemes match your filters. Try broadening your selection.</p></div>`;
    return;
  }

  container.innerHTML = schemes.map(s => `
    <div class="scheme-card">
      <div class="scheme-card-header">
        <div class="scheme-icon">${s.icon}</div>
        <div>
          <div class="scheme-name">${s.name}</div>
          <a href="https://${s.url}" target="_blank" rel="noopener" style="font-size:0.72rem;color:var(--indigo);">${s.url}</a>
        </div>
      </div>
      <div class="scheme-card-body">
        <p class="scheme-desc">${s.desc}</p>
        <div class="scheme-tags">${s.tags.map(t => `<span class="scheme-tag">${t}</span>`).join('')}</div>
        <div class="scheme-benefit">💰 ${s.benefit}</div>
        <div class="scheme-card-footer" style="padding:0;border:none;margin-top:auto;">
          <button class="btn btn-outline btn-sm" onclick="askSevaSathi('Tell me about ${s.name} scheme')">🤖 Ask Seva Sathi</button>
          <a href="https://${s.url}" target="_blank" rel="noopener" class="btn btn-green btn-sm">🔗 Apply Now</a>
        </div>
      </div>
    </div>`).join('');
}

function askSevaSathi(query) {
  navigateTo('chat');
  setTimeout(() => sendMessage(query), 400);
}

// ── Document Checklist ─────────────────────────────────────
function renderDocChecklist(service) {
  STATE.currentDocService = service;
  const data = DOC_DATA[service];
  if (!data) return;
  const checked = STATE.checkedDocs[service] || [];
  $('doc-service-label').textContent = `${data.label} – Checklist`;

  // Tabs
  $$('.doc-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.service === service);
    tab.setAttribute('aria-selected', tab.dataset.service === service ? 'true' : 'false');
  });

  // Checklist
  const checklist = $('doc-checklist');
  checklist.innerHTML = data.docs.map((doc, i) => {
    const isChecked = checked.includes(i);
    return `
      <div class="doc-item${isChecked ? ' checked' : ''}" role="listitem" data-doc-index="${i}" tabindex="0" aria-label="${doc.name}${isChecked ? ' (collected)' : ''}">
        <div class="doc-checkbox">${isChecked ? '✓' : ''}</div>
        <div class="doc-item-info">
          <div class="doc-name">${doc.name}</div>
          <div class="doc-note">${doc.note}</div>
        </div>
        <span class="doc-status ${doc.required ? 'required' : 'optional'}">${doc.required ? 'Required' : 'Optional'}</span>
      </div>`;
  }).join('');

  // Progress
  const total = data.docs.length;
  const pct   = Math.round((checked.length / total) * 100);
  $('checklist-bar').style.width = pct + '%';
  $('checklist-progress-text').textContent = `${checked.length} of ${total} documents collected (${pct}%)`;

  // Doc item click
  $$('.doc-item').forEach(item => {
    const handler = () => {
      const idx = parseInt(item.dataset.docIndex);
      const checked = STATE.checkedDocs[service] || [];
      const pos = checked.indexOf(idx);
      if (pos === -1) checked.push(idx); else checked.splice(pos, 1);
      STATE.checkedDocs[service] = checked;
      localStorage.setItem('sb_docs', JSON.stringify(STATE.checkedDocs));
      renderDocChecklist(service);
    };
    item.addEventListener('click', handler);
    item.addEventListener('keypress', e => { if (e.key === 'Enter' || e.key === ' ') handler(); });
  });

  // Steps
  $('process-steps').innerHTML = data.steps.map(s => `
    <div style="display:flex;gap:10px;align-items:flex-start;">
      <div style="width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,var(--indigo),var(--saffron));color:white;font-size:0.72rem;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${s.step}</div>
      <p style="font-size:0.85rem;color:var(--text-secondary);line-height:1.6;padding-top:2px;">${s.text}</p>
    </div>`).join('');

  // Links
  $('service-links').innerHTML = data.links.map(l => `<a href="${l.url}" target="_blank" rel="noopener" class="btn btn-sm btn-outline" style="width:fit-content;">🔗 ${l.label}</a>`).join('');
}

// ── INIT ───────────────────────────────────────────────────
function init() {
  // Apply saved preferences
  setTheme(STATE.theme);
  setContrast(STATE.contrast === 'high');
  setFontScale(STATE.fontScale);
  applyTranslations();
  updateIssueCount();

  // Show welcome message
  addMessage('bot', (TRANSLATIONS[STATE.lang] || TRANSLATIONS.en).welcome_msg, false);

  // Render initial sections
  renderSchemes();
  renderDocChecklist('aadhaar');
  renderTracker();

  // Restore API key UI
  if (STATE.geminiKey) {
    $('gemini-api-key').value = '••••••••••••••••';
    $('api-key-status').textContent = '✅ Key saved';
    $('api-key-status').style.color = 'var(--success)';
  }

  // Navigation
  $$('.nav-item[data-section]').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.section));
  });

  // Hero buttons
  $('hero-chat-btn').addEventListener('click',    () => navigateTo('chat'));
  $('hero-schemes-btn').addEventListener('click', () => navigateTo('schemes'));
  $('hero-report-btn').addEventListener('click',  () => navigateTo('report'));
  $('floating-chat-btn').addEventListener('click',() => navigateTo('chat'));

  // Quick actions
  $$('.quick-action-btn[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => {
      navigateTo(btn.dataset.nav);
      if (btn.dataset.query) setTimeout(() => sendMessage(btn.dataset.query), 400);
    });
  });

  // Theme / Contrast / Font
  $('theme-toggle').addEventListener('click', () => setTheme(STATE.theme === 'dark' ? 'light' : 'dark'));
  $('contrast-toggle').addEventListener('click', () => setContrast(STATE.contrast !== 'high'));
  $('font-up').addEventListener('click',    () => setFontScale(STATE.fontScale + 0.1));
  $('font-down').addEventListener('click',  () => setFontScale(STATE.fontScale - 0.1));
  $('font-reset').addEventListener('click', () => setFontScale(1));

  // Language
  $('lang-select').value = STATE.lang;
  $('lang-select').addEventListener('change', () => {
    STATE.lang = $('lang-select').value;
    localStorage.setItem('sb_lang', STATE.lang);
    applyTranslations();
    $('chat-messages').innerHTML = '';
    addMessage('bot', (TRANSLATIONS[STATE.lang] || TRANSLATIONS.en).welcome_msg);
  });

  // Chat
  $('chat-send').addEventListener('click', () => sendMessage($('chat-input').value));
  $('chat-input').addEventListener('keydown', e => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) sendMessage($('chat-input').value);
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) { e.preventDefault(); sendMessage($('chat-input').value); }
  });
  $('chat-input').addEventListener('input', function() {
    this.style.height = '42px';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
  });

  $$('.suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => sendMessage(chip.textContent));
  });

  $('clear-chat').addEventListener('click', () => {
    $('chat-messages').innerHTML = '';
    addMessage('bot', (TRANSLATIONS[STATE.lang] || TRANSLATIONS.en).welcome_msg);
    showNotification('Chat cleared.', 'info');
  });

  $('tts-toggle').addEventListener('click', () => {
    STATE.ttsEnabled = !STATE.ttsEnabled;
    $('tts-toggle').style.background = STATE.ttsEnabled ? 'var(--saffron)' : '';
    showNotification(STATE.ttsEnabled ? '🔊 Text-to-speech ON' : '🔇 Text-to-speech OFF', 'info', 2000);
  });

  $('voice-btn').addEventListener('click', () => {
    if (!STATE.recognition) initVoiceInput();
    if (!STATE.recognition) return;
    if (STATE.isRecording) {
      STATE.recognition.stop();
      STATE.isRecording = false;
      $('voice-btn').classList.remove('recording');
    } else {
      STATE.recognition.start();
      STATE.isRecording = true;
      $('voice-btn').classList.add('recording');
    }
  });

  // Gemini API Key
  $('save-api-key').addEventListener('click', () => {
    const key = $('gemini-api-key').value.trim();
    if (key && key.startsWith('AIza')) {
      STATE.geminiKey = key;
      localStorage.setItem('sb_gemini_key', key);
      $('api-key-status').textContent = '✅ Key saved – Live AI active!';
      $('api-key-status').style.color = 'var(--success)';
      showNotification('Gemini API key saved! Live AI responses enabled.', 'success');
    } else if (key === '') {
      STATE.geminiKey = '';
      localStorage.removeItem('sb_gemini_key');
      $('api-key-status').textContent = '🗑️ Key removed';
      $('api-key-status').style.color = 'var(--text-muted)';
    } else {
      showNotification('Invalid API key. Must start with "AIza".', 'error');
    }
  });

  // Report issue
  $('get-location-btn').addEventListener('click', getGPSLocation);
  $('submit-issue-btn').addEventListener('click', submitIssue);

  // File upload
  const zone = $('file-upload-zone');
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => { e.preventDefault(); zone.classList.remove('drag-over'); if (e.dataTransfer.files.length) simulateAIAnalysis(); });
  $('issue-file').addEventListener('change', () => { if ($('issue-file').files.length) { showNotification('📷 Photo uploaded! AI is analysing...', 'info', 2000); setTimeout(simulateAIAnalysis, 1800); } });

  // Scheme finder
  $('find-schemes-btn').addEventListener('click', () => {
    renderSchemes({
      category: $('filter-category').value,
      income:   $('filter-income').value,
    });
  });

  // Tracker search
  $('track-search-btn').addEventListener('click', () => renderTracker($('track-search').value));
  $('track-search').addEventListener('keypress', e => { if (e.key === 'Enter') renderTracker($('track-search').value); });
  $('clear-issues-btn').addEventListener('click', () => {
    if (confirm('Clear all reported issues? This cannot be undone.')) {
      STATE.issues = [];
      localStorage.setItem('sb_issues', '[]');
      renderTracker();
      updateIssueCount();
      showNotification('All issues cleared.', 'info');
    }
  });

  // Doc tabs
  $$('.doc-tab').forEach(tab => {
    tab.addEventListener('click', () => renderDocChecklist(tab.dataset.service));
  });
  $('ask-bot-docs').addEventListener('click', () => {
    const label = DOC_DATA[STATE.currentDocService]?.label || STATE.currentDocService;
    askSevaSathi(`What documents do I need for ${label}?`);
  });

  // Sidebar toggle (mobile)
  $('sidebar-toggle').addEventListener('click', () => {
    $('sidebar').classList.toggle('open');
  });

  // Global search
  $('global-search').addEventListener('keypress', e => {
    if (e.key === 'Enter' && $('global-search').value.trim()) {
      navigateTo('chat');
      setTimeout(() => sendMessage($('global-search').value.trim()), 400);
      $('global-search').value = '';
    }
  });

  // Simulate live stats counter
  let issueCount = 1247;
  setInterval(() => {
    issueCount++;
    $('stat-citizens').textContent = (2.3 + Math.random() * 0.01).toFixed(1) + 'L';
  }, 8000);

  console.log('%c🇮🇳 Smart Bharat – AI Civic Companion', 'color:#FF671F;font-size:16px;font-weight:bold;');
  console.log('%cBuilt for DEVENGERS PromptWars 2026', 'color:#046A38;font-size:12px;');
}

// Boot
document.addEventListener('DOMContentLoaded', init);
