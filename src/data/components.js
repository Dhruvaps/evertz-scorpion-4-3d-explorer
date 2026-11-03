/**
 * Evertz SCORPION-4 Miniature Modular Frame Component Dataset
 * Technical Accuracy Audit - Final Refined Edition
 * 
 * Sources:
 * 1. Official Evertz SCORPION-4 product documentation & specifications
 * 2. Visual reference photographs: public/references/ (two front views and one side view)
 * 3. Verified broadcast engineering standards (SMPTE, IEEE)
 * 
 * Audit Standards Applied:
 * - Documented specifications are strictly separated from photograph observations.
 * - Reference images consist of two front views and one side view; rear hardware arrangement is marked UNVERIFIED.
 * - Exact heatsink fin count is marked as requiring CAD drawing verification (~26–28 fins observed).
 * - MIO-BLADE-Z21 connectors are described as observed SDI IN/OUT connectors without asserting unverified physical standards.
 * - Acoustic claims avoid unverified '0 dB' assertions.
 */

export const CHASSIS_SPECIFICATIONS = {
  model: 'Evertz SCORPION-4',
  formFactor: 'Portable Miniature Modular Frame (Half-Rack Width)',
  dimensions: {
    height: '2.5 inches (63.5 mm)',
    width: '8.5 inches (215.9 mm)',
    depth: '6.0 inches (152.4 mm)'
  },
  cooling: 'Fanless integrated heatsink (passive convection cooling)',
  moduleCapacity: '4 SCORPION I/O Mini Modules',
  sfpCapacity: '4 SFP ports',
  trunkConnectivity: 'Dual 10GbE / 25GbE trunk connectivity',
  power: 'Dual external 12V DC supplies',
  powerConsumption: '25W empty frame, 132W fully loaded',
  operatingTemperature: '0–50°C'
};

export const MODULE_CATEGORIES = [
  { id: 'chassis', name: 'Chassis & Power System', count: 6 },
  { id: 'blade-z21', name: 'MIO-BLADE-Z21 Microservice Module', count: 11 },
  { id: 'vb-12g', name: 'MIO-VB-2-12G Video Access Module', count: 3 },
  { id: 'ge-ip', name: 'MIO-GE-RJ45-IP Ethernet Module', count: 4 },
  { id: 'rear-trunk', name: 'Rear Trunk Interfaces (Unverified Arrangement)', count: 6 },
];

