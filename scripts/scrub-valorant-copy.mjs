import fs from 'node:fs';
import path from 'node:path';

const root = path.join(process.cwd(), 'src');
const patterns = [
  [/Valorant/g, 'Apex Legends'],
  [/VALORANT/g, 'Apex Legends'],
  [/Riot /g, ''],
  [/\bRiot\b/g, 'EA'],
  [/Vanguard/g, 'Javelin'],
  [/Combat Mode/gi, 'Stream Proof'],
  [/Death Box/gi, 'loot crate'],
  [/spike /gi, ''],
  [/abilities? and traps?/gi, 'loot cues'],
  [/ability and trap ESP/gi, 'loot markers'],
  [/defuse /gi, ''],
  [/equip name/gi, 'weapon name'],
  [/\bagent\b/gi, 'legend'],
  [
    /Four menu groups: Aimbot Options, Player Visual Options, World Visual Options, and Misc Options\./g,
    'Twelve modules including Player ESP, Advanced Aimbot, and Loot ESP.',
  ],
  [/Aimbot Options/g, 'Advanced Aimbot'],
  [/Player Visual Options/g, 'Player ESP'],
  [/World Visual Options/g, 'Loot ESP'],
  [/Misc Options/g, 'Stream Proof'],
  [/Aimbot Filter and Aimbot Bone/g, 'target filters'],
  [/Aimbot Bone under Advanced Aimbot/g, 'Bone pick under Advanced Aimbot'],
  [/Enable Aimbot in Advanced Aimbot/g, 'Advanced Aimbot toggles'],
];

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (/\.(json|md)$/.test(name)) {
      let text = fs.readFileSync(full, 'utf8');
      const before = text;
      for (const [re, sub] of patterns) text = text.replace(re, sub);
      if (text !== before) fs.writeFileSync(full, text);
    }
  }
}

walk(root);
console.log('scrub-valorant-copy: done');
