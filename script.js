/* =========================================================================
   HelloCustomer — Landing Page Script
   ========================================================================= */

/* ---- Photo fallback handling (avatar + about profile photo) ---- */
document.querySelectorAll('[data-photo-fallback]').forEach(img=>{
  img.addEventListener('error', function(){
    this.closest('[data-photo-frame]').classList.add('no-photo');
  });
});

/* ---- Porting reasons (30 + Other) ---- */
const portingReasons = [
  "High premium at renewal","Poor claim settlement experience","Inadequate sum insured",
  "Room rent capping issues","Co-payment clause too high","Sub-limits on treatments",
  "Lack of cashless hospitals nearby","Poor customer service","Slow claim processing",
  "Waiting period too long for existing conditions","No maternity benefit","No critical illness cover",
  "Restrictive network hospitals","No restore / refill benefit","High deductible",
  "Daycare procedures not covered","No pre/post hospitalisation cover","No wellness / OPD benefits",
  "Want a better claim settlement ratio insurer","Want family floater instead of individual",
  "Want higher sum insured","Want add-on riders not currently available","Insurer discontinued or merged",
  "Want a digital-first insurer with app support","No no-claim bonus benefit",
  "Want lower premium for same cover","Not satisfied with insurer's rating/reputation",
  "Want to add more members","Existing policy has exclusions I want removed",
  "Relocated to a new city, want better local network"
];
const portReasonSelect = document.getElementById('portReason');
portReasonSelect.appendChild(new Option('Select a reason',''));
portingReasons.forEach(r=> portReasonSelect.appendChild(new Option(r,r)));
portReasonSelect.appendChild(new Option('Other','Other'));
portReasonSelect.addEventListener('change', ()=>{
  document.getElementById('portReasonOtherField').classList.toggle('hidden', portReasonSelect.value !== 'Other');
});

/* ---- FAQ accordion (delegated) ---- */
document.addEventListener('click', (e)=>{
  const q = e.target.closest('.faq-q');
  if(q) q.parentElement.classList.toggle('open');
});

/* ---- Generic tab wiring ---- */
function wireTabs(tabsId, panelsContainerId){
  document.querySelectorAll('#'+tabsId+' .tab-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('#'+tabsId+' .tab-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('#'+panelsContainerId+' .tab-panel').forEach(p=>p.classList.toggle('active', p.dataset.panel === btn.dataset.tab));
    });
  });
}

