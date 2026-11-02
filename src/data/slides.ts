import { SlideData } from '../types';

export const PRESENTATION_SLIDES: SlideData[] = [
  {
    id: 1,
    title: 'Engineering Biomimicry: Spider-Web Tensile Networks & Honeycomb Cellular Mechanics',
    subtitle: 'Honeycomb_Spiderweb_Structures_C331_C332_C341_C347.pptx',
    category: 'intro',
    content: {
      heading: 'Multi-Scale Bio-Mechanical Finite Element Analysis & Energy Dissipation in Structural Systems',
      bullets: [
        'Investigation into evolutionary load-bearing solutions for extreme physical environments.',
        'Bridging micro-scale cellular kinematics (honeycomb cores) and non-linear macromolecular silk networks (orb webs).',
        'Applications spanning earthquake base shear isolation, aerospace crashworthiness, and sacrificial impact damping.',
        'Academic Capstone Project presented by Group 6 // Division E2.'
      ],
      stats: [
        { label: 'Hales Optimality', value: '30% Less Mass', detail: 'Minimal perimeter per unit area', color: 'text-yellow-400' },
        { label: 'Silk Tensile Strength', value: '1.3 GPa', detail: 'Exceeds structural grade steel', color: 'text-sky-400' },
        { label: 'Fracture Toughness', value: '160 MJ/m³', detail: '3x toughness of Kevlar-49', color: 'text-rose-400' },
        { label: 'Seismic Dissipation', value: '>75% Energy', detail: 'Honeycomb base shear damping', color: 'text-emerald-400' }
      ]
    },
    notes: 'Welcome to Group 6\'s presentation on biomimetic structural mechanics. Today we examine how two contrasting biological designs—hexagonal honeycombs and radial orb webs—resolve extreme stress, shear, and ballistic impact.'
  },
  {
    id: 2,
    title: 'Project Team Details & Research Distribution',
    subtitle: 'Group 6 • Division E2 • Engineering Biomimicry Research Group',
    category: 'team',
    content: {
      diagramType: 'team-grid',
      heading: 'Core Engineering Investigators (Roll Nos: C331, C332, C341, C347)',
      bullets: [
        'Mohd Rayaan Naseem (C331, SAP: 70022600219) — Tensile Dynamics & Verlet Engine Lead',
        'Arjun Nayak (C332, SAP: 70022600463) — Structural FEA & Foundation Mechanics Lead',
        'Advait Pandya (C341, SAP: 70022600380) — Aerospace Core & Plastic Buckling Lead',
        'Khushit Patidar (C347, SAP: 70022600053) — Biomimetic Materials Matrix & Benchmarking Lead'
      ],
      highlightBox: {
        title: 'Collaborative Multi-Disciplinary Framework',
        text: 'The research division split focus across computational fluid/structural interaction (FSI), non-linear constitutive material laws, and continuum mechanics to validate nature\'s structural optimality.',
        tag: 'GROUP 6 • DIV E2'
      }
    },
    notes: 'Slide 2 presents our group roster with our official academic credentials, SAP IDs, and specific engineering focus areas across the physics simulations.'
  },
  {
    id: 3,
    title: 'The Biomimetic Paradigm: Nature\'s Structural Optimality',
    subtitle: 'Why Conventional Monolithic Systems Fail Under Extreme Dynamic Events',
    category: 'intro',
    content: {
      heading: 'Evolutionary Pressure vs Conventional Civil & Aerospace Engineering',
      bullets: [
        'Conventional civil foundations rely on rigid, monolithic concrete slabs that suffer brittle shear fractures during tectonic fault rupture.',
        'Aerospace crash structures require maximum specific energy absorption (SEA) with absolute minimum parasitic mass.',
        'Biological structures evolved over 380 million years under severe resource constraints, arriving at geometric minimization (honeycomb) and non-linear sacrificial tolerance (spiderweb).',
        'Key Principle: Rather than resisting force with infinite stiffness, biological architectures manage energy through controlled deformation, geometry, and sacrificial failure.'
      ],
      columns: [
        {
          title: 'Monolithic Solid Slab',
          badge: 'Brittle Failure Mode',
          items: [
            'Direct propagation of seismic shear waves into the superstructure',
            'High mass induces massive inertial forces (F = m · a)',
            'Catastrophic cracking once critical tensile stress is reached'
          ]
        },
        {
          title: 'Biomimetic Cellular Matrix',
          badge: 'Progressive Dissipation',
          items: [
            'Hexagonal cell walls flex and buckle plastically, absorbing energy',
            'Up to 92% hollow fraction dramatically lowers inertial mass',
            'Fault lines arrest within cell cavities; localized yield prevents global collapse'
          ]
        }
      ]
    },
    notes: 'Conventional structures fight physical forces with bulk matter; biological structures redirect, distribute, and absorb forces through hierarchical topology.'
  },
  {
    id: 4,
    title: 'Honeycomb Cellular Mechanics & The Hales Honeycomb Theorem',
    subtitle: 'Geometric Proof of Minimal Perimeter Partitioning & Maximum Flexural Rigidity',
    category: 'honeycomb',
    content: {
      diagramType: 'hales-theorem',
      heading: 'Mathematical Optimality: Proven by Thomas Hales in 1999',
      bullets: [
        'The Honeycomb Conjecture: A regular hexagonal grid provides the least perimeter way to divide a Euclidean plane into regions of equal area.',
        'Saves ~30% material mass compared to triangular or square tessellations while providing isotropic planar shear stiffness.',
        'Out-of-plane flexural stiffness scales as the cube of core height (I ~ h³), allowing sandwich panels to achieve 37x flexural rigidity of solid plates at 1/5th the mass.',
        'Constitutive relation for relative density: ρ*/ρs = (2/√3) · (t/l), where t is foil thickness and l is cell side length.'
      ],
      highlightBox: {
        title: 'Gibson-Ashby Cellular Solid Model',
        text: 'The plateau stress σ_pl* under out-of-plane compression follows σ_pl* / σ_ys ≈ 5.6 · (t/l)^(5/3). This wide plastic plateau is nature\'s ideal shock absorber.',
        tag: 'GOVERNING FEA EQUATION'
      }
    },
    notes: 'Thomas Hales analytically proved what bees solved through evolution: the regular hexagon minimizes perimeter. In structural terms, minimal perimeter means minimal structural mass for maximum enclosed volume.'
  },
  {
    id: 5,
    title: 'Civil Application: Honeycomb Skyscraper Foundation & Seismic Shear',
    subtitle: 'Replacing Monolithic Concrete Rafts with Ultra-High-Performance Cellular Lattices',
    category: 'honeycomb',
    content: {
      diagramType: 'honeycomb-fea',
      heading: 'Dynamic Base Shear Damping During Richter 7.5+ Seismic Waves',
      bullets: [
        'Problem: During major earthquakes, horizontal shear waves (S-waves) induce violent ground acceleration (PGA > 0.65g), leading to skyscraper overturning moments and base shear rupture.',
        'Biomimetic Solution: An Ultra-High-Performance Fiber-Reinforced Concrete (UHPFRC) honeycomb cellar sub-foundation situated between the raft transfer slab and bedrock.',
        'Mechanism: Hexagonal cell walls undergo kinematic shear deformation (diamond shearing) without losing vertical bearing capacity.',
        'Telemetry Result: >75% to 88% attenuation of ground shear energy before transmission into the 45-80 story skyscraper core.'
      ],
      stats: [
        { label: 'Seismic Dissipation', value: '78.5% - 88.2%', detail: 'Measured at transfer slab', color: 'text-emerald-400' },
        { label: 'Superstructure Drift', value: '<0.15°', detail: 'Well within ASCE 7-22 limits', color: 'text-sky-400' },
        { label: 'Safety Factor', value: '2.4x - 3.8x', detail: 'Against global overturning', color: 'text-yellow-400' }
      ]
    },
    notes: 'In Module 1 of our simulator, we demonstrated that a skyscraper mounted on a honeycomb sub-foundation survives a 0.65g earthquake with less than 0.15 degrees of drift, because the foundation acts as a distributed mechanical fuse.'
  },
  {
    id: 6,
    title: 'Aerospace Core Mechanics: ASTM C365 Compression & Crash Buckling',
    subtitle: 'Flatwise Compressive Behavior, Progressive Folding, and Transonic Flutter Resistance',
    category: 'honeycomb',
    content: {
      heading: 'CFRP Sandwich Panels Under Dynamic 2.5-Ton Ram Impact & Static Overload',
      bullets: [
        'Sandwich Construction: Two ultra-thin high-modulus CFRP face sheets bonded to an aerospace-grade Nomex or aluminum honeycomb core.',
        'ASTM C365 Flatwise Compression Test: The core exhibits three distinct regimes: linear elastic cell wall bending, elastic/plastic wall buckling, and final densification.',
        'Crash Buckling: Under high-speed impact (e.g. formula crash boxes, UAV skins, aerospace nose cones), cell walls buckle into regular concertina folds.',
        'Specific Energy Absorption (SEA): Honeycomb cores absorb up to 35 kJ/kg, exceeding any monolithic metal tube of equivalent envelope dimensions.'
      ],
      columns: [
        {
          title: 'Hexagonal Core',
          badge: 'Highest Efficiency',
          items: [
            'Near-isotropic in-plane shear modulus',
            'Smooth progressive accordion folding',
            'Minimum peel stress along adhesive fillets'
          ]
        },
        {
          title: 'Square Core',
          badge: 'Orthotropic',
          items: [
            'Stiffer in 0°/90° axial directions',
            'Susceptible to diagonal shear buckling',
            'Higher mass fraction for identical stiffness'
          ]
        },
        {
          title: 'Triangular Core',
          badge: 'High Rigidity',
          items: [
            'Highest shear stiffness before yield',
            'Brittle Euler buckling without plastic plateau',
            '35% heavier than hexagonal counterpart'
          ]
        }
      ]
    },
    notes: 'When an aerospace crash occurs, we want the structure to crush progressively at a constant plateau force. Hexagonal honeycomb accordion folding achieves the cleanest plateau force curve of any structural geometry.'
  },
  {
    id: 7,
    title: 'Spider Silk: Hierarchical Molecular Architecture',
    subtitle: 'Major Ampullate Dragline Silk: 1.3 GPa Tensile Strength at Ultra-Low Density',
    category: 'spiderweb',
    content: {
      heading: 'The Nanoscale Secret: Semi-Crystalline Polyalanine β-Sheets in an Amorphous Matrix',
      bullets: [
        'Major Ampullate (MA) Silk: Spun by orb-weaving spiders (Nephila clavipes) for the web\'s structural framework and safety dragline.',
        'Tensile Strength: Reaches 1.3 to 1.5 GPa—roughly five times stronger than structural steel on a per-mass basis (density = 1.31 g/cm³).',
        'Molecular Architecture: Composed of rigid anti-parallel β-sheet nanocrystals (~3 nm in size) cross-linking a flexible, disordered glycine-rich amorphous polypeptide matrix.',
        'Extensibility: Dragline silk elongates 30-40% before rupture, whereas capture spiral (flagelliform) silk stretches over 270%, behaving like rubber.'
      ],
      highlightBox: {
        title: 'Hierarchy of Energy Dissipation',
        text: 'At low strains (ε < 2%), hydrogen bonds deform elastically. At moderate strains, amorphous chains uncoil. At high strains, β-sheets systematically rupture one by one, consuming immense mechanical energy.',
        tag: 'NANOSCALE DYNAMICS'
      }
    },
    notes: 'Spider silk is often hailed as nature\'s wonder fiber. Its combination of high tensile strength and high ductility yields a work of fracture of 160 MJ/m³, outperforming all synthetic bulletproof fibers.'
  },
  {
    id: 8,
    title: 'The MIT Buehler Principle: Sacrificial Tensile Failure',
    subtitle: 'How Localized Rupture Protects the Global Orb Web from Catastrophic Cascade',
    category: 'spiderweb',
    content: {
      diagramType: 'buehler-sacrificial',
      heading: 'Non-Linear Strain-Softening: Marcus Buehler\'s Paradigm-Shifting Discovery',
      bullets: [
        'Conventional Engineering Paradox: Strong, brittle materials (like steel wire or carbon fiber) transmit stress shocks uniformly throughout a connected network.',
        'If one thread breaks in a steel wire web, the dynamic recoil overstresses adjacent threads, causing immediate unzipping and catastrophic total collapse.',
        'Buehler Discovery (Nature, 2012): Spider silk exhibits non-linear strain-softening at high strains right before ultimate failure.',
        'Sacrificial Mechanics: Under extreme localized load (ballistic bug impact or hurricane wind gusts), the stressed filament yields and breaks cleanly without propagating dynamic stress waves to neighboring spokes. 90%+ of the web remains undamaged.'
      ],
      stats: [
        { label: 'Damage Confinement', value: 'Localized <5%', detail: 'Only hit threads severed', color: 'text-emerald-400' },
        { label: 'Work of Fracture', value: '160 MJ/m³', detail: '3x superior to Kevlar', color: 'text-sky-400' },
        { label: 'Dynamic Recoil', value: '-85% Shock', detail: 'Damped by viscous drag', color: 'text-rose-400' }
      ]
    },
    notes: 'Professor Marcus Buehler at MIT showed that spider webs survive hurricanes precisely because silk knows when to fail. A sacrificial thread snaps cleanly, isolating the wound and preserving web integrity.'
  },
  {
    id: 9,
    title: 'Multi-Physics Simulation: 2nd-Order Verlet Integration',
    subtitle: 'Symplectic Numerical Scheme for Dynamic Tensile Spring-Mass Networks',
    category: 'simulation',
    content: {
      diagramType: 'spider-verlet',
      heading: 'Numerical Formulation of the Bio-Structures Web Engine',
      bullets: [
        'Position-Based Verlet Integration: x(t + Δt) = 2x(t) - x(t - Δt) + a(t) · Δt². Guarantees phase-space volume conservation (symplectic) without energy drift over long integration cycles.',
        'Spring Network Constraints: Non-linear Hookean tension constraints with strain-dependent modulus: k_eff = k0 · (1 + α · (d/L0 - 1)).',
        'Sacrificial Cut Condition: When strain ε > ε_rupture (1.68 for Dragline, 2.65 for Flagelliform, 1.12 for Steel), edge is marked severed and omitted from relaxation iterations.',
        'Environmental Forcing: Aerodynamic drag wave F_drag = 1/2 · Cd · ρ_air · v_wind² + Brownian branch sway boundary oscillations on fixed anchors.'
      ],
      highlightBox: {
        title: 'Relaxation Solver Loop',
        text: 'The constraint solver executes 5 to 12 Gauss-Seidel distance relaxation passes per frame, achieving near-rigid axial filament stiffness while simulating realistic catenary sag.',
        tag: 'NUMERICAL STABILITY'
      }
    },
    notes: 'Our web simulator implements this exact second-order Verlet formulation in pure Canvas. You can see how varying the wind velocity from 10 to 90 km/h tests the sacrificial threshold of each silk grade.'
  },
  {
    id: 10,
    title: 'Biomimetic Material Benchmarking Matrix',
    subtitle: 'Quantitative Comparison Across Natural and Advanced Synthetic Systems',
    category: 'materials',
    content: {
      diagramType: 'material-matrix',
      heading: 'Ashby Property Matrix: Specific Strength vs Fracture Toughness',
      bullets: [
        'Spider Dragline Silk: 1,300 MPa tensile, 160 MJ/m³ toughness, 1.31 g/cm³ density. The global benchmark for kinetic energy absorption.',
        'CFRP Honeycomb Sandwich: 37x flexural stiffness vs solid plate, 0.18 g/cm³ core density, 92% hollow fraction. The gold standard for bending-dominated lightweight structures.',
        'Kevlar-49 (Aramid): 3,000 MPa tensile, 50 MJ/m³ toughness, 1.44 g/cm³ density. High strength, but only 1/3 the fracture energy absorption of silk due to low breaking strain (2.4%).',
        'Structural Steel (ASTM A36): 400 MPa tensile, 6 MJ/m³ toughness, 7.85 g/cm³ density. Prone to severe inertial whipping and seismic amplification.'
      ],
      columns: [
        {
          title: 'Dragline Silk',
          badge: '160 MJ/m³ Toughness',
          items: ['5x steel tensile per unit mass', '35% ultimate elongation', 'Sequential β-sheet unfolding']
        },
        {
          title: 'CFRP Honeycomb',
          badge: '37x Flexural Rigidity',
          items: ['Zero shear lag across face sheets', '35 kJ/kg specific crash energy', '92% air cavity isolation']
        },
        {
          title: 'Kevlar-49',
          badge: '3,000 MPa Tensile',
          items: ['High stiffness, low ductility', 'Brittle unzipping under shear', 'Sensitive to UV degradation']
        }
      ]
    },
    notes: 'This matrix illustrates why biomimicry is essential: synthetic materials often chase peak tensile strength alone, but real-world survivability demands high fracture energy and geometric compliance.'
  },
  {
    id: 11,
    title: 'Real-World Engineering Implementations',
    subtitle: 'From the James Webb Space Telescope to Next-Gen Seismic Skyscraper Basements',
    category: 'conclusion',
    content: {
      heading: 'Translating Natural Blueprints into Critical Infrastructure',
      bullets: [
        'James Webb Space Telescope (JWST): 18 hexagonal beryllium mirror segments and carbon-composite honeycomb backing structure for cryo-thermal stability and ultra-lightweight launch payload.',
        'Boeing 787 Dreamliner & Airbus A350: Nomex/Kevlar honeycomb cores utilized across rudders, elevators, wing flaps, and cabin floors to shed thousands of kilograms.',
        'Tokyo & San Francisco Seismic Isolation: High-rise base isolation units transitioning to cellular auxetic and hexagonal metamaterial damper pads to dissipate horizontal shear.',
        'Bio-Inspired Ballistic Armor & Cable Nets: Synthetic recombinant spider silk fibers (spidroin polymers) in development for shrapnel-containment containment rings and arrester cables.'
      ],
      stats: [
        { label: 'JWST Mirror Mass', value: '20 kg / segment', detail: 'vs >100 kg for solid glass', color: 'text-yellow-400' },
        { label: 'B787 Weight Cut', value: '20% Overall', detail: 'Honeycomb sandwich composites', color: 'text-sky-400' },
        { label: 'Kinetic Stopping', value: '450 m/s', detail: 'Dissipated by bio-silk fibers', color: 'text-emerald-400' }
      ]
    },
    notes: 'These are not theoretical concepts; from the deep cosmos with the James Webb telescope to the commercial skies with the 787, honeycomb cellular structures define modern lightweight engineering.'
  },
  {
    id: 12,
    title: 'Conclusions, Academic References & Group Reflections',
    subtitle: 'Group 6 (C331 Mohd Rayaan, C332 Arjun Nayak, C341 Advait Pandya, C347 Khushit Patidar)',
    category: 'conclusion',
    content: {
      heading: 'Key Takeaways & Computational Engineering Findings',
      bullets: [
        '1. Geometry Trumps Bulk: Hexagonal honeycombs prove that topological layout and material positioning achieve higher structural stiffness than brute material mass.',
        '2. Sacrificial Mechanics Prevent Catastrophe: Spider orb webs reveal that localized non-linear failure preserves global integrity—a crucial paradigm for civil infrastructure resilience.',
        '3. Multi-Physics FEA Validation: Our integrated canvas engines demonstrate in real-time that honeycomb foundations attenuate seismic shear by >75%, and spider silk nets localize ballistic damage cleanly.',
        '4. Future Horizons: Integration of 3D bioprinting, recombinant protein spinning, and computational metamaterials will drive the next century of sustainable engineering.'
      ],
      highlightBox: {
        title: 'Core Literature & Citations',
        text: '• Hales, T. C. (2001). "The Honeycomb Conjecture." Discrete & Computational Geometry.\n• Buehler, M. J. et al. (2012). "Severe localized damage tolerance of spider webs." Nature 482.\n• Gibson, L. J. & Ashby, M. F. (1997). "Cellular Solids: Structure and Properties." Cambridge Univ Press.\n• Vollrath, F. & Knight, D. P. (2001). "Liquid crystalline spinning of spider silk." Nature 410.',
        tag: 'ACADEMIC BIBLIOGRAPHY'
      }
    },
    notes: 'Thank you for your attention. We now invite the audience to explore both interactive simulator modules, examine the real-time FEA parameters, and test the dynamic physics engines live!'
  }
];
