# Renders App Store screenshots (6.9" iPhone, 1320x2868) from the web export with fictional sample data.
# Usage: npx expo export -p web --output-dir /tmp/webdist  (web.output set to "single")
#        python3 scripts/make-appstore-screenshots.py /tmp/webdist
import http.server, json, os, sys, threading, functools
from playwright.sync_api import sync_playwright

DIST = sys.argv[1] if len(sys.argv) > 1 else "/tmp/webdist"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "store", "app-store", "screenshots-6.9in")

class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k): super().__init__(*a, directory=DIST, **k)
    def do_GET(self):
        p = self.translate_path(self.path.split("?")[0])
        if not os.path.exists(p) or os.path.isdir(p): self.path = "/index.html"
        return super().do_GET()
    def log_message(self, *a): pass

srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8765), H)
threading.Thread(target=srv.serve_forever, daemon=True).start()

PROFILE = {"name": "Bright Path Cleaning Co.", "owner": "Maya Torres", "services": "Home and office cleaning in Austin, TX. Weekly, biweekly and one-time visits.",
           "location": "Austin, TX", "contact": "hello@brightpath.example", "tone": "Friendly, warm and professional", "avoid": "Never promise same-day service"}
INVOICE = """**Invoice** · Bright Path Cleaning Co.

**From:** Bright Path Cleaning Co., Austin, TX · hello@brightpath.example
**Bill to:** Hartley Dental, 214 Congress Ave, Austin, TX

| Item | Qty | Rate | Amount |
| --- | --- | --- | --- |
| Office deep clean | 3 | $250.00 | $750.00 |
| Travel | 1 | $40.00 | $40.00 |

**Subtotal:** $790.00
**Tax:** add rate if applicable
**Total due:** $790.00 · Net 15

Thank you for choosing Bright Path!
"""
REPLY = """Hi Jordan, thanks so much for reaching out! We'd be happy to help. We can fit in a first-time deep clean on Thursday afternoon. Want me to hold a 2 p.m. slot for you? Just reply here and I'll confirm.

Maya, Bright Path Cleaning Co."""
RUNS = [
    {"id": "1", "agentId": "invoice-estimate", "agentName": "Adaeze Nwankwo · Invoice & Estimate", "minutesSaved": 15, "preview": "3 sessions at $250 each, $40 travel", "output": INVOICE, "at": "2026-11-14T17:10:00Z"},
    {"id": "2", "agentId": "reply-writer", "agentName": "Dawit Bekele · Reply Writer", "minutesSaved": 10, "preview": "Hi, do you have openings this week?", "output": REPLY, "at": "2026-11-13T15:30:00Z"},
]

def seed(page):
    page.add_init_script("""(() => { try {
      localStorage.setItem('tr.profile.v1', %s);
      localStorage.setItem('tr.runs.v1', %s);
      localStorage.setItem('tr.aiConsent.v1', '1');
    } catch (e) {} })();""" % (json.dumps(json.dumps(PROFILE)), json.dumps(json.dumps(RUNS))))

with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
    ctx = b.new_context(viewport={"width": 440, "height": 956}, device_scale_factor=3, is_mobile=True, has_touch=True)
    ctx.route("**/api/agents/*/run", lambda r: r.fulfill(status=200, content_type="text/plain",
              body=INVOICE if "/agents/1/" in r.request.url else REPLY))
    page = ctx.new_page(); seed(page)
    base = "http://127.0.0.1:8765"
    def shot(name):
        page.wait_for_timeout(900); page.screenshot(path=f"{OUT}/{name}.png")
    page.goto(base + "/"); shot("01_agents")
    page.goto(base + "/agent/invoice-estimate"); page.wait_for_timeout(600)
    page.get_by_test_id("field-docType").fill("Invoice")
    page.get_by_test_id("field-client").fill("Hartley Dental, 214 Congress Ave, Austin, TX")
    page.get_by_test_id("field-notes").fill("3 office deep cleans at $250 each, $40 travel, net-15")
    shot("02_inputs_photo_scan")
    page.get_by_test_id("run").click(); page.wait_for_timeout(1500); page.mouse.wheel(0, 2000); shot("03_invoice_result")
    page.goto(base + "/activity"); shot("04_activity")
    page.goto(base + "/profile"); shot("05_my_business")
    b.close()
srv.shutdown()
print("done")
