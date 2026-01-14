"use client";

import React, { useMemo, useState } from "react";
import { parseZ9Config } from "./z9Parser";
import { Z9_CAMERA_IMAGES, Z9_IMAGE_ASPECT } from "./z9Layout";
import { PLAYBACK_BUTTONS, STILL_BUTTONS } from "./z9Buttons";
import { Z9_ICON_LIST } from "./z9Icons";
import {
  Z9_PLAYBACK_FUNCTIONS,
  Z9_PLAYBACK_GROUP_SIZES,
  Z9_STILL_FUNCTIONS,
  Z9_STILL_GROUP_SIZES,
} from "./z9FunctionLabels";

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-6">
    <p className="text-xs uppercase tracking-[0.4em] text-gray-500">{subtitle}</p>
    <h2 className="mt-2 text-2xl font-semibold md:text-3xl">{title}</h2>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm text-gray-300">
    <span className="text-xs uppercase tracking-[0.3em] text-gray-500">{label}</span>
    <span className="font-medium text-gray-100">
      {value === undefined || value === null || value === "" ? "N/A" : value}
    </span>
  </div>
);

const ModeButton = ({ active, children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
      active
        ? "border-white/50 bg-white/10 text-white"
        : "border-white/10 bg-transparent text-gray-400 hover:border-white/30 hover:text-gray-200"
    }`}
  >
    {children}
  </button>
);

const IconBadge = ({ icon, label }) => (
  <div className="flex w-20 flex-col items-center gap-1 rounded-xl border border-white/10 bg-black/80 px-2 py-2 text-center text-[10px] text-gray-200 shadow-lg">
    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10">
      {icon ? (
        <img
          src={icon.src}
          alt={icon.label}
          className="h-8 w-8 object-contain"
        />
      ) : (
        <span className="text-xs text-gray-400">?</span>
      )}
    </div>
    <div className="leading-tight">{label}</div>
  </div>
);

const CameraMap = ({ title, subtitle, imageSrc, pins, note }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
    <div className="mb-4">
      <p className="text-xs uppercase tracking-[0.4em] text-gray-500">{subtitle}</p>
      <h3 className="mt-2 text-lg font-semibold">{title}</h3>
      {note && <p className="mt-2 text-xs text-gray-400">{note}</p>}
    </div>
    <div
      className="relative mx-auto w-full max-w-[720px] overflow-visible"
      style={{ aspectRatio: `${Z9_IMAGE_ASPECT.width} / ${Z9_IMAGE_ASPECT.height}` }}
    >
      <img
        src={imageSrc}
        alt={title}
        className="absolute inset-0 h-full w-full rounded-xl object-contain"
      />
      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {pins.map((pin) => (
          <g key={pin.slotId}>
            <line
              x1={pin.x}
              y1={pin.y}
              x2={pin.labelX}
              y2={pin.labelY}
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="0.5"
            />
            <circle cx={pin.x} cy={pin.y} r="1.3" fill="#ffffff" />
          </g>
        ))}
      </svg>
      {pins.map((pin) => (
        <div
          key={`${pin.slotId}-label`}
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${pin.labelX}%`, top: `${pin.labelY}%` }}
          title={`${pin.label} / ID ${pin.valueId ?? "—"}${
            pin.valueLabel ? ` / ${pin.valueLabel}` : ""
          }`}
        >
          <IconBadge icon={pin.icon} label={pin.displayLabel} />
        </div>
      ))}
    </div>
  </div>
);