/* ---- 30+ Benefits per category ---- */
const benefitsData = {
  health: { intro:"How health insurance works day to day: your premium keeps a sum insured active; when hospitalisation happens, the insurer settles the bill directly with the hospital (cashless) or reimburses you, subject to the plan's terms.",
    items:["Cashless hospitalisation at network hospitals","Pre-hospitalisation expenses (30–60 days)","Post-hospitalisation expenses (60–90 days)",
    "No-claim bonus increases sum insured yearly","Free annual health checkup","Daycare procedures covered","Ambulance charges covered",
    "Room rent as per plan terms","Restore benefit refills sum insured after a claim","Multiplier / cumulative bonus benefit",
    "Maternity &amp; newborn cover (select plans)","AYUSH treatment cover","Organ donor expenses cover","Domiciliary (home) treatment cover",
    "Mental illness treatment cover","Tax benefit under Section 80D","Family floater — one policy, whole family","Lifetime renewability",
    "Portability across insurers without losing benefits","Wellness rewards for healthy habits","Second opinion for critical illness",
    "Air ambulance cover (premium plans)","Consumables cover in select plans","Modern treatment methods covered",
    "Pre-existing disease cover after waiting period","Critical illness lump sum payout option","Reduced waiting period on porting",
    "Free look period to review the policy","Cumulative bonus even without a claim","Health checkup discount vouchers",
    "Cover for AYUSH &amp; alternative treatments","No sub-limits in top-tier plans","Group/corporate cover options for employers",
    "Newborn baby cover from day one (select plans)","Home nursing cover after discharge","Vaccination cover for children (select plans)"] },
  term: { intro:"How term insurance works: you pay a small premium for a large life cover; if something happens to you during the policy term, your family receives the full sum assured — usually within days of a clean claim.",
    items:["High life cover at low premium","Lump sum payout to nominee","Tax benefit under Section 80C","Tax-free payout under Section 10(10D)",
    "Accidental death benefit rider","Critical illness rider","Waiver of premium on disability","Return of premium option",
    "Increasing cover option (keeps pace with inflation)","Level cover option (fixed sum assured)","Flexible payout — lump sum, income, or combination",
    "Cover till age 99/100 in select plans","Simplified issuance for lower sum assured","Terminal illness benefit","Accidental permanent disability rider",
    "Spouse cover under linked policy","Child education / marriage protection rider","Loan / EMI protection cover",
    "Flexible premium payment (monthly/yearly/single)","Convertible to a permanent life plan","Cover continues even if income reduces",
    "Grace period for a missed premium","Free look period","Guaranteed insurability at life events","Cover for self-employed &amp; business owners",
    "Key-man insurance for business protection","Tax-free maturity on ROP plans","Hospitalisation cash benefit rider",
    "Quick, tax-free payout to nominee","Cover portable if you switch jobs","Protects outstanding home / personal loans",
    "No lapse if auto-debit is maintained","Cover available up to ₹50 Crore for high-income earners","Joint life cover for you and your partner",
    "Occupation-based customisation for field &amp; travel-heavy roles"] },
  accident: { intro:"How personal accident cover works: it pays out specifically for accidents — death, disability, or injury — regardless of whether you also hold health or term insurance, and usually with minimal paperwork.",
    items:["Accidental death benefit","Permanent total disability cover","Permanent partial disability cover","Temporary total disability — weekly benefit",
    "Medical expense reimbursement for accidents","Ambulance charges cover","Hospital daily cash benefit","Children's education fund on death/disability",
    "Fracture / broken bone cover","Burns cover","Adventure sports cover (optional)","Worldwide, 24x7 cover","Coverage on and off the job",
    "Low premium, high sum insured","Usually no medical test required","Family cover option","Repatriation of remains cover","Funeral expense benefit",
    "Cover for loss of limbs or eyesight","Cover for accident-induced coma","Home/vehicle modification cover post-disability",
    "Transportation of mortal remains","Spouse / child education rider","Cover for accidental hospitalisation","No waiting period for accident claims",
    "Renewal discount for claim-free years","Complements health &amp; term insurance","Affordable for daily-wage &amp; self-employed earners",
    "Covers domestic accidents too, not just travel/work","Family group discounts available","Fast claim settlement with simple documentation"] },
  general: { intro:"Insurance, at its core, is a risk-pooling tool — many people contribute a small premium so that the few who face a loss are protected. Here's why that principle matters across every policy you hold.",
    items:["Financial protection against uncertainty","Peace of mind for you and your family","Transfers risk from individual to insurer",
    "Encourages a disciplined savings habit","Tax benefits under the Income Tax Act","Protects against inflation in medical/emergency costs",
    "Safeguards your family's standard of living","Prevents debt during emergencies","Builds long-term financial security",
    "Access to cashless treatment networks","Documentation &amp; claims support","Can support loan approvals","Covers unforeseen liabilities",
    "Reduces financial burden on family members","Enables better financial planning","Protects business continuity for the self-employed",
    "Covers legal costs in liability cases","Protects children's education plans","Shields retirement savings from medical shocks",
    "Risk pooling reduces individual cost burden","Access to expert advisory &amp; claim assistance","Portability &amp; flexibility across providers",
    "Customisable coverage for every life stage","Rider options to enhance base cover","Group discounts through employer or association",
    "Supports estate &amp; wealth-transfer planning","Protection against third-party liability","Encourages preventive healthcare habits",
    "Reduces stress during emergencies","Some plans support long-term wealth creation","A trusted safety net across every life stage"] }
};
const benefitPanels = document.getElementById('benefitPanels');
Object.keys(benefitsData).forEach((key, i)=>{
  const d = benefitsData[key];
  const panel = document.createElement('div');
  panel.className = 'tab-panel' + (i===0 ? ' active' : '');
  panel.dataset.panel = key;
  panel.innerHTML = `<div class="benefit-intro">${d.intro}</div><div class="benefit-grid">${d.items.map(t=>`<div class="benefit-item"><span class="tick">✓</span><span>${t}</span></div>`).join('')}</div>`;
  benefitPanels.appendChild(panel);
});
wireTabs('benefitTabs','benefitPanels');

