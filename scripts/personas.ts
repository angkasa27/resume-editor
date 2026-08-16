import type { PdfLayoutId } from "@/features/resume-editor/domain/presentation/pdf-presentation";

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
  layoutId: PdfLayoutId;
  /** Curated template this shot advertises — real presets, so gallery and carousel match. */
  presetId: string;
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

// One persona per preset — the carousel advertises the gallery, so every preset
// needs its own shot (public/templates/<presetId>.webp).
export const PERSONAS: Persona[] = [
  // Row 1
  {
    layoutId: "classic",
    presetId: "classic-modern",
    photo: "https://i.pravatar.cc/320?img=13",
    fullName: "David Park",
    location: "San Francisco, CA",
    phone: "+1 (415) 555-0148",
    email: "david.park@hey.com",
    links: [
      "https://www.linkedin.com/in/davidpark",
      "https://davidpark.design",
    ],
    summary:
      "<p>Senior product designer with 8 years crafting intuitive B2B SaaS experiences. I drive design from research to polished UI, partnering closely with engineering to ship measurable improvements. I care deeply about accessible, systematic design and building teams that ship consistently great work.</p>",
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
      { name: "Google UX Design Certificate", org: "Google", date: "Aug 2020" },
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
    layoutId: "modern-centered",
    presetId: "centered-ocean",
    photo: "https://i.pravatar.cc/320?img=69",
    fullName: "Marcus Reed",
    location: "New York, NY",
    phone: "+1 (212) 555-0193",
    email: "marcus.reed@gmail.com",
    links: ["https://www.linkedin.com/in/marcusreed", "https://marcusreed.co"],
    summary:
      "<p>Growth marketing manager with a decade scaling demand for consumer and B2B brands. I pair sharp analytics with creative storytelling to build acquisition engines that compound over time. I love turning fuzzy business goals into measurable programs and building teams that own the full marketing funnel.</p>",
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
    layoutId: "timeline",
    presetId: "timeline-indigo",
    photo: "https://i.pravatar.cc/320?img=15",
    fullName: "James Wilson",
    location: "London, UK",
    phone: "+44 20 7946 0312",
    email: "james.wilson@outlook.com",
    links: [
      "https://www.linkedin.com/in/jameswilson",
      "https://github.com/jwilson",
    ],
    summary:
      "<p>Senior data scientist with 7 years turning messy data into production ML systems across fintech and marketplace domains. I ship models that move core business metrics with a bias for simple, well-monitored systems over clever ones. Experienced in leading technical projects and mentoring junior data scientists.</p>",
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
    layoutId: "academic",
    presetId: "academic-oxford",
    photo: "https://i.pravatar.cc/320?img=14",
    fullName: "Dr. Omar Rahman",
    location: "Boston, MA",
    phone: "+1 (617) 555-0177",
    email: "o.rahman@mit.edu",
    links: [
      "https://www.linkedin.com/in/omarrahman",
      "https://omarrahman.science",
    ],
    summary:
      "<p>Research scientist in machine learning and NLP with 14 peer-reviewed publications. I lead funded studies, advise graduate students, and translate research into deployable, reproducible systems. My work focuses on robust language understanding, low-resource NLP, and open-science practices that accelerate the field.</p>",
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
      { name: "Responsible AI Practices", org: "Google AI", date: "Mar 2022" },
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
    layoutId: "inset",
    presetId: "inset-steel",
    photo: "https://i.pravatar.cc/320?img=68",
    fullName: "Oliver Brandt",
    location: "Berlin, Germany",
    phone: "+49 30 1234 5678",
    email: "oliver.brandt@posteo.de",
    links: [
      "https://www.linkedin.com/in/oliverbrandt",
      "https://oliverbrandt.xyz",
    ],
    summary:
      "<p>Lead UX researcher blending qualitative depth with quantitative rigour. I turn evidence into product decisions that teams actually act on, and I build research practices that scale beyond a single squad. Experienced in health-tech and B2B SaaS with a focus on accessibility and inclusive design.</p>",
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

  // Row 2: alt variants
  {
    layoutId: "classic",
    presetId: "classic-executive",
    photo: "https://i.pravatar.cc/320?img=11",
    fullName: "Ethan Foster",
    location: "Austin, TX",
    phone: "+1 (512) 555-0317",
    email: "ethan.foster@hey.com",
    links: [
      "https://www.linkedin.com/in/ethanfoster",
      "https://github.com/efoster",
    ],
    summary:
      "<p>Engineering manager with 10+ years building and leading distributed-systems teams. I combine hands-on technical depth with a passion for growing engineers through coaching, clear expectations, and psychological safety. I believe high-performing teams ship better systems and happier people.</p>",
    work: [
      {
        company: "Stellarite",
        position: "Engineering Manager",
        location: "Austin, TX",
        start: "Jun 2021",
        end: "current",
        bullets: [
          "Managed a team of 8 engineers owning the core platform API, delivering 3 major product launches on schedule while maintaining 99.99% uptime.",
          "Restructured the team from feature teams to stream-aligned teams, reducing handoff delays by 40% and improving cycle time by 35%.",
          "Introduced weekly one-on-ones, growth plans, and a structured promotion process that increased team retention from 70% to 94% over 2 years.",
          "Drove adoption of engineering KPIs (DORA metrics) across the organisation, making delivery performance visible and actionable.",
        ],
      },
      {
        company: "CloudPeak Networks",
        position: "Senior Software Engineer",
        location: "Austin, TX",
        start: "Mar 2017",
        end: "May 2021",
        bullets: [
          "Designed and built a multi-region event-ingestion pipeline handling 500k events/second with Kafka and Flink.",
          "Reduced infrastructure costs by 30% through right-sizing, reserved-instance planning, and adopting spot instances for batch workloads.",
          "Mentored 4 engineers through architecture reviews and code quality initiatives, 2 of whom were promoted to senior within 18 months.",
        ],
      },
      {
        company: "DataBridge Systems",
        position: "Software Engineer",
        location: "Austin, TX",
        start: "Apr 2014",
        end: "Feb 2017",
        bullets: [
          "Built real-time data synchronisation services between on-premise and cloud databases, handling 10TB+ daily transfers.",
          "Developed a circuit-breaker and retry framework that reduced inter-service failure cascades by 80%.",
        ],
      },
      {
        company: "CodeLabs Inc.",
        position: "Junior Software Engineer",
        location: "Dallas, TX",
        start: "Jun 2012",
        end: "Mar 2014",
        bullets: [
          "Developed RESTful microservices in Go and Python for a B2B inventory management platform serving 500+ retail clients.",
          "Built monitoring dashboards and alerting rules that reduced incident response time from 45 minutes to 12 minutes.",
        ],
      },
    ],
    skills: {
      category: "Engineering Leadership",
      items: [
        "Team Management",
        "System Design",
        "Go",
        "Kubernetes",
        "PostgreSQL",
        "Kafka",
        "AWS",
        "Coaching",
      ],
    },
    projects: [
      {
        name: "Platform Migration to Kubernetes",
        start: "Jan 2022",
        end: "Oct 2022",
        bullets: [
          "Led the migration of 30+ services from EC2-based deployment to EKS, achieving zero-downtime cutover with blue-green deployment strategies.",
          "Standardised Helm charts and CI/CD pipelines, reducing new-service deployment setup from 2 weeks to 2 hours.",
          "Trained 5 teams on Kubernetes best practices through workshops and office-hours support.",
        ],
      },
      {
        name: "Engineering Metrics Dashboard",
        start: "Jun 2021",
        end: "Nov 2021",
        bullets: [
          "Built an internal dashboard tracking DORA metrics, sprint health, and team sentiment across 10 engineering teams.",
          "The dashboard became the single source of truth for weekly leadership reviews and quarterly planning.",
        ],
      },
      {
        name: "Incident Response Revamp",
        start: "Feb 2020",
        end: "Jul 2020",
        bullets: [
          "Redesigned the incident response process, introducing severity classifications, escalation paths, and post-mortem templates.",
          "Reduced mean time to acknowledge from 15m to 3m and mean time to resolve from 90m to 38m over 6 months.",
        ],
      },
    ],
    certs: [
      {
        name: "AWS Certified Solutions Architect – Professional",
        org: "Amazon Web Services",
        date: "Mar 2022",
      },
      {
        name: "Certified Kubernetes Administrator",
        org: "CNCF",
        date: "Aug 2021",
      },
      {
        name: "Google Cloud Professional Cloud Architect",
        org: "Google Cloud",
        date: "Nov 2020",
      },
      {
        name: "ICAgile Certified Professional",
        org: "ICAgile",
        date: "Jun 2021",
      },
    ],
    education: {
      name: "University of Texas at Austin",
      location: "Austin, TX",
      start: "Aug 2008",
      end: "May 2012",
      degree: "B.S. in Computer Science",
      gpa: "3.75 / 4.0",
      note: "Specialised in distributed computing; capstone project on consensus algorithms implemented in Go. Led the UT CS student organisation for 2 years.",
    },
  },
  {
    layoutId: "modern-centered",
    presetId: "centered-editorial",
    photo: "https://i.pravatar.cc/320?img=53",
    fullName: "Jack Morrison",
    location: "San Diego, CA",
    phone: "+1 (619) 555-0382",
    email: "jack.morrison@gmail.com",
    links: [
      "https://www.linkedin.com/in/jackmorrison",
      "https://jackmorrison.io",
    ],
    summary:
      "<p>Product manager with 8 years shipping developer tools and SaaS platforms. I bridge technical depth with user empathy to build products that solve real problems. I'm experienced in the full product lifecycle from customer discovery through launch and iteration, with a track record of growing products from zero to millions in ARR.</p>",
    work: [
      {
        company: "CodeStream",
        position: "Senior Product Manager",
        location: "San Diego, CA",
        start: "Feb 2021",
        end: "current",
        bullets: [
          "Owned the product strategy for a developer collaboration platform, growing ARR from $800k to $4.2M over 3 years through new features and market expansion.",
          "Led discovery for a code review AI assistant that became the highest-converting feature in the product, with 40% of new trials citing it as the primary reason for purchasing.",
          "Established a continuous discovery practice with weekly customer interviews, reducing feature rejection rate from 45% to 12%.",
          "Collaborated with engineering to implement a phased rollout strategy that reduced regression incidents by 60% while accelerating release frequency from monthly to weekly.",
        ],
      },
      {
        company: "Vector Labs",
        position: "Product Manager",
        location: "San Diego, CA",
        start: "May 2017",
        end: "Jan 2021",
        bullets: [
          "Launched an API analytics product from concept to GA, achieving 500+ paying customers and $1.2M ARR within 18 months.",
          "Prioritised and shipped 30+ features in the first year by running structured opportunity-solution trees and quarterly OKR planning.",
          "Partnered with marketing to create developer-focused content (docs, tutorials, reference apps) that drove a 3x increase in organic signups.",
        ],
      },
      {
        company: "Brightbyte",
        position: "Associate Product Manager",
        location: "San Diego, CA",
        start: "Aug 2015",
        end: "Apr 2017",
        bullets: [
          "Managed the API integration layer for a payment processing platform, onboarding 15 major enterprise partners.",
          "Defined and tracked product KPIs (activation, retention, NPS) that informed roadmap decisions and quarterly priorities.",
        ],
      },
    ],
    skills: {
      category: "Product Management",
      items: [
        "Product Strategy",
        "User Research",
        "A/B Testing",
        "SQL",
        "Analytics",
        "Roadmapping",
        "API Design",
        "Cross-functional Leadership",
      ],
    },
    projects: [
      {
        name: "Code Review AI Assistant",
        start: "Mar 2023",
        end: "Feb 2024",
        bullets: [
          "Led the discovery, prototyping, and launch of an AI-powered code review assistant that suggests improvements inline.",
          "Achieved 35% adoption among active users within 3 months, with an average rating of 4.6 / 5 in user satisfaction surveys.",
          "The feature contributed to a 28% increase in trial-to-paid conversion for teams evaluating the platform.",
        ],
      },
      {
        name: "Market Expansion to Enterprise",
        start: "Jan 2022",
        end: "Dec 2022",
        bullets: [
          "Developed and executed the enterprise go-to-market strategy, including SSO, RBAC, and audit-log features required by procurement teams.",
          "Closed 3 Fortune 500 accounts in the first 6 months, contributing $600k in new ARR and validating the enterprise segment.",
        ],
      },
      {
        name: "Developer Onboarding Revamp",
        start: "May 2021",
        end: "Oct 2021",
        bullets: [
          "Redesigned the developer onboarding flow based on 40 customer interviews and usability tests, improving time-to-first-API-call from 4 hours to 25 minutes.",
          "The improved onboarding drove a 22% increase in 7-day activation rates and reduced support tickets related to setup by 45%.",
        ],
      },
    ],
    certs: [
      {
        name: "Certified Scrum Product Owner",
        org: "Scrum Alliance",
        date: "Feb 2020",
      },
      {
        name: "Google Project Management Certificate",
        org: "Google",
        date: "Aug 2021",
      },
      { name: "Reforge Product Strategy", org: "Reforge", date: "May 2022" },
      {
        name: "AWS Cloud Practitioner",
        org: "Amazon Web Services",
        date: "Nov 2020",
      },
    ],
    education: {
      name: "University of California, San Diego",
      location: "San Diego, CA",
      start: "Sep 2009",
      end: "Jun 2013",
      degree: "B.S. in Cognitive Science (Specialisation in HCI)",
      gpa: "3.65 / 4.0",
      note: "Minor in Computer Science; designed and evaluated a collaborative coding tool for the senior HCI capstone, winning the department's innovation award.",
    },
  },
  {
    layoutId: "timeline",
    presetId: "timeline-amber",
    photo: "https://i.pravatar.cc/320?img=61",
    fullName: "Benjamin Cole",
    location: "Chicago, IL",
    phone: "+1 (312) 555-0291",
    email: "benjamin.cole@hey.com",
    links: [
      "https://www.linkedin.com/in/benjamincole",
      "https://github.com/bcole",
    ],
    summary:
      "<p>Quantitative analyst turned data engineer with 6 years building data pipelines and financial models. I bridge the gap between quantitative research and production engineering, turning complex models into reliable, well-tested systems. I focus on data quality, reproducibility, and building infrastructure that scales with the business.</p>",
    work: [
      {
        company: "Crossvine Capital",
        position: "Senior Data Engineer",
        location: "Chicago, IL",
        start: "Jul 2021",
        end: "current",
        bullets: [
          "Built a real-time market data pipeline processing 10M+ events per second using Kafka, Flink, and Delta Lake, reducing end-to-end latency from 30s to 2s.",
          "Designed a data quality framework that automated schema validation and anomaly detection, catching 95% of data issues before they reached downstream models.",
          "Led the migration of on-premise data warehouse to Snowflake, cutting query costs by 40% and enabling self-serve analytics for 50+ users.",
          "Mentored 3 data engineers through a structured growth programme, with 2 promoted to senior within 18 months.",
        ],
      },
      {
        company: "Meridian Alpha",
        position: "Data Engineer",
        location: "Chicago, IL",
        start: "Sep 2018",
        end: "Jun 2021",
        bullets: [
          "Developed ETL pipelines aggregating trade, risk, and reference data from 20+ sources into a unified analytics platform.",
          "Reduced pipeline failure rate from 15% to 0.5% by implementing idempotent processing, dead-letter queues, and automated retries.",
          "Collaborated with quantitative researchers to deploy production versions of research models, improving model deployment velocity by 3x.",
        ],
      },
      {
        company: "Lakefront Analytics",
        position: "Data Analyst",
        location: "Chicago, IL",
        start: "Jul 2016",
        end: "Aug 2018",
        bullets: [
          "Built reporting dashboards and ad-hoc analyses for the investment team, supporting portfolio decisions with 200+ reports delivered monthly.",
          "Developed a Python library for automated SEC filing parsing that saved 20 hours of manual work per quarter.",
        ],
      },
    ],
    skills: {
      category: "Data Engineering",
      items: [
        "Python",
        "SQL",
        "Kafka",
        "Spark",
        "Snowflake",
        "Airflow",
        "dbt",
        "Delta Lake",
      ],
    },
    projects: [
      {
        name: "Market Data Lake",
        start: "Apr 2023",
        end: "Mar 2024",
        bullets: [
          "Architected a data lake on AWS S3 + Delta Lake storing 500TB of historical market data with partition pruning and Z-order optimisation.",
          "Reduced ad-hoc query times from 45 minutes to under 2 minutes through careful partitioning and materialised aggregations.",
          "Built a data catalog with Apache Atlas that enabled data discovery and lineage tracking across all engineering teams.",
        ],
      },
      {
        name: "Real-Time Risk Dashboard",
        start: "Jan 2022",
        end: "Sep 2022",
        bullets: [
          "Built a real-time risk exposure dashboard streaming portfolio data at 1-second intervals using Kafka + WebSockets.",
          "The dashboard became the primary tool for the risk committee, replacing a batch-report system that had a 4-hour delay.",
        ],
      },
      {
        name: "Data Pipeline Monitoring",
        start: "May 2021",
        end: "Oct 2021",
        bullets: [
          "Implemented end-to-end pipeline monitoring with Great Expectations and Datadog, tracking data freshness, row counts, and schema changes.",
          "Reduced data incident detection time from hours to minutes, enabling the team to resolve issues before downstream consumers were affected.",
        ],
      },
    ],
    certs: [
      {
        name: "AWS Certified Data Analytics – Specialty",
        org: "Amazon Web Services",
        date: "Sep 2022",
      },
      {
        name: "Snowflake SnowPro Advanced: Data Engineer",
        org: "Snowflake",
        date: "Mar 2023",
      },
      {
        name: "Confluent Certified Developer for Apache Kafka",
        org: "Confluent",
        date: "Jan 2022",
      },
    ],
    education: {
      name: "University of Chicago",
      location: "Chicago, IL",
      start: "Sep 2014",
      end: "Jun 2016",
      degree: "M.S. in Computational Analytics",
      gpa: "3.85 / 4.0",
      note: "Focused on large-scale data systems and machine learning; thesis on real-time anomaly detection in financial time series using streaming algorithms. Research assistant in the Data Science Institute.",
    },
  },
  {
    layoutId: "academic",
    presetId: "academic-burgundy",
    photo: "https://i.pravatar.cc/320?img=53",
    fullName: "Thomas Whitfield",
    location: "Cambridge, UK",
    phone: "+44 1223 555 0135",
    email: "thomas.whitfield@cantab.ac.uk",
    links: [
      "https://www.linkedin.com/in/thomaswhitfield",
      "https://thomaswhitfield.cam",
    ],
    summary:
      "<p>Computational biologist with a decade of experience developing algorithms and pipelines for large-scale genomic data. I work at the intersection of statistics, machine learning, and biology to accelerate drug discovery. Passionate about open-source scientific software and reproducible research practices.</p>",
    work: [
      {
        company: "Cambridge Institute for Medical Research",
        position: "Senior Research Associate",
        location: "Cambridge, UK",
        start: "Oct 2020",
        end: "current",
        bullets: [
          "Lead the development of a cloud-based variant-analysis pipeline processing 10k+ whole-genome sequences per month, used by 15 research groups across the UK.",
          "Published 6 peer-reviewed papers in high-impact journals (Nature Genetics, Bioinformatics) as first or senior author.",
          "Wrote an open-source Python library for statistical genetics (2k+ GitHub stars) that has been integrated into the analysis workflows of 3 pharmaceutical companies.",
          "Supervised 3 PhD students and 4 master's theses on topics ranging from polygenic risk scores to single-cell analysis.",
        ],
      },
      {
        company: "Wellcome Sanger Institute",
        position: "Bioinformatics Scientist",
        location: "Cambridge, UK",
        start: "Jan 2016",
        end: "Sep 2020",
        bullets: [
          "Developed parallelised algorithms for population-scale variant calling, reducing analysis time for 50k samples from 2 weeks to 36 hours.",
          "Contributed to the development of a widely-used genome annotation pipeline, cited in 200+ research publications.",
          "Presented research at 8 international conferences, including ISMB and ASHG, with 3 invited talks.",
        ],
      },
      {
        company: "European Bioinformatics Institute (EMBL-EBI)",
        position: "Research Assistant",
        location: "Hinxton, UK",
        start: "Sep 2013",
        end: "Dec 2015",
        bullets: [
          "Built and maintained automated quality-assurance pipelines for the European Genome-phenome Archive, processing 5TB+ of data per week.",
          "Contributed to the development of a metadata standard that became an international community norm for genomic data sharing.",
        ],
      },
    ],
    skills: {
      category: "Bioinformatics",
      items: [
        "Python",
        "R",
        "Nextflow",
        "Statistical Genetics",
        "Machine Learning",
        "Docker",
        "GWAS",
        "Single-Cell Analysis",
      ],
    },
    projects: [
      {
        name: "Cloud Genomics Platform",
        start: "Jan 2022",
        end: "Dec 2023",
        bullets: [
          "Designed and deployed a cloud-native genomics analysis platform on AWS using Terraform, Nextflow, and Spot Instances, reducing analysis costs by 60%.",
          "The platform was adopted by 5 external research groups and processed 15k whole-genome samples in its first year of operation.",
        ],
      },
      {
        name: "Polygenic Risk Score Toolkit",
        start: "Mar 2021",
        end: "Sep 2022",
        bullets: [
          "Developed and released an open-source Python toolkit for polygenic risk score calculation and validation (2k+ GitHub stars).",
          "The toolkit was featured in a Nature Reviews Genetics methods review article and is used by 50+ research groups worldwide.",
        ],
      },
      {
        name: "Single-Cell RNA-seq Pipeline",
        start: "Jun 2020",
        end: "Feb 2021",
        bullets: [
          "Built a scalable single-cell RNA-seq analysis pipeline using Scanpy and Nextflow, processing 1M+ cells per batch with automated quality reports.",
          "The pipeline was adopted as the standard analysis workflow by the institute, serving 20+ research groups.",
        ],
      },
      {
        name: "Reproducibility Initiative",
        start: "Sep 2019",
        end: "Mar 2020",
        bullets: [
          "Led a lab-wide initiative to containerise all analysis pipelines with Docker and package them with CWL descriptors.",
          "Achieved 100% containerisation of active pipelines and reduced environment-related reproducibility issues by 80%.",
        ],
      },
    ],
    certs: [
      {
        name: "AWS Certified Solutions Architect – Associate",
        org: "Amazon Web Services",
        date: "Jun 2021",
      },
      {
        name: "Coursera Deep Learning Specialisation",
        org: "DeepLearning.AI",
        date: "Mar 2020",
      },
      {
        name: "Software Carpentry Instructor",
        org: "The Carpentries",
        date: "Nov 2018",
      },
      {
        name: "Reproducible Research with R",
        org: "Coursera / Johns Hopkins",
        date: "Aug 2017",
      },
    ],
    education: {
      name: "University of Cambridge",
      location: "Cambridge, UK",
      start: "Sep 2010",
      end: "Jun 2014",
      degree: "Ph.D. in Computational Biology",
      gpa: "—",
      note: "Dissertation on statistical methods for rare-variant association studies. Developed a novel Bayesian framework for gene-based testing that improved power by 30% over existing methods. Published 4 first-author papers from the thesis.",
    },
  },
  {
    layoutId: "inset",
    presetId: "inset-crimson",
    photo: "https://i.pravatar.cc/320?img=67",
    fullName: "Samuel Pierce",
    location: "Portland, OR",
    phone: "+1 (503) 555-0334",
    email: "samuel.pierce@gmail.com",
    links: [
      "https://www.linkedin.com/in/samuelpierce",
      "https://samuelpierce.design",
    ],
    summary:
      "<p>Brand and visual designer with 7 years crafting identities and digital experiences for consumer brands. I combine a craft-oriented approach to typography and color with a strategic understanding of brand systems. I help startups and scale-ups build cohesive visual languages that differentiate them in crowded markets.</p>",
    work: [
      {
        company: "Evergreen Studio",
        position: "Lead Brand Designer",
        location: "Portland, OR",
        start: "Sep 2021",
        end: "current",
        bullets: [
          "Led brand identity projects for 15+ clients spanning tech, CPG, and hospitality, contributing to $3M in annual studio revenue.",
          "Developed a systematic brand identity framework that reduced project delivery time by 30% while maintaining design quality.",
          "Mentored 3 junior designers through structured critiques, skill-building sessions, and career development conversations.",
          "Directed photoshoots and collaborated with illustrators, copywriters, and strategists to deliver cohesive brand stories.",
        ],
      },
      {
        company: "North & Pine Creative",
        position: "Brand Designer",
        location: "Portland, OR",
        start: "Mar 2018",
        end: "Aug 2021",
        bullets: [
          "Designed logos, typography systems, colour palettes, and brand guidelines for 20+ startups during their seed to Series A stages.",
          "Created a modular template system for brand deliverables that allowed the studio to take on 3x more projects without scaling headcount.",
          "Won a GDUSA American Web Design Award for a B2B SaaS brand identity redesign.",
        ],
      },
      {
        company: "Cascade Creative",
        position: "Junior Designer",
        location: "Portland, OR",
        start: "Jun 2015",
        end: "Feb 2018",
        bullets: [
          "Produced visual assets for social media campaigns that achieved an average engagement rate 2.5x above industry benchmarks.",
          "Assisted in rebranding a regional bank, contributing to the visual identity that was rolled out across 50+ branches.",
        ],
      },
    ],
    skills: {
      category: "Brand Design",
      items: [
        "Visual Identity",
        "Typography",
        "Color Theory",
        "Figma",
        "Adobe Creative Suite",
        "Brand Strategy",
        "Art Direction",
        "Motion Design",
      ],
    },
    projects: [
      {
        name: "Startup Brand Launch",
        start: "Feb 2023",
        end: "Sep 2023",
        bullets: [
          "Developed the complete brand identity for a Series A climate-tech startup, including logo, typography, colour system, illustration style, and guidelines.",
          "The brand launched to positive coverage in TechCrunch and Fast Company, with the website redesign achieving a 40% lower bounce rate.",
        ],
      },
      {
        name: "Design System for Non-Designers",
        start: "May 2022",
        end: "Dec 2022",
        bullets: [
          "Created a comprehensive brand design system in Figma with reusable components, auto-layout templates, and detailed documentation for non-design team members.",
          "Adopted by the marketing team, the system reduced time-to-create social assets from 3 hours to 30 minutes.",
        ],
      },
      {
        name: "Rebrand Strategy Project",
        start: "Jan 2021",
        end: "Jun 2021",
        bullets: [
          "Led a full rebrand for a 50-person SaaS company, from research and positioning through visual identity and launch.",
          "The rebrand contributed to a 35% increase in inbound demo requests and a 15% lift in brand recall scores in post-launch surveys.",
        ],
      },
      {
        name: "Sustainable Packaging Redesign",
        start: "Aug 2020",
        end: "Jan 2021",
        bullets: [
          "Designed eco-friendly packaging for a direct-to-consumer brand that reduced material costs by 22% and plastic usage by 90%.",
          "The packaging redesign was featured in a Dieline packaging design article and won a GDUSA Package Design Award.",
        ],
      },
    ],
    certs: [
      {
        name: "Brand Strategy Certificate",
        org: "DMI (Design Management Institute)",
        date: "Nov 2022",
      },
      {
        name: "Advanced Typography",
        org: "Cooper Union Continuing Education",
        date: "May 2021",
      },
      {
        name: "Certified Figma Expert (Advanced Prototyping)",
        org: "Figma",
        date: "Jan 2023",
      },
    ],
    education: {
      name: "Pacific Northwest College of Art",
      location: "Portland, OR",
      start: "Sep 2011",
      end: "May 2015",
      degree: "B.F.A. in Graphic Design",
      gpa: "3.90 / 4.0",
      note: "Valedictorian of the graduating class; thesis project on generative brand systems was exhibited at the Portland Art Museum's annual design showcase. Awarded the department's excellence in design scholarship.",
    },
  },
  {
    layoutId: "split",
    presetId: "split-midnight",
    photo: "https://i.pravatar.cc/320?img=68",
    fullName: "Patrick Sullivan",
    location: "Austin, TX",
    phone: "+1 (512) 555-0287",
    email: "patrick.sullivan@gmail.com",
    links: [
      "https://www.linkedin.com/in/patricksullivan",
      "https://github.com/psullivan",
    ],
    summary:
      "<p>Full-stack software engineer with 8 years building consumer and SaaS products from concept to scale. I move fluidly across frontend, backend, and infrastructure, and I care deeply about developer experience, testing, and shipping code that's a pleasure to maintain. I thrive in early-stage environments where ownership and impact are high.</p>",
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
    layoutId: "bold-type",
    presetId: "bold-citrus",
    photo: "https://i.pravatar.cc/320?img=57",
    fullName: "Calvin Hughes",
    location: "Chicago, IL",
    phone: "+1 (312) 555-0418",
    email: "calvin.hughes@outlook.com",
    links: [
      "https://www.linkedin.com/in/calvinhughes",
      "https://calvinhughes.co",
    ],
    summary:
      "<p>Content strategist and marketing writer with 8 years crafting brand stories for B2B SaaS and consumer tech companies. I translate technical concepts into compelling narratives that drive awareness, engagement, and conversion. I build content operations that scale, from editorial calendars to SEO frameworks to distribution playbooks.</p>",
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
      { name: "Reforge Content-Led Growth", org: "Reforge", date: "Nov 2022" },
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
    layoutId: "split",
    presetId: "split-terracotta",
    photo: "https://i.pravatar.cc/320?img=14",
    fullName: "Sean McCarthy",
    location: "Portland, OR",
    phone: "+1 (503) 555-0325",
    email: "sean.mccarthy@gmail.com",
    links: [
      "https://www.linkedin.com/in/seanmccarthy",
      "https://github.com/smccarthy",
    ],
    summary:
      "<p>Mobile engineer with 7 years building native and cross-platform applications used by millions. I obsess over performance, smooth animations, and intuitive gesture-driven interfaces. I bring architectural rigour to mobile teams, advocating for clean separation of concerns, comprehensive testing, and developer productivity.</p>",
    work: [
      {
        company: "Nomad Technologies",
        position: "Senior Mobile Engineer",
        location: "Portland, OR",
        start: "Mar 2021",
        end: "current",
        bullets: [
          "Architected and built a cross-platform travel app using React Native, serving 500k+ monthly active users with sub-2s cold start times.",
          "Led the migration from a legacy native codebase to a shared React Native architecture, reducing iOS and Android feature delivery time by 40%.",
          "Implemented a declarative animation system that cut animation-related bugs by 70% and made complex gesture interactions testable.",
          "Mentored 3 mobile engineers through structured pairing sessions and architecture reviews, building the team's React Native expertise from scratch.",
        ],
      },
      {
        company: "Clearview Mobile",
        position: "Mobile Engineer",
        location: "Portland, OR",
        start: "Jun 2017",
        end: "Feb 2021",
        bullets: [
          "Built and maintained native Android (Kotlin) and iOS (Swift) apps for a health-tracking platform with 2M+ downloads.",
          "Reduced crash rate from 0.8% to 0.05% by implementing comprehensive error handling, analytics, and a staged rollout pipeline.",
          "Developed an offline-first sync engine using Room + WorkManager that let users log data without internet, achieving 98% sync success rate.",
        ],
      },
      {
        company: "Pocket Studio",
        position: "Junior Mobile Developer",
        location: "Portland, OR",
        start: "Aug 2015",
        end: "May 2017",
        bullets: [
          "Developed and shipped 5 iOS apps for client projects across fitness, retail, and education verticals, collectively reaching 100k+ downloads.",
          "Built reusable UI component libraries in Swift that standardised development across projects and reduced feature implementation time by 25%.",
        ],
      },
    ],
    skills: {
      category: "Mobile Engineering",
      items: [
        "React Native",
        "Swift",
        "Kotlin",
        "TypeScript",
        "Reanimated",
        "SQLite",
        "CI/CD",
        "App Performance",
      ],
    },
    projects: [
      {
        name: "Cross-Platform Architecture",
        start: "Jan 2023",
        end: "Oct 2023",
        bullets: [
          "Designed and implemented a cross-platform architecture sharing 85% of code between iOS and Android while preserving native platform feel.",
          "Achieved 60fps scrolling performance on both platforms through careful reconciliation of React Native's bridge and native thread interactions.",
        ],
      },
      {
        name: "Offline-First Sync Engine",
        start: "May 2022",
        end: "Nov 2022",
        bullets: [
          "Built a robust offline-first data synchronisation engine with conflict resolution, operation queuing, and background sync scheduling.",
          "Achieved 99.2% sync reliability across 500k devices with automatic retries, exponential backoff, and delta-based synchronisation.",
        ],
      },
      {
        name: "App Performance Overhaul",
        start: "Feb 2021",
        end: "Jul 2021",
        bullets: [
          "Led a comprehensive performance audit and optimisation sprint, reducing cold start time from 4.2s to 1.8s and app size by 35%.",
          "Implemented lazy loading for screens, image caching with custom disk cache, and reduced unnecessary re-renders through memoization.",
        ],
      },
    ],
    certs: [
      {
        name: "Meta React Native Developer Certificate",
        org: "Meta",
        date: "Mar 2022",
      },
      {
        name: "Google Associate Android Developer",
        org: "Google",
        date: "Aug 2021",
      },
      { name: "Apple Certified iOS Developer", org: "Apple", date: "Jan 2020" },
    ],
    education: {
      name: "University of Oregon",
      location: "Eugene, OR",
      start: "Sep 2011",
      end: "Jun 2015",
      degree: "B.S. in Computer and Information Science",
      gpa: "3.68 / 4.0",
      note: "Focus on mobile and embedded systems; senior project on a real-time transit tracking app for Android that won the department's capstone showcase. Active in the mobile development club.",
    },
  },
  {
    layoutId: "bold-type",
    presetId: "bold-lime",
    photo: "https://i.pravatar.cc/320?img=61",
    fullName: "Miles Ford",
    location: "Seattle, WA",
    phone: "+1 (206) 555-0447",
    email: "miles.ford@outlook.com",
    links: [
      "https://www.linkedin.com/in/milesford",
      "https://milesford.writes",
    ],
    summary:
      "<p>Technical writer with 7 years turning complex software concepts into clear, accessible documentation. I specialise in API docs, developer guides, and information architecture for developer-facing products. I believe great documentation is a product in its own right and deserves the same design rigour as the UI.</p>",
    work: [
      {
        company: "BuildRight",
        position: "Senior Technical Writer",
        location: "Seattle, WA",
        start: "Apr 2021",
        end: "current",
        bullets: [
          "Led the documentation strategy for a cloud infrastructure platform, producing API reference docs, getting-started guides, tutorials, and conceptual overviews across 5 product areas.",
          "Built an automated documentation pipeline using Markdown + Docusaurus that reduced time-to-publish from 2 days to 15 minutes.",
          "Conducted quarterly documentation audits with user feedback and analytics, achieving a 40% reduction in documentation-related support tickets.",
          "Mentored 2 junior technical writers through structured editing sessions, style guide training, and documentation review processes.",
        ],
      },
      {
        company: "DocuCraft",
        position: "Technical Writer",
        location: "Seattle, WA",
        start: "May 2018",
        end: "Mar 2021",
        bullets: [
          "Wrote and maintained documentation for a B2B SaaS analytics platform, including API docs, admin guides, and integration tutorials.",
          "Redesigned the documentation portal's information architecture, reducing the average time to find a topic from 45s to 12s in user testing.",
          "Developed a documentation style guide and template system that was adopted across 3 product teams, standardising docs output and improving quality scores.",
        ],
      },
      {
        company: "ClearType Media",
        position: "Associate Technical Writer",
        location: "Seattle, WA",
        start: "Aug 2016",
        end: "Apr 2018",
        bullets: [
          "Wrote user manuals, release notes, and online help content for enterprise software used by 100k+ users in healthcare and finance.",
          "Collaborated with engineering and product teams to document new features on a 2-week release cycle, consistently meeting publish deadlines.",
        ],
      },
    ],
    skills: {
      category: "Technical Writing",
      items: [
        "API Documentation",
        "Information Architecture",
        "Docusaurus",
        "Markdown",
        "Git",
        "Developer Experience",
        "Content Strategy",
        "Documentation Testing",
      ],
    },
    projects: [
      {
        name: "API Docs Overhaul",
        start: "Feb 2023",
        end: "Dec 2023",
        bullets: [
          "Led a complete rewrite and restructuring of the API documentation covering 200+ endpoints, introducing interactive examples, code samples in 5 languages, and auto-generated reference docs from OpenAPI specs.",
          "The revamped docs contributed to a 50% reduction in API-related support tickets and received a developer NPS score of 74 (up from 42).",
        ],
      },
      {
        name: "Documentation Automation Pipeline",
        start: "Jun 2022",
        end: "Nov 2022",
        bullets: [
          "Designed and built a CI-integrated documentation pipeline that auto-published changes from Markdown source to a Docusaurus site with versioning and search.",
          "Reduced documentation publishing time from 2 days to 15 minutes and enabled product teams to contribute docs alongside code changes.",
        ],
      },
      {
        name: "Developer Onboarding Docs",
        start: "Jan 2022",
        end: "May 2022",
        bullets: [
          "Created a comprehensive developer onboarding guide covering environment setup, first API call, authentication, and common integration patterns.",
          "The guide reduced average developer time-to-first-successful-API-call from 4 hours to 25 minutes, as measured across 20 new integration partners.",
        ],
      },
      {
        name: "Docs UX Research",
        start: "Mar 2021",
        end: "Aug 2021",
        bullets: [
          "Conducted a documentation usability study with 15 external developers, identifying 23 pain points in the information architecture and content presentation.",
          "Implemented the top 10 improvements based on study findings, improving task completion rate from 58% to 83% in a follow-up study.",
        ],
      },
    ],
    certs: [
      {
        name: "Certified Professional Technical Communicator",
        org: "STC (Society for Technical Communication)",
        date: "May 2022",
      },
      { name: "Google UX Design Certificate", org: "Google", date: "Aug 2021" },
      {
        name: "API Documentation Workshop",
        org: "Documenting APIs / Tom Johnson",
        date: "Mar 2021",
      },
      {
        name: "Certified ScrumMaster",
        org: "Scrum Alliance",
        date: "Nov 2020",
      },
    ],
    education: {
      name: "University of Washington",
      location: "Seattle, WA",
      start: "Sep 2012",
      end: "Jun 2016",
      degree: "B.A. in English (Technical Communication)",
      gpa: "3.76 / 4.0",
      note: "Specialised in technical writing and information design; capstone project on API documentation usability for the UW IT department, which was adopted as the department's standard template. Minor in Computer Science.",
    },
  },
  {
    layoutId: "studio",
    presetId: "studio-violet",
    photo: "https://i.pravatar.cc/320?img=54",
    fullName: "Kwame Osei",
    location: "Toronto, ON",
    phone: "+1 (416) 555-0173",
    email: "kwame.osei@hey.com",
    links: [
      "https://www.linkedin.com/in/kwameosei",
      "https://github.com/kwameosei",
    ],
    summary:
      "<p>Data scientist with 7 years turning messy product telemetry into decisions leadership actually makes. I build the model, the pipeline that feeds it, and the dashboard that explains it, then stay close enough to the business to know when a simpler answer wins.</p>",
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
      { name: "dbt Analytics Engineering", org: "dbt Labs", date: "Feb 2021" },
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
    layoutId: "aurora",
    presetId: "aurora-haze",
    photo: "https://i.pravatar.cc/320?img=60",
    fullName: "Rio Baskoro",
    location: "Bandung, Indonesia",
    phone: "+62 812 5566 7788",
    email: "rio.baskoro@proton.me",
    links: ["https://www.linkedin.com/in/riobaskoro", "https://riobaskoro.dev"],
    summary:
      "<p>Front-end engineer with 6 years building internal tools that people are required to use, which is a harder audience than customers. I care about the boring wins: fewer clicks, faster tables, states that explain themselves.</p>",
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
    layoutId: "classic",
    presetId: "classic-ats",
    photo: "https://i.pravatar.cc/320?img=59",
    fullName: "Gregory Vance",
    location: "Chicago, IL",
    phone: "+1 (312) 555-0186",
    email: "gregory.vance@fastmail.com",
    links: ["https://www.linkedin.com/in/gregoryvance"],
    summary:
      "<p>Financial analyst with 9 years in corporate FP&amp;A, covering forecasting, board reporting, and the unglamorous reconciliation work that makes the forecast trustworthy. I would rather present a model somebody can audit than one that only I can run.</p>",
    work: [
      {
        company: "Halstead Manufacturing",
        position: "Senior Financial Analyst",
        location: "Chicago, IL",
        start: "Jun 2020",
        end: "current",
        bullets: [
          "Rebuilt the rolling 13-week cash forecast, cutting variance against actuals from 14% to under 4% within two quarters.",
          "Led the annual planning cycle across 6 business units, consolidating 40 submissions into a board deck that survived audit without restatement.",
          "Automated the monthly close pack in Power BI, removing 3 days of manual assembly per cycle.",
          "Built the unit-economics model behind a plant consolidation decision that removed $6.8M of annual fixed cost.",
        ],
      },
      {
        company: "Ridgeline Foods",
        position: "Financial Analyst",
        location: "Milwaukee, WI",
        start: "Aug 2017",
        end: "May 2020",
        bullets: [
          "Owned COGS analysis for a $240M product portfolio, identifying $3.1M in recoverable freight and packaging spend.",
          "Standardised margin reporting across 4 regions, ending a long-running dispute about which numbers were real.",
          "Supported two audit cycles with zero material findings on the schedules I prepared.",
        ],
      },
      {
        company: "Corbin & Meyer",
        position: "Staff Accountant",
        location: "Chicago, IL",
        start: "Jul 2015",
        end: "Jul 2017",
        bullets: [
          "Prepared monthly financial statements for 12 mid-market clients across manufacturing and retail.",
          "Cleaned up a chart of accounts that had accumulated 300 unused codes, shortening close by a full day.",
        ],
      },
    ],
    skills: {
      category: "Finance",
      items: [
        "FP&A",
        "Financial Modeling",
        "Power BI",
        "SQL",
        "NetSuite",
        "Variance Analysis",
        "Excel",
        "US GAAP",
      ],
    },
    projects: [
      {
        name: "Close Automation",
        start: "Jan 2022",
        end: "Sep 2022",
        bullets: [
          "Replaced a 60-tab workbook with a modelled data source and scheduled refresh, cutting close prep from 3 days to 4 hours.",
          "Documented every calculation so the pack survives the analyst who built it leaving.",
        ],
      },
      {
        name: "Plant Consolidation Model",
        start: "Mar 2021",
        end: "Aug 2021",
        bullets: [
          "Modelled three consolidation scenarios with sensitivity on freight, labour, and utilisation.",
          "Presented to the board; the selected option removed $6.8M of annual fixed cost.",
        ],
      },
    ],
    certs: [
      { name: "Certified Public Accountant", org: "Illinois Board of Examiners", date: "Nov 2018" },
      { name: "FP&A Certification", org: "Association for Financial Professionals", date: "Apr 2021" },
    ],
    education: {
      name: "University of Illinois Urbana-Champaign",
      location: "Champaign, IL",
      start: "Aug 2011",
      end: "May 2015",
      degree: "B.S. in Accountancy",
      gpa: "3.7 / 4.0",
      note: "Minor in economics; treasurer of the student investment fund, which reported quarterly to a faculty oversight committee.",
    },
  },
  {
    layoutId: "academic",
    presetId: "academic-journal",
    photo: "https://i.pravatar.cc/320?img=65",
    fullName: "Dr. Viktor Novak",
    location: "Prague, Czech Republic",
    phone: "+420 601 234 567",
    email: "v.novak@univ-prague.cz",
    links: ["https://www.linkedin.com/in/viktornovak"],
    summary:
      "<p>Condensed matter physicist with 15 years of research on low-dimensional materials, split between experiment and the instrumentation that makes the experiment possible. I publish what replicates and I say so when it does not.</p>",
    work: [
      {
        company: "Charles University",
        position: "Associate Professor of Physics",
        location: "Prague, Czech Republic",
        start: "Sep 2018",
        end: "current",
        bullets: [
          "Lead a group of 9 researchers studying transport phenomena in two-dimensional heterostructures.",
          "Principal investigator on €2.4M of competitive funding across four national and EU grants.",
          "Published 31 peer-reviewed papers, 12 as corresponding author, cited over 1,800 times.",
          "Rebuilt the graduate methods course around reproducibility, requiring every submission to ship its analysis code.",
        ],
      },
      {
        company: "Max Planck Institute for Solid State Research",
        position: "Postdoctoral Researcher",
        location: "Stuttgart, Germany",
        start: "Oct 2014",
        end: "Aug 2018",
        bullets: [
          "Designed a cryogenic measurement setup that reduced noise floor by an order of magnitude over the previous rig.",
          "Resolved a long-standing discrepancy between two reported conductance measurements by identifying a thermal gradient artefact.",
          "Supervised 5 graduate students, three of whom now hold independent research positions.",
        ],
      },
      {
        company: "Institute of Physics, Czech Academy of Sciences",
        position: "Research Assistant",
        location: "Prague, Czech Republic",
        start: "Sep 2010",
        end: "Sep 2014",
        bullets: [
          "Carried out sample preparation and characterisation for a national thin-film research programme.",
          "Maintained and calibrated shared instrumentation used by four research groups.",
        ],
      },
    ],
    skills: {
      category: "Research",
      items: [
        "Condensed Matter Physics",
        "Cryogenic Measurement",
        "Thin-Film Deposition",
        "Python",
        "LabVIEW",
        "Grant Writing",
        "Peer Review",
      ],
    },
    projects: [
      {
        name: "Low-Noise Transport Platform",
        start: "Jan 2019",
        end: "Nov 2021",
        bullets: [
          "Built an open-hardware measurement platform now replicated by three external laboratories.",
          "Released the control software and calibration procedure under a permissive licence.",
        ],
      },
      {
        name: "Replication Study Programme",
        start: "Mar 2022",
        end: "Oct 2023",
        bullets: [
          "Coordinated independent replication of six widely cited transport results; two failed to reproduce.",
          "Published the negative results, which drew more correspondence than any positive result in the group's history.",
        ],
      },
    ],
    certs: [
      { name: "Radiation Safety Officer", org: "State Office for Nuclear Safety", date: "Feb 2016" },
      { name: "Advanced Research Supervision", org: "Charles University", date: "Sep 2019" },
    ],
    education: {
      name: "Charles University",
      location: "Prague, Czech Republic",
      start: "Sep 2006",
      end: "Aug 2010",
      degree: "Ph.D. in Physics",
      gpa: "—",
      note: "Dissertation on electron transport in disordered two-dimensional systems; awarded the faculty prize for the year's outstanding thesis.",
    },
  },
  {
    layoutId: "studio",
    presetId: "studio-teal",
    photo: "https://i.pravatar.cc/320?img=56",
    fullName: "Haruki Sato",
    location: "Osaka, Japan",
    phone: "+81 90 1234 5678",
    email: "haruki.sato@fastmail.com",
    links: [
      "https://www.linkedin.com/in/harukisato",
      "https://github.com/hsato",
    ],
    summary:
      "<p>Mobile engineer with 8 years shipping iOS and Android apps that run on phones people actually own, not just the newest ones. Crash-free sessions and cold-start time are the two numbers I defend.</p>",
    work: [
      {
        company: "Kitagawa Mobility",
        position: "Senior Mobile Engineer",
        location: "Osaka, Japan",
        start: "Jul 2021",
        end: "current",
        bullets: [
          "Cut cold-start time on mid-range Android devices from 4.1s to 1.3s by deferring initialisation off the main thread.",
          "Raised crash-free sessions from 98.2% to 99.85% by rebuilding the offline sync layer around a durable queue.",
          "Led the Kotlin Multiplatform migration for shared business logic, removing a whole class of iOS/Android drift bugs.",
          "Owned release engineering: staged rollouts, automated regression suite, and a rollback that takes minutes.",
        ],
      },
      {
        company: "Sunfield Interactive",
        position: "Mobile Engineer",
        location: "Kyoto, Japan",
        start: "Apr 2018",
        end: "Jun 2021",
        bullets: [
          "Shipped a live-ops feature framework that let designers launch events without an app release.",
          "Reduced app size 34% through resource auditing and on-demand asset delivery.",
          "Built the accessibility pass that brought the app to full VoiceOver and TalkBack support.",
        ],
      },
      {
        company: "Aozora Works",
        position: "Junior Developer",
        location: "Osaka, Japan",
        start: "Apr 2016",
        end: "Mar 2018",
        bullets: [
          "Delivered 6 client apps across retail and transport on a shared internal SDK.",
          "Automated the release checklist, ending a recurring class of missed provisioning errors.",
        ],
      },
    ],
    skills: {
      category: "Mobile",
      items: [
        "Swift",
        "Kotlin",
        "Kotlin Multiplatform",
        "SwiftUI",
        "Jetpack Compose",
        "Instrumentation",
        "CI/CD",
        "Accessibility",
      ],
    },
    projects: [
      {
        name: "Offline Sync Rewrite",
        start: "Jan 2023",
        end: "Sep 2023",
        bullets: [
          "Replaced best-effort syncing with a durable, idempotent queue that survives process death.",
          "Support tickets about lost trip records dropped to zero in the quarter after launch.",
        ],
      },
      {
        name: "Startup Time Programme",
        start: "Mar 2022",
        end: "Aug 2022",
        bullets: [
          "Instrumented cold start end to end and published a per-release budget the team defends.",
          "Held the budget through eighteen months of feature work.",
        ],
      },
    ],
    certs: [
      { name: "Associate Android Developer", org: "Google", date: "Oct 2019" },
      { name: "Accessibility in Mobile Apps", org: "Deque University", date: "May 2022" },
    ],
    education: {
      name: "Osaka University",
      location: "Osaka, Japan",
      start: "Apr 2012",
      end: "Mar 2016",
      degree: "B.Eng. in Information Science",
      gpa: "3.5 / 4.0",
      note: "Graduation project on energy-efficient background scheduling for mobile devices, later the basis of a conference workshop paper.",
    },
  },
  {
    layoutId: "aurora",
    presetId: "aurora-peach",
    photo: "https://i.pravatar.cc/320?img=17",
    fullName: "Elliot Grant",
    location: "Melbourne, Australia",
    phone: "+61 412 345 678",
    email: "elliot.grant@hey.com",
    links: [
      "https://www.linkedin.com/in/elliotgrant",
      "https://elliotgrant.design",
    ],
    summary:
      "<p>Product designer with 10 years on data-heavy tools, where the hard part is deciding what not to show. I prototype in code when a static mock would hide the problem.</p>",
    work: [
      {
        company: "Southbank Health",
        position: "Principal Product Designer",
        location: "Melbourne, Australia",
        start: "Aug 2021",
        end: "current",
        bullets: [
          "Redesigned the clinician workspace around one prioritised worklist, cutting average time-to-decision by 27%.",
          "Ran the design system through a WCAG AA audit and closed every blocking issue before the compliance deadline.",
          "Prototyped three information-density options in code, which settled a six-month debate in one session.",
          "Mentor four designers and run the fortnightly critique that keeps the surface coherent across squads.",
        ],
      },
      {
        company: "Latitude Analytics",
        position: "Senior Product Designer",
        location: "Sydney, Australia",
        start: "Feb 2018",
        end: "Jul 2021",
        bullets: [
          "Designed the query builder that took self-serve report creation from 12% of users to 46%.",
          "Established the charting guidelines still used across the product, including colour rules that survive greyscale printing.",
          "Partnered with research on a longitudinal study that reframed the onboarding roadmap.",
        ],
      },
      {
        company: "Harbourline Studio",
        position: "Product Designer",
        location: "Melbourne, Australia",
        start: "Jan 2015",
        end: "Jan 2018",
        bullets: [
          "Delivered end-to-end design for 9 client products across health, logistics, and government.",
          "Built the studio's reusable pattern library, cutting project setup by roughly a week each.",
        ],
      },
    ],
    skills: {
      category: "Product Design",
      items: [
        "Figma",
        "Design Systems",
        "Prototyping",
        "Data Visualisation",
        "Accessibility",
        "HTML/CSS",
        "User Research",
      ],
    },
    projects: [
      {
        name: "Clinician Worklist",
        start: "Mar 2022",
        end: "Feb 2023",
        bullets: [
          "Replaced five competing dashboards with a single prioritised worklist, validated through 24 shadowing sessions.",
          "Reduced average time-to-decision by 27% and cut mis-triage escalations by a third.",
        ],
      },
      {
        name: "Charting Guidelines",
        start: "Jun 2019",
        end: "Dec 2019",
        bullets: [
          "Published colour, axis, and annotation rules that hold up in greyscale and for colour-blind readers.",
          "Adopted across four product teams and still the reference three years on.",
        ],
      },
    ],
    certs: [
      { name: "Accessibility Specialist (WAS)", org: "IAAP", date: "Sep 2022" },
      { name: "Data Visualisation", org: "Royal Melbourne Institute of Technology", date: "Apr 2020" },
    ],
    education: {
      name: "RMIT University",
      location: "Melbourne, Australia",
      start: "Feb 2011",
      end: "Nov 2014",
      degree: "B.Des. in Communication Design",
      gpa: "3.8 / 4.0",
      note: "Major in interaction design; final-year exhibition on legibility of clinical interfaces under time pressure.",
    },
  },
  // Ledger / Dossier / Crest / Masthead
  {
    layoutId: "ledger",
    presetId: "ledger-graphite",
    photo: "https://i.pravatar.cc/320?img=18",
    fullName: "Anton Visser",
    location: "Amsterdam, Netherlands",
    phone: "+31 6 2145 8890",
    email: "anton.visser@proton.me",
    links: ["https://www.linkedin.com/in/antonvisser", "https://visser.works"],
    summary:
      "<p>Operations manager for high-growth logistics teams, with ten years turning improvised processes into ones that survive a tenfold increase in volume. I work close to the warehouse floor, measure before I change anything, and leave documentation behind.</p>",
    work: [
      {
        company: "Kaden Freight",
        position: "Head of Operations",
        location: "Amsterdam, Netherlands",
        start: "Feb 2021",
        end: "current",
        bullets: [
          "Rebuilt the dispatch process around a single planning board, lifting on-time delivery from 82% to 96% across four depots.",
          "Renegotiated eleven carrier contracts, cutting line-haul cost per pallet 18% without changing service levels.",
          "Introduced a weekly exception review that closed the top ten recurring failure causes within two quarters.",
        ],
      },
      {
        company: "Nordveld Distribution",
        position: "Operations Manager",
        location: "Utrecht, Netherlands",
        start: "Mar 2016",
        end: "Jan 2021",
        bullets: [
          "Ran a 60-person shift operation through a warehouse move with no missed delivery day.",
          "Cut picking errors by half by redesigning the slotting layout around actual order pairs rather than product category.",
        ],
      },
    ],
    skills: {
      category: "Operations",
      items: [
        "S&OP",
        "Lean",
        "WMS Rollouts",
        "Carrier Negotiation",
        "Capacity Planning",
        "SQL",
      ],
    },
    projects: [
      {
        name: "Depot Consolidation",
        start: "Jan 2022",
        end: "Oct 2022",
        bullets: [
          "Merged three regional depots into two without a service interruption, releasing €1.4M in annual lease cost.",
        ],
      },
    ],
    certs: [
      { name: "APICS CPIM", org: "ASCM", date: "Jun 2019" },
      { name: "Lean Six Sigma Black Belt", org: "ASQ", date: "Nov 2017" },
    ],
    education: {
      name: "Erasmus University Rotterdam",
      location: "Rotterdam, Netherlands",
      start: "Sep 2010",
      end: "Jul 2014",
      degree: "BSc in Supply Chain Management",
      gpa: "8.1 / 10",
      note: "Thesis on buffer placement in multi-echelon distribution networks.",
    },
  },
  {
    layoutId: "ledger",
    presetId: "ledger-ink",
    photo: "https://i.pravatar.cc/320?img=52",
    fullName: "Tomás Ferreira",
    location: "Lisbon, Portugal",
    phone: "+351 912 447 013",
    email: "tomas.ferreira@fastmail.com",
    links: ["https://www.linkedin.com/in/tomasferreira"],
    summary:
      "<p>Financial analyst covering European mid-cap industrials. I build models other people can audit, and I would rather publish a narrower view I can defend than a wide one I cannot.</p>",
    work: [
      {
        company: "Aveiro Capital",
        position: "Senior Analyst, Industrials",
        location: "Lisbon, Portugal",
        start: "Sep 2020",
        end: "current",
        bullets: [
          "Cover 22 names across machinery and building products; published theses outperformed the sector index by 6.4pp over three years.",
          "Rebuilt the team's valuation template around auditable driver assumptions, cutting model review time from two days to four hours.",
        ],
      },
      {
        company: "Banco Serra",
        position: "Equity Analyst",
        location: "Porto, Portugal",
        start: "Aug 2016",
        end: "Aug 2020",
        bullets: [
          "Initiated coverage on nine Iberian small-caps, three of which became core desk positions.",
          "Built the quarterly channel-check process still used by the research desk.",
        ],
      },
    ],
    skills: {
      category: "Analysis",
      items: [
        "DCF & Comps",
        "Financial Modelling",
        "Python",
        "Bloomberg",
        "IFRS",
        "Scenario Analysis",
      ],
    },
    projects: [
      {
        name: "Sector Screening Engine",
        start: "Feb 2022",
        end: "Jun 2022",
        bullets: [
          "Automated a 400-name screen on quality and capital-intensity factors, replacing a monthly manual sweep.",
        ],
      },
    ],
    certs: [
      { name: "CFA Charterholder", org: "CFA Institute", date: "Sep 2021" },
      { name: "FRM Part II", org: "GARP", date: "May 2018" },
    ],
    education: {
      name: "Nova School of Business and Economics",
      location: "Lisbon, Portugal",
      start: "Sep 2012",
      end: "Jun 2016",
      degree: "BSc in Economics",
      gpa: "16 / 20",
      note: "Final project on capital-cycle timing in European cement.",
    },
  },
  {
    layoutId: "dossier",
    presetId: "dossier-navy",
    photo: "https://i.pravatar.cc/320?img=59",
    fullName: "Arjun Raghunathan",
    location: "Bengaluru, India",
    phone: "+91 98450 21766",
    email: "arjun.raghunathan@hey.com",
    links: [
      "https://www.linkedin.com/in/arjunraghunathan",
      "https://arjun.dev",
    ],
    summary:
      "<p>Data scientist working on forecasting and pricing for retail. I care most about the boring half of the job — the evaluation harness, the drift monitoring, the rollback plan — because that is what decides whether a model survives contact with a business.</p>",
    work: [
      {
        company: "Thela Commerce",
        position: "Staff Data Scientist",
        location: "Bengaluru, India",
        start: "Apr 2021",
        end: "current",
        bullets: [
          "Owned demand forecasting across 90k SKUs; cut forecast error 22% and released ₹40Cr of tied-up inventory.",
          "Built the offline/online evaluation harness now used by every model the team ships.",
          "Mentored six analysts into modelling roles, three of them internal transfers.",
        ],
      },
      {
        company: "Kavi Analytics",
        position: "Data Scientist",
        location: "Chennai, India",
        start: "Jun 2017",
        end: "Mar 2021",
        bullets: [
          "Shipped a churn model that raised retention-campaign ROI 3.4x by scoring on intent rather than recency.",
          "Replaced a nightly batch pipeline with a streaming feature store, cutting feature latency from 18 hours to 4 minutes.",
        ],
      },
    ],
    skills: {
      category: "Data Science",
      items: [
        "Python",
        "PyTorch",
        "Forecasting",
        "Causal Inference",
        "dbt",
        "Airflow",
        "SQL",
      ],
    },
    projects: [
      {
        name: "Price Elasticity Service",
        start: "Aug 2022",
        end: "Apr 2023",
        bullets: [
          "Estimated category-level elasticities from observational data with a double-ML design, validated against 14 live price tests.",
          "Adopted by merchandising for weekly markdown decisions across three categories.",
        ],
      },
    ],
    certs: [
      { name: "Google Cloud Professional ML Engineer", org: "Google", date: "Feb 2022" },
    ],
    education: {
      name: "Indian Institute of Technology Madras",
      location: "Chennai, India",
      start: "Jul 2013",
      end: "May 2017",
      degree: "B.Tech in Computer Science",
      gpa: "8.7 / 10",
      note: "Undergraduate thesis on hierarchical time-series reconciliation.",
    },
  },
  {
    layoutId: "dossier",
    presetId: "dossier-forest",
    photo: "https://i.pravatar.cc/320?img=58",
    fullName: "Jonas Bergqvist",
    location: "Stockholm, Sweden",
    phone: "+46 70 448 2291",
    email: "jonas.bergqvist@posteo.net",
    links: ["https://www.linkedin.com/in/jonasbergqvist"],
    summary:
      "<p>Sustainability lead for manufacturing groups. I translate reporting obligations into engineering work that actually reduces emissions, and I am comfortable telling a board which of its targets is not reachable.</p>",
    work: [
      {
        company: "Vasten Industri",
        position: "Head of Sustainability",
        location: "Stockholm, Sweden",
        start: "Jan 2020",
        end: "current",
        bullets: [
          "Delivered the group's first CSRD-aligned report across 11 sites and 4 jurisdictions, signed off with no material qualifications.",
          "Cut Scope 1 and 2 emissions 34% in four years through electrified process heat and a recontracted power supply.",
          "Built a supplier engagement programme covering 78% of spend, replacing spend-based Scope 3 estimates with primary data.",
        ],
      },
      {
        company: "Nordisk Energi Rådgivning",
        position: "Senior Consultant",
        location: "Gothenburg, Sweden",
        start: "Sep 2015",
        end: "Dec 2019",
        bullets: [
          "Ran energy audits for 30+ industrial clients, with an average identified saving of 12% of site consumption.",
        ],
      },
    ],
    skills: {
      category: "Sustainability",
      items: [
        "GHG Protocol",
        "CSRD / ESRS",
        "LCA",
        "Energy Audits",
        "Supplier Engagement",
        "Power BI",
      ],
    },
    projects: [
      {
        name: "Process Heat Electrification",
        start: "Mar 2021",
        end: "Nov 2022",
        bullets: [
          "Business case and rollout for high-temperature heat pumps at two sites, removing 8,400 tCO2e a year with a 6.5-year payback.",
        ],
      },
    ],
    certs: [
      { name: "GHG Protocol Corporate Standard", org: "WRI", date: "Mar 2019" },
      { name: "Certified Energy Manager", org: "AEE", date: "Oct 2017" },
    ],
    education: {
      name: "KTH Royal Institute of Technology",
      location: "Stockholm, Sweden",
      start: "Aug 2010",
      end: "Jun 2015",
      degree: "MSc in Energy Engineering",
      gpa: "4.4 / 5",
      note: "Thesis on waste-heat recovery economics in Nordic pulp mills.",
    },
  },
  {
    layoutId: "crest",
    presetId: "crest-charcoal",
    photo: "https://i.pravatar.cc/320?img=50",
    fullName: "Marcus Delaney",
    location: "Dublin, Ireland",
    phone: "+353 87 442 9106",
    email: "marcus.delaney@hey.com",
    links: ["https://www.linkedin.com/in/marcusdelaney", "https://delaney.ie"],
    summary:
      "<p>Communications director with fifteen years in regulated industries. I have written the statement that goes out at 6am on the worst day of a company's year, and I would rather spend the budget on being ready than on being loud.</p>",
    work: [
      {
        company: "Ardmore Group",
        position: "Director of Communications",
        location: "Dublin, Ireland",
        start: "May 2019",
        end: "current",
        bullets: [
          "Led communications through a contested acquisition and two regulatory investigations with no adverse coverage cycle lasting beyond 48 hours.",
          "Rebuilt the spokesperson bench from two people to nine, with quarterly drills and a maintained holding-statement library.",
          "Grew earned coverage in tier-one outlets 2.6x while cutting agency spend by a third.",
        ],
      },
      {
        company: "Kilbride Public Affairs",
        position: "Associate Director",
        location: "Dublin, Ireland",
        start: "Feb 2013",
        end: "Apr 2019",
        bullets: [
          "Ran public affairs for six financial-services clients through the post-crisis regulatory rewrite.",
        ],
      },
    ],
    skills: {
      category: "Communications",
      items: [
        "Crisis Communications",
        "Media Relations",
        "Public Affairs",
        "Executive Positioning",
        "Internal Comms",
      ],
    },
    projects: [
      {
        name: "Group Newsroom",
        start: "Jan 2021",
        end: "Sep 2021",
        bullets: [
          "Consolidated seven brand press pages into one newsroom, doubling direct journalist enquiries and halving time-to-publish.",
        ],
      },
    ],
    certs: [
      { name: "Accredited in Public Relations (APR)", org: "PRSA", date: "Jun 2018" },
    ],
    education: {
      name: "Trinity College Dublin",
      location: "Dublin, Ireland",
      start: "Sep 2005",
      end: "Jun 2009",
      degree: "BA in History and Political Science",
      gpa: "First Class Honours",
      note: "Editor of the student newspaper in final year.",
    },
  },
  {
    layoutId: "crest",
    presetId: "crest-burgundy",
    photo: "https://i.pravatar.cc/320?img=55",
    fullName: "Matteo Marchetti",
    location: "Milan, Italy",
    phone: "+39 340 118 7742",
    email: "matteo.marchetti@proton.me",
    links: ["https://www.linkedin.com/in/matteomarchetti", "https://marchetti.art"],
    summary:
      "<p>Curator of contemporary photography, working between institutions and artist estates. My exhibitions are built from primary research; my catalogues are written to still be useful in twenty years.</p>",
    work: [
      {
        company: "Fondazione Lucerna",
        position: "Senior Curator",
        location: "Milan, Italy",
        start: "Mar 2018",
        end: "current",
        bullets: [
          "Curated 14 exhibitions, including two that toured to four European institutions and drew 210,000 combined visitors.",
          "Negotiated the acquisition and cataloguing of a 6,000-print estate archive, now fully digitised and open to researchers.",
          "Raised €2.1M in exhibition funding across public grants and private patrons.",
        ],
      },
      {
        company: "Galleria Ponte Rosso",
        position: "Associate Curator",
        location: "Turin, Italy",
        start: "Sep 2013",
        end: "Feb 2018",
        bullets: [
          "Programmed the gallery's emerging-artist series; six of the eleven exhibited artists entered public collections.",
        ],
      },
    ],
    skills: {
      category: "Curatorial",
      items: [
        "Exhibition Development",
        "Archival Research",
        "Catalogue Writing",
        "Collection Management",
        "Grant Writing",
      ],
    },
    projects: [
      {
        name: "Luce Ferma (touring exhibition)",
        start: "Feb 2022",
        end: "Oct 2023",
        bullets: [
          "Four-venue survey of Italian post-war documentary photography, with a 240-page catalogue and a newly compiled chronology.",
        ],
      },
    ],
    certs: [
      { name: "Collections Care Certificate", org: "ICCROM", date: "Nov 2016" },
    ],
    education: {
      name: "Università Ca' Foscari Venezia",
      location: "Venice, Italy",
      start: "Sep 2008",
      end: "Jul 2013",
      degree: "MA in History of Art",
      gpa: "110 / 110 cum laude",
      note: "Thesis on exhibition-making and the photographic archive in 1970s Italy.",
    },
  },
  {
    layoutId: "masthead",
    presetId: "masthead-citrus",
    photo: "https://i.pravatar.cc/320?img=51",
    fullName: "Emeka Okafor",
    location: "Lagos, Nigeria",
    phone: "+234 803 552 7188",
    email: "emeka@okafor.studio",
    links: ["https://okafor.studio", "https://www.linkedin.com/in/emekaokafor"],
    summary:
      "<p>Brand designer building identities for consumer companies that have to work at billboard size and at 32 pixels. I hand over systems, not decks — type scales, motion rules, and the awkward cases nobody asked about.</p>",
    work: [
      {
        company: "Studio Okafor",
        position: "Founder & Design Director",
        location: "Lagos, Nigeria",
        start: "Jan 2020",
        end: "current",
        bullets: [
          "Delivered 30+ brand systems for fintech, food, and media clients across West Africa and the UK.",
          "Built an identity for a payments app that scaled from launch to 4M users without a rebrand.",
          "Ran the studio to profitability in year one and to a team of six by year three.",
        ],
      },
      {
        company: "Tandem Brand Partners",
        position: "Senior Designer",
        location: "London, United Kingdom",
        start: "Aug 2016",
        end: "Dec 2019",
        bullets: [
          "Led identity design for four consumer rebrands, including a national grocery chain's 900-store rollout.",
        ],
      },
    ],
    skills: {
      category: "Brand & Design",
      items: [
        "Identity Systems",
        "Typography",
        "Art Direction",
        "Packaging",
        "Motion",
        "Figma",
      ],
    },
    projects: [
      {
        name: "Kobo Pay Identity",
        start: "Mar 2021",
        end: "Nov 2021",
        bullets: [
          "Full identity, product UI kit, and motion system, built to hold up at app-icon size and on transit advertising.",
        ],
      },
    ],
    certs: [
      { name: "Type Design Intensive", org: "Type@Cooper", date: "Aug 2019" },
    ],
    education: {
      name: "University of Lagos",
      location: "Lagos, Nigeria",
      start: "Oct 2011",
      end: "Jul 2015",
      degree: "BA in Visual Arts",
      gpa: "First Class Honours",
      note: "Final-year work on Nigerian vernacular signage and letterforms.",
    },
  },
  {
    layoutId: "masthead",
    presetId: "masthead-cobalt",
    photo: "https://i.pravatar.cc/320?img=3",
    fullName: "Luka Kovac",
    location: "Ljubljana, Slovenia",
    phone: "+386 41 226 508",
    email: "luka.kovac@fastmail.com",
    links: ["https://www.linkedin.com/in/lukakovac", "https://lukakovac.dev"],
    summary:
      "<p>Mobile engineer shipping iOS and Android from one codebase without pretending the two platforms are the same. I optimise for startup time, offline behaviour, and the review queue.</p>",
    work: [
      {
        company: "Rivet Mobility",
        position: "Lead Mobile Engineer",
        location: "Ljubljana, Slovenia",
        start: "Jun 2021",
        end: "current",
        bullets: [
          "Cut cold-start time from 3.4s to 1.1s on mid-range Android, lifting day-one retention 9%.",
          "Rebuilt the offline sync layer around a conflict-free log; support tickets about lost trips dropped to near zero.",
          "Set up a release train with automated store submission, taking releases from monthly to weekly.",
        ],
      },
      {
        company: "Bistra Apps",
        position: "Mobile Engineer",
        location: "Maribor, Slovenia",
        start: "Feb 2017",
        end: "May 2021",
        bullets: [
          "Shipped seven client apps on React Native, two of which featured on the App Store front page.",
        ],
      },
    ],
    skills: {
      category: "Mobile Engineering",
      items: [
        "Swift",
        "Kotlin",
        "React Native",
        "TypeScript",
        "CI/CD",
        "Performance Profiling",
      ],
    },
    projects: [
      {
        name: "Offline Sync Engine",
        start: "Jan 2022",
        end: "Aug 2022",
        bullets: [
          "Conflict-free replicated log for trip data, surviving multi-day offline use and clock skew across devices.",
        ],
      },
    ],
    certs: [
      { name: "AWS Certified Developer – Associate", org: "AWS", date: "Apr 2021" },
    ],
    education: {
      name: "University of Ljubljana",
      location: "Ljubljana, Slovenia",
      start: "Oct 2012",
      end: "Sep 2016",
      degree: "BSc in Computer Science",
      gpa: "9.1 / 10",
      note: "Thesis on energy profiling of background sync on mobile devices.",
    },
  },
  // Compass / Numeral / Atlas / Editorial
  {
    layoutId: "compass",
    presetId: "compass-slate",
    photo: "https://i.pravatar.cc/320?img=64",
    fullName: "Kojo Mensah",
    location: "Accra, Ghana",
    phone: "+233 24 118 7740",
    email: "kojo.mensah@proton.me",
    links: ["https://www.linkedin.com/in/kojomensah", "https://mensah.health"],
    summary:
      "<p>Public health programme manager running immunisation and maternal health services across three regions. I plan around what the last cold-chain failure actually taught us, not around what the protocol assumed.</p>",
    work: [
      {
        company: "Volta Health Partnership",
        position: "Programme Manager",
        location: "Accra, Ghana",
        start: "Mar 2020",
        end: "current",
        bullets: [
          "Raised full-course immunisation coverage from 71% to 89% across 140 facilities in three regions.",
          "Rebuilt the cold-chain monitoring process around SMS reporting, cutting spoilage incidents by two thirds.",
          "Managed a $4.2M multi-donor budget across four funders with clean audits in every cycle.",
        ],
      },
      {
        company: "Ministry of Health",
        position: "District Health Officer",
        location: "Ho, Ghana",
        start: "Aug 2015",
        end: "Feb 2020",
        bullets: [
          "Ran maternal health services for a district of 240,000, cutting facility delivery wait times by half.",
        ],
      },
    ],
    skills: {
      category: "Public Health",
      items: [
        "Programme Management",
        "M&E",
        "Cold Chain",
        "Donor Reporting",
        "Health Informatics",
        "Stata",
      ],
    },
    projects: [
      {
        name: "SMS Cold-Chain Reporting",
        start: "Jun 2021",
        end: "Feb 2022",
        bullets: [
          "Daily fridge-temperature reporting from 140 facilities over basic handsets, with an escalation path that closes the loop.",
        ],
      },
    ],
    certs: [
      { name: "Field Epidemiology Training", org: "Ghana FELTP", date: "Nov 2019" },
    ],
    education: {
      name: "University of Ghana",
      location: "Legon, Ghana",
      start: "Sep 2010",
      end: "Jul 2015",
      degree: "MPH in Public Health",
      gpa: "First Class",
      note: "Dissertation on referral delays in rural maternal care.",
    },
  },
  {
    layoutId: "compass",
    presetId: "compass-cerulean",
    photo: "https://i.pravatar.cc/320?img=17",
    fullName: "Ethan Whitcombe",
    location: "Manchester, United Kingdom",
    phone: "+44 7700 118 442",
    email: "ethan.whitcombe@fastmail.com",
    links: ["https://www.linkedin.com/in/ethanwhitcombe"],
    summary:
      "<p>Site reliability engineer for payment systems. I would rather delete an alert than add a dashboard, and I judge a runbook by whether someone half-awake can follow it.</p>",
    work: [
      {
        company: "Ledgerline Payments",
        position: "Staff Site Reliability Engineer",
        location: "Manchester, United Kingdom",
        start: "Jan 2021",
        end: "current",
        bullets: [
          "Took the settlement service from 99.5% to 99.98% availability without adding headcount to the on-call rota.",
          "Cut alert volume 78% by deleting everything that had never once been actioned, then rewriting what remained around symptoms.",
          "Led incident review for 40+ incidents; the top three recurring causes are now structurally impossible.",
        ],
      },
      {
        company: "Northgate Digital",
        position: "Infrastructure Engineer",
        location: "Leeds, United Kingdom",
        start: "Jun 2017",
        end: "Dec 2020",
        bullets: [
          "Migrated 60 services to Kubernetes over 18 months with no customer-visible downtime.",
        ],
      },
    ],
    skills: {
      category: "Reliability",
      items: [
        "Kubernetes",
        "Terraform",
        "Go",
        "Prometheus",
        "Incident Command",
        "PostgreSQL",
      ],
    },
    projects: [
      {
        name: "Settlement Failover",
        start: "Apr 2022",
        end: "Nov 2022",
        bullets: [
          "Active-active across two regions with a tested failover drill every quarter, cutting recovery time from 40 minutes to under 3.",
        ],
      },
    ],
    certs: [
      { name: "Certified Kubernetes Administrator", org: "CNCF", date: "Mar 2021" },
    ],
    education: {
      name: "University of Manchester",
      location: "Manchester, United Kingdom",
      start: "Sep 2013",
      end: "Jun 2017",
      degree: "MEng in Computer Systems Engineering",
      gpa: "First Class Honours",
      note: "Final project on consensus behaviour under partial network partition.",
    },
  },
  {
    layoutId: "numeral",
    presetId: "numeral-mono",
    photo: "https://i.pravatar.cc/320?img=8",
    fullName: "Ingmar Halvorsen",
    location: "Oslo, Norway",
    phone: "+47 941 20 663",
    email: "ingmar.halvorsen@posteo.net",
    links: ["https://www.linkedin.com/in/ingmarhalvorsen", "https://halvorsen.legal"],
    summary:
      "<p>Commercial lawyer working on technology and data agreements. I write contracts the business side can actually read, on the theory that a term nobody understands is a term nobody follows.</p>",
    work: [
      {
        company: "Bjørnstad & Co",
        position: "Senior Associate",
        location: "Oslo, Norway",
        start: "Sep 2019",
        end: "current",
        bullets: [
          "Lead counsel on 60+ SaaS and data-processing agreements a year, including three nine-figure framework deals.",
          "Rewrote the firm's technology contract templates in plain Norwegian and English, cutting average negotiation time by a third.",
          "Advised on GDPR transfer mechanics for eleven clients through the Schrems II fallout.",
        ],
      },
      {
        company: "Nordlys Advokatfirma",
        position: "Associate",
        location: "Bergen, Norway",
        start: "Aug 2015",
        end: "Aug 2019",
        bullets: [
          "Ran commercial contract review for a portfolio of 30 mid-market clients.",
        ],
      },
    ],
    skills: {
      category: "Legal",
      items: [
        "Commercial Contracts",
        "GDPR",
        "Licensing",
        "Negotiation",
        "Procurement",
        "Plain-Language Drafting",
      ],
    },
    projects: [
      {
        name: "Plain-Language Template Set",
        start: "Jan 2021",
        end: "Sep 2021",
        bullets: [
          "Twelve rewritten templates with drafting notes, adopted firm-wide and now the default for all technology work.",
        ],
      },
    ],
    certs: [
      { name: "Advokatbevilling (Bar Admission)", org: "Tilsynsrådet", date: "Jun 2018" },
    ],
    education: {
      name: "Universitetet i Oslo",
      location: "Oslo, Norway",
      start: "Aug 2010",
      end: "Jun 2015",
      degree: "Master of Laws (Cand.jur.)",
      gpa: "B+",
      note: "Thesis on liability allocation in cloud service agreements.",
    },
  },
  {
    layoutId: "numeral",
    presetId: "numeral-signal",
    photo: "https://i.pravatar.cc/320?img=59",
    fullName: "Andre Botha",
    location: "Cape Town, South Africa",
    phone: "+27 82 447 1180",
    email: "andre.botha@hey.com",
    links: ["https://www.linkedin.com/in/andrebotha"],
    summary:
      "<p>Supply chain analyst turned planning lead for grocery retail. Forecasts are cheap; the useful work is deciding what the business does when the forecast is wrong, and writing that down before it is.</p>",
    work: [
      {
        company: "Tafel Retail Group",
        position: "Head of Demand Planning",
        location: "Cape Town, South Africa",
        start: "Feb 2021",
        end: "current",
        bullets: [
          "Cut out-of-stocks on the top 500 lines from 6.1% to 2.4% while holding total inventory flat.",
          "Built the exception-based planning process the team still runs, replacing a weekly full review of 12,000 SKUs.",
          "Ran the planning side of two store-format launches, both stocked correctly from day one.",
        ],
      },
      {
        company: "Kaap Distributors",
        position: "Supply Chain Analyst",
        location: "Stellenbosch, South Africa",
        start: "Mar 2017",
        end: "Jan 2021",
        bullets: [
          "Automated the weekly replenishment run, saving two analyst-days a week and removing a recurring manual error.",
        ],
      },
    ],
    skills: {
      category: "Planning",
      items: [
        "Demand Planning",
        "SQL",
        "Python",
        "Power BI",
        "S&OP",
        "Inventory Optimisation",
      ],
    },
    projects: [
      {
        name: "Exception-Based Planning",
        start: "May 2021",
        end: "Dec 2021",
        bullets: [
          "Reduced the weekly planning review from 12,000 SKUs to the ~300 that had actually moved outside tolerance.",
        ],
      },
    ],
    certs: [
      { name: "APICS CSCP", org: "ASCM", date: "Aug 2020" },
    ],
    education: {
      name: "Stellenbosch University",
      location: "Stellenbosch, South Africa",
      start: "Feb 2013",
      end: "Dec 2016",
      degree: "BCom in Logistics Management",
      gpa: "Cum Laude",
      note: "Final-year project on safety-stock policy under unreliable lead times.",
    },
  },
  {
    layoutId: "atlas",
    presetId: "atlas-onyx",
    photo: "https://i.pravatar.cc/320?img=66",
    fullName: "Daniel Ong",
    location: "Singapore",
    phone: "+65 8114 2260",
    email: "daniel.ong@fastmail.com",
    links: ["https://danielong.studio", "https://www.linkedin.com/in/danielong"],
    summary:
      "<p>Industrial designer working on consumer hardware from sketch to tooling. I spend my time with the people who have to manufacture the thing, because that is where a nice render meets its actual cost.</p>",
    work: [
      {
        company: "Halcyon Devices",
        position: "Lead Industrial Designer",
        location: "Singapore",
        start: "Jul 2020",
        end: "current",
        bullets: [
          "Designed three products from concept to mass production, together shipping over 900,000 units.",
          "Cut the flagship's part count from 41 to 26, taking $6.40 off unit cost and a week off assembly line setup.",
          "Set the material and finish standard now used across the whole range.",
        ],
      },
      {
        company: "Pallas Design Works",
        position: "Industrial Designer",
        location: "Taipei, Taiwan",
        start: "Sep 2016",
        end: "Jun 2020",
        bullets: [
          "Delivered enclosure design for 14 client products across audio, kitchen and medical categories.",
        ],
      },
    ],
    skills: {
      category: "Industrial Design",
      items: [
        "SolidWorks",
        "Keyshot",
        "DFM",
        "Injection Moulding",
        "Prototyping",
        "CMF",
      ],
    },
    projects: [
      {
        name: "Halcyon One Enclosure",
        start: "Feb 2021",
        end: "Mar 2022",
        bullets: [
          "Single-piece housing with an integrated hinge, removing eleven fasteners and a whole assembly station.",
        ],
      },
    ],
    certs: [
      { name: "Design for Manufacture", org: "Singapore Polytechnic", date: "Jul 2019" },
    ],
    education: {
      name: "National University of Singapore",
      location: "Singapore",
      start: "Aug 2012",
      end: "May 2016",
      degree: "B.A. in Industrial Design",
      gpa: "3.9 / 4.0",
      note: "Graduation project on repairable consumer electronics.",
    },
  },
  {
    layoutId: "atlas",
    presetId: "atlas-marine",
    photo: "https://i.pravatar.cc/320?img=60",
    fullName: "Rafael Duarte",
    location: "São Paulo, Brazil",
    phone: "+55 11 96442 7013",
    email: "rafael.duarte@proton.me",
    links: ["https://www.linkedin.com/in/rafaelduarte", "https://duarte.dev"],
    summary:
      "<p>Platform engineer building the paved road other teams ship on. Success is measured in how rarely anyone has to talk to me, not in how many tools I have deployed.</p>",
    work: [
      {
        company: "Marégrafo Tecnologia",
        position: "Principal Platform Engineer",
        location: "São Paulo, Brazil",
        start: "Apr 2021",
        end: "current",
        bullets: [
          "Cut median time from first commit to production for a new service from 9 days to under 4 hours.",
          "Built the internal developer portal now used by 22 squads, replacing four competing sets of instructions.",
          "Reduced cloud spend 31% by making cost visible per service and per team at deploy time.",
        ],
      },
      {
        company: "Praia Digital",
        position: "Backend Engineer",
        location: "Florianópolis, Brazil",
        start: "Jan 2017",
        end: "Mar 2021",
        bullets: [
          "Owned the billing service through a 12x growth in transaction volume.",
        ],
      },
    ],
    skills: {
      category: "Platform",
      items: [
        "Go",
        "Kubernetes",
        "Terraform",
        "Backstage",
        "GitHub Actions",
        "OpenTelemetry",
      ],
    },
    projects: [
      {
        name: "Paved Road Templates",
        start: "Aug 2021",
        end: "Apr 2022",
        bullets: [
          "Service templates with CI, observability and on-call wiring built in, adopted by 22 squads in two quarters.",
        ],
      },
    ],
    certs: [
      { name: "AWS Solutions Architect – Professional", org: "AWS", date: "Oct 2022" },
    ],
    education: {
      name: "Universidade de São Paulo",
      location: "São Paulo, Brazil",
      start: "Feb 2012",
      end: "Dec 2016",
      degree: "BSc in Computer Engineering",
      gpa: "8.6 / 10",
      note: "Thesis on scheduling fairness in shared container clusters.",
    },
  },
  {
    layoutId: "editorial",
    presetId: "editorial-sand",
    photo: "https://i.pravatar.cc/320?img=12",
    fullName: "Bento Almeida",
    location: "Lisbon, Portugal",
    phone: "+351 933 118 460",
    email: "bento.almeida@hey.com",
    links: ["https://almeida.press", "https://www.linkedin.com/in/bentoalmeida"],
    summary:
      "<p>Editor and writer building long-form desks that survive contact with a budget. I commission fewer pieces than my predecessors did and finish all of them.</p>",
    work: [
      {
        company: "Corrente Magazine",
        position: "Editor-in-Chief",
        location: "Lisbon, Portugal",
        start: "Jan 2020",
        end: "current",
        bullets: [
          "Took the title from quarterly to monthly and grew paid subscriptions from 4,000 to 31,000.",
          "Commissioned two investigations that led to parliamentary hearings.",
          "Built a freelance roster of 60 writers with rates published openly, which halved time-to-commission.",
        ],
      },
      {
        company: "Diário Atlântico",
        position: "Features Editor",
        location: "Porto, Portugal",
        start: "Mar 2014",
        end: "Dec 2019",
        bullets: [
          "Ran the weekend features desk, editing roughly 300 pieces a year.",
        ],
      },
    ],
    skills: {
      category: "Editorial",
      items: [
        "Commissioning",
        "Long-Form Editing",
        "Fact-Checking",
        "Audience Strategy",
        "Budgeting",
      ],
    },
    projects: [
      {
        name: "The Water Series",
        start: "Mar 2022",
        end: "Nov 2022",
        bullets: [
          "Six-part investigation into drought policy, cited in two parliamentary sessions and syndicated in four countries.",
        ],
      },
    ],
    certs: [
      { name: "Investigative Reporting Fellowship", org: "Reuters Institute", date: "Jun 2021" },
    ],
    education: {
      name: "Universidade Nova de Lisboa",
      location: "Lisbon, Portugal",
      start: "Sep 2009",
      end: "Jul 2013",
      degree: "BA in Journalism",
      gpa: "17 / 20",
      note: "Final project on the economics of independent magazines.",
    },
  },
  {
    layoutId: "editorial",
    presetId: "editorial-sage",
    photo: "https://i.pravatar.cc/320?img=70",
    fullName: "Nabil Haddad",
    location: "Amman, Jordan",
    phone: "+962 7 9114 2280",
    email: "nabil.haddad@posteo.net",
    links: ["https://www.linkedin.com/in/nabilhaddad", "https://haddad.works"],
    summary:
      "<p>Architect working on public buildings and adaptive reuse. Most of my job is finding what a building already does well before proposing to change anything about it.</p>",
    work: [
      {
        company: "Studio Rukn",
        position: "Associate Architect",
        location: "Amman, Jordan",
        start: "Jun 2019",
        end: "current",
        bullets: [
          "Led design on four public projects, including a 4,200 m² community library delivered on budget.",
          "Ran the adaptive reuse of a 1930s customs house into a cultural centre, keeping 82% of the existing structure.",
          "Set up the practice's daylight and thermal modelling workflow, now used on every project at concept stage.",
        ],
      },
      {
        company: "Bureau Qasr",
        position: "Project Architect",
        location: "Beirut, Lebanon",
        start: "Sep 2014",
        end: "May 2019",
        bullets: [
          "Delivered six residential and mixed-use projects from competition through construction administration.",
        ],
      },
    ],
    skills: {
      category: "Architecture",
      items: [
        "Rhino",
        "Revit",
        "Adaptive Reuse",
        "Daylight Modelling",
        "Construction Administration",
        "Public Consultation",
      ],
    },
    projects: [
      {
        name: "Customs House Reuse",
        start: "Jan 2021",
        end: "Oct 2023",
        bullets: [
          "Cultural centre inside a 1930s shell, retaining 82% of the existing structure and cutting embodied carbon by roughly 60% against a new build.",
        ],
      },
    ],
    certs: [
      { name: "Licensed Architect", org: "Jordan Engineers Association", date: "Apr 2017" },
    ],
    education: {
      name: "University of Jordan",
      location: "Amman, Jordan",
      start: "Sep 2009",
      end: "Jun 2014",
      degree: "B.Arch in Architecture",
      gpa: "3.7 / 4.0",
      note: "Thesis on courtyard typologies as passive cooling in hot-arid cities.",
    },
  },
];
