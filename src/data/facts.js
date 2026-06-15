/**
 * @module facts
 * @description Educational facts, quiz questions, and comparisons.
 */

export const CARBON_FACTS = [
  { id: 'f1', fact: 'The average global carbon footprint is roughly 4.7 tonnes per year per person.', source: 'Our World in Data', category: 'General' },
  { id: 'f2', fact: 'Energy use in industry, buildings, and transport accounts for over 70% of global emissions.', source: 'EPA', category: 'Energy' },
  { id: 'f3', fact: 'A single round-trip transatlantic flight can emit as much CO2 as an average person does in a year in many countries.', source: 'UNEP', category: 'Transport' },
  { id: 'f4', fact: 'Food production accounts for about a quarter of global greenhouse gas emissions.', source: 'Our World in Data', category: 'Diet' },
  { id: 'f5', fact: 'If food waste were a country, it would be the third largest emitter in the world.', source: 'FAO', category: 'Diet' },
  { id: 'f6', fact: 'The fashion industry produces 10% of all humanity’s carbon emissions.', source: 'UNEP', category: 'Shopping' },
  { id: 'f7', fact: 'Switching to a plant-based diet can reduce your food-related carbon footprint by up to 73%.', source: 'Science', category: 'Diet' },
  { id: 'f8', fact: 'Streaming an hour of video produces about 36 grams of CO2, depending on the device and network.', source: 'Carbon Trust', category: 'Lifestyle' },
  { id: 'f9', fact: 'Riding a bike instead of driving for short trips can reduce personal transport emissions by 67%.', source: 'University of Oxford', category: 'Transport' },
  { id: 'f10', fact: 'Heating and cooling account for about half of a typical home’s energy consumption.', source: 'EPA', category: 'Energy' }
];

export const QUIZ_QUESTIONS = [
  { id: 'q1', question: 'Which sector is responsible for the largest share of global greenhouse gas emissions?', options: ['Agriculture', 'Transportation', 'Energy', 'Industry'], correctIndex: 2, explanation: 'Energy use (including electricity, heat, and transport) accounts for over 70% of global emissions.' },
  { id: 'q2', question: 'What is the average global carbon footprint per person per year?', options: ['1.5 tonnes', '4.7 tonnes', '10.2 tonnes', '15.2 tonnes'], correctIndex: 1, explanation: 'The global average is about 4.7 tonnes, though it varies wildly by country.' },
  { id: 'q3', question: 'Which of these diets typically has the lowest carbon footprint?', options: ['Omnivore', 'Pescatarian', 'Vegetarian', 'Vegan'], correctIndex: 3, explanation: 'A vegan diet typically has the lowest carbon footprint because it avoids all animal products, which are resource-intensive.' },
  { id: 'q4', question: 'Which of the following actions saves the most CO2 per year on average?', options: ['Using LED bulbs', 'Living car-free', 'Recycling', 'Washing clothes in cold water'], correctIndex: 1, explanation: 'Living car-free has one of the highest individual impacts, potentially saving over 2 tonnes of CO2 per year.' },
  { id: 'q5', question: 'If global food waste were a country, where would it rank in greenhouse gas emissions?', options: ['1st', '3rd', '10th', '15th'], correctIndex: 1, explanation: 'Food waste would be the 3rd largest emitter, behind only China and the USA.' }
];

export const MYTH_BUSTERS = [
  { id: 'm1', myth: 'My individual carbon footprint is too small to matter.', reality: 'While systemic change is needed, individual actions aggregate to massive impact, and consumer choices drive market shifts.', category: 'General' },
  { id: 'm2', myth: 'Going green means giving up all comforts.', reality: 'Many sustainable choices (like insulation, efficient appliances, and active transport) improve comfort, health, and save money.', category: 'General' },
  { id: 'm3', myth: 'Electric cars are worse for the environment because of their batteries.', reality: 'Over their lifetime, EVs produce significantly fewer emissions than petrol/diesel cars, even when accounting for battery manufacturing.', category: 'Transport' },
  { id: 'm4', myth: 'Local food is always the most eco-friendly choice.', reality: 'What you eat matters more than where it comes from. Transport is typically a small fraction of a food’s total footprint compared to production.', category: 'Diet' },
  { id: 'm5', myth: 'Planting trees is enough to offset my emissions.', reality: 'While reforestation is vital, we cannot plant enough trees to absorb current emission levels. Reducing emissions at the source is essential.', category: 'Lifestyle' }
];

export const COMPARISONS = [
  { id: 'c1', activity: '1 Transatlantic Flight', co2Kg: 1000, equivalent: 'Driving a car for 5,000 km', icon: 'plane' },
  { id: 'c2', activity: 'Producing 1kg of Beef', co2Kg: 60, equivalent: 'Driving a car for 300 km', icon: 'beef' },
  { id: 'c3', activity: '1 Year of Emails (avg user)', co2Kg: 135, equivalent: 'Driving a car for 675 km', icon: 'mail' },
  { id: 'c4', activity: 'Manufacturing 1 Smartphone', co2Kg: 55, equivalent: 'Watching 1,500 hours of streaming', icon: 'smartphone' },
  { id: 'c5', activity: '1 Year of a Vegan Diet vs Omnivore', co2Kg: 1000, equivalent: 'Saving 1 flight across the Atlantic', icon: 'leaf' }
];
