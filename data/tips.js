// Sustainable Living Tips Data
// Each tip has: id, title, description, category, impact, difficulty, timeToImplement, image, author, datePublished

const sustainableTips = [
  {
    id: 1,
    title: "Start a Compost Bin in Your Backyard",
    description: "Transform your kitchen scraps and yard waste into nutrient-rich soil amendment. Composting reduces landfill waste by up to 30% while creating a natural fertilizer that eliminates the need for chemical alternatives. This simple practice connects you with nature's recycling system and dramatically reduces your household's environmental footprint.",
    shortDescription: "Turn kitchen scraps into nutrient-rich soil while reducing waste by 30%",
    category: "Waste Reduction",
    impact: "High",
    difficulty: "Beginner",
    timeToImplement: "2-3 hours setup",
    costSavings: "$200-400/year",
    carbonReduction: "0.5 tons CO2/year",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop&crop=center",
    author: "Dr. Sarah Green",
    authorBio: "Environmental Scientist & Composting Expert",
    datePublished: "2024-01-15",
    readTime: "5 min read",
    tags: ["composting", "gardening", "waste-reduction", "soil-health"],
    steps: [
      "Choose a suitable location (partial shade, good drainage)",
      "Select your composting method (bin, tumbler, or pile)",
      "Gather brown materials (leaves, paper, cardboard)",
      "Add green materials (kitchen scraps, grass clippings)",
      "Maintain proper moisture and turn regularly",
      "Harvest rich compost in 3-6 months"
    ],
    benefits: [
      "Reduces household waste by 25-30%",
      "Creates free, high-quality fertilizer",
      "Improves soil structure and water retention",
      "Reduces methane emissions from landfills",
      "Supports beneficial soil microorganisms"
    ],
    tips: [
      "Keep a 3:1 ratio of brown to green materials",
      "Chop large items into smaller pieces for faster decomposition",
      "Keep compost as moist as a wrung-out sponge",
      "Turn every 2-3 weeks for optimal results"
    ]
  },
  {
    id: 2,
    title: "Switch to Renewable Energy at Home",
    description: "Transition your home to clean, renewable energy sources through solar panels, wind power, or green energy programs. This fundamental shift not only reduces your carbon footprint by up to 80% but also provides long-term financial benefits through reduced electricity bills and potential tax incentives. Modern renewable systems are more efficient and affordable than ever before.",
    shortDescription: "Reduce your carbon footprint by 80% with solar, wind, or green energy programs",
    category: "Energy",
    impact: "Very High",
    difficulty: "Intermediate",
    timeToImplement: "1-3 months planning",
    costSavings: "$1,200-2,500/year",
    carbonReduction: "4-6 tons CO2/year",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop&crop=center",
    author: "Michael Torres",
    authorBio: "Renewable Energy Consultant",
    datePublished: "2024-01-20",
    readTime: "8 min read",
    tags: ["solar-power", "renewable-energy", "energy-efficiency", "cost-savings"],
    steps: [
      "Assess your home's energy needs and usage patterns",
      "Evaluate solar potential (roof condition, orientation, shading)",
      "Research local incentives and financing options",
      "Get quotes from certified renewable energy installers",
      "Consider battery storage for energy independence",
      "Schedule professional installation and grid connection"
    ],
    benefits: [
      "Reduces electricity bills by 70-90%",
      "Increases home value by 3-5%",
      "Qualifies for federal and state tax credits",
      "Provides energy independence and security",
      "Supports clean energy job creation"
    ],
    tips: [
      "Start with an energy audit to maximize efficiency first",
      "Consider community solar if roof installation isn't viable",
      "Look into time-of-use rates to maximize savings",
      "Plan for future electric vehicle charging needs"
    ]
  },
  {
    id: 3,
    title: "Create a Zero-Waste Kitchen",
    description: "Transform your kitchen into a zero-waste powerhouse by eliminating single-use items, embracing bulk buying, and implementing smart storage solutions. This comprehensive approach reduces packaging waste by 90% while often saving money through bulk purchases and reduced food waste. A zero-waste kitchen becomes the heart of sustainable living.",
    shortDescription: "Eliminate 90% of packaging waste with smart shopping and storage solutions",
    category: "Waste Reduction",
    impact: "High",
    difficulty: "Intermediate",
    timeToImplement: "2-4 weeks transition",
    costSavings: "$300-600/year",
    carbonReduction: "1.2 tons CO2/year",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center",
    author: "Emma Chen",
    authorBio: "Zero Waste Lifestyle Coach",
    datePublished: "2024-02-01",
    readTime: "6 min read",
    tags: ["zero-waste", "plastic-free", "bulk-buying", "meal-planning"],
    steps: [
      "Audit current kitchen waste and identify problem areas",
      "Invest in reusable containers, bags, and wraps",
      "Find local bulk stores and farmers markets",
      "Plan meals to minimize food waste",
      "Set up proper food storage systems",
      "Establish composting for unavoidable scraps"
    ],
    benefits: [
      "Dramatically reduces plastic consumption",
      "Saves money through bulk buying",
      "Reduces food waste by 40-50%",
      "Encourages healthier, less processed foods",
      "Creates a cleaner, more organized space"
    ],
    tips: [
      "Start gradually by replacing items as they run out",
      "Bring your own containers to delis and bakeries",
      "Use glass jars for storage - they're versatile and sustainable",
      "Keep a running shopping list to avoid impulse purchases"
    ]
  },
  {
    id: 4,
    title: "Plant a Native Species Garden",
    description: "Design and cultivate a garden using plants native to your region, creating a thriving ecosystem that supports local wildlife while requiring minimal water and maintenance. Native plants are perfectly adapted to local conditions, providing food and habitat for beneficial insects, birds, and other wildlife while naturally resisting pests and diseases.",
    shortDescription: "Support local wildlife and reduce water usage with region-specific plants",
    category: "Biodiversity",
    impact: "High",
    difficulty: "Beginner",
    timeToImplement: "1-2 weekends",
    costSavings: "$200-500/year",
    carbonReduction: "0.8 tons CO2/year",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop&crop=center",
    author: "Dr. James Wildflower",
    authorBio: "Native Plant Ecologist",
    datePublished: "2024-02-10",
    readTime: "7 min read",
    tags: ["native-plants", "biodiversity", "wildlife-habitat", "water-conservation"],
    steps: [
      "Research plants native to your specific region and soil type",
      "Remove invasive species and prepare planting areas",
      "Source plants from local native plant nurseries",
      "Design for seasonal interest and wildlife value",
      "Plant at appropriate times for your climate zone",
      "Establish natural mulching and minimal maintenance routines"
    ],
    benefits: [
      "Reduces water usage by 50-70%",
      "Eliminates need for fertilizers and pesticides",
      "Provides habitat for native pollinators",
      "Requires minimal maintenance once established",
      "Increases local biodiversity and ecosystem health"
    ],
    tips: [
      "Start small and expand your native garden over time",
      "Group plants with similar water and sun requirements",
      "Leave some areas 'messy' for overwintering beneficial insects",
      "Connect with local native plant societies for advice and plant swaps"
    ]
  },
  {
    id: 5,
    title: "Implement Rainwater Harvesting",
    description: "Capture and store rainwater from your roof and other surfaces to reduce dependence on municipal water systems while providing chemical-free irrigation for your garden. This ancient practice reduces stormwater runoff, prevents erosion, and can supply 50-80% of your outdoor water needs depending on your climate and rainfall patterns.",
    shortDescription: "Capture free rainwater to reduce bills and provide chemical-free garden irrigation",
    category: "Water Conservation",
    impact: "High",
    difficulty: "Intermediate", 
    timeToImplement: "1-2 days installation",
    costSavings: "$150-400/year",
    carbonReduction: "0.3 tons CO2/year",
    image: "https://images.unsplash.com/photo-1551522435-a13afa10f103?w=800&h=600&fit=crop&crop=center",
    author: "Lisa Waterstone",
    authorBio: "Water Conservation Specialist",
    datePublished: "2024-02-15",
    readTime: "6 min read",
    tags: ["rainwater-harvesting", "water-conservation", "irrigation", "drought-resilience"],
    steps: [
      "Calculate roof catchment area and potential water yield",
      "Install gutters and downspouts if not already present",
      "Choose appropriate storage containers (barrels, tanks, cisterns)",
      "Install first-flush diverters to improve water quality",
      "Set up distribution system (gravity-fed or pump-driven)",
      "Add overflow management and mosquito prevention measures"
    ],
    benefits: [
      "Reduces municipal water usage by 30-50%",
      "Provides chlorine-free water for plants",
      "Reduces stormwater runoff and erosion",
      "Increases water security during dry periods",
      "Can reduce flooding on your property"
    ],
    tips: [
      "Start with a simple rain barrel system before upgrading",
      "Use harvested water within a week for best quality",
      "Position storage to take advantage of gravity flow",
      "Consider permeable landscaping to maximize groundwater recharge"
    ]
  },
  {
    id: 6,
    title: "Build a Sustainable Transportation Plan",
    description: "Develop a comprehensive strategy that reduces your transportation carbon footprint through electric vehicles, public transit, cycling, walking, and remote work arrangements. Transportation accounts for 28% of greenhouse gas emissions, making this one of the most impactful areas for personal climate action while often improving health and saving money.",
    shortDescription: "Cut transportation emissions by 60% through electric vehicles, transit, and active mobility",
    category: "Transportation",
    impact: "Very High",
    difficulty: "Intermediate",
    timeToImplement: "2-6 months planning",
    costSavings: "$2,000-5,000/year",
    carbonReduction: "3-5 tons CO2/year",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=center",
    author: "Carlos Rodriguez",
    authorBio: "Sustainable Mobility Planner",
    datePublished: "2024-02-20",
    readTime: "9 min read",
    tags: ["electric-vehicles", "public-transit", "cycling", "carbon-footprint"],
    steps: [
      "Analyze current transportation patterns and costs",
      "Research electric vehicle options and charging infrastructure",
      "Map out public transit routes for regular destinations",
      "Identify safe cycling and walking routes",
      "Negotiate remote work arrangements when possible",
      "Create backup plans for different transportation needs"
    ],
    benefits: [
      "Reduces fuel and maintenance costs significantly",
      "Improves air quality in your community",
      "Increases physical activity and health",
      "Reduces traffic congestion",
      "Supports development of sustainable infrastructure"
    ],
    tips: [
      "Start with one or two routes and gradually expand sustainable options",
      "Consider car-sharing or ride-sharing for occasional longer trips",
      "Combine errands into efficient multi-stop trips",
      "Advocate for better cycling and transit infrastructure in your community"
    ]
  },
  {
    id: 7,
    title: "Design an Energy-Efficient Smart Home",
    description: "Integrate smart technology and energy-efficient appliances to create a home that automatically optimizes energy usage, reduces waste, and provides detailed insights into consumption patterns. Smart home technology can reduce energy usage by 20-30% while increasing comfort and convenience through automated systems that learn your preferences and habits.",
    shortDescription: "Reduce energy usage by 30% with automated systems and smart appliances",
    category: "Energy",
    impact: "High",
    difficulty: "Advanced",
    timeToImplement: "1-3 months implementation",
    costSavings: "$800-1,500/year",
    carbonReduction: "2.5 tons CO2/year",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=center",
    author: "Tech Innovator Alex Kim",
    authorBio: "Smart Home Technology Specialist",
    datePublished: "2024-02-25",
    readTime: "10 min read",
    tags: ["smart-home", "energy-efficiency", "automation", "IoT"],
    steps: [
      "Conduct energy audit to identify biggest opportunities",
      "Install smart thermostat with learning capabilities",
      "Upgrade to smart lighting with motion sensors and scheduling",
      "Add smart power strips to eliminate phantom loads",
      "Install smart water heater and appliance controls",
      "Set up monitoring system to track energy usage patterns"
    ],
    benefits: [
      "Automatically optimizes energy usage when away",
      "Provides detailed consumption analytics",
      "Reduces peak demand charges",
      "Increases home value and modern appeal",
      "Enables remote monitoring and control"
    ],
    tips: [
      "Start with the biggest energy users (heating, cooling, water heating)",
      "Choose systems that integrate well together",
      "Set up alerts for unusual energy consumption",
      "Regularly review and adjust automation rules for maximum efficiency"
    ]
  }
];

module.exports = sustainableTips;