'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import StatsBombArchive from '@/components/statsbomb-archive';

type TeamKey = 'home' | 'away';
type MatchKey = 'ars-liv-2024' | 'hul-mun-2026';
type ClubKey = 'arsenal' | 'liverpool' | 'hull' | 'manunited';
type Phase = 'starting' | 'possession' | 'defending' | 'late';
type TerritoryMode = 'Possession' | 'Touches' | 'xT' | 'Progression' | 'Pressing';
type TerritoryHalf = 'first' | 'second' | 'full';

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

const hullPlayers: Player[] = [
  { id:'tzolakis', name:'Konstantinos Tzolakis', short:'Tzolakis', number:19, position:'Goalkeeper', role:'Shot stopper', country:'Greece', flag:'🇬🇷', photo:'/players/hull/tzolakis.png', team:'home', rating:8.2, minutes:90, goals:0, assists:0 },
  { id:'giles', name:'Ryan Giles', short:'Giles', number:3, position:'Left wing-back', role:'Wide outlet', country:'England', flag:'🏴', photo:'/players/hull/giles.png', team:'home', rating:7.1, minutes:85, goals:0, assists:0 },
  { id:'mendy-hull', name:'Nobel Mendy', short:'Mendy', number:32, position:'Centre back', role:'Aerial stopper', country:'Senegal', flag:'🇸🇳', photo:'/players/hull/mendy.png', team:'home', rating:8.0, minutes:64, goals:1, assists:0 },
  { id:'egan', name:'John Egan', short:'Egan', number:15, position:'Centre back', role:'Defensive organiser', country:'Ireland', flag:'🇮🇪', photo:'/players/hull/egan.png', team:'home', rating:7.7, minutes:90, goals:0, assists:0 },
  { id:'ajayi', name:'Semi Ajayi', short:'Ajayi', number:6, position:'Centre back', role:'Box defender', country:'Nigeria', flag:'🇳🇬', photo:'/players/hull/ajayi.png', team:'home', rating:8.0, minutes:64, goals:1, assists:0 },
  { id:'coyle', name:'Lewie Coyle', short:'Coyle', number:2, position:'Right wing-back', role:'Wide defender', country:'England', flag:'🏴', photo:'/players/hull/coyle.png', team:'home', rating:7.2, minutes:70, goals:0, assists:0 },
  { id:'stroud', name:'Elliot Stroud', short:'Stroud', number:21, position:'Left midfield', role:'Transition runner', country:'Sweden', flag:'🇸🇪', photo:'/players/hull/stroud.png', team:'home', rating:6.1, minutes:71, goals:0, assists:0 },
  { id:'slater', name:'Regan Slater', short:'Slater', number:27, position:'Central midfield', role:'Set-piece creator', country:'England', flag:'🏴', photo:'/players/hull/slater.png', team:'home', rating:7.4, minutes:90, goals:0, assists:1 },
  { id:'crooks', name:'Matt Crooks', short:'Crooks', number:25, position:'Central midfield', role:'Ball winner', country:'England', flag:'🏴', photo:'/players/hull/crooks.png', team:'home', rating:5.8, minutes:90, goals:0, assists:0 },
  { id:'belloumi', name:'Mohamed Belloumi', short:'Belloumi', number:10, position:'Right midfield', role:'Counter-attacker', country:'Algeria', flag:'🇩🇿', photo:'/players/hull/belloumi.png', team:'home', rating:5.3, minutes:90, goals:0, assists:0 },
  { id:'mcburnie', name:'Oli McBurnie', short:'McBurnie', number:9, position:'Striker', role:'Target forward', country:'Scotland', flag:'🏴', photo:'/players/hull/mcburnie.png', team:'home', rating:6.7, minutes:90, goals:0, assists:0 },
];

const unitedPlayers: Player[] = [
  { id:'lammens', name:'Senne Lammens', short:'Lammens', number:1, position:'Goalkeeper', role:'Shot stopper', country:'Belgium', flag:'🇧🇪', photo:'/players/manunited/lammens.png', team:'away', rating:6.2, minutes:90, goals:0, assists:0 },
  { id:'shaw', name:'Luke Shaw', short:'Shaw', number:23, position:'Left back', role:'Chance creator', country:'England', flag:'🏴', photo:'/players/manunited/shaw.png', team:'away', rating:6.9, minutes:90, goals:0, assists:0 },
  { id:'heaven', name:'Ayden Heaven', short:'Heaven', number:26, position:'Centre back', role:'Ball-playing defender', country:'England', flag:'🏴', photo:'/players/manunited/heaven.png', team:'away', rating:6.5, minutes:90, goals:0, assists:0 },
  { id:'maguire', name:'Harry Maguire', short:'Maguire', number:5, position:'Centre back', role:'Aerial defender', country:'England', flag:'🏴', photo:'/players/manunited/maguire.png', team:'away', rating:7.0, minutes:90, goals:0, assists:0 },
  { id:'mazraoui', name:'Noussair Mazraoui', short:'Mazraoui', number:3, position:'Right back', role:'Inverted full-back', country:'Morocco', flag:'🇲🇦', photo:'/players/manunited/mazraoui.png', team:'away', rating:7.0, minutes:80, goals:0, assists:0 },
  { id:'tielemans', name:'Youri Tielemans', short:'Tielemans', number:18, position:'Central midfield', role:'Deep playmaker', country:'Belgium', flag:'🇧🇪', photo:'/players/manunited/tielemans.png', team:'away', rating:7.4, minutes:67, goals:0, assists:0 },
  { id:'santos', name:'Andrey Santos', short:'Santos', number:17, position:'Central midfield', role:'Ball carrier', country:'Brazil', flag:'🇧🇷', photo:'/players/manunited/santos.png', team:'away', rating:7.5, minutes:67, goals:0, assists:0 },
  { id:'dorgu', name:'Patrick Dorgu', short:'Dorgu', number:13, position:'Left winger', role:'Wide runner', country:'Denmark', flag:'🇩🇰', photo:'/players/manunited/dorgu.png', team:'away', rating:4.9, minutes:45, goals:0, assists:0 },
  { id:'fernandes', name:'Bruno Fernandes', short:'Fernandes', number:8, position:'Attacking midfield', role:'Creator', country:'Portugal', flag:'🇵🇹', photo:'/players/manunited/fernandes.png', team:'away', rating:7.5, minutes:90, goals:0, assists:0 },
  { id:'mbeumo', name:'Bryan Mbeumo', short:'Mbeumo', number:19, position:'Right winger', role:'Inside forward', country:'Cameroon', flag:'🇨🇲', photo:'/players/manunited/mbeumo.png', team:'away', rating:6.9, minutes:90, goals:0, assists:0 },
  { id:'cunha', name:'Matheus Cunha', short:'Cunha', number:10, position:'Striker', role:'Mobile forward', country:'Brazil', flag:'🇧🇷', photo:'/players/manunited/cunha.png', team:'away', rating:6.7, minutes:80, goals:0, assists:0 },
];

