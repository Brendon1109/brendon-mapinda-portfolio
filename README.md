# Brendon Mapinda - Personal Website

A modern, responsive website showcasing Brendon Mapinda's three main personas: Photography/Cinematography, Data Science, and Music (King Breazy).

## Features

### 🎨 Visual Design
- Modern, responsive design with smooth animations
- Clean typography using Inter font family
- Gradient backgrounds and glass-morphism effects
- Mobile-first responsive layout

### 🤖 AI-Powered Persona Explorer
- Interactive "Who is Brendon?" button with AI-powered responses
- Uses Google Gemini API to generate personalized summaries
- Cost-controlled API usage (max $1, 50 requests)
- Fallback responses when API is unavailable
- Real-time usage tracking

### 📱 Three Main Personas

#### 1. Photography & Cinematography (@framebyframeios)
- Certified iPhone Photography from Udemy
- Co-founder of Tsakani Sessions marketing agency
- Visual storytelling expertise
- Social media presence on Instagram and TikTok

#### 2. Data Science & Analytics
- PgDip Industrial Engineering (Data Science focus)
- 4+ years Data Analyst experience
- 8+ months Data Engineer experience
- 15+ certifications including DP-900 and Databricks
- Analytics Engineering Specialist

#### 3. Music (King Breazy)
- 10+ years in music industry since 2014
- 10M+ streams across platforms
- Signed with Cape Town distribution company
- Collaborations with Tellaman, Rowlene, Lastee
- Evolution from hip-hop to Afrohouse/Afrotech/3step

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **AI Integration**: Google Gemini API
- **Styling**: Modern CSS with Flexbox and Grid
- **Icons**: Font Awesome 6
- **Fonts**: Google Fonts (Inter)
- **Hosting**: GitHub Pages ready

## Project Structure

```
brendon-website/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # Main stylesheet with AI modal styles
├── js/
│   ├── script.js          # Main JavaScript functionality
│   └── ai-bot.js          # AI bot integration with Gemini API
├── README.md              # This file
└── .github/
    └── copilot-instructions.md  # AI assistant instructions
```

## Setup and Deployment

### Local Development

1. Clone or download the project files
2. Open `index.html` in a web browser
3. For full functionality, serve from a local server (due to CORS):
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (if you have serve installed)
   npx serve .
   
   # Using VS Code Live Server extension
   Right-click index.html -> "Open with Live Server"
   ```

### GitHub Pages Deployment

1. Create a new repository on GitHub
2. Upload all project files to the repository
3. Go to repository Settings > Pages
4. Select "Deploy from a branch" and choose "main" branch
5. Your site will be available at `https://username.github.io/repository-name`

### QR Code Generation

To create a QR code for the website:

1. Get your GitHub Pages URL after deployment
2. Use any QR code generator (e.g., qr-code-generator.com)
3. Enter your website URL
4. Download and save the QR code image

## AI Integration Details

### Static Content System
- **Service**: Static pre-written responses
- **Configuration**: No external API dependencies
- **Rate Limiting**: No limits (static content)
- **Fallback**: Built-in persona-specific content

### Security Notes
- No external API calls required
- All content served statically
- No authentication or keys needed

### Content Capabilities
- Provides personalized summaries for each persona
- Contextual responses based on curated content
- Error handling with user-friendly messages
- Usage statistics tracking

## Customization

### Adding New Content
- Edit `index.html` to update personal information
- Modify `css/styles.css` to change visual styling
- Update persona data in `js/ai-bot.js` for AI responses

### Updating AI Responses
- Edit the `personaData` object in `js/ai-bot.js`
- Modify prompts in `buildPrompt()` method
- Update fallback responses in `getFallbackResponse()` method

### Styling Changes
- Main color scheme uses blues and purples (`#667eea`, `#764ba2`)
- Responsive breakpoint at 768px for mobile
- CSS custom properties can be added for easier theme management

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design works on all screen sizes
- Progressive enhancement (works without JavaScript)
- AI features require JavaScript and internet connection

## Performance

- Optimized images and assets
- Minimal external dependencies
- CSS and JavaScript minification ready
- Lazy loading for smooth animations

## Links and References

### Brendon's Professional Links
- **LinkedIn**: https://www.linkedin.com/in/brendon-mapinda-20b6911a0/
- **Instagram (Photography)**: https://www.instagram.com/framebyframeios
- **TikTok**: @framebyframeios
- **Music Platforms**: https://distrokid.com/hyperfollow/kingbreazy/road-to-success-love-tales
- **Tsakani Sessions**: https://www.instagram.com/tsakani_sessions

### Technical Resources
- **Google Gemini API**: https://ai.google.dev/
- **Font Awesome**: https://fontawesome.com/
- **Google Fonts**: https://fonts.google.com/

## License

This project is created for Brendon Mapinda's personal use. Please respect intellectual property and personal information.

## Support

For issues or questions about the website, please contact through the social media links provided on the site.

---

Built with ❤️ for showcasing the multi-talented Brendon Mapinda