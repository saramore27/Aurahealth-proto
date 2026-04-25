function jumpTo(panelId) {
  document.querySelectorAll('.panel').forEach(function (panel) {
    panel.classList.toggle('active', panel.id === panelId);
  });
  document.querySelectorAll('.tab').forEach(function (tab) {
    tab.classList.toggle('active', tab.dataset.target === panelId);
  });
}

function updatePersonalization() {
  const picks = ['q1', 'q2', 'q3'].map(function (q) {
    const picked = document.querySelector('input[name="' + q + '"]:checked');
    return picked ? picked.value : null;
  });

  if (picks.includes(null)) {
    alert('Please answer all 3 quiz questions.');
    return;
  }

  const counts = { vata: 0, pitta: 0, kapha: 0 };
  picks.forEach(function (value) {
    counts[value] += 1;
  });

  const dosha = Object.keys(counts).sort(function (a, b) {
    return counts[b] - counts[a];
  })[0];

  const plans = {
    vata: {
      title: 'Vata Personalized Routine',
      water: 'Water: 2.2 L/day (warm water, frequent sips)',
      sleep: '8 hours, with lights out by 10:30 PM',
      protein: '75 g/day from warm, easy-to-digest meals',
      vitamins: 'Vitamin D3, Magnesium, Omega-3',
      routine: [
        'Wake at 6:30 AM, start with warm lemon water and 5 minutes of deep breathing.',
        'Eat 3 regular meals at fixed times; avoid skipping meals.',
        'Do 20 minutes gentle yoga and grounding stretches.',
        'Take a warm lunch with healthy fats: ghee, sesame, olive oil.',
        'Wind down with a screen-light break and warm herbal tea at night.'
      ],
      eat: ['Warm soups, oatmeal, cooked root vegetables', 'Ghee, soaked nuts, dates', 'Mung dal khichdi, rice, stewed fruits'],
      avoid: ['Cold salads, dry crackers, excess caffeine', 'Late-night eating', 'Fasting and very raw meals']
    },
    pitta: {
      title: 'Pitta Personalized Routine',
      water: 'Water: 2.7 L/day (room temperature, not icy)',
      sleep: '7.5 hours with cooling night routine',
      protein: '85 g/day with moderate spices',
      vitamins: 'B-complex, Vitamin C, Zinc',
      routine: [
        'Wake at 6:00 AM and start with hydration plus 10 minutes cooling breath work.',
        'Avoid long gaps between meals to prevent irritability and acid spikes.',
        'Practice 25 minutes moderate movement, avoid overtraining in peak heat.',
        'Take your main meal at lunch, including cooling herbs and greens.',
        'Finish dinner by 8:00 PM and use a calm low-heat bedtime routine.'
      ],
      eat: ['Cucumber, leafy greens, coconut, sweet fruits', 'Moong, quinoa, basmati rice', 'Mint, coriander, fennel-based meals'],
      avoid: ['Excess chilies, fried food, sour pickles', 'Too much coffee and alcohol', 'Heavy late-night protein meals']
    },
    kapha: {
      title: 'Kapha Personalized Routine',
      water: 'Water: 2.4 L/day (warm water with ginger)',
      sleep: '7 hours; avoid oversleeping after sunrise',
      protein: '90 g/day with lighter carbs',
      vitamins: 'Vitamin D, B12, Iron support',
      routine: [
        'Wake at 5:45 AM and begin with brisk walking for 20 minutes.',
        'Eat lighter breakfast and make lunch your strongest meal.',
        'Do 30 minutes energizing exercise, including strength or intervals.',
        'Keep long sitting breaks every hour to maintain circulation.',
        'Dinner should be light and early, followed by short evening walk.'
      ],
      eat: ['Steamed vegetables, lentils, barley, millet', 'Spices like ginger, black pepper, turmeric', 'Light soups and high-fiber meals'],
      avoid: ['Sugary snacks, deep-fried food, heavy dairy', 'Cold desserts and daytime naps', 'Overeating late in the evening']
    }
  };

  const chosen = plans[dosha];
  document.getElementById('current-dosha').textContent = dosha.toUpperCase();
  document.getElementById('daily-water').textContent = chosen.water;
  document.getElementById('daily-sleep').textContent = chosen.sleep;
  document.getElementById('daily-protein').textContent = chosen.protein;
  document.getElementById('daily-vitamins').textContent = chosen.vitamins;
  document.getElementById('routine-title').textContent = chosen.title;
  document.getElementById('routine-list').innerHTML = chosen.routine.map(function (item) { return '<li>' + item + '</li>'; }).join('');
  document.getElementById('eat-list').innerHTML = chosen.eat.map(function (item) { return '<li>' + item + '</li>'; }).join('');
  document.getElementById('avoid-list').innerHTML = chosen.avoid.map(function (item) { return '<li>' + item + '</li>'; }).join('');

  jumpTo('routine');
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      jumpTo(tab.dataset.target);
    });
  });

  document.getElementById('start-quiz-btn').addEventListener('click', function () {
    jumpTo('quiz');
  });

  document.getElementById('quiz-submit-btn').addEventListener('click', updatePersonalization);
});

