import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTime } from '../../hooks/useTime';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

export default function CalendarPanel() {
  const { timeStr, dateStr } = useTime();
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday = (day: number | null) =>
    day !== null &&
    year === today.getFullYear() &&
    month === today.getMonth() &&
    day === today.getDate();

  const isWeekend = (idx: number) => idx % 7 === 0 || idx % 7 === 6;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -6 }}
      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
      style={{
        position: 'fixed', top: 34, right: 60,
        width: 280, zIndex: 9500,
        background: 'rgba(10,10,22,0.93)',
        backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
        overflow: 'hidden',
        padding: '14px 16px',
      }}
    >
      {/* Live clock */}
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#e2e8f0', letterSpacing: '-0.02em' }}>
          {timeStr}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(148,163,184,0.6)', marginTop: 2 }}>
          {dateStr}
        </div>
      </div>

      {/* Month navigator */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
        <button
          onClick={prevMonth}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(148,163,184,0.7)', padding: 4 }}
        >
          <ChevronLeft size={14} />
        </button>
        <span style={{ flex: 1, textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>
          {MONTHS[month]} {year}
        </span>
        <button
          onClick={nextMonth}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(148,163,184,0.7)', padding: 4 }}
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
        {DAYS.map((d, i) => (
          <div key={d} style={{
            textAlign: 'center', fontSize: 9.5, fontWeight: 600,
            color: (i === 0 || i === 6) ? 'rgba(167,139,250,0.6)' : 'rgba(100,116,139,0.8)',
            padding: '2px 0',
          }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {cells.map((day, idx) => {
          const prevDay = day === null && idx < firstDay ? daysInPrev - (firstDay - idx - 1) : null;
          const nextDay = day === null && idx >= firstDay ? idx - firstDay - daysInMonth + 1 : null;
          const displayDay = day ?? prevDay ?? nextDay;
          const isFaded = day === null;
          const today_ = isToday(day);
          const weekend = isWeekend(idx);

          return (
            <div
              key={idx}
              style={{
                textAlign: 'center', padding: '5px 0', borderRadius: 6,
                fontSize: 11,
                background: today_ ? '#7c3aed' : 'transparent',
                color: today_
                  ? '#fff'
                  : isFaded
                  ? 'rgba(100,116,139,0.35)'
                  : weekend
                  ? 'rgba(167,139,250,0.7)'
                  : 'rgba(226,232,240,0.8)',
                fontWeight: today_ ? 700 : 400,
                cursor: isFaded ? 'default' : 'pointer',
              }}
            >
              {displayDay}
            </div>
          );
        })}
      </div>

      {/* Today indicator */}
      <div style={{
        marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)',
        fontSize: 10.5, color: 'rgba(148,163,184,0.5)', textAlign: 'center',
      }}>
        Today is <span style={{ color: '#a78bfa', fontWeight: 600 }}>
          {MONTHS[today.getMonth()]} {today.getDate()}, {today.getFullYear()}
        </span>
      </div>
    </motion.div>
  );
}
