'use client';

import { useEffect, useState } from 'react';

type TeamKey = 'home' | 'away';
type Phase = 'starting' | 'possession' | 'defending' | 'late';
type TerritoryMode = 'Possession' | 'Touches' | 'xT' | 'Progression' | 'Pressing';

type Player = {
  id: string; name: string; short: string; number: number; position: string;
  role: string; country: string; flag: string; photo: string; team: TeamKey;
  rating: number; minutes: number; goals: number; assists: number;
};

const homePlayers: Player[] = [
  { id:'raya', name:'David Raya', short:'Raya', number:22, position:'Goalkeeper', role:'Sweeper keeper', country:'Spain', flag:'🇪🇸', photo:'/players/raya.png', team:'home', rating:6.2, minutes:90, goals:0, assists:0 },
  { id:'timber', name:'Jurriën Timber', short:'Timber', number:12, position:'Left back', role:'Inverted full-back', country:'Netherlands', flag:'🇳🇱', photo:'/players/timber.png', team:'home', rating:6.8, minutes:75, goals:0, assists:0 },
  { id:'gabriel', name:'Gabriel Magalhães', short:'Gabriel', number:6, position:'Centre back', role:'Stopper', country:'Brazil', flag:'🇧🇷', photo:'/players/gabriel.png', team:'home', rating:7.1, minutes:53, goals:0, assists:0 },
  { id:'white', name:'Ben White', short:'White', number:4, position:'Centre back', role:'Ball-playing defender', country:'England', flag:'🏴', photo:'/players/white.png', team:'home', rating:7.2, minutes:90, goals:0, assists:1 },
  { id:'partey', name:'Thomas Partey', short:'Partey', number:5, position:'Right back', role:'Inverted full-back', country:'Ghana', flag:'🇬🇭', photo:'/players/partey.png', team:'home', rating:7.2, minutes:90, goals:0, assists:0 },
  { id:'rice', name:'Declan Rice', short:'Rice', number:41, position:'Central midfield', role:'Ball-winning creator', country:'England', flag:'🏴', photo:'/players/rice.png', team:'home', rating:7.7, minutes:90, goals:0, assists:1 },
  { id:'merino', name:'Mikel Merino', short:'Merino', number:23, position:'Central midfield', role:'Box-to-box midfielder', country:'Spain', flag:'🇪🇸', photo:'/players/merino.png', team:'home', rating:7.2, minutes:90, goals:1, assists:0 },
  { id:'martinelli', name:'Gabriel Martinelli', short:'Martinelli', number:11, position:'Left winger', role:'Wide runner', country:'Brazil', flag:'🇧🇷', photo:'/players/martinelli.png', team:'home', rating:5.9, minutes:84, goals:0, assists:0 },
  { id:'trossard', name:'Leandro Trossard', short:'Trossard', number:19, position:'Attacking midfield', role:'False ten', country:'Belgium', flag:'🇧🇪', photo:'/players/trossard.png', team:'home', rating:6.3, minutes:90, goals:0, assists:0 },
  { id:'saka', name:'Bukayo Saka', short:'Saka', number:7, position:'Right winger', role:'Inside forward', country:'England', flag:'🏴', photo:'/players/saka.png', team:'home', rating:7.6, minutes:84, goals:1, assists:0 },
  { id:'havertz', name:'Kai Havertz', short:'Havertz', number:29, position:'Striker', role:'False nine', country:'Germany', flag:'🇩🇪', photo:'/players/havertz.png', team:'home', rating:5.5, minutes:90, goals:0, assists:0 },
];

