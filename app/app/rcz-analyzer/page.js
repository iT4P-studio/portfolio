"use client";

import React, { useState, useRef, useEffect } from "react";
import JSZip from "jszip";

export default function RCZAnalyzerPage() {
  const [entries, setEntries] = useState([]);      // ZIP 内の全ファイル名リスト
  const [selectedEntry, setSelectedEntry] = useState("");
  const [trackJson, setTrackJson] = useState(null);
  const canvasRef = useRef(null);

  // ファイル選択ハンドラ
  const handleFile = async (file) => {
    const buf = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(buf);

    const names = [];
    zip.forEach((relPath, entry) => {
      if (!entry.dir) names.push(relPath);
    });
    setEntries(names);
    // 自動で候補トップにセット
    if (names.length > 0) setSelectedEntry(names[0]);
  };

  // 任意のエントリを選んで読み込み
  const handleLoadEntry = async () => {
    if (!selectedEntry) return;
    try {
      const file = document.getElementById("rczInput").files[0];
      const buf = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(buf);
      const entry = zip.file(selectedEntry);
      if (!entry) throw new Error("選択エントリが見つかりません");
      const text = await entry.async("string");
      setTrackJson(JSON.parse(text));
    } catch (err) {
      console.error(err);
      alert("JSON 読み込み失敗: " + err.message);
    }
  };

  // 描画
  useEffect(() => {
    if (!trackJson) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle = "#fff"; ctx.lineWidth = 2;

    // JSON 内の座標配列を検出
    let pts = [];
    // 例: GeoJSON
    if (
      trackJson.type === "FeatureCollection" &&
      trackJson.features?.[0]?.geometry?.coordinates
    ) {
      const g = trackJson.features[0].geometry;
      pts = g.type === "LineString"
        ? g.coordinates
        : g.coordinates.flat();
    }
    // 例: 独自フォーマット
    else if (Array.isArray(trackJson.points)) {
      pts = trackJson.points;
    } else if (Array.isArray(trackJson)) {
      pts = trackJson;
    } else {
      console.warn("不明なフォーマット", trackJson);
      return;
    }

    // バウンディングボックス＋スケーリング
    let minX=Infinity, minY=Infinity, maxX=-Infinity, maxY=-Infinity;
    pts.forEach(([x,y])=>{
      minX=Math.min(minX,x);
      minY=Math.min(minY,y);
      maxX=Math.max(maxX,x);
      maxY=Math.max(maxY,y);
    });
    const scale = Math.min(W/(maxX-minX), H/(maxY-minY))*0.9;
    const offX = (W - (maxX-minX)*scale)/2;
    const offY = (H - (maxY-minY)*scale)/2;

    ctx.beginPath();
    pts.forEach(([x,y],i)=>{
      const cx = (x - minX)*scale + offX;
      const cy = H - ((y - minY)*scale + offY);
      i===0 ? ctx.moveTo(cx,cy) : ctx.lineTo(cx,cy);
    });
    ctx.stroke();
  }, [trackJson]);

  return (
    <div className="container mx-auto p-8 text-white">
      <h1 className="text-3xl font-bold mb-4">RCZ Analyzer</h1>

      <div className="mb-4">
        <input
          id="rczInput"
          type="file"
          accept=".rcz"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {entries.length > 0 && (
        <div className="mb-4">
          <label className="block mb-1">ファイル内エントリを選択:</label>
          <select
            className="w-full bg-gray-800 text-white p-2 rounded"
            value={selectedEntry}
            onChange={(e) => setSelectedEntry(e.target.value)}
          >
            {entries.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <button
            className="mt-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
            onClick={handleLoadEntry}
          >
            読み込み
          </button>
        </div>
      )}

      {trackJson && (
        <div className="border border-gray-600 rounded overflow-hidden">
          <canvas
            ref={canvasRef}
            width={600}
            height={600}
            className="w-full h-auto bg-black"
          />
        </div>
      )}
    </div>
  );
}
