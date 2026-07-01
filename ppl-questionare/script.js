// Store user answers
let answers = [];

// Notify parent page of content height for iframe resizing
function notifyParentOfHeight() {
    if (window.parent !== window) {
        // Small delay to ensure DOM has updated
        requestAnimationFrame(() => {
            const height = document.documentElement.scrollHeight;
            window.parent.postMessage({ type: 'resize', height: height }, '*');
        });
    }
}

// Result data mapped to most-picked option (1-4)
const results = [
    {
        image: 'images/result-1.jpg',
        mobImage: 'images/mob_result1.png',
        title: "You’re Carefully\n Comfortable!",
        description: "You like staying cozy while\n keeping savings in sight.",
        alt: "illustration of a woman watching a show on her tablet in bed with her cat on her lap"
    },
    {
        image: 'images/result-2.jpg',
        mobImage: 'images/mob_result2.png',
        title: "You’re Seriously\n Saving!",
        description: "You love saving big without\n spending a thing.",
        alt: "illustration of a woman turning off a table lamp in her living room"
    },
    {
        image: 'images/result-3.jpg',
        mobImage: 'images/mob_result3.png',
        title: "You’re Proudly \nFrugal!",
        description: "You’ve got everyday efficiency \ndown to a science.",
        alt: "illustration of a woman sitting on the floor in her living room looking at the Energy Analyzer tool on her laptop"
    },
    {
        image: 'images/result-4.jpg',
        mobImage: 'images/mob_result4.png',
        title: "You’re Safely \nCooking!",
        description: `You keep your kitchen smart\nand your savings steady.`,
        alt: "illustration of a man cooking food in a large pan on the stove"
    }
];

function showStep(stepId) {
    // Hide all steps
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => {
        step.classList.remove('active');
    });
    
    // Show the requested step
    const step = document.getElementById(stepId);
    if (step) {
        step.classList.add('active');

        // Keep the progress section and next button together at the bottom
        const progressSection = document.querySelector('.progress-section');
        const questionFooter = step.querySelector('.question-footer');
        if (progressSection && questionFooter) {
            questionFooter.appendChild(progressSection);
        }

        // Scroll to top and notify parent page of new content height
        requestAnimationFrame(() => {
            // If embedded in iframe, ask parent to scroll to iframe top
            if (window.parent !== window) {
                window.parent.postMessage({ type: 'scrollToTop' }, '*');
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            // Notify parent of updated content height
            notifyParentOfHeight();
        });
    }

    updateProgressForStep(stepId);
}

// Handle option selection
function selectOption(element, questionNum, optionNum) {
    // Remove previous selection for this question
    const questionId = `question-${questionNum}`;
    const questionContainer = document.getElementById(questionId);
    const options = questionContainer.querySelectorAll('.option');
    options.forEach(option => {
        option.classList.remove('selected');
    });
    
    // Mark selected option
    element.classList.add('selected');
    
    // Store answer
    answers[questionNum - 1] = optionNum;
    
    // Enable next button
    const nextButton = document.getElementById(`next-${questionNum}`);
    if (nextButton) {
        nextButton.disabled = false;
    }
}

// Update global progress bar based on current step
function updateProgressForStep(stepId) {
    let percentage = 0;

    const progressSection = document.querySelector('.progress-section');

    if (stepId === 'question-1') {
        percentage = 0;
    } else if (stepId === 'question-2') {
        percentage = 25;
    } else if (stepId === 'question-3') {
        percentage = 50;
    } else if (stepId === 'question-4') {
        percentage = 75;
    } else if (stepId === 'result') {
        percentage = 100;
    }

    // Hide progress on result page
    if (progressSection) {
        if (stepId === 'result') {
            progressSection.classList.add('hidden');
        } else {
            progressSection.classList.remove('hidden');
        }
    }

    setProgress(percentage);
}

