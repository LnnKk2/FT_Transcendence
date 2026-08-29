// mini-runner maison : pas de dependance, `node shared/tests/run.ts`
let passed = 0;
let failed = 0;

export function check(label: string, actual: unknown, expected: unknown): void {
	const a = JSON.stringify(actual);
	const e = JSON.stringify(expected);
	if (a === e) {
		passed++;
		console.log(`OK   ${label}`);
	} else {
		failed++;
		console.log(`FAIL ${label} | attendu ${e} | obtenu ${a}`);
	}
}

export function report(): void {
	console.log(`\n${passed} OK, ${failed} FAIL`);
	if (failed > 0) process.exitCode = 1;
}
