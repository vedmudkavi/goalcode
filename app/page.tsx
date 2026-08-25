'use client';

import { ChangeEvent, useMemo, useState } from 'react';

type Shot = {
  id: number; left: number; top: number; xg: number; player: string;
  result: string; team: 'home' | 'away'; minute: number;
};

const demoShots: Shot[] = [
  { id: 1, left: 72, top: 49, xg: 0.42, player: 'B. Saka', result: 'Goal', team: 'home', minute: 18 },
  { id: 2, left: 84, top: 31, xg: 0.31, player: 'K. Havertz', result: 'Saved', team: 'home', minute: 34 },
  { id: 3, left: 66, top: 69, xg: 0.08, player: 'M. Ødegaard', result: 'Blocked', team: 'home', minute: 41 },
  { id: 4, left: 78, top: 62, xg: 0.19, player: 'G. Martinelli', result: 'Goal', team: 'home', minute: 67 },
  { id: 5, left: 58, top: 40, xg: 0.04, player: 'D. Rice', result: 'Off target', team: 'home', minute: 81 },
  { id: 6, left: 24, top: 44, xg: 0.36, player: 'M. Salah', result: 'Goal', team: 'away', minute: 55 },
  { id: 7, left: 18, top: 61, xg: 0.14, player: 'L. Díaz', result: 'Saved', team: 'away', minute: 63 },
  { id: 8, left: 32, top: 29, xg: 0.06, player: 'D. Szoboszlai', result: 'Off target', team: 'away', minute: 76 },
];

const momentum = [22, 36, 58, 43, 70, -24, -54, -67, 38, 48, 26, -31];

