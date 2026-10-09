"""Produce the offline review copy and editable source archive."""
from pathlib import Path
import re
import base64
import mimetypes
import zipfile

root = Path(__file__).resolve().parent.parent
dist = root / "dist"
output = root / "artifacts"
output.mkdir(exist_ok=True)
html = (dist / "index.html").read_text()
html = re.sub(
    r'<link rel="stylesheet" href="([\w.-]+\.css)">',
    lambda match: "<style>\n" + (dist / match[1]).read_text() + "\n</style>",
    html,
)
html = re.sub(
    r'<script src="([\w.-]+\.js)"></script>',
    lambda match: "<script>\n" + (dist / match[1]).read_text().replace("</script", "<\\/script") + "\n</script>",
    html,
)
assert not re.search(r'(?:src|href)="[\w.-]+\.(?:js|css)"', html)
# Keep the single HTML self-contained when a source composition uses a bundled
# document or illustration. Original bytes also remain in dist inside the ZIP.
for asset in sorted((dist / "assets").rglob("*")) if (dist / "assets").exists() else []:
    if not asset.is_file():
        continue
    relative = asset.relative_to(dist).as_posix()
    if relative not in html:
        continue
    mime = mimetypes.guess_type(asset.name)[0] or "application/octet-stream"
    encoded = base64.b64encode(asset.read_bytes()).decode("ascii")
    html = html.replace(relative, f"data:{mime};base64,{encoded}")
assert not re.search(r"(?:src|href)=[\"']assets/", html), "Unresolved offline asset"
standalone = output / "forma-design-system.html"
standalone.write_text(html)

archive = output / "forma-design-system-source.zip"
with zipfile.ZipFile(archive, "w", zipfile.ZIP_DEFLATED) as bundle:
    for directory in ("dist", "docs", "checks", ".openai", "vendor/hairline/skills/hairline-create", "vendor/spectrum-toast", "vendor/hugeicons", "vendor/design-agents-toolkit"):
        for file in sorted((root / directory).rglob("*")):
            if file.is_file() and "__pycache__" not in file.parts and "node_modules" not in file.parts:
                bundle.write(file, "forma-design-system/" + str(file.relative_to(root)))
    bundle.write(root / "README.md", "forma-design-system/README.md")
    bundle.write(root / "AGENTS.md", "forma-design-system/AGENTS.md")
    bundle.write(root / "vendor/hairline/LICENSE", "forma-design-system/vendor/hairline/LICENSE")
    bundle.write(standalone, "forma-design-system/forma-design-system.html")
with zipfile.ZipFile(archive) as bundle:
    assert bundle.testzip() is None
for file in (standalone, archive):
    print(f"{file.name}: {file.stat().st_size:,} bytes")
