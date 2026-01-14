import { CUSTOM_CONTROL_LABELS, I_MENU_LABELS, Z9_OFFSETS } from "./z9Mappings";

const readAscii = (view, offset, length) => {
  const bytes = [];
  const max = Math.min(view.byteLength, offset + length);
  for (let i = offset; i < max; i += 1) {
    const value = view.getUint8(i);
    if (value === 0) continue;
    bytes.push(value);
  }
  return String.fromCharCode(...bytes).trim();
};

const readUint32 = (view, offset) => {
  if (offset + 4 > view.byteLength) return null;
  return view.getUint32(offset, true);
};

const labelForId = (id, map) => {
  if (id === null || id === undefined) return "N/A";
  if (Object.prototype.hasOwnProperty.call(map, id)) return map[id];
  return "Unknown";
};

export const parseZ9Config = (arrayBuffer) => {
  const view = new DataView(arrayBuffer);
  const model = readAscii(view, 0x00, 16);
  const firmware = readAscii(view, 0x18, 8);

  const iMenu = [];
  for (let slot = 0; slot < Z9_OFFSETS.iMenuSlots; slot += 1) {
    const offset = Z9_OFFSETS.iMenuStart + slot * Z9_OFFSETS.iMenuStride;
    const id = readUint32(view, offset);
    iMenu.push({
      slot: slot + 1,
      offset,
      id,
      label: labelForId(id, I_MENU_LABELS),
    });
  }

  const readCustomSet = (entries) =>
    entries.map((entry) => {
      const valueId = readUint32(view, entry.offset);
      return {
        slotId: entry.id,
        label: entry.label,
        offset: entry.offset,
        valueId,
        valueLabel: labelForId(valueId, CUSTOM_CONTROL_LABELS),
      };
    });

  const customButtons = {
    still: readCustomSet(Z9_OFFSETS.customButtons.still),
    playback: readCustomSet(Z9_OFFSETS.customButtons.playback),
  };

  return {
    model,
    firmware,
    size: view.byteLength,
    iMenu,
    customButtons,
  };
};
