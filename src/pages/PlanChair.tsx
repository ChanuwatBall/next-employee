import React, { useMemo } from "react";

type SeatStatus = "available" | "occupied" | "reserved" | "disabled";

type GridItem =
  | { kind: "seat"; id: string; label: string; status: SeatStatus; r: number; c: number; cs?: number }
  | { kind: "driver"; label: string; r: number; c: number; cs?: number }
  | { kind: "stairs"; label: string; r: number; c: number; cs?: number }
  | { kind: "aisle"; r: number; c: number; rs?: number; cs?: number };

type Props = {
  seatStatusMap?: Record<string, SeatStatus>;
  onSeatClick?: (seatId: string) => void;
};

// 5 คอลัมน์: 0,1 ซ้าย | 2 ทางเดิน | 3,4 ขวา
const COLS = 5;

const statusColor: Record<SeatStatus, string> = {
  available: "#2ecc71",
  occupied: "#2c3e50",
  reserved: "#f1c40f",
  disabled: "#bdc3c7",
};

function buildPlan(seatStatusMap?: Record<string, SeatStatus>) {
  const seat = (id: string, r: number, c: number): GridItem => ({
    kind: "seat",
    id,
    label: id,
    status: seatStatusMap?.[id] ?? "available",
    r,
    c,
  });

  const items: GridItem[] = [];

  items.push({ kind: "stairs", label: "บันไดขึ้น", r: 0, c: 3, cs: 2 });

  // row 0: คนขับ (ตัวอย่างให้กิน 2 คอลัมน์ฝั่งซ้าย)
  items.push({ kind: "driver", label: "คนขับ", r: 0, c: 0, cs: 2 });

  // // row 1: บันไดขึ้น กิน 2 คอลัมน์ (ซ้าย)
  // items.push({ kind: "stairs", label: "บันไดขึ้น", r: 1, c: 0, cs: 2 });

  // ทางเดิน (คอลัมน์ 2) ให้ยาวลงมาตลอด
  items.push({ kind: "aisle", r: 0, c: 2, rs: 9, cs: 1 }); // rs = จำนวนแถวรวม (ปรับได้)

  // แถวที่นั่งเริ่มที่ row 2
  const rows = [
    ["1A", "1B", "1C", "1D"],
    ["2A", "2B", "2C", "2D"],
    ["3A", "3B", "3C", "3D"],
    ["4A", "4B", "4C", "4D"],
    ["5A", "5B", "5C", "5D"],
    ["6A", "6B", "6C", "6D"],
    ["7A", "7B", "7C", "7D"],
  ];

  rows.forEach((rSeats, idx) => {
    const r = 2 + idx;
    items.push(seat(rSeats[0], r, 0));
    items.push(seat(rSeats[1], r, 1));
    items.push(seat(rSeats[2], r, 3));
    items.push(seat(rSeats[3], r, 4));
  });

  const totalRows = 2 + rows.length; // 9 แถว
  return { items, totalRows };
}

export default function UpperDeckPlanWith2ColStairs({ seatStatusMap, onSeatClick }: Props) {
  const { items, totalRows } = useMemo(() => buildPlan(seatStatusMap), [seatStatusMap]);

  return (
    <div style={styles.wrapper}>
      <div style={styles.title}>แปลนที่นั่งชั้นบน</div>

      <div
        style={{
          ...styles.grid,
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${totalRows}, 56px)`,
        }}
      >
        {items.map((it, i) => {
          const base: React.CSSProperties = {
            gridColumn: `${it.c + 1} / span ${it.cs ?? 1}`,
            gridRow: `${it.r + 1} / span ${"rs" in it && it.rs ? it.rs : 1}`,
          };

          if (it.kind === "aisle") {
            return <div key={i} style={{ ...styles.aisle, ...base }} />;
          }

          if (it.kind === "driver") {
            return (
              <div key={i} style={{ ...styles.block, ...styles.driver, ...base }}>
                🚍 {it.label}
              </div>
            );
          }

          if (it.kind === "stairs") {
            return (
              <div key={i} style={{ ...styles.block, ...styles.stairs, ...base }}>
                ⬆️ {it.label}
              </div>
            );
          }

          // seat
          const disabled = it.status === "disabled";
          const border = disabled ? "1px solid #e5e7eb" : "1px solid #d1d5db";
          const bg = it.status === "available" ? "#ecfdf5" : "#f3f4f6";

          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => onSeatClick?.(it.id)}
              style={{
                ...styles.seat,
                ...base,
                border,
                background: bg,
                opacity: disabled ? 0.6 : 1,
              }}
            >
              <div style={{ fontSize: 18, color: statusColor[it.status] }}>🪑</div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>{it.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: { maxWidth: 420, margin: "0 auto", padding: 16, fontFamily: "Inter, Arial" },
  title: { fontSize: 18, fontWeight: 800, marginBottom: 12 },
  grid: {
    display: "grid",
    gap: 10,
    padding: 14,
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    background: "#fff",
  },
  aisle: {
    borderRadius: 12,
    background: "#f9fafb",
    border: "1px dashed #e5e7eb",
  },
  block: {
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 13,
    background: "#fff",
  },
  driver: { background: "#eef2ff", borderColor: "#c7d2fe" },
  stairs: { background: "#f0fdf4", borderColor: "#bbf7d0" },
  seat: {
    borderRadius: 12,
    cursor: "pointer",
    padding: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    flexDirection: "column",
  },
};