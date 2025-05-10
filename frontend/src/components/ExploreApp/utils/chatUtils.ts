// Simple response generator based on user input
export const generateAgentResponse = (input: string): string => {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('restaurant') || lowerInput.includes('food') || lowerInput.includes('eat')) {
    return `Based on your preferences, I'd recommend trying Place 1 or Place 3 for food. Place 1 is closer to your current location and has great reviews!`;
  } else if (lowerInput.includes('activity') || lowerInput.includes('things to do') || lowerInput.includes('entertainment')) {
    return `There are several entertainment options nearby! Place 2 has amazing activities, and it's within your selected radius. Would you like more specific details?`;
  } else if (lowerInput.includes('directions') || lowerInput.includes('how to get') || lowerInput.includes('navigate')) {
    return `I can help with directions! From your current location, the fastest route to Place 1 is via Main Street. It should take about 10 minutes by car or 25 minutes by public transport.`;
  } else if (lowerInput.includes('review') || lowerInput.includes('rating')) {
    return `Place 1 has 4.5 stars based on 240 reviews. Place 2 has 4.2 stars from 185 reviews. Place 3 has 4.7 stars but only 95 reviews. Place 4 has 4.0 stars from 310 reviews.`;
  } else if (lowerInput.includes('hours') || lowerInput.includes('open') || lowerInput.includes('close')) {
    return `Most places in this area are open from 10am to 9pm. Place 2 stays open late until 11pm on Friday and Saturday. Place 4 opens early at 8am.`;
  } else if (lowerInput.includes('thank')) {
    return `You're welcome! Happy to help. Let me know if you need anything else for your adventure!`;
  } else if (lowerInput.includes('hello') || lowerInput.includes('hi ')) {
    return `Hello there! How can I help with your search results? I can tell you more about any of these places or suggest which ones might suit your preferences best.`;
  } else {
    return `That's a great question about the area! Based on your search, I'd recommend checking out Place 2 first as it best matches your interests. Can I help you with anything specific about these locations?`;
  }
}; 