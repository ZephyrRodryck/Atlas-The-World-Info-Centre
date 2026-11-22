export interface TopicCheckpoint {
  id: string
  title: string
  short: string
  period: 'past' | 'present' | 'future'
  summary: string
  developments: string[]
  entities: string[]
}

export interface ConnectedEntity {
  name: string
  type: 'country' | 'organization' | 'person' | 'event' | 'topic'
  relevance: string
  code?: string // country code if applicable
  slug?: string // topic slug if applicable
}

export interface Topic {
  slug: string
  title: string
  domain: string
  overview: string
  checkpoints: TopicCheckpoint[]
  connections: ConnectedEntity[]
}

export const topics: Topic[] = [
  {
    slug: 'artificial-intelligence',
    title: 'Artificial Intelligence',
    domain: 'Technology',
    overview: 'The development of artificial intelligence represents one of the most consequential technological shifts in human history, reshaping economies, geopolitics, military strategy, and the nature of work itself.',
    checkpoints: [
      {
        id: 'origins',
        title: 'Origins & Foundations',
        short: 'Origins',
        period: 'past',
        summary: 'The theoretical and institutional foundations of artificial intelligence, from early computation theory to the establishment of AI as a field of research.',
        developments: [
          'Alan Turing\'s 1950 paper "Computing Machinery and Intelligence" proposed the foundational question of machine thought.',
          'The 1956 Dartmouth Workshop coined the term "artificial intelligence" and established it as a formal discipline.',
          'Early symbolic AI systems demonstrated rule-based reasoning but struggled with real-world complexity.',
          'The AI winters of the 1970s and 1980s followed cycles of overpromising and underfunding.',
        ],
        entities: ['Alan Turing', 'John McCarthy', 'DARPA', 'MIT AI Lab'],
      },
      {
        id: 'deep-learning-revolution',
        title: 'The Deep Learning Revolution',
        short: 'Deep Learning',
        period: 'past',
        summary: 'Neural networks, long dismissed as impractical, re-emerged through breakthroughs in architecture, training methods, and the availability of large datasets and GPU computing.',
        developments: [
          'Geoffrey Hinton\'s work on deep belief networks in 2006 reignited interest in neural approaches.',
          'AlexNet\'s 2012 ImageNet victory demonstrated the power of deep convolutional networks.',
          'The 2017 "Attention Is All You Need" paper introduced the transformer architecture.',
          'Transfer learning and pre-training made large models practical for downstream tasks.',
        ],
        entities: ['Geoffrey Hinton', 'Google Brain', 'NVIDIA', 'ImageNet'],
      },
      {
        id: 'generative-ai',
        title: 'The Generative AI Era',
        short: 'GenAI Era',
        period: 'present',
        summary: 'Large language models and generative AI systems have moved from research laboratories into widespread commercial and public use, triggering a global technology race.',
        developments: [
          'ChatGPT\'s November 2022 launch reached 100 million users faster than any previous technology product.',
          'Massive capital investment flows into AI infrastructure, with hyperscalers spending hundreds of billions.',
          'AI coding assistants, image generators, and reasoning systems are reshaping professional workflows.',
          'Open-source model ecosystems challenge proprietary approaches with increasingly capable alternatives.',
        ],
        entities: ['OpenAI', 'Anthropic', 'Google DeepMind', 'Meta AI', 'Microsoft'],
      },
      {
        id: 'global-competition',
        title: 'The Global AI Race',
        short: 'AI Race',
        period: 'present',
        summary: 'Artificial intelligence has become a central axis of geopolitical competition, with nations racing to develop capabilities while managing strategic dependencies.',
        developments: [
          'The United States and China account for the majority of global AI research output and investment.',
          'Export controls on advanced semiconductors have created new fault lines in technology supply chains.',
          'The European Union pursues a regulatory-first approach through the AI Act framework.',
          'Emerging AI powers including India, UAE, and Saudi Arabia invest heavily in sovereign capabilities.',
        ],
        entities: ['United States', 'China', 'European Union', 'TSMC', 'NVIDIA'],
      },
      {
        id: 'regulation-governance',
        title: 'Regulation & Governance',
        short: 'Governance',
        period: 'present',
        summary: 'Governments and international institutions are developing frameworks to govern AI development and deployment, balancing innovation with risk management.',
        developments: [
          'The EU AI Act establishes the first comprehensive regulatory framework for AI systems by risk category.',
          'The 2023 Bletchley Declaration brought together 28 nations on AI safety principles.',
          'US executive orders and voluntary commitments from AI companies shape emerging governance norms.',
          'Debates over open-source AI regulation pit safety concerns against innovation arguments.',
        ],
        entities: ['European Union', 'United Kingdom', 'United Nations', 'OECD'],
      },
      {
        id: 'labor-economy',
        title: 'AI & the Global Economy',
        short: 'Economy',
        period: 'present',
        summary: 'AI is reshaping labor markets, business models, and economic structures, with effects that are unevenly distributed across sectors and geographies.',
        developments: [
          'Knowledge work faces the most immediate disruption, reversing previous automation patterns that targeted manual labor.',
          'AI-driven productivity gains are concentrated in firms and economies with existing digital infrastructure.',
          'New AI-native business models emerge while traditional software companies race to integrate AI capabilities.',
          'Workforce retraining and education system adaptation lag behind the pace of technological change.',
        ],
        entities: ['World Economic Forum', 'International Labour Organization', 'McKinsey Global Institute'],
      },
      {
        id: 'agi-frontier',
        title: 'The Path Toward AGI',
        short: 'AGI Path',
        period: 'future',
        summary: 'The pursuit of artificial general intelligence — systems that match or exceed human cognitive capabilities across domains — represents the field\'s most ambitious and contested frontier.',
        developments: [
          'Leading AI laboratories publicly pursue AGI as an organizational objective with varying timelines.',
          'Scaling laws suggest continued capability improvements but face questions about data and compute limits.',
          'Novel architectures and training paradigms may be needed to achieve general reasoning capabilities.',
          'AI safety research investigates alignment techniques to ensure advanced systems remain beneficial.',
        ],
        entities: ['OpenAI', 'Anthropic', 'Google DeepMind', 'Alignment Research Center'],
      },
      {
        id: 'future-scenarios',
        title: 'Divergent Futures',
        short: 'Futures',
        period: 'future',
        summary: 'The trajectory of AI development could follow radically different paths depending on technical progress, governance decisions, and geopolitical dynamics.',
        developments: [
          'Scenario A: Broad economic transformation with managed transition, where AI augments human capabilities across sectors.',
          'Scenario B: Concentrated power, where a small number of entities control transformative AI capabilities.',
          'Scenario C: Fragmented development, where geopolitical competition produces incompatible AI ecosystems.',
          'Scenario D: Existential risk pathways that remain subject to intense scientific and philosophical debate.',
        ],
        entities: ['Future of Life Institute', 'Centre for AI Safety', 'Partnership on AI'],
      },
    ],
    connections: [
      { name: 'United States', type: 'country', code: 'US', relevance: 'Leads global AI research investment and hosts most frontier AI laboratories.' },
      { name: 'China', type: 'country', code: 'CN', relevance: 'Second-largest AI research ecosystem, pursuing technological self-sufficiency.' },
      { name: 'United Kingdom', type: 'country', code: 'GB', relevance: 'AI safety leadership through the AI Safety Institute and Bletchley process.' },
      { name: 'OpenAI', type: 'organization', relevance: 'Developer of GPT series and a central actor in the generative AI era.' },
      { name: 'Anthropic', type: 'organization', relevance: 'AI safety company developing Claude, focused on alignment research.' },
      { name: 'NVIDIA', type: 'organization', relevance: 'Dominant supplier of GPU hardware powering AI training and inference.' },
      { name: 'Semiconductor Competition', type: 'topic', slug: 'semiconductor-competition', relevance: 'The hardware supply chain underpinning AI capability development.' },
      { name: 'Climate Change', type: 'topic', slug: 'climate-change', relevance: 'AI energy consumption and potential for climate modeling applications.' },
    ],
  },
  {
    slug: 'climate-change',
    title: 'Climate Change',
    domain: 'Environment',
    overview: 'The accelerating transformation of Earth\'s climate system represents the defining environmental challenge of the 21st century, with consequences for every nation, economy, and ecosystem.',
    checkpoints: [
      {
        id: 'scientific-foundations',
        title: 'Scientific Foundations',
        short: 'Science',
        period: 'past',
        summary: 'The scientific understanding of greenhouse gas effects and climate systems developed over more than a century of research.',
        developments: [
          'Svante Arrhenius first calculated CO₂-driven warming in 1896.',
          'Charles David Keeling began systematic atmospheric CO₂ measurements at Mauna Loa in 1958.',
          'The Intergovernmental Panel on Climate Change was established in 1988 to synthesize climate science.',
          'Successive IPCC reports have strengthened the scientific consensus on anthropogenic warming.',
        ],
        entities: ['IPCC', 'NASA', 'NOAA', 'World Meteorological Organization'],
      },
      {
        id: 'diplomatic-history',
        title: 'Diplomatic History',
        short: 'Diplomacy',
        period: 'past',
        summary: 'Three decades of international climate negotiations have produced frameworks of varying ambition and effectiveness.',
        developments: [
          'The 1992 Rio Earth Summit established the UNFCCC framework for international climate cooperation.',
          'The 1997 Kyoto Protocol introduced binding emissions targets for developed nations.',
          'The 2015 Paris Agreement shifted to nationally determined contributions with a 1.5°C aspiration.',
          'COP processes continue to negotiate implementation, finance, and loss and damage mechanisms.',
        ],
        entities: ['United Nations', 'European Union', 'Small Island States Alliance'],
      },
      {
        id: 'current-trajectory',
        title: 'Current Emissions Trajectory',
        short: 'Trajectory',
        period: 'present',
        summary: 'Global emissions continue to rise despite decades of climate policy, with current trajectories significantly exceeding Paris Agreement targets.',
        developments: [
          'Global CO₂ emissions reached approximately 37 billion tonnes in recent years, with no clear peak in sight.',
          'The gap between stated national pledges and actions needed for 1.5°C continues to widen.',
          'Extreme weather events are increasing in frequency and intensity, consistent with climate projections.',
          'Tipping points in ice sheets, permafrost, and ocean circulation systems draw closer to activation thresholds.',
        ],
        entities: ['China', 'United States', 'India', 'European Union', 'Global Carbon Project'],
      },
      {
        id: 'energy-transition',
        title: 'The Energy Transition',
        short: 'Energy',
        period: 'present',
        summary: 'The global energy system is undergoing a transformation as renewable energy costs decline and deployment accelerates.',
        developments: [
          'Solar photovoltaic costs have fallen over 90% since 2010, making it the cheapest new electricity source in most markets.',
          'Electric vehicle adoption is accelerating, with EVs approaching 20% of new car sales globally.',
          'Energy storage deployment is growing rapidly but remains insufficient for grid-scale decarbonization.',
          'Fossil fuel interests and energy security concerns create political resistance to rapid transition.',
        ],
        entities: ['International Energy Agency', 'IRENA', 'Tesla', 'China', 'Saudi Arabia'],
      },
      {
        id: 'adaptation',
        title: 'Adaptation & Resilience',
        short: 'Adaptation',
        period: 'present',
        summary: 'As climate impacts intensify, adaptation and resilience-building have become essential complements to emissions reduction.',
        developments: [
          'Climate adaptation finance remains far below estimated needs, particularly in developing nations.',
          'Infrastructure, agriculture, and water systems face redesign requirements across vulnerable regions.',
          'Loss and damage mechanisms are emerging as a new pillar of international climate governance.',
          'Climate migration is becoming a significant demographic and political factor in multiple regions.',
        ],
        entities: ['World Bank', 'Green Climate Fund', 'Bangladesh', 'Pacific Island Nations'],
      },
      {
        id: 'climate-futures',
        title: 'Climate Futures',
        short: 'Futures',
        period: 'future',
        summary: 'The range of possible climate outcomes spans from managed transition to catastrophic warming, depending on near-term decisions.',
        developments: [
          'The 1.5°C target is likely to be exceeded within the next decade, shifting focus to overshoot and return scenarios.',
          'Carbon removal technologies face massive scaling challenges but may become essential for net-zero pathways.',
          'Geoengineering proposals raise profound governance questions alongside potential effectiveness.',
          'Generational shifts in political engagement may reshape climate policy ambition.',
        ],
        entities: ['IPCC', 'United Nations', 'European Union', 'Climate Analytics'],
      },
    ],
    connections: [
      { name: 'India', type: 'country', code: 'IN', relevance: 'Third-largest emitter navigating development needs with climate commitments.' },
      { name: 'China', type: 'country', code: 'CN', relevance: 'Largest emitter and largest renewable energy investor simultaneously.' },
      { name: 'Brazil', type: 'country', code: 'BR', relevance: 'Amazon deforestation dynamics directly affect global carbon cycles.' },
      { name: 'Bangladesh', type: 'country', code: 'BD', relevance: 'Among the most climate-vulnerable nations despite minimal emissions contribution.' },
      { name: 'United Nations', type: 'organization', relevance: 'Hosts UNFCCC and COP processes governing international climate cooperation.' },
      { name: 'Artificial Intelligence', type: 'topic', slug: 'artificial-intelligence', relevance: 'AI applications in climate modeling, energy optimization, and emissions monitoring.' },
    ],
  },
  {
    slug: 'semiconductor-competition',
    title: 'The Global Semiconductor Race',
    domain: 'Technology',
    overview: 'Semiconductors have become the most strategically important manufactured goods in the world, sitting at the intersection of technology competition, economic security, and geopolitical rivalry.',
    checkpoints: [
      {
        id: 'industry-origins',
        title: 'Industry Origins',
        short: 'Origins',
        period: 'past',
        summary: 'The semiconductor industry emerged from postwar American research and evolved into a globalized supply chain of extraordinary complexity.',
        developments: [
          'The transistor\'s invention at Bell Labs in 1947 launched the semiconductor era.',
          'Silicon Valley emerged as the center of chip innovation through the 1960s and 1970s.',
          'Japan\'s rise in memory chips in the 1980s triggered the first semiconductor trade tensions.',
          'The fabless-foundry model separated chip design from manufacturing, enabling TSMC\'s rise.',
        ],
        entities: ['Bell Labs', 'Intel', 'TSMC', 'Samsung'],
      },
      {
        id: 'supply-chain',
        title: 'The Global Supply Chain',
        short: 'Supply Chain',
        period: 'present',
        summary: 'The semiconductor supply chain is the most geographically concentrated and technologically complex manufacturing network ever constructed.',
        developments: [
          'TSMC manufactures over 90% of the world\'s most advanced chips in Taiwan.',
          'ASML\'s extreme ultraviolet lithography machines are the most complex devices ever manufactured.',
          'The COVID-era chip shortage exposed the fragility of just-in-time semiconductor supply chains.',
          'Each advanced chip requires materials and processes from dozens of countries.',
        ],
        entities: ['TSMC', 'ASML', 'Samsung', 'Taiwan', 'Netherlands'],
      },
      {
        id: 'us-china-rivalry',
        title: 'US–China Technology War',
        short: 'Tech War',
        period: 'present',
        summary: 'Semiconductor export controls have become the sharpest tool in the technological competition between the United States and China.',
        developments: [
          'US export controls restrict China\'s access to advanced chips and chip-making equipment.',
          'China\'s massive investment in domestic semiconductor capacity yields progress but lags at the frontier.',
          'Allied nations face pressure to align with US restrictions, creating diplomatic tensions.',
          'Huawei\'s Mate 60 Pro reveal demonstrated China\'s ability to advance despite restrictions.',
        ],
        entities: ['United States', 'China', 'Huawei', 'SMIC', 'Bureau of Industry and Security'],
      },
      {
        id: 'reshoring',
        title: 'Reshoring & Industrial Policy',
        short: 'Reshoring',
        period: 'present',
        summary: 'Major economies are investing unprecedented sums to build domestic chip manufacturing capacity.',
        developments: [
          'The US CHIPS Act allocates $52 billion to incentivize domestic semiconductor manufacturing.',
          'The EU Chips Act targets doubling Europe\'s share of global production by 2030.',
          'Japan and South Korea pursue parallel industrial strategies for chip sovereignty.',
          'India announces semiconductor fabrication initiatives to enter the manufacturing ecosystem.',
        ],
        entities: ['United States', 'European Union', 'Japan', 'South Korea', 'India'],
      },
      {
        id: 'ai-demand',
        title: 'AI-Driven Demand',
        short: 'AI Demand',
        period: 'present',
        summary: 'The generative AI explosion has created massive new demand for advanced semiconductors, particularly GPUs and custom AI accelerators.',
        developments: [
          'NVIDIA\'s data center revenue has grown by orders of magnitude driven by AI training demand.',
          'Custom AI chips from Google, Amazon, and Microsoft challenge NVIDIA\'s GPU dominance.',
          'AI chip demand is reshaping semiconductor investment priorities and manufacturing capacity allocation.',
          'Power consumption of AI data centers creates new infrastructure constraints.',
        ],
        entities: ['NVIDIA', 'Google', 'AMD', 'Broadcom', 'Artificial Intelligence'],
      },
      {
        id: 'future-architectures',
        title: 'Future of Computing',
        short: 'Future',
        period: 'future',
        summary: 'The end of traditional Moore\'s Law scaling is driving exploration of fundamentally new computing architectures.',
        developments: [
          'Chiplet architectures and advanced packaging enable continued performance scaling.',
          'Quantum computing progresses toward practical advantage in specific problem domains.',
          'Neuromorphic and photonic computing offer alternative paradigms for specialized workloads.',
          'The transition to new materials beyond silicon remains a long-term research frontier.',
        ],
        entities: ['IBM', 'Intel', 'Google Quantum AI', 'TSMC'],
      },
    ],
    connections: [
      { name: 'Taiwan', type: 'country', code: 'TW', relevance: 'Home to TSMC and the most concentrated point of failure in the global chip supply chain.' },
      { name: 'United States', type: 'country', code: 'US', relevance: 'Leads chip design and initiated export controls reshaping the industry.' },
      { name: 'China', type: 'country', code: 'CN', relevance: 'Largest chip consumer pursuing self-sufficiency under export control pressure.' },
      { name: 'Netherlands', type: 'country', code: 'NL', relevance: 'Home to ASML, sole manufacturer of EUV lithography systems.' },
      { name: 'South Korea', type: 'country', code: 'KR', relevance: 'Samsung and SK Hynix are major players in memory and advanced logic.' },
      { name: 'Artificial Intelligence', type: 'topic', slug: 'artificial-intelligence', relevance: 'Primary demand driver for advanced chip manufacturing capacity.' },
    ],
  },
  {
    slug: 'global-economic-order',
    title: 'The Shifting Global Economic Order',
    domain: 'Economics',
    overview: 'The post-World War II economic architecture is undergoing its most significant restructuring in decades, driven by geopolitical competition, technological disruption, and shifting centers of economic gravity.',
    checkpoints: [
      {
        id: 'bretton-woods',
        title: 'The Bretton Woods Legacy',
        short: 'Bretton Woods',
        period: 'past',
        summary: 'The institutions and norms established after World War II shaped seven decades of global economic governance.',
        developments: [
          'The 1944 Bretton Woods Conference established the IMF, World Bank, and dollar-based monetary system.',
          'The GATT and later WTO created a multilateral framework for trade liberalization.',
          'The Washington Consensus promoted market liberalization as the dominant development paradigm.',
          'The 2008 financial crisis exposed systemic fragilities and shifted economic power dynamics.',
        ],
        entities: ['IMF', 'World Bank', 'WTO', 'United States', 'G7'],
      },
      {
        id: 'rise-of-brics',
        title: 'The Rise of BRICS',
        short: 'BRICS',
        period: 'past',
        summary: 'Emerging economies grew from peripheral participants to central actors in the global economy.',
        developments: [
          'China\'s accession to the WTO in 2001 accelerated its emergence as the world\'s manufacturing center.',
          'India\'s services-led growth model created a parallel path to economic influence.',
          'The BRICS grouping expanded to include new members, signaling broader developing-world alignment.',
          'The New Development Bank and Asian Infrastructure Investment Bank challenged Western financial institutions.',
        ],
        entities: ['China', 'India', 'Brazil', 'Russia', 'South Africa', 'AIIB'],
      },
      {
        id: 'deglobalization',
        title: 'Fragmentation & Friendshoring',
        short: 'Fragmentation',
        period: 'present',
        summary: 'The era of deep economic integration is giving way to strategic competition and supply chain restructuring.',
        developments: [
          'Trade weaponization through tariffs, sanctions, and export controls reshapes commercial relationships.',
          'Friendshoring and nearshoring strategies prioritize geopolitical alignment over pure cost efficiency.',
          'Critical mineral supply chains are being restructured along alliance lines.',
          'The dollar\'s reserve currency status faces incremental challenges from alternative payment systems.',
        ],
        entities: ['United States', 'China', 'European Union', 'G20'],
      },
      {
        id: 'digital-economy',
        title: 'The Digital Economy',
        short: 'Digital',
        period: 'present',
        summary: 'Digital platforms, AI, and data have become central factors in economic competition and governance.',
        developments: [
          'Platform economies concentrate market power in a small number of technology companies.',
          'Digital taxation frameworks attempt to address profit shifting by multinational tech firms.',
          'Central bank digital currencies are under development or deployment in over 100 countries.',
          'AI is projected to add trillions to global GDP while disrupting existing employment structures.',
        ],
        entities: ['People\'s Bank of China', 'Federal Reserve', 'European Central Bank', 'BIS'],
      },
      {
        id: 'debt-sustainability',
        title: 'The Global Debt Challenge',
        short: 'Debt',
        period: 'present',
        summary: 'Rising debt levels across developed and developing economies create systemic risks and constrain policy options.',
        developments: [
          'Global debt has exceeded $300 trillion, with debt-to-GDP ratios at historic highs in many economies.',
          'Higher interest rates following the inflation surge have increased debt servicing burdens dramatically.',
          'Developing nations face a convergence of debt distress, climate vulnerability, and reduced access to capital.',
          'Sovereign debt restructuring mechanisms remain inadequate for the scale of emerging challenges.',
        ],
        entities: ['IMF', 'World Bank', 'Federal Reserve', 'Zambia', 'Sri Lanka'],
      },
      {
        id: 'future-order',
        title: 'The Emerging Order',
        short: 'Future Order',
        period: 'future',
        summary: 'The outlines of a new global economic architecture are emerging, though its final form remains contested.',
        developments: [
          'Multipolar economic governance may replace the US-led unipolar system with competing blocs.',
          'Climate transition creates both risks and opportunities for economic restructuring.',
          'AI and automation could reshape comparative advantage and global manufacturing patterns.',
          'New institutions and frameworks are needed to manage the intersection of economics and security.',
        ],
        entities: ['G20', 'BRICS', 'ASEAN', 'African Union'],
      },
    ],
    connections: [
      { name: 'United States', type: 'country', code: 'US', relevance: 'Architect of the postwar economic order now navigating its transformation.' },
      { name: 'China', type: 'country', code: 'CN', relevance: 'Central driver of economic rebalancing through industrial scale and institutional alternatives.' },
      { name: 'India', type: 'country', code: 'IN', relevance: 'Fastest-growing major economy and increasingly influential in economic governance.' },
      { name: 'Artificial Intelligence', type: 'topic', slug: 'artificial-intelligence', relevance: 'Projected to reshape global productivity and economic competition patterns.' },
      { name: 'Semiconductor Competition', type: 'topic', slug: 'semiconductor-competition', relevance: 'Technology supply chains are the new frontlines of economic security.' },
    ],
  },
  {
    slug: 'space-exploration',
    title: 'Space Exploration & the New Space Race',
    domain: 'Science',
    overview: 'Space has re-emerged as an arena of strategic competition and commercial opportunity, with new actors, technologies, and ambitions reshaping humanity\'s relationship with the cosmos.',
    checkpoints: [
      {
        id: 'space-race-origins',
        title: 'The Original Space Race',
        short: 'Cold War',
        period: 'past',
        summary: 'The Cold War competition between the US and Soviet Union drove the first era of human space exploration.',
        developments: [
          'Sputnik\'s 1957 launch shocked the world and initiated the space race.',
          'The Apollo program achieved six crewed Moon landings between 1969 and 1972.',
          'The Space Shuttle era shifted focus to low Earth orbit operations and station construction.',
          'The International Space Station became the largest cooperative science project in history.',
        ],
        entities: ['NASA', 'Soviet Space Program', 'ESA', 'United States', 'Russia'],
      },
      {
        id: 'commercial-revolution',
        title: 'The Commercial Revolution',
        short: 'Commercial',
        period: 'present',
        summary: 'Private companies have transformed space economics through reusable rockets, satellite constellations, and commercial services.',
        developments: [
          'SpaceX\'s reusable Falcon 9 and Starship have dramatically reduced launch costs.',
          'Satellite mega-constellations like Starlink provide global broadband from low Earth orbit.',
          'Blue Origin, Rocket Lab, and others create a competitive commercial launch market.',
          'Space tourism and in-space manufacturing represent emerging commercial frontiers.',
        ],
        entities: ['SpaceX', 'Blue Origin', 'Rocket Lab', 'OneWeb'],
      },
      {
        id: 'moon-mars',
        title: 'Return to the Moon & Mars',
        short: 'Moon & Mars',
        period: 'present',
        summary: 'Multiple nations and agencies are pursuing lunar return missions as stepping stones toward Mars exploration.',
        developments: [
          'NASA\'s Artemis program aims to establish sustainable lunar presence with international partners.',
          'China\'s Chang\'e program has achieved far-side landings and sample returns.',
          'India\'s Chandrayaan-3 successfully landed near the lunar south pole in 2023.',
          'SpaceX\'s Starship is designed for Mars transportation at a scale previously impossible.',
        ],
        entities: ['NASA', 'CNSA', 'ISRO', 'ESA', 'SpaceX'],
      },
      {
        id: 'space-security',
        title: 'Space & National Security',
        short: 'Security',
        period: 'present',
        summary: 'Space has become a contested military domain with anti-satellite capabilities, space-based surveillance, and emerging space force doctrines.',
        developments: [
          'The United States, China, India, and Russia have demonstrated anti-satellite capabilities.',
          'Space-based intelligence, navigation, and communication systems are critical military infrastructure.',
          'The establishment of dedicated space forces by multiple nations signals militarization concerns.',
          'Orbital debris from anti-satellite tests threatens the long-term usability of key orbits.',
        ],
        entities: ['US Space Force', 'China', 'Russia', 'NATO'],
      },
      {
        id: 'space-future',
        title: 'The Space Economy Ahead',
        short: 'Future',
        period: 'future',
        summary: 'The space economy is projected to grow dramatically, with new industries in resource utilization, manufacturing, and deep space exploration.',
        developments: [
          'The global space economy could exceed $1 trillion by the mid-2030s.',
          'Asteroid mining and lunar resource utilization remain speculative but increasingly studied.',
          'Space-based solar power could become viable with continued launch cost reductions.',
          'Human presence on Mars remains a generational ambition with significant technical challenges.',
        ],
        entities: ['SpaceX', 'NASA', 'CNSA', 'Luxembourg Space Agency'],
      },
    ],
    connections: [
      { name: 'United States', type: 'country', code: 'US', relevance: 'Leads in both government and commercial space capabilities.' },
      { name: 'China', type: 'country', code: 'CN', relevance: 'Rapidly advancing space program with independent station and lunar ambitions.' },
      { name: 'India', type: 'country', code: 'IN', relevance: 'Cost-effective space program achieving lunar landing and Mars orbiter success.' },
      { name: 'Semiconductor Competition', type: 'topic', slug: 'semiconductor-competition', relevance: 'Space systems depend on radiation-hardened chip supply chains.' },
      { name: 'Artificial Intelligence', type: 'topic', slug: 'artificial-intelligence', relevance: 'AI enables autonomous navigation, Earth observation analysis, and mission planning.' },
    ],
  },
]

export const topicBySlug = new Map(topics.map(t => [t.slug, t]))

export function searchTopics(query: string): Topic[] {
  const q = query.toLowerCase()
  return topics.filter(t =>
    t.title.toLowerCase().includes(q) ||
    t.domain.toLowerCase().includes(q) ||
    t.slug.includes(q)
  )
}
