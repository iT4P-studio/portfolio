"use client";

import React, { useState, useRef, useEffect } from "react";

// 定義済みサーキットIDと名称のリスト
const circuits = [
  { id: "TC2000", name: "TSUKUBA CIRCUIT 2000" },
  { id: "TC1000", name: "TSUKUBA CIRCUIT 1000" },
  { id: "TC5000", name: "TSUKUBA CIRCUIT 5000" },
];

export default function TrackAndBestPage() {
  const [selectedCircuit, setSelectedCircuit] = useState(circuits[0].id);
  const [rotation, setRotation] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [milliseconds, setMilliseconds] = useState(0);
  const [fontSize, setFontSize] = useState(36);
  const [posX, setPosX] = useState(300);
  const [posY, setPosY] = useState(550);
  const canvasRef = useRef(null);

  // 分:秒.ミリ秒 フォーマット
  const assembleTimeText = () => {
    const ss = seconds.toString().padStart(2, "0");
    const ms = milliseconds.toString().padStart(3, "0");
    return `${minutes}:${ss}.${ms}`;
  };

  // 画像生成
  const generateImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const size = canvas.width;
    ctx.clearRect(0, 0, size, size);

    const img = new Image();
    img.src = `/circuits/${selectedCircuit}.png`;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      ctx.save();
      ctx.translate(size / 2, size / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      const scale = Math.min(size / img.width, size / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
      ctx.restore();

      const timeText = assembleTimeText();
      ctx.font = `italic bold ${fontSize}px Impact, 'Avenir Next', 'Yu Gothic', sans-serif`;
      ctx.fillStyle = "white";
      ctx.textAlign = "left";
      ctx.fillText(timeText, posX, posY);
    };
  };

  // 自動再生成
  useEffect(() => {
    generateImage();
  }, [selectedCircuit, rotation, minutes, seconds, milliseconds, fontSize, posX, posY]);

  // ダウンロード
  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${selectedCircuit}_best.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Track & Best</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {/* サーキット選択 */}
          <div>
            <label className="block mb-1">Circuit</label>
            <select
              className="w-full p-2 bg-gray-800 text-white rounded"
              value={selectedCircuit}
              onChange={(e) => setSelectedCircuit(e.target.value)}
            >
              {circuits.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* 回転 */}
          <div>
            <label className="block mb-1">Rotation: {rotation}°</label>
            <input
              type="range"
              className="w-full"
              min={0}
              max={360}
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
            />
          </div>

          {/* 時間入力 */}
          <div>
            <label className="block mb-1">Time Input</label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <label className="block text-sm">分</label>
                <input
                  type="number"
                  className="w-full p-2 bg-gray-800 text-white rounded"
                  value={minutes}
                  onChange={(e) => setMinutes(Number(e.target.value))}
                  min={0}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm">秒</label>
                <input
                  type="number"
                  className="w-full p-2 bg-gray-800 text-white rounded"
                  value={seconds}
                  onChange={(e) => setSeconds(Number(e.target.value))}
                  min={0}
                  max={59}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm">ミリ秒</label>
                <input
                  type="number"
                  className="w-full p-2 bg-gray-800 text-white rounded"
                  value={milliseconds}
                  onChange={(e) => setMilliseconds(Number(e.target.value))}
                  min={0}
                  max={999}
                />
              </div>
            </div>
          </div>

          {/* フォントサイズ */}
          <div>
            <label className="block mb-1">Font Size: {fontSize}px</label>
            <input
              type="range"
              className="w-full"
              min={10}
              max={72}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
            />
          </div>

          {/* 位置 */}
          <div>
            <label className="block mb-1">Position X: {posX}px</label>
            <input
              type="range"
              className="w-full"
              min={0}
              max={600}
              value={posX}
              onChange={(e) => setPosX(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block mb-1">Position Y: {posY}px</label>
            <input
              type="range"
              className="w-full"
              min={0}
              max={600}
              value={posY}
              onChange={(e) => setPosY(Number(e.target.value))}
            />
          </div>

          {/* ダウンロード */}
          <button
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-500 transition"
            onClick={downloadImage}
          >
            Download PNG
          </button>
        </div>

        {/* プレビュー */}
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            width={600}
            height={600}
            className="border border-gray-600 rounded"
          />
        </div>
      </div>
    </div>
  );
}
