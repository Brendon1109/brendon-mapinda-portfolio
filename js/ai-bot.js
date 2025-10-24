// AI Bot for Brendon Mapinda Website
// Uses Gemini API to provide persona-specific information

class BrendonAIBot {
    constructor() {
        this.apiKey = 'AIzaSyAup1O_rjKfuShYnF96a2fB3bhY0XDiO9U';
        this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        this.requestCount = 0;
        this.maxRequests = 50; // Stay well within free tier limits
        this.costEstimate = 0;
        
        // Persona data for context
        this.personaData = {
            cinematographer: {
                bio: "Brendon Mapinda - Visual storyteller through photography and cinematography",
                achievements: [
                    "Certificate in iPhone Photography from Udemy",
                    "Instagram: @framebyframeios",
                    "TikTok: @framebyframeios",
                    "Co-founder of Tsakani Sessions marketing agency",
                    "Specializes in helping casual places scale up their businesses"
                ],
                links: [
                    "https://www.instagram.com/framebyframeios",
                    "https://www.instagram.com/tsakani_sessions",
                    "https://www.youtube.com/@TsakaniSessions"
                ],
                focus: "Photography, cinematography, content creation, visual storytelling"
            },
            musician: {
                bio: "King Breazy - Hip-hop artist with over 10 years of experience since 2014",
                achievements: [
                    "Over 10M streams across platforms",
                    "Signed under Cape Town-based distribution company",
                    "Featured in newspapers and magazines",
                    "Appeared on Colors show",
                    "Collaborations with Tellaman, Rowlene, and Lastee",
                    "Music theory education and formal training"
                ],
                discography: [
                    "High School Moments (2015) - First mixtape",
                    "African American (2016) - Debut album", 
                    "Road To Success: Love Tales & Life Tales (2019) - Double mixtape",
                    "Tisvikewo (2022) - Latest mixtape showing industry maturity",
                    "Multiple singles including collaborations"
                ],
                currentFocus: "Afrohouse/Afrotech/3step genres",
                links: [
                    "https://distrokid.com/hyperfollow/kingbreazy/road-to-success-love-tales",
                    "https://youtu.be/GHg0pnLmaIQ"
                ]
            },
            dataScientist: {
                bio: "Brendon Mapinda - Experienced Data Engineer and Analytics Engineer",
                education: [
                    "PgDip in Industrial Engineering (Data Science focus)",
                    "National Data Science Certificate",
                    "BSc Applied Geology",
                    "PgDip Integrated Water Resource Management"
                ],
                experience: [
                    "4 years 4 months as Data Analyst",
                    "8+ months as Data Engineer",
                    "Aspires to be Head of Analytical Engineering"
                ],
                certifications: [
                    "DP-900 (Azure Data Fundamentals)",
                    "Databricks Fundamentals",
                    "15+ additional data certifications"
                ],
                linkedin: "https://www.linkedin.com/in/brendon-mapinda-20b6911a0/",
                focus: "Business solutions, analytical engineering, data architecture"
            }
        };
    }

    checkUsageLimits() {
        if (this.requestCount >= this.maxRequests) {
            throw new Error('API usage limit reached for safety. Please try again later.');
        }
        if (this.costEstimate >= 1.00) {
            throw new Error('Cost limit of $1 approached. API usage suspended for safety.');
        }
    }

