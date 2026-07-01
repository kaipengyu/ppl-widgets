# PPL Energy Savings Game

A modern, responsive energy efficiency card-matching game built with pure HTML, CSS, and JavaScript. Players match energy-saving items to discover helpful tips for reducing their home energy consumption.

## Features

- 🏠 **Energy Efficiency Focus**: Match home energy-saving items like curtains, fans, windows, fireplaces, carpets, and thermostats
- 💡 **Educational Tips**: Discover practical energy-saving tips with each successful match
- 🎮 **Interactive Gameplay**: Flip cards to find matching pairs of energy-saving items
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- ⭐ **Progress Tracking**: Visual progress indicator showing matches found (0/6)
- 🎨 **Modern UI**: Beautiful PPL-branded design with smooth animations
- ⌨️ **Accessibility**: Full keyboard navigation and screen reader support
- 👆 **Touch Support**: Optimized for mobile devices with touch gestures
- 🎯 **Custom SVG Icons**: Beautiful, scalable energy-saving item illustrations

## How to Play

1. The game starts automatically when the page loads
2. Click on cards to flip them and reveal energy-saving items
3. Find matching pairs of the same energy-saving item
4. When you find a match, discover a helpful energy-saving tip
5. Complete all 6 pairs to finish the game
6. Click "Start Over" to play again

## Game Controls

- **Mouse/Touch**: Click or tap cards to flip them
- **Keyboard**: Use Tab to navigate between cards, Enter or Space to flip
- **R Key**: Reset the game (reloads the page)
- **Touch Gestures**: Swipe support for mobile devices

## Energy-Saving Items

The game features 6 different energy-saving items, each with educational tips:

- **Curtains**: Learn about window treatments for energy efficiency
- **Ceiling Fans**: Discover year-round energy savings with proper fan usage
- **Windows**: Tips for sealing air leaks and weatherstripping
- **Fireplaces**: Learn about damper management and heat loss prevention
- **Carpets**: Discover how rugs can act as natural insulators
- **Thermostats**: Programming tips for automatic energy savings

## File Structure

```
ppl-card/
├── index.html          # Main HTML structure with PPL branding
├── styles.css          # Custom CSS with PPL color scheme and animations
├── script.js           # Game logic and energy-saving tips
├── images/             # SVG icons and PPL branding assets
│   ├── curtain.svg
│   ├── fan.svg
│   ├── window_v02.svg
│   ├── fireplace.svg
│   ├── carpet.svg
│   ├── thermostat.svg
│   ├── ppl-logo.svg
│   ├── check.svg
│   └── cross.svg
└── README.md           # Project documentation
```

## Technologies Used

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **JavaScript (ES6+)**: Object-oriented game logic with accessibility support
- **Bootstrap 5**: Responsive grid system and components
- **Custom SVG Icons**: Scalable energy-saving item illustrations
- **Google Fonts**: Raleway and Inter typography

## Accessibility Features

- **Screen Reader Support**: Live regions for announcements and proper ARIA labels
- **Keyboard Navigation**: Full keyboard support with Tab, Enter, and Space keys
- **Skip Links**: Accessibility skip link for screen reader users
- **Focus Management**: Proper focus indicators and management
- **Semantic HTML**: Proper use of roles, labels, and landmarks

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Features

- **Smooth Animations**: CSS transitions and keyframe animations for card flips
- **Responsive Design**: Adapts to any screen size with mobile-first approach
- **Touch Optimized**: Optimized for mobile devices with touch gestures
- **Memory Efficient**: Clean JavaScript with proper event handling and cleanup
- **Fast Loading**: Minimal dependencies and optimized assets

## Customization

### Changing Energy-Saving Items
Edit the `energyItems` array in `script.js` to use different items and tips:

```javascript
this.energyItems = [
    { 
        name: 'your-item', 
        file: 'your-item.svg', 
        tipTitle: 'Your Tip Title',
        tipDescription: 'Your detailed tip description'
    },
    // Add more items here
];
```

### Adjusting Game Difficulty
Modify the `totalPairs` variable in the constructor to change the number of card pairs:

```javascript
this.totalPairs = 6; // Change this number
```

### Styling Customization
The CSS uses CSS custom properties (variables) for easy customization:

```css
:root {
    --ppl-orange: #BA4A00;
    --ppl-light-orange: #F0851C;
    --card-width: 182px;
    --card-height: 226px;
    --flip-duration: 0.6s;
    /* Add more custom properties as needed */
}
```

## Development

To run the game locally:

1. Clone or download the project files
2. Open `index.html` in your web browser
3. Start playing!

No build process or dependencies required - it's pure HTML, CSS, and JavaScript.

## PPL Branding

This game features PPL's official brand colors and styling:
- Primary Orange: #BA4A00
- Light Orange: #F0851C
- Cream: #FCD1AC
- Blue: #00557F
- Yellow: #FFB81C

## Future Enhancements

- [ ] Multiple difficulty levels with more energy-saving items
- [ ] Sound effects and background music
- [ ] Local storage for high scores and progress
- [ ] Different energy efficiency themes (summer/winter tips)
- [ ] Multiplayer support for family challenges
- [ ] Progressive Web App (PWA) features
- [ ] Integration with PPL's energy savings calculator
- [ ] Social sharing of energy-saving tips

## License

This project is developed for PPL (Pennsylvania Power & Light) and is proprietary.

---

**Start saving energy today with the PPL Energy Savings Game!** 🏠💡✨ 