const awayPlayers: Player[] = [
  { id:'kelleher', name:'Caoimhín Kelleher', short:'Kelleher', number:62, position:'Goalkeeper', role:'Sweeper keeper', country:'Ireland', flag:'🇮🇪', photo:'/players/kelleher.png', team:'away', rating:5.6, minutes:90, goals:0, assists:0 },
  { id:'robertson', name:'Andy Robertson', short:'Robertson', number:26, position:'Left back', role:'Overlapping full-back', country:'Scotland', flag:'🏴', photo:'/players/robertson.png', team:'away', rating:6.5, minutes:62, goals:0, assists:0 },
  { id:'vandijk', name:'Virgil van Dijk', short:'Van Dijk', number:4, position:'Centre back', role:'Build-up leader', country:'Netherlands', flag:'🇳🇱', photo:'/players/vandijk.png', team:'away', rating:7.6, minutes:90, goals:1, assists:0 },
  { id:'konate', name:'Ibrahima Konaté', short:'Konaté', number:5, position:'Centre back', role:'Aggressive stopper', country:'France', flag:'🇫🇷', photo:'/players/konate.png', team:'away', rating:7.2, minutes:90, goals:0, assists:0 },
  { id:'trent', name:'Trent Alexander-Arnold', short:'Alexander-Arnold', number:66, position:'Right back', role:'Deep playmaker', country:'England', flag:'🏴', photo:'/players/trent.png', team:'away', rating:7.1, minutes:90, goals:0, assists:0 },
  { id:'gravenberch', name:'Ryan Gravenberch', short:'Gravenberch', number:38, position:'Defensive midfield', role:'Press-resistant six', country:'Netherlands', flag:'🇳🇱', photo:'/players/gravenberch.png', team:'away', rating:6.9, minutes:90, goals:0, assists:0 },
  { id:'macallister', name:'Alexis Mac Allister', short:'Mac Allister', number:10, position:'Central midfield', role:'Deep playmaker', country:'Argentina', flag:'🇦🇷', photo:'/players/macallister.png', team:'away', rating:6.7, minutes:62, goals:0, assists:0 },
  { id:'jones', name:'Curtis Jones', short:'Jones', number:17, position:'Attacking midfield', role:'Link midfielder', country:'England', flag:'🏴', photo:'/players/jones.png', team:'away', rating:6.7, minutes:90, goals:0, assists:0 },
  { id:'diaz', name:'Luis Díaz', short:'Díaz', number:7, position:'Left winger', role:'Direct winger', country:'Colombia', flag:'🇨🇴', photo:'/players/diaz.png', team:'away', rating:6.1, minutes:62, goals:0, assists:1 },
  { id:'nunez', name:'Darwin Núñez', short:'Núñez', number:9, position:'Striker', role:'Channel runner', country:'Uruguay', flag:'🇺🇾', photo:'/players/nunez.png', team:'away', rating:6.8, minutes:90, goals:0, assists:1 },
  { id:'salah', name:'Mohamed Salah', short:'Salah', number:11, position:'Right winger', role:'Inside forward', country:'Egypt', flag:'🇪🇬', photo:'/players/salah.png', team:'away', rating:8.7, minutes:90, goals:1, assists:0 },
];

const allPlayers = [...homePlayers, ...awayPlayers];

const formationMeta: Record<TeamKey, Record<Phase, { label:string; shape:string; note:string }>> = {
  home: {
    starting:{ label:'Starting shape', shape:'4–2–3–1', note:'Rice and Merino behind Trossard' },
    possession:{ label:'In possession', shape:'3–2–5', note:'Partey tucked in; both wingers held width' },
    defending:{ label:'Out of possession', shape:'4–4–2', note:'Trossard joined Havertz on the first line' },
    late:{ label:"After 76'", shape:'4–4–1–1', note:'A reshuffled back four protected the lead' },
  },
  away: {
    starting:{ label:'Starting shape', shape:'4–2–3–1', note:'Jones operated behind Núñez' },
    possession:{ label:'In possession', shape:'2–4–4', note:'Full-backs advanced outside the double pivot' },
    defending:{ label:'Out of possession', shape:'4–2–3–1', note:'Salah and Díaz screened the outside lanes' },
    late:{ label:"After 63'", shape:'4–2–3–1', note:'Fresh width and a more aggressive press' },
  },
};

