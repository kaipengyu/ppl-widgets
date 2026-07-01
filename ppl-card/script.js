// PPL Energy Savings Game JavaScript

class PPLEnergyGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.gameStarted = false;
        this.totalPairs = 6;
        this.isShowingTip = false;
        this.currentTip = '';
        this.isFlippingBack = false;
        this.isProcessingTurn = false; // New flag to prevent rapid clicking
        
        // Accessibility: Create live region for screen reader announcements
        this.createLiveRegion();
        
        // Energy efficiency items with their SVG files and tips - in correct sequence
        this.energyItems = [
            { 
                name: 'curtain', 
                file: 'curtain.svg', 
                tipTitle: 'Did you know that decorating can help you save energy?',
                tipDescription: "By hanging drapes close to your windows and letting them fall on the windowsill or floor, you’ll reduce heat loss in the room. Add high-pile carpeting to any room to increase warmth during the winter, allowing you to turn down the thermostat a degree or two."
            },
            { 
                name: 'fan', 
                file: 'fan.svg', 
                tipTitle: 'Yes, a fan can give your thermostat a hand.',
                tipDescription: 'Adjust your ceiling fan to rotate clockwise, which moves air downward, circulating heated air in the winter and allowing you to set your thermostat lower. Simply flip the switch located near the motor housing to change directions.'
            },
            { 
                name: 'window', 
                file: 'window_v02.svg', 
                tipTitle: 'Cut down on heating costs with do-it-yourself storm windows.',
                tipDescription: 'Storm window installation is one of the ways to improve your energy savings. This DIY project can take 20‒30 minutes per window and can save up to 33% of your energy costs every year.'
            },
            { 
                name: 'fireplace', 
                file: 'fireplace.svg', 
                tipTitle: 'Not using your fireplace? Close the damper to avoid a draft.',
                tipDescription: 'An open chimney can pull warm air up, causing rooms to be cooler and your heating system to work harder. Don’t forget to close the damper when not in use—when left open, it’s like leaving a window open in the winter.'
            },
            { 
                name: 'carpet', 
                file: 'carpet.svg', 
                tipTitle: 'Afraid of your attic? Turns out the real scare is all the escaping energy.',
                tipDescription: 'A DIY project like adding more insulation can keep you more comfortable and save you up to 10% on your energy bill.'
            },
            { 
                name: 'thermostat', 
                file: 'thermostat.svg', 
                tipTitle: 'Stay warm and save! Get your heating system ready before cold weather hits.',
                tipDescription: 'Replace HVAC or heat pump filters and consider scheduling a routine service check. Plus, install a smart thermostat to automate the energy savings for you.'
            }
        ];
        
        this.initializeGame();
    }
    
    createLiveRegion() {
        // Create a live region for screen reader announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        document.body.appendChild(liveRegion);
        this.liveRegion = liveRegion;
    }
    
    announceToScreenReader(message) {
        if (this.liveRegion) {
            this.liveRegion.textContent = message;
        }
    }
    
    initializeGame() {
        this.createCards();
        this.updateDisplay();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Start game automatically when page loads
        setTimeout(() => {
            this.startGame();
        }, 1000);
    }
    
    createCards() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';
        
        // Create cards in the exact sequence from Figma design
        // Row 1: Curtain, Fan, Window, Fireplace, Carpet, Thermostat
        // Row 2: Window, Carpet, Thermostat, Curtain, Fan, Fireplace
        const cardSequence = [
            // Row 1
            { name: 'curtain', file: 'curtain.svg', tipTitle: 'Tip: Did you know that decorating can help you save energy?', tipDescription: 'By hanging drapes close to your windows and letting them fall on the windowsill or floor, you\'ll reduce heat loss in the room. Add high pile carpeting to any room to increase warmth during the winter, allowing you to turn down the thermostat a degree or two.' },
            { name: 'fan', file: 'fan.svg', tipTitle: 'Tip: Ceiling fans can help you save energy year-round!', tipDescription: 'In summer, run your ceiling fan counterclockwise to create a cool breeze. In winter, reverse the direction to clockwise to circulate warm air from the ceiling. This can help you adjust your thermostat by up to 4 degrees.' },
            { name: 'window', file: 'window_v02.svg', tipTitle: 'Tip: Seal those air leaks for big savings!', tipDescription: 'Apply weatherstripping around windows and doors, and use caulk to seal gaps and cracks. This simple step can reduce your heating and cooling costs by up to 20%.' },
            { name: 'fireplace', file: 'fireplace.svg', tipTitle: 'Tip: Your fireplace might be costing you money!', tipDescription: 'Keep the damper closed when not using your fireplace to prevent warm air from escaping up the chimney. Consider installing glass doors to further reduce heat loss.' },
            { name: 'carpet', file: 'carpet.svg', tipTitle: 'Tip: Rugs and carpets are natural insulators!', tipDescription: 'Adding area rugs to hardwood or tile floors can help retain heat in the winter. Choose thick, high-pile carpets for maximum insulation benefits.' },
            { name: 'thermostat', file: 'thermostat.svg', tipTitle: 'Tip: Program your thermostat for automatic savings!', tipDescription: 'Set your thermostat to 68°F in winter and 78°F in summer when you\'re home. Lower or raise it by 7-10 degrees when you\'re away or sleeping to save up to 10% on your energy bills.' },
            // Row 2
            { name: 'window', file: 'window_v02.svg', tipTitle: 'Tip: Seal those air leaks for big savings!', tipDescription: 'Apply weatherstripping around windows and doors, and use caulk to seal gaps and cracks. This simple step can reduce your heating and cooling costs by up to 20%.' },
            { name: 'carpet', file: 'carpet.svg', tipTitle: 'Tip: Rugs and carpets are natural insulators!', tipDescription: 'Adding area rugs to hardwood or tile floors can help retain heat in the winter. Choose thick, high-pile carpets for maximum insulation benefits.' },
            { name: 'thermostat', file: 'thermostat.svg', tipTitle: 'Tip: Program your thermostat for automatic savings!', tipDescription: 'Set your thermostat to 68°F in winter and 78°F in summer when you\'re home. Lower or raise it by 7-10 degrees when you\'re away or sleeping to save up to 10% on your energy bills.' },
            { name: 'curtain', file: 'curtain.svg', tipTitle: 'Tip: Did you know that decorating can help you save energy?', tipDescription: 'By hanging drapes close to your windows and letting them fall on the windowsill or floor, you\'ll reduce heat loss in the room. Add high pile carpeting to any room to increase warmth during the winter, allowing you to turn down the thermostat a degree or two.' },
            { name: 'fan', file: 'fan.svg', tipTitle: 'Tip: Ceiling fans can help you save energy year-round!', tipDescription: 'In summer, run your ceiling fan counterclockwise to create a cool breeze. In winter, reverse the direction to clockwise to circulate warm air from the ceiling. This can help you adjust your thermostat by up to 4 degrees.' },
            { name: 'fireplace', file: 'fireplace.svg', tipTitle: 'Tip: Your fireplace might be costing you money!', tipDescription: 'Keep the damper closed when not using your fireplace to prevent warm air from escaping up the chimney. Consider installing glass doors to further reduce heat loss.' }
        ];
        
        // Create card elements in the exact sequence
        cardSequence.forEach((item, index) => {
            const card = this.createCardElement(item, index);
            gameBoard.appendChild(card);
            this.cards.push(card);
        });
    }
    
    createCardElement(item, index) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.item = item.name;
        card.dataset.index = index;
        card.dataset.tipTitle = item.tipTitle;
        card.dataset.tipDescription = item.tipDescription;
        
        // Add accessibility attributes
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Energy saving item: ${item.name}`);
        card.setAttribute('aria-pressed', 'false');
        
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <img src="images/${item.file}" alt="${item.name}" class="card-icon">
                </div>
                <div class="card-back"></div>
            </div>
            <div class="card-overlay check-overlay" style="display: none;">
                <img src="images/check.svg" alt="Match" class="overlay-icon">
            </div>
            <div class="card-overlay cross-overlay" style="display: none;">
                <img src="images/cross.svg" alt="No Match" class="overlay-icon">
            </div>
        `;
        
        // Add click event listener
        card.addEventListener('click', () => this.flipCard(card));
        
        // Add keyboard event listeners for accessibility
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault(); // Prevent default space key behavior (page scroll)
                this.flipCard(card);
            }
        });
        
        return card;
    }
    

    
    startGame() {
        if (this.gameStarted) return;
        
        this.gameStarted = true;
        document.getElementById('gameBoard').classList.add('game-started');
        
        // Announce game start to screen reader
        this.announceToScreenReader('Energy savings game started. Use Tab to navigate between cards and Enter or Space to flip them.');
    }
    
    flipCard(card) {
        // Prevent flipping if game is not started, card is already flipped/matched, 
        // we're flipping back, or we're processing a turn
        if (!this.gameStarted || 
            card.classList.contains('flipped') || 
            card.classList.contains('matched') || 
            this.isFlippingBack || 
            this.isProcessingTurn) {
            // Provide feedback for rapid clicking
            if (this.isProcessingTurn) {
                this.announceToScreenReader('Please wait for the current turn to complete');
            }
            return;
        }
        
        // Hide any existing check overlays when starting a new turn
        if (this.flippedCards.length === 0) {
            document.querySelectorAll('.check-overlay').forEach(overlay => {
                overlay.style.display = 'none';
            });
        }
        
        // If we're showing a tip, clear it when user starts a new turn
        if (this.isShowingTip) {
            this.continueGame();
        }
        
        // Flip the card
        card.classList.add('flipped');
        card.setAttribute('aria-pressed', 'true');
        this.flippedCards.push(card);
        
        // Announce to screen reader
        this.announceToScreenReader(`Flipped ${card.dataset.item} card`);
        
        // Check if we have two cards flipped
        if (this.flippedCards.length === 2) {
            this.isProcessingTurn = true; // Prevent further card flipping during match check
            document.getElementById('gameBoard').classList.add('processing-turn');
            this.checkMatch();
        }
    }
    
    checkMatch() {
        const [card1, card2] = this.flippedCards;
        const match = card1.dataset.item === card2.dataset.item;
        
        // Add a small delay to prevent rapid clicking and show the cards briefly
        setTimeout(() => {
            if (match) {
                // Cards match
                this.handleMatch(card1, card2);
            } else {
                // Cards don't match
                this.handleNoMatch(card1, card2);
            }
        }, 800); // Increased delay to give users time to see the cards
    }
    
    handleMatch(card1, card2) {
        // Show checkmark overlays
        card1.querySelector('.check-overlay').style.display = 'block';
        card2.querySelector('.check-overlay').style.display = 'block';
        
        // Mark as matched
        card1.classList.add('matched');
        card2.classList.add('matched');
        
        // Increment matched pairs BEFORE showing tip so we can check if it's the last match
        this.matchedPairs++;
        
        // Get the tip for this match
        const itemName = card1.dataset.item;
        const item = this.energyItems.find(item => item.name === itemName);
        this.currentTipTitle = item ? item.tipTitle : 'Great job finding a match!';
        this.currentTipDescription = item ? item.tipDescription : 'Keep playing to discover more energy-saving tips!';
        
        // Show tip and keep playing button
        this.showTip('It&rsquo;s a match!', this.currentTipTitle, this.currentTipDescription);
        
        this.flippedCards = [];
        this.updateDisplay();
        
        // Reset processing flag to allow new turns
        this.isProcessingTurn = false;
        document.getElementById('gameBoard').classList.remove('processing-turn');
        
        // Announce match to screen reader
        this.announceToScreenReader(`Match found! ${this.matchedPairs} of ${this.totalPairs} pairs completed.`);
        
        this.checkGameOver();
    }
    
    handleNoMatch(card1, card2) {
        // Set flipping back flag to lock other cards
        this.isFlippingBack = true;
        
        // Show cross overlays
        card1.querySelector('.cross-overlay').style.display = 'block';
        card2.querySelector('.cross-overlay').style.display = 'block';
        
        // Mark as wrong
        card1.classList.add('wrong');
        card2.classList.add('wrong');
        
        // Show no match message
        this.showNoMatchMessage();
        
        // Announce no match to screen reader
        this.announceToScreenReader('No match found. Cards will flip back.');
        
        // Auto-flip back after 0.7 seconds
        setTimeout(() => {
            this.autoFlipBack(card1, card2);
        }, 700);
    }
    
    showNoMatchMessage() {
        // Update the text section temporarily
        const textSection = document.querySelector('.text-section');
        textSection.innerHTML = `
            <h1 class="main-title">Oops, not a match. Try again.</h1>
            <p class="subtitle">Keep trying to find matching pairs!</p>
        `;
    }
    
    autoFlipBack(card1, card2) {
        // Hide overlays
        card1.querySelector('.cross-overlay').style.display = 'none';
        card2.querySelector('.cross-overlay').style.display = 'none';
        
        // Remove wrong class and flip back
        card1.classList.remove('flipped', 'wrong');
        card2.classList.remove('flipped', 'wrong');
        
        // Reset aria-pressed attributes
        card1.setAttribute('aria-pressed', 'false');
        card2.setAttribute('aria-pressed', 'false');
        
        // Reset flipped cards
        this.flippedCards = [];
        
        // Unlock cards by resetting the flipping back flag and processing flag
        this.isFlippingBack = false;
        this.isProcessingTurn = false;
        document.getElementById('gameBoard').classList.remove('processing-turn');
        
        // Restore original text
        const textSection = document.querySelector('.text-section');
        textSection.innerHTML = `
            <h1 class="main-title">Can you pick the places where your home could save more energy?</h1>
            <p class="subtitle">Match two and discover an easy tip to help you get started.</p>
        `;
    }
    
    showTip(title, tipTitle, tipDescription) {
        this.isShowingTip = true;
        
        // Check if this is the last match
        const isLastMatch = this.matchedPairs === this.totalPairs;
        
        // Update the text section
        const textSection = document.querySelector('.text-section');
        textSection.innerHTML = `
            <h1 class="main-title">${title}</h1>
            <p class="subtitle tip-title">${tipTitle}</p>
            <p class="tip-description mb-0">${tipDescription}</p>
            ${isLastMatch ? '<button class="complete-btn" onclick="game.completeGame()">Complete</button>' : ''}
        `;
    }
    
    continueGame() {
        this.isShowingTip = false;
        
        // Restore original text
        const textSection = document.querySelector('.text-section');
        textSection.innerHTML = `
            <h1 class="main-title">Can you pick the places where your home could save more energy?</h1>
            <p class="subtitle">Match two and discover an easy tip to help you get started.</p>
        `;
    }
    
    checkGameOver() {
        if (this.matchedPairs === this.totalPairs) {
            // Don't end game immediately - let the tip be shown first
            // The user will need to click "Complete" to finish
            this.announceToScreenReader('All pairs matched! Click the Complete button to finish the game.');
        }
    }
    
    completeGame() {
        this.gameStarted = false;
        
        // Hide all checkmark overlays when completing the game
        document.querySelectorAll('.check-overlay').forEach(overlay => {
            overlay.style.display = 'none';
        });
        
        // Announce game completion to screen reader
        this.announceToScreenReader('Congratulations! You have completed the energy savings game. All pairs have been matched.');
        
        // Show game complete state inline instead of modal
        this.showGameCompleteState();
    }
    
    endGame() {
        this.gameStarted = false;
        
        // Announce game completion to screen reader
        this.announceToScreenReader('Congratulations! You have completed the energy savings game. All pairs have been matched.');
        
        // Show game complete state inline instead of modal
        this.showGameCompleteState();
    }
    
    showGameCompleteState() {
        // Update the text section with game complete content
        const textSection = document.querySelector('.text-section');
        textSection.innerHTML = `
            <h1 class="main-title">You and energy savings are a perfect match!</h1>
            <p class="subtitle">Thanks for playing our game.</p>
            <button class="start-over-btn" onclick="game.resetGame()">Start Over</button>
        `;
    }
    
    updateDisplay() {
        document.getElementById('matches').textContent = this.matchedPairs;
    }
    
    resetGame() {
        // Reset game state
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.gameStarted = false;
        this.isShowingTip = false;
        this.currentTip = '';
        this.isFlippingBack = false;
        this.isProcessingTurn = false;
        
        // Remove all card classes and overlays
        this.cards.forEach(card => {
            card.classList.remove('flipped', 'matched', 'wrong');
            card.setAttribute('aria-pressed', 'false');
            card.querySelectorAll('.card-overlay').forEach(overlay => {
                overlay.style.display = 'none';
            });
        });
        
        // Remove processing class from game board
        document.getElementById('gameBoard').classList.remove('processing-turn');
        
        // Recreate cards
        this.createCards();
        this.updateDisplay();
        
        // Restore original text
        const textSection = document.querySelector('.text-section');
        textSection.innerHTML = `
            <h1 class="main-title">Can you pick the places where your home could save more energy?</h1>
            <p class="subtitle">Match two and discover an easy tip to help you get started.</p>
        `;
        
        // Start new game
        setTimeout(() => {
            this.startGame();
        }, 500);
    }
}

// Initialize the game when the page loads
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new PPLEnergyGame();
});

// Add some additional features for better UX
document.addEventListener('DOMContentLoaded', () => {
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'r' || e.key === 'R') {
            // Reset game with R key
            location.reload();
        }
    });
    
    // Add touch/swipe support for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', (e) => {
        if (!touchStartX || !touchStartY) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        
        // Reset touch coordinates
        touchStartX = 0;
        touchStartY = 0;
        
        // Handle swipe gestures
        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (Math.abs(diffX) > 50) {
                // Horizontal swipe detected
                if (diffX > 0) {
                    // Swipe left - could be used for next level
                    console.log('Swipe left detected');
                } else {
                    // Swipe right - could be used for previous level
                    console.log('Swipe right detected');
                }
            }
        }
    });
}); 