/* ---- Categorised FAQs ---- */
const faqData = {
  general: [["What is insurance and why do I need it?","Insurance is a contract where you pay a premium and the insurer pays out for specified losses — it protects your family and savings from sudden, large expenses."],
    ["How is my premium calculated?","Premiums depend on your age, sum insured, health/lifestyle factors, and the plan's features — an advisor can show you exact quotes across insurers."],
    ["What is a waiting period?","A waiting period is the time after buying a policy before certain conditions or benefits become claimable — it varies by insurer and plan."],
    ["What happens if I miss a premium payment?","Most policies offer a grace period; missing it beyond that can lapse your cover, so timely renewal reminders matter."],
    ["Can I cover my entire family under one policy?","Yes, family floater plans cover multiple members under a single sum insured, usually at a lower combined premium."],
    ["What documents are required to buy a policy?","Typically ID proof, address proof, age proof, and sometimes income proof or medical reports depending on the plan."],
    ["Is a medical test mandatory before buying insurance?","Not always — it depends on your age, sum insured, and the specific plan; many plans have simplified or no-test issuance."],
    ["Can I claim tax benefits on my premium?","Yes, health and term insurance premiums are generally eligible for deductions under the Income Tax Act, subject to applicable limits."],
    ["What is a free-look period?","A window (usually 15–30 days) after buying a policy where you can review and cancel it for a refund if it doesn't suit you."],
    ["How do I file a claim?","You or your advisor notify the insurer, submit the required documents, and the insurer processes cashless or reimbursement claims accordingly."]],
  health: [["What's the difference between a family floater and an individual plan?","A floater shares one sum insured across the family; an individual plan gives each member a dedicated sum insured."],
    ["Are pre-existing diseases covered?","Yes, after a defined waiting period specified in the policy — typically a few years, varying by insurer and condition."],
    ["What is a co-payment clause?","A percentage of the claim amount you pay out of pocket, with the insurer covering the rest — common in senior citizen plans."],
    ["What's the difference between corporate and individual health cover?","Corporate cover ends when you leave your job and is fixed by your employer; an individual policy stays with you for life and is fully in your control."],
    ["What is cashless treatment?","The insurer settles the bill directly with a network hospital, so you don't pay upfront and later claim reimbursement."],
    ["What is a room rent sub-limit?","A cap on the daily room rent the insurer will pay for; exceeding it can proportionately reduce other claim amounts too."],
    ["Can I switch my health insurer without losing benefits?","Yes, this is called porting — it lets you move insurers while carrying forward waiting period credits, subject to conditions."],
    ["Does health insurance cover maternity?","Only plans with a specific maternity benefit or rider cover it, usually after a waiting period — ask about maternity-specific plans."]],
  term: [["How much term cover do I need?","A common guideline is 10–15 times your annual income, adjusted for loans, dependents, and future goals."],
    ["What happens if I outlive my term policy?","With a standard term plan, there's no maturity payout unless you chose a return-of-premium variant."],
    ["Can I increase my cover later?","Some plans allow increasing cover at life events like marriage or childbirth without fresh medical tests."],
    ["What is claim settlement ratio and why does it matter?","It's the percentage of claims an insurer has successfully paid out — a useful, though not sole, indicator of reliability."],
    ["Is term insurance the same as life insurance?","Term insurance is a type of life insurance focused purely on protection, without an investment or savings component."],
    ["Can self-employed individuals buy term insurance?","Yes, with income proof and other documentation, self-employed individuals can buy term cover just like salaried employees."],
    ["Can I get up to ₹50 Crore of term cover?","Yes, high sum assured plans are available for eligible high-income earners, subject to income proof and underwriting."],
    ["Does smoking affect my term insurance premium?","Yes — smokers are typically classified separately and pay a higher premium; being upfront about it avoids claim issues later."]],
  accident: [["Does personal accident insurance cover illness?","No, it specifically covers accidental injury, disability, or death — illness is covered under health insurance instead."],
    ["Is a medical test required for personal accident cover?","Usually not, which makes it quick to issue compared to health or term insurance."],
    ["Does it cover accidents at home?","Yes, most personal accident plans cover accidents anywhere — at home, at work, or while travelling."],
    ["How is it different from health insurance?","Health insurance covers medical treatment costs broadly; personal accident cover pays a defined benefit specifically for accidental injury or death."],
    ["Can I buy personal accident cover alongside health and term insurance?","Yes — it's commonly used as an affordable add-on layer alongside your existing health and term policies."]]
};
const faqPanels = document.getElementById('faqPanels');
Object.keys(faqData).forEach((key, i)=>{
  const panel = document.createElement('div');
  panel.className = 'tab-panel' + (i===0 ? ' active' : '');
  panel.dataset.panel = key;
  const list = document.createElement('div'); list.className = 'faq-list';
  list.innerHTML = faqData[key].map(([q,a])=>`<div class="faq-item"><button class="faq-q">${q} <span class="plus">+</span></button><div class="faq-a">${a}</div></div>`).join('');
  panel.appendChild(list);
  faqPanels.appendChild(panel);
});
wireTabs('faqTabs','faqPanels');