function renderDashboard() {
    const profile = loadProfile();
    const firstName = profile.name !== 'Aura User' ? profile.name.split(' ')[0] : 'User';
    let health = {};
    try {
        health = JSON.parse(localStorage.getItem('aura-health') || '{}') || {};
    } catch (e) {
        health = {};
    }

    const stepGoal = Number(health.stepGoal) > 0 ? Number(health.stepGoal) : 10000;
    const todayStepsRaw = Number(health.todaySteps);
    const todaySteps = Number.isFinite(todayStepsRaw) && todayStepsRaw >= 0 ? todayStepsRaw : null;
    const stepsPct = todaySteps !== null ? Math.min(100, (todaySteps / stepGoal) * 100) : 0;

    const heartRateRaw = Number(health.heartRate);
    const heartRate = Number.isFinite(heartRateRaw) && heartRateRaw > 0 ? heartRateRaw : null;
    const heartStatus = heartRate === null ? 'No live data' : heartRate <= 100 ? 'Optimal rhythm' : 'Elevated rhythm';
    const heartStatusColor = heartRate === null ? 'var(--text-muted)' : heartRate <= 100 ? 'var(--success)' : 'var(--warning)';

    const nextExerciseName = (health.nextExercise || '').trim() || 'Not scheduled';
    const nextExerciseTime = (health.nextExerciseTime || '').trim() || 'Set from Exercise tab';
    return `
    <section class="page-section fade-in-up visible" aria-labelledby="dashboard-title">

        <!-- WELCOME TAGLINE -->
        <div class="text-center mb-6">
            <h1 style="font-size:2.8rem;font-weight:900;letter-spacing:-1px;margin-bottom:36px;line-height:1.2;"><span class="gradient-text">ANCIENT WISDOM</span> INTELLIGENT HEALTH</h1>
        </div>

        <!-- HERO SECTION -->
        <div class="hero-section" style="display:flex;justify-content:space-between;align-items:flex-start;gap:40px;flex-wrap:wrap;">
            <div style="flex:1;min-width:300px;">
                <span class="badge badge-cyan mb-3" style="text-transform:uppercase;letter-spacing:1.5px;font-size:0.75rem;">AI-Powered Health Assistant</span>
                <h1 id="dashboard-title" style="font-size:3.2rem;font-weight:800;line-height:1.15;letter-spacing:-1.5px;margin-top:12px;">Holistic Wellbeing,<br><span class="gradient-text" style="font-size:3.2rem;">Reimagined.</span></h1>
                <p class="text-muted mt-4" style="font-size:1.05rem;max-width:440px;line-height:1.7;">Track fitness, explore ancient ayurvedic wisdom, practice yoga, and get instant symptom insights from your personal AI.</p>
            </div>

            <!-- Profile Card -->
            <div class="glass-card p-5" style="min-width:280px;max-width:320px;border-radius:20px;">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h3 style="margin:0;font-size:1.3rem;">${firstName}</h3>
                        <span class="text-muted small">${profile.age ? profile.age + ' Years Old' : 'Age not set'}</span>
                    </div>
                    <div style="width:42px;height:42px;border-radius:50%;background:rgba(6,182,212,0.1);display:flex;align-items:center;justify-content:center;overflow:hidden;">
                        ${profile.photo ? `<img src="${profile.photo}" alt="User Photo" style="width:100%;height:100%;object-fit:cover;">` : `<i class="fa-solid fa-spa" style="color:var(--secondary);font-size:1.1rem;" aria-hidden="true"></i>`}
                    </div>
                </div>
                <div style="border-top:1px solid var(--border-color);padding-top:14px;margin-top:8px;">
                    <div class="d-flex justify-content-between" style="padding:8px 0;"><span class="text-muted">Blood Type</span><strong>${profile.blood || '—'}</strong></div>
                    <div class="d-flex justify-content-between" style="padding:8px 0;"><span class="text-muted">Height</span><strong>${profile.height ? profile.height + ' cm' : '—'}</strong></div>
                    <div class="d-flex justify-content-between" style="padding:8px 0;"><span class="text-muted">Weight</span><strong>${profile.weight ? profile.weight + ' kg' : '—'}</strong></div>
                    <div class="d-flex justify-content-between" style="padding:8px 0;"><span class="text-muted">Conditions</span><strong>${(profile.conditions && profile.conditions.length > 0 && profile.conditions[0]) ? profile.conditions.join(', ') : 'none'}</strong></div>
                </div>
                <a href="#/profile" style="display:inline-flex;align-items:center;gap:6px;color:var(--secondary);font-weight:600;font-size:0.9rem;margin-top:12px;text-decoration:none;">Update Medical History <i class="fa-solid fa-arrow-right" style="font-size:0.75rem;"></i></a>
            </div>
        </div>

        <!-- STAT CARDS -->
        <div class="grid-3 mt-6">
            <!-- Footsteps -->
            <article class="glass-card p-5 hover-lift">
                <div class="d-flex align-items-center mb-3">
                    <div class="stat-icon steps"><i class="fa-solid fa-shoe-prints" aria-hidden="true"></i></div>
                    <h4 class="ms-3" style="margin:0;color:var(--text-muted);font-weight:500;">Footsteps</h4>
                </div>
                <div>
                    <span style="font-size:2.5rem;font-weight:700;">${todaySteps !== null ? todaySteps.toLocaleString() : '—'}</span><span class="text-muted" style="font-size:1rem;"> / ${stepGoal.toLocaleString()}</span>
                </div>
                <div style="height:6px;background:var(--border-color);border-radius:3px;margin-top:12px;overflow:hidden;">
                    <div style="width:${stepsPct}%;height:100%;background:linear-gradient(90deg,var(--secondary),var(--primary));border-radius:3px;"></div>
                </div>
            </article>

            <!-- Heart Rate -->
            <article class="glass-card p-5 hover-lift">
                <div class="d-flex align-items-center mb-3">
                    <div class="stat-icon heart"><i class="fa-solid fa-heart-pulse" aria-hidden="true"></i></div>
                    <h4 class="ms-3" style="margin:0;color:var(--text-muted);font-weight:500;">Heart Rate</h4>
                </div>
                <div>
                    <span style="font-size:2.5rem;font-weight:700;">${heartRate !== null ? heartRate : '—'}</span><span class="text-muted" style="font-size:1rem;"> bpm</span>
                </div>
                <p style="margin-top:10px;font-size:0.85rem;color:${heartStatusColor};"><i class="fa-solid fa-wave-square" style="margin-right:6px;"></i> ${heartStatus}</p>
            </article>

            <!-- Next Exercise -->
            <article class="glass-card p-5 hover-lift">
                <div class="d-flex align-items-center mb-3">
                    <div class="stat-icon" style="background:rgba(245,158,11,0.1);color:var(--warning);"><i class="fa-solid fa-bell" aria-hidden="true"></i></div>
                    <h4 class="ms-3" style="margin:0;color:var(--text-muted);font-weight:500;">Next Exercise</h4>
                </div>
                <div>
                    <span style="font-size:1.8rem;font-weight:700;">${nextExerciseName}</span>
                </div>
                <p class="text-muted small" style="margin-top:4px;">${nextExerciseTime}</p>
                <button class="btn btn-outline mt-3" style="font-size:0.85rem;padding:8px 16px;" onclick="showToast('Reminder saved.','success')"><i class="fa-solid fa-bell"></i> Set Reminder</button>
            </article>
        </div>

        <!-- HEALTH ANALYTICS -->
        <div class="text-center mt-6">
            <h2 style="font-weight:700;">Your Health Analytics</h2>
            <p class="text-muted mt-2">Track your weekly progress with interactive charts.</p>
        </div>
        <div class="grid-3 mt-5">
            <article class="glass-card p-4 hover-lift" style="display:flex;flex-direction:column;">
                <div class="d-flex align-items-center mb-3">
                    <i class="fa-solid fa-shoe-prints" style="color:var(--secondary);margin-right:10px;"></i>
                    <h4 style="margin:0;">Weekly Steps</h4>
                </div>
                <div style="position:relative;height:200px;width:100%;">
                    <canvas id="chart-steps"></canvas>
                </div>
            </article>
            <article class="glass-card p-4 hover-lift" style="display:flex;flex-direction:column;">
                <div class="d-flex align-items-center mb-3">
                    <i class="fa-solid fa-heart-pulse" style="color:var(--danger);margin-right:10px;"></i>
                    <h4 style="margin:0;">Heart Rate Trend</h4>
                </div>
                <div style="position:relative;height:200px;width:100%;">
                    <canvas id="chart-heart"></canvas>
                </div>
            </article>
            <article class="glass-card p-4 hover-lift" style="display:flex;flex-direction:column;">
                <div class="d-flex align-items-center mb-3">
                    <i class="fa-solid fa-weight-scale" style="color:var(--primary);margin-right:10px;"></i>
                    <h4 style="margin:0;">Weight Progress</h4>
                </div>
                <div style="position:relative;height:200px;width:100%;">
                    <canvas id="chart-weight"></canvas>
                </div>
            </article>
        </div>

        <!-- HEALTH SOLUTIONS CENTER -->
        <div class="text-center mt-6">
            <h2 style="font-weight:700;">Health Solutions <span class="gradient-text">Center</span></h2>
            <p class="text-muted mt-2">Explore natural remedies, specialized yoga treatments, fitness plans, and community support.</p>
        </div>
        <div class="mt-5" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px;">
            <a href="#/ayurveda" class="solution-card glass-card hover-lift" style="text-decoration:none;overflow:hidden;border-radius:16px;">
                <div style="height:160px;background:url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80') center/cover;"></div>
                <div class="p-4">
                    <span class="badge" style="background:rgba(16,185,129,0.1);color:#10b981;font-size:0.7rem;text-transform:uppercase;letter-spacing:1px;">Natural & Herbal</span>
                    <h3 class="mt-3" style="font-size:1.15rem;">Ayurvedic Diagnostics</h3>
                    <p class="text-muted small mt-2">Analyze doshas and find targeted natural remedies tailored to your body type.</p>
                    <span style="color:var(--secondary);font-weight:600;font-size:0.9rem;display:inline-flex;align-items:center;gap:6px;margin-top:12px;">Explore Remedies <i class="fa-solid fa-arrow-right" style="font-size:0.75rem;"></i></span>
                </div>
            </a>
            <a href="#/yoga" class="solution-card glass-card hover-lift" style="text-decoration:none;overflow:hidden;border-radius:16px;">
                <div style="height:160px;background:url('https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80') center/cover;"></div>
                <div class="p-4">
                    <span class="badge" style="background:rgba(109,40,217,0.1);color:#6d28d9;font-size:0.7rem;text-transform:uppercase;letter-spacing:1px;">Mind & Body</span>
                    <h3 class="mt-3" style="font-size:1.15rem;">Yoga & Mudra Library</h3>
                    <p class="text-muted small mt-2">Daily routines, therapeutic yoga for specific ailments, and mudra hand postures.</p>
                    <span style="color:var(--secondary);font-weight:600;font-size:0.9rem;display:inline-flex;align-items:center;gap:6px;margin-top:12px;">Start Routine <i class="fa-solid fa-arrow-right" style="font-size:0.75rem;"></i></span>
                </div>
            </a>
            <a href="#/exercise" class="solution-card glass-card hover-lift" style="text-decoration:none;overflow:hidden;border-radius:16px;">
                <div style="height:160px;background:url('https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80') center/cover;"></div>
                <div class="p-4">
                    <span class="badge" style="background:rgba(239,68,68,0.1);color:#ef4444;font-size:0.7rem;text-transform:uppercase;letter-spacing:1px;">Movement</span>
                    <h3 class="mt-3" style="font-size:1.15rem;">Personalized Exercise</h3>
                    <p class="text-muted small mt-2">Get customized workout routines (cardio, strength, HIIT) tailored to balance your Dosha.</p>
                    <span style="color:var(--secondary);font-weight:600;font-size:0.9rem;display:inline-flex;align-items:center;gap:6px;margin-top:12px;">Find Workouts <i class="fa-solid fa-arrow-right" style="font-size:0.75rem;"></i></span>
                </div>
            </a>
            <a href="#/community" class="solution-card glass-card hover-lift" style="text-decoration:none;overflow:hidden;border-radius:16px;">
                <div style="height:160px;background:url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80') center/cover;"></div>
                <div class="p-4">
                    <span class="badge" style="background:rgba(6,182,212,0.1);color:#06b6d4;font-size:0.7rem;text-transform:uppercase;letter-spacing:1px;">Expert & Social</span>
                    <h3 class="mt-3" style="font-size:1.15rem;">Community & Experts</h3>
                    <p class="text-muted small mt-2">Connect with support groups and certified healthcare professionals.</p>
                    <span style="color:var(--secondary);font-weight:600;font-size:0.9rem;display:inline-flex;align-items:center;gap:6px;margin-top:12px;">Join Forums <i class="fa-solid fa-arrow-right" style="font-size:0.75rem;"></i></span>
                </div>
            </a>
        </div>

    </section>`;
}

