import React from "react";

const ROUTES = [
  {
    id: "route-a",
    color: "#E8552B",
    glow: "rgba(232,85,43,0.45)",
    d: "M 40 110 C 140 40, 260 40, 340 95 C 430 155, 560 140, 640 85 C 720 40, 800 45, 870 40",
    duration: "20s",
    courier: { name: "Ahmet K.", order: "#SP-1042", status: "Yolda" },
  },
  {
    id: "route-b",
    color: "#1D6FB8",
    glow: "rgba(29,111,184,0.45)",
    d: "M 30 240 C 160 240, 220 290, 320 270 C 430 250, 480 190, 560 165 C 640 140, 700 155, 860 150",
    duration: "23s",
    courier: { name: "Mehmet T.", order: "#SP-1049", status: "Teslim ediyor" },
  },
  {
    id: "route-c",
    color: "#7C3AED",
    glow: "rgba(124,58,237,0.45)",
    d: "M 850 350 C 720 365, 620 330, 540 340 C 460 350, 420 315, 340 315 C 260 315, 180 350, 60 330",
    duration: "24s",
    courier: { name: "Caner B.", order: "#SP-1055", status: "Yolda" },
  },
  {
    id: "route-d",
    color: "#0E9F6E",
    glow: "rgba(14,159,110,0.45)",
    d: "M 60 40 C 160 75, 180 125, 120 165 C 60 200, 100 240, 200 240 C 300 240, 340 200, 420 215 C 500 225, 520 260, 600 250",
    duration: "26s",
    courier: { name: "Elif S.", order: "#SP-1061", status: "Yolda" },
  },
  {
    id: "route-e",
    color: "#D6336C",
    glow: "rgba(214,51,108,0.45)",
    d: "M 880 240 C 800 215, 760 165, 800 125 C 840 90, 780 50, 700 65 C 620 75, 580 115, 500 100 C 420 90, 400 50, 320 55",
    duration: "22s",
    courier: { name: "Burak K.", order: "#SP-1068", status: "Teslim ediyor" },
  },
  {
    id: "route-f",
    color: "#B45309",
    glow: "rgba(180,83,9,0.45)",
    d: "M 40 345 C 140 335, 180 300, 260 310 C 340 320, 380 285, 460 295 C 540 305, 600 285, 660 310 C 720 330, 800 320, 870 345",
    duration: "28s",
    courier: { name: "Selin A.", order: "#SP-1073", status: "Yolda" },
  },
];

const BUILDINGS = [
  [70, 129, 46, 30, -6],
  [130, 153, 40, 26, 4],
  [60, 184, 50, 26, -3],
  [150, 184, 42, 32, 8],
  [730, 184, 46, 28, 5],
  [790, 208, 40, 32, -4],
  [640, 37, 40, 26, 6],
  [560, 25, 46, 22, -8],
  [400, 37, 44, 26, 3],
  [470, 184, 40, 24, -5],
  [60, 80, 44, 22, 5],
  [820, 92, 40, 28, -6],
  [740, 282, 46, 26, 4],
  [110, 245, 40, 22, -3],
];

const PARKS = [
  {
    d: "M 60 258 C 110 245, 190 245, 220 270 C 250 294, 220 319, 170 319 C 120 319, 40 294, 60 258 Z",
  },
  {
    d: "M 660 202 C 700 190, 760 196, 770 221 C 780 245, 740 258, 700 251 C 660 245, 630 215, 660 202 Z",
  },
];

const AVENUES = [
  "M 20 153 C 160 141, 300 159, 420 144 C 540 129, 640 110, 880 123",
  "M 250 12 C 230 92, 300 184, 260 276 C 230 331, 300 356, 320 368",
];

const STREETS = [
  "M 40 196 C 120 208, 180 184, 260 202 C 340 221, 380 196, 460 208",
  "M 500 37 C 520 86, 480 123, 520 159",
  "M 600 276 C 680 264, 740 282, 820 258",
  "M 120 294 C 200 288, 240 319, 320 307",
];

const BRIDGES = [
  { x: 800, y: 40, w: 60, h: 14, rot: -35 },
  { x: 645, y: 144, w: 55, h: 14, rot: -18 },
  { x: 345, y: 303, w: 55, h: 14, rot: -22 },
];

function MotorcycleIcon({ color }) {
  return (
    <g filter="url(#glow-soft)">
      <ellipse cx="0" cy="8" rx="12" ry="3" fill="rgba(31,41,55,0.28)" />
      <circle
        cx="-7"
        cy="6"
        r="4"
        fill="#1F2937"
        stroke="#4B5563"
        strokeWidth="1"
      />
      <circle
        cx="7"
        cy="6"
        r="4"
        fill="#1F2937"
        stroke="#4B5563"
        strokeWidth="1"
      />
      <path
        d="M -7 6 L -3 -1 L 4 -1 L 8 6 M -3 -1 L -1 -5 L 4 -5 L 4 -1"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.4"
      />
      <circle cx="9" cy="4" r="1.3" fill="#FFD166" />
    </g>
  );
}

