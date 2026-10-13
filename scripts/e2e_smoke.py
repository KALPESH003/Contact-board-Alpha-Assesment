# Optional browser smoke test: `npm run build && npx vite preview --port 4173`, then `python3 scripts/e2e_smoke.py` (needs `pip install playwright`).
from playwright.sync_api import sync_playwright, expect
import sys
URL="http://localhost:4173/"
fails=[]
def check(name, cond):
    print(("PASS " if cond else "FAIL ")+name)
    if not cond: fails.append(name)

with sync_playwright() as p:
    b=p.chromium.launch()
    pg=b.new_page(viewport={'width':1440,'height':874})
    errs=[]
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.on("console", lambda m: errs.append(m.text) if m.type=="error" else None)
    pg.goto(URL); pg.wait_for_selector("table")
    pg.screenshot(path="/tmp/s1_table.png")

    # 1. edit from table, save -> board sync
    pg.get_by_role("button", name="Open details for Amara Okafor").click()
    dlg=pg.get_by_role("dialog"); expect(dlg).to_be_visible()
    check("focus moved into dialog", pg.evaluate("document.querySelector('[role=dialog]').contains(document.activeElement)"))
    check("save disabled when clean", dlg.get_by_role("button",name="Save changes").is_disabled())
    dlg.get_by_label("Customer").check(force=True)
    dlg.get_by_label("Notes").fill("Signed the pilot.")
    check("unsaved indicator", dlg.get_by_text("Unsaved changes").is_visible())
    pg.screenshot(path="/tmp/s2_panel.png")
    dlg.get_by_role("button",name="Save changes").click()
    check("panel closed", pg.get_by_role("dialog").count()==0)
    check("toast shown", pg.get_by_text("Moved Amara Okafor to Customer.").is_visible())
    check("focus returned to row button", pg.evaluate("document.activeElement.getAttribute('data-contact-id')")=="c-001")
    check("still table view", pg.get_by_role("tab",name="Table").get_attribute("aria-selected")=="true")
    pg.get_by_role("tab",name="Board").click()
    cust=pg.locator("section[aria-labelledby='column-Customer']")
    check("Amara now in Customer column", cust.get_by_text("Amara Okafor").count()==1)
    check("Amara gone from Lead", pg.locator("section[aria-labelledby='column-Lead']").get_by_text("Amara Okafor").count()==0)
    check("no duplicate cards", pg.locator("[data-contact-id='c-001']").count()==1)
    pg.screenshot(path="/tmp/s3_board.png")

    # 2. undo
    pg.get_by_role("button",name="Undo").click()
    check("undo restores to Lead", pg.locator("section[aria-labelledby='column-Lead']").get_by_text("Amara Okafor").count()==1)

    # 3. cancel discards (Esc) and board edit
    pg.locator("[data-contact-id='c-002']").click()
    dlg=pg.get_by_role("dialog")
    dlg.get_by_label("Notes").fill("THROWAWAY")
    dlg.get_by_label("Qualified").check(force=True)
    pg.keyboard.press("Escape")
    check("esc closes", pg.get_by_role("dialog").count()==0)
    check("board view preserved after close", pg.get_by_role("tab",name="Board").get_attribute("aria-selected")=="true")
    check("focus back on card", pg.evaluate("document.activeElement.getAttribute('data-contact-id')")=="c-002")
    pg.locator("[data-contact-id='c-002']").click()
    check("cancelled notes restored", "THROWAWAY" not in pg.get_by_role("dialog").get_by_label("Notes").input_value())
    check("cancelled stage restored", pg.get_by_role("dialog").get_by_label("Prospect").is_checked())
    # focus trap
    for _ in range(14): pg.keyboard.press("Tab")
    check("focus trapped in dialog", pg.evaluate("document.querySelector('[role=dialog]').contains(document.activeElement)"))
    pg.get_by_role("button",name="Cancel").click()

    # 4. drag and drop
    src=pg.locator("[data-contact-id='c-007']")
    dst=pg.locator("section[aria-labelledby='column-Customer']")
    src.drag_to(dst)
    check("drag moved Sofia to Customer", dst.get_by_text("Sofia Marchetti").count()==1)
    pg.get_by_role("button",name="Undo").click()
    check("undo of drag", dst.get_by_text("Sofia Marchetti").count()==0)

    # 5. keyboard move Alt+Right
    pg.locator("[data-contact-id='c-004']").focus()
    pg.keyboard.press("Alt+ArrowRight")
    check("alt+right moves to Prospect", pg.locator("section[aria-labelledby='column-Prospect']").get_by_text("Jonas Eriksson").count()==1)
    check("focus kept on moved card", pg.evaluate("document.activeElement.getAttribute('data-contact-id')")=="c-004")

    # 6. search + table filters + sort
    pg.get_by_role("tab",name="Table").click()
    pg.keyboard.press("Escape")
    pg.get_by_role("searchbox").fill("retail")
    check("search narrows rows", pg.locator("tbody tr").count()==2)
    check("count pill", "2 of 10" in pg.locator("header").inner_text())
    pg.get_by_role("searchbox").fill("zzzz")
    check("no results state", pg.get_by_text("No contacts found").is_visible())
    pg.get_by_role("button",name="Clear search and filters").click()
    check("cleared", pg.locator("tbody tr").count()==10)
    pg.get_by_role("button",name="Customer",exact=False).first.click()
    check("customer filter empty -> no results", pg.get_by_text("No contacts found").is_visible())
    pg.get_by_role("button",name="Clear search and filters").click()
    pg.get_by_role("button",name="Name",exact=False).first.click()
    first=pg.locator("tbody tr").first.inner_text()
    check("sorted asc by name", first.strip().startswith("AO") or "Amara" in first)
    pg.keyboard.press("/")  # shortcut when body focused
    pg.screenshot(path="/tmp/s4_after.png")

    # 7. narrower viewport
    pg.set_viewport_size({'width':900,'height':700})
    pg.screenshot(path="/tmp/s5_narrow.png")
    pg.get_by_role("tab",name="Board").click()
    pg.screenshot(path="/tmp/s6_narrow_board.png")
    check("no page-level horizontal overflow at 900px", pg.evaluate("document.documentElement.scrollWidth<=window.innerWidth"))
    check("no console errors", len(errs)==0)
    if errs: print(errs)
    b.close()
print("FAILS:",fails); sys.exit(1 if fails else 0)
