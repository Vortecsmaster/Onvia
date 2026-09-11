import fs from "node:fs";
import path from "node:path";
function files(directory: string): string[] {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) =>
      entry.isDirectory()
        ? files(path.join(directory, entry.name))
        : [path.join(directory, entry.name)],
    );
}
test("views and forms never call storage or service adapters", () => {
  for (const file of files("src/features").filter((f) =>
    /(View|Form)\.tsx$/.test(f),
  )) {
    const source = fs.readFileSync(file, "utf8");
    expect({ file, source }).not.toEqual(
      expect.objectContaining({
        source: expect.stringMatching(
          /AsyncStorage|useServices\(|from ["'][^"']*services\//,
        ),
      }),
    );
  }
});
test("qvac sdk is loaded lazily so BareKit is not required during RN bootstrap", () => {
  const qvac = fs.readFileSync("src/services/adapters/qvac.ts", "utf8");
  const sdk = fs.readFileSync("src/services/adapters/qvacSdk.ts", "utf8");
  expect(qvac).not.toMatch(/from ["']@qvac\/sdk["']/);
  expect(qvac).not.toMatch(/require\(["']@qvac\/sdk["']\)/);
  expect(qvac).not.toMatch(/hf:\/\//);
  expect(qvac).toMatch(/HEALTHCARE_1_7B_MEDICAL_Q4_K_M/);
  expect(qvac).toMatch(/medpsy-1.7b-q4_k_m-imat.gguf/);
  expect(qvac).toMatch(/reasoning_budget: 0/);
  expect(qvac).toMatch(/stripThinking/);
  expect(qvac).toMatch(/ensureLoaded/);
  expect(fs.readFileSync("app.json", "utf8")).toMatch(/"versionCode": 2/);
  const composer = fs.readFileSync(
    "src/features/assistant/components/MessageComposer.tsx",
    "utf8",
  );
  expect(composer).toMatch(/assistant\.content\.consultation/);
  expect(composer).not.toMatch(/onSend\(t\(key\)\)/);
  expect(sdk).toMatch(/import\(["']@qvac\/sdk["']\)/);
  expect(fs.readFileSync("package.json", "utf8")).toMatch(
    /"react-native-bare-kit": "0\.14\.5"/,
  );
});
test("route pages remain thin and there is no monolithic App entry", () => {
  expect(fs.existsSync("App.tsx")).toBe(false);
  for (const file of files("src/app").filter(
    (f) => !f.endsWith("_layout.tsx") && f.endsWith(".tsx"),
  )) {
    expect(fs.readFileSync(file, "utf8").split("\n").length).toBeLessThan(50);
  }
});