/* ---- Regional testimonials (Health 40+, Term 20+, PA 5+) ---- */
const names = ["Ramesh","Suresh","Venkatesh","Srinivas","Krishna","Ravi","Naveen","Prasad","Mahesh","Kiran",
  "Ganesh","Rajesh","Satish","Ramana","Vijay","Anil","Sandeep","Praveen","Ashok","Nagesh",
  "Lakshmi","Priya","Padma","Anitha","Sowjanya","Divya","Swathi","Kavya","Sandhya","Bhavani",
  "Sireesha","Pallavi","Madhavi","Haritha","Nagalakshmi","Vani","Deepika","Manasa","Spandana","Jyothi"];
const regions = [
  {c:"Hyderabad",s:"Telangana"},{c:"Secunderabad",s:"Telangana"},{c:"AS Rao Nagar",s:"Telangana"},{c:"ECIL",s:"Telangana"},
  {c:"Kapra",s:"Telangana"},{c:"Uppal",s:"Telangana"},{c:"Kukatpally",s:"Telangana"},{c:"LB Nagar",s:"Telangana"},
  {c:"Miyapur",s:"Telangana"},{c:"Dilsukhnagar",s:"Telangana"},{c:"Malkajgiri",s:"Telangana"},{c:"Medchal",s:"Telangana"},
  {c:"Warangal",s:"Telangana"},{c:"Karimnagar",s:"Telangana"},{c:"Nizamabad",s:"Telangana"},{c:"Khammam",s:"Telangana"},
  {c:"Nalgonda",s:"Telangana"},{c:"Mahbubnagar",s:"Telangana"},
  {c:"Vijayawada",s:"Andhra Pradesh"},{c:"Visakhapatnam",s:"Andhra Pradesh"},{c:"Guntur",s:"Andhra Pradesh"},
  {c:"Nellore",s:"Andhra Pradesh"},{c:"Kurnool",s:"Andhra Pradesh"},{c:"Rajahmundry",s:"Andhra Pradesh"},
  {c:"Kakinada",s:"Andhra Pradesh"},{c:"Tirupati",s:"Andhra Pradesh"},{c:"Kadapa",s:"Andhra Pradesh"},
  {c:"Anantapur",s:"Andhra Pradesh"},{c:"Chittoor",s:"Andhra Pradesh"},{c:"Eluru",s:"Andhra Pradesh"},
  {c:"Ongole",s:"Andhra Pradesh"},{c:"Srikakulam",s:"Andhra Pradesh"},{c:"Vizianagaram",s:"Andhra Pradesh"}
];
const templates = {
  health: ["Got cashless treatment within hours when I needed it most.","Helped us choose the right family floater plan for my parents' age group.",
    "Ported our policy without losing any waiting-period benefits.","The claim support after my surgery was hands-on from start to finish.",
    "Explained room rent limits clearly before we signed — saved us a surprise later.","Got a critical illness rider added that turned out to matter a lot.",
    "The annual policy review caught a gap in our cover before it became a problem.","Maternity benefit was explained in detail — exactly what our family needed.",
    "No pressure, just clear comparisons across insurers before we decided.","Helped my senior citizen parents get covered despite existing health conditions.",
    "The whole documentation process was handled for us end to end.","Follow-up support at claim time made a stressful situation much easier.",
    "Set up a proper group health plan for our small business team."],
  term: ["Helped me size my cover correctly against my home loan and my children's future.","Explained claim settlement ratio clearly before recommending an insurer.",
    "Added a critical illness rider that gives extra peace of mind.","The whole process, from proposal to policy issue, was smooth and quick.",
    "Helped me compare level cover vs increasing cover for my situation.","As a self-employed professional, I finally got clarity on how much cover I need.",
    "Explained the tax benefits clearly along with the protection angle.","Helped my spouse and me set up cover for both of us efficiently.",
    "No confusing jargon — just a plan that matches our family's needs.","Reviewed my old policy and helped me top up the cover appropriately.",
    "Answered every question patiently, even the ones I thought were silly.","Helped me understand riders I didn't know existed."],
  accident: ["Filed my accident claim within days — the paperwork was minimal.","Affordable cover that gave real peace of mind for my daily commute.",
    "Explained how personal accident cover complements our health policy.","Got my family covered under one simple group plan.",
    "Quick, clear guidance when I needed cover after a minor accident scare.","Helped me understand disability cover I didn't know I needed."]
};
function genTestimonials(count, cat){
  const list = [];
  for(let i=0;i<count;i++){
    const name = names[i % names.length];
    const region = regions[(i*7+3) % regions.length];
    const quote = templates[cat][(i*3+1) % templates[cat].length];
    list.push({name, region, quote});
  }
  return list;
}
const testiData = { health: genTestimonials(42,'health'), term: genTestimonials(22,'term'), accident: genTestimonials(6,'accident') };
const testiPanels = document.getElementById('testiPanels');
Object.keys(testiData).forEach((key,i)=>{
  const panel = document.createElement('div');
  panel.className = 'tab-panel' + (i===0 ? ' active' : '');
  panel.dataset.panel = key;
  panel.innerHTML = `<div class="testi-mini-grid">${testiData[key].map(t=>
    `<div class="testi-mini"><div class="stars">★★★★★</div><p>"${t.quote}"</p><div class="who">${t.name}</div><div class="loc">${t.region.c}, ${t.region.s}</div></div>`
  ).join('')}</div>`;
  testiPanels.appendChild(panel);
});
wireTabs('testiTabs','testiPanels');