    async generatePersonaSummary(persona) {
        this.checkUsageLimits();
        
        const data = this.personaData[persona];
        if (!data) {
            throw new Error('Invalid persona requested');
        }

        const prompt = this.buildPrompt(persona, data);
        
        try {
            const response = await fetch(`${this.apiEndpoint}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const result = await response.json();
            this.requestCount++;
            this.costEstimate += 0.01; // Rough estimate per request
            
            return result.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('AI Bot Error:', error);
            return this.getFallbackResponse(persona);
        }
    }

    buildPrompt(persona, data) {
        const prompts = {
            cinematographer: `Create a compelling 2-3 paragraph summary about Brendon Mapinda as a cinematographer and photographer. 

Key information:
- Brand: ${data.bio}
- Achievements: ${data.achievements.join(', ')}
- Focus: ${data.focus}
- Social media: Instagram and TikTok @framebyframeios
- Co-founder of Tsakani Sessions marketing agency

Make it engaging and highlight his visual storytelling abilities and business acumen. Keep it under 200 words.`,

            musician: `Create an engaging 2-3 paragraph summary about King Breazy (Brendon Mapinda) as a musician.

Key information:
- Bio: ${data.bio}
- Achievements: ${data.achievements.join(', ')}
- Discography: ${data.discography.join(', ')}
- Current focus: ${data.currentFocus}
- Notable collaborations with South African artists

Highlight his musical journey, evolution, and current direction. Keep it under 200 words.`,

            dataScientist: `Create a professional 2-3 paragraph summary about Brendon Mapinda as a data scientist and analytics engineer.

Key information:
- Education: ${data.education.join(', ')}
- Experience: ${data.experience.join(', ')}
- Certifications: ${data.certifications.join(', ')}
- Career aspiration: ${data.focus}

Emphasize his technical expertise, diverse background, and leadership aspirations. Keep it under 200 words.`
        };

        return prompts[persona];
    }

    getFallbackResponse(persona) {
        const fallbacks = {
            cinematographer: `Brendon Mapinda (@framebyframeios) is a passionate visual storyteller specializing in photography and cinematography. With a certified background in iPhone photography from Udemy, he has built a strong presence on Instagram and TikTok under the handle @framebyframeios.

As co-founder of Tsakani Sessions, Brendon combines his creative vision with business acumen to help casual venues scale their operations through strategic content creation, DJ services, and community building. His approach to visual storytelling focuses on authentic moments and compelling narratives that resonate with audiences.

His work spans from intimate photography sessions to larger marketing campaigns, always maintaining his signature style of capturing life frame by frame.`,

            musician: `King Breazy (Brendon Mapinda) is a seasoned hip-hop artist with over a decade of experience in the music industry since 2014. His journey from high school performances to achieving over 10 million streams showcases remarkable growth and dedication to his craft.

His discography includes the debut mixtape "High School Moments" (2015), the album "African American" (2016), and the critically acclaimed double mixtape "Road To Success" featuring both Love Tales and Life Tales (2019). His latest work "Tisvikewo" (2022) demonstrates his artistic maturity and evolution.

Currently signed under a Cape Town-based distribution company, King Breazy has collaborated with notable South African artists including Tellaman, Rowlene, and Lastee. His musical focus has evolved to encompass Afrohouse, Afrotech, and 3step genres, reflecting the contemporary African music landscape.`,

            dataScientist: `Brendon Mapinda is an accomplished data scientist and analytics engineer with a robust educational foundation including a PgDip in Industrial Engineering with a focus on Data Science, a National Data Science Certificate, and complementary degrees in Applied Geology and Integrated Water Resource Management.

With over 4 years and 4 months of experience as a Data Analyst and 8+ months as a Data Engineer, he brings practical expertise to complex data challenges. His certification portfolio includes DP-900 (Azure Data Fundamentals), Databricks Fundamentals, and over 15 additional data certifications.

Brendon aspires to become a Head of Analytical Engineering, where he can leverage his technical skills and diverse background to provide innovative business solutions. His multidisciplinary approach, combining geological understanding with modern data science techniques, positions him uniquely in the analytics field.`
        };

        return fallbacks[persona];
    }

    getUsageStats() {
        return {
            requests: this.requestCount,
            maxRequests: this.maxRequests,
            estimatedCost: this.costEstimate.toFixed(2),
            remaining: this.maxRequests - this.requestCount
        };
    }
}

// Initialize the AI Bot
const brendonAI = new BrendonAIBot();

// Export for use in main script
window.BrendonAI = brendonAI;