function PinRestaurant({ color }) {
  return (
    <g>
      <circle r="9" fill="#FFFFFF" stroke={color} strokeWidth="2.2" />
      <path
        d="M -3 -4 L -3 4 M -1.6 -4 L -1.6 0 M -0.2 -4 L -0.2 0 M -1.6 0 L -3 0 M 2.6 -4 C 2.6 -1 2.6 0 1.6 0 L 1.6 4"
        stroke="#1F2937"
        strokeWidth="0.9"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

function PinHome({ color }) {
  return (
    <g>
      <circle r="3.4" fill="none" stroke={color} strokeWidth="1.6" opacity="0.5">
        <animate
          attributeName="r"
          values="3.4;14;3.4"
          dur="2.6s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.5;0;0.5"
          dur="2.6s"
          repeatCount="indefinite"
        />
      </circle>
      <circle r="9" fill="#FFFFFF" stroke={color} strokeWidth="2.2" />
      <path d="M -4 1 L 0 -4 L 4 1 L 4 4.5 L -4 4.5 Z" fill={color} />
    </g>
  );
}

export default function CourierDemoMap() {
  return (
    <div className="lg:col-span-2 bg-white border border-stone-100 rounded-[28px] p-5 shadow-soft">
      <style>{`
        .cmd-wrap {
          --ink: #1F2937;
          --ink-dim: #6B7280;
          --card: #FFFFFF;
          --border: #E4E1D8;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif;
          box-sizing: border-box;
        }
        .cmd-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
          padding: 0 4px;
        }
        .cmd-title h2 {
          margin: 0;
          font-size: 17px;
          font-weight: 800;
          color: var(--ink);
          letter-spacing: -0.01em;
        }
        .cmd-title span {
          font-size: 12.5px;
          color: var(--ink-dim);
        }
        .cmd-live {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #FDEBE3;
          border: 1px solid #F4C6AF;
          color: #C24418;
          font-size: 12px;
          font-weight: 700;
          padding: 5px 10px 5px 8px;
          border-radius: 999px;
          white-space: nowrap;
        }
        .cmd-live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #E8552B;
          animation: cmd-pulse 1.6s ease-out infinite;
        }
        @keyframes cmd-pulse {
          0% { box-shadow: 0 0 0 0 rgba(232,85,43,0.5); }
          70% { box-shadow: 0 0 0 7px rgba(232,85,43,0); }
          100% { box-shadow: 0 0 0 0 rgba(232,85,43,0); }
        }
        .cmd-map-frame {
          position: relative;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid var(--border);
          background: #EFEDE6;
          /* viewBox (900x380) ile birebir aynı oran: ölçek üniform kalır,
             ne kırpma ne de esneme/basıklık olur. */
          aspect-ratio: 900 / 380;
        }
        .cmd-map-frame svg {
          display: block;
          width: 100%;
          height: 100%;
        }
        .cmd-controls {
          position: absolute;
          top: 12px;
          right: 12px;
          display: flex;
          flex-direction: column;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 6px rgba(20,20,20,0.18);
        }
        .cmd-controls button {
          width: 30px;
          height: 30px;
          background: #FFFFFF;
          border: none;
          border-bottom: 1px solid #ECE9DF;
          color: #374151;
          font-size: 16px;
          font-weight: 700;
          cursor: default;
        }
        .cmd-controls button:last-child { border-bottom: none; }
        .cmd-compass {
          position: absolute;
          top: 12px;
          left: 12px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #FFFFFF;
          box-shadow: 0 2px 6px rgba(20,20,20,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cmd-badge {
          position: absolute;
          right: 10px;
          bottom: 10px;
          background: rgba(255,255,255,0.85);
          color: #8A8578;
          font-size: 10.5px;
          padding: 3px 8px;
          border-radius: 6px;
        }
        .cmd-scale {
          position: absolute;
          left: 14px;
          bottom: 12px;
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 10.5px;
          color: #6B7280;
        }
        .cmd-scale-bar {
          width: 46px;
          height: 3px;
          background: #4B5563;
          border-radius: 2px;
        }
        .cmd-legend {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 8px;
          margin-top: 12px;
        }
        .cmd-legend-item {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #FAFAF7;
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 9px 12px;
        }
        .cmd-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .cmd-legend-text {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .cmd-legend-name {
          font-size: 13px;
          font-weight: 700;
          color: var(--ink);
        }
        .cmd-order {
          font-family: "SFMono-Regular", ui-monospace, Menlo, monospace;
          font-size: 11.5px;
          color: var(--ink-dim);
        }
        .cmd-status {
          margin-left: auto;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 999px;
          white-space: nowrap;
        }
        @media (max-width: 640px) {
          .cmd-header {
            align-items: flex-start;
            flex-direction: column;
          }
          .cmd-legend {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="cmd-wrap">
        <div className="cmd-header">
          <div className="cmd-title">
            <h2>Kurye Haritası</h2>
            <span>Görsel demo · gerçek zamanlı veri içermez</span>
          </div>
          <div className="cmd-live">
            <span className="cmd-live-dot" />
            CANLI · 6 kurye yolda
          </div>
        </div>

        <div className="cmd-map-frame">
          <svg
            viewBox="0 0 900 380"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="glow-soft" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="1.6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-strong" x="-150%" y="-150%" width="400%" height="400%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect x="0" y="0" width="900" height="380" fill="#EFEDE6" />

            {PARKS.map((park, index) => (
              <path
                key={index}
                d={park.d}
                fill="#CFE8C4"
                stroke="#B7D9A8"
                strokeWidth="1.5"
              />
            ))}

            <g>
              {BUILDINGS.map(([x, y, w, h, rot], index) => (
                <rect
                  key={index}
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  rx="3"
                  fill="#DEDACD"
                  stroke="#C9C3B2"
                  strokeWidth="1"
                  transform={`rotate(${rot} ${x + w / 2} ${y + h / 2})`}
                />
              ))}
            </g>

            <g fill="none">
              {STREETS.map((d, index) => (
                <g key={index}>
                  <path d={d} stroke="#D3CEBF" strokeWidth="6" strokeLinecap="round" />
                  <path d={d} stroke="#FFFFFF" strokeWidth="4.2" strokeLinecap="round" />
                </g>
              ))}
            </g>

            <g fill="none">
              {AVENUES.map((d, index) => (
                <g key={index}>
                  <path d={d} stroke="#E3A542" strokeWidth="11" strokeLinecap="round" />
                  <path d={d} stroke="#FFD98C" strokeWidth="8" strokeLinecap="round" />
                </g>
              ))}
            </g>

            <path
              d="M 900 25 C 760 55, 700 98, 680 141 C 650 196, 560 221, 480 258 C 400 294, 340 319, 260 368"
              fill="none"
              stroke="#8FC3E8"
              strokeWidth="28"
              strokeLinecap="round"
            />
            <path
              d="M 900 25 C 760 55, 700 98, 680 141 C 650 196, 560 221, 480 258 C 400 294, 340 319, 260 368"
              fill="none"
              stroke="#AEDBFA"
              strokeWidth="23"
              strokeLinecap="round"
            />

            {BRIDGES.map((bridge, index) => (
              <g
                key={index}
                transform={`translate(${bridge.x} ${bridge.y}) rotate(${bridge.rot})`}
              >
                <rect
                  x={-bridge.w / 2}
                  y={-bridge.h / 2}
                  width={bridge.w}
                  height={bridge.h}
                  rx="4"
                  fill="#C7C1B2"
                  stroke="#A7A091"
                  strokeWidth="1.4"
                />
                <line
                  x1={-bridge.w / 2 + 5}
                  y1="0"
                  x2={bridge.w / 2 - 5}
                  y2="0"
                  stroke="#FFFFFF"
                  strokeWidth="1.4"
                  strokeDasharray="5 5"
                  opacity="0.8"
                />
              </g>
            ))}

            {ROUTES.map((route) => (
              <g key={route.id}>
                <path
                  id={route.id}
                  d={route.d}
                  fill="none"
                  stroke={route.color}
                  strokeWidth="4.5"
                  strokeOpacity="0.55"
                  strokeLinecap="round"
                />
                <path
                  d={route.d}
                  fill="none"
                  stroke={route.color}
                  strokeWidth="3.6"
                  strokeOpacity="0.95"
                  strokeLinecap="round"
                  strokeDasharray="16 13"
                  filter="url(#glow-strong)"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="0"
                    to="-58"
                    dur="1.6s"
                    repeatCount="indefinite"
                  />
                </path>
              </g>
            ))}

            {ROUTES.map((route) => {
              const points = route.d.match(/-?[\d.]+/g).map(Number);
              const [startX, startY] = points;
              const endX = points[points.length - 2];
              const endY = points[points.length - 1];

              return (
                <g key={`${route.id}-pins`}>
                  <g transform={`translate(${startX},${startY})`}>
                    <PinRestaurant color={route.color} />
                  </g>
                  <g transform={`translate(${endX},${endY})`}>
                    <PinHome color={route.color} />
                  </g>
                </g>
              );
            })}

            {ROUTES.map((route) => (
              <g key={`${route.id}-bike`}>
                <MotorcycleIcon color={route.color} />
                <animateMotion dur={route.duration} repeatCount="indefinite" rotate="auto">
                  <mpath href={`#${route.id}`} />
                </animateMotion>
              </g>
            ))}
          </svg>

          <div className="cmd-compass">
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path d="M8 1 L10 8 L8 6.5 L6 8 Z" fill="#C24418" />
              <path d="M8 15 L10 8 L8 9.5 L6 8 Z" fill="#9CA3AF" />
            </svg>
          </div>

          <div className="cmd-controls">
            <button aria-hidden="true" type="button">
              +
            </button>
            <button aria-hidden="true" type="button">
              -
            </button>
          </div>

          <div className="cmd-scale">
            <span className="cmd-scale-bar" />
            500 m
          </div>

          <div className="cmd-badge">Harita gösterimi temsilidir</div>
        </div>
      </div>
    </div>
  );
}