const formatShortLabel = (label) => {
  if (!label) return "";
  const trimmed = label.split("（")[0].replace(/\//g, " ");
  if (trimmed.length <= 8) return trimmed;
  return `${trimmed.slice(0, 8)}...`;
};

const uniqueIds = (list) => {
  if (!list?.length) return [];
  return Array.from(
    new Set(
      list
        .map((item) => item.valueId)
        .filter((value) => value !== null && value !== undefined)
    )
  ).sort((a, b) => a - b);
};

const normalizeLabel = (label) => {
  if (!label) return "";
  return label.replace(/[\s/\\_\-+・()（）［］\[\].／–−]/g, "");
};

const splitBySizes = (labels, sizes) => {
  const groups = [];
  let start = 0;
  sizes.forEach((size) => {
    groups.push(labels.slice(start, start + size));
    start += size;
  });
  return groups;
};

const STILL_FUNCTION_GROUPS = splitBySizes(
  Z9_STILL_FUNCTIONS,
  Z9_STILL_GROUP_SIZES
);
const PLAYBACK_FUNCTION_GROUPS = splitBySizes(
  Z9_PLAYBACK_FUNCTIONS,
  Z9_PLAYBACK_GROUP_SIZES
);

const findBestGroupOffsets = (groups, observedIds, options = {}) => {
  if (!observedIds.length) return null;
  const observedSet = new Set(observedIds);
  const maxId = Math.max(...observedIds);
  const maxGroup = Math.max(Math.floor(maxId / 32), groups.length - 1);
  const range = Array.from({ length: maxGroup + 1 }, (_, idx) => idx);
  const groupChoices = options.fixedGroups
    ? options.fixedGroups.map((group) => [group])
    : groups.map(() => range);
  const offsetChoices = groups.map((group) => {
    const maxOffset = Math.max(0, 32 - group.length);
    return Array.from({ length: maxOffset + 1 }, (_, idx) => idx);
  });

  let bestScore = -1;
  let bestOffsetSum = Infinity;
  let bestGroups = [];
  let bestOffsets = [];
  const currentGroups = new Array(groups.length).fill(0);
  const currentOffsets = new Array(groups.length).fill(0);

  const search = (index, lastGroup, usedGroups, covered) => {
    if (index === groups.length) {
      const score = covered.size;
      const offsetSum = currentOffsets.reduce((sum, value) => sum + value, 0);
      if (
        score > bestScore ||
        (score === bestScore && offsetSum < bestOffsetSum)
      ) {
        bestScore = score;
        bestOffsetSum = offsetSum;
        bestGroups = [...currentGroups];
        bestOffsets = [...currentOffsets];
      }
      return;
    }

    for (const group of groupChoices[index]) {
      if (options.increasing !== false && group < lastGroup) continue;
      if (options.unique !== false && usedGroups.has(group)) continue;
      currentGroups[index] = group;
      const nextUsed = new Set(usedGroups);
      nextUsed.add(group);
      for (const offset of offsetChoices[index]) {
        currentOffsets[index] = offset;
        const nextCovered = new Set(covered);
        for (let idx = 0; idx < groups[index].length; idx += 1) {
          const valueId = group * 32 + offset + idx;
          if (observedSet.has(valueId)) {
            nextCovered.add(valueId);
          }
        }
        search(index + 1, group, nextUsed, nextCovered);
      }
    }
  };

  search(0, -1, new Set(), new Set());
  if (!bestGroups.length) return null;
  return { groups: bestGroups, offsets: bestOffsets };
};

const buildIdLabelMap = (groups, observedIds, options = {}) => {
  const mapping = findBestGroupOffsets(groups, observedIds, options);
  const map = new Map();
  if (!mapping) return map;
  mapping.groups.forEach((groupIndex, groupIdx) => {
    const offset = mapping.offsets[groupIdx] ?? 0;
    groups[groupIdx].forEach((label, labelIdx) => {
      map.set(groupIndex * 32 + offset + labelIdx, label);
    });
  });
  return map;
};

const buildPins = (assignments, buttons, labelMap, iconByLabel) => {
  const assignmentMap = new Map(assignments?.map((item) => [item.slotId, item]));
  return buttons
    .map((button) => {
      if (button.visible === false) return null;
      if (
        button.x === undefined ||
        button.y === undefined ||
        button.labelX === undefined ||
        button.labelY === undefined
      ) {
        return null;
      }
      const assignment = assignmentMap.get(button.slotId);
      const valueId = assignment?.valueId ?? null;
      const valueLabel =
        valueId !== null && valueId !== undefined ? labelMap.get(valueId) : null;
      const icon = valueLabel
        ? iconByLabel.get(normalizeLabel(valueLabel))
        : null;
      const baseLabel = valueLabel || icon?.label || button.short;
      const displayLabel = formatShortLabel(baseLabel || button.short);
      return {
        ...button,
        valueId,
        valueLabel,
        icon,
        displayLabel,
      };
    })
    .filter(Boolean);
};

export default function Z9Visualizer() {
  const [fileMeta, setFileMeta] = useState(null);
  const [parsed, setParsed] = useState(null);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("still");

  const handleFile = async (file) => {
    if (!file) return;
    setError("");
    setParsed(null);
    try {
      const buffer = await file.arrayBuffer();
      setFileMeta({
        name: file.name,
        size: `${Math.round(file.size / 1024)} KB`,
      });
      setParsed(parseZ9Config(buffer));
    } catch (err) {
      setError("設定ファイルの読み込みに失敗しました。別のファイルでお試しください。");
    }
  };

  const iconByLabel = useMemo(() => {
    const map = new Map();
    Z9_ICON_LIST.forEach((icon) => {
      map.set(normalizeLabel(icon.label), icon);
    });
    return map;
  }, []);

  const stillIds = useMemo(() => uniqueIds(parsed?.customButtons?.still), [parsed]);
  const playbackIds = useMemo(
    () => uniqueIds(parsed?.customButtons?.playback),
    [parsed]
  );

  const stillLabelMap = useMemo(
    () =>
      buildIdLabelMap(STILL_FUNCTION_GROUPS, stillIds, {
        fixedGroups: [0, 1, 2, 3],
      }),
    [stillIds]
  );
  const playbackLabelMap = useMemo(
    () => buildIdLabelMap(PLAYBACK_FUNCTION_GROUPS, playbackIds),
    [playbackIds]
  );

  const modeButtons = mode === "still" ? STILL_BUTTONS : PLAYBACK_BUTTONS;
  const modeAssignments =
    mode === "still" ? parsed?.customButtons?.still : parsed?.customButtons?.playback;
  const modeLabelMap = mode === "still" ? stillLabelMap : playbackLabelMap;
  const modePins = useMemo(
    () => buildPins(modeAssignments, modeButtons, modeLabelMap, iconByLabel),
    [modeAssignments, modeButtons, modeLabelMap, iconByLabel]
  );
  const frontPins = useMemo(
    () => modePins.filter((pin) => pin.panel === "front"),
    [modePins]
  );
  const backPins = useMemo(
    () => modePins.filter((pin) => pin.panel === "back"),
    [modePins]
  );

  const iMenuTiles = useMemo(() => parsed?.iMenu ?? [], [parsed]);
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12), transparent 45%), radial-gradient(circle at 80% 10%, rgba(255,255,255,0.08), transparent 40%)",
            }}
          />
        </div>
        <div className="container relative mx-auto px-4 pb-16 pt-12 md:pt-16">
          <SectionHeader title="Nikon Z9 Settings Visualizer" subtitle="Z9 Settings" />
          <p className="max-w-2xl text-sm text-gray-300">
            Z9の設定ファイル（NCSET010.BIN）を読み込み、iメニューとカスタムボタン設定を可視化します。
            設定IDは公式の機能一覧順からオフセットを推定し、自動で紐付けています。
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold">設定ファイルを読み込む</h3>
              <p className="mt-2 text-xs text-gray-400">
                保存済みの設定ファイル（NCSET010.BIN）を選択してください。
              </p>
              <label className="mt-6 flex cursor-pointer flex-col items-start gap-3 rounded-xl border border-dashed border-white/20 bg-black/40 px-4 py-6 transition hover:border-white/40">
                <span className="text-sm text-gray-200">ファイルを選択</span>
                <span className="text-xs text-gray-500">またはドラッグ＆ドロップ</span>
                <input
                  type="file"
                  accept=".BIN,.bin"
                  className="hidden"
                  onChange={(event) => handleFile(event.target.files?.[0])}
                />
              </label>
              {fileMeta && (
                <div className="mt-4 rounded-lg border border-white/10 bg-black/60 px-4 py-3 text-sm text-gray-300">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium text-gray-100">{fileMeta.name}</span>
                    <span className="text-xs text-gray-500">{fileMeta.size}</span>
                  </div>
                </div>
              )}
              {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold">読み取り結果</h3>
              <div className="mt-4 space-y-3">
                <InfoRow label="Model" value={parsed?.model} />
                <InfoRow label="Firmware" value={parsed?.firmware} />
                <InfoRow
                  label="Bytes"
                  value={parsed?.size ? `${parsed.size.toLocaleString()} bytes` : null}
                />
              </div>
            </div>
          </div>

          <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6">
            <SectionHeader title="カスタムボタン" subtitle="Custom Buttons" />
            <div className="flex flex-wrap items-center gap-3">
              <ModeButton active={mode === "still"} onClick={() => setMode("still")}>
                静止画 (f2)
              </ModeButton>
              <ModeButton
                active={mode === "playback"}
                onClick={() => setMode("playback")}
              >
                再生 (f3)
              </ModeButton>
            </div>
            <p className="mt-4 text-xs text-gray-400">
              設定IDはバックグラウンドで自動対応します。未対応の項目は ? で表示されます。
            </p>

            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              <CameraMap
                title="前面"
                subtitle="Front"
                imageSrc={Z9_CAMERA_IMAGES.front}
                pins={frontPins}
                note="番号位置にアイコン＋短いラベルを重ねています。"
              />
              <CameraMap
                title="背面"
                subtitle="Back"
                imageSrc={Z9_CAMERA_IMAGES.back}
                pins={backPins}
                note="レンズ関連の項目は非表示にしています。"
              />
            </div>
          </div>

          <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6">
            <SectionHeader title="iメニュー" subtitle="I Menu" />
            <div className="grid grid-cols-6 gap-2">
              {iMenuTiles.map((tile) => (
                <div
                  key={tile.slot}
                  className="flex flex-col gap-2 rounded-md border border-white/10 bg-black/60 p-3"
                >
                  <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500">
                    Slot {tile.slot}
                  </span>
                  <span className="text-xs font-semibold text-gray-100">
                    {tile.label}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    ID {tile.id ?? "N/A"}
                  </span>
                </div>
              ))}
              {!iMenuTiles.length && (
                <p className="col-span-full text-sm text-gray-400">
                  まだデータがありません。設定ファイルを読み込んでください。
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
