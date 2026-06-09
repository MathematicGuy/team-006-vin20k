# Cross-Reference Rules by Pack

Pack-specific bidirectional-link rules that extend the core rules in `README.md`.
The linter reads this file only when the corresponding pack is installed.

---

## Core cross-reference rules

These apply in all workspaces regardless of installed packs.

| Forward link                        | Required reverse link                     | Exemption? |
|-------------------------------------|-------------------------------------------|------------|
| `sources/A` -> `concepts/B`         | `concepts/B` -> `sources/A`              | No         |
| `sources/A` -> `people/C`           | `people/C` -> `sources/A`               | No         |
| `concepts/K` -> `sources/E`         | `sources/E` -> `concepts/K`             | No         |
| `summary/S` -> `concepts/K`         | `concepts/K` -> `summary/S`             | No         |
| Any -> `outputs/**`                  | (no reverse required)                   | Yes        |
| Any -> `*://*`                       | (no reverse required — external URL)    | Yes        |
