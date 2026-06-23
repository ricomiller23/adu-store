(function() {
  // 1. Identify container or inject floating launcher button
  var container = document.getElementById('adu-feasibility-quiz');
  if (!container) {
    console.error("ADU Feasibility Quiz container with id 'adu-feasibility-quiz' not found on the page.");
    return;
  }

  // Get APP URL (looks at script source domain to auto-detect Next.js address)
  var scriptEl = document.currentScript;
  var appUrl = "http://localhost:3000";
  if (scriptEl && scriptEl.src) {
    var parser = document.createElement('a');
    parser.href = scriptEl.src;
    appUrl = parser.protocol + '//' + parser.host;
  }

  // 2. Add style sheet dynamically (isolated namespace to prevent host CSS contamination)
  var style = document.createElement('style');
  style.innerHTML = `
    .adu-quiz-box {
      font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      max-width: 500px;
      margin: 20px auto;
      background: #ffffff;
      border: 1px solid #e4dfd3;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(22, 53, 42, 0.08);
      overflow: hidden;
      color: #333333;
    }
    .adu-quiz-header {
      background: #16352a;
      padding: 20px 24px;
      color: #ffffff;
    }
    .adu-quiz-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 0.5px;
      font-family: sans-serif;
    }
    .adu-quiz-header p {
      margin: 4px 0 0 0;
      font-size: 12px;
      color: #a3b899;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .adu-quiz-body {
      padding: 24px;
      min-height: 280px;
      display: flex;
      flex-col: column;
      flex-direction: column;
      justify-content: space-between;
    }
    .adu-quiz-step {
      display: none;
    }
    .adu-quiz-step.active {
      display: block;
    }
    .adu-quiz-progress {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }
    .adu-quiz-progress-bar {
      flex: 1;
      height: 4px;
      background: #e4dfd3;
      margin: 0 8px;
      border-radius: 2px;
      overflow: hidden;
      position: relative;
    }
    .adu-quiz-progress-fill {
      height: 100%;
      background: #27537d;
      width: 0%;
      transition: width 0.3s ease;
    }
    .adu-quiz-step-title {
      font-size: 16px;
      font-weight: 700;
      color: #16352a;
      margin: 0 0 16px 0;
    }
    .adu-quiz-input {
      width: 100%;
      box-sizing: border-box;
      padding: 12px;
      border: 1px solid #e4dfd3;
      border-radius: 6px;
      font-size: 14px;
      margin-top: 8px;
      outline: none;
      transition: border-color 0.15s;
    }
    .adu-quiz-input:focus {
      border-color: #27537d;
    }
    .adu-quiz-options {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
    }
    .adu-quiz-option {
      border: 1px solid #e4dfd3;
      padding: 14px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.15s;
      background: #fcfcfa;
    }
    .adu-quiz-option:hover {
      border-color: #27537d;
      background: #f4f7fa;
    }
    .adu-quiz-option.selected {
      border-color: #27537d;
      background: #ebf2f7;
      color: #27537d;
    }
    .adu-quiz-footer {
      display: flex;
      justify-content: space-between;
      margin-top: 24px;
      border-top: 1px solid #f0ece3;
      padding-top: 16px;
    }
    .adu-quiz-btn {
      padding: 10px 20px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      border: none;
      transition: background 0.15s;
    }
    .adu-quiz-btn-prev {
      background: #f6f4ee;
      color: #666;
      border: 1px solid #e4dfd3;
    }
    .adu-quiz-btn-prev:hover {
      background: #eeece3;
    }
    .adu-quiz-btn-next {
      background: #27537d;
      color: #ffffff;
      margin-left: auto;
    }
    .adu-quiz-btn-next:hover {
      background: #1f4366;
    }
    .adu-quiz-consent-group {
      margin-top: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .adu-quiz-consent-item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: 11px;
      color: #666;
      line-height: 1.4;
    }
    .adu-quiz-consent-item input {
      margin-top: 2px;
    }
    .adu-quiz-result {
      text-align: center;
      padding: 12px 0;
    }
    .adu-quiz-result-title {
      font-size: 18px;
      font-weight: 700;
      color: #2f7d54;
      margin-bottom: 12px;
    }
    .adu-quiz-result-msg {
      font-size: 13px;
      line-height: 1.6;
      color: #555;
      background: #f4fcf7;
      border: 1px solid #d1edd9;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .adu-quiz-blueprint {
      margin: 15px auto;
      border: 1px dashed #27537d;
      padding: 10px;
      background: #f0f5fa;
      max-width: 250px;
      border-radius: 6px;
    }
  `;
  document.head.appendChild(style);

  // 3. Render HTML Structure
  container.innerHTML = `
    <div class="adu-quiz-box">
      <div class="adu-quiz-header">
        <h3>ADU Eligibility Calculator</h3>
        <p>The ADU Store — California Prefab</p>
      </div>

      <div class="adu-quiz-body">
        <div class="adu-quiz-progress">
          <span id="adu-step-indicator" style="font-size: 12px; font-weight: 700; color: #666;">Step 1 of 6</span>
          <div class="adu-quiz-progress-bar">
            <div id="adu-progress-fill" class="adu-quiz-progress-fill"></div>
          </div>
        </div>

        <div id="adu-quiz-form">
          <!-- Step 1: Address -->
          <div class="adu-quiz-step active" data-step="1">
            <h4 class="adu-quiz-step-title">Where is your property located?</h4>
            <p style="font-size: 12px; color: #666; margin-bottom: 12px;">We currently build modular ADUs throughout California.</p>
            <label style="font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase;">California City</label>
            <input type="text" id="adu-q-city" class="adu-quiz-input" placeholder="e.g. San Jose, Los Angeles" />
          </div>

          <!-- Step 2: Lot Size -->
          <div class="adu-quiz-step" data-step="2">
            <h4 class="adu-quiz-step-title">What is your approximate lot size?</h4>
            <div class="adu-quiz-options">
              <div class="adu-quiz-option" data-value="under3k" data-field="lotSizeBand">Under 3,000 sqft (Small Lot)</div>
              <div class="adu-quiz-option" data-value="3k5k" data-field="lotSizeBand">3,000 - 5,000 sqft (Standard Lot)</div>
              <div class="adu-quiz-option" data-value="5k7k" data-field="lotSizeBand">5,000 - 7,500 sqft (Spacious Lot)</div>
              <div class="adu-quiz-option" data-value="7kplus" data-field="lotSizeBand">7,500+ sqft (Large Backyard)</div>
            </div>
          </div>

          <!-- Step 3: Goal -->
          <div class="adu-quiz-step" data-step="3">
            <h4 class="adu-quiz-step-title">What is your primary goal for the ADU?</h4>
            <div class="adu-quiz-options">
              <div class="adu-quiz-option" data-value="rent" data-field="goal">Rental Income / Cash Flow Asset</div>
              <div class="adu-quiz-option" data-value="family" data-field="goal">Multigenerational Family Living</div>
              <div class="adu-quiz-option" data-value="office" data-field="goal">Home Office / Creative WFH Studio</div>
              <div class="adu-quiz-option" data-value="sell" data-field="goal">Convert & Sell Separately as Condo</div>
            </div>
          </div>

          <!-- Step 4: Timeline & Financing -->
          <div class="adu-quiz-step" data-step="4">
            <h4 class="adu-quiz-step-title">What is your build timeline?</h4>
            <div class="adu-quiz-options">
              <div class="adu-quiz-option" data-value="immediate" data-field="timeline">Immediate (Within 3 months)</div>
              <div class="adu-quiz-option" data-value="soon" data-field="timeline">Medium Term (3 - 6 months)</div>
              <div class="adu-quiz-option" data-value="research" data-field="timeline">Planning & Research (6+ months)</div>
            </div>
          </div>

          <!-- Step 5: Unpermitted Unit -->
          <div class="adu-quiz-step" data-step="5">
            <h4 class="adu-quiz-step-title">Do you have an existing unpermitted structure?</h4>
            <p style="font-size: 12px; color: #666; margin-bottom: 12px;">Pre-2020 unpermitted structures can be legalized via a safety checklist (AB 2533).</p>
            <div class="adu-quiz-options">
              <div class="adu-quiz-option" data-value="yes" data-field="unpermitted">Yes, unpermitted garage or guest house</div>
              <div class="adu-quiz-option" data-value="no" data-field="unpermitted">No, completely new build from scratch</div>
            </div>
          </div>

          <!-- Step 6: Contact & Consent -->
          <div class="adu-quiz-step" data-step="6">
            <h4 class="adu-quiz-step-title">Get Your Free Feasibility Report</h4>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div>
                <label style="font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase;">Full Name</label>
                <input type="text" id="adu-q-name" class="adu-quiz-input" placeholder="Your Name" />
              </div>
              <div>
                <label style="font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase;">Email Address</label>
                <input type="email" id="adu-q-email" class="adu-quiz-input" placeholder="email@domain.com" />
              </div>
              <div>
                <label style="font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase;">Phone Number</label>
                <input type="text" id="adu-q-phone" class="adu-quiz-input" placeholder="(555) 555-5555" />
              </div>

              <div class="adu-quiz-consent-group">
                <label class="adu-quiz-consent-item">
                  <input type="checkbox" id="adu-q-consent-email" checked />
                  <span>I consent to receive email updates and nurture sequences from The ADU Store.</span>
                </label>
                <label class="adu-quiz-consent-item">
                  <input type="checkbox" id="adu-q-consent-phone" />
                  <span>I consent to receive phone calls and text messages at the number provided above.</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div id="adu-quiz-result-view" style="display: none;" class="adu-quiz-result">
          <div class="adu-quiz-result-title">Feasibility Assessment Ready!</div>
          <div id="adu-result-text" class="adu-quiz-result-msg"></div>
          
          <div class="adu-quiz-blueprint">
            <div style="font-size: 10px; font-weight: bold; color: #27537d; text-align: center; text-transform: uppercase; margin-bottom: 4px;">Proposed Site Mockup</div>
            <div style="border: 1px solid #b3d1ff; height: 100px; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #27537d; font-weight: bold; background: white; font-family: monospace;">
              [ MAIN HOUSE ]<br/>
              --- 15ft separation ---<br/>
              [ MODULAR ADU 1,200 sqft ]
            </div>
            <div style="font-size: 9px; color: #666; margin-top: 4px; text-align: center;">4ft setbacks respected. energy-efficient, solar-ready</div>
          </div>

          <button id="adu-btn-restart" class="adu-quiz-btn adu-quiz-btn-next" style="margin: 0 auto; display: block;">Restart Quiz</button>
        </div>

        <div id="adu-quiz-navigation" class="adu-quiz-footer">
          <button id="adu-btn-prev" class="adu-quiz-btn adu-quiz-btn-prev" style="display: none;">Back</button>
          <button id="adu-btn-next" class="adu-quiz-btn adu-quiz-btn-next">Next</button>
        </div>
      </div>
    </div>
  `;

  // 4. Form values state
  var answers = {
    city: '',
    lotSizeBand: '',
    goal: '',
    timeline: '',
    unpermitted: ''
  };

  var currentStep = 1;
  var totalSteps = 6;

  // DOM elements references
  var stepIndicator = document.getElementById('adu-step-indicator');
  var progressFill = document.getElementById('adu-progress-fill');
  var btnPrev = document.getElementById('adu-btn-prev');
  var btnNext = document.getElementById('adu-btn-next');
  var btnRestart = document.getElementById('adu-btn-restart');
  var navigationPanel = document.getElementById('adu-quiz-navigation');
  var progressPanel = container.querySelector('.adu-quiz-progress');

  // Option selection handlers
  var options = container.querySelectorAll('.adu-quiz-option');
  options.forEach(function(opt) {
    opt.addEventListener('click', function() {
      var field = opt.getAttribute('data-field');
      var value = opt.getAttribute('data-value');
      
      // Clear sibling selection highlights
      var siblings = opt.parentNode.querySelectorAll('.adu-quiz-option');
      siblings.forEach(function(sib) { sib.classList.remove('selected'); });
      
      // Highlight selected
      opt.classList.add('selected');
      answers[field] = value;
    });
  });

  // Step renderer
  function renderStep() {
    // Hide all steps
    var steps = container.querySelectorAll('.adu-quiz-step');
    steps.forEach(function(step) { step.classList.remove('active'); });

    // Show active step
    var activeStep = container.querySelector('.adu-quiz-step[data-step="' + currentStep + '"]');
    if (activeStep) activeStep.classList.add('active');

    // Update progress bar
    var fillPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
    progressFill.style.width = fillPercent + '%';
    stepIndicator.innerText = 'Step ' + currentStep + ' of ' + totalSteps;

    // Toggle Back button visibility
    if (currentStep === 1) {
      btnPrev.style.display = 'none';
    } else {
      btnPrev.style.display = 'block';
    }

    // Toggle Next button text on final step
    if (currentStep === totalSteps) {
      btnNext.innerText = 'Submit Report';
    } else {
      btnNext.innerText = 'Next';
    }
  }

  // Next / Submit Button Action
  btnNext.addEventListener('click', function() {
    if (currentStep === 1) {
      var cityVal = document.getElementById('adu-q-city').value;
      if (!cityVal.trim()) {
        alert("Please enter your property's city.");
        return;
      }
      answers.city = cityVal.trim();
    } else if (currentStep === 2 && !answers.lotSizeBand) {
      alert("Please select your lot size band.");
      return;
    } else if (currentStep === 3 && !answers.goal) {
      alert("Please select your primary ADU goal.");
      return;
    } else if (currentStep === 4 && !answers.timeline) {
      alert("Please select your build timeline.");
      return;
    } else if (currentStep === 5 && !answers.unpermitted) {
      alert("Please specify if you have an unpermitted structure.");
      return;
    } else if (currentStep === 6) {
      submitForm();
      return;
    }

    currentStep += 1;
    renderStep();
  });

  // Back Button Action
  btnPrev.addEventListener('click', function() {
    if (currentStep > 1) {
      currentStep -= 1;
      renderStep();
    }
  });

  // Restart Button Action
  btnRestart.addEventListener('click', function() {
    answers = { city: '', lotSizeBand: '', goal: '', timeline: '', unpermitted: '' };
    currentStep = 1;
    
    // Clear selected options in UI
    options.forEach(function(opt) { opt.classList.remove('selected'); });
    document.getElementById('adu-q-city').value = '';
    document.getElementById('adu-q-name').value = '';
    document.getElementById('adu-q-email').value = '';
    document.getElementById('adu-q-phone').value = '';

    document.getElementById('adu-quiz-form').style.display = 'block';
    document.getElementById('adu-quiz-result-view').style.display = 'none';
    navigationPanel.style.display = 'flex';
    progressPanel.style.display = 'flex';

    renderStep();
  });

  // Submit Form details to capture API
  function submitForm() {
    var name = document.getElementById('adu-q-name').value;
    var email = document.getElementById('adu-q-email').value;
    var phone = document.getElementById('adu-q-phone').value;
    var consentEmail = document.getElementById('adu-q-consent-email').checked;
    var consentPhone = document.getElementById('adu-q-consent-phone').checked;

    if (!name.trim() || !email.trim()) {
      alert("Please provide your name and email address.");
      return;
    }

    btnNext.innerText = 'Submitting...';
    btnNext.disabled = true;

    var payload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: answers.city,
      lotSizeBand: answers.lotSizeBand,
      goal: answers.goal,
      timeline: answers.timeline,
      unpermitted: answers.unpermitted === 'yes',
      consentEmail: consentEmail,
      consentPhone: consentPhone,
      consentSms: consentPhone,
      consentText: "I consent to receive email updates and phone communications.",
      consentIp: "127.0.0.1" // placeholder
    };

    fetch(appUrl + '/api/leads/capture', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(function(res) {
      if (!res.ok) throw new Error("Capture failed");
      return res.json();
    })
    .then(function(data) {
      // Hide form & navigation, show results
      document.getElementById('adu-quiz-form').style.display = 'none';
      navigationPanel.style.display = 'none';
      progressPanel.style.display = 'none';
      
      var resultView = document.getElementById('adu-quiz-result-view');
      var resultText = document.getElementById('adu-result-text');
      
      resultText.innerText = data.resultMessage;
      resultView.style.display = 'block';
    })
    .catch(function(err) {
      console.error(err);
      alert("There was an error calculating feasibility. Please try again.");
    })
    .finally(function() {
      btnNext.disabled = false;
    });
  }

  // Initial step setup
  renderStep();
})();