/* ---- Pincode auto-lookup (India Post open API), reusable ---- */
function wirePincodeLookup(pinFieldId, areaFieldId, districtFieldId, stateFieldId){
  const pinField = document.getElementById(pinFieldId);
  if(!pinField) return;
  pinField.addEventListener('blur', async function(){
    const pin = this.value.trim();
    if(!/^[0-9]{6}$/.test(pin)) return;
    try{
      const res = await fetch('https://api.postalpincode.in/pincode/' + pin);
      const data = await res.json();
      if(data && data[0] && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length){
        const po = data[0].PostOffice[0];
        document.getElementById(areaFieldId).value = po.Name || '';
        document.getElementById(districtFieldId).value = po.District || '';
        document.getElementById(stateFieldId).value = po.State || '';
      } else {
        console.warn('Pincode lookup: no match found for', pin);
      }
    }catch(err){ console.warn('Pincode lookup failed (network or API issue):', err); }
  });
}
wirePincodeLookup('healthPincode','healthArea','healthDistrict','healthState');
wirePincodeLookup('termPincode','termArea','termDistrict','termState');

/* ---- Age calculation helper ---- */
function calcAge(dobStr){
  const dob = new Date(dobStr); const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if(m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age >= 0 ? age : '';
}

/* ---- Per-member dynamic fields (Health New Policy): DOB -> age, or manual age; health issues ---- */
const memberContainer = document.getElementById('memberDetailsContainer');
const memberWrap = document.getElementById('memberDetailsWrap');
document.getElementById('healthNewMembers').addEventListener('input', function(){
  let n = parseInt(this.value) || 0;
  if(n > 10) n = 10;
  memberContainer.innerHTML = '';
  memberWrap.classList.toggle('hidden', n < 1);
  for(let i=1;i<=n;i++){
    const card = document.createElement('div');
    card.className = 'member-card';
    card.innerHTML = `
      <div class="m-title">Member ${i}</div>
      <div class="field-row">
        <div class="field"><label>Date of birth</label><input type="date" id="member_${i}_dob"></div>
        <div class="field"><label>Age <span class="opt">(auto or manual)</span></label><input type="number" id="member_${i}_age" min="0" max="120" placeholder="Age"></div>
      </div>
      <label class="check-item" style="margin-bottom:8px;"><input type="checkbox" id="member_${i}_manualAge"> Enter age directly instead of DOB</label>
      <div class="field"><label>Any health issues? <span class="opt">(optional)</span></label><input type="text" id="member_${i}_health" placeholder="e.g. Diabetes, BP — leave blank if none"></div>
    `;
    memberContainer.appendChild(card);
    const dobEl = card.querySelector(`#member_${i}_dob`);
    const ageEl = card.querySelector(`#member_${i}_age`);
    const manualEl = card.querySelector(`#member_${i}_manualAge`);
    dobEl.addEventListener('change', ()=>{ if(!manualEl.checked && dobEl.value) ageEl.value = calcAge(dobEl.value); });
    manualEl.addEventListener('change', ()=>{ dobEl.disabled = manualEl.checked; if(!manualEl.checked && dobEl.value) ageEl.value = calcAge(dobEl.value); });
  }
});

/* ---- Term: DOB -> auto age ---- */
const termDOB = document.getElementById('termDOB');
const termAge = document.getElementById('termAge');
termDOB.addEventListener('change', ()=>{ if(termDOB.value) termAge.value = calcAge(termDOB.value); });

/* ---- Term: Nature of duty, dynamic by occupation type (Employee / Business / Self-Employed) + Other ---- */
const dutyOptions = {
  "Employee": ["Desk Job / Office Administration","IT / Software Professional","Sales & Marketing (Field)","Field Service / Technician",
    "Manufacturing / Factory Floor","Healthcare Worker (Nurse/Technician)","Doctor / Medical Professional (Employed)","Teaching / Academic Staff",
    "Government Employee","Banking / Finance Employee","Hospitality Staff","Security Personnel","Driver / Transport Staff",
    "Construction Site Worker","Mining / Hazardous Site Worker","Defence / Police / Paramilitary","Pilot / Aviation Crew",
    "Merchant Navy / Marine Crew","Electrician / Technical Maintenance","Warehouse / Logistics Staff"],
  "Business": ["Shop / Retail Owner","Wholesale / Trading Business","Manufacturing Unit Owner","Restaurant / Hospitality Business",
    "Construction / Real Estate Business","Transport / Logistics Business","IT / Software Business Owner","Import / Export Business",
    "Agriculture / Agri-Business","Pharmacy / Medical Store Owner","Educational Institute Owner","Event Management Business",
    "Textile / Garment Business","Jewellery Business","Automobile Dealership / Service","E-commerce Business",
    "Consultancy / Professional Services Firm","Mining / Quarry Business","Chemical / Hazardous Materials Business"],
  "Self-Employed / Professional": ["Doctor","Lawyer / Advocate","Chartered Accountant","Architect","Business Consultant",
    "Freelance IT Professional","Content Creator / Media Professional","Insurance / Financial Advisor","Real Estate Agent",
    "Interior Designer","Photographer / Videographer","Tutor / Trainer","Fitness Trainer","Artist / Musician","Independent Contractor"]
};
const termOccupationType = document.getElementById('termOccupationType');
const termDuty = document.getElementById('termDuty');
const termDutyOtherField = document.getElementById('termDutyOtherField');
termOccupationType.addEventListener('change', ()=>{
  const list = dutyOptions[termOccupationType.value] || [];
  termDuty.innerHTML = '';
  termDuty.appendChild(new Option('Select one',''));
  list.forEach(item => termDuty.appendChild(new Option(item, item)));
  termDuty.appendChild(new Option('Other','Other'));
  termDutyOtherField.classList.add('hidden');
});
termDuty.addEventListener('change', ()=>{
  termDutyOtherField.classList.toggle('hidden', termDuty.value !== 'Other');
});

/* ---- Term: Smoker Yes/No -> frequency + quantity ---- */
const termSmoker = document.getElementById('termSmoker');
const termSmokeFields = document.getElementById('termSmokeFields');
termSmoker.addEventListener('change', ()=>{
  termSmokeFields.classList.toggle('hidden', termSmoker.value !== 'Yes');
});

/* ---- Show/hide top-level conditional sections ---- */
const interestSelect = document.getElementById('interest');
const healthBlock = document.getElementById('healthBlock');
const termBlock = document.getElementById('termBlock');
const healthType = document.getElementById('healthType');
const healthNewFields = document.getElementById('healthNewFields');
const healthPortFields = document.getElementById('healthPortFields');
const healthCoverType = document.getElementById('healthCoverType');
const groupFields = document.getElementById('groupFields');
const portClaims = document.getElementById('portClaims');
const portClaimDetailsField = document.getElementById('portClaimDetailsField');
const termExisting = document.getElementById('termExisting');
const termExistingFields = document.getElementById('termExistingFields');

function toggle(el, show){ el.classList.toggle('hidden', !show); }

interestSelect.addEventListener('change', ()=>{
  const v = interestSelect.value;
  toggle(healthBlock, v === 'Health Insurance');
  toggle(termBlock, v === 'Term Insurance');
  if(v !== 'Health Insurance'){ healthType.value=''; toggle(healthNewFields,false); toggle(healthPortFields,false); }
  if(v !== 'Term Insurance'){ termExisting.value=''; toggle(termExistingFields,false); }
});
healthType.addEventListener('change', ()=>{
  toggle(healthNewFields, healthType.value === 'new');
  toggle(healthPortFields, healthType.value === 'porting');
});
healthCoverType.addEventListener('change', ()=> toggle(groupFields, healthCoverType.value === 'Group'));
portClaims.addEventListener('change', ()=> toggle(portClaimDetailsField, portClaims.value === 'Yes'));
termExisting.addEventListener('change', ()=> toggle(termExistingFields, termExisting.value === 'Yes'));

/* ---- Thank-you modal ---- */
const modal = document.getElementById('thankYouModal');
document.getElementById('modalCloseBtn').addEventListener('click', ()=> modal.classList.remove('show'));
modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.classList.remove('show'); });

