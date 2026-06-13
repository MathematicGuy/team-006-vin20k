#!/usr/bin/env python3
"""Look up a đề bài by code from de_bai.xlsx. Usage: python3 scripts/get_de_bai.py AI20K-004"""
import sys, json, os
import openpyxl

XLSX = os.path.join(os.path.dirname(__file__), "..", "private", "de_bai.xlsx")

if len(sys.argv) < 2:
    print("Usage: python3 scripts/get_de_bai.py <AI20K-XXX>")
    sys.exit(1)

code = sys.argv[1].upper()
wb = openpyxl.load_workbook(XLSX)
ws = wb["Ngân Hàng Đề"]

for row in ws.iter_rows(min_row=9, values_only=True):
    if row[1] and row[1].upper() == code:
        print(json.dumps({
            "code": row[1],
            "name": row[2],
            "domain": row[3],
            "technique": row[4],
            "description": row[5],
            "tech_stack": row[6],
            "max_teams": row[7],
            "min_requirements": row[8],
        }, ensure_ascii=False, indent=2))
        sys.exit(0)

print(f"Not found: {code}", file=sys.stderr)
sys.exit(1)
