document.getElementById('splitButton').addEventListener('click', splitAndZipCSV);

function setStatus(message, isError = false) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.style.color = isError ? 'var(--coral-red)' : 'var(--light-blue)';
    // Log to console for easier debugging (Right-click extension -> Inspect popup)
    console.log(`Status: ${message}`);
}

function splitAndZipCSV() {
    const fileInput = document.getElementById('csvFileInput');
    const linesPerFile = parseInt(document.getElementById('linesPerFile').value, 10);
    const hasHeader = document.getElementById('hasHeaderCheckbox').checked;

    if (fileInput.files.length === 0) {
        setStatus('Please select a CSV file.', true);
        return;
    }
    if (isNaN(linesPerFile) || linesPerFile <= 0) {
        setStatus('Lines per file must be a positive number.', true);
        return;
    }

    const file = fileInput.files[0];
    setStatus('Reading and processing...');

    Papa.parse(file, {
        skipEmptyLines: true,
        complete: function(results) {
            // Wrap the entire processing logic in a try...catch block
            try {
                const allRows = results.data;

                if (allRows.length === 0) {
                    setStatus('The selected CSV file is empty.', true);
                    return;
                }

                // Determine which rows to process based on the header checkbox
                const dataRowsToProcess = hasHeader ? allRows.slice(1) : allRows;

                if (dataRowsToProcess.length === 0) {
                    setStatus('No data rows found to split (header was removed).', true);
                    return;
                }

                const zip = new JSZip();
                let fileCounter = 0;

                for (let i = 0; i < dataRowsToProcess.length; i += linesPerFile) {
                    fileCounter++;
                    const chunk = dataRowsToProcess.slice(i, i + linesPerFile);
                    
                    // Papa.unparse correctly handles an array of arrays
                    const csvString = Papa.unparse(chunk);
                    
                    const outputFileName = `output_part_${fileCounter}.csv`;
                    zip.file(outputFileName, csvString);
                }

                if (fileCounter === 0) {
                    setStatus('No files were generated.', true);
                    return;
                }

                setStatus('Generating ZIP file...');
                zip.generateAsync({ type: "blob" })
                    .then(function(content) {
                        const url = URL.createObjectURL(content);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'csv_split_files.zip';
                        document.body.appendChild(a);
                        a.click();
                        
                        URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                        
                        setStatus(`Success! ${fileCounter} data-only files created.`, false);
                    })
                    .catch(err => {
                        setStatus(`Error creating ZIP: ${err.message}`, true);
                        console.error('JSZip Error:', err);
                    });

            } catch (e) {
                // This is the crucial part - it will catch any unexpected error
                setStatus(`An unexpected error occurred: ${e.message}`, true);
                console.error('Critical Error in processing:', e);
            }
        },
        error: function(err) {
            // This catches errors during the initial parsing of the file
            setStatus(`Error parsing CSV file: ${err.message}`, true);
            console.error('Papa Parse Error:', err);
        }
    });
}