// --- AYURVEDA PAGE ---
function renderAyurveda() {
    const vataHerbs = [
        { name: 'Ashwagandha', dosha: 'Vata/Kapha', dosage: '1/2 tsp twice daily', vehicle: 'Warm Milk', desc: 'Powerful adaptogen for stress and vitality.', icon: 'fa-leaf' },
        { name: 'Brahmi', dosha: 'Vata/Pitta/Kapha', dosage: '500mg extract', vehicle: 'Ghee or Water', desc: 'Brain tonic for memory and focus.', icon: 'fa-brain' },
        { name: 'Shankhpushpi', dosha: 'Vata', dosage: '1 tsp powder', vehicle: 'Lukewarm Milk', desc: 'Calms the nervous system and boosts concentration.', icon: 'fa-seedling' },
        { name: 'Vidari Kanda', dosha: 'Vata/Pitta', dosage: '3g powder', vehicle: 'Warm Milk', desc: 'Nourishing root for tissue strength.', icon: 'fa-dna' },
        { name: 'Jatamansi', dosha: 'Vata/Pitta/Kapha', dosage: '1-2g powder', vehicle: 'Honey or Water', desc: 'Natural sedative for anxiety and sleep.', icon: 'fa-moon' },
        { name: 'Bala', dosha: 'Vata', dosage: '3g powder', vehicle: 'Warm Milk', desc: 'Provides "strength" to muscles and nerves.', icon: 'fa-dumbbell' },
        { name: 'Dashmoola', dosha: 'Vata', dosage: '30ml decoction', vehicle: 'Warm Water', desc: 'Traditional ten-root formula for pain relief.', icon: 'fa-mortar-pestle' },
        { name: 'Guggulu', dosha: 'Vata/Kapha', dosage: '500mg tablet', vehicle: 'Warm Water', desc: 'Supports joint health and metabolism.', icon: 'fa-capsules' },
        { name: 'Dry Ginger', dosha: 'Vata/Kapha', dosage: '1g powder', vehicle: 'Warm Water', desc: 'Kindles digestive fire and reduces bloating.', icon: 'fa-pepper-hot' },
        { name: 'Nutmeg', dosha: 'Vata/Kapha', dosage: '250mg (Pinch)', vehicle: 'Warm Milk', desc: 'Promotes deep sleep and calms the mind.', icon: 'fa-circle' },
        { name: 'Haritaki', dosha: 'Vata/Tridoshic', dosage: '3g powder', vehicle: 'Warm Water', desc: 'Regulates bowel movements and detoxifies.', icon: 'fa-crown' },
        { name: 'Kapikacchu', dosha: 'Vata', dosage: '3g powder', vehicle: 'Warm Milk', desc: 'Supports neurological health and dopamine.', icon: 'fa-biohazard' },
        { name: 'Devadaru', dosha: 'Vata/Kapha', dosage: '2-3g powder', vehicle: 'Warm Water', desc: 'Woody herb for respiratory and joint comfort.', icon: 'fa-tree' },
        { name: 'Rasna', dosha: 'Vata', dosage: '30ml decoction', vehicle: 'Warm Water', desc: 'Excellent for sciatica and chronic pain.', icon: 'fa-bone' },
        { name: 'Ajamoda', dosha: 'Vata/Kapha', dosage: '1-2g powder', vehicle: 'Rock Salt & Water', desc: 'Relieves gas, cramps, and indigestion.', icon: 'fa-wind' }
    ];

    const pittaHerbs = [
        { name: 'Amalaki (Amla)', dosha: 'Pitta/Tridoshic', dosage: '1 tsp powder', vehicle: 'Water', desc: 'Highest vitamin C; cools internal heat.', icon: 'fa-lemon' },
        { name: 'Manjistha', dosha: 'Pitta/Kapha', dosage: '2g powder', vehicle: 'Lukewarm Water', desc: 'Premier blood purifier for clear skin.', icon: 'fa-tint' },
        { name: 'Anantmool', dosha: 'Pitta', dosage: '3g powder', vehicle: 'Cold Water', desc: 'Cooling herb for skin and blood.', icon: 'fa-snowflake' },
        { name: 'Mulethi', dosha: 'Pitta/Vata', dosage: '1-3g powder', vehicle: 'Honey or Ghee', desc: 'Soothes acidity and respiratory tract.', icon: 'fa-candy-cane' },
        { name: 'Shatavari', dosha: 'Pitta/Vata', dosage: '1 tsp powder', vehicle: 'Warm Milk', desc: 'Supports hormonal balance and cooling.', icon: 'fa-spa' },
        { name: 'Chandan', dosha: 'Pitta', dosage: '1g powder', vehicle: 'Water', desc: 'Calms inflammation and excessive thirst.', icon: 'fa-tree' },
        { name: 'Bhringraj', dosha: 'Pitta/Vata', dosage: '5ml juice', vehicle: 'Water', desc: 'Best for hair health and liver cooling.', icon: 'fa-leaf' },
        { name: 'Guduchi (Giloy)', dosha: 'Pitta/Tridoshic', dosage: '1 tsp powder', vehicle: 'Honey or Water', desc: 'Immune modulator and fever reducer.', icon: 'fa-shield-virus' },
        { name: 'Coriander', dosha: 'Pitta', dosage: '1 tsp soaked', vehicle: 'Overnight Water', desc: 'Reduces burning sensations and acidity.', icon: 'fa-seedling' },
        { name: 'Fennel', dosha: 'Pitta/Vata', dosage: '1 tsp seeds', vehicle: 'Chewed after meals', desc: 'Cooling digestive aid.', icon: 'fa-fan' },
        { name: 'Aloe Vera', dosha: 'Pitta', dosage: '15-20ml gel', vehicle: 'Empty Stomach', desc: 'Cleanses liver and soothes stomach.', icon: 'fa-apple-whole' },
        { name: 'Neem', dosha: 'Pitta/Kapha', dosage: '500mg extract', vehicle: 'Water', desc: 'Potent anti-bacterial and skin detox.', icon: 'fa-virus-slash' },
        { name: 'Gulkand', dosha: 'Pitta', dosage: '2 tsp', vehicle: 'Cool Milk', desc: 'Rose preserve to lower body heat.', icon: 'fa-burst' },
        { name: 'Bhumyamalaki', dosha: 'Pitta', dosage: '3g powder', vehicle: 'Water', desc: 'Specific herb for liver protection.', icon: 'fa-filter' },
        { name: 'Lotus (Kamala)', dosha: 'Pitta', dosage: '1-2g powder', vehicle: 'Water', desc: 'Heart tonic that calms the emotions.', icon: 'fa-sun' }
    ];

    const kaphaHerbs = [
        { name: 'Tulsi', dosha: 'Kapha/Vata', dosage: '1 tsp juice', vehicle: 'Honey', desc: 'Clears lungs and boosts immunity.', icon: 'fa-pagelines' },
        { name: 'Trikatu', dosha: 'Kapha', dosage: '500mg powder', vehicle: 'Honey', desc: 'Stimulates metabolism and fat burning.', icon: 'fa-fire' },
        { name: 'Pippali', dosha: 'Kapha/Vata', dosage: '500mg powder', vehicle: 'Honey', desc: 'Supports deep lung clearing.', icon: 'fa-wind' },
        { name: 'Bibhitaki', dosha: 'Kapha', dosage: '3g powder', vehicle: 'Warm Water', desc: 'Astringent herb for detox and eyes.', icon: 'fa-eye' },
        { name: 'Turmeric', dosha: 'Kapha/Pitta', dosage: '2g powder', vehicle: 'Warm Water/Food', desc: 'Powerful anti-inflammatory.', icon: 'fa-shield-halved' },
        { name: 'Chitrak', dosha: 'Kapha/Vata', dosage: '500mg powder', vehicle: 'Buttermilk', desc: 'Ignites strong digestive fire.', icon: 'fa-bolt' },
        { name: 'Vasaka', dosha: 'Kapha/Pitta', dosage: '10ml juice', vehicle: 'Honey', desc: 'Removes excess mucus from chest.', icon: 'fa-lungs' },
        { name: 'Vacha', dosha: 'Kapha/Vata', dosage: '125mg', vehicle: 'Honey', desc: 'Improves mental clarity and speech.', icon: 'fa-comment-dots' },
        { name: 'Kutki', dosha: 'Kapha/Pitta', dosage: '500mg powder', vehicle: 'Water', desc: 'Clears fat and bile from liver.', icon: 'fa-droplet-slash' },
        { name: 'Punarnava', dosha: 'Kapha/Vata', dosage: '3g powder', vehicle: 'Water', desc: 'Reduces water retention and swelling.', icon: 'fa-recycle' },
        { name: 'Cinnamon', dosha: 'Kapha/Vata', dosage: '1-2g powder', vehicle: 'Warm Water', desc: 'Balances blood sugar and warms body.', icon: 'fa-cookie' },
        { name: 'Black Pepper', dosha: 'Kapha', dosage: '250mg', vehicle: 'Honey', desc: 'Breaks down toxins and congestion.', icon: 'fa-pepper-hot' },
        { name: 'Musta', dosha: 'Kapha/Pitta', dosage: '3g powder', vehicle: 'Warm Water', desc: 'Digestive tonic for women.', icon: 'fa-venus' },
        { name: 'Pushkarmool', dosha: 'Kapha/Vata', dosage: '1g powder', vehicle: 'Honey', desc: 'Effective for allergic asthma/cough.', icon: 'fa-virus-covid' },
        { name: 'Vidanga', dosha: 'Kapha/Vata', dosage: '2g powder', vehicle: 'Warm Water', desc: 'Cleanses the gut of parasites.', icon: 'fa-bug' }
    ];

    return `
    <section class="page-section fade-in-up visible">
        <div class="page-header text-center">
            <span class="badge badge-green mb-3">Ancient Wisdom</span>
            <h1>Ayurvedic <span class="gradient-text">Herb Database</span></h1>
            <p class="text-muted mt-3">32+ herbs categorized by Dosha with dosage guidelines.</p>
        </div>

        <!-- Vata Herbs -->
        <h3 class="mt-6 mb-3" style="color:#06b6d4;"><i class="fa-solid fa-wind" aria-hidden="true"></i> Vata Balancing - Grounding & Warming</h3>
        <div class="grid-3">${renderHerbCards(vataHerbs, '#06b6d4')}</div>

        <!-- Pitta Herbs -->
        <h3 class="mt-6 mb-3" style="color:#ef4444;"><i class="fa-solid fa-fire" aria-hidden="true"></i> Pitta Balancing - Cooling & Calming</h3>
        <div class="grid-3">${renderHerbCards(pittaHerbs, '#ef4444')}</div>

        <!-- Kapha Herbs -->
        <h3 class="mt-6 mb-3" style="color:#10b981;"><i class="fa-solid fa-mountain" aria-hidden="true"></i> Kapha Balancing - Stimulating & Clearing</h3>
        <div class="grid-3">${renderHerbCards(kaphaHerbs, '#10b981')}</div>

        <!-- RECIPES SECTION -->
        <div class="text-center mt-6">
            <h2 style="font-weight:700;"><i class="fa-solid fa-bowl-food text-purple"></i> Ayurvedic <span class="gradient-text">Recipes</span></h2>
            <p class="text-muted mt-2">Dosha-specific healing recipes for daily nourishment.</p>
        </div>
        <div class="grid-3 mt-5">
            <article class="glass-card p-4 hover-lift" style="border-top:3px solid #06b6d4;">
                <span class="badge" style="background:#06b6d415;color:#06b6d4;">Vata Balancing</span>
                <h4 class="mt-3">🥛 Golden Milk (Haldi Doodh)</h4>
                <p class="text-muted small mt-2"><strong>Ingredients:</strong> 1 cup milk (or almond milk), 1/2 tsp turmeric, pinch of black pepper, 1/4 tsp cinnamon, 1 tsp maple syrup or honey.</p>
                <p class="text-muted small"><strong>Method:</strong> Simmer milk with spices for 5 mins. Add sweetener once warm (not boiling).</p>
            </article>
            <article class="glass-card p-4 hover-lift" style="border-top:3px solid #ef4444;">
                <span class="badge" style="background:#ef444415;color:#ef4444;">Pitta Balancing</span>
                <h4 class="mt-3">🍋 Amla Coolant Juice</h4>
                <p class="text-muted small mt-2"><strong>Ingredients:</strong> 2 fresh Amlas (seeded) or 1 tbsp Amla powder, 1 cup water, 5-6 mint leaves, pinch of rock salt.</p>
                <p class="text-muted small"><strong>Method:</strong> Blend ingredients and strain. Serve at room temperature to maintain digestive fire.</p>
            </article>
            <article class="glass-card p-4 hover-lift" style="border-top:3px solid #10b981;">
                <span class="badge" style="background:#10b98115;color:#10b981;">Kapha Balancing</span>
                <h4 class="mt-3">🫚 Ginger Honey Tea</h4>
                <p class="text-muted small mt-2"><strong>Ingredients:</strong> 1 inch fresh ginger (grated), 1.5 cups water, 1 tsp raw honey, 1 lemon wedge.</p>
                <p class="text-muted small"><strong>Method:</strong> Boil ginger in water for 10 mins. Strain, let cool slightly, then stir in honey and lemon.</p>
            </article>
        </div>
    </section>`;
}
const doshaColor = { 'Vata': '#06b6d4', 'Pitta': '#ef4444', 'Kapha': '#10b981' };