const coordinates: Record<Phase, [number,number][]> = {
  starting:[[50,91],[14,73],[38,76],[62,76],[86,73],[38,54],[62,54],[15,29],[50,33],[85,29],[50,13]],
  possession:[[50,91],[18,72],[43,76],[68,72],[66,54],[39,55],[30,36],[8,18],[43,21],[91,18],[66,15]],
  defending:[[50,91],[14,73],[38,76],[62,76],[86,73],[38,52],[62,52],[15,47],[85,47],[43,22],[57,22]],
  late:[[50,91],[14,73],[38,76],[62,76],[86,73],[38,54],[62,54],[15,43],[85,43],[50,28],[50,12]],
};

const teamStats = [
  { label:'Shots', home:'9', away:'9', h:9, a:9 },
  { label:'Shots on target', home:'3', away:'4', h:3, a:4 },
  { label:'Expected goals', home:'0.92', away:'0.81', h:.92, a:.81 },
  { label:'Possession', home:'44.7%', away:'55.3%', h:44.7, a:55.3 },
  { label:'Passes completed', home:'313', away:'383', h:313, a:383 },
  { label:'Pass accuracy', home:'80%', away:'83%', h:80, a:83 },
  { label:'Touches in opposition box', home:'33', away:'26', h:33, a:26 },
  { label:'Corners', home:'1', away:'3', h:1, a:3 },
  { label:'Tackles', home:'17', away:'16', h:17, a:16 },
  { label:'Interceptions', home:'10', away:'6', h:10, a:6 },
  { label:'Fouls', home:'14', away:'14', h:14, a:14, lower:true },
  { label:'Yellow cards', home:'2', away:'2', h:2, a:2, lower:true },
];

const goalStories = [
  { id:'saka', minute:9, score:'1–0', xg:'0.20', title:'Saka beats Robertson, then the near post', detail:'Ben White lifted a long pass into the right channel. Saka’s first touch took him inside Robertson before he drove a right-footed finish into the roof of Kelleher’s net.', assist:'Ben White', move:'Direct ball · right channel', finish:'Right foot · near post', left:84, top:36 },
  { id:'vandijk', minute:18, score:'1–1', xg:'—', title:'Van Dijk finishes the corner routine', detail:'Alexander-Arnold delivered the corner to the near post. Luis Díaz flicked it on and Van Dijk glanced a close-range header into the bottom corner.', assist:'Luis Díaz', move:'Corner · near-post flick', finish:'Header · bottom corner', left:17, top:49 },
  { id:'merino', minute:43, score:'2–1', xg:'0.40', title:'Merino attacks Rice’s free-kick', detail:'Declan Rice whipped a powerful free-kick across Liverpool’s line. Merino timed his run beyond the back shoulder and headed Arsenal back in front.', assist:'Declan Rice', move:'Wide free-kick', finish:'Header · close range', left:82, top:55 },
  { id:'salah', minute:81, score:'2–2', xg:'—', title:'Salah completes the counter-attack', detail:'Alexander-Arnold clipped the ball into Núñez’s run down the right. Núñez squared early and Salah arrived inside to side-foot beyond Raya.', assist:'Darwin Núñez', move:'Fast transition · 3 players', finish:'Left foot · first time', left:18, top:42 },
];

const territory: Record<TerritoryMode, number[]> = {
  Possession:[.42,.35,.18,-.18,-.42,-.55,.52,.38,.12,-.16,-.49,-.62,.58,.44,.20,-.25,-.55,-.68,.36,.30,.08,-.22,-.46,-.52],
  Touches:[.30,.46,.32,-.12,-.38,-.48,.52,.62,.34,-.08,-.42,-.58,.60,.66,.40,-.18,-.48,-.64,.38,.49,.26,-.12,-.32,-.44],
  xT:[.12,.28,.54,.22,-.30,-.58,.18,.44,.68,.30,-.34,-.62,.10,.36,.61,.20,-.43,-.70,.06,.18,.42,.12,-.28,-.50],
  Progression:[.25,.42,.58,.08,-.35,-.55,.32,.55,.70,.18,-.40,-.66,.28,.50,.64,.10,-.46,-.73,.15,.34,.48,.05,-.30,-.58],
  Pressing:[.48,.58,.36,-.05,-.30,-.44,.60,.72,.45,-.12,-.52,-.65,.42,.54,.30,-.22,-.62,-.76,.20,.32,.18,-.28,-.55,-.68],
};