export const COMPONENTS_DATA = {
  // =============================================================
  // CHASSIS & POWER SYSTEM
  // =============================================================
  'chassis-frame': {
    id: 'chassis-frame',
    name: 'SCORPION-4 Chassis Enclosure',
    module: 'Chassis System',
    category: 'chassis',
    type: 'Mechanical / EMI Enclosure',
    interface: 'Black Metal Miniature Modular Enclosure',
    spec: '8.5" W × 2.5" H × 6.0" D (Fanless Portable Form Factor)',
    auditStatus: 'verified',
    verifiedSpecs: [
      'Documented dimensions: Height 2.5" (63.5 mm), Width 8.5" (215.9 mm), Depth 6.0" (152.4 mm).',
      'Module capacity: 4 SCORPION I/O Mini Modules.',
      'SFP capacity: 4 SFP ports on chassis.',
      'Operating temperature range: 0–50°C.',
      'Cooling: Fanless integrated heatsink (passive convection cooling without mechanical fans).'
    ],
    photoObservations: [
      'Black matte finish metal enclosure body with side ventilation matrices (Photo 1 & Photo 3).',
      'Perforated circular ventilation matrix along left and right side walls for cross-chassis airflow (Photo 3).',
      'Bottom mounting flange ears running the full depth with fastener slots (Photo 3).',
      'Front panel divided into left black fascia and right modular bay accommodating 4 mini-module slots (Photo 1).'
    ],
    verificationRequired: [
      'Exact metal alloy grade (e.g. 5052 vs 6061 aluminum) requires factory CAD drawing verification.',
      'Rack-mount shelf tray accessories for 19" broadcast rack installation.'
    ],
    purpose: 'Houses internal backplane and routing infrastructure, provides structural enclosure, and provides thermal and EMI/RFI shielding for installed SCORPION mini-modules.',
    technicalExplanation:
      'The SCORPION-4 chassis is engineered as a compact half-rack width portable enclosure (8.5" W × 2.5" H × 6.0" D). ' +
      'It supports up to four SCORPION I/O Mini Modules in front-accessible slots and provides four SFP ports for dual 10GbE / 25GbE trunk connectivity. ' +
      'Its 2.5-inch height accommodates the heavy top-mounted extrusion heatsink, operating fanlessly within a 0–50°C ambient temperature envelope.',
    troubleshooting: [
      'Verify chassis mounting clearance: Maintain unobstructed airflow on top and sides for passive thermal convection.',
      'Inspect side ventilation perforations to ensure they remain clear of dust or tape in mobile flypack cases.',
      'Verify all module retention fasteners are seated to ensure proper chassis electrical grounding.'
    ],
    relatedComponents: ['chassis-heatsink', 'blade-plate', 'vb-plate', 'ge-plate']
  },

  'chassis-heatsink': {
    id: 'chassis-heatsink',
    name: 'Integrated Convection Cooling Heatsink',
    module: 'Chassis System',
    category: 'chassis',
    type: 'Thermal Management / Passive Cooling',
    interface: 'Black Extruded Aluminum Heatsink with Longitudinal Fins',
    spec: 'Fanless Convection Cooling (Operating Temp: 0–50°C)',
    auditStatus: 'verified',
    verifiedSpecs: [
      'Cooling: Fanless integrated heatsink (passive convection cooling).',
      'Operating temperature: 0–50°C ambient environment.',
      'Rated for chassis power envelope: 25W empty frame up to 132W fully loaded frame.'
    ],
    photoObservations: [
      'Parallel extrusion cooling fins running front-to-back across the top chassis (approximately 26–28 fins visible in top profile in Photo 1 & Photo 3).',
      'Stepped front heatsink ledge with vertical clearance cutouts and hex socket retention screws (Photo 1).',
      'Central circular medallion laser-etched on top surface with SCORPION emblem (Photo 1).'
    ],
    verificationRequired: [
      'Exact heatsink fin count, fin pitch spacing, and extrusion thickness require manufacturer CAD mechanical drawing verification (not explicitly stated in text specifications).',
      'Specific thermal resistance (°C/W) curve under varying ambient convection velocities requires manufacturer thermal model verification.',
      'Internal thermal interface material (TIM) pad thickness and phase-change temperature rating.'
    ],
    purpose: 'Passively dissipates thermal energy generated by compute FPGAs, video transceivers, and SFP trunk processors without cooling fans.',
    technicalExplanation:
      'The SCORPION-4 cooling architecture is completely fanless, relying on the thermal conductivity of the heavy extruded aluminum heatsink lid. ' +
      'Internal hot spots are thermally coupled directly to the heatsink baseplate. Convective airflow through the longitudinal fin valleys ' +
      'dissipates heat generated by installed cards within the 25W–132W power envelope without mechanical fan failure points.',
    troubleshooting: [
      'Ensure at least 50mm (2.0 inches) of vertical clearance above heatsink fins for unrestricted natural air convection.',
      'Check chassis skin temperature with non-contact IR thermometer (normal operational range: 38°C to 55°C at 25°C ambient).',
      'Inspect fin valleys for accumulated airborne debris or obstruction.'
    ],
    relatedComponents: ['chassis-frame', 'blade-plate', 'net-port-1']
  },

  'pwr-1': {
    id: 'pwr-1',
    name: '12VDC Power Input 1',
    module: 'Power Subsystem',
    category: 'chassis',
    type: 'DC Power Supply Input (Primary)',
    interface: 'Locking Coaxial DC Jack with Threaded Retention Collar',
    spec: 'Dual External 12V DC Supply Input (25W Empty / 132W Fully Loaded)',
    auditStatus: 'verified',
    verifiedSpecs: [
      'Power requirement: Dual external 12V DC supplies.',
      'Chassis power consumption: 25W empty frame, 132W fully loaded frame.',
      'Supports dual-source power redundancy.'
    ],
    photoObservations: [
      'Threaded locking coaxial DC barrel receptacle labeled "1" above the jack (Photo 1).',
      'Associated status LED labeled "1" directly to the right (Photo 1).',
      'Grouped with Power 2 under silkscreen bracket labeled "12VDC" (Photo 1).'
    ],
    verificationRequired: [
      'Exact DC barrel connector inner/outer pin diameter (e.g., 2.1mm vs 2.5mm ID, 5.5mm OD) requires mechanical drawing verification.',
      'Center pin electrical polarity (+ vs -) and operational DC input tolerance window require power supply datasheet verification.',
      'Internal OR-ing diode / ideal controller architecture requires electrical schematic confirmation.'
    ],
    purpose: 'Primary 12V DC power input supplying operating voltage to the SCORPION-4 backplane and installed MIO modules.',
    technicalExplanation:
      'The SCORPION-4 utilizes dual external 12V DC power inputs. Power Input 1 receives external regulated +12VDC power. ' +
      'When both inputs are powered, the frame operates with redundant power security, drawing from external 12V supplies sized to handle ' +
      'the maximum 132W fully loaded consumption.',
    troubleshooting: [
      'Verify external 12V DC power brick rating (must deliver 12V DC with adequate wattage for installed daughtercard load, up to 132W full load).',
      'Ensure threaded retention ring is securely hand-tightened to prevent accidental pull-out.',
      'Observe Power LED 1 to verify DC input presence.'
    ],
    relatedComponents: ['pwr-2', 'pwr-led-1', 'pwr-led-2']
  },

  'pwr-2': {
    id: 'pwr-2',
    name: '12VDC Power Input 2 (Redundant)',
    module: 'Power Subsystem',
    category: 'chassis',
    type: 'DC Power Supply Input (Secondary / Redundant)',
    interface: 'Locking Coaxial DC Jack with Threaded Retention Collar',
    spec: 'Dual External 12V DC Supply Input (25W Empty / 132W Fully Loaded)',
    auditStatus: 'verified',
    verifiedSpecs: [
      'Power requirement: Dual external 12V DC supplies.',
      'Chassis power consumption: 25W empty frame, 132W fully loaded frame.',
      'Supports redundant dual power architecture.'
    ],
    photoObservations: [
      'Threaded locking coaxial DC barrel receptacle labeled "2" above the jack (Photo 1).',
      'Associated status LED labeled "2" directly to the right (Photo 1).',
      'Grouped under common "12VDC" bracket on front fascia (Photo 1).'
    ],
    verificationRequired: [
      'Exact mating barrel dimensions and pin polarity require hardware datasheet verification.',
      'Failover transition characteristics (hitless voltage hold-up duration) require lab test verification.'
    ],
    purpose: 'Secondary redundant 12V DC power input providing backup operational power in the event of primary supply failure.',
    technicalExplanation:
      'Connects to a secondary independent 12V DC power brick or DC battery source. ' +
      'In professional broadcast installations, Power 1 and Power 2 are fed from separate AC mains circuits to protect live operations ' +
      'against facility power supply or circuit breaker failures.',
    troubleshooting: [
      'Confirm secondary external DC brick is connected to an independent AC circuit or UPS.',
      'Verify threaded locking ring is engaged.',
      'Observe Power LED 2: LED illuminates when active DC input voltage is present.'
    ],
    relatedComponents: ['pwr-1', 'pwr-led-1', 'pwr-led-2']
  },

  'pwr-led-1': {
    id: 'pwr-led-1',
    name: 'Power 1 Status LED',
    module: 'Power Subsystem',
    category: 'chassis',
    type: 'Optical Health Indicator',
    interface: 'Front-Panel Surface-Mount LED Aperture',
    spec: 'Dual 12V DC Input Status Indicator',
    auditStatus: 'photo-derived',
    verifiedSpecs: [
      'Component of documented dual external 12V DC power architecture.'
    ],
    photoObservations: [
      'Small circular optical indicator located between Power 1 and Power 2 connectors (Photo 1).',
      'Silkscreened numeral "1" positioned directly above the LED aperture (Photo 1).'
    ],
    verificationRequired: [
      'Exact LED color behavior (e.g. Green = OK, Amber = Undervoltage/Fault, Off = No Power) requires manual verification.'
    ],
    purpose: 'Visual front-panel verification that primary 12V DC supply voltage is present and active.',
    technicalExplanation:
      'Provides instantaneous physical confirmation of DC voltage at Input 1, enabling rapid field diagnostics of power connectivity.',
    troubleshooting: [
      'If LED 1 is unlit while Power 1 cable is attached, check AC source and DC output of external power brick.',
      'Verify DC barrel connection is fully inserted.'
    ],
    relatedComponents: ['pwr-1', 'pwr-led-2']
  },

  'pwr-led-2': {
    id: 'pwr-led-2',
    name: 'Power 2 Status LED',
    module: 'Power Subsystem',
    category: 'chassis',
    type: 'Optical Health Indicator',
    interface: 'Front-Panel Surface-Mount LED Aperture',
    spec: 'Dual 12V DC Input Status Indicator',
    auditStatus: 'photo-derived',
    verifiedSpecs: [
      'Component of documented dual external 12V DC power architecture.'
    ],
    photoObservations: [
      'Small circular optical indicator located directly to the right of Power 2 connector (Photo 1).',
      'Silkscreened numeral "2" positioned directly above the LED aperture (Photo 1).'
    ],
    verificationRequired: [
      'Exact multi-color or flashing states require hardware manual verification.'
    ],
    purpose: 'Visual front-panel confirmation that secondary redundant 12V DC power is online.',
    technicalExplanation:
      'Provides instantaneous physical confirmation of redundant DC voltage at Input 2.',
    troubleshooting: [
      'In dual-redundant setups, both LED 1 and LED 2 should be illuminated.',
      'If LED 2 is dark, inspect the secondary DC power supply brick and AC feed.'
    ],
    relatedComponents: ['pwr-2', 'pwr-led-1']
  },

  'ref-in': {
    id: 'ref-in',
    name: 'REF IN (Genlock Reference Input)',
    module: 'Timing Subsystem',
    category: 'chassis',
    type: 'Analog Video Reference Synchronization Port',
    interface: '75Ω Female BNC Bulkhead with Hex Locking Nut',
    spec: 'Genlock Sync Reference Input Port',
    auditStatus: 'photo-derived',
    verifiedSpecs: [
      'Chassis genlock reference interface for SCORPION modular frame timing.'
    ],
    photoObservations: [
      'Full-size 75Ω BNC connector mounted through front fascia with external hexagonal locking nut (Photo 1).',
      'Silkscreened label "REF IN" clearly printed below connector (Photo 1).',
      'Located directly to the right of Power 2 connector on black front chassis panel (Photo 1).'
    ],
    verificationRequired: [
      'Specific supported reference formats (e.g. Bi-level Blackburst NTSC/PAL SMPTE 170M, Tri-level HDTV SMPTE 274M/296M) require datasheet verification.',
      'Internal 75Ω termination status (passive 75Ω termination vs high-impedance loop) requires manual confirmation.'
    ],
    purpose: 'Receives external studio analog genlock reference to synchronize internal frame clocks and video processing.',
    technicalExplanation:
      'Provides genlock synchronization for video processing daughtercards installed in the SCORPION-4 frame. ' +
      'Allows installed modules (such as MIO-BLADE-Z21 and MIO-VB-2-12G) to align video processing clocks with master facility timing.',
    troubleshooting: [
      'Verify clean master sync feed from facility sync pulse generator (SPG).',
      'Ensure BNC cable is true 75Ω broadcast coaxial cable.',
      'Check system timing status in management interface to confirm genlock lock.'
    ],
    relatedComponents: ['blade-plate', 'vb-plate']
  },

  // =============================================================
  // MIO-BLADE-Z21 MICROSERVICE MODULE
  // =============================================================
  'blade-plate': {
    id: 'blade-plate',
    name: 'MIO-BLADE-Z21 Microservice Module',
    module: 'MIO-BLADE-Z21',
    category: 'blade-z21',
    type: 'Microservice Module',
    interface: 'Brushed Aluminum Double-Slot Faceplate with Perforated Thermal Vents',
    spec: 'MIO-BLADE-Z21: Microservice Module',
    auditStatus: 'verified',
    verifiedSpecs: [
      'Module designation: MIO-BLADE-Z21: Microservice module.',
      'Modular form factor: Occupies upper modular bay of SCORPION-4 frame.'
    ],
    photoObservations: [
      'Double-width brushed silver aluminum faceplate labeled "MIO-BLADE-Z21" along top center (Photo 1).',
      'Captive thumbscrews located at far left and far right for slot retention (Photo 1).',
      'Two staggered rows of circular ventilation holes across upper section of faceplate (Photo 1).',
      'Eight observed miniature push-pull coaxial connectors organized into four "SDI OUT" ports (numbered 4, 3, 2, 1) and four "SDI IN" ports (numbered 4, 3, 2, 1) (Photo 1).'
    ],
    verificationRequired: [
      'Exact physical connector standard (e.g. HD-BNC, DIN 1.0/2.3, Micro-BNC) is UNVERIFIED without manufacturer mechanical documentation.',
      'Supported microservice software profiles and licensed app capabilities require datasheet verification.',
      'Internal FPGA model, memory bandwidth, and power consumption profile require official technical manual verification.'
    ],
    purpose: 'Executes virtualized broadcast microservice applications within the SCORPION modular ecosystem.',
    technicalExplanation:
      'The MIO-BLADE-Z21 is an advanced microservice module designed for the SCORPION platform. ' +
      'It provides high-density compute infrastructure for broadcast processing workloads and interfaces with baseband video via its ' +
      'eight front-panel observed miniature SDI connectors (four SDI outputs and four SDI inputs).',
    troubleshooting: [
      'Confirm module captive retention screws are firmly seated to ensure backplane connectivity.',
      'Inspect upper faceplate ventilation holes to ensure airflow is unobstructed.',
      'Verify active microservice application status in management software.'
    ],
    relatedComponents: [
      'blade-sdi-out-4', 'blade-sdi-out-3', 'blade-sdi-out-2', 'blade-sdi-out-1',
      'blade-sdi-in-4', 'blade-sdi-in-3', 'blade-sdi-in-2', 'blade-sdi-in-1',
      'blade-thumbscrew-left', 'blade-thumbscrew-right'
    ]
  },

  'blade-sdi-out-4': {
    id: 'blade-sdi-out-4',
    name: 'MIO-BLADE SDI OUT 4 (Observed Connector)',
    module: 'MIO-BLADE-Z21',
    category: 'blade-z21',
    type: 'Observed SDI Video Output Connector',
    interface: 'Observed Miniature Coaxial RF Receptacle (Gold Finish)',
    spec: 'Observed SDI Output Connector (Connector Standard Unverified)',
    auditStatus: 'photo-derived',
    verifiedSpecs: [
      'Physical output port on documented MIO-BLADE-Z21 microservice module.'
    ],
    photoObservations: [
      'Miniature push-pull coaxial connector with gold finish (Photo 1).',
      'Grouped under "SDI OUT" silkscreen header, labeled with numeral "4" (leftmost output port).'
    ],
    verificationRequired: [
      'Exact physical connector standard (e.g. HD-BNC vs DIN 1.0/2.3 vs Micro-BNC) is UNVERIFIED without manufacturer documentation.',
      'Supported SMPTE SDI data rates (e.g. 12G/6G/3G/HD/SD-SDI) require module datasheet verification.',
      'Cable reach distance and return loss parameters require laboratory verification.'
    ],
    purpose: 'Outputs processed baseband SDI digital video from the microservice module.',
    technicalExplanation:
      'One of four observed miniature SDI output connectors on the MIO-BLADE-Z21, enabling baseband digital video delivery to facility destinations.',
    troubleshooting: [
      'Verify correct miniature coaxial patch cable with secure push-pull engagement.',
      'Check signal routing and format configuration in management interface.'
    ],
    relatedComponents: ['blade-sdi-out-3', 'blade-sdi-out-2', 'blade-sdi-out-1', 'blade-plate']
  },

  'blade-sdi-out-3': {
    id: 'blade-sdi-out-3',
    name: 'MIO-BLADE SDI OUT 3 (Observed Connector)',
    module: 'MIO-BLADE-Z21',
    category: 'blade-z21',
    type: 'Observed SDI Video Output Connector',
    interface: 'Observed Miniature Coaxial RF Receptacle (Gold Finish)',
    spec: 'Observed SDI Output Connector (Connector Standard Unverified)',
    auditStatus: 'photo-derived',
    verifiedSpecs: [
      'Physical output port on documented MIO-BLADE-Z21 microservice module.'
    ],
    photoObservations: [
      'Miniature push-pull coaxial connector with gold finish (Photo 1).',
      'Grouped under "SDI OUT" silkscreen header, labeled with numeral "3".'
    ],
    verificationRequired: [
      'Exact physical connector standard (e.g. HD-BNC vs DIN 1.0/2.3 vs Micro-BNC) is UNVERIFIED without manufacturer documentation.',
      'Supported SMPTE SDI data rates require module datasheet verification.'
    ],
    purpose: 'Baseband SDI digital video output channel 3.',
    technicalExplanation:
      'Provides independent SDI video output from the MIO-BLADE-Z21 processing pipeline.',
    troubleshooting: [
      'Check patch cable integrity and verify downstream receiver signal lock.'
    ],
    relatedComponents: ['blade-sdi-out-4', 'blade-sdi-out-2', 'blade-sdi-out-1', 'blade-plate']
  },

  'blade-sdi-out-2': {
    id: 'blade-sdi-out-2',
    name: 'MIO-BLADE SDI OUT 2 (Observed Connector)',
    module: 'MIO-BLADE-Z21',
    category: 'blade-z21',
    type: 'Observed SDI Video Output Connector',
    interface: 'Observed Miniature Coaxial RF Receptacle (Gold Finish)',
    spec: 'Observed SDI Output Connector (Connector Standard Unverified)',
    auditStatus: 'photo-derived',
    verifiedSpecs: [
      'Physical output port on documented MIO-BLADE-Z21 microservice module.'
    ],
    photoObservations: [
      'Miniature push-pull coaxial connector with gold finish (Photo 1).',
      'Grouped under "SDI OUT" silkscreen header, labeled with numeral "2".'
    ],
    verificationRequired: [
      'Exact physical connector standard (e.g. HD-BNC vs DIN 1.0/2.3 vs Micro-BNC) is UNVERIFIED without manufacturer documentation.',
      'Supported SMPTE SDI data rates require module datasheet verification.'
    ],
    purpose: 'Baseband SDI digital video output channel 2.',
    technicalExplanation:
      'Provides independent SDI video output from the MIO-BLADE-Z21 processing pipeline.',
    troubleshooting: [
      'Inspect connector for debris or damage; ensure positive connector latching.'
    ],
    relatedComponents: ['blade-sdi-out-4', 'blade-sdi-out-3', 'blade-sdi-out-1', 'blade-plate']
  },

  'blade-sdi-out-1': {
    id: 'blade-sdi-out-1',
    name: 'MIO-BLADE SDI OUT 1 (Observed Connector)',
    module: 'MIO-BLADE-Z21',
    category: 'blade-z21',
    type: 'Observed SDI Video Output Connector',
    interface: 'Observed Miniature Coaxial RF Receptacle (Gold Finish)',
    spec: 'Observed SDI Output Connector (Connector Standard Unverified)',
    auditStatus: 'photo-derived',
    verifiedSpecs: [
      'Physical output port on documented MIO-BLADE-Z21 microservice module.'
    ],
    photoObservations: [
      'Miniature push-pull coaxial connector with gold finish (Photo 1).',
      'Grouped under "SDI OUT" silkscreen header, labeled with numeral "1" (rightmost output port).'
    ],
    verificationRequired: [
      'Exact physical connector standard (e.g. HD-BNC vs DIN 1.0/2.3 vs Micro-BNC) is UNVERIFIED without manufacturer documentation.',
      'Supported SMPTE SDI data rates require module datasheet verification.'
    ],
    purpose: 'Baseband SDI digital video output channel 1.',
    technicalExplanation:
      'Primary SDI output port on the MIO-BLADE-Z21 microservice module.',
    troubleshooting: [
      'Verify video stream routing in system configuration software.'
    ],
    relatedComponents: ['blade-sdi-out-4', 'blade-sdi-out-3', 'blade-sdi-out-2', 'blade-plate']
  },

  'blade-sdi-in-4': {
    id: 'blade-sdi-in-4',
    name: 'MIO-BLADE SDI IN 4 (Observed Connector)',
    module: 'MIO-BLADE-Z21',
    category: 'blade-z21',
    type: 'Observed SDI Video Input Connector',
    interface: 'Observed Miniature Coaxial RF Receptacle (Gold Finish)',
    spec: 'Observed SDI Input Connector (Connector Standard Unverified)',
    auditStatus: 'photo-derived',
    verifiedSpecs: [
      'Physical input port on documented MIO-BLADE-Z21 microservice module.'
    ],
    photoObservations: [
      'Miniature push-pull coaxial connector with gold finish (Photo 1).',
      'Grouped under "SDI IN" silkscreen header, labeled with numeral "4" (leftmost input port).'
    ],
    verificationRequired: [
      'Exact physical connector standard (e.g. HD-BNC vs DIN 1.0/2.3 vs Micro-BNC) is UNVERIFIED without manufacturer documentation.',
      'Supported input standards and automatic format detection ranges require datasheet verification.'
    ],
    purpose: 'Baseband SDI digital video input channel 4 for video ingest or processing.',
    technicalExplanation:
      'Receives external baseband SDI video into the MIO-BLADE-Z21 microservice processing architecture.',
    troubleshooting: [
      'Verify valid upstream video signal and inspect cable termination.'
    ],
    relatedComponents: ['blade-sdi-in-3', 'blade-sdi-in-2', 'blade-sdi-in-1', 'blade-plate']
  },

  'blade-sdi-in-3': {
    id: 'blade-sdi-in-3',
    name: 'MIO-BLADE SDI IN 3 (Observed Connector)',
    module: 'MIO-BLADE-Z21',
    category: 'blade-z21',
    type: 'Observed SDI Video Input Connector',
    interface: 'Observed Miniature Coaxial RF Receptacle (Gold Finish)',
    spec: 'Observed SDI Input Connector (Connector Standard Unverified)',
    auditStatus: 'photo-derived',
    verifiedSpecs: [
      'Physical input port on documented MIO-BLADE-Z21 microservice module.'
    ],
    photoObservations: [
      'Miniature push-pull coaxial connector with gold finish (Photo 1).',
      'Grouped under "SDI IN" silkscreen header, labeled with numeral "3".'
    ],
    verificationRequired: [
      'Exact physical connector standard is UNVERIFIED without manufacturer documentation.',
      'Supported input standards require datasheet verification.'
    ],
    purpose: 'Baseband SDI digital video input channel 3.',
    technicalExplanation:
      'Receives external baseband SDI video into the MIO-BLADE-Z21 processing architecture.',
    troubleshooting: [
      'Check input carrier lock indicator in software.'
    ],
    relatedComponents: ['blade-sdi-in-4', 'blade-sdi-in-2', 'blade-sdi-in-1', 'blade-plate']
  },

  'blade-sdi-in-2': {
    id: 'blade-sdi-in-2',
    name: 'MIO-BLADE SDI IN 2 (Observed Connector)',
    module: 'MIO-BLADE-Z21',
    category: 'blade-z21',
    type: 'Observed SDI Video Input Connector',
    interface: 'Observed Miniature Coaxial RF Receptacle (Gold Finish)',
    spec: 'Observed SDI Input Connector (Connector Standard Unverified)',
    auditStatus: 'photo-derived',
    verifiedSpecs: [
      'Physical input port on documented MIO-BLADE-Z21 microservice module.'
    ],
    photoObservations: [
      'Miniature push-pull coaxial connector with gold finish (Photo 1).',
      'Grouped under "SDI IN" silkscreen header, labeled with numeral "2".'
    ],
    verificationRequired: [
      'Exact physical connector standard is UNVERIFIED without manufacturer documentation.',
      'Supported input standards require datasheet verification.'
    ],
    purpose: 'Baseband SDI digital video input channel 2.',
    technicalExplanation:
      'Receives external baseband SDI video into the MIO-BLADE-Z21 processing architecture.',
    troubleshooting: [
      'Verify source signal carrier presence.'
    ],
    relatedComponents: ['blade-sdi-in-4', 'blade-sdi-in-3', 'blade-sdi-in-1', 'blade-plate']
  },

  'blade-sdi-in-1': {
    id: 'blade-sdi-in-1',
    name: 'MIO-BLADE SDI IN 1 (Observed Connector)',
    module: 'MIO-BLADE-Z21',
    category: 'blade-z21',
    type: 'Observed SDI Video Input Connector',
    interface: 'Observed Miniature Coaxial RF Receptacle (Gold Finish)',
    spec: 'Observed SDI Input Connector (Connector Standard Unverified)',
    auditStatus: 'photo-derived',
    verifiedSpecs: [
      'Physical input port on documented MIO-BLADE-Z21 microservice module.'
    ],
    photoObservations: [
      'Miniature push-pull coaxial connector with gold finish (Photo 1).',
      'Grouped under "SDI IN" silkscreen header, labeled with numeral "1" (rightmost input port).'
    ],
    verificationRequired: [
      'Exact physical connector standard is UNVERIFIED without manufacturer documentation.',
      'Supported input standards require datasheet verification.'
    ],
    purpose: 'Baseband SDI digital video input channel 1.',
    technicalExplanation:
      'Primary baseband SDI ingest port on the MIO-BLADE-Z21 microservice module.',
    troubleshooting: [
      'Confirm signal lock and format detection in management dashboard.'
    ],
    relatedComponents: ['blade-sdi-in-4', 'blade-sdi-in-3', 'blade-sdi-in-2', 'blade-plate']
  },

  'blade-thumbscrew-left': {
    id: 'blade-thumbscrew-left',
    name: 'MIO-BLADE Retention Fastener (Left)',
    module: 'MIO-BLADE-Z21',
    category: 'blade-z21',
    type: 'Mechanical Fastener',
    interface: 'Knurled Stainless Steel Captive Thumbscrew',
    spec: 'Captive Module Retention Screw',
    auditStatus: 'photo-derived',
    verifiedSpecs: [
      'Mechanical retention hardware for SCORPION modular slot.'
    ],
    photoObservations: [
      'Knurled cylindrical thumbscrew with slotted drive head on left side of MIO-BLADE faceplate (Photo 1).'
    ],
    verificationRequired: [
      'Thread pitch (M2.5 vs M3) and torque specification require engineering drawing verification.'
    ],
    purpose: 'Secures the left side of the MIO-BLADE-Z21 module firmly into the chassis modular bay.',
    technicalExplanation:
      'Maintains mechanical retention and chassis ground bonding between the module sub-chassis and main frame.',
    troubleshooting: [
      'Ensure screw is finger-tightened; do not over-torque with power tools.'
    ],
    relatedComponents: ['blade-thumbscrew-right', 'blade-plate']
  },

  'blade-thumbscrew-right': {
    id: 'blade-thumbscrew-right',
    name: 'MIO-BLADE Retention Fastener (Right)',
    module: 'MIO-BLADE-Z21',
    category: 'blade-z21',
    type: 'Mechanical Fastener',
    interface: 'Knurled Stainless Steel Captive Thumbscrew',
    spec: 'Captive Module Retention Screw',
    auditStatus: 'photo-derived',
    verifiedSpecs: [
      'Mechanical retention hardware for SCORPION modular slot.'
    ],
    photoObservations: [
      'Knurled cylindrical thumbscrew with slotted drive head on right side of MIO-BLADE faceplate (Photo 1).'
    ],
    verificationRequired: [
      'Thread pitch and torque specification require mechanical drawing verification.'
    ],
    purpose: 'Secures the right side of the MIO-BLADE-Z21 module into the chassis bay.',
    technicalExplanation:
      'Provides mechanical retention and completes module chassis ground bonding.',
    troubleshooting: [
      'Confirm screw threads smoothly into chassis standoff.'
    ],
    relatedComponents: ['blade-thumbscrew-left', 'blade-plate']
  },

  // =============================================================
  // MIO-VB-2-12G VIDEO ACCESS MODULE
  // =============================================================
  'vb-plate': {
    id: 'vb-plate',
    name: 'MIO-VB-2-12G Video Access Module',
    module: 'MIO-VB-2-12G',
    category: 'vb-12g',
    type: 'Video Access Module',
    interface: 'Brushed Aluminum Single-Slot Faceplate',
    spec: 'MIO-VB-2-12G: 12G/6G/3G/HD/SD/ASI video access module',
    auditStatus: 'verified',
    verifiedSpecs: [
      'Module designation: MIO-VB-2-12G: 12G/6G/3G/HD/SD/ASI video access module.',
      'Modular form factor: Single SCORPION mini-module slot.'
    ],
    photoObservations: [
      'Brushed silver aluminum faceplate located in lower-left modular bay (Photo 1).',
      'Silkscreened label "MIO-VB-2-12G" at bottom left of faceplate (Photo 1).',
      'Two full-size 75Ω BNC connectors labeled "A" and "B" positioned side-by-side (Photo 1).',
      'Mounting screws securing faceplate to chassis frame (Photo 1).'
    ],
    verificationRequired: [
      'Internal processing capabilities (e.g. re-clocking, format conversion) require datasheet verification.',
      'Return loss specifications at 12 GHz carrier frequencies require lab verification.'
    ],
    purpose: 'Provides physical video access supporting 12G, 6G, 3G, HD, SD-SDI, and DVB-ASI signals.',
    technicalExplanation:
      'The MIO-VB-2-12G is a documented video access module providing two high-bandwidth 75Ω BNC coaxial ports ' +
      'for baseband video transmission across 12G/6G/3G/HD/SD-SDI and DVB-ASI formats.',
    troubleshooting: [
      'Confirm module retention screws are seated to maintain chassis ground bonding.',
      'Verify port status and configured video format in management software.'
    ],
    relatedComponents: ['vb-bnc-a', 'vb-bnc-b']
  },

  'vb-bnc-a': {
    id: 'vb-bnc-a',
    name: 'MIO-VB-2-12G Port A (12G/6G/3G/HD/SD/ASI)',
    module: 'MIO-VB-2-12G',
    category: 'vb-12g',
    type: 'Video Access Port',
    interface: '75Ω Full-Size BNC Female with Gold Center Pin',
    spec: '12G/6G/3G/HD/SD/ASI Video Access Port A',
    auditStatus: 'verified',
    verifiedSpecs: [
      'Port on documented MIO-VB-2-12G: 12G/6G/3G/HD/SD/ASI video access module.'
    ],
    photoObservations: [
      'Standard full-size 75Ω BNC connector with dual bayonet locking lugs (Photo 1).',
      'Silkscreened label "A" located directly below the connector on the silver faceplate (Photo 1).'
    ],
    verificationRequired: [
      'Port directionality (configurable input vs output or fixed transceiver direction) requires datasheet verification.',
      'Automatic cable equalizer maximum length specifications require lab verification.'
    ],
    purpose: 'Video access port A for transmitting or receiving broadcast video up to 12G-SDI / ASI.',
    technicalExplanation:
      'Connects baseband video feeds (from 12G-SDI 4K UHD down to legacy SD-SDI and DVB-ASI) into the SCORPION ecosystem.',
    troubleshooting: [
      'Verify BNC bayonet lock is rotated clockwise to full mechanical detent.',
      'Ensure high-quality 12G-rated coaxial cable is used for UHD signals.'
    ],
    relatedComponents: ['vb-bnc-b', 'vb-plate']
  },

  'vb-bnc-b': {
    id: 'vb-bnc-b',
    name: 'MIO-VB-2-12G Port B (12G/6G/3G/HD/SD/ASI)',
    module: 'MIO-VB-2-12G',
    category: 'vb-12g',
    type: 'Video Access Port',
    interface: '75Ω Full-Size BNC Female with Gold Center Pin',
    spec: '12G/6G/3G/HD/SD/ASI Video Access Port B',
    auditStatus: 'verified',
    verifiedSpecs: [
      'Port on documented MIO-VB-2-12G: 12G/6G/3G/HD/SD/ASI video access module.'
    ],
    photoObservations: [
      'Standard full-size 75Ω BNC connector with dual bayonet locking lugs (Photo 1).',
      'Silkscreened label "B" located directly below the connector on the silver faceplate (Photo 1).'
    ],
    verificationRequired: [
      'Port directionality and supported re-clocker modes require datasheet verification.'
    ],
    purpose: 'Video access port B for transmitting or receiving broadcast video up to 12G-SDI / ASI.',
    technicalExplanation:
      'Independent video access port B operating alongside Port A on the MIO-VB-2-12G module.',
    troubleshooting: [
      'Check cable integrity and confirm signal lock on downstream receiver.'
    ],
    relatedComponents: ['vb-bnc-a', 'vb-plate']
  },

  // =============================================================
  // MIO-GE-RJ45-IP GIGABIT ETHERNET MODULE
  // =============================================================
  'ge-plate': {
    id: 'ge-plate',
    name: 'MIO-GE-RJ45-IP Ethernet Access Module',
    module: 'MIO-GE-RJ45-IP',
    category: 'ge-ip',
    type: 'Ethernet Access Module with Onboard Processing',
    interface: 'Brushed Aluminum Single-Slot Faceplate',
    spec: 'MIO-GE-RJ45-IP: 1GbE Ethernet access module with onboard processing',
    auditStatus: 'verified',
    verifiedSpecs: [
      'Module designation: MIO-GE-RJ45-IP: 1GbE Ethernet access module with onboard processing.',
      'Modular form factor: Single SCORPION mini-module slot.'
    ],
    photoObservations: [
      'Brushed silver aluminum faceplate located in lower-right modular bay (Photo 1).',
      'Silkscreened label "MIO-GE-RJ45-IP" at top right of faceplate (Photo 1).',
      'Shielded RJ45 connector positioned at bottom (Photo 1).',
      'Two circular optical LED apertures labeled "ACT" and "LINK" positioned above the RJ45 jack (Photo 1).'
    ],
    verificationRequired: [
      'Exact onboard processing features (e.g. VLAN tag manipulation, encapsulation protocols) require datasheet verification.',
      'Internal buffer sizes and maximum forwarding rate require technical manual verification.'
    ],
    purpose: 'Integrates local Gigabit Ethernet traffic with onboard processing into the SCORPION network fabric.',
    technicalExplanation:
      'The MIO-GE-RJ45-IP provides a 1GbE copper interface with onboard packet processing, enabling data network transport ' +
      'and control integration across the SCORPION frame.',
    troubleshooting: [
      'Verify module retention screws are secured.',
      'Observe ACT and LINK status LEDs to diagnose physical and network layer health.'
    ],
    relatedComponents: ['ge-rj45', 'ge-act-led', 'ge-link-led']
  },

  'ge-rj45': {
    id: 'ge-rj45',
    name: 'MIO-GE-RJ45-IP 1GbE Ethernet Port',
    module: 'MIO-GE-RJ45-IP',
    category: 'ge-ip',
    type: 'Gigabit Ethernet Network Interface',
    interface: 'Shielded 8P8C (RJ45) Modular Receptacle with Internal Magnetics',
    spec: '1GbE Ethernet Access Interface (MIO-GE-RJ45-IP)',
    auditStatus: 'verified',
    verifiedSpecs: [
      'Port on documented MIO-GE-RJ45-IP: 1GbE Ethernet access module with onboard processing.'
    ],
    photoObservations: [
      'Shielded 8P8C (RJ45) modular jack with external metallic grounding tabs and black plastic core (Photo 1).',
      'Mounted at the bottom of the MIO-GE-RJ45-IP faceplate.'
    ],
    verificationRequired: [
      'Auto-negotiation fallback speeds (100Base-TX, 10Base-T) require datasheet confirmation.',
      'Support for jumbo frames / MTU limits requires technical specification verification.'
    ],
    purpose: 'Physical 1GbE Ethernet connection for IP control, data transport, or media streaming.',
    technicalExplanation:
      'Provides standard copper Ethernet connectivity to external IP devices, managed by the onboard processing engine of the MIO-GE module.',
    troubleshooting: [
      'Confirm standard Cat5e or Cat6 twisted-pair cabling is properly connected.',
      'Verify link status LED indicates active carrier.'
    ],
    relatedComponents: ['ge-act-led', 'ge-link-led', 'ge-plate']
  },

  'ge-act-led': {
    id: 'ge-act-led',
    name: 'MIO-GE ACT (Activity) LED',
    module: 'MIO-GE-RJ45-IP',
    category: 'ge-ip',
    type: 'Traffic Activity Indicator',
    interface: 'Surface-Mount Optical LED Aperture',
    spec: 'Ethernet Packet Activity Indicator',
    auditStatus: 'photo-derived',
    verifiedSpecs: [
      'Indicator on documented MIO-GE-RJ45-IP module.'
    ],
    photoObservations: [
      'Circular LED light pipe positioned above left side of RJ45 connector (Photo 1).',
      'Silkscreened label "ACT" printed directly above the aperture (Photo 1).'
    ],
    verificationRequired: [
      'Flash rate cadence and operational color require manual verification.'
    ],
    purpose: 'Visual indicator of Ethernet packet transmission or reception on the 1GbE port.',
    technicalExplanation:
      'Flashes to provide immediate visual confirmation that Ethernet frames are actively traversing the physical interface.',
    troubleshooting: [
      'If LINK is illuminated but ACT never flashes during traffic, verify network subnet configuration and firewall rules.'
    ],
    relatedComponents: ['ge-link-led', 'ge-rj45']
  },

  'ge-link-led': {
    id: 'ge-link-led',
    name: 'MIO-GE LINK Status LED',
    module: 'MIO-GE-RJ45-IP',
    category: 'ge-ip',
    type: 'Carrier Link Indicator',
    interface: 'Surface-Mount Optical LED Aperture',
    spec: 'Physical Ethernet Carrier Indicator',
    auditStatus: 'photo-derived',
    verifiedSpecs: [
      'Indicator on documented MIO-GE-RJ45-IP module.'
    ],
    photoObservations: [
      'Circular LED light pipe positioned above right side of RJ45 connector (Photo 1).',
      'Silkscreened label "LINK" printed directly above the aperture (Photo 1).'
    ],
    verificationRequired: [
      'LED color indications for speed (e.g. 1000 Mbps vs 100 Mbps) require datasheet verification.'
    ],
    purpose: 'Visual indication of physical layer Ethernet carrier connection.',
    technicalExplanation:
      'Confirms established physical link with the remote Ethernet switch or endpoint device.',
    troubleshooting: [
      'If LINK LED is off, check cable connection and verify remote switch port is administratively enabled.'
    ],
    relatedComponents: ['ge-act-led', 'ge-rj45']
  },

  // =============================================================
  // REAR TRUNK & REAR INTERFACES (PHYSICAL ARRANGEMENT UNVERIFIED)
  // =============================================================
  'net-port-1': {
    id: 'net-port-1',
    name: 'SFP Trunk Bay 1 (Unverified Rear Placement)',
    module: 'Trunk Subsystem',
    category: 'rear-trunk',
    type: 'High-Speed SFP Trunk Interface',
    interface: 'Pluggable SFP Cage (Position Unverified)',
    spec: 'Dual 10GbE / 25GbE Trunk Connectivity (Documented SCORPION-4 Spec)',
    auditStatus: 'requires-verification',
    verifiedSpecs: [
      'Documented specification: 4 SFP ports capacity on SCORPION-4 chassis.',
      'Documented specification: Dual 10GbE / 25GbE trunk connectivity.'
    ],
    photoObservations: [], // Supplied reference photos are two front views and one side view; no rear photograph available.
    verificationRequired: [
      'UNVERIFIED: Exact physical position, cage arrangement, and port labeling on the rear chassis are not supported by the supplied documentation or photographs.',
      'Exact supported transceiver MSA types (10GBASE-SR/LR, 25GBASE-SR/LR, copper DAC) require datasheet verification.',
      'Hitless protection switching protocols (e.g. SMPTE ST 2022-7) require firmware and module verification.'
    ],
    purpose: 'Aggregated high-capacity 10GbE/25GbE network trunk carrying multiplexed media streams.',
    technicalExplanation:
      'Provides high-bandwidth trunk connectivity for transport of multiplexed video, audio, and IP packet flows ' +
      'across campus or WAN networks using 10GbE or 25GbE transceivers. Physical rear placement is unverified.',
    troubleshooting: [
      'Verify transceiver compatibility and ensure module is fully latched into SFP cage.',
      'Check port link status in software management dashboard.'
    ],
    relatedComponents: ['net-port-2', 'net-sfp-3', 'net-sfp-4']
  },

  'net-port-2': {
    id: 'net-port-2',
    name: 'SFP Trunk Bay 2 (Unverified Rear Placement)',
    module: 'Trunk Subsystem',
    category: 'rear-trunk',
    type: 'High-Speed SFP Trunk Interface',
    interface: 'Pluggable SFP Cage (Position Unverified)',
    spec: 'Dual 10GbE / 25GbE Trunk Connectivity (Documented SCORPION-4 Spec)',
    auditStatus: 'requires-verification',
    verifiedSpecs: [
      'Documented specification: 4 SFP ports capacity on SCORPION-4 chassis.',
      'Documented specification: Dual 10GbE / 25GbE trunk connectivity.'
    ],
    photoObservations: [],
    verificationRequired: [
      'UNVERIFIED: Exact physical position, cage arrangement, and port labeling on the rear chassis are not confirmed by available reference photos.',
      'Supported transceiver modules and trunk bonding/aggregation modes require datasheet verification.'
    ],
    purpose: 'Secondary 10GbE/25GbE network trunk interface.',
    technicalExplanation:
      'Provides high-bandwidth trunk connectivity for media transport or redundant network paths. Physical rear placement is unverified.',
    troubleshooting: [
      'Verify SFP module seating and inspect link status in management dashboard.'
    ],
    relatedComponents: ['net-port-1', 'net-sfp-3', 'net-sfp-4']
  },

  'net-sfp-3': {
    id: 'net-sfp-3',
    name: 'SFP Port 3 (Unverified Rear Placement)',
    module: 'Trunk Subsystem',
    category: 'rear-trunk',
    type: 'Pluggable SFP Transceiver Cage',
    interface: 'Pluggable SFP Cage (Position Unverified)',
    spec: '4 SFP Ports Capacity (Documented SCORPION-4 Spec)',
    auditStatus: 'requires-verification',
    verifiedSpecs: [
      'Part of documented 4 SFP ports capacity on SCORPION-4 chassis.'
    ],
    photoObservations: [],
    verificationRequired: [
      'UNVERIFIED: Exact physical position, orientation, and port numbering on the rear chassis are not confirmed by available reference photos.',
      'Supported optical transceiver wavelengths (e.g. 1310nm, 850nm, CWDM/DWDM) require module specification verification.'
    ],
    purpose: 'Hot-pluggable optical transceiver interface for fiber optic network transport.',
    technicalExplanation:
      'Accommodates pluggable optical SFP modules for long-distance optical media transport. Physical rear placement is unverified.',
    troubleshooting: [
      'Clean fiber optical ferrule before mating with transceiver.',
      'Verify optical RX power levels with optical meter to avoid receiver saturation.'
    ],
    relatedComponents: ['net-sfp-4', 'net-port-1', 'net-port-2']
  },

  'net-sfp-4': {
    id: 'net-sfp-4',
    name: 'SFP Port 4 (Unverified Rear Placement)',
    module: 'Trunk Subsystem',
    category: 'rear-trunk',
    type: 'Pluggable SFP Transceiver Cage',
    interface: 'Pluggable SFP Cage (Position Unverified)',
    spec: '4 SFP Ports Capacity (Documented SCORPION-4 Spec)',
    auditStatus: 'requires-verification',
    verifiedSpecs: [
      'Part of documented 4 SFP ports capacity on SCORPION-4 chassis.'
    ],
    photoObservations: [],
    verificationRequired: [
      'UNVERIFIED: Exact physical position, orientation, and port numbering on the rear chassis are not confirmed by available reference photos.',
      'Supported optical transceiver types and protocols require datasheet verification.'
    ],
    purpose: 'Fourth pluggable SFP transceiver interface on chassis.',
    technicalExplanation:
      'Completes the four-bay SFP transceiver capacity of the SCORPION-4 chassis. Physical rear placement is unverified.',
    troubleshooting: [
      'Inspect transceiver latch engagement.'
    ],
    relatedComponents: ['net-sfp-3', 'net-port-1', 'net-port-2']
  },

  'mgmt-com': {
    id: 'mgmt-com',
    name: 'Micro-USB COM Port (Unverified Hardware)',
    module: 'Management Subsystem',
    category: 'rear-trunk',
    type: 'Serial CLI Console Interface (Unverified)',
    interface: 'Micro-USB Receptacle (Unverified Hardware)',
    spec: 'Unverified Hardware Connector (Requires Official Rear Documentation)',
    auditStatus: 'requires-verification',
    verifiedSpecs: [], // Unverified in documented spec
    photoObservations: [], // Supplied photos are two front views and one side view; no rear photo
    verificationRequired: [
      'UNVERIFIED: The presence, connector type (micro-USB), location, internal UART controller, and serial baud rate on the rear panel are not documented in supplied specifications or reference images.',
      'Requires official Evertz rear mechanical drawing and product manual confirmation.'
    ],
    purpose: 'Unverified hardware connector; presence and specifications require official verification.',
    technicalExplanation:
      'This connector represents an unverified serial console interface. Neither the official product specification nor the available reference photographs (two front views and one side view) verify rear console hardware.',
    troubleshooting: [
      'Verify official Evertz SCORPION-4 hardware installation manual before attempting physical serial console connection.'
    ],
    relatedComponents: ['mgmt-eth']
  },

  'mgmt-eth': {
    id: 'mgmt-eth',
    name: 'Management RJ45 Port (Unverified Hardware)',
    module: 'Management Subsystem',
    category: 'rear-trunk',
    type: 'Dedicated Out-of-Band Control Interface (Unverified)',
    interface: 'Shielded RJ45 Jack (Unverified Hardware)',
    spec: 'Unverified Hardware Connector (Requires Official Rear Documentation)',
    auditStatus: 'requires-verification',
    verifiedSpecs: [], // Unverified in documented spec
    photoObservations: [], // Supplied photos are two front views and one side view; no rear photo
    verificationRequired: [
      'UNVERIFIED: Dedicated rear out-of-band management RJ45 connector presence, physical position, and pinout are not confirmed in supplied documentation or reference images.',
      'Default factory management IP address, subnet, and DHCP configuration require manual verification.'
    ],
    purpose: 'Unverified hardware connector; presence and specifications require official verification.',
    technicalExplanation:
      'This connector represents an unverified out-of-band management interface. Neither the official product specification nor the available reference photographs (two front views and one side view) verify rear management hardware.',
    troubleshooting: [
      'Consult official Evertz SCORPION-4 hardware documentation to determine standard out-of-band network connectivity.'
    ],
    relatedComponents: ['mgmt-com']
  }
};
