export enum CAN_ID {
  Broadcast = 0x7df,
  Engine = 0x7e8,
  Transmission = 0x7e9,
  ABS = 0x7ea,
}

export enum FORD_ID {
  RPM = 0x200,
}

// Map OBD2 can message identifier to human readable name
export const mapIdentifierToName = (identifier: number) => {
  switch (identifier) {
    case CAN_ID.Engine:
      return "Engine ECU";
    case CAN_ID.Transmission:
      return "Transmission ECU";
    case CAN_ID.ABS:
      return "ABS ECU";
    default:
      return "unknown";
  }
};

/**
 * A OBD WebSocket message should be:
 * 2 byte ID
 * 1 byte data size
 * 8 byte data
 *
 * Different types of WebSocket messaegs can get a range of ids or a message type id
 */
export const WS_MESSAGE = {
  CLEAR_DTC: [0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00], // Code 1, no data
  REQUEST_RPM: [
    0x00,
    0x02,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00, // Code 2, no data
  ],
};

/**
 * Standard Services
 */
export enum SID {
  SHOW_DATA = 0x01, // Show current data
  SHOW_FREEZE_FRAME = 0x02, // Show freeze frame data
  SHOW_STORED_DTC = 0x03, // Show stored DTCs
  CLEAR_DTC = 0x04, // Clear DTCs and stored values
  TEST_RESULTS_O2_SENSORS = 0x05, // Test results, O2 sensor monitoring
  TEST_RESULTS_OTHER = 0x06, // Test results, other component/system monitoring
  SHOW_PENDING_DTC = 0x07, // Show pending DTCs
  CONTROL_OPERATION = 0x08, // Control operation of on-board component/system
  VEHICLE_INFO = 0x09, // Request vehicle information
  PERMANENT_DTC = 0x0a, // Permanent DTCs
  // Higher services (less commonly used)
  UDS_SESSION_CONTROL = 0x10, // Diagnostic Session Control (UDS)
  UDS_ECU_RESET = 0x11, // ECU Reset (UDS)
  UDS_READ_DATA = 0x22, // Read Data By Identifier (UDS)
  UDS_READ_MEMORY = 0x23, // Read Memory By Address (UDS)
  UDS_WRITE_DATA = 0x2e, // Write Data By Identifier (UDS)
  UDS_ROUTINE_CONTROL = 0x31, // Routine Control (UDS)
  // ... many more UDS services up to 0x3E, 0x80+ for manufacturer specific
}

/**
 * OBD2 Parameter ID, 2nd byte
 */
export enum PID {
  // Engine Parameters
  ENGINE_LOAD = 0x04, // Calculated engine load (%)
  COOLANT_TEMP = 0x05, // Engine coolant temperature (°C)
  SHORT_TERM_FUEL_TRIM_B1 = 0x06, // Short term fuel trim—Bank 1 (%)
  LONG_TERM_FUEL_TRIM_B1 = 0x07, // Long term fuel trim—Bank 1 (%)
  FUEL_PRESSURE = 0x0a, // Fuel pressure (kPa)
  INTAKE_MAP = 0x0b, // Intake manifold absolute pressure (kPa)
  ENGINE_RPM = 0x0c, // Engine RPM
  VEHICLE_SPEED = 0x0d, // Vehicle speed (km/h)
  TIMING_ADVANCE = 0x0e, // Timing advance (° before TDC)
  INTAKE_TEMP = 0x0f, // Intake air temperature (°C)
  MAF_RATE = 0x10, // Mass airflow sensor air flow rate (g/s)
  THROTTLE_POSITION = 0x11, // Throttle position (%)

  // OBD Standards & Status
  PIDS_SUPPORTED_01_20 = 0x00, // PIDs supported [01-20]
  MONITOR_STATUS = 0x01, // Monitor status since DTCs cleared
  FREEZE_DTC = 0x02, // Freeze DTC
  FUEL_SYSTEM_STATUS = 0x03, // Fuel system status

  // O2 Sensors
  O2_SENSOR_1_VOLTAGE = 0x14, // Oxygen sensor 1 voltage
  O2_SENSOR_2_VOLTAGE = 0x15, // Oxygen sensor 2 voltage
  // ... O2 sensors continue through 0x1B

  // More Advanced Parameters
  FUEL_RAIL_PRESSURE = 0x22, // Fuel Rail Pressure (kPa)
  FUEL_RAIL_GAUGE_PRESSURE = 0x23, // Fuel Rail Gauge Pressure (kPa)
  COMMANDED_EGR = 0x2c, // Commanded EGR (%)
  EGR_ERROR = 0x2d, // EGR Error (%)
  FUEL_TANK_LEVEL = 0x2f, // Fuel Tank Level Input (%)
  WARM_UPS_SINCE_CODES_CLEARED = 0x30, // Warm-ups since codes cleared
  DISTANCE_SINCE_CODES_CLEARED = 0x31, // Distance traveled since codes cleared (km)

  // Runtime & Distance
  ENGINE_RUNTIME = 0x1f, // Runtime since engine start (seconds)
  DISTANCE_WITH_MIL = 0x21, // Distance traveled with MIL on (km)

  // Support Detection
  PIDS_SUPPORTED_21_40 = 0x20, // PIDs supported [21-40]
  PIDS_SUPPORTED_41_60 = 0x40, // PIDs supported [41-60]
  PIDS_SUPPORTED_61_80 = 0x60, // PIDs supported [61-80]
  PIDS_SUPPORTED_81_A0 = 0x80, // PIDs supported [81-A0]
  PIDS_SUPPORTED_A1_C0 = 0xa0, // PIDs supported [A1-C0]

  // Hybrid/Electric (newer vehicles)
  BATTERY_PACK_REMAINING_LIFE = 0x5b, // Hybrid battery pack remaining life (%)
  ENGINE_OIL_TEMP = 0x5c, // Engine oil temperature (°C)
  FUEL_INJECTION_TIMING = 0x5d, // Fuel injection timing (°)
}

/**
 * Protocol Control Information
 */
export enum PCI {
  // Single Frame (SF) - bits 7-4 = 0000, bits 3-0 = data length
  SINGLE_FRAME_0_BYTE = 0x00, // Single frame, 0 data bytes
  SINGLE_FRAME_1_BYTE = 0x01, // Single frame, 1 data byte
  SINGLE_FRAME_2_BYTE = 0x02, // Single frame, 2 data bytes
  SINGLE_FRAME_3_BYTE = 0x03, // Single frame, 3 data bytes
  SINGLE_FRAME_4_BYTE = 0x04, // Single frame, 4 data bytes
  SINGLE_FRAME_5_BYTE = 0x05, // Single frame, 5 data bytes
  SINGLE_FRAME_6_BYTE = 0x06, // Single frame, 6 data bytes
  SINGLE_FRAME_7_BYTE = 0x07, // Single frame, 7 data bytes

  // First Frame (FF) - for multi-frame messages
  FIRST_FRAME = 0x10, // First frame (bits 7-4 = 0001, bits 3-0 = data length high nibble)

  // Consecutive Frame (CF)
  CONSECUTIVE_FRAME = 0x20, // Consecutive frame base (bits 7-4 = 0010, bits 3-0 = sequence number)

  // Flow Control (FC) - used in multi-frame communication
  FLOW_CONTROL = 0x30, // Flow control frame (bits 7-4 = 0011)
}
