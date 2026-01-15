document.addEventListener('DOMContentLoaded', () => {
document.getElementById("reCustomizeBtn").addEventListener("click", () => {
    currentQuestion = 1;               
    updateQuestionnaireUI();            
    questionnaireOverlay.classList.add('active'); 
    document.body.style.overflow = 'hidden';   
});

    document.getElementById("saveBtn").addEventListener("click", () => {
        const heading = document.getElementById('resultHeading').textContent;
        localStorage.setItem('savedResult', heading);
        alert("تم حفظ المحتوى!");
    });


    // ==================== DATA ====================
    let userData = {
        totalScore: 0,
        quizCount: 0,
        correctAnswers: 0,
        history: []
    };

    const competitors = [
        { name: 'محمد الشمري', score: 45, level: 'متقدم' },
        { name: 'سعاد القحطاني', score: 38, level: 'متقدم' },
        { name: 'عبدالله الزهراني', score: 25, level: 'متوسط' },
        { name: 'نورة الدوسري', score: 18, level: 'متوسط' }
    ];

    // Load saved data
    const savedData = localStorage.getItem('tharaUserData');
    if (savedData) userData = JSON.parse(savedData);

    function saveUserData() {
        localStorage.setItem('tharaUserData', JSON.stringify(userData));
        updateAllDisplays();
    }

    function getLevel(score) {
        if (score >= 50) return 'خبير';
        if (score >= 30) return 'متقدم';
        if (score >= 15) return 'متوسط';
        return 'مبتدئ';
    }

    // ==================== INTRO ====================
    const introScreen = document.getElementById('intro');
    const loginOverlay = document.getElementById('loginOverlay');
    
    setTimeout(() => {
        introScreen.classList.add('fade-out');
        setTimeout(() => {
            introScreen.style.display = 'none';
            loginOverlay.classList.add('active');
        }, 800);
    }, 2500);

    // ==================== LOGIN ====================
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const appContainer = document.getElementById('appContainer');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === '1234' && password === '1234') {
            loginOverlay.classList.remove('active');
            appContainer.classList.add('active');
            updateAllDisplays();
        } else {
            loginError.classList.add('show');
            setTimeout(() => loginError.classList.remove('show'), 3000);
        }
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
        appContainer.classList.remove('active');
        loginOverlay.classList.add('active');
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        showSection('home');
    });

    // ==================== NAVIGATION ====================
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-list');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('is-active');
    });

    function showSection(sectionName) {
    document.querySelectorAll('.section-page').forEach(section => {
        section.style.display = 'none';
    });

    if (sectionName === 'home') {
        document.getElementById('homeSection').style.display = 'flex';
    } else if (sectionName === 'quiz') {
        document.getElementById('quizSection').style.display = 'flex';
    } else if (sectionName === 'dashboard') {
        document.getElementById('dashboardSection').style.display = 'block';
    } else if (sectionName === 'result') {
        document.getElementById('resultSection').style.display = 'block';
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === sectionName) {
            link.classList.add('active');
        }
    });

    window.scrollTo(0, 0);
}


    // Nav link clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showSection(link.dataset.section);
        });
    });

    // Action cards
    document.querySelectorAll('.action-card').forEach(card => {
        card.addEventListener('click', () => {
            showSection(card.dataset.action);
        });
    });

    // Buttons
    document.getElementById('exploreBtn').addEventListener('click', () => showSection('quiz'));
    document.getElementById('startQuizFromDash').addEventListener('click', () => {
        resetQuiz();
        showSection('quiz');
    });

    // ==================== QUESTIONNAIRE ====================
    const customizeBtn = document.getElementById('customizeBtn');
    const questionnaireOverlay = document.getElementById('questionnaireOverlay');
    const closeQuestionnaire = document.getElementById('closeQuestionnaire');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const progressFill = document.getElementById('progressFill');
    const questionnaireForm = document.getElementById('questionnaireForm');
    
    let currentQuestion = 1;
    const totalQuestions = 4;

    customizeBtn.addEventListener('click', () => {
        questionnaireOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    closeQuestionnaire.addEventListener('click', closeQuestionnaireModal);

    questionnaireOverlay.addEventListener('click', (e) => {
        if (e.target === questionnaireOverlay) closeQuestionnaireModal();
    });

    function closeQuestionnaireModal() {
        questionnaireOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateQuestionnaireUI() {
        document.querySelectorAll('#questionnaireForm .question-slide').forEach(slide => slide.classList.remove('active'));
        document.querySelector(`#questionnaireForm [data-question="${currentQuestion}"]`).classList.add('active');

        progressFill.style.width = `${(currentQuestion / totalQuestions) * 100}%`;

        document.querySelectorAll('.progress-steps .step').forEach(step => {
            const stepNum = parseInt(step.dataset.step);
            step.classList.remove('active', 'completed');
            if (stepNum === currentQuestion) step.classList.add('active');
            else if (stepNum < currentQuestion) step.classList.add('completed');
        });

        prevBtn.disabled = currentQuestion === 1;
        nextBtn.style.display = currentQuestion === totalQuestions ? 'none' : 'flex';
        submitBtn.style.display = currentQuestion === totalQuestions ? 'flex' : 'none';
    }

    function isCurrentQuestionAnswered() {
        const currentSlide = document.querySelector(`#questionnaireForm [data-question="${currentQuestion}"]`);
        return currentSlide.querySelector('input:checked') !== null;
    }

    nextBtn.addEventListener('click', () => {
        if (!isCurrentQuestionAnswered()) {
            const currentSlide = document.querySelector(`#questionnaireForm [data-question="${currentQuestion}"]`);
            currentSlide.querySelector('.options-grid').style.animation = 'shake 0.5s ease';
            setTimeout(() => currentSlide.querySelector('.options-grid').style.animation = '', 500);
            return;
        }
        if (currentQuestion < totalQuestions) {
            currentQuestion++;
            updateQuestionnaireUI();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentQuestion > 1) {
            currentQuestion--;
            updateQuestionnaireUI();
        }
    });

questionnaireForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!isCurrentQuestionAnswered()) return;

    const formData = new FormData(questionnaireForm);

    const userPreferences = {
        userType: formData.get('userType'),
        interest: formData.get('interest'),
        contentType: formData.get('contentType'),
        region: formData.get('region')
    };

    localStorage.setItem('tharaPreferences', JSON.stringify(userPreferences));

    closeQuestionnaireModal();
    showPersonalizedResults();
    currentQuestion = 1;
    updateQuestionnaireUI();
});


    updateQuestionnaireUI();

    // ==================== QUIZ ====================
    let quizScore = 0;
    let currentQuizQuestion = 1;
    const totalQuizQuestions = 5;

    document.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', function() {
            if (this.disabled) return;

            const questionDiv = this.closest('.quiz-question');
            const allOptions = questionDiv.querySelectorAll('.quiz-option');
            allOptions.forEach(opt => opt.disabled = true);

            const isCorrect = this.dataset.correct === 'true';

            if (isCorrect) {
                this.classList.add('correct');
                quizScore++;
                userData.correctAnswers++;
                document.getElementById('quizScore').textContent = quizScore;
            } else {
                this.classList.add('wrong');
                allOptions.forEach(opt => {
                    if (opt.dataset.correct === 'true') opt.classList.add('correct');
                });
            }

            setTimeout(() => {
                if (currentQuizQuestion < totalQuizQuestions) {
                    currentQuizQuestion++;
                    document.getElementById('questionNum').textContent = currentQuizQuestion;
                    document.getElementById('quizProgressFill').style.width = `${(currentQuizQuestion / totalQuizQuestions) * 100}%`;
                    
                    document.querySelectorAll('.quiz-question').forEach(q => q.classList.remove('active'));
                    document.querySelector(`.quiz-question[data-question="${currentQuizQuestion}"]`).classList.add('active');
                } else {
                    finishQuiz();
                }
            }, 1500);
        });
    });
    
