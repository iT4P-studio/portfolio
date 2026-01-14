export const I_MENU_LABELS = {
  0: "Active D-Lighting",
  1: "AF area mode",
  3: "Auto bracketing",
  4: "Bluetooth connection",
  5: "Monitor/viewfinder brightness",
  6: "Color space",
  7: "Choose image area",
  8: "Custom controls",
  9: "Shutter type",
  11: "Exposure compensation",
  12: "Exposure delay mode",
  13: "Flash compensation",
  15: "Focus mode",
  17: "HDR",
  19: "High ISO NR",
  21: "Image quality",
  22: "Image size",
  24: "ISO sensitivity settings",
  25: "Long exposure NR",
  26: "Apply settings to live view",
  27: "Metering",
  29: "Multiple exposure",
  30: "Peaking highlights",
  31: "Set Picture Control",
  32: "Release mode",
  33: "Silent photography",
  35: "Vibration reduction",
  36: "White balance",
  38: "Wi-Fi connection",
  39: "View memory card info",
  40: "Interval timer shooting",
  41: "Time-lapse movie",
  42: "Focus shift shooting",
  51: "Group flash options",
};

export const CUSTOM_CONTROL_LABELS = {};

const buildButtonOffsets = (prefix, count, start, stride) =>
  Array.from({ length: count }, (_, index) => ({
    id: `${prefix}-${index + 1}`,
    label: `${prefix} ${index + 1}`,
    offset: start + index * stride,
  }));

export const Z9_OFFSETS = {
  iMenuStart: 0x87c,
  iMenuSlots: 12,
  iMenuStride: 4,
  customButtons: {
    still: buildButtonOffsets("still", 29, 0x8ac, 0x14),
    playback: buildButtonOffsets("playback", 21, 0x978, 0x08),
  },
};