function renderHerbCards(herbs, color) {
    return herbs.map(h => `
        <article class="glass-card p-4 hover-lift" style="border-left:4px solid ${color};">
            <div class="d-flex align-items-center mb-3">
                <div class="stat-icon" style="background:${color}15;color:${color};"><i class="fa-solid ${h.icon}"></i></div>
                <div class="ms-3">
                    <h4 style="margin:0;font-size:1rem;">${h.name}</h4>
                    <span class="text-muted small">${h.dosha}</span>
                </div>
            </div>
            <p class="text-muted small mb-2">${h.desc}</p>
                <p style="font-size:0.8rem; margin-bottom: 2px;"><strong>Dosage:</strong> ${h.dosage}</p>
                <p style="font-size:0.8rem; color:${color};"><strong>Take with:</strong> ${h.vehicle}</p>
            </article>`).join('');
}

// --- YOGA PAGE ---
function renderYoga() {
    return `
    <section class="page-section fade-in-up visible">
        <div class="page-header text-center">
            <span class="badge badge-purple mb-3">Mind & Body</span>
            <h1>Yoga & <span class="gradient-text">Mudra</span></h1>
            <p class="text-muted mt-3">Guided practices tailored for your current state.</p>
        </div>
        <div class="glass-card p-5 mt-5 text-center">
            <i class="fa-solid fa-om mb-3" style="font-size:3rem; color:var(--primary);"></i>
            <h3>Today's Routine: Calming Flow</h3>
            <p class="text-muted mt-2 mb-4">A 15-minute sequence to reduce stress and ground your Vata dosha.</p>
            <button class="btn btn-primary btn-glow"><i class="fa-solid fa-play"></i> Start Practice</button>
        </div>
    </section>`;
}