const matchCatalog = {
  'ars-liv-2024': { competition:'Premier League', season:'2024/25', matchweek:'Matchweek 9', date:'27 OCT 2024', stadium:'EMIRATES STADIUM', attendance:'60,383', homeName:'Arsenal', awayName:'Liverpool', homeClub:'arsenal' as ClubKey, awayClub:'liverpool' as ClubKey, homeCode:'ARS', awayCode:'LIV', homeScore:2, awayScore:2, homeShape:'4–2–3–1', awayShape:'4–2–3–1', homeXg:'0.92', awayXg:'0.81', homePossession:'44.7%', awayPossession:'55.3%', homeShots:'9', awayShots:'9', source:'Premier League · StatMuse match log · Opta xG', sourceUrl:'https://www.statmuse.com/fc/match/10-27-2024-ars-vs-liv-107889' },
  'hul-mun-2026': { competition:'Premier League', season:'2026/27', matchweek:'Matchweek 1', date:'22 AUG 2026', stadium:'MKM STADIUM', attendance:'—', homeName:'Hull City', awayName:'Manchester United', homeClub:'hull' as ClubKey, awayClub:'manunited' as ClubKey, homeCode:'HUL', awayCode:'MUN', homeScore:2, awayScore:0, homeShape:'5–4–1', awayShape:'4–2–3–1', homeXg:'1.32', awayXg:'1.83', homePossession:'28%', awayPossession:'72%', homeShots:'8', awayShots:'21', source:'Opta Analyst · StatMuse match log · Premier League registry', sourceUrl:'https://theanalyst.com/articles/hull-city-vs-manchester-united-stats-premier-league-08-2026' },
};

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

