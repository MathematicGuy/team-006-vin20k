#!/usr/bin/env python3
"""Convert .docx files to markdown. Usage: python3 scripts/docx_to_md.py <file.docx> [output.md]"""
import sys
import mammoth

if len(sys.argv) < 2:
    print("Usage: python3 scripts/docx_to_md.py <file.docx> [output.md]")
    sys.exit(1)

input_path = sys.argv[1]
output_path = sys.argv[2] if len(sys.argv) > 2 else input_path.rsplit(".", 1)[0] + ".md"

with open(input_path, "rb") as f:
    result = mammoth.convert_to_markdown(f)

with open(output_path, "w") as f:
    f.write(result.value)

print(f"Saved: {output_path}")
if result.messages:
    for msg in result.messages:
        print(f"  [{msg.type}] {msg.message}")