// --- DOSHA QUIZ ---
const doshaQuestions = [
    {
        q: 'How would you describe your natural physical body frame and build?',
        opts: [
            { t: 'I have a thin, bony, or lanky build; I am either very tall or quite short and find it hard to gain weight.', d: 'V', i: 'fa-feather' },
            { t: 'I have a medium, athletic build with good muscle tone; it is easy for me to maintain my weight.', d: 'P', i: 'fa-bolt' },
            { t: 'I have a large, sturdy, or broad build; I gain weight easily and find it quite difficult to lose it.', d: 'K', i: 'fa-mountain' },
            { t: 'I have a very average, balanced build that does not lean toward being particularly thin or large.', d: 'B', i: 'fa-equals' }
        ]
    },
    {
        q: 'Which of these best describes the natural texture and feel of your skin?',
        opts: [
            { t: 'My skin is often dry, rough, or flaky and usually feels cool to the touch.', d: 'V', i: 'fa-wind' },
            { t: 'My skin is soft, warm, and somewhat oily; I am prone to redness or freckles.', d: 'P', i: 'fa-sun' },
            { t: 'My skin is thick, smooth, and moist; it feels cool and stays very soft.', d: 'K', i: 'fa-tint' },
            { t: 'My skin is a combination of textures and generally stays balanced.', d: 'B', i: 'fa-check-circle' }
        ]
    },
    {
        q: 'How does your appetite and digestion typically behave on a daily basis?',
        opts: [
            { t: 'My appetite is irregular; I often forget to eat or feel bloated and gassy.', d: 'V', i: 'fa-utensils' },
            { t: 'I have a very strong appetite; I get very irritable if a meal is delayed.', d: 'P', i: 'fa-fire' },
            { t: 'I have a steady but slow appetite; I feel heavy after eating or can skip meals.', d: 'K', i: 'fa-clock' },
            { t: 'I have a very consistent appetite and my digestion works perfectly fine.', d: 'B', i: 'fa-thumbs-up' }
        ]
    },
    {
        q: 'What is your natural style of speech and how do you communicate?',
        opts: [
            { t: 'I speak very quickly and often wander off-topic because my mind moves fast.', d: 'V', i: 'fa-comments' },
            { t: 'I speak clearly and sharply; I am direct and try to convince others.', d: 'P', i: 'fa-bullseye' },
            { t: 'I speak slowly and calmly in a pleasant tone; I don’t like to rush.', d: 'K', i: 'fa-music' },
            { t: 'I speak at a moderate pace and vary my style depending on the situation.', d: 'B', i: 'fa-volume-up' }
        ]
    },
    {
        q: 'How would you describe your typical sleep pattern and quality of rest?',
        opts: [
            { t: 'I am a light sleeper; I wake up at noises and struggle with racing thoughts.', d: 'V', i: 'fa-moon' },
            { t: 'I am a moderate sleeper; I sleep soundly for 6-7 hours and feel energetic.', d: 'P', i: 'fa-bed' },
            { t: 'I am a very deep sleeper; I hate being woken up and often feel groggy.', d: 'K', i: 'fa-cloud' },
            { t: 'I sleep a standard 7-8 hours and generally wake up feeling refreshed.', d: 'B', i: 'fa-battery-full' }
        ]
    },
    {
        q: 'How do you typically react when you are placed under a lot of stress?',
        opts: [
            { t: 'I immediately start to feel anxious, worried, or fearful.', d: 'V', i: 'fa-exclamation-triangle' },
            { t: 'I become impatient, frustrated, or angry with the situation.', d: 'P', i: 'fa-angry' },
            { t: 'I tend to remain very calm and may become quiet or stubborn.', d: 'K', i: 'fa-anchor' },
            { t: 'I stay level-headed and try to process the stress logically.', d: 'B', i: 'fa-brain' }
        ]
    },
    {
        q: 'When learning something new, how does your memory and focus work?',
        opts: [
            { t: 'I grasp new ideas fast, but I also tend to forget them just as quickly.', d: 'V', i: 'fa-bolt' },
            { t: 'I learn quickly and have a very sharp, organized memory for details.', d: 'P', i: 'fa-lightbulb' },
            { t: 'I take a long time to understand, but once I do, I remember forever.', d: 'K', i: 'fa-database' },
            { t: 'I have an average learning speed and a reliable memory.', d: 'B', i: 'fa-book' }
        ]
    },
    {
        q: 'How does your body usually respond to different weather and climates?',
        opts: [
            { t: 'I love warm weather because I feel cold easily and dislike wind.', d: 'V', i: 'fa-thermometer-three-quarters' },
            { t: 'I prefer cool environments because I overheat quickly and find heat draining.', d: 'P', i: 'fa-snowflake' },
            { t: 'I feel best in warm, dry climates because damp weather makes me feel heavy.', d: 'K', i: 'fa-sun' },
            { t: 'I am generally comfortable in almost any weather condition.', d: 'B', i: 'fa-globe' }
        ]
    },
    {
        q: 'What is your typical energy level and physical stamina like?',
        opts: [
            { t: 'My energy comes in short bursts; I start excited but tire out quickly.', d: 'V', i: 'fa-battery-quarter' },
            { t: 'I have a moderate, steady energy level and a strong drive to push myself.', d: 'P', i: 'fa-running' },
            { t: 'I have very high, long-lasting stamina once I get moving.', d: 'K', i: 'fa-infinite' },
            { t: 'My energy is fairly consistent throughout the day without major peaks.', d: 'B', i: 'fa-chart-line' }
        ]
    },
    {
        q: 'How would you describe the natural texture and appearance of your hair?',
        opts: [
            { t: 'My hair is naturally dry, thin, and prone to becoming frizzy or tangled.', d: 'V', i: 'fa-broom' },
            { t: 'My hair is fine, soft, and straight; it might turn grey earlier than most.', d: 'P', i: 'fa-cut' },
            { t: 'I have very thick, strong, and oily hair that looks shiny and healthy.', d: 'K', i: 'fa-spa' },
            { t: 'My hair is of medium thickness and texture and is easy to manage.', d: 'B', i: 'fa-user' }
        ]
    },
    {
        q: 'How do you generally handle your personal finances and spending habits?',
        opts: [
            { t: 'I tend to spend money impulsively and find it hard to save consistently.', d: 'V', i: 'fa-shopping-cart' },
            { t: 'I spend on quality items but I am very organized with my budget.', d: 'P', i: 'fa-credit-card' },
            { t: 'I am very good at saving and prefer to accumulate wealth.', d: 'K', i: 'fa-piggy-bank' },
            { t: 'I buy what I need and save a little when I can.', d: 'B', i: 'fa-wallet' }
        ]
    },
    {
        q: 'Which of these best describes your typical walking pace?',
        opts: [
            { t: 'I walk very quickly and often seem to be in a rush.', d: 'V', i: 'fa-tachometer-alt' },
            { t: 'I walk with a purposeful, steady, and determined stride.', d: 'P', i: 'fa-shoe-prints' },
            { t: 'I walk slowly and gracefully, taking my time to enjoy the pace.', d: 'K', i: 'fa-walking' },
            { t: 'I walk at a standard, moderate speed that doesn\'t stand out.', d: 'B', i: 'fa-street-view' }
        ]
    },
    {
        q: 'How would you describe your joints and physical flexibility?',
        opts: [
            { t: 'My joints are small and sometimes "crack"; I am not naturally flexible.', d: 'V', i: 'fa-link' },
            { t: 'My joints are medium-sized and quite flexible; athletic range of motion.', d: 'P', i: 'fa-child' },
            { t: 'My joints are large and well-padded; I am sturdy but move heavily.', d: 'K', i: 'fa-square' },
            { t: 'My joints and flexibility are completely normal.', d: 'B', i: 'fa-circle' }
        ]
    },
    {
        q: 'How do you usually make important decisions in your life?',
        opts: [
            { t: 'I am often hesitant and change my mind many times.', d: 'V', i: 'fa-question-circle' },
            { t: 'I am very logical and decisive; once I choose, I stick to it.', d: 'P', i: 'fa-check' },
            { t: 'I take a long time to decide because I like to move slowly.', d: 'K', i: 'fa-hourglass-half' },
            { t: 'I make decisions at a reasonable pace, weighing pros and cons.', d: 'B', i: 'fa-balance-scale' }
        ]
    },
    {
        q: 'How much do you typically perspire (sweat) during activity or heat?',
        opts: [
            { t: 'I rarely sweat, even in heat, and my skin remains quite dry.', d: 'V', i: 'fa-tint-slash' },
            { t: 'I sweat quite a lot and very easily; it often has a strong odor.', d: 'P', i: 'fa-water' },
            { t: 'I sweat a moderate amount and it usually has a mild scent.', d: 'K', i: 'fa-smile' },
            { t: 'I sweat a normal amount only when working out or very hot.', d: 'B', i: 'fa-user-check' }
        ]
    },
    {
        q: 'How would you describe the appearance and sensation of your eyes?',
        opts: [
            { t: 'My eyes are small, feel dry often, and are very active or darting.', d: 'V', i: 'fa-eye-slash' },
            { t: 'My eyes are medium-sized and sharp; sensitive to bright light.', d: 'P', i: 'fa-eye' },
            { t: 'My eyes are large, beautiful, and moist with thick eyelashes.', d: 'K', i: 'fa-heart' },
            { t: 'My eyes are average in size and don’t feel particularly sensitive.', d: 'B', i: 'fa-eye' }
        ]
    },
    {
        q: 'What kind of dreams do you typically have when you sleep?',
        opts: [
            { t: 'I often have vivid, fearful dreams involving flying or running.', d: 'V', i: 'fa-cloud-meatball' },
            { t: 'I have intense dreams involving colors, fire, or problem-solving.', d: 'P', i: 'fa-fire-alt' },
            { t: 'I have calm, pleasant dreams involving water or landscapes.', d: 'K', i: 'fa-image' },
            { t: 'I don’t remember my dreams often, or they seem like everyday events.', d: 'B', i: 'fa-ghost' }
        ]
    },
    {
        q: 'How do your emotions typically manifest in your daily life?',
        opts: [
            { t: 'My emotions change quickly; I go from excited to worried fast.', d: 'V', i: 'fa-wind' },
            { t: 'I am passionate and driven, but can be quite irritable.', d: 'P', i: 'fa-frown' },
            { t: 'I am very steady, loyal, and calm; it takes a lot to upset me.', d: 'K', i: 'fa-smile-beam' },
            { t: 'My moods are generally stable without many extreme highs or lows.', d: 'B', i: 'fa-meh' }
        ]
    },
    {
        q: 'How would you describe your physical pulse or heartbeat at rest?',
        opts: [
            { t: 'My pulse feels fast, thin, and sometimes irregular—like a thread.', d: 'V', i: 'fa-heartbeat' },
            { t: 'My pulse feels strong, steady, and moderate—like a rhythmic thump.', d: 'P', i: 'fa-heart' },
            { t: 'My pulse feels slow, soft, and very consistent—like a wave.', d: 'K', i: 'fa-wave-square' },
            { t: 'My pulse is very standard and falls right in the middle range.', d: 'B', i: 'fa-check' }
        ]
    },
    {
        q: 'What is your general approach to daily routines and habits?',
        opts: [
            { t: 'I struggle to keep a routine; I like variety and change every day.', d: 'V', i: 'fa-random' },
            { t: 'I love an organized schedule and I am very disciplined about it.', d: 'P', i: 'fa-calendar-alt' },
            { t: 'I enjoy a slow, relaxed routine and I am resistant to big changes.', d: 'K', i: 'fa-coffee' },
            { t: 'I have a basic routine that I follow, but I don’t mind changing it.', d: 'B', i: 'fa-sync' }
        ]
    }
];

const doshaResults = {
    V: {
        name: 'Vata', color: '#06b6d4', icon: 'fa-wind', emoji: '🌪️',
        element: 'The Air Element', focus: 'Grounding, Warmth, and Stability',
        desc: 'You are creative, energetic, and quick-thinking. Vata types benefit from warm, grounding foods and calming activities like meditation.',
        tips: ['Eat warm, cooked foods', 'Maintain a regular routine', 'Practice grounding yoga (Tadasana, Vrikshasana)', 'Use Ashwagandha and sesame oil'],
        dos: [
            { title: 'Routine', desc: 'Eat, sleep, and wake at the same time every day to stabilize your energy.' },
            { title: 'Moisture', desc: 'Perform a 5-minute self-massage with warm sesame oil before your shower.' }
        ],
        donts: [
            { title: 'Cold Stimuli', desc: 'Avoid ice-cold drinks, frozen foods, and cold drafts.' },
            { title: 'Dryness', desc: 'Avoid "crunchy" dry snacks like popcorn, crackers, and raw salads.' }
        ]
    },
    P: {
        name: 'Pitta', color: '#ef4444', icon: 'fa-fire', emoji: '🔥',
        element: 'The Fire Element', focus: 'Cooling, Calm, and Moderation',
        desc: 'You are ambitious, intelligent, and focused. Pitta types benefit from cooling foods and activities that promote balance and patience.',
        tips: ['Eat cooling foods (cucumber, mint)', 'Avoid excessive heat and spicy food', 'Practice calming pranayama', 'Use Brahmi and Amla supplements'],
        dos: [
            { title: 'Cool Down', desc: 'Exercise in the early morning or evening; try swimming or moonlit walks.' },
            { title: 'Patience', desc: 'Practice mindfulness or meditation to release internal heat and frustration.' }
        ],
        donts: [
            { title: 'Heating Agents', desc: 'Avoid spicy chilies, hot peppers, and excessive garlic/onions.' },
            { title: 'Fermented Items', desc: 'Avoid vinegar, pickles, alcohol, and fermented soy.' }
        ]
    },
    K: {
        name: 'Kapha', color: '#10b981', icon: 'fa-mountain', emoji: '🌿',
        element: 'The Earth Element', focus: 'Stimulation, Lightness, and Movement',
        desc: 'You are strong, loyal, and nurturing. Kapha types benefit from stimulating activities, lighter foods, and invigorating exercise.',
        tips: ['Eat light, warm, spicy foods', 'Exercise vigorously and regularly', 'Avoid daytime napping', 'Use Triphala and Tulsi tea'],
        dos: [
            { title: 'Early Rise', desc: 'Wake up before 6:00 AM to prevent grogginess and morning congestion.' },
            { title: 'Activity', desc: 'Engage in vigorous exercise daily that makes you break a sweat.' }
        ],
        donts: [
            { title: 'Heaviness', desc: 'Avoid heavy dairy products like cheese, cold milk, and ice cream.' },
            { title: 'Stagnation', desc: 'Avoid daytime napping and sitting for long periods without movement.' }
        ]
    },
    B: {
        name: 'Tridoshic', color: '#8b5cf6', icon: 'fa-yin-yang', emoji: '⚖️',
        element: 'All Elements in Harmony', focus: 'Maintaining Natural Balance',
        desc: 'You have a rare and balanced constitution where all three Doshas exist in near-equal proportion.',
        tips: ['Eat a varied, seasonal diet', 'Balance activity with rest'],
        dos: [
            { title: 'Seasonal Eating', desc: 'Adjust your diet with the seasons.' }
        ],
        donts: [
            { title: 'Extremes', desc: 'Avoid extreme diets, excessive fasting, or overexercising.' }
        ]
    }
};

