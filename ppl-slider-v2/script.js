// Notify parent iframe of content height
function notifyParentOfHeight() {
    if (window.parent !== window) {
        requestAnimationFrame(() => {
            const height = document.documentElement.scrollHeight;
            window.parent.postMessage({ type: 'resize', height }, '*');
        });
    }
}

const TOTAL_QUESTIONS = 5;
const YES_THRESHOLD_MAX = 10; // Slider values from 0-10 count as "yes".
const answerContent = {
    1: {
        title: "<strong>Here's a great weekend project to get started on.</strong><br>Over time, you could see energy savings up to 25%.",
        body: "Well-placed trees and shrubs provide natural shade and can reduce your energy use by as much as 25% once they've grown. For shade from the direct summer sun, plant trees on the south and west sides of your home. Deciduous trees are ideal, since they provide shade in summer and allow sunlight through after losing their leaves in winter."
    },
    2: {
        title: "<strong>Here's an easy task to knock out in an afternoon.</strong><br>It can help improve your system's energy efficiency.",
        body: "Removing dirt and debris from around your outdoor air condenser ensures proper airflow, helping your system run more efficiently and reliably throughout the cooling season."
    },
    3: {
        title: "<strong>It's a simple upgrade you can try this weekend</strong>—and it may cut solar heat entering your home by up to 60%.",
        body: "Curtains, blinds and other window coverings help block the sun's heat before it warms your home. Cellular shades, in particular, can reduce unwanted solar heat through windows by up to 60%."
    },
    4: {
        title: "<strong>Try this quick task that delivers real results</strong><br>by helping to keep your system running efficiently.",
        body: "Replacing HVAC or heat pump filters on a regular basis improves airflow and performance. Check your equipment manual or the manufacturer's website for guidance on cleaning or replacing."
    },
    5: {
        title: "<strong>This fast fix could make all the difference</strong><br>and help your fans work more efficiently.",
        body: "Dust buildup can weigh down ceiling fan blades and clog components, reducing efficiency. Keeping fans clean helps them move air more effectively—and ENERGY STAR<sup>®</sup> certified ceiling fans are up to 44% more efficient than conventional models."
    }
};

// ── Slider interaction ────────────────────────────────────────────────────────

function updateSlider(input) {
    const val = parseInt(input.value);
    input.style.background = `linear-gradient(
        to right,
        #001A4D 0%, #001A4D ${val}%,
        #ffffff ${val}%, #ffffff 100%
    )`;
}

// ── Submit answer ─────────────────────────────────────────────────────────────

function submitAnswer(qNum) {
    const titleEl = document.getElementById(`answer-title-${qNum}`);
    const textEl = document.getElementById(`answer-text-${qNum}`);
    const sliderEl = document.getElementById(`slider-${qNum}`);
    const sliderValue = sliderEl ? parseInt(sliderEl.value, 10) : NaN;
    const content = answerContent[qNum];
    if (titleEl && content) titleEl.innerHTML = content.title;
    if (textEl && content) textEl.innerHTML = content.body;
    updateOnTrackBanner(qNum, sliderValue);

    // Swap views
    document.getElementById(`q-view-${qNum}`).classList.add('hidden');
    document.getElementById(`a-view-${qNum}`).classList.remove('hidden');

    setProgress(Math.round((qNum / TOTAL_QUESTIONS) * 100));

    scrollToTop();
    notifyParentOfHeight();
}

function updateOnTrackBanner(qNum, sliderValue) {
    const answerHero = document.querySelector(`#a-view-${qNum} .answer-hero`);
    if (!answerHero) return;

    let banner = answerHero.querySelector('.on-track-banner');
    if (!banner) {
        banner = document.createElement('p');
        banner.className = 'on-track-banner hidden';
        banner.textContent = 'You are on track';
        answerHero.appendChild(banner);
    }

    let bannerMessage = '';
    let useBlueBanner = false;
    if (Number.isFinite(sliderValue) && sliderValue >= 0 && sliderValue <= 10) {
        bannerMessage = 'You are on track to stay cool this summer.';
    } else if (Number.isFinite(sliderValue) && sliderValue >= 90 && sliderValue <= 100) {
        bannerMessage = 'A small step now can help you stay cool this summer.';
        useBlueBanner = true;
    }

    if (bannerMessage) {
        banner.textContent = bannerMessage;
        banner.classList.toggle('on-track-banner--blue', useBlueBanner);
        banner.classList.remove('hidden');
    } else {
        banner.classList.remove('on-track-banner--blue');
        banner.classList.add('hidden');
    }
}

// ── Navigation ────────────────────────────────────────────────────────────────