/* =========================================================================
   LEAD FORM SUBMIT — backend save
   GitHub Pages only serves static files, so it cannot write an .xlsx file
   to disk by itself. The standard free way to turn a GitHub-hosted form
   into a spreadsheet is:
     1. Open Google Sheets, create a new sheet.
     2. Extensions -> Apps Script -> paste the contents of apps-script/Code.gs
        from this project.
     3. Deploy as a Web App (Execute as: Me, Access: Anyone), copy the URL
        into GOOGLE_SCRIPT_URL below.
     4. Download the Google Sheet as .xlsx any time via File -> Download.
   Until GOOGLE_SCRIPT_URL is set, submissions validate and show the
   thank-you message, but are only logged to the console for testing.
========================================================================= */
const GOOGLE_SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

const form = document.getElementById('leadFormInner');
const submitBtn = document.getElementById('submitBtn');
const val = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
const checked = id => { const el = document.getElementById(id); return el ? el.checked : false; };

function collectMemberDetails(){
  const n = parseInt(val('healthNewMembers')) || 0;
  const arr = [];
  for(let i=1;i<=n;i++){
    arr.push({ member: i, dob: val(`member_${i}_dob`), age: val(`member_${i}_age`), health_issues: val(`member_${i}_health`) });
  }
  return arr;
}