function renderQuiz() {
    return `
    <section class="page-section fade-in-up visible" aria-labelledby="quiz-title">
        <div class="page-header text-center"><span class="badge badge-purple mb-3">Discover Yourself</span><h1 id="quiz-title">Dosha <span class="gradient-text">Quiz</span></h1><p class="text-muted mt-3">Answer ${doshaQuestions.length} simple questions to discover your Ayurvedic body type.</p></div>
        <div class="quiz-container glass-card p-5 mt-6" id="quiz-container" role="form" aria-label="Dosha quiz">
            <div id="quiz-content"></div>
            <div class="quiz-progress mt-4"><div class="progress-bar" style="background:var(--border-color);height:8px;border-radius:4px;"><div class="progress gradient-bg-2" id="quiz-progress" style="width:0%;height:100%;border-radius:4px;transition:width 0.3s ease;"></div></div><p class="text-muted small mt-2" id="quiz-step">Question 1 of ${doshaQuestions.length}</p></div>
        </div>
    </section>`;
}

let quizState = { currentIdx: 0, answers: [] };

function initQuiz() {
    quizState = { currentIdx: 0, answers: [] };
    showQuestion(0);
}

function showQuestion(idx) {
    quizState.currentIdx = idx;
    const q = doshaQuestions[idx];
    const container = document.getElementById('quiz-content');
    if (!container) return;
    container.innerHTML = `
        <h3 class="mb-4">${q.q}</h3>
        <div class="quiz-options">${q.opts.filter((o) => o.d !== 'B').map((o, i) => `
            <button class="glass-card quiz-option p-4 hover-lift w-100 mb-3" onclick="answerQuiz('${o.d}', ${idx})" tabindex="0" aria-label="Option: ${o.t}" style="display:flex; align-items:center; text-align:left; background:transparent; border:1px solid var(--border-color); cursor:pointer;">
                <div class="stat-icon me-3" style="min-width:40px; height:40px; font-size:1.1rem; background:var(--bg-surface); display:flex; align-items:center; justify-content:center; border-radius:50%;"><i class="fa-solid ${o.i || 'fa-check'}" aria-hidden="true" style="color:var(--text-muted);"></i></div>
                <span style="flex-grow:1; font-weight:500;">${o.t}</span>
                <i class="fa-solid fa-arrow-right text-muted" aria-hidden="true"></i>
            </button>`).join('')}
        </div>`;
    document.getElementById('quiz-progress').style.width = ((idx / doshaQuestions.length) * 100) + '%';
    document.getElementById('quiz-step').textContent = `Question ${idx + 1} of ${doshaQuestions.length}`;
}

function answerQuiz(dosha, idx) {
    quizState.answers.push(dosha);
    if (idx + 1 < doshaQuestions.length) {
        showQuestion(idx + 1);
    } else {
        showQuizResult();
    }
}

function showQuizResult() {
    const counts = { V: 0, P: 0, K: 0 };
    quizState.answers.forEach(a => counts[a]++);
    const winner = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    const r = doshaResults[winner] || doshaResults.K;

    try {
        const p = loadProfile();
        p.dosha = r.name;
        saveProfileData(p);
        if (typeof showToast === 'function') showToast(`Body Type Saved: ${r.name}`, 'success');
    } catch (e) { }

    document.getElementById('quiz-progress').style.width = '100%';
    document.getElementById('quiz-step').textContent = 'Quiz Complete!';
    document.getElementById('quiz-content').innerHTML = `
        <div class="text-center">
            <div class="stat-icon mx-auto mb-4" style="width:80px;height:80px;border-radius:50%;background:${r.color}20;color:${r.color};font-size:2rem;display:flex;align-items:center;justify-content:center;">
                <i class="fa-solid ${r.icon}" aria-hidden="true"></i>
            </div>
            <h2>${r.emoji} You are <span style="color:${r.color}">${r.name}</span> Dominant!</h2>
            <p class="text-muted small mb-1">${r.element} &bull; Focus: ${r.focus}</p>
            <p class="text-muted mt-3 mb-4">${r.desc}</p>
            <div style="text-align:left" class="mt-4">
                <h4 class="mb-3"><i class="fa-solid fa-lightbulb text-purple" aria-hidden="true"></i> Personalized Tips</h4>
                <ul class="profile-list">${r.tips.map(t => `<li style="display:flex;align-items:center;margin-bottom:10px;gap:10px"><i class="fa-solid fa-check text-green" aria-hidden="true"></i> ${t}</li>`).join('')}</ul>
            </div>
            <!-- Daily Habits (To Do) -->
            <div style="text-align:left" class="mt-5">
                <h4 class="mb-3" style="color:#10b981;"><i class="fa-solid fa-circle-check" style="color:#10b981;" aria-hidden="true"></i> Daily Habits (To Do)</h4>
                <ul class="profile-list">${r.dos.map(d => `<li style="display:flex;align-items:flex-start;margin-bottom:10px;gap:10px"><i class="fa-solid fa-check" style="color:#10b981;margin-top:4px;" aria-hidden="true"></i> <div><strong>${d.title}:</strong> ${d.desc}</div></li>`).join('')}</ul>
            </div>
            <!-- Red Flags (To Avoid) -->
            <div style="text-align:left" class="mt-5">
                <h4 class="mb-3" style="color:#ef4444;"><i class="fa-solid fa-triangle-exclamation" style="color:#ef4444;" aria-hidden="true"></i> Red Flags (To Avoid)</h4>
                <ul class="profile-list">${r.donts.map(d => `<li style="display:flex;align-items:flex-start;margin-bottom:10px;gap:10px"><i class="fa-solid fa-xmark" style="color:#ef4444;margin-top:4px;" aria-hidden="true"></i> <div><strong>${d.title}:</strong> ${d.desc}</div></li>`).join('')}</ul>
            </div>
            <button class="btn btn-primary btn-glow mt-6" onclick="initQuiz()"><i class="fa-solid fa-rotate" aria-hidden="true"></i> Retake Quiz</button>
        </div>`;
}

// --- COMMUNITY PAGE (Honest Empty State) ---
function renderCommunity() {
    const topics = [
        { name: 'Yoga & Meditation', icon: 'fa-om', color: '#8b5cf6', desc: 'Share your practice, ask for pose guidance, and find accountability partners.' },
        { name: 'Ayurvedic Cooking', icon: 'fa-bowl-food', color: '#10b981', desc: 'Exchange Dosha-friendly recipes, meal prep ideas, and seasonal diet tips.' },
        { name: 'Mental Wellness', icon: 'fa-brain', color: '#06b6d4', desc: 'A safe space for stress management, mindfulness tips, and emotional support.' },
        { name: 'Fitness Goals', icon: 'fa-dumbbell', color: '#ef4444', desc: 'Track workout streaks, share routines, and motivate each other.' },
        { name: 'Sleep & Recovery', icon: 'fa-moon', color: '#6366f1', desc: 'Discuss sleep hygiene, dream journaling, and recovery techniques.' },
        { name: 'Herbal Remedies', icon: 'fa-seedling', color: '#f59e0b', desc: 'Share experiences with Ashwagandha, Triphala, Tulsi, and other herbs.' }
    ];
    return `
    <section class="page-section fade-in-up visible">
        <div class="page-header text-center">
            <span class="badge badge-purple mb-3">Connect & Grow</span>
            <h1>Aura <span class="gradient-text">Community</span></h1>
            <p class="text-muted mt-3">A supportive space for holistic wellness — built by the community, for the community.</p>
        </div>

        <!-- Honest Empty State -->
        <div class="glass-card p-5 mt-5 text-center">
            <div style="font-size:4rem; margin-bottom:16px;">🌱</div>
            <h3>Be the First to Join!</h3>
            <p class="text-muted mt-2 mb-3">Our community is brand new and growing. No pre-filled posts — just real conversations from real users like you.</p>
            <p class="text-muted small">Once we launch discussions, you will be able to share tips, ask questions, and connect with wellness enthusiasts worldwide.</p>
        </div>

        <!-- Upcoming Topic Categories -->
        <h3 class="mt-6 mb-3"><i class="fa-solid fa-compass text-purple" aria-hidden="true"></i> Planned Discussion Topics</h3>
        <div class="grid-3">
            ${topics.map(t => `
            <article class="glass-card p-4 hover-lift" style="border-left:4px solid ${t.color};">
                <div class="d-flex align-items-center mb-3">
                    <div class="stat-icon" style="background:${t.color}15;color:${t.color};"><i class="fa-solid ${t.icon}" aria-hidden="true"></i></div>
                    <h4 class="ms-3" style="margin:0">${t.name}</h4>
                </div>
                <p class="text-muted small">${t.desc}</p>
                <span class="badge" style="background:${t.color}15;color:${t.color};margin-top:12px;">Coming Soon</span>
            </article>`).join('')}
        </div>
    </section>`;
}

