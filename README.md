# CSV Splitter

A Chrome extension that splits a large CSV file into multiple smaller CSV files and downloads them together as a single ZIP archive. Everything runs locally in your browser; no data is uploaded anywhere.

## Features

- Split any CSV into chunks of a configurable number of rows (default: 500)
- Optional header handling: when "First row is a header" is checked, the header row is excluded from the output
- Empty lines are skipped
- Output is bundled into `csv_split_files.zip`, with files named `output_part_1.csv`, `output_part_2.csv`, ...
- Built with [PapaParse](https://www.papaparse.com/) for CSV parsing and [JSZip](https://stuk.github.io/jszip/) for ZIP creation

## Installation (unpacked)

1. Clone or download this repository:
   ```
   git clone https://github.com/samoxin1974/csv_splitter_extension.git
   ```
2. Open `chrome://extensions` in Chrome (or any Chromium-based browser).
3. Enable **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select the cloned folder.
5. Pin the CSV Splitter icon to your toolbar.

## Usage

1. Click the extension icon.
2. Choose a `.csv` file.
3. Set the number of lines per split file.
4. Check or uncheck **First row is a header**.
5. Click **Split and Download ZIP**.

## Notes

- Header rows are not repeated in each output file; with the header checkbox ticked, the header is dropped entirely.
- Manifest V3; the only permission requested is `storage`.

## Project structure

| File | Purpose |
| --- | --- |
| `manifest.json` | Extension manifest (MV3) |
| `popup.html` | Popup UI and styles |
| `popup.js` | Parsing, splitting and ZIP logic |
| `papaparse.min.js`, `jszip.min.js` | Bundled third-party libraries |
| `icons/` | Extension icons |
