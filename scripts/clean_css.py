#!/usr/bin/env python3
"""
Simple CSS cleaner: keeps first occurrence of each selector block and writes a cleaned file.
Usage: python scripts/clean_css.py
Outputs: css/estilos.clean.css
"""
import re
from pathlib import Path

src = Path('css/estilos.css')
out = Path('css/estilos.clean.css')
if not src.exists():
    print('Source CSS not found:', src)
    raise SystemExit(1)
text = src.read_text(encoding='utf-8')

# Very small parser: find selector blocks using brace matching
i = 0
n = len(text)
seen = set()
blocks = []

while i < n:
    # skip whitespace
    if text[i].isspace():
        i += 1
        continue
    # find next '{'
    j = text.find('{', i)
    if j == -1:
        # remaining tail
        tail = text[i:].strip()
        if tail:
            blocks.append(('__tail__', tail))
        break
    selector = text[i:j].strip()
    # find matching closing brace
    depth = 0
    k = j
    while k < n:
        if text[k] == '{':
            depth += 1
        elif text[k] == '}':
            depth -= 1
            if depth == 0:
                break
        k += 1
    if k >= n:
        # malformed; take rest
        block = text[i:]
        blocks.append((selector, block))
        break
    block = text[i:k+1]
    # for selectors that include commas, handle each individually
    sel_keys = [s.strip() for s in selector.split(',') if s.strip()]
    key = ','.join(sel_keys)
    blocks.append((key, block))
    i = k+1

out_blocks = []
for key, block in blocks:
    if key == '__tail__':
        out_blocks.append(block)
        continue
    if key in seen:
        # skip duplicate selector block
        continue
    seen.add(key)
    out_blocks.append(block)

out.write_text('\n\n'.join(out_blocks), encoding='utf-8')
print('Wrote cleaned CSS to', out)