// --- EXERCISE PAGE ---
function renderExercise() {
    const workouts = [
        // Vata
        { name: 'Gentle Yoga Flow', dosha: 'Vata', icon: 'fa-spa', color: '#06b6d4', duration: '20 min', intensity: 'Low', desc: 'Slow, grounding poses to calm the nervous system and reduce anxiety.' },
        { name: 'Tai Chi Basics', dosha: 'Vata', icon: 'fa-yin-yang', color: '#06b6d4', duration: '25 min', intensity: 'Low', desc: 'Flowing movements that promote balance, coordination, and inner peace.' },
        { name: 'Walking Meditation', dosha: 'Vata', icon: 'fa-person-walking', color: '#06b6d4', duration: '15 min', intensity: 'Low', desc: 'A mindful walk to ground scattered energy and connect with the earth.' },
        // Pitta
        { name: 'Swimming Laps', dosha: 'Pitta', icon: 'fa-person-swimming', color: '#ef4444', duration: '30 min', intensity: 'Medium', desc: 'Cooling cardio that channels competitive energy without overheating.' },
        { name: 'Moonlit Jog', dosha: 'Pitta', icon: 'fa-moon', color: '#ef4444', duration: '25 min', intensity: 'Medium', desc: 'Evening run to release tension without the intensity of midday heat.' },
        { name: 'Cycling', dosha: 'Pitta', icon: 'fa-bicycle', color: '#ef4444', duration: '35 min', intensity: 'Medium', desc: 'Steady-paced cycling to burn energy while enjoying the breeze.' },
        // Kapha
        { name: 'HIIT Circuit', dosha: 'Kapha', icon: 'fa-fire', color: '#10b981', duration: '20 min', intensity: 'High', desc: 'High-intensity intervals to break through lethargy and ignite metabolism.' },
        { name: 'Power Yoga', dosha: 'Kapha', icon: 'fa-bolt', color: '#10b981', duration: '30 min', intensity: 'High', desc: 'Dynamic, fast-paced yoga to build heat, strength, and mental sharpness.' },
        { name: 'Jump Rope', dosha: 'Kapha', icon: 'fa-arrows-up-down', color: '#10b981', duration: '15 min', intensity: 'High', desc: 'Quick cardio burst that stimulates circulation and lymphatic flow.' }
    ];

    const gymRoutine = [
        { day: 'Monday', focus: 'Push Strength', icon: 'fa-dumbbell', color: '#ef4444', details: 'Bench press, shoulder press, chest flyes, and triceps extensions.' },
        { day: 'Tuesday', focus: 'Pull Strength', icon: 'fa-hand-fist', color: '#06b6d4', details: 'Lat pulldowns, seated rows, face pulls, and biceps curls.' },
        { day: 'Wednesday', focus: 'Leg Day', icon: 'fa-person-walking', color: '#10b981', details: 'Squats, leg press, lunges, hamstring curls, and calf raises.' },
        { day: 'Thursday', focus: 'Cardio + Core', icon: 'fa-heart-pulse', color: '#8b5cf6', details: 'Treadmill intervals, cycling, planks, Russian twists, and leg raises.' },
        { day: 'Friday', focus: 'Upper Body Volume', icon: 'fa-fire', color: '#f59e0b', details: 'Incline presses, cable rows, lateral raises, and arm finishers.' },
        { day: 'Saturday', focus: 'Mobility & Recovery', icon: 'fa-spa', color: '#14b8a6', details: 'Stretching, foam rolling, light walking, and breathwork.' }
    ];

    const gymWorkouts = [
        { name: 'Beginner Full Body', goal: 'Build a base', icon: 'fa-layer-group', color: '#06b6d4', moves: ['Goblet squat', 'Machine chest press', 'Lat pulldown', 'Plank hold'], note: '3 sets of 10-12 reps with light to moderate weight.' },
        { name: 'Fat Loss Circuit', goal: 'Burn calories', icon: 'fa-fire-flame-curved', color: '#ef4444', moves: ['Kettlebell swings', 'Battle ropes', 'Rowing machine', 'Mountain climbers'], note: '40 seconds work, 20 seconds rest, repeat for 4 rounds.' },
        { name: 'Muscle Gain Split', goal: 'Build muscle', icon: 'fa-bolt', color: '#10b981', moves: ['Barbell squat', 'Deadlift', 'Incline dumbbell press', 'Seated row'], note: '4 sets of 6-8 reps with progressive overload.' },
        { name: 'Strength & Conditioning', goal: 'Get stronger', icon: 'fa-weight-hanging', color: '#8b5cf6', moves: ['Trap bar deadlift', 'Push press', 'Pull-ups', 'Farmer carries'], note: 'Focus on heavy compound lifts and full rest between sets.' },
        { name: 'Core + Stability', goal: 'Improve balance', icon: 'fa-circle-dot', color: '#f97316', moves: ['Dead bug', 'Pallof press', 'Side plank', 'Cable chop'], note: 'Use slow controlled tempo and strict form.' },
        { name: 'Active Recovery', goal: 'Reduce soreness', icon: 'fa-water', color: '#14b8a6', moves: ['Incline walk', 'Bike ride', 'Dynamic stretch', 'Mobility flow'], note: 'Keep intensity low and move continuously for 20-30 minutes.' }
    ];

    const wisdom = [
        { title: 'Exercise by Dosha', icon: 'fa-dna', desc: 'Vata needs gentle movement, Pitta needs cooling sports, Kapha needs vigorous sweat-inducing activity.' },
        { title: 'Best Time to Exercise', icon: 'fa-clock', desc: 'Kapha hours (6-10 AM) are ideal. Avoid intense exercise during Pitta hours (10 AM - 2 PM).' },
        { title: 'Post-Workout Recovery', icon: 'fa-heart-pulse', desc: 'Apply warm sesame oil (Vata), coconut oil (Pitta), or dry brush massage (Kapha) after exercise.' },
        { title: 'Breath & Movement', icon: 'fa-wind', desc: 'Coordinate pranayama with exercise. Inhale during expansion, exhale during contraction for maximum benefit.' }
    ];

    return `
    <section class="page-section fade-in-up visible">
        <div class="page-header text-center">
            <span class="badge badge-green mb-3">Move & Thrive</span>
            <h1>Dosha-Personalized <span class="gradient-text">Exercise</span></h1>
            <p class="text-muted mt-3">Workouts tailored to your Ayurvedic body type for optimal results.</p>
        </div>

        <!-- Dosha Filter Tags -->
        <div class="d-flex gap-2 mt-5" style="flex-wrap:wrap;justify-content:center;">
            <span class="badge" style="background:#06b6d415;color:#06b6d4;font-size:0.9rem;padding:8px 16px;">🌪️ Vata — Gentle & Grounding</span>
            <span class="badge" style="background:#ef444415;color:#ef4444;font-size:0.9rem;padding:8px 16px;">🔥 Pitta — Cool & Moderate</span>
            <span class="badge" style="background:#10b98115;color:#10b981;font-size:0.9rem;padding:8px 16px;">🌿 Kapha — Vigorous & Stimulating</span>
        </div>

        <div class="grid-3 mt-5">
            ${workouts.map(w => `
            <article class="glass-card p-4 hover-lift" style="border-top:3px solid ${w.color};">
                <div class="d-flex align-items-center mb-3">
                    <div class="stat-icon" style="background:${w.color}15;color:${w.color};"><i class="fa-solid ${w.icon}" aria-hidden="true"></i></div>
                    <div class="ms-3">
                        <h4 style="margin:0">${w.name}</h4>
                        <span class="text-muted small">${w.dosha} · ${w.duration} · ${w.intensity}</span>
                    </div>
                </div>
                <p class="text-muted small">${w.desc}</p>
            </article>`).join('')}
        </div>

        <!-- Gym Routine -->
        <div class="text-center mt-6">
            <h2 style="font-weight:700;"><i class="fa-solid fa-dumbbell text-purple" aria-hidden="true"></i> Gym <span class="gradient-text">Routine</span></h2>
            <p class="text-muted mt-2">A simple weekly structure you can follow in the gym.</p>
        </div>
        <div class="grid-3 mt-5">
            ${gymRoutine.map(day => `
            <article class="glass-card p-4 hover-lift" style="border-left:4px solid ${day.color};">
                <div class="d-flex align-items-center mb-3">
                    <div class="stat-icon" style="background:${day.color}15;color:${day.color};"><i class="fa-solid ${day.icon}" aria-hidden="true"></i></div>
                    <div class="ms-3">
                        <h4 style="margin:0">${day.day}</h4>
                        <span class="text-muted small">${day.focus}</span>
                    </div>
                </div>
                <p class="text-muted small mb-0">${day.details}</p>
            </article>`).join('')}
        </div>

        <!-- Gym Workouts -->
        <div class="text-center mt-6">
            <h2 style="font-weight:700;"><i class="fa-solid fa-clipboard-list text-purple" aria-hidden="true"></i> Gym <span class="gradient-text">Workouts</span></h2>
            <p class="text-muted mt-2">Pick a workout based on your goal, then adjust weights and volume to match your level.</p>
        </div>
        <div class="grid-3 mt-5">
            ${gymWorkouts.map(workout => `
            <article class="glass-card p-4 hover-lift" style="border-top:3px solid ${workout.color};">
                <div class="d-flex align-items-center mb-3">
                    <div class="stat-icon" style="background:${workout.color}15;color:${workout.color};"><i class="fa-solid ${workout.icon}" aria-hidden="true"></i></div>
                    <div class="ms-3">
                        <h4 style="margin:0">${workout.name}</h4>
                        <span class="text-muted small">${workout.goal}</span>
                    </div>
                </div>
                <ul class="profile-list" style="margin-bottom:12px;">
                    ${workout.moves.map(move => `<li style="display:flex;align-items:center;margin-bottom:8px;gap:10px;"><i class="fa-solid fa-check" style="color:${workout.color};" aria-hidden="true"></i> ${move}</li>`).join('')}
                </ul>
                <p class="text-muted small mb-0">${workout.note}</p>
            </article>`).join('')}
        </div>

        <!-- Ayurvedic Fitness Wisdom -->
        <h3 class="mt-6 mb-3"><i class="fa-solid fa-book-open text-purple" aria-hidden="true"></i> Ayurvedic Fitness Wisdom</h3>
        <div class="grid-2">
            ${wisdom.map(w => `
            <article class="glass-card p-4">
                <div class="d-flex align-items-center mb-3">
                    <div class="stat-icon" style="background:rgba(109,40,217,0.1);color:#6d28d9;"><i class="fa-solid ${w.icon}" aria-hidden="true"></i></div>
                    <h4 class="ms-3" style="margin:0">${w.title}</h4>
                </div>
                <p class="text-muted small">${w.desc}</p>
            </article>`).join('')}
        </div>
    </section>`;
}

