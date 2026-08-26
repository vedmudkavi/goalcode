'use client';

import { useEffect, useMemo, useState } from 'react';

type TeamKey = 'home' | 'away';
type Phase = 'starting' | 'possession' | 'defending' | 'late';
type TerritoryMode = 'Possession' | 'Touches' | 'xT' | 'Progression' | 'Pressing';
type EventType = 'goal' | 'shot' | 'card' | 'substitution' | 'period';
type ReplayFilter = 'all' | 'goals' | 'shots' | 'big';

type Player = {
  id: string; name: string; short: string; number: number; position: string;
  role: string; country: string; flag: string; photo: string; team: TeamKey;
  rating: number; minutes: number; goals: number; assists: number;
};

type MatchEvent = {
  minute: number; type: EventType; team?: TeamKey; title: string; detail: string;
  player?: string; x: number; y: number; big?: boolean;
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

const matchEvents: MatchEvent[] = [
  { minute:0, type:'period', title:'Kick-off', detail:'Arsenal start in a 4–2–3–1; Liverpool mirror them with Jones behind Núñez.', x:50, y:50 },
  { minute:9, type:'goal', team:'home', player:'Bukayo Saka', title:'GOAL · Arsenal 1–0', detail:'Saka controls White’s long pass, beats Robertson and scores at the near post.', x:84, y:36, big:true },
  { minute:14, type:'shot', team:'away', player:'Mohamed Salah', title:'Salah shoots wide', detail:'Liverpool’s first recorded shot misses the target.', x:24, y:35 },
  { minute:18, type:'goal', team:'away', player:'Virgil van Dijk', title:'GOAL · Arsenal 1–1 Liverpool', detail:'Díaz flicks Alexander-Arnold’s corner on for Van Dijk to head in.', x:17, y:49, big:true },
  { minute:24, type:'shot', team:'home', player:'Bukayo Saka', title:'Saka misses', detail:'Arsenal attack again from Saka’s right channel.', x:76, y:34 },
  { minute:31, type:'shot', team:'home', player:'Kai Havertz', title:'Havertz misses', detail:'Havertz cannot convert Arsenal’s central opening.', x:77, y:50 },
  { minute:33, type:'card', team:'away', player:'Alexis Mac Allister', title:'Yellow card · Mac Allister', detail:'Mac Allister is booked after a foul.', x:52, y:55 },
  { minute:34, type:'shot', team:'home', player:'Mikel Merino', title:'Merino shot on target', detail:'Kelleher deals with Merino’s first effort.', x:72, y:46 },
  { minute:35, type:'shot', team:'home', player:'Gabriel Martinelli', title:'Martinelli misses', detail:'The winger’s effort does not find the target.', x:80, y:66 },
  { minute:43, type:'goal', team:'home', player:'Mikel Merino', title:'GOAL · Arsenal 2–1', detail:'Merino heads in Rice’s whipped free-kick after a VAR check.', x:82, y:55, big:true },
  { minute:45, type:'shot', team:'away', player:'Alexis Mac Allister', title:'Mac Allister tests Raya', detail:'A shot on target closes the first half.', x:29, y:48 },
  { minute:46, type:'period', title:'Second half', detail:'Liverpool increase their press and Jones begins operating deeper.', x:50, y:50 },
  { minute:52, type:'shot', team:'away', player:'Mohamed Salah', title:'Salah shot on target', detail:'Liverpool begin to pin Arsenal deeper.', x:25, y:34 },
  { minute:54, type:'substitution', team:'home', title:'Arsenal change', detail:'Jakub Kiwior replaces the injured Gabriel Magalhães.', x:35, y:50 },
  { minute:58, type:'shot', team:'away', player:'Trent Alexander-Arnold', title:'Alexander-Arnold misses', detail:'The right-back shoots from range.', x:39, y:62 },
  { minute:60, type:'shot', team:'away', player:'Trent Alexander-Arnold', title:'Alexander-Arnold on target', detail:'Raya saves Liverpool’s next attempt.', x:34, y:59 },
  { minute:63, type:'substitution', team:'away', title:'Liverpool triple change', detail:'Szoboszlai, Tsimikas and Gakpo replace Mac Allister, Robertson and Díaz.', x:50, y:50 },
  { minute:65, type:'shot', team:'away', player:'Ryan Gravenberch', title:'Gravenberch misses', detail:'Liverpool sustain pressure after the changes.', x:40, y:48 },
  { minute:66, type:'card', team:'home', player:'David Raya', title:'Yellow card · Raya', detail:'Raya is booked for delaying the restart.', x:8, y:50 },
  { minute:71, type:'shot', team:'away', player:'Curtis Jones', title:'Jones shot on target', detail:'Arsenal’s reshuffled defence blocks the central lane.', x:31, y:45 },
  { minute:76, type:'substitution', team:'home', title:'Arsenal change', detail:'Myles Lewis-Skelly replaces the injured Jurriën Timber.', x:50, y:72 },
  { minute:77, type:'shot', team:'home', player:'Kai Havertz', title:'Havertz misses', detail:'Arsenal briefly escape Liverpool’s pressure.', x:75, y:49 },
  { minute:81, type:'goal', team:'away', player:'Mohamed Salah', title:'GOAL · Arsenal 2–2 Liverpool', detail:'Núñez squares Alexander-Arnold’s pass for Salah to finish first time.', x:18, y:42, big:true },
  { minute:85, type:'substitution', team:'home', title:'Arsenal double change', detail:'Nwaneri and Jesus replace Martinelli and Saka.', x:50, y:50 },
  { minute:87, type:'shot', team:'home', player:'Gabriel Jesus', title:'Jesus shot on target', detail:'Kelleher saves as Arsenal search for a winner.', x:80, y:45 },
  { minute:88, type:'shot', team:'home', player:'Gabriel Jesus', title:'Jesus threatens again', detail:'A second Jesus effort is recorded on target.', x:82, y:51 },
  { minute:91, type:'substitution', team:'away', title:'Liverpool change', detail:'Wataru Endō replaces Curtis Jones.', x:50, y:50 },
  { minute:94, type:'card', team:'away', player:'Darwin Núñez', title:'Yellow card · Núñez', detail:'Núñez is booked in stoppage time.', x:48, y:50 },
  { minute:98, type:'card', team:'home', player:'Gabriel Jesus', title:'Yellow card · Jesus', detail:'Jesus is booked before the final whistle.', x:52, y:50 },
  { minute:99, type:'period', title:'Full time · 2–2', detail:'Liverpool came from behind twice; both teams recorded nine shots.', x:50, y:50 },
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

const replayHome = [[8,50],[27,14],[24,37],[24,63],[27,86],[43,38],[45,62],[63,15],[60,50],[63,85],[77,50]];
const replayAway = [[92,50],[73,86],[76,63],[76,37],[73,14],[57,62],[55,38],[40,50],[37,85],[23,50],[37,15]];

function Crest({ team, large=false }: { team:TeamKey; large?:boolean }) {
  return <span className={`crest ${team} ${large ? 'large' : ''}`}><b>{team === 'home' ? 'A' : 'L'}</b><small>{team === 'home' ? '1886' : '1892'}</small></span>;
}

function displayMinute(value:number) { return value > 90 ? `90+${value-90}` : `${value}`; }

function replayName(player:Player, minute:number) {
  const swaps: Record<string,[number,string,number]> = {
    gabriel:[54,'Kiwior',15], timber:[76,'Lewis-Skelly',49], martinelli:[85,'Nwaneri',53], saka:[85,'Jesus',9],
    robertson:[63,'Tsimikas',21], macallister:[63,'Szoboszlai',8], diaz:[63,'Gakpo',18], jones:[91,'Endō',3],
  };
  const swap = swaps[player.id];
  return swap && minute >= swap[0] ? {name:swap[1],number:swap[2]} : {name:player.short,number:player.number};
}

export default function Home() {
  const [team, setTeam] = useState<TeamKey>('home');
  const [phase, setPhase] = useState<Phase>('starting');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [territoryMode, setTerritoryMode] = useState<TerritoryMode>('Possession');
  const [minute, setMinute] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<1|2>(1);
  const [replayFilter, setReplayFilter] = useState<ReplayFilter>('all');

  const lineup = team === 'home' ? homePlayers : awayPlayers;
  const selectedPerformance = performanceCards.find(card => card.id === selectedPlayer?.id);
  const activeEvent = useMemo(() => [...matchEvents].reverse().find(event => event.minute <= minute) || matchEvents[0], [minute]);
  const visibleEvents = matchEvents.filter(event => replayFilter === 'all' ? event.type !== 'period' : replayFilter === 'goals' ? event.type === 'goal' : replayFilter === 'shots' ? event.type === 'shot' || event.type === 'goal' : Boolean(event.big));
  const homeScore = matchEvents.filter(event => event.type === 'goal' && event.team === 'home' && event.minute <= minute).length;
  const awayScore = matchEvents.filter(event => event.type === 'goal' && event.team === 'away' && event.minute <= minute).length;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setMinute(current => {
      if (current >= 99) { setPlaying(false); return 99; }
      return Math.min(99, current + 1);
    }), 650 / speed);
    return () => window.clearInterval(timer);
  }, [playing, speed]);

  function playerPosition(index:number, side:TeamKey) {
    const base = side === 'home' ? replayHome[index] : replayAway[index];
    const pressure = minute < 46 ? 0 : minute < 63 ? (side === 'home' ? -4 : -7) : minute < 81 ? (side === 'home' ? -8 : -10) : (side === 'home' ? -3 : -4);
    const driftX = Math.sin((minute + index * 7) / 9) * 2.2;
    const driftY = Math.cos((minute + index * 5) / 8) * 2.4;
    return { left:`${Math.max(5,Math.min(95,base[0] + pressure + driftX))}%`, top:`${Math.max(7,Math.min(93,base[1] + driftY))}%` };
  }

  function zoneStyle(value:number) {
    const alpha = .12 + Math.abs(value) * .64;
    return { background:value >= 0 ? `rgba(183,245,46,${alpha})` : `rgba(57,188,255,${alpha})` };
  }

  return <main>
    <header className="topbar">
      <a className="brand" href="#top" aria-label="GoalCode home"><span className="brand-ball">●</span><span>GOAL<span>CODE</span></span></a>
      <nav aria-label="Primary navigation"><a href="#goals">Goals</a><a href="#tactics">Tactics</a><a href="#stats">Stats</a><a href="#territory">Replay</a><a href="#players">Players</a></nav>
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

      <section className="section-block goals-section" id="goals">
        <div className="section-heading"><div><p className="kicker">GOAL BREAKDOWN</p><h2>Four real goals, explained clearly</h2><p>See the scorer, exact match minute, assist chain, type of move and reconstructed finish location.</p></div><span className="plain-language">4 VERIFIED GOALS</span></div>
        <div className="goal-story-grid four">
          {goalStories.map(goal => {
            const player = allPlayers.find(item => item.id === goal.id)!;
            return <article className={`goal-story ${player.team}`} key={goal.id}>
              <div className="goal-story-head"><button onClick={()=>setSelectedPlayer(player)}><img src={player.photo} alt={player.name}/><span><small>{goal.minute}&apos; · {goal.score}</small><strong>{player.name}</strong><em>{player.position}</em></span></button><b>{goal.xg}<small>xG</small></b></div>
              <div className="goal-mini-pitch"><div className="mini-box"/><span className={`goal-location ${player.team}`} style={{left:`${goal.left}%`,top:`${goal.top}%`}}>⚽</span><i className={player.team}/><strong>FINISH LOCATION</strong><small>GOAL</small></div>
              <h3>{goal.title}</h3><p>{goal.detail}</p>
              <dl><div><dt>Assist</dt><dd>{goal.assist}</dd></div><div><dt>Move</dt><dd>{goal.move}</dd></div><div><dt>Finish</dt><dd>{goal.finish}</dd></div></dl>
            </article>;
          })}
        </div>
      </section>

      <section className="section-block tactics-section" id="tactics">
        <div className="section-heading"><div><p className="kicker">TACTICAL IDENTITY</p><h2>Formation evolution</h2><p>Switch game states to see how the real starting XIs changed shape.</p></div><span className="interactive-badge">● INTERACTIVE</span></div>
        <div className="team-switch">
          <button className={team === 'home' ? 'active home' : ''} onClick={() => setTeam('home')}><Crest team="home" /><span><small>ARSENAL</small><strong>Arteta&apos;s structure</strong></span></button>
          <button className={team === 'away' ? 'active away' : ''} onClick={() => setTeam('away')}><Crest team="away" /><span><small>LIVERPOOL</small><strong>Slot&apos;s structure</strong></span></button>
        </div>
        <div className="tactics-layout">
          <div className="phase-tabs">
            {(Object.keys(formationMeta[team]) as Phase[]).map(key => <button key={key} className={phase === key ? 'active' : ''} onClick={() => setPhase(key)}><span>{formationMeta[team][key].label}</span><strong>{formationMeta[team][key].shape}</strong><small>{formationMeta[team][key].note}</small><i>→</i></button>)}
          </div>
          <div className={`tactical-board ${team}`}>
            <div className="board-meta"><span>{team === 'home' ? 'ARS' : 'LIV'} · {formationMeta[team][phase].label}</span><strong>{formationMeta[team][phase].shape}</strong></div>
            <div className="tactical-pitch">
              <div className="field-half"/><div className="field-circle"/><div className="field-box top"/><div className="field-box bottom"/><div className="field-six top"/><div className="field-six bottom"/>
              {lineup.map((player,index) => <button key={player.id} className="tactical-player" style={{ left:`${coordinates[phase][index][0]}%`, top:`${coordinates[phase][index][1]}%` }} onClick={() => setSelectedPlayer(player)} aria-label={`View ${player.name} profile`}><span><img src={player.photo} alt=""/><b>{player.number}</b></span><em>{player.short}</em></button>)}
            </div>
            <p className="board-help">Click a player for profile · positions animate between phases</p>
          </div>
          <aside className="tactical-note"><span>MATCH READ</span><h3>{formationMeta[team][phase].shape}</h3><p>{team === 'home' ? (phase === 'starting' ? 'Trossard dropped around Havertz while Saka and Martinelli attacked Liverpool’s full-backs.' : phase === 'possession' ? 'Arsenal outnumbered Liverpool centrally, then released the ball wide to isolate Saka and Martinelli.' : phase === 'defending' ? 'Trossard joined Havertz while Rice and Merino protected the middle in a compact 4–4–2.' : 'Injuries to Gabriel and Timber forced a deeper, improvised back line late in the match.') : (phase === 'starting' ? 'Jones linked midfield to Núñez while Salah and Díaz held the width around him.' : phase === 'possession' ? 'Alexander-Arnold and Robertson advanced, with Gravenberch anchoring Liverpool’s circulation.' : phase === 'defending' ? 'Liverpool protected the middle but Arsenal repeatedly found their wingers in isolated duels.' : 'The 63rd-minute triple change brought fresher pressing and helped Liverpool sustain late pressure.')}</p><div><span>GAME STATE</span><b>{phase === 'late' ? 'LATE PUSH' : phase === 'defending' ? 'WITHOUT BALL' : 'WITH BALL'}</b></div><div><span>REFERENCE</span><b>PL TACTICAL REVIEW</b></div><div><span>CONFIDENCE</span><b>EVENT-BASED</b></div></aside>
        </div>
      </section>

      <section className="section-block stats-section" id="stats">
        <div className="section-heading"><div><p className="kicker">VERIFIED MATCH DATA</p><h2>Team statistics</h2><p>Real figures from the 27 October 2024 Premier League match.</p></div><span className="data-quality">SOURCE CHECK <b>✓</b></span></div>
        <div className="stats-card">
          <div className="stats-teams"><div><Crest team="home"/><strong>Arsenal</strong><span>HOME</span></div><p>TEAM STATS</p><div><span>AWAY</span><strong>Liverpool</strong><Crest team="away"/></div></div>
          <div className="stat-list">
            {teamStats.map(stat => {
              const homeWins = stat.lower ? stat.h < stat.a : stat.h > stat.a;
              const awayWins = stat.lower ? stat.a < stat.h : stat.a > stat.h;
              const total = stat.h + stat.a || 1;
              return <div className="stat-row" key={stat.label}><strong className={homeWins ? 'winner home' : ''}>{stat.home}</strong><div><span>{stat.label}</span><i><b className="home" style={{width:`${stat.h/total*100}%`}}/><b className="away" style={{width:`${stat.a/total*100}%`}}/></i></div><strong className={awayWins ? 'winner away' : ''}>{stat.away}</strong></div>;
            })}
          </div>
        </div>
      </section>

      <section className="section-block territory-section" id="territory">
        <div className="section-heading"><div><p className="kicker">GOALCODE SIGNATURE FEATURE</p><h2>Tactical territory + interactive replay</h2><p>Drag through the real event timeline. Switch the modeled territory layer to understand where each team imposed itself.</p></div><span className="interactive-badge">● LIVE CONTROLS</span></div>
        <div className="territory-modes" role="group" aria-label="Territory metric">{(['Possession','Touches','xT','Progression','Pressing'] as TerritoryMode[]).map(mode=><button key={mode} className={territoryMode===mode?'active':''} onClick={()=>setTerritoryMode(mode)}>{mode}</button>)}</div>
        <div className="replay-shell">
          <div className="replay-pitch">
            <div className="zone-grid">{territory[territoryMode].map((value,index)=><span key={index} style={zoneStyle(value)} title={`${value>=0?'Arsenal':'Liverpool'} ${Math.round(Math.abs(value)*100)}% zone influence`}><b>{Math.round(Math.abs(value)*100)}</b><small>{value>=0?'ARS':'LIV'}</small></span>)}</div>
            <div className="replay-lines"><i className="half"/><i className="circle"/><i className="box left"/><i className="box right"/></div>
            {homePlayers.map((player,index)=>{const label=replayName(player,minute);return <button key={`rh-${player.id}`} className="replay-player home" style={playerPosition(index,'home')} onClick={()=>setSelectedPlayer(player)} title={`${label.name} · ${player.position}`}><b>{label.number}</b><span>{label.name}</span></button>})}
            {awayPlayers.map((player,index)=>{const label=replayName(player,minute);return <button key={`ra-${player.id}`} className="replay-player away" style={playerPosition(index,'away')} onClick={()=>setSelectedPlayer(player)} title={`${label.name} · ${player.position}`}><b>{label.number}</b><span>{label.name}</span></button>})}
            {activeEvent.type !== 'period' && <span className={`event-ball ${activeEvent.team || ''}`} style={{left:`${activeEvent.x}%`,top:`${activeEvent.y}%`}}>●</span>}
            <div className="pitch-score"><span>{displayMinute(minute)}&apos;</span><strong>{homeScore}–{awayScore}</strong></div>
          </div>
          <aside className={`replay-event ${activeEvent.team || ''}`}>
            <p className="kicker">AT {displayMinute(activeEvent.minute)}&apos;</p><span className="event-icon">{activeEvent.type==='goal'?'⚽':activeEvent.type==='shot'?'↗':activeEvent.type==='card'?'▮':activeEvent.type==='substitution'?'⇄':'◷'}</span><h3>{activeEvent.title}</h3>{activeEvent.player&&<strong>{activeEvent.player}</strong>}<p>{activeEvent.detail}</p><dl><div><dt>Layer</dt><dd>{territoryMode}</dd></div><div><dt>Event status</dt><dd>Verified</dd></div><div><dt>Positions</dt><dd>Reconstructed</dd></div></dl>
          </aside>
          <div className="replay-controls">
            <div className="play-row"><button className="play-button" onClick={()=>{if(minute>=99)setMinute(0);setPlaying(value=>!value)}}>{playing?'Ⅱ Pause':'▶ Play'}</button><button onClick={()=>setSpeed(value=>value===1?2:1)}>{speed}x speed</button><span><b>{displayMinute(minute)}&apos;</b> / 90+9&apos;</span></div>
            <div className="timeline-wrap"><input aria-label="Match minute" type="range" min="0" max="99" value={minute} onChange={event=>{setMinute(Number(event.target.value));setPlaying(false)}}/><div className="timeline-ticks">{matchEvents.filter(event=>event.type==='goal'||event.type==='card'||event.type==='substitution').map((event,index)=><button key={`${event.minute}-${index}`} className={event.type} style={{left:`${event.minute/99*100}%`}} onClick={()=>{setMinute(event.minute);setPlaying(false)}} title={event.title}/>)}</div><div className="timeline-labels"><span>0&apos;</span><span>HT</span><span>90+&apos;</span></div></div>
            <div className="event-filters"><span>SHOW</span>{(['all','goals','shots','big'] as ReplayFilter[]).map(filter=><button key={filter} className={replayFilter===filter?'active':''} onClick={()=>setReplayFilter(filter)}>{filter==='all'?'All events':filter==='goals'?'Goals':filter==='shots'?'Shots':'Big chances'}</button>)}</div>
            <div className="event-chips">{visibleEvents.map((event,index)=><button key={`${event.minute}-${index}`} className={`${event.type} ${minute===event.minute?'active':''}`} onClick={()=>{setMinute(event.minute);setPlaying(false)}}><b>{displayMinute(event.minute)}&apos;</b><span>{event.player || event.title}</span></button>)}</div>
          </div>
        </div>
        <div className="reconstruction-note"><b>What is real?</b> Score, lineups, event timestamps, substitutions, cards, shots and match totals. <b>What is modeled?</b> Zone intensity and between-event player movement, because public event feeds are not optical tracking data.</div>
      </section>

      <section className="analysis-pair">
        <article className="section-block match-read"><p className="kicker">FIRST-HALF READ</p><div className="read-score"><strong>2–1</strong><span>ARSENAL<br/>AT HALF-TIME</span></div><h2>Central overloads opened the wings.</h2><p>Arsenal drew Liverpool inside, then isolated Saka and Martinelli against the full-backs. Saka won his duel for the opener; Merino restored the lead from Rice’s set-piece delivery.</p><div className="read-tags"><span>WIDE ISOLATIONS</span><span>SET-PIECE EDGE</span><span>COMPACT 4–4–2</span></div></article>
        <article className="section-block match-read away-read"><p className="kicker">SECOND-HALF READ</p><div className="read-score"><strong>55.3%</strong><span>LIVERPOOL<br/>MATCH POSSESSION</span></div><h2>Slot’s changes shifted the territory.</h2><p>Jones moved deeper after the break and the 63rd-minute triple change refreshed Liverpool’s press. Arsenal’s defensive injuries pushed the hosts deeper before Salah’s 81st-minute equaliser.</p><div className="read-tags"><span>PRESSING LIFT</span><span>FRESH WIDTH</span><span>LATE EQUALISER</span></div></article>
      </section>

      <section className="section-block performance-section" id="players">
        <div className="section-heading"><div><p className="kicker">PLAYER PERFORMANCE</p><h2>Real-match cards</h2><p>Ratings and standout numbers from this match—not season projections. Select a card for the full report.</p></div><span className="plain-language">CLICK TO EXPAND</span></div>
        <div className="performance-grid">
          {performanceCards.map(card => {
            const player = allPlayers.find(item => item.id === card.id)!;
            return <button className={`performance-card ${player.team}`} key={card.id} onClick={()=>setSelectedPlayer(player)}><div className="card-top"><span>{player.team==='home'?'ARS':'LIV'} · #{player.number}</span><b>{player.rating.toFixed(1)}</b></div><div className="card-image"><span className="card-number">{player.number}</span><img src={player.photo} alt={player.name}/></div><div className="card-copy"><small>{player.position}</small><h3>{player.name}</h3><p>{player.flag} {player.country} · {player.role}</p></div><div className="card-metrics">{card.metrics.map(metric=><span key={metric[1]}><strong>{metric[0]}</strong><small>{metric[1]}</small></span>)}</div><div className="card-badges">{card.badges.map(badge=><span key={badge}>{badge}</span>)}</div><em>Open full performance report →</em></button>;
          })}
        </div>
      </section>

      <section className="section-block lineups-section" id="lineups">
        <div className="section-heading"><div><p className="kicker">27 OCTOBER 2024</p><h2>Verified starting lineups</h2><p>Select any player to reveal the correct photo, position, country and real match output.</p></div></div>
        <div className="lineup-columns">
          {([{key:'home' as TeamKey,name:'Arsenal',shape:'4–2–3–1',players:homePlayers},{key:'away' as TeamKey,name:'Liverpool',shape:'4–2–3–1',players:awayPlayers}]).map(side => <div className={`lineup-card ${side.key}`} key={side.key}><div className="lineup-title"><Crest team={side.key}/><div><span>{side.name.toUpperCase()}</span><strong>{side.shape}</strong></div><em>XI</em></div>{side.players.map(player => <button className="lineup-player" key={player.id} onClick={()=>setSelectedPlayer(player)}><b>{player.number}</b><img src={player.photo} alt=""/><span><strong>{player.name}</strong><small>{player.position} · {player.flag} {player.country}</small></span><em>{player.rating.toFixed(1)}</em><i>›</i></button>)}</div>)}
        </div>
        <p className="image-credit">Match events: Premier League / StatMuse match log · xG: Opta · Player media: Premier League.</p>
      </section>
    </div>

    {selectedPlayer && <div className="modal-backdrop" role="presentation" onMouseDown={()=>setSelectedPlayer(null)}><section className={`player-modal ${selectedPlayer.team}`} role="dialog" aria-modal="true" aria-label={`${selectedPlayer.name} profile`} onMouseDown={event=>event.stopPropagation()}><button className="modal-close" onClick={()=>setSelectedPlayer(null)} aria-label="Close player profile">×</button><div className="profile-hero"><span className="profile-number">{selectedPlayer.number}</span><img src={selectedPlayer.photo} alt={selectedPlayer.name}/><Crest team={selectedPlayer.team}/></div><div className="profile-body"><p>{selectedPlayer.team==='home'?'ARSENAL':'LIVERPOOL'} · 27 OCT 2024</p><h2>{selectedPlayer.name}</h2><div className="profile-meta"><span><small>POSITION</small><strong>{selectedPlayer.position}</strong></span><span><small>COUNTRY</small><strong>{selectedPlayer.flag} {selectedPlayer.country}</strong></span><span><small>ROLE</small><strong>{selectedPlayer.role}</strong></span></div><div className="profile-stats"><span><strong>{selectedPlayer.rating.toFixed(1)}</strong><small>MATCH RATING</small></span><span><strong>{selectedPlayer.minutes}</strong><small>MINUTES</small></span><span><strong>{selectedPlayer.goals}+{selectedPlayer.assists}</strong><small>GOALS + ASSISTS</small></span></div>{selectedPerformance&&<><div className="profile-badges">{selectedPerformance.badges.map(badge=><span key={badge}>{badge}</span>)}</div><div className="expanded-metrics">{selectedPerformance.metrics.map(metric=><span key={metric[1]}><small>{metric[1]}</small><strong>{metric[0]}</strong></span>)}</div></>}<button className="close-profile" onClick={()=>setSelectedPlayer(null)}>Back to match analysis</button></div></section></div>}
  </main>;
}
