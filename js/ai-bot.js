// Description Bot for Brendon Mapinda Website
// Provides static persona-specific information

class BrendonAIBot {
    constructor() {
        this.requestCount = 0;
        this.maxRequests = 1000; // No API limits now
        this.costEstimate = 0;
    }

    checkUsageLimits() {
        // No limits needed for static content
        return true;
    }

    async generatePersonaSummary(persona) {
        // Simulate a small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500));
        
        this.requestCount++;
        return this.getFallbackResponse(persona);
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

As an Analytics Engineering Specialist, he leverages his technical skills and diverse background to provide innovative business solutions. His multidisciplinary approach, combining geological understanding with modern data science techniques, positions him uniquely in the analytics field.`
        };

        return fallbacks[persona];
    }

    getUsageStats() {
        return {
            requests: this.requestCount,
            maxRequests: this.maxRequests,
            estimatedCost: "Free",
            remaining: "Unlimited"
        };
    }
}

// Initialize the AI Bot
const brendonAI = new BrendonAIBot();

// Export for use in main script
window.BrendonAI = brendonAI;