// --- PROFILE PAGE (Full Medical History) ---
function renderProfile() {
    const p = loadProfile();
    let authUser = null;
    try {
        if (typeof firebase !== 'undefined' && firebase.auth && firebase.app()) {
            authUser = firebase.auth().currentUser;
        }
    } catch (e) {
        // Firebase not initialized, proceed without auth
        authUser = null;
    }
    const authButtonText = authUser ? 'Sign Out' : 'Sign In with Google';
    const authButtonHandler = authUser ? 'handleSignOut()' : 'googleSignIn()';
    const conditions = [
        'Diabetes (Type 1)', 'Diabetes (Type 2)', 'Hypertension (High BP)', 'Hypotension (Low BP)',
        'Heart Disease', 'Thyroid (Hypo)', 'Thyroid (Hyper)', 'PCOD / PCOS',
        'Asthma', 'Arthritis', 'Migraine', 'Anemia',
        'Cholesterol (High)', 'Kidney Issues', 'Liver Issues', 'Depression / Anxiety'
    ];

    return `
    <section class="page-section fade-in-up visible">
        <div class="page-header text-center">
            <span class="badge badge-cyan mb-3">Your Health Profile</span>
            <h1>Medical <span class="gradient-text">History</span></h1>
            <p class="text-muted mt-3">Securely store your health data to personalize AI insights and Dosha recommendations.</p>
        </div>

        <form class="glass-card p-5 mt-5" onsubmit="saveFullProfile(event)" style="max-width:700px;margin:2rem auto;">

            <!-- Basic Info -->
            <h4 class="mb-3"><i class="fa-solid fa-user text-purple" aria-hidden="true"></i> Basic Information</h4>

            <!-- Photo Identity -->
            <div class="form-group mb-4" style="text-align: center;">
                <label for="prof-photo" style="display: block; margin-bottom: 15px;">Photo Identity</label>
                <div style="position: relative; display: inline-block;">
                    <img id="prof-photo-preview" src="${p.photo || 'https://via.placeholder.com/120'}" alt="Profile Preview" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary); background: var(--bg-surface);">
                    <label for="prof-photo" class="badge badge-purple" style="position: absolute; bottom: 0; right: -10px; cursor: pointer; padding: 6px 10px; border: 2px solid var(--bg-main);">
                        <i class="fa-solid fa-camera"></i>
                    </label>
                </div>
                <input type="file" id="prof-photo" accept="image/*" style="display: none;" onchange="handlePhotoUpload(event)">
                <small class="text-muted d-block mt-2">Upload your profile picture (saved locally)</small>
            </div>

            <div class="form-row mb-3">
                <div class="form-group w-50 pe-2">
                    <label for="prof-name">Full Name</label>
                    <input type="text" id="prof-name" class="form-control glass-input" placeholder="Enter your name" value="${p.name !== 'Aura User' ? p.name : ''}">
                </div>
                <div class="form-group w-50 ps-2">
                    <label for="prof-age">Age</label>
                    <input type="number" id="prof-age" class="form-control glass-input" placeholder="e.g. 25" value="${p.age !== 30 ? p.age : ''}">
                </div>
            </div>
            <div class="form-row mb-3">
                <div class="form-group w-50 pe-2">
                    <label for="prof-blood">Blood Type</label>
                    <select id="prof-blood" class="form-control glass-input">
                        <option value="">Select</option>
                        ${['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(b => `<option ${p.blood === b ? 'selected' : ''}>${b}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group w-50 ps-2">
                    <label for="prof-gender">Gender</label>
                    <select id="prof-gender" class="form-control glass-input">
                        <option value="">Select</option>
                        <option ${p.gender === 'Male' ? 'selected' : ''}>Male</option>
                        <option ${p.gender === 'Female' ? 'selected' : ''}>Female</option>
                        <option ${p.gender === 'Other' ? 'selected' : ''}>Other</option>
                    </select>
                </div>
            </div>
            <div class="form-row mb-4">
                <div class="form-group w-50 pe-2">
                    <label for="prof-height">Height (cm)</label>
                    <input type="number" id="prof-height" class="form-control glass-input" placeholder="e.g. 170" value="${p.height !== 170 ? p.height : ''}">
                </div>
                <div class="form-group w-50 ps-2">
                    <label for="prof-weight">Weight (kg)</label>
                    <input type="number" id="prof-weight" class="form-control glass-input" placeholder="e.g. 65" value="${p.weight !== 65 ? p.weight : ''}">
                </div>
            </div>

            <hr style="border-color:var(--border-color);margin:24px 0;">

            <!-- Medical History -->
            <h4 class="mb-3"><i class="fa-solid fa-notes-medical text-purple" aria-hidden="true"></i> Medical History</h4>
            <div class="form-row mb-3">
                <div class="form-group w-50 pe-2">
                    <label for="prof-lastvisit">Last Doctor Visit</label>
                    <input type="date" id="prof-lastvisit" class="form-control glass-input" value="${p.lastVisit || ''}">
                </div>
                <div class="form-group w-50 ps-2">
                    <label for="prof-doctorno">Personal Doctor's No.</label>
                    <input type="tel" id="prof-doctorno" class="form-control glass-input" placeholder="+91 XXXXX XXXXX" value="${p.doctorNo || ''}">
                </div>
            </div>
            <div class="form-row mb-4">
                <div class="form-group w-50 pe-2">
                    <label for="prof-bloodtest">Last Blood Test</label>
                    <select id="prof-bloodtest" class="form-control glass-input">
                        <option value="">Select</option>
                        <option ${p.bloodTest === 'Never' ? 'selected' : ''}>Never</option>
                        <option ${p.bloodTest === '< 6 months ago' ? 'selected' : ''}>< 6 months ago</option>
                        <option ${p.bloodTest === '6-12 months ago' ? 'selected' : ''}>6-12 months ago</option>
                        <option ${p.bloodTest === '> 1 year ago' ? 'selected' : ''}>> 1 year ago</option>
                    </select>
                </div>
                <div class="form-group w-50 ps-2">
                    <label for="prof-checkup">Last Full Body Checkup</label>
                    <select id="prof-checkup" class="form-control glass-input">
                        <option value="">Select</option>
                        <option ${p.fullCheckup === 'Never' ? 'selected' : ''}>Never</option>
                        <option ${p.fullCheckup === '< 6 months ago' ? 'selected' : ''}>< 6 months ago</option>
                        <option ${p.fullCheckup === '6-12 months ago' ? 'selected' : ''}>6-12 months ago</option>
                        <option ${p.fullCheckup === '> 1 year ago' ? 'selected' : ''}>> 1 year ago</option>
                    </select>
                </div>
            </div>

            <hr style="border-color:var(--border-color);margin:24px 0;">

            <!-- Known Conditions Checkboxes -->
            <h4 class="mb-3"><i class="fa-solid fa-stethoscope text-purple" aria-hidden="true"></i> Known Conditions</h4>
            <p class="text-muted small mb-3">Check any conditions that apply to you.</p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;" class="mb-4">
                ${conditions.map(c => `
                <label class="glass-card p-3" style="display:flex;align-items:center;gap:10px;cursor:pointer;border-radius:10px;">
                    <input type="checkbox" class="condition-check" value="${c}" ${(p.conditions || []).includes(c) ? 'checked' : ''} style="width:18px;height:18px;accent-color:var(--primary);">
                    <span class="small">${c}</span>
                </label>`).join('')}
            </div>

            <div class="form-group mb-4">
                <label for="prof-otherconditions">Other Conditions / Allergies</label>
                <input type="text" id="prof-otherconditions" class="form-control glass-input" placeholder="e.g. Peanut allergy, Lactose intolerance" value="${p.otherConditions || ''}">
            </div>

            <hr style="border-color:var(--border-color);margin:24px 0;">

            <!-- Dosha Badge -->
            <div class="text-center mb-4">
                <span class="badge badge-green" style="font-size:1rem;padding:10px 20px;">Body Type (Dosha): ${['Vata', 'Pitta', 'Kapha'].includes(p.dosha) ? p.dosha : 'Not taken yet'}</span>
                <p class="text-muted small mt-2">Take the <a href="#/quiz" style="color:var(--primary);font-weight:600;">Dosha Quiz</a> to discover your body type.</p>
            </div>

            <button type="submit" class="btn btn-primary btn-glow w-100 py-3"><i class="fa-solid fa-floppy-disk" aria-hidden="true"></i> Save Medical Profile</button>
            <button type="button" id="auth-action-button" class="btn btn-outline w-100 mt-3" style="border-color: #ef4444; color: #ef4444;" onclick="${authButtonHandler}">
                <i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i> <span id="auth-action-text">${authButtonText}</span>
            </button>
        </form>
    </section>`;
}
