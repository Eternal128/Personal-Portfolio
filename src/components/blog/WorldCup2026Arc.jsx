import React, { useState } from 'react';

const MOMENTS = [
  {
    id: 'opener',
    tag: 'Group Stage, Match 1',
    title: 'Hat-trick vs. Algeria',
    summary: '3 goals (17\u2019, 60\u2019, 76\u2019), 3-0 win',
    detail: 'Messi opened the tournament with a hat trick, and by the end of the group stage had scored six of Argentina\u2019s first eight goals himself. Argentina beat Algeria, Austria, and Jordan, scoring eight and conceding just one.',
  },
  {
    id: 'r16',
    tag: 'Round of 16',
    title: 'Down two, with 20 minutes left',
    summary: 'Comeback win vs. Egypt',
    detail: 'Argentina trailed by two goals with 20 minutes to play. Messi rallied the team through the equalizer and the win, the first of two escapes in a row.',
  },
  {
    id: 'sf',
    tag: 'Semifinal',
    title: 'Two assists, one instant classic',
    summary: '2-1 comeback vs. England',
    detail: 'Down 1-0 after the hour mark, Messi provided the assists on both Enzo Fernández\u2019s equalizer and Lautaro Martínez\u2019s 92nd-minute winner, sending Argentina to a second straight final.',
  },
  {
    id: 'final',
    tag: 'Final, July 19, 2026',
    title: 'The one that got away',
    summary: '1-0 loss to Spain, after extra time',
    detail: 'Ferran Torres scored 37 seconds into the second period of extra time. Spain out-shot Argentina 20-2 and out-passed them 845-433. Messi finished the tournament as the all-time World Cup leading scorer with 20 career goals, and the record holder for World Cup assists, appearances, and minutes played. But not the trophy.',
  },
];

const WorldCup2026Arc = () => {
  const [openId, setOpenId] = useState('final');

  return (
    <div style={panel}>
      <div className="bl-mono" style={label}>Interactive. The 2026 Tournament, Start to Finish</div>
      <p style={desc}>
        Four moments, at age 39. Click each one.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {MOMENTS.map((m, i) => {
          const open = openId === m.id;
          return (
            <div key={m.id} style={{ borderTop: i === 0 ? 'none' : '1px solid rgba(17,16,16,0.12)' }}>
              <button
                onClick={() => setOpenId(open ? null : m.id)}
                style={row}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3 }}>
                  <span className="bl-mono" style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(17,16,16,0.4)' }}>
                    {m.tag}
                  </span>
                  <span style={{ fontSize: 15.5, fontWeight: 500, color: '#111010' }}>{m.title}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 12.5, color: 'rgba(17,16,16,0.55)' }}>{m.summary}</span>
                  <span style={{
                    display: 'inline-block', transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease', fontSize: 16, color: 'rgba(17,16,16,0.4)',
                  }}>+</span>
                </div>
              </button>
              {open && (
                <div style={{ padding: '0 4px 20px' }}>
                  <p style={{ fontSize: 13.5, lineHeight: 1.7, color: 'rgba(17,16,16,0.68)', margin: 0, maxWidth: 620 }}>
                    {m.detail}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const panel = { margin: 'clamp(48px,8vh,90px) 0', fontFamily: "'DM Sans', sans-serif", border: '1px solid rgba(17,16,16,0.16)', borderRadius: 8, padding: 'clamp(18px,3vw,28px)', background: 'rgba(17,16,16,0.02)' };
const label = { fontSize: 10.5, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(17,16,16,0.45)', marginBottom: 16 };
const desc = { fontSize: 14, lineHeight: 1.6, color: 'rgba(17,16,16,0.72)', marginBottom: 12 };
const row = {
  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '16px 4px', background: 'none', border: 'none', cursor: 'pointer',
  fontFamily: "'DM Sans', sans-serif", textAlign: 'left',
};

export default WorldCup2026Arc;