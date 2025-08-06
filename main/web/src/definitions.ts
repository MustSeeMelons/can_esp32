// Map OBD2 can message identifier to human readable name
export const mapIdentifierToName = (identifier: number) => {
  switch (identifier) {
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
};