function finishQuiz() {
    document.getElementById('quizSection').style.display = 'none';
    document.getElementById('resultSection').style.display = 'block';

    const heading = document.getElementById('resultHeading');

    if (quizScore >= 4) {
        heading.textContent =
            "باحث أكاديمي مهتم بالاقتصاد – المنطقة الشرقية – عرض كتابي";
    } else {
        heading.textContent =
            "مستكشف ثقافي – المنطقة الشرقية – تجربة بصرية";
    }

    userData.totalScore += quizScore;
    userData.quizCount++;
    userData.history.unshift({
        title: 'كويز المنطقة الشرقية',
        date: new Date().toLocaleDateString('ar-SA'),
        score: quizScore
    });

    if (userData.history.length > 10) userData.history = userData.history.slice(0, 10);

    saveUserData();
}
    function resetQuiz() {
        quizScore = 0;
        currentQuizQuestion = 1;
        document.getElementById('quizScore').textContent = '0';
        document.getElementById('questionNum').textContent = '1';
        document.getElementById('quizProgressFill').style.width = '20%';
        document.getElementById('quizResult').style.display = 'none';
        document.getElementById('quizQuestions').style.display = 'block';

        document.querySelectorAll('.quiz-question').forEach((q, i) => {
            q.classList.remove('active');
            if (i === 0) q.classList.add('active');
        });

        document.querySelectorAll('.quiz-option').forEach(opt => {
            opt.classList.remove('correct', 'wrong');
            opt.disabled = false;
        });
    }

    document.getElementById('restartQuiz').addEventListener('click', resetQuiz);

    // ==================== UPDATE DISPLAYS ====================
    function updateAllDisplays() {
        document.getElementById('headerScore').textContent = `${userData.totalScore} نقطة`;
        document.getElementById('dashScore').textContent = userData.totalScore;
        document.getElementById('dashQuizCount').textContent = userData.quizCount;
        document.getElementById('dashCorrect').textContent = userData.correctAnswers;

        const level = getLevel(userData.totalScore);
        document.getElementById('dashLevel').textContent = level;

        const maxPossibleScore = userData.quizCount * 5;
        const progressPercent = maxPossibleScore > 0 ? Math.round((userData.totalScore / maxPossibleScore) * 100) : 0;
        document.getElementById('regionPercent').textContent = `${progressPercent}%`;
        document.getElementById('regionFill').style.width = `${progressPercent}%`;

        updateHistory();
        updateLeaderboard();
    }

    function updateLeaderboard() {
        const leaderboardList = document.getElementById('leaderboardList');
        
        const currentUser = {
            name: 'أنت',
            score: userData.totalScore,
            level: getLevel(userData.totalScore),
            isCurrentUser: true
        };

        const allPlayers = [...competitors, currentUser];
        allPlayers.sort((a, b) => b.score - a.score);

        leaderboardList.innerHTML = allPlayers.map((player, index) => {
            const rank = index + 1;
            const rankClass = rank <= 3 ? `rank-${rank}` : '';
            const isCurrentUser = player.isCurrentUser;
            
            return `
                <div class="leaderboard-item ${rankClass} ${isCurrentUser ? 'current-user' : ''}">
                    <div class="rank-badge">
                        ${rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : rank}
                    </div>
                    <div class="leaderboard-info">
                        <span class="leaderboard-name">
                            ${player.name}
                            ${isCurrentUser ? '<span class="you-badge">أنت</span>' : ''}
                        </span>
                        <span class="leaderboard-level">${player.level}</span>
                    </div>
                    <div class="leaderboard-score">
                        <span class="score-value">${player.score}</span>
                        <span class="score-label">نقطة</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    function updateHistory() {
        const historyList = document.getElementById('historyList');

        if (userData.history.length === 0) {
            historyList.innerHTML = `
                <div class="empty-history">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <p>لم تكمل أي كويز بعد</p>
                </div>
            `;
            return;
        }

        historyList.innerHTML = userData.history.map(item => `
            <div class="history-item">
                <div class="history-info">
                    <span class="history-title">${item.title}</span>
                    <span class="history-date">${item.date}</span>
                </div>
                <span class="history-score">${item.score}/5</span>
            </div>
        `).join('');
    }

    // Initialize
    updateAllDisplays();




function showPersonalizedResults() {
    const translations = {
    userType: {
        tourist: "سائح",
        citizen: "مواطن",
        researcher: "باحت أكاديمي"
    },
    interest: {
        economy: "الاقتصاد",
        culture: "الثقافة",
        history: "التاريخ",
        traditions: "العادات والتقاليد",
        tourism: "السياحة",
        general: "الاستكشاف العام"
    },
    region: {
        eastern: "المنطقة الشرقية",
        western: "المنطقة الغربية",
        central: "المنطقة الوسطى",
        northern: "المنطقة الشمالية",
        southern: "المنطقة الجنوبية",
    },
    contentType: {
        audio: "صوتي",
        text: "كتابي",
        visual: "مرئي"
    }
};

    const prefs = JSON.parse(localStorage.getItem('tharaPreferences'));
    if (!prefs) return;

    document.querySelectorAll('.section-page').forEach(s => s.style.display = 'none');
    document.getElementById('resultSection').style.display = 'block';

    const heading = document.getElementById('resultHeading');
    heading.textContent = `${translations.userType[prefs.userType]} مهتم بـ ${translations.interest[prefs.interest]} – ${translations.region[prefs.region]} – ${translations.contentType[prefs.contentType]}`;
}

});