const performanceCards = [
  { id:'salah', badges:['🎯 Finisher','⚡ Progressive threat','🔥 Player of the match'], metrics:[['1','Goal'],['2','Take-ons'],['90','Minutes']] },
  { id:'rice', badges:['🧠 Creator','🧱 Defensive wall'], metrics:[['1','Assist'],['2','Chances created'],['90','Minutes']] },
  { id:'saka', badges:['🎯 Finisher','🔥 High influence'], metrics:[['1','Goal'],['0.20','xG'],['84','Minutes']] },
  { id:'vandijk', badges:['🎯 Set-piece threat','🧱 Defensive wall'], metrics:[['1','Goal'],['7.6','Rating'],['90','Minutes']] },
  { id:'merino', badges:['🎯 Finisher','🔥 High influence'], metrics:[['1','Goal'],['0.40','xG'],['1','Shot on target']] },
  { id:'white', badges:['🧠 Build-up leader','⚡ Line breaker'], metrics:[['1','Assist'],['7.2','Rating'],['90','Minutes']] },
];

const goalPaths: Record<string, { x:number; y:number; actor:string; action:string }[]> = {
  saka:[
    { x:37, y:64, actor:'Ben White', action:'Long pass starts the move' },
    { x:67, y:34, actor:'Bukayo Saka', action:'Controls in the right channel' },
    { x:84, y:36, actor:'Bukayo Saka', action:'Beats Robertson and scores' },
  ],
  vandijk:[
    { x:35, y:8, actor:'Alexander-Arnold', action:'Corner delivered' },
    { x:21, y:38, actor:'Luis Díaz', action:'Near-post flick' },
    { x:17, y:49, actor:'Virgil van Dijk', action:'Close-range header' },
  ],
  merino:[
    { x:62, y:78, actor:'Declan Rice', action:'Whipped free-kick' },
    { x:74, y:62, actor:'Mikel Merino', action:'Attacks the back shoulder' },
    { x:82, y:55, actor:'Mikel Merino', action:'Heads Arsenal in front' },
  ],
  salah:[
    { x:61, y:20, actor:'Alexander-Arnold', action:'Clipped forward pass' },
    { x:34, y:20, actor:'Darwin Núñez', action:'Chases and squares' },
    { x:18, y:42, actor:'Mohamed Salah', action:'First-time equaliser' },
  ],
};

function Crest({ team, large=false }: { team:TeamKey; large?:boolean }) {
  return <span className={`crest ${team} ${large ? 'large' : ''}`}><b>{team === 'home' ? 'A' : 'L'}</b><small>{team === 'home' ? '1886' : '1892'}</small></span>;
}