function setProgress(percentage) {
    const progressFill = document.getElementById('global-progress');
    const progressText = document.getElementById('global-progress-text');

    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }

    if (progressText) {
        progressText.textContent = `${percentage}%`;
    }
}

// Animate progress to a target percentage and resolve when the bar finishes
function animateProgressTo(percentage) {
    return new Promise((resolve) => {
        const progressFill = document.getElementById('global-progress');
        if (!progressFill) {
            setProgress(percentage);
            resolve();
            return;
        }

        const onEnd = (event) => {
            if (event.propertyName === 'width') {
                progressFill.removeEventListener('transitionend', onEnd);
                clearTimeout(fallback);
                resolve();
            }
        };

        const fallback = setTimeout(() => {
            progressFill.removeEventListener('transitionend', onEnd);
            resolve();
        }, 450);

        progressFill.addEventListener('transitionend', onEnd);
        setProgress(percentage);
    });
}

// Move to next question
function nextQuestion(currentQuestionNum) {
    if (answers[currentQuestionNum - 1]) {
        const isLastQuestion = currentQuestionNum >= 4;
        const nextStepId = isLastQuestion ? null : `question-${currentQuestionNum + 1}`;
        const targetPercent = isLastQuestion ? 100 : currentQuestionNum * 25;

        animateProgressTo(targetPercent).then(() => {
            if (isLastQuestion) {
                showResult();
            } else {
                showStep(nextStepId);
            }
        });
    }
}

function showResult() {
    // Count selections per option (1-4)
    const counts = [0, 0, 0, 0];
    answers.forEach((answer) => {
        if (answer && counts[answer - 1] !== undefined) {
            counts[answer - 1] += 1;
        }
    });

    // Find the option with the highest count; tie-breaker priority 1 > 2 > 3 > 4
    let bestIndex = 0;
    counts.forEach((count, idx) => {
        if (count > counts[bestIndex]) {
            bestIndex = idx;
        }
    });

    const result = results[bestIndex];
    
    // Update result page
    const resultImage = document.getElementById('result-image');
    const resultImageMobile = document.getElementById('result-image-mobile');
    const resultTitle = document.getElementById('result-title');
    const resultDescription = document.getElementById('result-description');
    const resultOverlay = document.querySelector('.result-overlay');
    
    if (resultImage) {
        resultImage.src = result.image;
        resultImage.alt = result.alt || result.title;
    }
    if (resultImageMobile) {
        resultImageMobile.srcset = result.mobImage;
    }
    if (resultOverlay) {
        resultOverlay.classList.toggle('right-align', bestIndex === 3);
    }
    if (resultTitle) resultTitle.textContent = result.title;
    if (resultDescription) resultDescription.textContent = result.description;
    
    // Show result page
    showStep('result');
}

// Restart the quiz
function restartQuiz() {
    answers = [];
    
    // Reset all option selections
    const allOptions = document.querySelectorAll('.option');
    allOptions.forEach(option => {
        option.classList.remove('selected');
    });
    
    // Disable all next buttons
    const allNextButtons = document.querySelectorAll('.next-button');
    allNextButtons.forEach(button => {
        button.disabled = true;
    });
    
    // Start from first question and reset progress
    setProgress(0);
    showStep('question-1');
}

// Initialize progress bars on page load
document.addEventListener('DOMContentLoaded', function() {
    showStep('question-1');
    
    // Initial height notification for iframe embedding
    notifyParentOfHeight();
    
    // Also notify on window resize in case content reflows
    window.addEventListener('resize', notifyParentOfHeight);
    
    // Notify when images finish loading (may change height)
    document.querySelectorAll('img').forEach(img => {
        if (img.complete) {
            notifyParentOfHeight();
        } else {
            img.addEventListener('load', notifyParentOfHeight);
        }
    });
});

// Listen for messages from parent page
window.addEventListener('message', function(event) {
    // Parent might send commands to the iframe
    if (event.data && event.data.type === 'requestHeight') {
        notifyParentOfHeight();
    }
});

