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
test("route pages remain thin and there is no monolithic App entry", () => {
  expect(fs.existsSync("App.tsx")).toBe(false);
  for (const file of files("src/app").filter(
    (f) => !f.endsWith("_layout.tsx") && f.endsWith(".tsx"),
  )) {
    expect(fs.readFileSync(file, "utf8").split("\n").length).toBeLessThan(50);
  }
});
