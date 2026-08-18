export type Job = {
  company: string;
  position: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
};
export type Project = {
  name: string;
  start: string;
  end: string;
  bullets: string[];
};
export type Cert = { name: string; org: string; date: string };

export type Persona = {
  photo: string;
  fullName: string;
  location: string;
  phone: string;
  email: string;
  links: string[];
  summary: string;
  work: Job[];
  skills: { category: string; items: string[] };
  projects: Project[];
  certs: Cert[];
  education: {
    name: string;
    location: string;
    start: string;
    end: string;
    degree: string;
    gpa: string;
    note: string;
  };
};

/**
 * Ten shared personas — layout-agnostic resume content. Screenshot generation
 * maps every template preset onto one of these via a seeded shuffle, so a
 * persona is reused across many templates instead of each template owning its
 * own content.
 */
export const PERSONAS: Persona[] = [
  {
    photo: "https://i.pravatar.cc/320?img=13",
    fullName: "David Park",
    location: "San Francisco, CA",
    phone: "+1 (415) 555-0148",
    email: "david.park@hey.com",
    links: [
      "https://www.linkedin.com/in/davidpark",
      "https://davidpark.design",
    ],
    summary: "<p>Senior product designer with 8 years crafting intuitive B2B SaaS experiences. I drive design from research to polished UI, partnering closely with engineering to ship measurable improvements. I care deeply about accessible, systematic design and building teams that ship consistently great work.</p>",
    work: [
      {
        company: "Lumen Software",
        position: "Senior Product Designer",
        location: "San Francisco, CA",
        start: "Apr 2021",
        end: "current",
        bullets: [
          "Redesigned the onboarding flow, raising activation by 31% across self-serve plans and reducing time-to-value from 14 to 6 days.",
          "Built and governed a 60-component design system adopted by 12 product teams, with documentation, Figma libraries, and automated accessibility checks.",
          "Established a weekly research practice that shipped 40+ validated improvements a year, cutting usability bug reports by half.",
          "Led cross-functional design sprints that accelerated discovery-to-handoff cycles from 6 weeks to 3 weeks for three major features.",
        ],
      },
      {
        company: "Brightpath",
        position: "Product Designer",
        location: "Oakland, CA",
        start: "Jul 2017",
        end: "Mar 2021",
        bullets: [
          "Owned design for the billing and admin areas of a 500k-user platform, delivering a cohesive experience across 40+ screens.",
          "Partnered with PMs to cut support tickets 24% through clearer flows, better empty states, and contextual inline help.",
          "Conducted 30+ usability sessions that directly informed a major navigation restructuring, reducing task completion time by 35%.",
        ],
      },
      {
        company: "Foundry Labs",
        position: "Product Designer",
        location: "San Francisco, CA",
        start: "Jun 2015",
        end: "Jun 2017",
        bullets: [
          "Shipped the company's first design system and supported 3 product launches, accelerating the design-to-dev handoff by 40%.",
          "Designed and prototyped a mobile-first dashboard that increased daily active engagement by 22% among pilot customers.",
        ],
      },
      {
        company: "Nexus Design",
        position: "Junior Designer",
        location: "San Francisco, CA",
        start: "Aug 2013",
        end: "May 2015",
        bullets: [
          "Produced wireframes, mockups, and clickable prototypes for 8 client engagements across e-commerce and healthcare.",
          "Built reusable UI kits that shortened project kickoff timelines by 2 weeks per engagement.",
        ],
      },
    ],
    skills: {
      category: "Design",
      items: [
        "Figma",
        "Design Systems",
        "User Research",
        "Prototyping",
        "Accessibility",
        "Design Ops",
        "Motion Design",
        "Workshop Facilitation",
      ],
    },
    projects: [
      {
        name: "Insights Suite Redesign",
        start: "Feb 2023",
        end: "Nov 2023",
        bullets: [
          "Led the end-to-end redesign of the analytics suite, validated through 20 usability sessions with power users.",
          "Shipped a WCAG AA–compliant interface that lifted weekly active usage by 18% and reduced time-to-insight by 40%.",
          "Collaborated with engineering to implement a flexible charting architecture, enabling self-serve metric creation.",
        ],
      },
      {
        name: "Design System 2.0",
        start: "Jan 2022",
        end: "Jun 2022",
        bullets: [
          "Unified design tokens across web and mobile, halving design-to-dev handoff time and eliminating visual drift.",
          "Published a contribution framework that onboarded 4 new contributors in the first quarter.",
        ],
      },
      {
        name: "Mobile Wallet Experience",
        start: "Mar 2021",
        end: "Aug 2021",
        bullets: [
          "Designed a mobile-first wallet feature that increased in-app payments adoption by 28% within 3 months.",
          "Iterated through 5 rounds of prototype testing to nail the micro-interactions and error states.",
        ],
      },
    ],
    certs: [
      {
        name: "Certified Usability Analyst",
        org: "Human Factors International",
        date: "Mar 2021",
      },
      {
        name: "Google UX Design Certificate",
        org: "Google",
        date: "Aug 2020",
      },
      {
        name: "Figma Advanced Prototyping",
        org: "Figma Academy",
        date: "Jan 2022",
      },
    ],
    education: {
      name: "Rhode Island School of Design",
      location: "Providence, RI",
      start: "Aug 2012",
      end: "May 2016",
      degree: "B.F.A. in Graphic Design",
      gpa: "3.8 / 4.0",
      note: "Concentration in interaction design; led the senior thesis exhibition on inclusive interfaces and won the department portfolio award.",
    },
  },
  {
    photo: "https://i.pravatar.cc/320?img=69",
    fullName: "Marcus Reed",
    location: "New York, NY",
    phone: "+1 (212) 555-0193",
    email: "marcus.reed@gmail.com",
    links: [
      "https://www.linkedin.com/in/marcusreed",
      "https://marcusreed.co",
    ],
    summary: "<p>Growth marketing manager with a decade scaling demand for consumer and B2B brands. I pair sharp analytics with creative storytelling to build acquisition engines that compound over time. I love turning fuzzy business goals into measurable programs and building teams that own the full marketing funnel.</p>",
    work: [
      {
        company: "Northwind Media",
        position: "Growth Marketing Manager",
        location: "New York, NY",
        start: "Jun 2020",
        end: "current",
        bullets: [
          "Scaled paid acquisition across 6 channels (Google Ads, Meta, LinkedIn, Reddit, TikTok, affiliates), growing qualified leads 2.4x year over year while reducing blended CPA by 18%.",
          "Rebuilt the lifecycle program with behaviour-triggered journeys, lifting trial-to-paid conversion by 22% and reducing churn by 15%.",
          "Led and coached a team of 5 marketers across content, paid, and lifecycle, instituting weekly growth meetings and shared goal-setting.",
          "Implemented a multi-touch attribution model that shifted budget allocation and recovered $320k in annual wasted spend.",
        ],
      },
      {
        company: "Brightwave",
        position: "Marketing Specialist",
        location: "New York, NY",
        start: "Jul 2016",
        end: "May 2020",
        bullets: [
          "Owned SEO strategy and grew organic traffic 3x over two years by building a content hub of 200+ articles and technical SEO improvements.",
          "Launched a referral program that drove 15% of new signups within its first quarter, with a viral coefficient of 0.8.",
          "Managed the email marketing calendar and grew the subscriber base from 40k to 180k through lead-magnet campaigns.",
        ],
      },
      {
        company: "Cobalt Agency",
        position: "Marketing Coordinator",
        location: "New York, NY",
        start: "Jun 2014",
        end: "Jun 2016",
        bullets: [
          "Managed multi-channel campaigns for 8 clients across finance, health, and retail verticals, consistently exceeding ROAS targets.",
          "Built weekly performance reporting dashboards in Google Data Studio, enabling real-time budget reallocation decisions.",
        ],
      },
      {
        company: "Summit Media Group",
        position: "Junior Analyst",
        location: "New York, NY",
        start: "Aug 2012",
        end: "May 2014",
        bullets: [
          "Analysed campaign performance data for a $5M annual ad spend portfolio, identifying optimisation opportunities that improved average ROAS by 25%.",
          "Automated recurring reporting workflows with Python scripts, saving the analytics team 10 hours per week.",
        ],
      },
    ],
    skills: {
      category: "Marketing",
      items: [
        "SEO / SEM",
        "Lifecycle Marketing",
        "Analytics",
        "A/B Testing",
        "HubSpot",
        "Copywriting",
        "Google Ads",
        "Tableau",
      ],
    },
    projects: [
      {
        name: "Lifecycle Revamp",
        start: "Mar 2023",
        end: "Dec 2023",
        bullets: [
          "Rebuilt onboarding and re-engagement journeys across email and push notifications, incorporating behaviour-based segmentation.",
          "Drove a 27% increase in 30-day retention through personalised content recommendations and milestone-triggered messages.",
          "Reduced unsubscribe rate by 18% by introducing preference centres and frequency controls.",
        ],
      },
      {
        name: "Brand Relaunch",
        start: "Jan 2022",
        end: "Jun 2022",
        bullets: [
          "Led a full rebrand and website refresh that increased demo requests by 40% and lifted brand recall scores by 22 points.",
          "Coordinated cross-functional teams across design, engineering, and PR to ship on a 6-month timeline.",
        ],
      },
      {
        name: "Paid Acquisition Engine",
        start: "Sep 2021",
        end: "Feb 2022",
        bullets: [
          "Built a semi-automated campaign creation framework that reduced launch time for new ad experiments from 3 days to 4 hours.",
          "Scaled TikTok from zero to 12% of total lead volume within 4 months through iterative creative testing.",
        ],
      },
      {
        name: "Customer Intelligence Platform",
        start: "Jan 2020",
        end: "Jun 2020",
        bullets: [
          "Selected and deployed a CDP (Segment) to unify customer data across 7 sources, enabling single-customer-view targeting.",
          "Integrated CDP data with HubSpot and Google Analytics, enabling closed-loop campaign attribution.",
        ],
      },
    ],
    certs: [
      {
        name: "HubSpot Inbound Marketing",
        org: "HubSpot Academy",
        date: "Apr 2021",
      },
      {
        name: "Google Analytics Certification",
        org: "Google",
        date: "Feb 2020",
      },
      {
        name: "Meta Certified Digital Marketing Associate",
        org: "Meta",
        date: "Oct 2021",
      },
      {
        name: "Product-Led Growth Certificate",
        org: "ProductLed",
        date: "Aug 2022",
      },
    ],
    education: {
      name: "New York University",
      location: "New York, NY",
      start: "Aug 2010",
      end: "May 2014",
      degree: "B.A. in Communications",
      gpa: "3.7 / 4.0",
      note: "Minor in Marketing; led the student-run media collective, growing its readership to 12k monthly and managing a $25k ad budget.",
    },
  },
  {
    photo: "https://i.pravatar.cc/320?img=15",
    fullName: "James Wilson",
    location: "London, UK",
    phone: "+44 20 7946 0312",
    email: "james.wilson@outlook.com",
    links: [
      "https://www.linkedin.com/in/jameswilson",
      "https://github.com/jwilson",
    ],
    summary: "<p>Senior data scientist with 7 years turning messy data into production ML systems across fintech and marketplace domains. I ship models that move core business metrics with a bias for simple, well-monitored systems over clever ones. Experienced in leading technical projects and mentoring junior data scientists.</p>",
    work: [
      {
        company: "Meridian Analytics",
        position: "Senior Data Scientist",
        location: "London, UK",
        start: "Sep 2021",
        end: "current",
        bullets: [
          "Built a churn-prediction model (XGBoost, ROC-AUC 0.91) that informed retention spend and saved an estimated £1.8M annually in preventable churn.",
          "Deployed a real-time feature pipeline with Kafka and Redis, cutting model inference latency by 60% and enabling same-day feature updates.",
          "Mentored 3 analysts to data-scientist level through structured pair-programming, code reviews, and a custom ML curriculum.",
          "Established the team's experimentation standards, including power-analysis templates and a Bayesian A/B testing framework.",
        ],
      },
      {
        company: "FinEdge",
        position: "Data Scientist",
        location: "London, UK",
        start: "Jun 2018",
        end: "Aug 2021",
        bullets: [
          "Developed credit-risk models (gradient boosting, logistic regression) that reduced default rates by 12% within the consumer lending portfolio.",
          "Built an internal experimentation platform with self-serve dashboards that was adopted across 4 product teams, running 200+ experiments per quarter.",
          "Created a feature store (Feast-based) that centralised 150+ features and reduced model development time from 6 weeks to 2 weeks.",
        ],
      },
      {
        company: "Datanova Labs",
        position: "Data Analyst",
        location: "London, UK",
        start: "Jul 2016",
        end: "May 2018",
        bullets: [
          "Built SQL pipelines and executive dashboards in Looker that became the company's metrics source of truth for revenue, retention, and growth.",
          "Collaborated with the product team to instrument event tracking, uncovering a 30% drop-off in the signup funnel that led to a redesigned onboarding flow.",
        ],
      },
    ],
    skills: {
      category: "Data Science",
      items: [
        "Python",
        "SQL",
        "PyTorch",
        "Spark",
        "A/B Testing",
        "MLflow",
        "Kubernetes",
        "Feature Stores",
      ],
    },
    projects: [
      {
        name: "Fraud Detection Engine",
        start: "Apr 2023",
        end: "Jan 2024",
        bullets: [
          "Designed a gradient-boosted fraud model (LightGBM) with a 0.94 ROC-AUC in production, processing 50k transactions per day.",
          "Reduced false positives by 35% while holding recall steady, saving the manual review team 200+ hours per month.",
          "Built a drift-monitoring dashboard that alerted the team to data shifts within 15 minutes, preventing model decay.",
        ],
      },
      {
        name: "Demand Forecasting",
        start: "Feb 2022",
        end: "Oct 2022",
        bullets: [
          "Shipped weekly demand forecasts using Prophet and ARIMA, cutting stockout rates by 19% across 500 SKUs.",
          "Built an automated retraining pipeline that updated models every Sunday with no human intervention.",
        ],
      },
      {
        name: "Customer Segmentation",
        start: "Mar 2021",
        end: "Aug 2021",
        bullets: [
          "Developed an RFM-based segmentation model that identified 6 distinct customer personas, enabling targeted marketing campaigns.",
          "Segmentation-driven campaigns achieved 2.3x higher engagement rates compared to broadcast email sends.",
        ],
      },
    ],
    certs: [
      {
        name: "TensorFlow Developer Certificate",
        org: "Google",
        date: "Jun 2022",
      },
      {
        name: "AWS Certified Machine Learning – Specialty",
        org: "Amazon Web Services",
        date: "Mar 2021",
      },
      {
        name: "Deep Learning Specialisation",
        org: "DeepLearning.AI",
        date: "Nov 2020",
      },
    ],
    education: {
      name: "Imperial College London",
      location: "London, UK",
      start: "Sep 2016",
      end: "Jun 2018",
      degree: "M.Sc. in Statistics (Machine Learning)",
      gpa: "Distinction",
      note: "Dissertation on probabilistic forecasting with deep ensembles; awarded the department prize for best applied research project.",
    },
  },
  {
    photo: "https://i.pravatar.cc/320?img=14",
    fullName: "Dr. Omar Rahman",
    location: "Boston, MA",
    phone: "+1 (617) 555-0177",
    email: "o.rahman@mit.edu",
    links: [
      "https://www.linkedin.com/in/omarrahman",
      "https://omarrahman.science",
    ],
    summary: "<p>Research scientist in machine learning and NLP with 14 peer-reviewed publications. I lead funded studies, advise graduate students, and translate research into deployable, reproducible systems. My work focuses on robust language understanding, low-resource NLP, and open-science practices that accelerate the field.</p>",
    work: [
      {
        company: "MIT Media Lab",
        position: "Postdoctoral Research Scientist",
        location: "Cambridge, MA",
        start: "Aug 2021",
        end: "current",
        bullets: [
          "Lead an NSF-funded study on robust language models, mentoring 4 PhD students and managing a $1.2M grant budget.",
          "Published 8 papers at ACL, NeurIPS, and EMNLP over three years, including 2 oral presentations and 1 best-paper nomination.",
          "Serve as a reviewer for ACL and NeurIPS and co-organise a yearly workshop on evaluation methodologies in NLP.",
          "Developed and open-sourced a benchmark toolkit that has been downloaded 50k+ times and adopted by 30+ research groups.",
        ],
      },
      {
        company: "Allen Institute for AI",
        position: "Research Intern",
        location: "Seattle, WA",
        start: "Jun 2020",
        end: "Aug 2020",
        bullets: [
          "Contributed to an open-source NLP toolkit now used by thousands of researchers, implementing 3 new model architectures.",
          "Led a sub-project on cross-lingual transfer that resulted in a first-author paper at EMNLP 2020.",
        ],
      },
      {
        company: "Stanford NLP Group",
        position: "Graduate Research Assistant",
        location: "Stanford, CA",
        start: "Sep 2016",
        end: "Jun 2021",
        bullets: [
          "Led 3 research projects on adversarial robustness and evaluation, resulting in 5 publications and an open-source benchmark.",
          "TA'd the graduate machine learning course for 4 terms, earning a teaching excellence award.",
          "Mentored 6 undergraduate researchers, 3 of whom went on to PhD programmes at top institutions.",
        ],
      },
    ],
    skills: {
      category: "Research",
      items: [
        "Machine Learning",
        "NLP",
        "Statistical Modeling",
        "PyTorch",
        "Transformers",
        "LaTeX",
        "Python",
        "Open Science",
      ],
    },
    projects: [
      {
        name: "Low-Resource Translation Toolkit",
        start: "Jan 2022",
        end: "Mar 2024",
        bullets: [
          "Developed transfer-learning methods improving BLEU by 6.2 points on 4 low-resource language pairs from the Flores benchmark.",
          "Released an open dataset and fine-tuning toolkit now used by 30+ research groups and 3 industry teams.",
          "Published the work at ACL 2023 with accompanying model weights and evaluation harness.",
        ],
      },
      {
        name: "Robust QA Benchmark",
        start: "Mar 2021",
        end: "Dec 2021",
        bullets: [
          "Released an adversarial QA benchmark with 5k examples spanning 12 distinct perturbation types, adopted by 5 research labs.",
          "Demonstrated that state-of-the-art models at the time dropped 28% in accuracy on the benchmark, sparking follow-up work across the community.",
        ],
      },
      {
        name: "Reproducibility Study",
        start: "Sep 2020",
        end: "Jun 2021",
        bullets: [
          "Systematically reproduced 15 recent NLP papers, finding that only 60% of claimed results were replicable with released code and data.",
          "Co-authored a reproducibility report published at ACL 2021, leading to updated author guidelines at 2 conferences.",
        ],
      },
    ],
    certs: [
      {
        name: "Deep Learning Specialisation",
        org: "DeepLearning.AI",
        date: "Jul 2020",
      },
      {
        name: "Teaching Excellence Certificate",
        org: "Stanford CTL",
        date: "May 2019",
      },
      {
        name: "Responsible AI Practices",
        org: "Google AI",
        date: "Mar 2022",
      },
    ],
    education: {
      name: "Stanford University",
      location: "Stanford, CA",
      start: "Sep 2015",
      end: "Jun 2021",
      degree: "Ph.D. in Computer Science",
      gpa: "—",
      note: "Dissertation on robust language understanding under distribution shift; recipient of a graduate research fellowship and the School of Engineering outstanding thesis award.",
    },
  },
  {
    photo: "https://i.pravatar.cc/320?img=68",
    fullName: "Oliver Brandt",
    location: "Berlin, Germany",
    phone: "+49 30 1234 5678",
    email: "oliver.brandt@posteo.de",
    links: [
      "https://www.linkedin.com/in/oliverbrandt",
      "https://oliverbrandt.xyz",
    ],
    summary: "<p>Lead UX researcher blending qualitative depth with quantitative rigour. I turn evidence into product decisions that teams actually act on, and I build research practices that scale beyond a single squad. Experienced in health-tech and B2B SaaS with a focus on accessibility and inclusive design.</p>",
    work: [
      {
        company: "Atlas Health",
        position: "Lead UX Researcher",
        location: "Berlin, Germany",
        start: "Jul 2021",
        end: "current",
        bullets: [
          "Ran mixed-methods research that reshaped the care-navigation roadmap for 3 squads, influencing 15+ features that improved task success from 62% to 84%.",
          "Built a searchable research repository (Dovetail + Airtable) that doubled reuse of insights across teams and reduced duplicated studies by 40%.",
          "Mentored 2 junior researchers and standardized the team's study templates, consent forms, and analysis frameworks.",
          "Established a quarterly benchmark study across 6 core flows, tracking usability scores and driving continuous improvement.",
        ],
      },
      {
        company: "Modeo",
        position: "UX Researcher",
        location: "Berlin, Germany",
        start: "Sep 2017",
        end: "Jun 2021",
        bullets: [
          "Ran 100+ studies spanning discovery, usability, and concept testing across web and mobile platforms.",
          "Built and managed a 500-person research panel for rapid participant recruitment, reducing study setup time from 3 weeks to 3 days.",
          "Developed a research prioritisation framework aligned with product OKRs, ensuring the highest-impact questions were addressed first.",
        ],
      },
      {
        company: "Kontor Digital",
        position: "Research Assistant",
        location: "Berlin, Germany",
        start: "Sep 2015",
        end: "Aug 2017",
        bullets: [
          "Coordinated participant recruitment and research scheduling for a 6-person team, managing 40+ concurrent studies.",
          "Assisted with qualitative analysis, coding 200+ interview transcripts and synthesising findings into actionable reports.",
        ],
      },
    ],
    skills: {
      category: "UX Research",
      items: [
        "User Interviews",
        "Survey Design",
        "Usability Testing",
        "Dovetail",
        "Synthesis",
        "Workshops",
        "Quantitative Analysis",
        "ResearchOps",
      ],
    },
    projects: [
      {
        name: "Care Navigation Study",
        start: "Mar 2023",
        end: "Oct 2023",
        bullets: [
          "Led a 40-participant longitudinal diary study that uncovered 5 critical drop-off points in the patient care journey.",
          "Recommendations from the study shipped in 3 consecutive releases, improving overall task success from 62% to 84%.",
          "Presented findings to the executive team, securing buy-in and budget for a dedicated patient experience programme.",
        ],
      },
      {
        name: "Onboarding Benchmark",
        start: "Jan 2022",
        end: "Sep 2022",
        bullets: [
          "Established a quarterly usability benchmark across 6 core flows, with standardised tasks, metrics, and reporting templates.",
          "After 2 benchmark cycles, the team had addressed the top 10 usability issues, lifting mean SUS scores by 18 points.",
        ],
      },
      {
        name: "Accessibility Audit Programme",
        start: "Jan 2021",
        end: "Jun 2021",
        bullets: [
          "Audited the entire product against WCAG 2.1 AA standards, identifying 47 unique accessibility issues across 4 platforms.",
          "Partnered with design and engineering to prioritise fixes, achieving WCAG AA compliance certification within 6 months.",
        ],
      },
    ],
    certs: [
      {
        name: "UX Research Certification",
        org: "Nielsen Norman Group",
        date: "Jun 2021",
      },
      {
        name: "Qualtrics Research Core Expert",
        org: "Qualtrics",
        date: "Mar 2020",
      },
      {
        name: "Certified Usability Analyst",
        org: "Human Factors International",
        date: "Apr 2019",
      },
    ],
    education: {
      name: "Technische Universität Berlin",
      location: "Berlin, Germany",
      start: "Oct 2014",
      end: "Sep 2017",
      degree: "M.A. in Human Factors",
      gpa: "1.3 (German scale)",
      note: "Research focus on mixed-methods evaluation in digital health; thesis on trust calibration in AI-assisted diagnosis received the faculty's best-thesis award.",
    },
  },
  {
    photo: "https://i.pravatar.cc/320?img=68",
    fullName: "Patrick Sullivan",
    location: "Austin, TX",
    phone: "+1 (512) 555-0287",
    email: "patrick.sullivan@gmail.com",
    links: [
      "https://www.linkedin.com/in/patricksullivan",
      "https://github.com/psullivan",
    ],
    summary: "<p>Full-stack software engineer with 8 years building consumer and SaaS products from concept to scale. I move fluidly across frontend, backend, and infrastructure, and I care deeply about developer experience, testing, and shipping code that's a pleasure to maintain. I thrive in early-stage environments where ownership and impact are high.</p>",
    work: [
      {
        company: "Rivet Software",
        position: "Senior Full-Stack Engineer",
        location: "Austin, TX",
        start: "Sep 2021",
        end: "current",
        bullets: [
          "Built the initial product and scaled it from 0 to 50k users as the third engineering hire, owning the full stack from React frontend to Postgres + Go backend.",
          "Designed and implemented a real-time collaboration engine using WebSockets and CRDTs, enabling multi-user document editing with sub-100ms latency.",
          "Established engineering practices: CI/CD pipeline, code review standards, incident response runbook, and a testing culture that achieved 90% coverage.",
          "Interviewed and onboarded 12 engineers, shaping the engineering team's culture and technical direction from the ground up.",
        ],
      },
      {
        company: "Greenline Financial",
        position: "Full-Stack Engineer",
        location: "Austin, TX",
        start: "Jan 2018",
        end: "Aug 2021",
        bullets: [
          "Led the frontend architecture for a personal finance app serving 500k users, migrating from a legacy jQuery codebase to React + TypeScript.",
          "Designed a GraphQL API layer that unified 6 disparate backend services, reducing frontend data-fetch complexity by 60%.",
          "Implemented a feature flag system that enabled trunk-based development for a team of 15 engineers, cutting release cycle from 3 weeks to 3 days.",
        ],
      },
      {
        company: "Kickstand Digital",
        position: "Software Engineer",
        location: "Austin, TX",
        start: "Mar 2016",
        end: "Dec 2017",
        bullets: [
          "Built and maintained web applications for 8 agency clients across healthcare, education, and e-commerce verticals.",
          "Developed a reusable internal starter kit (React + Node + Postgres) that reduced project setup time by 50% across the engineering team.",
        ],
      },
      {
        company: "Startup Studio",
        position: "Junior Developer",
        location: "Austin, TX",
        start: "Jun 2014",
        end: "Feb 2016",
        bullets: [
          "Contributed to 4 early-stage startup products, shipping production code across frontend, backend, and cloud infrastructure.",
          "Built automated end-to-end test suites using Cypress that caught 30+ regressions before they reached production.",
        ],
      },
    ],
    skills: {
      category: "Full-Stack Engineering",
      items: [
        "React",
        "TypeScript",
        "Go",
        "PostgreSQL",
        "GraphQL",
        "Docker",
        "AWS",
        "Elixir",
      ],
    },
    projects: [
      {
        name: "Real-Time Collaboration Engine",
        start: "Feb 2023",
        end: "Dec 2023",
        bullets: [
          "Designed and implemented a CRDT-based collaboration engine from scratch, supporting concurrent editing with automatic conflict resolution.",
          "Achieved sub-100ms sync latency across US and EU regions using WebSockets with backpressure-aware message batching.",
        ],
      },
      {
        name: "API Gateway Rewrite",
        start: "Apr 2022",
        end: "Sep 2022",
        bullets: [
          "Rewrote the API gateway in Go, reducing p99 latency from 450ms to 80ms and cutting infrastructure costs by 35% through efficient connection pooling.",
          "Implemented rate limiting, authentication, and request logging as middleware, following a plugin architecture that made adding new policies straightforward.",
        ],
      },
      {
        name: "Developer Onboarding Platform",
        start: "Jan 2021",
        end: "Jun 2021",
        bullets: [
          "Built a self-service onboarding platform with sandbox environments, interactive API docs, and sample applications in 5 languages.",
          "Reduced average developer onboarding time from 5 days to 1 day, improving the team's NPS score from 32 to 68.",
        ],
      },
      {
        name: "Legacy Migration Toolkit",
        start: "May 2020",
        end: "Oct 2020",
        bullets: [
          "Developed an automated migration toolkit that analysed jQuery codebases and generated React component equivalents with 80% accuracy.",
          "The toolkit accelerated the legacy migration by 3 months, saving an estimated $180k in engineering costs.",
        ],
      },
    ],
    certs: [
      {
        name: "AWS Certified Developer – Associate",
        org: "Amazon Web Services",
        date: "Mar 2022",
      },
      {
        name: "CKAD: Certified Kubernetes Application Developer",
        org: "CNCF",
        date: "Nov 2021",
      },
      {
        name: "Meta Back-End Developer Certificate",
        org: "Meta",
        date: "Aug 2020",
      },
    ],
    education: {
      name: "University of Texas at Austin",
      location: "Austin, TX",
      start: "Aug 2010",
      end: "May 2014",
      degree: "B.S. in Computer Science",
      gpa: "3.72 / 4.0",
      note: "Minor in Mathematics; senior capstone on collaborative text editing using operational transformation. Active in the ACM programming club and hackathon circuit.",
    },
  },
  {
    photo: "https://i.pravatar.cc/320?img=57",
    fullName: "Calvin Hughes",
    location: "Chicago, IL",
    phone: "+1 (312) 555-0418",
    email: "calvin.hughes@outlook.com",
    links: [
      "https://www.linkedin.com/in/calvinhughes",
      "https://calvinhughes.co",
    ],
    summary: "<p>Content strategist and marketing writer with 8 years crafting brand stories for B2B SaaS and consumer tech companies. I translate technical concepts into compelling narratives that drive awareness, engagement, and conversion. I build content operations that scale, from editorial calendars to SEO frameworks to distribution playbooks.</p>",
    work: [
      {
        company: "North Bridge Software",
        position: "Senior Content Strategist",
        location: "Chicago, IL",
        start: "Jun 2021",
        end: "current",
        bullets: [
          "Built the content marketing programme from scratch, growing organic blog traffic from 5k to 120k monthly visits within 18 months through SEO-driven editorial strategy.",
          "Developed a content framework that mapped each stage of the buyer journey, producing 80+ articles, 12 guides, and 6 case studies that contributed to $2.4M in attributed pipeline.",
          "Managed a team of 3 writers and a network of 8 freelance contributors, establishing editorial standards, a content calendar, and a performance review cadence.",
          "Partnered with product marketing to launch 4 product campaigns, writing landing pages, email sequences, and sales collateral that achieved a 22% average conversion rate.",
        ],
      },
      {
        company: "Lakeside Media Group",
        position: "Content Marketing Manager",
        location: "Chicago, IL",
        start: "Jan 2018",
        end: "May 2021",
        bullets: [
          "Led content strategy for a portfolio of 5 B2B tech clients, growing their combined organic traffic by 180% over 2 years.",
          "Wrote and edited 200+ long-form articles, white papers, and eBooks, with 4 pieces ranking #1 for high-volume target keywords.",
          "Implemented a content distribution playbook covering email, LinkedIn, and paid promotion that increased content-generated leads by 3x.",
        ],
      },
      {
        company: "Windy City Content",
        position: "Content Writer",
        location: "Chicago, IL",
        start: "Jul 2015",
        end: "Dec 2017",
        bullets: [
          "Wrote blog posts, case studies, and website copy for 12+ clients in the SaaS, finance, and professional services sectors.",
          "Developed a data-driven approach to content performance analysis, using Google Analytics and Search Console insights to inform editorial strategy.",
        ],
      },
      {
        company: "Midwest Publishing",
        position: "Junior Copywriter",
        location: "Chicago, IL",
        start: "Sep 2013",
        end: "Jun 2015",
        bullets: [
          "Wrote and edited content for 3 trade publications covering technology and business topics, with a monthly output of 20+ articles.",
          "Conducted interviews with industry executives and synthesised insights into reported feature articles.",
        ],
      },
    ],
    skills: {
      category: "Content Strategy",
      items: [
        "SEO",
        "Content Marketing",
        "Editorial Strategy",
        "Copywriting",
        "Brand Voice",
        "Analytics",
        "WordPress",
        "HubSpot",
      ],
    },
    projects: [
      {
        name: "Content Engine Build",
        start: "Jan 2023",
        end: "Dec 2023",
        bullets: [
          "Designed and launched a content engine producing 20+ pieces per month across blog, LinkedIn, and YouTube, growing total content-attributed pipeline by 180%.",
          "Established an editorial workflow with topic clustering, keyword research, first-draft templates, and a data-driven content scoring system.",
          "Reduced content production cost per piece by 35% while maintaining quality scores above 4.5 / 5 in reader satisfaction surveys.",
        ],
      },
      {
        name: "Website Content Overhaul",
        start: "Mar 2022",
        end: "Oct 2022",
        bullets: [
          "Led a comprehensive rewrite of all website content — product pages, about pages, case studies, and resource centre — aligned to a new messaging framework.",
          "The revamped site achieved a 28% improvement in bounce rate and a 35% increase in demo request conversion rate.",
        ],
      },
      {
        name: "SEO Growth Initiative",
        start: "Aug 2021",
        end: "Feb 2022",
        bullets: [
          "Executed a technical SEO overhaul combined with a content cluster strategy that grew organic traffic from 5k to 50k monthly visits in 6 months.",
          "Identified and optimised 30 high-opportunity keyword clusters, 8 of which reached the top 3 positions in SERPs.",
        ],
      },
      {
        name: "Thought Leadership Programme",
        start: "Jan 2021",
        end: "Jul 2021",
        bullets: [
          "Developed an executive thought leadership programme that produced 12 bylined articles in tier-1 publications (Forbes, TechCrunch, Inc.).",
          "The programme generated 500+ inbound leads in its first quarter and positioned the CEO as a recognised industry voice.",
        ],
      },
    ],
    certs: [
      {
        name: "HubSpot Content Marketing Certification",
        org: "HubSpot Academy",
        date: "Mar 2022",
      },
      {
        name: "Google Analytics Individual Qualification",
        org: "Google",
        date: "Jan 2022",
      },
      {
        name: "SEMrush SEO Toolkit Certification",
        org: "SEMrush Academy",
        date: "Aug 2021",
      },
      {
        name: "Reforge Content-Led Growth",
        org: "Reforge",
        date: "Nov 2022",
      },
    ],
    education: {
      name: "Northwestern University",
      location: "Evanston, IL",
      start: "Sep 2009",
      end: "Jun 2013",
      degree: "B.S. in Journalism",
      gpa: "3.74 / 4.0",
      note: "Specialised in magazine writing and digital media; managed the university's student-run online publication, growing readership from 8k to 35k monthly. Minored in marketing.",
    },
  },
  {
    photo: "https://i.pravatar.cc/320?img=54",
    fullName: "Kwame Osei",
    location: "Toronto, ON",
    phone: "+1 (416) 555-0173",
    email: "kwame.osei@hey.com",
    links: [
      "https://www.linkedin.com/in/kwameosei",
      "https://github.com/kwameosei",
    ],
    summary: "<p>Data scientist with 7 years turning messy product telemetry into decisions leadership actually makes. I build the model, the pipeline that feeds it, and the dashboard that explains it, then stay close enough to the business to know when a simpler answer wins.</p>",
    work: [
      {
        company: "Northwind Analytics",
        position: "Senior Data Scientist",
        location: "Toronto, ON",
        start: "May 2021",
        end: "current",
        bullets: [
          "Built a churn model that flagged at-risk accounts 6 weeks earlier than the previous heuristic, guiding retention plays worth $4.2M in saved ARR.",
          "Replaced a nightly batch pipeline with an incremental dbt build, cutting warehouse spend 38% and shrinking data latency from 14 hours to 40 minutes.",
          "Ran the experimentation review for 60+ tests a year, killing three shipped-by-default features whose lift did not survive a sequential test.",
          "Mentored 4 analysts into full-stack modelling work, two of whom now own their own product areas.",
        ],
      },
      {
        company: "Marrow Health",
        position: "Data Scientist",
        location: "Toronto, ON",
        start: "Aug 2018",
        end: "Apr 2021",
        bullets: [
          "Developed a triage-time forecasting model deployed across 9 clinics, reducing average patient wait by 22 minutes at peak hours.",
          "Standardised a feature store that removed four duplicate definitions of 'active patient' and ended a recurring reporting dispute.",
          "Published the team's first model card template, later adopted as the clinical review requirement for every deployed model.",
        ],
      },
      {
        company: "Beacon Retail Group",
        position: "Analytics Engineer",
        location: "Mississauga, ON",
        start: "Jun 2016",
        end: "Jul 2018",
        bullets: [
          "Rebuilt demand forecasting for 240 stores, cutting overstock write-offs by 17% in the first full season.",
          "Automated a weekly merchandising report that had consumed two analyst-days per week.",
        ],
      },
    ],
    skills: {
      category: "Data & Modelling",
      items: [
        "Python",
        "SQL",
        "dbt",
        "PyTorch",
        "Causal Inference",
        "Airflow",
        "Snowflake",
        "Experimentation",
      ],
    },
    projects: [
      {
        name: "Retention Model Rewrite",
        start: "Mar 2023",
        end: "Dec 2023",
        bullets: [
          "Rewrote the churn pipeline around survival analysis, improving 90-day precision from 0.41 to 0.63.",
          "Shipped a self-serve cohort explorer so CS could interrogate predictions without asking the data team.",
          "Instrumented drift monitoring that has caught two silent upstream schema changes since launch.",
        ],
      },
      {
        name: "Experiment Platform",
        start: "Jan 2022",
        end: "Aug 2022",
        bullets: [
          "Built sequential testing into the internal A/B tool, ending the habit of peeking at running tests.",
          "Cut average experiment runtime by 30% through variance reduction on pre-experiment covariates.",
        ],
      },
    ],
    certs: [
      {
        name: "Professional Data Engineer",
        org: "Google Cloud",
        date: "Sep 2022",
      },
      {
        name: "dbt Analytics Engineering",
        org: "dbt Labs",
        date: "Feb 2021",
      },
    ],
    education: {
      name: "University of Waterloo",
      location: "Waterloo, ON",
      start: "Sep 2012",
      end: "Jun 2016",
      degree: "B.Math. in Statistics",
      gpa: "3.9 / 4.0",
      note: "Minor in computing; undergraduate thesis on hierarchical models for sparse retail demand, presented at the departmental research symposium.",
    },
  },
  {
    photo: "https://i.pravatar.cc/320?img=60",
    fullName: "Rio Baskoro",
    location: "Bandung, Indonesia",
    phone: "+62 812 5566 7788",
    email: "rio.baskoro@proton.me",
    links: [
      "https://www.linkedin.com/in/riobaskoro",
      "https://riobaskoro.dev",
    ],
    summary: "<p>Front-end engineer with 6 years building internal tools that people are required to use, which is a harder audience than customers. I care about the boring wins: fewer clicks, faster tables, states that explain themselves.</p>",
    work: [
      {
        company: "Sinar Digital",
        position: "Senior Front-End Engineer",
        location: "Bandung, Indonesia",
        start: "Mar 2022",
        end: "current",
        bullets: [
          "Rebuilt the operations console around a virtualised table, taking a 12-second render on 50k rows down to under 400ms.",
          "Led the migration off a jQuery admin panel one route at a time, shipping continuously instead of holding a six-month rewrite.",
          "Set up visual regression testing across 40 shared components, ending a recurring class of silent layout breakages.",
          "Ran the front-end guild: weekly reviews, a documented component API standard, and onboarding that takes two days instead of two weeks.",
        ],
      },
      {
        company: "Kirana Tech",
        position: "Front-End Engineer",
        location: "Jakarta, Indonesia",
        start: "Jul 2019",
        end: "Feb 2022",
        bullets: [
          "Built the merchant dashboard used by 8,000 sellers, from data fetching layer to accessible chart components.",
          "Cut bundle size 46% by code-splitting per route and dropping three overlapping date libraries.",
          "Introduced typed API clients generated from the backend schema, removing an entire category of runtime shape bugs.",
        ],
      },
      {
        company: "Studio Ombak",
        position: "Junior Web Developer",
        location: "Bandung, Indonesia",
        start: "Aug 2017",
        end: "Jun 2019",
        bullets: [
          "Delivered 14 client sites on a shared component base, cutting project setup from a week to a day.",
          "Handled the CMS integration work that let non-technical clients stop filing content tickets.",
        ],
      },
    ],
    skills: {
      category: "Front-End",
      items: [
        "TypeScript",
        "React",
        "Next.js",
        "Tailwind CSS",
        "React Query",
        "Storybook",
        "Playwright",
        "Figma",
      ],
    },
    projects: [
      {
        name: "Operations Console V2",
        start: "Apr 2023",
        end: "Jan 2024",
        bullets: [
          "Redesigned the console around saved views and keyboard navigation, cutting average task time 38%.",
          "Shipped an offline-tolerant queue so field staff stopped losing work on flaky connections.",
        ],
      },
      {
        name: "Component Library",
        start: "Sep 2022",
        end: "Mar 2023",
        bullets: [
          "Published 40 components with documented props, accessibility notes, and visual tests.",
          "Adopted by four product squads within a quarter, retiring two competing internal kits.",
        ],
      },
    ],
    certs: [
      {
        name: "Certified Scrum Developer",
        org: "Scrum Alliance",
        date: "Nov 2021",
      },
      {
        name: "Web Accessibility Specialist",
        org: "IAAP",
        date: "Jun 2023",
      },
    ],
    education: {
      name: "Institut Teknologi Bandung",
      location: "Bandung, Indonesia",
      start: "Aug 2013",
      end: "Jul 2017",
      degree: "B.S. in Informatics",
      gpa: "3.6 / 4.0",
      note: "Focus on human-computer interaction; final project was a scheduling tool adopted by two campus departments after the pilot.",
    },
  },
  {
    photo: "https://randomuser.me/api/portraits/men/83.jpg",
    fullName: "Michael Nwosu",
    location: "Birmingham, United Kingdom",
    phone: "+44 7700 516 284",
    email: "michael.nwosu@email.com",
    links: [
      "https://www.linkedin.com/in/michael-nwosu",
      "https://michaelnwosu.co.uk",
    ],
    summary: "<p>Commercial sales professional with over 8 years in B2B, account development, and client retention. Track record of growing revenue, strengthening customer relationships, and improving sales processes across competitive markets. Brings a proactive approach to pipeline management, cross-functional collaboration, and consistent quota delivery.</p>",
    work: [
      {
        company: "Westford Commercial Services",
        position: "Sales Manager",
        location: "Birmingham, United Kingdom",
        start: "Jan 2022",
        end: "current",
        bullets: [
          "Managed the regional sales pipeline and exceeded annual revenue targets by 14%, closing £4.2m across logistics and professional services accounts.",
          "Led account growth plans for 20 key clients, lifting average contract value by 22% through structured quarterly business reviews.",
          "Improved close rates from 18% to 27% with stronger qualification criteria and a disciplined follow-up cadence.",
          "Coached a team of 6 executives, taking three from below quota to consistent overperformance within two quarters.",
        ],
      },
      {
        company: "Brightlane Solutions",
        position: "Senior Sales Executive",
        location: "Nottingham, United Kingdom",
        start: "May 2019",
        end: "Dec 2021",
        bullets: [
          "Owned the full sales cycle from prospecting to negotiation and contract closure, delivering 118% of target across three consecutive years.",
          "Built long-term client relationships that increased renewals by 31% and opened upsell opportunities worth £600k annually.",
          "Partnered with marketing on campaign targeting, improving lead quality and doubling conversion from enquiry to qualified opportunity.",
        ],
      },
      {
        company: "Hartwell Systems",
        position: "Sales Coordinator",
        location: "Leicester, United Kingdom",
        start: "Jul 2017",
        end: "Apr 2019",
        bullets: [
          "Supported sales reporting, CRM hygiene, and weekly pipeline coordination for a team of 12.",
          "Contributed to outreach campaigns that expanded the qualified prospect pipeline by 45% year on year.",
        ],
      },
    ],
    skills: {
      category: "Commercial Sales",
      items: [
        "Account Management",
        "B2B Sales",
        "Lead Generation",
        "CRM Systems",
        "Negotiation",
        "Sales Forecasting",
        "Pipeline Management",
      ],
    },
    projects: [
      {
        name: "Regional Pipeline Overhaul",
        start: "Feb 2023",
        end: "Nov 2023",
        bullets: [
          "Rebuilt the qualification framework and stage definitions in HubSpot, cutting stalled opportunities by 40%.",
          "Introduced weekly forecast reviews that brought quarterly forecast accuracy from 71% to 94%.",
        ],
      },
      {
        name: "Key Account Growth Programme",
        start: "Mar 2022",
        end: "Dec 2022",
        bullets: [
          "Designed a tiered account plan for the top 20 clients, generating £1.1m of incremental revenue in its first year.",
        ],
      },
    ],
    certs: [
      {
        name: "HubSpot Sales Software Certification",
        org: "HubSpot Academy",
        date: "Feb 2023",
      },
      {
        name: "Salesforce Certified Associate",
        org: "Salesforce",
        date: "Jun 2022",
      },
      {
        name: "Level 4 Certificate in Sales Management",
        org: "Institute of Sales Professionals",
        date: "Sep 2021",
      },
    ],
    education: {
      name: "Aston University",
      location: "Birmingham, United Kingdom",
      start: "Sep 2014",
      end: "Jun 2017",
      degree: "BA (Hons) Business Management",
      gpa: "First Class Honours",
      note: "Placement year in commercial operations; dissertation on retention economics in B2B service contracts.",
    },
  }
];