function goNext(currentQNum) {
    if (currentQNum >= TOTAL_QUESTIONS) {
        updateEndingScreenMessage();
        showStep('ending-screen', false);
        return;
    }
    showStep(`question-${currentQNum + 1}`, false);
}

function calculateYesScore() {
    let yesCount = 0;

    for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
        const sliderEl = document.getElementById(`slider-${i}`);
        const sliderValue = sliderEl ? parseInt(sliderEl.value, 10) : NaN;
        if (!Number.isFinite(sliderValue)) continue;

        if (sliderValue >= 0 && sliderValue <= YES_THRESHOLD_MAX) {
            yesCount += 1;
        }
    }

    return yesCount;
}

function getEndingMessage(yesScore) {
    if (yesScore <= 1) {
        return "Now is a great time to prepare your home for summer to stay cool and reduce energy use. Try a few of these tips to beat the heat!";
    }
    if (yesScore <= 4) {
        return "Sounds like you're already preparing to stay cool and reduce energy use this summer. Incorporating a few more of these tips can help you beat the heat!";
    }
    return "Congratulations! Sounds like you're already prepared to stay cool and reduce energy use this summer.";
}

function updateEndingScreenMessage() {
    const endingMessageEl = document.getElementById('ending-message');
    if (!endingMessageEl) return;

    const yesScore = calculateYesScore();
    endingMessageEl.textContent = getEndingMessage(yesScore);
}

function goPreviousFromQuestion(qNum) {
    if (qNum <= 1) return;
    showStep(`question-${qNum - 1}`, false);
    document.getElementById(`q-view-${qNum - 1}`)?.classList.add('hidden');
    document.getElementById(`a-view-${qNum - 1}`)?.classList.remove('hidden');
    setProgress(Math.round(((qNum - 1) / TOTAL_QUESTIONS) * 100));
    scrollToTop();
    notifyParentOfHeight();
}

function goPreviousFromAnswer(qNum) {
    document.getElementById(`a-view-${qNum}`)?.classList.add('hidden');
    document.getElementById(`q-view-${qNum}`)?.classList.remove('hidden');
    setProgress(Math.round(((qNum - 1) / TOTAL_QUESTIONS) * 100));
    scrollToTop();
    notifyParentOfHeight();
}

function goPreviousFromEnding() {
    showStep('question-5', false);
    document.getElementById('q-view-5')?.classList.add('hidden');
    document.getElementById('a-view-5')?.classList.remove('hidden');
    setProgress(100);
    scrollToTop();
    notifyParentOfHeight();
}

function showStep(stepId, resetProgress = true) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    const step = document.getElementById(stepId);
    if (step) {
        step.classList.add('active');
        const progressSection = step.querySelector('.progress-section');
        if (progressSection) progressSection.classList.remove('hidden');
        scrollToTop();
        notifyParentOfHeight();
    }
    if (resetProgress) updateProgressForStep(stepId);
}

function scrollToTop() {
    requestAnimationFrame(() => {
        if (window.parent !== window) {
            window.parent.postMessage({ type: 'scrollToTop' }, '*');
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

// ── Progress bar ──────────────────────────────────────────────────────────────

function updateProgressForStep(stepId) {
    const match = stepId.match(/^question-(\d+)$/);
    if (!match) {
        setProgress(100);
        return;
    }
    const qNum = parseInt(match[1], 10);
    const previousCompleted = Math.max(0, qNum - 1);
    setProgress(Math.round((previousCompleted / TOTAL_QUESTIONS) * 100));
}

function setProgress(pct) {
    document.querySelectorAll('.progress-fill').forEach(el => el.style.width = `${pct}%`);
    document.querySelectorAll('.progress-text').forEach(el => el.textContent = `${pct}%`);
}

// ── Restart ───────────────────────────────────────────────────────────────────

function restartQuiz() {
    document.querySelectorAll('.q-slider').forEach(input => {
        input.value = 50;
        updateSlider(input);
    });
    for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
        document.getElementById(`q-view-${i}`)?.classList.remove('hidden');
        document.getElementById(`a-view-${i}`)?.classList.add('hidden');
    }
    setProgress(0);
    showStep('question-1');
}

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.q-slider').forEach(input => updateSlider(input));
    showStep('question-1');
    notifyParentOfHeight();
    window.addEventListener('resize', notifyParentOfHeight);
    document.querySelectorAll('img').forEach(img => {
        if (!img.complete) img.addEventListener('load', notifyParentOfHeight);
    });
});

window.addEventListener('message', e => {
    if (e.data?.type === 'requestHeight') notifyParentOfHeight();
});
