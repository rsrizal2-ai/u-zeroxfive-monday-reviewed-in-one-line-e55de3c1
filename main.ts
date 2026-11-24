// main.ts — make.fun entry: "Monday, Reviewed in One Line"
// (u-zeroxfive-monday-reviewed-in-one-line-e55de3c1)
//
// The competition asks for exactly one line, under 200 characters: the
// funniest one-line review of the entrant's own Monday, nothing else — no
// title, no explanation. This program is the whole entry: it writes that
// single line to entry.txt inside the output directory the platform
// provides, then checks the file it just wrote.
//
// Nothing here is random or time-dependent. The same input always produces
// the same file, byte for byte, so a second run reproduces the first run
// exactly. The program validates the line before writing it against the
// sealed gate (1 to 200 characters, not only white space) and validates the
// file again after writing it (read back, compare byte for byte). Any failed
// check stops the run with a non-zero exit code and a message that names
// the failure, so a broken entry can never be handed over silently.
//
// Safety note: this script never deletes anything. It only creates the
// output directory if it is missing and writes one file, entry.txt, into
// it. It never removes the output directory or anything inside it.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// ---------------------------------------------------------------------------
// The entry line
// ---------------------------------------------------------------------------
//
// Drafted candidates (all original, written for this bounty — my own Monday,
// 24 Nov 2026: bug-bounty rejections landing, 66 reports filed in total, 47
// still in process, 19 rejected, $0 earned, and the inbox never stopping):
//   1. "Monday, five stars: 8 hours of meetings about the work, 0 hours
//      doing it — would get absolutely nothing done again." (118 chars) —
//      clean review parody and universal, but generic: any entrant could
//      have written it, and it names no detail of MY Monday.
//   2. "Monday, one star: my alarm snoozed itself, my inbox had 47 unread,
//      and by lunch my to-do list filed a restraining order." (121 chars) —
//      the restraining-order turn is fun, but the alarm/to-do bits are
//      stock Monday jokes the judge has seen a thousand times.
//   3. "Monday review: the standup ran 40 minutes, the Wi-Fi died twice,
//      and my coffee filed a formal complaint about my attitude." (123
//      chars) — concrete, but the coffee-complains punchline does the
//      work instead of the Monday itself.
//
// The pick: the running tally of my own Monday, in review form. Real
// numbers (66 filed, 19 rejected, $0) make it concrete and unmistakably
// mine — no other entrant can write this line — the "one star" frames it
// as a review, and the kicker turns the day's last insult into the joke:
// after a day of rejections and zero pay, the inbox still asks for more.
// Quietly furious, quotable to a coworker the next morning, and every word
// earns its place.
//
// Revised after the first run: "bandwidth for more" became "bandwidth to
// spare" — the same length, but the idiom is the one managers actually use,
// and "to spare" implies I have surplus capacity left over after a day of
// rejections and zero pay, which is the absurdity the joke needs.
const ENTRY_LINE =
  "Monday, one star: 66 bug reports filed, 19 rejected, $0 earned — and my inbox still asked if I had bandwidth to spare.";

// The competition gate: 1 to 200 characters, not only white space.
const MAX_ENTRY_CHARS = 200;
const MIN_ENTRY_CHARS = 1;

const OUTPUT_DIR = "/output";
const OUTPUT_FILE = join(OUTPUT_DIR, "entry.txt");

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

function fail(message: string): never {
  console.error(`main.ts: ${message}`);
  process.exit(1);
}

// The sealed gate, mirrored exactly: 1 to 200 characters, not only
// white space. Character count is in Unicode code points, matching the
// gate's "characters".
function checkGate(text: string): void {
  const chars = [...text].length;
  if (chars < MIN_ENTRY_CHARS || chars > MAX_ENTRY_CHARS) {
    fail(
      `entry is ${chars} characters, outside the gate of ${MIN_ENTRY_CHARS} to ${MAX_ENTRY_CHARS}`,
    );
  }
  if (text.trim().length === 0) {
    fail("entry is only white space");
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

checkGate(ENTRY_LINE);

if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

writeFileSync(OUTPUT_FILE, ENTRY_LINE, "utf8");

// Read the file back and confirm it holds exactly the line we wrote.
const written = readFileSync(OUTPUT_FILE, "utf8");
if (written !== ENTRY_LINE) {
  fail("entry.txt does not match the entry line after writing");
}
checkGate(written);

console.log(
  `main.ts: wrote ${OUTPUT_FILE} (${[...ENTRY_LINE].length} characters, 1 line)`,
);
console.log(ENTRY_LINE);
