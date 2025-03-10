import { NextResponse } from 'next/server';

// This would be your actual Gemini API key stored in environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// San Juan information to provide context to the model
const SAN_JUAN_CONTEXT = `
You are Juanito, a helpful virtual guide for San Juan, Batangas, Philippines. 
Your purpose is to provide accurate and helpful information about San Juan to tourists and visitors.

Key information about San Juan, Batangas:
- San Juan is a municipality in the province of Batangas, Philippines, known for its beautiful beaches.
- The most famous beach area is Laiya, which has white sand beaches and clear waters.
- Popular beaches include Laiya Beach, White Beach, and Calubcub Bay.
- Popular resorts include Acuatico Beach Resort, La Luz Beach Resort, and One Laiya.
- Local food specialties include lomi (a noodle soup), Batangas beef, and fresh seafood.
- Popular restaurants include Lomihan sa Pulang Bato and Kuya Oliver's Gotohan.
- The town fiesta is celebrated on June 24, honoring St. John the Baptist.
- The best time to visit is during the dry season from November to May.
- Activities include swimming, snorkeling, diving, island hopping, and various water sports.
- San Juan is accessible by bus from Manila, with a travel time of approximately 3-4 hours.

Important events:
- Beach Cleanup Drive (June 15)
- Local Food Festival (June 22-23)
- Fiesta San Juan (June 24)
- Summer Music Festival (July 5-7)
- Laiya Surfing Cup (August 12-13)
- Organic Farmers Market (Weekly on Saturdays)
- Batangas Art Exhibition (July 15-30)

Keep your responses friendly, concise, and focused on San Juan. If asked about topics unrelated to San Juan or tourism, politely redirect the conversation back to San Juan-related topics.
`;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    
    if (!GEMINI_API_KEY) {
      // Fallback to local responses if API key is not available
      return NextResponse.json({ 
        response: getLocalResponse(messages[messages.length - 1].content) 
      });
    }
    
    // Prepare conversation for Gemini API
    const conversation = messages.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));
    
    // Add system prompt at the beginning
    conversation.unshift({
      role: 'model',
      parts: [{ text: SAN_JUAN_CONTEXT }]
    });
    
    // Call Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: conversation,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 800,
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      
      // Fallback to local response
      return NextResponse.json({ 
        response: getLocalResponse(messages[messages.length - 1].content) 
      });
    }
    
    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;
    
    return NextResponse.json({ response: generatedText });
    
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}

// Fallback local responses when API is unavailable
function getLocalResponse(userInput: string) {
  const query = userInput.toLowerCase();
  
  if (query.includes("beach") || query.includes("beaches")) {
    return "San Juan is famous for its beautiful beaches, especially in Laiya. The most popular ones are Laiya Beach with its white sand and clear waters, and White Beach which is perfect for swimming and snorkeling. Many resorts offer beachfront accommodations with stunning views of the ocean. The best time to visit is during the dry season from November to May.";
  } 
  else if (query.includes("restaurant") || query.includes("food") || query.includes("eat")) {
    return "San Juan offers delicious local cuisine! You should try Lomihan sa Pulang Bato for their famous lomi soup, or Kuya Oliver's Gotohan for authentic Batangas goto. For seafood, many beachfront restaurants in Laiya serve fresh catches daily. Don't miss trying Batangas beef and the local coffee!";
  }
  else if (query.includes("laiya")) {
    return "Laiya is the most popular beach destination in San Juan, known for its stretch of white sand beaches and clear waters. It's home to numerous resorts ranging from budget-friendly to luxury accommodations. Activities in Laiya include swimming, snorkeling, banana boat rides, and island hopping. The area gets quite busy during weekends and holidays, so weekday visits are recommended for a more peaceful experience.";
  }
  else if (query.includes("activity") || query.includes("activities") || query.includes("things to do")) {
    return "San Juan offers many activities for visitors! You can enjoy water sports like swimming, snorkeling, and banana boat rides at Laiya Beach. Island hopping tours are available to nearby islands. For nature lovers, there are hiking trails with beautiful views. The town also has historical sites like old churches to explore. During weekends, the public market is lively and great for experiencing local culture.";
  }
  else if (query.includes("weather") || query.includes("forecast") || query.includes("climate")) {
    return "San Juan has a tropical climate. The dry season runs from November to May, which is the best time to visit the beaches. The wet season is from June to October, with August typically being the rainiest month. Current temperatures range from 24-32°C (75-90°F). Always check the latest weather forecast before planning beach activities, especially during the rainy season when typhoons can occur.";
  }
  else if (query.includes("fiesta") || query.includes("festival") || query.includes("celebration")) {
    return "The town fiesta of San Juan is celebrated on June 24th, honoring St. John the Baptist, the town's patron saint. The celebration includes religious processions, cultural performances, traditional games, and a variety of food stalls. There's also the Local Food Festival on June 22-23 and the Summer Music Festival from July 5-7. These events showcase local culture, music, and cuisine, making them great times to visit!";
  }
  else if (query.includes("resort") || query.includes("hotel") || query.includes("stay") || query.includes("accommodation")) {
    return "San Juan offers various accommodation options, particularly in Laiya. Luxury resorts include Acuatico Beach Resort with its infinity pools and premium amenities. For mid-range options, La Luz Beach Resort offers comfortable cottages with a relaxing atmosphere. One Laiya is another good choice with beachfront access. Budget travelers can find affordable homestays and smaller resorts throughout the area. It's advisable to book in advance, especially during weekends and holidays.";
  }
  else if (query.includes("transport") || query.includes("how to get") || query.includes("travel")) {
    return "To reach San Juan from Manila, you can take a bus from Buendia or Cubao terminals to San Juan, Batangas (3-4 hours). If driving, take SLEX, then STAR Tollway towards Batangas City, and follow signs to San Juan. Within San Juan, tricycles are the main mode of transportation. For exploring multiple beaches, renting a motorcycle or hiring a driver for the day is recommended. Many resorts also offer shuttle services from the town proper to Laiya beach area.";
  }
  else {
    return "As your guide to San Juan, Batangas, I can tell you that our town is famous for beautiful beaches in Laiya, delicious local cuisine like lomi, and various activities including water sports and cultural experiences. The town fiesta on June 24th is a highlight of our cultural calendar. Is there something specific about San Juan you'd like to know more about?";
  }
} 