form.addEventListener('submit', async function(e){
  e.preventDefault();

  const phone = val('phone');
  if(!/^[0-9]{10}$/.test(phone)){ alert('Please enter a valid 10-digit mobile number.'); return; }
  const interest = val('interest');
  if(interest === 'Health Insurance' && !val('healthType')){ alert('Please select New Policy or Porting.'); return; }
  if(interest === 'Health Insurance' && val('healthType') === 'new' && val('healthCoverType') === 'Group'){
    if(!val('groupCompanyName') || !val('groupLocation') || !val('groupEmployeeCount')){
      alert('For Group cover, company name, location and employee count are required.'); return;
    }
  }
  if(interest === 'Term Insurance' && !val('termCoverage')){ alert('Please select the coverage amount you are looking for.'); return; }

  const record = {
    timestamp: new Date().toISOString(),
    name: val('name'), phone: phone, alt_phone: val('altPhone'),
    call_available: checked('callAvailable') ? 'Yes' : 'No',
    whatsapp_available: checked('whatsappAvailable') ? 'Yes' : 'No',
    area: val('area'), interest: interest, callback: val('callback'),
    // Health — general
    health_company: val('healthCompany'), health_type: val('healthType'),
    // Health — new policy
    health_package: val('healthPackage'), health_new_members: val('healthNewMembers'),
    health_cover_type: val('healthCoverType'), health_member_details: JSON.stringify(collectMemberDetails()),
    group_company_name: val('groupCompanyName'), group_location: val('groupLocation'),
    group_employee_count: val('groupEmployeeCount'), group_sum_insured: val('groupSumInsured'),
    group_employee_type: val('groupEmployeeType'),
    health_address: val('healthAddress'), health_pincode: val('healthPincode'),
    health_area: val('healthArea'), health_district: val('healthDistrict'), health_state: val('healthState'),
    health_timeline: val('healthTimeline'), health_preferred_date: val('healthPreferredDate'),
    // Health — porting
    port_current_policy: val('portCurrentPolicy'), port_sum_insured: val('portSumInsured'),
    port_package: val('portPackage'), port_members: val('portMembers'), port_claims: val('portClaims'),
    port_claim_details: val('portClaimDetails'),
    port_reason: val('portReason') === 'Other' ? val('portReasonOther') : val('portReason'),
    port_expiry: val('portExpiry'), port_has_document: val('portHasDocument'),
    // Term
    term_coverage: val('termCoverage'), term_readiness: val('termReadiness'), term_for: val('termFor'),
    term_dob: val('termDOB'), term_age: val('termAge'),
    term_pincode: val('termPincode'), term_area: val('termArea'), term_district: val('termDistrict'), term_state: val('termState'),
    term_occupation_type: val('termOccupationType'),
    term_duty: val('termDuty') === 'Other' ? val('termDutyOther') : val('termDuty'),
    term_income: val('termIncome'), term_itr: val('termITR'), term_vaccine: val('termVaccine'), term_checkup: val('termCheckup'),
    term_smoker: val('termSmoker'), term_smoke_frequency: val('termSmokeFreq'), term_smoke_quantity: val('termSmokeQty'),
    term_existing: val('termExisting'), term_existing_company: val('termExistingCompany'), term_existing_sum: val('termExistingSum')
  };

  submitBtn.disabled = true; submitBtn.textContent = 'Submitting...';
  try{
    if(GOOGLE_SCRIPT_URL && !GOOGLE_SCRIPT_URL.startsWith('PASTE_')){
      await fetch(GOOGLE_SCRIPT_URL, { method:'POST', mode:'no-cors', headers:{'Content-Type':'application/json'}, body: JSON.stringify(record) });
    } else {
      console.log('Lead captured (backend not configured yet):', record);
    }
  } catch(err){ console.warn('Could not reach backend, lead was not saved remotely:', err); }

  document.getElementById('thankYouText').textContent =
    'Thanks, ' + (record.name.split(' ')[0] || 'there') + '! Your request has been received. A licensed advisor will get back to you — ' + (record.callback || 'soon') + '.';
  modal.classList.add('show');

  submitBtn.disabled = false; submitBtn.textContent = 'Request my free call back';
  form.reset();
  memberContainer.innerHTML = ''; toggle(memberWrap,false);
  toggle(healthBlock,false); toggle(termBlock,false);
  toggle(healthNewFields,false); toggle(healthPortFields,false); toggle(groupFields,false);
  toggle(portClaimDetailsField,false); toggle(termExistingFields,false);
  toggle(document.getElementById('portReasonOtherField'),false);
  toggle(termSmokeFields,false); toggle(termDutyOtherField,false);
  termDuty.innerHTML = '<option value="">Select occupation type first</option>';
});