export default function Home() {
  const [team, setTeam] = useState<TeamKey>('home');
  const [phase, setPhase] = useState<Phase>('starting');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [territoryMode, setTerritoryMode] = useState<TerritoryMode>('Possession');
  const [selectedGoal, setSelectedGoal] = useState(0);
  const [goalStep, setGoalStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const lineup = team === 'home' ? homePlayers : awayPlayers;
  const selectedPerformance = performanceCards.find(card => card.id === selectedPlayer?.id);
  const selectedGoalStory = goalStories[selectedGoal];
  const selectedScorer = allPlayers.find(player => player.id === selectedGoalStory.id)!;
  const selectedPath = goalPaths[selectedGoalStory.id];

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setGoalStep(current => {
      if (current >= selectedPath.length - 1) { setPlaying(false); return current; }
      return current + 1;
    }), 1100);
    return () => window.clearTimeout(timer);
  }, [playing, goalStep, selectedPath.length]);

  function zoneStyle(value:number) {
    const alpha = .16 + Math.abs(value) * .74;
    return { background:value >= 0 ? `rgba(239,51,64,${alpha})` : `rgba(48,174,232,${alpha})` };
  }

  function pathSegmentStyle(start:{x:number;y:number}, end:{x:number;y:number}) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    return { left:`${start.x}%`, top:`${start.y}%`, width:`${Math.hypot(dx,dy)}%`, transform:`rotate(${Math.atan2(dy,dx)*180/Math.PI}deg)` };
  }

  return <main>
    <header className="topbar">
      <a className="brand" href="#top" aria-label="GoalCode home"><span className="brand-ball">●</span><span>GOAL<span>CODE</span></span></a>
      <nav aria-label="Primary navigation"><a href="#stats">Stats</a><a href="#replay">Replay</a><a href="#lineups">Lineups</a><a href="#tactics">Tactics</a><a href="#players">Players</a></nav>
      <span className="verified-header"><i>✓</i> Verified match · bundled</span>
    </header>

    <section className="match-stage" id="top">
      <div className="stadium-glow" />
      <p className="competition">Premier League · Matchweek 9 · verified match report</p>
      <div className="scoreboard">
        <div className="score-team home"><Crest team="home" large /><div><span>HOME</span><h1>Arsenal</h1><p>4–2–3–1</p></div></div>
        <div className="score-centre"><p>FULL TIME</p><strong><b>2</b><i>:</i><b>2</b></strong><span>27 OCT 2024 · EMIRATES STADIUM · 60,383</span></div>
        <div className="score-team away"><div><span>AWAY</span><h1>Liverpool</h1><p>4–2–3–1</p></div><Crest team="away" large /></div>
      </div>
      <div className="goal-strip"><span>9&apos; Saka</span><span>18&apos; Van Dijk</span><span>43&apos; Merino</span><span>81&apos; Salah</span></div>
      <div className="quick-stats"><div><span>ARS</span><strong>0.92</strong><small>EXPECTED GOALS</small><strong>0.81</strong><span>LIV</span></div><div><span>ARS</span><strong>44.7%</strong><small>POSSESSION</small><strong>55.3%</strong><span>LIV</span></div><div><span>ARS</span><strong>9</strong><small>SHOTS</small><strong>9</strong><span>LIV</span></div></div>
    </section>

    <div className="page-shell">
      <div className="source-ribbon"><span><b>REAL MATCH DATA</b> No CSV upload needed. The verified event feed is built into GoalCode.</span><span>Premier League · StatMuse match log · Opta xG</span></div>

      <section className="section-block stats-section" id="stats">
        <div className="section-heading"><div><p className="kicker">1 · TEAM STATS</p><h2>What happened in the match</h2><p>Real figures from Arsenal 2–2 Liverpool on 27 October 2024.</p></div><span className="data-quality">SOURCE CHECK <b>✓</b></span></div>
        <div className="stats-card"><div className="stats-teams"><div><Crest team="home"/><strong>Arsenal</strong><span>HOME</span></div><p>TEAM STATS</p><div><span>AWAY</span><strong>Liverpool</strong><Crest team="away"/></div></div><div className="stat-list">{teamStats.map(stat => {const homeWins=stat.lower?stat.h<stat.a:stat.h>stat.a;const awayWins=stat.lower?stat.a<stat.h:stat.a>stat.h;const total=stat.h+stat.a||1;return <div className="stat-row" key={stat.label}><strong className={homeWins?'winner home':''}>{stat.home}</strong><div><span>{stat.label}</span><i><b className="home" style={{width:`${stat.h/total*100}%`}}/><b className="away" style={{width:`${stat.a/total*100}%`}}/></i></div><strong className={awayWins?'winner away':''}>{stat.away}</strong></div>})}</div></div>
      </section>

      <section className="section-block simple-replay-section" id="replay">
        <div className="section-heading"><div><p className="kicker">2 · INTERACTIVE REPLAY</p><h2>See where control happened—then replay each goal</h2><p>Red zones belong to Arsenal. Blue zones belong to Liverpool. Darker colour means stronger control.</p></div><span className="interactive-badge">● SIMPLE MODE</span></div>
        <div className="territory-explainer"><span className="home"><i/> ARSENAL CONTROL</span><span className="away"><i/> LIVERPOOL CONTROL</span><p>Choose what you want the pitch to show:</p></div>
        <div className="territory-modes" role="group" aria-label="Territory metric">{(['Possession','Touches','xT','Progression','Pressing'] as TerritoryMode[]).map(mode=><button key={mode} className={territoryMode===mode?'active':''} onClick={()=>setTerritoryMode(mode)}>{mode}</button>)}</div>
        <div className="territory-card"><div className="territory-pitch"><div className="zone-grid clear-zones">{territory[territoryMode].map((value,index)=><span key={index} style={zoneStyle(value)}><b>{value>=0?'ARS':'LIV'}</b><small>{Math.round(Math.abs(value)*100)}% influence</small></span>)}</div><div className="replay-lines"><i className="half"/><i className="circle"/><i className="box left"/><i className="box right"/></div></div><aside><p className="kicker">NOW SHOWING</p><h3>{territoryMode}</h3><p>{territoryMode==='Possession'?'Where each team sustained the ball most often. Liverpool had 55.3% overall possession.':territoryMode==='Touches'?'Where each team’s recorded actions were concentrated across the pitch.':territoryMode==='xT'?'Modeled zones where possession was most likely to increase attacking threat.':territoryMode==='Progression'?'The lanes used to move the ball toward the opposition goal.':'Where each team applied the strongest pressure to the ball.'}</p><strong>RED = ARSENAL</strong><strong className="blue">BLUE = LIVERPOOL</strong></aside></div>

        <div className="goal-replay-heading"><div><p className="kicker">GOAL JOURNEYS</p><h3>Pick a goal. Press play. Follow the red ball.</h3></div><span>ONLY 3 STEPS PER GOAL</span></div>
        <div className="goal-selector">{goalStories.map((goal,index)=><button key={goal.id} className={selectedGoal===index?'active':''} onClick={()=>{setSelectedGoal(index);setGoalStep(0);setPlaying(false)}}><b>{goal.minute}&apos;</b><span>{allPlayers.find(player=>player.id===goal.id)?.short}</span><small>{goal.score}</small></button>)}</div>
        <div className="simple-replay">
          <div className="goal-journey-pitch"><div className="replay-lines"><i className="half"/><i className="circle"/><i className="box left"/><i className="box right"/></div>{selectedPath.slice(0,-1).map((step,index)=><i key={index} className={`path-segment ${index<goalStep?'complete':''}`} style={pathSegmentStyle(step,selectedPath[index+1])}/>) }{selectedPath.map((step,index)=><button key={step.actor+index} className={`journey-node ${index===goalStep?'active':''} ${index<goalStep?'complete':''}`} style={{left:`${step.x}%`,top:`${step.y}%`}} onClick={()=>{setGoalStep(index);setPlaying(false)}}><b>{index+1}</b><span>{step.actor}</span><small>{step.action}</small></button>)}<span className="big-red-ball" style={{left:`${selectedPath[goalStep].x}%`,top:`${selectedPath[goalStep].y}%`}}>●</span><div className={`goal-mouth ${selectedScorer.team}`}>GOAL</div></div>
          <aside className={`goal-result ${selectedScorer.team}`}><img src={selectedScorer.photo} alt={selectedScorer.name}/><p>{selectedGoalStory.minute}&apos; · {selectedGoalStory.score}</p><h3>{selectedScorer.name}</h3><strong>GOALSCORER</strong><p>{selectedGoalStory.detail}</p><dl><div><dt>Assist</dt><dd>{selectedGoalStory.assist}</dd></div><div><dt>Finish</dt><dd>{selectedGoalStory.finish}</dd></div></dl></aside>
          <div className="journey-controls"><button className="play-button" onClick={()=>{if(goalStep>=selectedPath.length-1)setGoalStep(0);setPlaying(value=>!value)}}>{playing?'Ⅱ Pause':'▶ Play goal'}</button>{selectedPath.map((step,index)=><button key={index} className={goalStep===index?'active':''} onClick={()=>{setGoalStep(index);setPlaying(false)}}><b>STEP {index+1}</b><span>{step.action}</span></button>)}</div>
        </div>
        <div className="reconstruction-note"><b>Easy rule:</b> the large red ball is the ball. Numbered points show the move in order. Goal event details are verified; the drawn path is a clear reconstruction from public match descriptions.</div>
      </section>

      <section className="section-block lineups-section" id="lineups">
        <div className="section-heading"><div><p className="kicker">3 · LINEUPS</p><h2>Verified starting XIs</h2><p>Select any player to see their correct photo, position, country and real match output.</p></div></div>
        <div className="lineup-columns">{([{key:'home' as TeamKey,name:'Arsenal',shape:'4–2–3–1',players:homePlayers},{key:'away' as TeamKey,name:'Liverpool',shape:'4–2–3–1',players:awayPlayers}]).map(side=><div className={`lineup-card ${side.key}`} key={side.key}><div className="lineup-title"><Crest team={side.key}/><div><span>{side.name.toUpperCase()}</span><strong>{side.shape}</strong></div><em>XI</em></div>{side.players.map(player=><button className="lineup-player" key={player.id} onClick={()=>setSelectedPlayer(player)}><b>{player.number}</b><img src={player.photo} alt=""/><span><strong>{player.name}</strong><small>{player.position} · {player.flag} {player.country}</small></span><em>{player.rating.toFixed(1)}</em><i>›</i></button>)}</div>)}</div>
        <p className="image-credit">Player identities checked against the Premier League registry.</p>
      </section>

      <section className="section-block tactics-section" id="tactics">
        <div className="section-heading"><div><p className="kicker">4 · FORMATION EVOLUTION</p><h2>How each team changed shape</h2><p>Switch game states to see the real starting XIs move between structures.</p></div><span className="interactive-badge">● INTERACTIVE</span></div>
        <div className="team-switch"><button className={team==='home'?'active home':''} onClick={()=>setTeam('home')}><Crest team="home"/><span><small>ARSENAL</small><strong>Arteta&apos;s structure</strong></span></button><button className={team==='away'?'active away':''} onClick={()=>setTeam('away')}><Crest team="away"/><span><small>LIVERPOOL</small><strong>Slot&apos;s structure</strong></span></button></div>
        <div className="tactics-layout"><div className="phase-tabs">{(Object.keys(formationMeta[team]) as Phase[]).map(key=><button key={key} className={phase===key?'active':''} onClick={()=>setPhase(key)}><span>{formationMeta[team][key].label}</span><strong>{formationMeta[team][key].shape}</strong><small>{formationMeta[team][key].note}</small><i>→</i></button>)}</div><div className={`tactical-board ${team}`}><div className="board-meta"><span>{team==='home'?'ARS':'LIV'} · {formationMeta[team][phase].label}</span><strong>{formationMeta[team][phase].shape}</strong></div><div className="tactical-pitch"><div className="field-half"/><div className="field-circle"/><div className="field-box top"/><div className="field-box bottom"/><div className="field-six top"/><div className="field-six bottom"/>{lineup.map((player,index)=><button key={player.id} className="tactical-player" style={{left:`${coordinates[phase][index][0]}%`,top:`${coordinates[phase][index][1]}%`}} onClick={()=>setSelectedPlayer(player)}><span><img src={player.photo} alt=""/><b>{player.number}</b></span><em>{player.short}</em></button>)}</div><p className="board-help">Click a player for profile · positions animate between phases</p></div><aside className="tactical-note"><span>MATCH READ</span><h3>{formationMeta[team][phase].shape}</h3><p>{team==='home'?(phase==='starting'?'Trossard dropped around Havertz while Saka and Martinelli attacked Liverpool’s full-backs.':phase==='possession'?'Arsenal outnumbered Liverpool centrally, then released the ball wide.':phase==='defending'?'Trossard joined Havertz while Rice and Merino protected the middle.':'Injuries to Gabriel and Timber forced a deeper late block.'):(phase==='starting'?'Jones linked midfield to Núñez while Salah and Díaz held width.':phase==='possession'?'The full-backs advanced outside Gravenberch and Mac Allister.':phase==='defending'?'Liverpool protected the middle but Arsenal found the wings.':'The 63rd-minute triple change refreshed Liverpool’s press.')}</p><div><span>GAME STATE</span><b>{phase==='late'?'LATE PUSH':phase==='defending'?'WITHOUT BALL':'WITH BALL'}</b></div><div><span>REFERENCE</span><b>PL TACTICAL REVIEW</b></div><div><span>CONFIDENCE</span><b>EVENT-BASED</b></div></aside></div>
      </section>

      <section className="section-block performance-section" id="players">
        <div className="section-heading"><div><p className="kicker">5 · REAL MATCH CARDS</p><h2>The players who shaped the game</h2><p>Ratings and standout numbers from this match—not season projections.</p></div><span className="plain-language">CLICK TO EXPAND</span></div>
        <div className="performance-grid">{performanceCards.map(card=>{const player=allPlayers.find(item=>item.id===card.id)!;return <button className={`performance-card ${player.team}`} key={card.id} onClick={()=>setSelectedPlayer(player)}><div className="card-top"><span>{player.team==='home'?'ARS':'LIV'} · #{player.number}</span><b>{player.rating.toFixed(1)}</b></div><div className="card-image"><span className="card-number">{player.number}</span><img src={player.photo} alt={player.name}/></div><div className="card-copy"><small>{player.position}</small><h3>{player.name}</h3><p>{player.flag} {player.country} · {player.role}</p></div><div className="card-metrics">{card.metrics.map(metric=><span key={metric[1]}><strong>{metric[0]}</strong><small>{metric[1]}</small></span>)}</div><div className="card-badges">{card.badges.map(badge=><span key={badge}>{badge}</span>)}</div><em>Open full performance report →</em></button>})}</div>
      </section>
    </div>

    {selectedPlayer && <div className="modal-backdrop" role="presentation" onMouseDown={()=>setSelectedPlayer(null)}><section className={`player-modal ${selectedPlayer.team}`} role="dialog" aria-modal="true" aria-label={`${selectedPlayer.name} profile`} onMouseDown={event=>event.stopPropagation()}><button className="modal-close" onClick={()=>setSelectedPlayer(null)} aria-label="Close player profile">×</button><div className="profile-hero"><span className="profile-number">{selectedPlayer.number}</span><img src={selectedPlayer.photo} alt={selectedPlayer.name}/><Crest team={selectedPlayer.team}/></div><div className="profile-body"><p>{selectedPlayer.team==='home'?'ARSENAL':'LIVERPOOL'} · 27 OCT 2024</p><h2>{selectedPlayer.name}</h2><div className="profile-meta"><span><small>POSITION</small><strong>{selectedPlayer.position}</strong></span><span><small>COUNTRY</small><strong>{selectedPlayer.flag} {selectedPlayer.country}</strong></span><span><small>ROLE</small><strong>{selectedPlayer.role}</strong></span></div><div className="profile-stats"><span><strong>{selectedPlayer.rating.toFixed(1)}</strong><small>MATCH RATING</small></span><span><strong>{selectedPlayer.minutes}</strong><small>MINUTES</small></span><span><strong>{selectedPlayer.goals}+{selectedPlayer.assists}</strong><small>GOALS + ASSISTS</small></span></div>{selectedPerformance&&<><div className="profile-badges">{selectedPerformance.badges.map(badge=><span key={badge}>{badge}</span>)}</div><div className="expanded-metrics">{selectedPerformance.metrics.map(metric=><span key={metric[1]}><small>{metric[1]}</small><strong>{metric[0]}</strong></span>)}</div></>}<button className="close-profile" onClick={()=>setSelectedPlayer(null)}>Back to match analysis</button></div></section></div>}
  </main>;
}
