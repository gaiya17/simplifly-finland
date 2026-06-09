import sys

file_path = r"c:\Users\ASUS\Documents\Projects\Simplifly Finland\frontend\src\app\sri-lanka-tours\[categoryId]\[packageId]\TourPackageClient.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

tabs_start = 363
tabs_end = 590

tabs_content = lines[tabs_start:tabs_end]
del lines[tabs_start:tabs_end]

insert_idx = -1
for i in range(len(lines)):
    if "      </section>" in lines[i] and "      {/* Lightbox */}" in lines[i+2]:
        insert_idx = i
        break

if insert_idx != -1:
    tabs_wrapped = [
        "        {/* ── TABS SECTION (FULL WIDTH) ── */}\n",
        "        <div className=\"mt-16 lg:mt-24 w-full\">\n"
    ] + tabs_content + [
        "        </div>\n"
    ]
    lines = lines[:insert_idx] + tabs_wrapped + lines[insert_idx:]
    with open(file_path, "w", encoding="utf-8") as f:
        f.writelines(lines)
    print("Successfully moved Tabs section.")
else:
    print("Could not find insertion point!")