export default function Home() {
  const [shots, setShots] = useState(demoShots);
  const [selected, setSelected] = useState<Shot>(demoShots[0]);
  const [filter, setFilter] = useState<'all' | 'home' | 'away'>('all');
  const [showImport, setShowImport] = useState(false);
  const [fileMessage, setFileMessage] = useState('');

  const visibleShots = filter === 'all' ? shots : shots.filter((shot) => shot.team === filter);
  const totals = useMemo(() => ({
    home: shots.filter(s => s.team === 'home').reduce((sum, s) => sum + s.xg, 0),
    away: shots.filter(s => s.team === 'away').reduce((sum, s) => sum + s.xg, 0),
    homeShots: shots.filter(s => s.team === 'home').length,
    awayShots: shots.filter(s => s.team === 'away').length,
  }), [shots]);

  function importCsv(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    file.text().then((text) => {
      try {
        const [headerLine, ...rows] = text.trim().split(/\r?\n/);
        const headers = headerLine.toLowerCase().split(',').map(h => h.trim());
        const required = ['team', 'player', 'left', 'top', 'xg', 'result', 'minute'];
        if (!required.every(key => headers.includes(key))) throw new Error('Missing columns');
        const parsed = rows.filter(Boolean).map((row, index) => {
          const values = row.split(',').map(value => value.trim());
          const get = (key: string) => values[headers.indexOf(key)];
          const team = get('team').toLowerCase();
          if (team !== 'home' && team !== 'away') throw new Error('Invalid team');
          return {
            id: index + 1, team, player: get('player'), result: get('result'),
            left: Number(get('left')), top: Number(get('top')), xg: Number(get('xg')),
            minute: Number(get('minute')),
          } as Shot;
        });
        if (!parsed.length || parsed.some(s => [s.left, s.top, s.xg, s.minute].some(Number.isNaN))) throw new Error('Invalid data');
        setShots(parsed); setSelected(parsed[0]); setFilter('all');
        setFileMessage(`${parsed.length} shots imported successfully`);
      } catch {
        setFileMessage('That file could not be read. Please use the sample format.');
      }
    });
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#" aria-label="GoalCode home"><span className="brand-mark">G</span><span>GoalCode</span></a>
        <nav aria-label="Primary navigation"><a className="active" href="#overview">Overview</a><a href="#analysis">Analysis</a><a href="#players">Players</a></nav>
        <button className="upload-button" onClick={() => { setShowImport(true); setFileMessage(''); }}>＋ Import match</button>
      </header>

      <section className="page-shell" id="overview">
        <div className="eyebrow-row"><p className="eyebrow"><span /> Match intelligence lab</p><p className="demo-label">Demo data · Premier League</p></div>
        <div className="match-header">
          <div><p className="match-date">Sunday, 24 August · Full time</p><h1>Arsenal <em>2 — 1</em> Liverpool</h1><p className="venue">Emirates Stadium · London</p></div>
          <div className="model-chip"><span>MODEL</span><strong>GoalCode xG v1.0</strong><i>Live</i></div>
        </div>

        <section className="metrics" aria-label="Match metrics">
          <article><p>Expected goals</p><div><strong>{totals.home.toFixed(2)}</strong><span className="bar"><i style={{ width: `${100 * totals.home / Math.max(.01, totals.home + totals.away)}%` }} /></span><strong className="away">{totals.away.toFixed(2)}</strong></div></article>
          <article><p>Total shots</p><div><strong>{totals.homeShots}</strong><span className="split">{shots.filter(s => s.result === 'Goal' || s.result === 'Saved').length} on target</span><strong className="away">{totals.awayShots}</strong></div></article>
          <article><p>Goals</p><div><strong>{shots.filter(s => s.team === 'home' && s.result === 'Goal').length}</strong><span className="split">Full time</span><strong className="away">{shots.filter(s => s.team === 'away' && s.result === 'Goal').length}</strong></div></article>
          <article><p>Field tilt</p><div><strong>58%</strong><span className="bar"><i style={{ width: '58%' }} /></span><strong className="away">42%</strong></div></article>
        </section>

        <section className="analysis-grid" id="analysis">
          <article className="panel pitch-panel">
            <div className="panel-heading">
              <div><p className="kicker">SHOT QUALITY</p><h2>Where the chances came from</h2></div>
              <div className="filter-group" aria-label="Filter shots">
                {(['all', 'home', 'away'] as const).map(value => <button key={value} className={filter === value ? 'active' : ''} onClick={() => setFilter(value)}>{value === 'all' ? 'All' : value === 'home' ? 'Arsenal' : 'Liverpool'}</button>)}
              </div>
            </div>
            <div className="pitch-wrap">
              <div className="pitch" aria-label="Interactive shot map">
                <div className="halfway" /><div className="circle" /><div className="box left" /><div className="box right" /><div className="six left" /><div className="six right" /><div className="spot left" /><div className="spot right" />
                {visibleShots.map((shot) => <button key={shot.id} className={`shot ${shot.team} ${shot.result === 'Goal' ? 'goal' : ''} ${selected.id === shot.id ? 'selected' : ''}`} style={{ left: `${shot.left}%`, top: `${shot.top}%`, width: `${18 + shot.xg * 34}px`, height: `${18 + shot.xg * 34}px` }} onClick={() => setSelected(shot)} aria-label={`${shot.player}, ${shot.result}, ${shot.xg} xG`}>{shot.result === 'Goal' ? '●' : ''}</button>)}
              </div>
              <div className="shot-detail" aria-live="polite"><div><span className={`player-dot ${selected.team}`} /><strong>{selected.player}</strong></div><p>{selected.minute}&apos; · {selected.result}</p><strong>{selected.xg.toFixed(2)} <small>xG</small></strong></div>
            </div>
            <p className="hint">Circle size represents goal probability · Select any shot to inspect it</p>
          </article>

          <aside className="panel insight-panel">
            <div className="panel-heading"><div><p className="kicker">MATCH READ</p><h2>The story in numbers</h2></div></div>
            <div className="insight-score"><span>73</span><div><strong>Arsenal controlled the danger</strong><p>Intelligence score</p></div></div>
            <p className="summary">Arsenal created fewer speculative shots and more high-value chances inside the box. Liverpool’s threat peaked after half-time, but their final actions remained predictable.</p>
            <ul><li><span>01</span><p><strong>Decisive right channel</strong>42% of Arsenal’s xG came from attacks developed on the right.</p></li><li><span>02</span><p><strong>Better shot selection</strong>Average chance quality was nearly double Liverpool’s.</p></li><li><span>03</span><p><strong>Momentum swing</strong>Liverpool produced most of their threat between minutes 46–70.</p></li></ul>
          </aside>
        </section>

        <section className="lower-grid" id="players">
          <article className="panel momentum-panel">
            <div className="panel-heading"><div><p className="kicker">MOMENTUM</p><h2>Who was in control?</h2></div><p className="chart-key"><span /> Arsenal advantage</p></div>
            <div className="momentum-chart" aria-label="Match momentum by five-minute period">
              {momentum.map((value, index) => <div className="momentum-column" key={index}><i className={value > 0 ? 'positive' : 'negative'} style={{ height: `${Math.abs(value)}%`, top: value > 0 ? `${50 - Math.abs(value) / 2}%` : '50%' }} /><span>{index % 2 === 0 ? index * 5 : ''}</span></div>)}
            </div>
          </article>
          <article className="panel player-panel">
            <div className="panel-heading"><div><p className="kicker">PLAYER IMPACT</p><h2>Threat leaders</h2></div><span className="unit">xG + xA</span></div>
            {[['01','B. Saka','0.71','84'],['02','M. Salah','0.49','61'],['03','K. Havertz','0.43','48'],['04','L. Díaz','0.28','33']].map(row => <div className="player-row" key={row[0]}><span>{row[0]}</span><strong>{row[1]}</strong><i><b style={{ width: `${row[3]}%` }} /></i><em>{row[2]}</em></div>)}
          </article>
        </section>

        <section className="about-section">
          <p className="kicker">THE PROJECT</p>
          <h2>From raw events to a readable match story.</h2>
          <p>GoalCode is an interactive football analytics lab that turns shot and event data into expected-goals models, shot maps, momentum patterns, player impact rankings, and plain-language tactical insights. It is designed for analysts, coaches, scouts, journalists, and curious supporters who want to understand not only what happened—but why.</p>
          <div className="feature-list"><span>01 · Explore chances</span><span>02 · Compare teams</span><span>03 · Import data</span><span>04 · Explain the match</span></div>
        </section>
      </section>

      {showImport && <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowImport(false)}>
        <section className="import-modal" role="dialog" aria-modal="true" aria-labelledby="import-title" onMouseDown={e => e.stopPropagation()}>
          <button className="modal-close" aria-label="Close import dialog" onClick={() => setShowImport(false)}>×</button>
          <p className="kicker">MATCH DATA</p><h2 id="import-title">Import a shot map</h2>
          <p>Upload a CSV with one shot per row. GoalCode will instantly redraw the map and recalculate the xG totals.</p>
          <label className="dropzone"><strong>Choose a CSV file</strong><span>team, player, left, top, xg, result, minute</span><input type="file" accept=".csv,text/csv" onChange={importCsv} /></label>
          <a className="sample-link" href="/sample-shots.csv" download>↓ Download sample CSV</a>
          {fileMessage && <p className={`file-message ${fileMessage.includes('success') ? 'success' : ''}`}>{fileMessage}</p>}
        </section>
      </div>}
    </main>
  );
}
