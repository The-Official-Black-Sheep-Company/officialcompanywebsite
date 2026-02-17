// External Knowledge Base for the Black Sheep Service Hub Chatbot
// You can update this file anytime to change the chatbot's responses.

const chatbotKnowledge = [
    {
        keywords: ['login', 'log in', 'sign in', 'account', 'access'],
        response: "It's easy! Create an account in the user portal and add your social media accounts to the ISMM (Integrated Social Media Management).!"
    },
    {
        keywords: ['hi', 'hello', 'hey', 'greetings'],
        response: "Hi! I’m your Black Sheep Service Hub Assistant. I can help with junk removal, moving, cleaning, server monitoring, phone repair, dog walking, mobile laundry, and our online store. What can I do for you today?"
    },
    {
        keywords: ['contact', 'phone', 'email', 'call', 'reach'],
        response: "You can reach us at (425) 517-9528 or email Support@theofficialblacksheepcompany.com. You can also find more details in our 'Contacts' tab!"
    },
    {
        keywords: ['pricing', 'cost', 'rates', 'price', 'how much'],
        response: "Our pricing varies by service:\n• Junk Removal: Depends on volume (small loads to full trucks).\n• Cleaning: Starts at $150 for residential.\n• Dog Walking: Rates based on walk length/frequency.\n• Phone Repair: Depends on the model and issue.\nTell me which service you're interested in for a better estimate!"
    },
    {
        keywords: ['location', 'area', 'serve', 'where'],
        response: "For in-person services like cleaning, junk removal, and dog walking, we serve the local area. For server monitoring and our online store, we support clients nationwide! Tell me your city and I'll confirm if we can help."
    },
    {
        keywords: ['hours', 'open', 'time', 'when'],
        response: "We are generally available during standard business hours, but many of our services (like server monitoring) are 24/7! For specialized jobs like junk removal or deep cleaning, we can often schedule evenings or weekends to fit your needs."
    },
    {
        keywords: ['junk', 'removal', 'hauling', 'trash', 'debris'],
        response: "We handle household junk, furniture, appliances, and general debris. We even do same-day hauling if the schedule allows! Tell me what you need gone and your location."
    },
    {
        keywords: ['cleaning', 'clean', 'maid', 'janitor', 'housekeeping'],
        response: "We offer both residential and commercial cleaning. This includes standard cleans, deep cleans, and move-in/move-out services. How can we help freshen up your space?"
    },
    {
        keywords: ['monitor', 'uptime', 'maintenance', 'it support', 'server'],
        response: "Our IT services include 24/7 monitoring for websites and infrastructure. We use tools like Wazuh and Glances to ensure everything stays up and secure. Check out the 'Monitoring' tab for our live dashboards!"
    },
    {
        keywords: ['repair', 'phone', 'iphone', 'android', 'screen', 'battery'],
        response: "We repair cracked screens, replace batteries, and fix charging ports for most major phone and tablet models. Most repairs are completed within 1-2 hours!"
    },
    {
        keywords: ['dog', 'pet', 'walk', 'sitting'],
        response: "We love dogs! We offer regular walking schedules, one-off walks, and pet sitting. We'll even send you photo updates of your pup in action."
    },
    {
        keywords: ['laundry', 'wash', 'fold', 'dry'],
        response: "Our mobile laundry service pick up your clothes, washes, dries, and folds them, then delivers them back to you within 24-48 hours. It's the ultimate time-saver!"
    },
    {
        keywords: ['store', 'shop', 'online', 'product', 'buy'],
        response: "Check out our online store in the 'Shopping' tab. We have branded apparel, tech gear, and more. We ship 24/7!"
    },
    {
        keywords: ['who', 'owner', 'ceo', 'runs', 'george', 'geezy', 'swoop'],
        response: "The Official Black Sheep Company is run by the one and only Swoop mf Geezy! You can find more about the vision in our reports and blog sections."
    },
    {
        keywords: ['name', 'who are you'],
        response: "I'm Black the Sheep, your AI tour guide and service assistant. I'm the blackest sheep in the flock and I'm here to make your experience smooth!"
    },
    {
        keywords: ['appointment', 'book', 'schedule', 'quote'],
        response: "I'd love to get you on the schedule! Please provide your name, the service you need, and your preferred date/time, and our team will reach out to confirm."
    },
    {
        keywords: ['bible', 'study', 'scripture', 'eternity', 'seek'],
        response: "Our 'Seek Eternity' bible study is a core part of what we do. Check the dedicated tab for narrative deep dives, Hebrew word analysis, and archeological context!"
    },
    {
        keywords: ['report', 'blog', 'history', 'artifact'],
        response: "Our 'Reports' section features weekly deep dives into historic figures, ancient artifacts, and biblical history. There's always something new to learn!"
    },
    {
        keywords: ['thanks', 'thank you', 'cool', 'awesome'],
        response: "You're very welcome! Is there anything else 'Black the Sheep' can help you with today?"
    }
];

// If being used in a broader context, we attach to window
window.chatbotKnowledge = chatbotKnowledge;
