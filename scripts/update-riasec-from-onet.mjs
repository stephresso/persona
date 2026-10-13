/**
 * Regenerate career RIASEC vectors from O*NET occupational interest data.
 *
 * Source: O*NET Database "Interests" file (OI scale, 1–7 per RIASEC dimension),
 * U.S. Department of Labor, CC BY 4.0 — https://www.onetcenter.org/database.html
 *
 * Each app career maps to one or more O*NET-SOC occupations; blended roles
 * (e.g. "Chef / Cook") average the profiles of their source occupations.
 * primaryArchetype = the highest-interest dimension of the resulting vector.
 *
 * Run: node scripts/update-riasec-from-onet.mjs [path-to-local-Interests.txt]
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const DB_URL =
  'https://www.onetcenter.org/dl_files/database/db_30_0_text/Interests.txt';

/** App career id → O*NET-SOC occupation(s). Multiple codes = averaged blend. */
const SOC_MAP = {
  electrician: ['47-2111.00'], // Electricians
  chef: ['35-1011.00', '35-2014.00'], // Chefs and Head Cooks + Cooks, Restaurant
  carpenter: ['47-2031.00'], // Carpenters
  'data-analyst': ['15-2051.00', '15-2051.01'], // Data Scientists + BI Analysts
  'software-engineer': ['15-1252.00'], // Software Developers
  'research-scientist': ['19-1042.00', '19-2012.00'], // Medical Scientists + Physicists
  'graphic-designer': ['27-1024.00'], // Graphic Designers
  'content-creator': ['27-4032.00', '27-3043.00'], // Film and Video Editors + Writers and Authors
  'product-designer': ['15-1255.00', '27-1024.00'], // Web/Digital Interface Designers + Graphic Designers
  nurse: ['29-1141.00'], // Registered Nurses
  teacher: ['25-2021.00', '25-2031.00'], // Elementary + Secondary School Teachers
  counselor: ['21-1014.00'], // Mental Health Counselors
  'product-manager': ['11-1021.00'], // General and Operations Managers
  'marketing-manager': ['11-2021.00'], // Marketing Managers
  'sales-rep': ['41-4012.00'], // Sales Representatives, Wholesale and Manufacturing
  accountant: ['13-2011.00'], // Accountants and Auditors
  'project-coordinator': ['13-1082.00'], // Project Management Specialists
  'operations-analyst': ['13-1111.00', '15-2031.00'], // Management Analysts + Operations Research Analysts
  'design-engineer': ['15-1255.00', '15-1254.00'], // Web/Digital Interface Designers + Web Developers
  'ml-engineer': ['15-2051.00', '15-1252.00'], // Data Scientists + Software Developers
  'ai-product-manager': ['11-1021.00'], // General and Operations Managers
  'ai-ops-engineer': ['15-1244.00'], // Network and Computer Systems Administrators
  'prompt-eval-engineer': ['15-1253.00'], // Software QA Analysts and Testers
  'ai-product-designer': ['15-1255.00', '27-1024.00'], // same craft blend as product-designer
  'model-maker': ['51-4061.00'], // Model Makers, Metal and Plastic
  'industrial-designer': ['27-1021.00'], // Commercial and Industrial Designers
  'warehouse-ops-lead': ['53-1042.00'], // First-Line Supervisors of Material Movers
  'electrical-engineer': ['17-2071.00'], // Electrical Engineers
};

const DIM_BY_NAME = {
  Realistic: 'R',
  Investigative: 'I',
  Artistic: 'A',
  Social: 'S',
  Enterprising: 'E',
  Conventional: 'C',
};
const KEYS = ['R', 'I', 'A', 'S', 'E', 'C'];

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const loadInterests = async () => {
  const localPath = process.argv[2];
  if (localPath) return readFileSync(localPath, 'utf8');
  const res = await fetch(DB_URL);
  if (!res.ok) throw new Error(`O*NET download failed: ${res.status}`);
  return res.text();
};

const text = await loadInterests();

// soc → { R..C } on the 1–7 OI scale
const profiles = {};
for (const line of text.split('\n')) {
  const [soc, , elementName, scaleId, value] = line.split('\t');
  const dim = DIM_BY_NAME[elementName];
  if (!dim || scaleId !== 'OI') continue;
  (profiles[soc] ??= {})[dim] = parseFloat(value);
}

const careersPath = join(root, 'data/careers.json');
const data = JSON.parse(readFileSync(careersPath, 'utf8'));

for (const career of data.careers) {
  const socs = SOC_MAP[career.id];
  if (!socs) throw new Error(`No O*NET mapping for career: ${career.id}`);
  const missing = socs.filter((s) => !profiles[s]);
  if (missing.length) throw new Error(`SOC not in O*NET data: ${missing}`);

  const riasec = {};
  KEYS.forEach((k) => {
    const avg = socs.reduce((sum, s) => sum + profiles[s][k], 0) / socs.length;
    riasec[k] = Math.round(avg * 100) / 100;
  });
  const primary = KEYS.reduce((a, b) => (riasec[b] > riasec[a] ? b : a));

  const oldPrimary = career.primaryArchetype;
  career.riasec = riasec;
  career.primaryArchetype = primary;
  career.onetCodes = socs;

  const vec = KEYS.map((k) => `${k}${riasec[k].toFixed(1)}`).join(' ');
  const flag = oldPrimary !== primary ? `  (primary ${oldPrimary} → ${primary})` : '';
  console.log(`${career.id.padEnd(24)} ${vec}${flag}`);
}

writeFileSync(careersPath, JSON.stringify(data, null, 2) + '\n');
console.log(`\nUpdated ${data.careers.length} careers in data/careers.json`);