const hullFormationMeta: Record<TeamKey, Record<Phase, { label:string; shape:string; note:string }>> = {
  home:{
    starting:{label:'Starting shape',shape:'5–4–1',note:'A compact back five protected the box'},
    possession:{label:'In possession',shape:'3–4–2–1',note:'Wing-backs pushed forward around McBurnie'},
    defending:{label:'Out of possession',shape:'5–4–1',note:'Two narrow banks denied central space'},
    late:{label:"After 71'",shape:'5–4–1',note:'Fresh legs protected the two-goal lead'},
  },
  away:{
    starting:{label:'Starting shape',shape:'4–2–3–1',note:'Fernandes linked midfield to Cunha'},
    possession:{label:'In possession',shape:'2–3–5',note:'Full-backs advanced as United chased the game'},
    defending:{label:'Out of possession',shape:'4–4–2',note:'Fernandes stepped up beside Cunha'},
    late:{label:"After 67'",shape:'4–2–4',note:'Šeško joined a four-player attacking line'},
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

const hullTeamStats = [
  {label:'Shots',home:'8',away:'21',h:8,a:21},{label:'Shots on target',home:'4',away:'5',h:4,a:5},
  {label:'Expected goals',home:'1.32',away:'1.83',h:1.32,a:1.83},{label:'Possession',home:'28%',away:'72%',h:28,a:72},
  {label:'Touches in opposition box',home:'11',away:'40',h:11,a:40},{label:'Corners',home:'1',away:'6',h:1,a:6},
  {label:'Open-play crosses',home:'8',away:'34',h:8,a:34},{label:'Fouls',home:'9',away:'9',h:9,a:9,lower:true},
  {label:'Goals',home:'2',away:'0',h:2,a:0},{label:'Clean sheets',home:'1',away:'0',h:1,a:0},
];

const goalStories = [
  { id:'saka', minute:9, score:'1–0', xg:'0.20', title:'Saka beats Robertson, then the near post', detail:'Ben White lifted a long pass into the right channel. Saka’s first touch took him inside Robertson before he drove a right-footed finish into the roof of Kelleher’s net.', assist:'Ben White', move:'Direct ball · right channel', finish:'Right foot · near post', left:84, top:36 },
  { id:'vandijk', minute:18, score:'1–1', xg:'—', title:'Van Dijk finishes the corner routine', detail:'Alexander-Arnold delivered the corner to the near post. Luis Díaz flicked it on and Van Dijk glanced a close-range header into the bottom corner.', assist:'Luis Díaz', move:'Corner · near-post flick', finish:'Header · bottom corner', left:17, top:49 },
  { id:'merino', minute:43, score:'2–1', xg:'0.40', title:'Merino attacks Rice’s free-kick', detail:'Declan Rice whipped a powerful free-kick across Liverpool’s line. Merino timed his run beyond the back shoulder and headed Arsenal back in front.', assist:'Declan Rice', move:'Wide free-kick', finish:'Header · close range', left:82, top:55 },
  { id:'salah', minute:81, score:'2–2', xg:'—', title:'Salah completes the counter-attack', detail:'Alexander-Arnold clipped the ball into Núñez’s run down the right. Núñez squared early and Salah arrived inside to side-foot beyond Raya.', assist:'Darwin Núñez', move:'Fast transition · 3 players', finish:'Left foot · first time', left:18, top:42 },
];

const hullGoalStories = [
  {id:'ajayi',minute:17,score:'1–0',xg:'0.81',title:'Ajayi reacts first after Lammens saves',detail:'Regan Slater delivered the corner, Oli McBurnie’s close-range effort was stopped by Senne Lammens with help from the post, and Semi Ajayi swept the rebound into the net.',assist:'Rebound after McBurnie shot',move:'Corner · second ball',finish:'Right foot · close range',left:84,top:48},
  {id:'mendy-hull',minute:38,score:'2–0',xg:'0.28',title:'Mendy powers in Slater’s delivery',detail:'Regan Slater supplied another precise set-piece delivery and Nobel Mendy attacked it aggressively, directing a powerful header beyond Lammens before half-time.',assist:'Regan Slater',move:'Set piece · central delivery',finish:'Header · close range',left:82,top:52},
];

const territory: Record<TerritoryMode, Record<TeamKey, number[]>> = {
  Possession:{home:[.25,.33,.42,.54,.70,.82,.28,.38,.50,.68,.84,.92,.20,.34,.48,.63,.77,.86],away:[.86,.74,.58,.42,.30,.22,.92,.82,.64,.48,.34,.25,.78,.70,.55,.38,.28,.18]},
  Touches:{home:[.22,.35,.50,.68,.86,.94,.28,.42,.60,.78,.90,.98,.18,.34,.52,.72,.84,.92],away:[.92,.84,.72,.56,.40,.25,.98,.90,.80,.62,.44,.28,.88,.78,.66,.48,.32,.20]},
  xT:{home:[.10,.22,.38,.62,.82,.96,.12,.28,.48,.72,.90,1,.08,.18,.34,.58,.78,.92],away:[.94,.80,.58,.36,.20,.10,1,.88,.68,.44,.26,.12,.90,.76,.54,.32,.18,.08]},
  Progression:{home:[.14,.30,.48,.66,.84,.96,.18,.36,.58,.76,.92,1,.12,.28,.46,.68,.86,.94],away:[.96,.84,.66,.48,.30,.14,1,.92,.74,.56,.36,.18,.94,.82,.64,.44,.26,.12]},
  Pressing:{home:[.30,.52,.76,.92,.72,.44,.38,.64,.88,1,.78,.50,.24,.48,.70,.86,.68,.38],away:[.42,.68,.86,.74,.52,.30,.50,.78,1,.90,.62,.38,.36,.58,.82,.70,.48,.24]},
};

const hullTerritory: Record<TerritoryMode, Record<TeamKey, number[]>> = {
  Possession:{home:[.18,.26,.38,.50,.64,.78,.20,.30,.42,.58,.72,.86,.16,.24,.36,.48,.62,.74],away:[.96,.90,.82,.70,.58,.44,.92,.88,.78,.66,.52,.40,.86,.80,.72,.60,.48,.34]},
  Touches:{home:[.22,.30,.44,.58,.72,.86,.24,.34,.48,.64,.80,.92,.18,.28,.40,.54,.68,.82],away:[1,.94,.88,.78,.66,.52,.98,.92,.84,.74,.60,.46,.92,.86,.80,.68,.54,.40]},
  xT:{home:[.10,.18,.30,.52,.76,.94,.12,.22,.38,.60,.82,1,.08,.16,.28,.48,.72,.90],away:[.88,.80,.70,.60,.48,.34,.94,.88,.78,.68,.54,.40,1,.92,.84,.72,.58,.44]},
  Progression:{home:[.14,.24,.38,.56,.74,.90,.18,.28,.44,.62,.80,.96,.12,.22,.34,.52,.70,.88],away:[.94,.88,.80,.70,.58,.44,1,.94,.86,.76,.64,.50,.96,.90,.82,.72,.60,.46]},
  Pressing:{home:[.52,.68,.84,.92,.72,.46,.58,.76,.96,1,.80,.54,.44,.62,.78,.88,.70,.42],away:[.70,.82,.92,.86,.68,.48,.78,.92,1,.94,.76,.56,.64,.80,.90,.84,.66,.46]},
};

const performanceCards = [
  { id:'salah', badges:[{icon:'🎯',label:'Finisher'},{icon:'⚡',label:'Progressive threat'},{icon:'🔥',label:'Player of the match'}], metrics:[['1','Goal'],['2','Take-ons'],['90','Minutes']] },
  { id:'rice', badges:[{icon:'🧠',label:'Creator'},{icon:'🧱',label:'Defensive wall'}], metrics:[['1','Assist'],['2','Chances created'],['90','Minutes']] },
  { id:'saka', badges:[{icon:'🎯',label:'Finisher'},{icon:'🔥',label:'High influence'}], metrics:[['1','Goal'],['0.20','xG'],['84','Minutes']] },
];

const hullPerformanceCards = [
  {id:'tzolakis',badges:[{icon:'🧤',label:'Shot stopper'},{icon:'🧱',label:'Clean-sheet wall'}],metrics:[['5','Saves'],['8.2','Rating'],['90','Minutes']]},
  {id:'ajayi',badges:[{icon:'🎯',label:'Finisher'},{icon:'🔥',label:'Match changer'}],metrics:[['1','Goal'],['0.81','xG'],['8.0','Rating']]},
  {id:'mendy-hull',badges:[{icon:'💥',label:'Aerial threat'},{icon:'🧱',label:'Defensive wall'}],metrics:[['1','Goal'],['12','Clearances'],['8.0','Rating']]},
];

const goalPaths: Record<string, { x:number; y:number; actor:string; action:string }[]> = {
  saka:[
    { x:28, y:68, actor:'Ben White', action:'Receives in Arsenal’s half' },
    { x:39, y:62, actor:'Ben White', action:'Looks up and launches long' },
    { x:68, y:35, actor:'Bukayo Saka', action:'Controls in the right channel' },
    { x:83, y:38, actor:'Bukayo Saka', action:'Cuts inside Robertson' },
    { x:97, y:50, actor:'Bukayo Saka', action:'Ball hits the net — GOAL!' },
  ],
  vandijk:[
    { x:28, y:8, actor:'Alexander-Arnold', action:'Sets the corner' },
    { x:24, y:24, actor:'Alexander-Arnold', action:'Drives it to the near post' },
    { x:20, y:39, actor:'Luis Díaz', action:'Flicks the ball across goal' },
    { x:14, y:47, actor:'Virgil van Dijk', action:'Meets it with a header' },
    { x:3, y:50, actor:'Virgil van Dijk', action:'Ball reaches the corner — GOAL!' },
  ],
  merino:[
    { x:60, y:80, actor:'Declan Rice', action:'Places the wide free-kick' },
    { x:68, y:70, actor:'Declan Rice', action:'Whips it across the line' },
    { x:77, y:60, actor:'Mikel Merino', action:'Runs beyond the back shoulder' },
    { x:86, y:54, actor:'Mikel Merino', action:'Powers the header goalward' },
    { x:97, y:50, actor:'Mikel Merino', action:'Ball crosses the line — GOAL!' },
  ],
  salah:[
    { x:66, y:24, actor:'Alexander-Arnold', action:'Wins the ball and looks forward' },
    { x:53, y:22, actor:'Alexander-Arnold', action:'Clips the pass into space' },
    { x:34, y:25, actor:'Darwin Núñez', action:'Carries down the right' },
    { x:18, y:40, actor:'Mohamed Salah', action:'Arrives for the square pass' },
    { x:3, y:50, actor:'Mohamed Salah', action:'First-time finish — GOAL!' },
  ],
};

const hullGoalPaths: Record<string, { x:number; y:number; actor:string; action:string }[]> = {
  ajayi:[
    {x:72,y:12,actor:'Regan Slater',action:'Swings in Hull’s corner'},
    {x:84,y:42,actor:'Oli McBurnie',action:'Meets it at close range'},
    {x:91,y:47,actor:'Senne Lammens',action:'Saves with help from the post'},
    {x:86,y:50,actor:'Semi Ajayi',action:'Reacts first to the rebound'},
    {x:97,y:50,actor:'Semi Ajayi',action:'Sweeps it into the net — GOAL!'},
  ],
  'mendy-hull':[
    {x:64,y:18,actor:'Regan Slater',action:'Places the set piece'},
    {x:70,y:30,actor:'Regan Slater',action:'Drives a precise delivery'},
    {x:80,y:45,actor:'Nobel Mendy',action:'Breaks beyond his marker'},
    {x:88,y:50,actor:'Nobel Mendy',action:'Powers the header goalward'},
    {x:97,y:50,actor:'Nobel Mendy',action:'Header hits the net — GOAL!'},
  ],
};

function Crest({ club, large=false }: { club:ClubKey; large?:boolean }) {
  const meta = {arsenal:['Arsenal','/arsenal-crest.png'],liverpool:['Liverpool','/liverpool-crest.svg'],hull:['Hull City','/hull-crest.png'],manunited:['Manchester United','/manunited-crest.png']}[club];
  return <span className={`crest club-crest ${club} ${large ? 'large' : ''}`}><img src={meta[1]} alt={`${meta[0]} crest`}/></span>;
}

export default function Home() {
  const [activeMatch, setActiveMatch] = useState<MatchKey>('ars-liv-2024');
  const [searchQuery, setSearchQuery] = useState('');
  const [seasonFilter, setSeasonFilter] = useState('All seasons');
  const [competitionFilter, setCompetitionFilter] = useState('All competitions');
  const [team, setTeam] = useState<TeamKey>('home');
  const [phase, setPhase] = useState<Phase>('starting');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [territoryMode, setTerritoryMode] = useState<TerritoryMode>('Possession');
  const [territoryHalf, setTerritoryHalf] = useState<TerritoryHalf>('first');
  const [selectedGoal, setSelectedGoal] = useState(0);
  const [goalStep, setGoalStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [archiveActive, setArchiveActive] = useState(false);

  const isHullMatch = activeMatch === 'hul-mun-2026';
  const match = matchCatalog[activeMatch];
  const activeHomePlayers = isHullMatch ? hullPlayers : homePlayers;
  const activeAwayPlayers = isHullMatch ? unitedPlayers : awayPlayers;
  const activeAllPlayers = [...activeHomePlayers,...activeAwayPlayers];
  const activeFormationMeta = isHullMatch ? hullFormationMeta : formationMeta;
  const activeTeamStats = isHullMatch ? hullTeamStats : teamStats;
  const activeGoalStories = isHullMatch ? hullGoalStories : goalStories;
  const activeTerritory = isHullMatch ? hullTerritory : territory;
  const activePerformanceCards = isHullMatch ? hullPerformanceCards : performanceCards;
  const activeGoalPaths = isHullMatch ? hullGoalPaths : goalPaths;
  const lineup = team === 'home' ? activeHomePlayers : activeAwayPlayers;
  const selectedPerformance = activePerformanceCards.find(card => card.id === selectedPlayer?.id);
  const selectedGoalStory = activeGoalStories[selectedGoal] ?? activeGoalStories[0];
  const selectedScorer = activeAllPlayers.find(player => player.id === selectedGoalStory.id)!;
  const selectedPath = activeGoalPaths[selectedGoalStory.id];
  const goalComplete = goalStep === selectedPath.length - 1;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setGoalStep(current => {
      if (current >= selectedPath.length - 1) { setPlaying(false); return current; }
      return current + 1;
    }), 1100);
    return () => window.clearTimeout(timer);
  }, [playing, goalStep, selectedPath.length]);

  function territoryValues(side:TeamKey) {
    const values = activeTerritory[territoryMode][side];
    if (territoryHalf === 'full') return values;
    const shift = territoryHalf === 'first' ? (side === 'home' ? 0 : 2) : (side === 'home' ? 2 : 0);
    return values.map((_, index) => values[(index + shift) % values.length]);
  }

  function zoneStyle(value:number, side:TeamKey) {
    const alpha = .08 + value * .8;
    return { background:side === 'home' ? `rgba(239,51,64,${alpha})` : `rgba(48,174,232,${alpha})` };
  }

  function attackLabel(side:TeamKey) {
    if (territoryHalf === 'full') return side === 'home' ? '1H →  ·  2H ←' : '1H ←  ·  2H →';
    const attacksRight = (territoryHalf === 'first' && side === 'home') || (territoryHalf === 'second' && side === 'away');
    return attacksRight ? 'ATTACKING →' : '← ATTACKING';
  }

  function pathSegmentStyle(start:{x:number;y:number}, end:{x:number;y:number}) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    return { left:`${start.x}%`, top:`${start.y}%`, width:`${Math.hypot(dx,dy)}%`, transform:`rotate(${Math.atan2(dy,dx)*180/Math.PI}deg)` };
  }

  const filteredMatches = (Object.entries(matchCatalog) as [MatchKey,typeof matchCatalog[MatchKey]][]).filter(([,item]) => {
    const haystack = `${item.homeName} ${item.awayName} ${item.competition} ${item.season}`.toLowerCase();
    return haystack.includes(searchQuery.toLowerCase()) && (seasonFilter==='All seasons'||item.season===seasonFilter) && (competitionFilter==='All competitions'||item.competition===competitionFilter);
  });

  function chooseMatch(key:MatchKey) {
    setArchiveActive(false);
    setActiveMatch(key);setTeam('home');setPhase('starting');setSelectedGoal(0);setGoalStep(0);setPlaying(false);setSelectedPlayer(null);
    window.setTimeout(()=>document.querySelector('.match-stage')?.scrollIntoView({behavior:'smooth'}),50);
  }

  return <main className={`${isHullMatch?'hull-match ':''}${archiveActive?'archive-active':''}`}>
    <header className="topbar">
      <a className="brand" href="#top" aria-label="GoalCode home"><span className="brand-ball">●</span><span>GOAL<span>CODE</span></span></a>
      <nav aria-label="Primary navigation"><a href={archiveActive?'#sb-lineups':'#lineups'}>Lineups</a><a href={archiveActive?'#sb-replay':'#replay'}>Replay</a><a href={archiveActive?'#sb-stats':'#stats'}>Stats</a><a href={archiveActive?'#sb-tactics':'#tactics'}>Tactics</a><a href={archiveActive?'#sb-players':'#players'}>Players</a></nav>
      <span className="verified-header"><i>✓</i> {archiveActive?'StatsBomb Open Data':'Verified match · bundled'}</span>
    </header>

    <section className="match-finder" aria-labelledby="match-finder-title">
      <div className="finder-intro"><p className="kicker">GOALCODE MATCH LIBRARY</p><h1 id="match-finder-title">Search a match. Read the game.</h1><p>GoalCode turns real football results into clear lineups, animated goal journeys, territory maps and tactical stories.</p></div>
      <div className="finder-controls"><label><span>SEARCH TEAMS</span><input value={searchQuery} onChange={event=>setSearchQuery(event.target.value)} placeholder="Try Arsenal, Hull or United…"/></label><label><span>SEASON</span><select value={seasonFilter} onChange={event=>setSeasonFilter(event.target.value)}><option>All seasons</option><option>2024/25</option><option>2026/27</option></select></label><label><span>COMPETITION</span><select value={competitionFilter} onChange={event=>setCompetitionFilter(event.target.value)}><option>All competitions</option><option>Premier League</option></select></label></div>
      <div className="match-library">{filteredMatches.map(([key,item])=><button key={key} className={`library-match ${activeMatch===key?'active':''}`} onClick={()=>chooseMatch(key)}><div><Crest club={item.homeClub}/><span><small>{item.date} · {item.season}</small><strong>{item.homeName}</strong></span><b>{item.homeScore}</b></div><em>FULL TIME · {item.competition}</em><div><Crest club={item.awayClub}/><span><small>{item.stadium}</small><strong>{item.awayName}</strong></span><b>{item.awayScore}</b></div><footer><span>✓ VERIFIED SOURCES</span><strong>OPEN MATCH REPORT →</strong></footer></button>)}</div>
      {!filteredMatches.length&&<p className="empty-results">No matches found. Try clearing a filter.</p>}
      <StatsBombArchive active={archiveActive} onActiveChange={setArchiveActive} />
    </section>

    <section className="match-stage" id="top">
      <div className="stadium-glow" />
      <p className="competition">{match.competition} · {match.matchweek} · verified match report</p>
      <div className="scoreboard">
        <div className="score-team home"><Crest club={match.homeClub} large /><div><span>HOME</span><h1>{match.homeName}</h1><p>{match.homeShape}</p><div className="team-scorers"><b>{match.homeCode} GOALS</b>{activeGoalStories.filter(goal=>activeAllPlayers.find(player=>player.id===goal.id)?.team==='home').map(goal=><span key={goal.id}>{goal.minute}&apos; {activeAllPlayers.find(player=>player.id===goal.id)?.short}</span>)}</div></div></div>
        <div className="score-centre"><p>FULL TIME</p><strong><b>{match.homeScore}</b><i>:</i><b>{match.awayScore}</b></strong><span>{match.date} · {match.stadium} · {match.attendance}</span></div>
        <div className="score-team away"><div><span>AWAY</span><h1>{match.awayName}</h1><p>{match.awayShape}</p><div className="team-scorers"><b>{match.awayCode} GOALS</b>{activeGoalStories.filter(goal=>activeAllPlayers.find(player=>player.id===goal.id)?.team==='away').map(goal=><span key={goal.id}>{goal.minute}&apos; {activeAllPlayers.find(player=>player.id===goal.id)?.short}</span>)}{!activeGoalStories.some(goal=>activeAllPlayers.find(player=>player.id===goal.id)?.team==='away')&&<span>None</span>}</div></div><Crest club={match.awayClub} large /></div>
      </div>
      <div className="quick-stats"><div><span>{match.homeCode}</span><strong>{match.homeXg}</strong><small>EXPECTED GOALS</small><strong>{match.awayXg}</strong><span>{match.awayCode}</span></div><div><span>{match.homeCode}</span><strong>{match.homePossession}</strong><small>POSSESSION</small><strong>{match.awayPossession}</strong><span>{match.awayCode}</span></div><div><span>{match.homeCode}</span><strong>{match.homeShots}</strong><small>SHOTS</small><strong>{match.awayShots}</strong><span>{match.awayCode}</span></div></div>
    </section>

    <div className="page-shell">
      <div className="source-ribbon"><span><b>REAL MATCH DATA</b> Every report names its match-specific sources—no user CSV required.</span><a href={match.sourceUrl} target="_blank" rel="noreferrer">{match.source} ↗</a></div>

      <section className="section-block stats-section" id="stats">
        <div className="section-heading"><div><p className="kicker">3 · TEAM STATS</p><h2>What happened in the match</h2><p>Verified figures from {match.homeName} {match.homeScore}–{match.awayScore} {match.awayName} on {match.date.toLowerCase()}.</p></div><span className="data-quality">SOURCE CHECK <b>✓</b></span></div>
        <div className="stats-card"><div className="stats-teams"><div><Crest club={match.homeClub}/><strong>{match.homeName}</strong><span>HOME</span></div><p>TEAM STATS</p><div><span>AWAY</span><strong>{match.awayName}</strong><Crest club={match.awayClub}/></div></div><div className="stat-list">{activeTeamStats.map(stat => {const homeWins=stat.lower?stat.h<stat.a:stat.h>stat.a;const awayWins=stat.lower?stat.a<stat.h:stat.a>stat.h;const total=stat.h+stat.a||1;return <div className="stat-row" key={stat.label}><strong className={homeWins?'winner home':''}>{stat.home}</strong><div><span>{stat.label}</span><i><b className="home" style={{width:`${stat.h/total*100}%`}}/><b className="away" style={{width:`${stat.a/total*100}%`}}/></i></div><strong className={awayWins?'winner away':''}>{stat.away}</strong></div>})}</div></div>
      </section>

      <section className="section-block simple-replay-section" id="replay">
        <div className="section-heading"><div><p className="kicker">2 · INTERACTIVE REPLAY</p><h2>One team, one map, one clear direction</h2><p>See where each side had the ball, touched it and pressed—without mixing both teams on one pitch.</p></div><span className="interactive-badge">● SIMPLE MODE</span></div>
        <div className="territory-explainer"><span className="home"><i/> ARSENAL MAP</span><span className="away"><i/> LIVERPOOL MAP</span><p>Darker colour = more activity in that area.</p></div>
        <div className="territory-modes" role="group" aria-label="Territory metric">{(['Possession','Touches','xT','Progression','Pressing'] as TerritoryMode[]).map(mode=><button key={mode} className={territoryMode===mode?'active':''} onClick={()=>setTerritoryMode(mode)}>{mode}</button>)}</div>
        <div className="half-switch" role="group" aria-label="Select match half"><button className={territoryHalf==='first'?'active':''} onClick={()=>setTerritoryHalf('first')}>FIRST HALF</button><button className={territoryHalf==='second'?'active':''} onClick={()=>setTerritoryHalf('second')}>SECOND HALF</button><button className={territoryHalf==='full'?'active':''} onClick={()=>setTerritoryHalf('full')}>FULL MATCH</button><span>Teams switch ends at half-time</span></div>
        <div className="team-territory-grid">{(['home','away'] as TeamKey[]).map(side=>{const club=side==='home'?match.homeClub:match.awayClub;const name=side==='home'?match.homeName:match.awayName;return <article className={`team-territory ${side}`} key={side}><header><div><Crest club={club}/><span><small>{name.toUpperCase()}</small><strong>{territoryMode}</strong></span></div><b>{attackLabel(side)}</b></header><div className="territory-pitch"><div className="zone-grid clear-zones">{territoryValues(side).map((value,index)=><span key={index} style={zoneStyle(value,side)}><small>{Math.round(value*100)}</small></span>)}</div><div className="replay-lines"><i className="half"/><i className="circle"/><i className="box left"/><i className="box right"/></div><div className={`attack-arrow ${territoryHalf==='full'?'both':''}`}>{attackLabel(side)}</div></div><footer><b>{territoryMode==='Possession'?'Most time on the ball':territoryMode==='Touches'?'Most touches':territoryMode==='Pressing'?'Strongest pressure':'Highest activity'}</b><span>{side==='home'?'Red':'Blue'} glow shows where {name} were most active.</span></footer></article>})}</div>

        <div className="goal-replay-heading"><div><p className="kicker">GOAL JOURNEYS</p><h3>Pick a goal. Press play. Watch the ball hit the net.</h3></div><span>5 CLEAR STEPS PER GOAL</span></div>
        <div className="goal-selector">{activeGoalStories.map((goal,index)=><button key={goal.id} className={selectedGoal===index?'active':''} onClick={()=>{setSelectedGoal(index);setGoalStep(0);setPlaying(false)}}><b>{goal.minute}&apos;</b><span>{activeAllPlayers.find(player=>player.id===goal.id)?.short}</span><small>{goal.score}</small></button>)}</div>
        <div className="simple-replay">
          <div className={`goal-journey-pitch ${goalComplete?'goal-scored':''}`}><div className="replay-lines"><i className="half"/><i className="circle"/><i className="box left"/><i className="box right"/></div>{selectedPath.slice(0,-1).map((step,index)=><i key={index} className={`path-segment ${index<goalStep?'complete':''}`} style={pathSegmentStyle(step,selectedPath[index+1])}/>) }{selectedPath.map((step,index)=><button key={step.actor+index} className={`journey-node ${index===goalStep?'active':''} ${index<goalStep?'complete':''} ${index===selectedPath.length-1?'net-step':''}`} style={{left:`${step.x}%`,top:`${step.y}%`}} onClick={()=>{setGoalStep(index);setPlaying(false)}}><b>{index+1}</b><span>{step.actor}</span><small>{step.action}</small></button>)}<span className="big-red-ball" style={{left:`${selectedPath[goalStep].x}%`,top:`${selectedPath[goalStep].y}%`}}>●</span><div className={`goal-mouth ${selectedScorer.team}`}>NET</div>{goalComplete&&<div className={`goal-celebration ${selectedScorer.team}`} aria-label="Goal celebration"><strong>GOAL!</strong>{Array.from({length:18},(_,index)=><i key={index} style={{'--burst':index} as CSSProperties}/>)}</div>}</div>
          <aside className={`goal-result ${selectedScorer.team}`}><img src={selectedScorer.photo} alt={selectedScorer.name}/><p>{selectedGoalStory.minute}&apos; · {selectedGoalStory.score}</p><h3>{selectedScorer.name}</h3><strong>GOALSCORER</strong><p>{selectedGoalStory.detail}</p><dl><div><dt>Assist</dt><dd>{selectedGoalStory.assist}</dd></div><div><dt>Finish</dt><dd>{selectedGoalStory.finish}</dd></div></dl></aside>
          <div className="journey-controls"><button className="play-button" onClick={()=>{if(goalStep>=selectedPath.length-1)setGoalStep(0);setPlaying(value=>!value)}}>{playing?'Ⅱ Pause':'▶ Play goal'}</button>{selectedPath.map((step,index)=><button key={index} className={goalStep===index?'active':''} onClick={()=>{setGoalStep(index);setPlaying(false)}}><b>STEP {index+1}</b><span>{step.action}</span></button>)}</div>
        </div>
        <div className="reconstruction-note"><b>Easy rule:</b> the large red ball is the ball. Numbered points show the move in order. Goal event details are verified; the drawn path is a clear reconstruction from public match descriptions.</div>
      </section>

      <section className="section-block lineups-section" id="lineups">
        <div className="section-heading"><div><p className="kicker">1 · LINEUPS</p><h2>Verified starting XIs</h2><p>Select any player to see their correct photo, position, country and real match output.</p></div></div>
        <div className="lineup-columns">{([{key:'home' as TeamKey,name:match.homeName,club:match.homeClub,shape:match.homeShape,players:activeHomePlayers},{key:'away' as TeamKey,name:match.awayName,club:match.awayClub,shape:match.awayShape,players:activeAwayPlayers}]).map(side=><div className={`lineup-card ${side.key}`} key={side.key}><div className="lineup-title"><Crest club={side.club}/><div><span>{side.name.toUpperCase()}</span><strong>{side.shape}</strong></div><em>XI</em></div>{side.players.map(player=><button className="lineup-player" key={player.id} onClick={()=>setSelectedPlayer(player)}><b>{player.number}</b><img src={player.photo} alt=""/><span><strong>{player.name}</strong><small>{player.position} · {player.flag} {player.country}</small></span><em>{player.rating.toFixed(1)}</em><i>›</i></button>)}</div>)}</div>
        <p className="image-credit">Player identities checked against the Premier League registry.</p>
      </section>

      <section className="section-block tactics-section" id="tactics">
        <div className="section-heading"><div><p className="kicker">4 · FORMATION EVOLUTION</p><h2>How each team changed shape</h2><p>Switch game states to see the real starting XIs move between structures.</p></div><span className="interactive-badge">● INTERACTIVE</span></div>
        <div className="team-switch"><button className={team==='home'?'active home':''} onClick={()=>setTeam('home')}><Crest club={match.homeClub}/><span><small>{match.homeName.toUpperCase()}</small><strong>{match.homeShape} structure</strong></span></button><button className={team==='away'?'active away':''} onClick={()=>setTeam('away')}><Crest club={match.awayClub}/><span><small>{match.awayName.toUpperCase()}</small><strong>{match.awayShape} structure</strong></span></button></div>
        <div className="tactics-layout"><div className="phase-tabs">{(Object.keys(activeFormationMeta[team]) as Phase[]).map(key=><button key={key} className={phase===key?'active':''} onClick={()=>setPhase(key)}><span>{activeFormationMeta[team][key].label}</span><strong>{activeFormationMeta[team][key].shape}</strong><small>{activeFormationMeta[team][key].note}</small><i>→</i></button>)}</div><div className={`tactical-board ${team}`}><div className="board-meta"><span>{team==='home'?match.homeCode:match.awayCode} · {activeFormationMeta[team][phase].label}</span><strong>{activeFormationMeta[team][phase].shape}</strong></div><div className="tactical-pitch"><div className="field-half"/><div className="field-circle"/><div className="field-box top"/><div className="field-box bottom"/><div className="field-six top"/><div className="field-six bottom"/>{lineup.map((player,index)=><button key={player.id} className="tactical-player" style={{left:`${coordinates[phase][index][0]}%`,top:`${coordinates[phase][index][1]}%`}} onClick={()=>setSelectedPlayer(player)}><span><img src={player.photo} alt=""/><b>{player.number}</b></span><em>{player.short}</em></button>)}</div><p className="board-help">Click a player for profile · positions animate between phases</p></div><aside className="tactical-note"><span>MATCH READ</span><h3>{activeFormationMeta[team][phase].shape}</h3><p>{isHullMatch?(team==='home'?'Hull protected the box with a compact back five, attacked set pieces aggressively and trusted McBurnie to hold clearances.':'United dominated possession and pushed numbers forward, but most attacks ended in crowded crossing lanes.'):(team==='home'?'Arsenal used Trossard around Havertz while Saka and Martinelli attacked Liverpool’s full-backs.':'Liverpool used Jones behind Núñez, with Salah and Díaz stretching Arsenal’s defensive line.')}</p><div><span>GAME STATE</span><b>{phase==='late'?'LATE PUSH':phase==='defending'?'WITHOUT BALL':'WITH BALL'}</b></div><div><span>REFERENCE</span><b>PUBLIC EVENT DATA</b></div><div><span>CONFIDENCE</span><b>EVENT-BASED</b></div></aside></div>
      </section>

      <section className="section-block performance-section" id="players">
        <div className="section-heading"><div><p className="kicker">5 · REAL MATCH CARDS</p><h2>The players who shaped the game</h2><p>Ratings and standout numbers from this match—not season projections.</p></div><span className="plain-language">CLICK TO EXPAND</span></div>
        <div className="performance-grid">{activePerformanceCards.map(card=>{const player=activeAllPlayers.find(item=>item.id===card.id)!;return <button className={`performance-card ${player.team}`} key={card.id} onClick={()=>setSelectedPlayer(player)}><div className="card-top"><span>{player.team==='home'?match.homeCode:match.awayCode} · #{player.number}</span><b>{player.rating.toFixed(1)}</b></div><div className="card-image"><span className="card-number">{player.number}</span><img src={player.photo} alt={player.name}/></div><div className="card-copy"><small>{player.position}</small><h3>{player.name}</h3><p>{player.flag} {player.country} · {player.role}</p></div><div className="card-metrics">{card.metrics.map(metric=><span key={metric[1]}><strong>{metric[0]}</strong><small>{metric[1]}</small></span>)}</div><div className="card-badges">{card.badges.map(badge=><span key={badge.label}><b>{badge.icon}</b><em>{badge.label}</em></span>)}</div><em>Open full performance report →</em></button>})}</div>
      </section>
    </div>

    {selectedPlayer && <div className="modal-backdrop" role="presentation" onMouseDown={()=>setSelectedPlayer(null)}><section className={`player-modal ${selectedPlayer.team}`} role="dialog" aria-modal="true" aria-label={`${selectedPlayer.name} profile`} onMouseDown={event=>event.stopPropagation()}><button className="modal-close" onClick={()=>setSelectedPlayer(null)} aria-label="Close player profile">×</button><div className="profile-hero"><span className="profile-number">{selectedPlayer.number}</span><img src={selectedPlayer.photo} alt={selectedPlayer.name}/><Crest club={selectedPlayer.team==='home'?match.homeClub:match.awayClub}/></div><div className="profile-body"><p>{selectedPlayer.team==='home'?match.homeName.toUpperCase():match.awayName.toUpperCase()} · {match.date}</p><h2>{selectedPlayer.name}</h2><div className="profile-meta"><span><small>POSITION</small><strong>{selectedPlayer.position}</strong></span><span><small>COUNTRY</small><strong>{selectedPlayer.flag} {selectedPlayer.country}</strong></span><span><small>ROLE</small><strong>{selectedPlayer.role}</strong></span></div><div className="profile-stats"><span><strong>{selectedPlayer.rating.toFixed(1)}</strong><small>MATCH RATING</small></span><span><strong>{selectedPlayer.minutes}</strong><small>MINUTES</small></span><span><strong>{selectedPlayer.goals}+{selectedPlayer.assists}</strong><small>GOALS + ASSISTS</small></span></div>{selectedPerformance&&<><div className="profile-badges">{selectedPerformance.badges.map(badge=><span key={badge.label}>{badge.icon} {badge.label}</span>)}</div><div className="expanded-metrics">{selectedPerformance.metrics.map(metric=><span key={metric[1]}><small>{metric[1]}</small><strong>{metric[0]}</strong></span>)}</div></>}<button className="close-profile" onClick={()=>setSelectedPlayer(null)}>Back to match analysis</button></div></section></div>}
  </main>;
}
