document.addEventListener('DOMContentLoaded', () => {
  console.log('Mercyhurst Defensive Stats app loaded');
  const info = document.createElement('div');
  info.className = 'build-info';
  info.textContent = `Built: ${new Date().toLocaleString()}`;
  document.body.appendChild(info);
    // Scraping preview: show code snippet when a radio option is selected
    const radioNodes = Array.from(document.querySelectorAll('input[name="scrape"]'));
    const codeEl = document.getElementById('scrape-code');

    const snippets = {
    player: `import requests
from bs4 import BeautifulSoup
import pandas as pd
    
page = requests.get('https://hurstathletics.com/sports/football/stats').text
    
soup = BeautifulSoup(page, 'html.parser')
table = soup.find_all('table')[4]
    
    defensive_stats_table = table

  defensive_headers = []
  thead = defensive_stats_table.find('thead')
  if thead:
    header_tr = thead.find('tr')
    if header_tr:
      defensive_headers = [th.text.strip() for th in header_tr.find_all('th')]

  defensive_rows = []
  for tr in defensive_stats_table.find('tbody').find_all('tr'):
    row_data = []
    cells = tr.find_all(['td', 'th'])
    for cell in cells:
      if cell.find('a'):
        row_data.append(cell.find('a').text.strip())
      elif cell.find('span', class_='mobile-jersey-number'):
        row_data.append(cell.find('span', class_='mobile-jersey-number').find_next_sibling(text=True).strip())
      else:
        row_data.append(cell.text.strip())
    if row_data:
      defensive_rows.append(row_data)

  defensive_df = pd.DataFrame(defensive_rows, columns=defensive_headers)
  defensive_df = defensive_df.drop(columns=['Bio Link'])
  defensive_df`,

    team: `import requests
from bs4 import BeautifulSoup
import pandas as pd
    
page = requests.get('https://hurstathletics.com/sports/football/stats').text
    
    soup = BeautifulSoup(page, 'html.parser')
  tables = soup.find_all('table')

  target_table_index = 13
  table_to_scrape = tables[target_table_index]

  headers_12 = []
  thead_12 = table_to_scrape.find('thead')
  if thead_12:
    header_rows = thead_12.find_all('tr')

    if len(header_rows) == 2:
      main_headers_row = header_rows[0]
      sub_headers_row = header_rows[1]

      main_cells = main_headers_row.find_all('th')
      sub_cells = sub_headers_row.find_all('th')

      current_sub_cell_index = 0
      for main_cell in main_cells:
        main_text = main_cell.get_text(strip=True)
        colspan = int(main_cell.get('colspan', 1))
        rowspan = int(main_cell.get('rowspan', 1))

        if rowspan == 2:
          headers_12.append(main_text)
        elif colspan > 1:
          for _ in range(colspan):
            if current_sub_cell_index < len(sub_cells):
              sub_text = sub_cells[current_sub_cell_index].get_text(strip=True)
              headers_12.append(f"{main_text} - {sub_text}")
              current_sub_cell_index += 1
        else:
          headers_12.append(main_text)
    else:
      first_header_tr = thead_12.find('tr')
      if first_header_tr:
        headers_12 = [th.text.strip() for th in first_header_tr.find_all('th')]

  rows_12 = []
  tbody_12 = table_to_scrape.find('tbody')
  if tbody_12:
    for tr_12 in tbody_12.find_all('tr'):
      row_data_12 = [cell.get_text(strip=True) for cell in tr_12.find_all(['td', 'th'])]
      if row_data_12:
        rows_12.append(row_data_12)

  team_defensive_df = pd.DataFrame(rows_12, columns=headers_12)
  team_defensive_df`,

    opponent: `import requests
from bs4 import BeautifulSoup
import pandas as pd
    
page = requests.get('https://hurstathletics.com/sports/football/stats').text
    
    soup = BeautifulSoup(page, 'html.parser')
  tables = soup.find_all('table')

  target_table_index = 15
  table_to_scrape = tables[target_table_index]

  headers_12 = []
  thead_12 = table_to_scrape.find('thead')
  if thead_12:
    header_rows = thead_12.find_all('tr')

    if len(header_rows) == 2:
      main_headers_row = header_rows[0]
      sub_headers_row = header_rows[1]

      main_cells = main_headers_row.find_all('th')
      sub_cells = sub_headers_row.find_all('th')

      current_sub_cell_index = 0
      for main_cell in main_cells:
        main_text = main_cell.get_text(strip=True)
        colspan = int(main_cell.get('colspan', 1))
        rowspan = int(main_cell.get('rowspan', 1))

        if rowspan == 2:
          headers_12.append(main_text)
        elif colspan > 1:
          for _ in range(colspan):
            if current_sub_cell_index < len(sub_cells):
              sub_text = sub_cells[current_sub_cell_index].get_text(strip=True)
              headers_12.append(f"{main_text} - {sub_text}")
              current_sub_cell_index += 1
        else:
          headers_12.append(main_text)
    else:
      first_header_tr = thead_12.find('tr')
      if first_header_tr:
        headers_12 = [th.text.strip() for th in first_header_tr.find_all('th')]

  rows_12 = []
  tbody_12 = table_to_scrape.find('tbody')
  if tbody_12:
    for tr_12 in tbody_12.find_all('tr'):
      row_data_12 = [cell.get_text(strip=True) for cell in tr_12.find_all(['td', 'th'])]
      if row_data_12:
        rows_12.append(row_data_12)

  opponent_offense_df = pd.DataFrame(rows_12, columns=headers_12)
  opponent_offense_df`
    };

    function showSnippet(key) {
    if (!codeEl) return;
    const text = snippets[key] || 'No snippet available.';
    // place into the code block as text to avoid HTML parsing
    codeEl.textContent = text;
    }

    if (radioNodes.length) {
    radioNodes.forEach(r => r.addEventListener('change', (e) => showSnippet(e.target.value)));
    // initialize with currently checked radio
    const checked = radioNodes.find(r => r.checked) || radioNodes[0];
    if (checked) showSnippet(checked.value);
    }

    // --- Tabs and CSV table loading ---
    const tabButtons = Array.from(document.querySelectorAll('.tab-button'));
    const tabPanels = Array.from(document.querySelectorAll('.tab-panel'));

    function activateTab(targetId) {
      tabButtons.forEach(b => {
        const isActive = b.dataset.target === targetId;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
      tabPanels.forEach(p => {
        if (p.id === targetId) {
          p.classList.add('active');
          p.hidden = false;
        } else {
          p.classList.remove('active');
          p.hidden = true;
        }
      });
    }

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        activateTab(target);
        if (target === 'tab-hurst') loadHurstTables();
        if (target === 'tab-vs') loadVsTables();
      });
    });

    // Simple CSV parser that handles quoted fields
    function parseCSV(text) {
      const rows = [];
      const lines = text.split(/\r?\n/);
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim() === '') continue;
        const cells = [];
        let cur = '';
        let inQuotes = false;
        for (let j = 0; j < line.length; j++) {
          const ch = line[j];
          if (ch === '"') {
            if (inQuotes && line[j+1] === '"') { // escaped quote
              cur += '"'; j++;
            } else {
              inQuotes = !inQuotes;
            }
          } else if (ch === ',' && !inQuotes) {
            cells.push(cur);
            cur = '';
          } else {
            cur += ch;
          }
        }
        cells.push(cur);
        rows.push(cells.map(c => c.trim()));
      }
      return rows;
    }

    function makeTableFromArray(arr) {
      if (!arr || arr.length === 0) return document.createTextNode('No data');
      const table = document.createElement('table');
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      arr[0].forEach(h => {
        const th = document.createElement('th'); th.textContent = h; headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);
      const tbody = document.createElement('tbody');
      for (let i = 1; i < arr.length; i++) {
        const tr = document.createElement('tr');
        arr[i].forEach(cell => {
          const td = document.createElement('td'); td.textContent = cell; tr.appendChild(td);
        });
        tbody.appendChild(tr);
      }
      table.appendChild(tbody);
      return table;
    }

    // Fetch CSV and return parsed array
    async function loadCsvReturnArray(path) {
      try {
        const res = await fetch(path);
        if (!res.ok) throw new Error('Failed to fetch ' + path);
        const text = await res.text();
        const arr = parseCSV(text);
        return arr;
      } catch (err) {
        console.error('Error loading CSV', path, err);
        return null;
      }
    }

    function renderTableFromArray(containerId, arr) {
      const container = document.getElementById(containerId);
      if (!container) return;
      if (!arr) {
        container.textContent = 'No data available';
        return;
      }
      const table = makeTableFromArray(arr);
      container.innerHTML = '';
      container.appendChild(table);
    }

    let hurstLoaded = false;
    async function loadHurstTables() {
      if (hurstLoaded) return;
      hurstLoaded = true;
      const arr1 = await loadCsvReturnArray('/hurst_defensive_stats_2025.csv');
      renderTableFromArray('table-hurst_defensive_stats_2025', arr1);
      const arr2 = await loadCsvReturnArray('/players_avg_tackles.csv');
      renderTableFromArray('table-players_avg_tackles', arr2);
    }

    // Variables to hold parsed arrays for filtering
    let vsLoaded = false;
    let opponentArr = null, teamArr = null, attArr = null;

    async function populateOpponentSelect(values) {
      const sel = document.getElementById('vs-opponent-select');
      if (!sel) return;
      // clear leaving the All Weeks option
      sel.innerHTML = '<option value="__all__">All Weeks</option>';
      const sorted = Array.from(values).sort();
      for (const v of sorted) {
        const opt = document.createElement('option');
        opt.value = v; opt.textContent = v; sel.appendChild(opt);
      }
      sel.addEventListener('change', () => {
        const val = sel.value;
        filterVsTables(val);
      });
    }

    function getUniqueOpponentsFromArrays(arrs) {
      const set = new Set();
      for (const arr of arrs) {
        if (!arr || arr.length === 0) continue;
        const header = arr[0].map(h => h.toLowerCase());
        const idx = header.indexOf('opponent');
        if (idx === -1) continue;
        for (let i = 1; i < arr.length; i++) {
          const row = arr[i];
          if (row[idx]) set.add(row[idx]);
        }
      }
      return set;
    }

    function filterArrayByOpponent(arr, opponent) {
      if (!arr) return null;
      if (opponent === '__all__') return arr;
      if (arr.length === 0) return arr;
      const header = arr[0].map(h => h.toLowerCase());
      const idx = header.indexOf('opponent');
      if (idx === -1) return arr;
      const out = [arr[0]];
      for (let i = 1; i < arr.length; i++) {
        if (arr[i][idx] === opponent) out.push(arr[i]);
      }
      return out;
    }

    async function loadVsTables() {
      if (vsLoaded) return;
      vsLoaded = true;
      opponentArr = await loadCsvReturnArray('/opponent_offense_stats.csv');
      teamArr = await loadCsvReturnArray('/team_defensive_stats.csv');
      attArr = await loadCsvReturnArray('/yards/attemp_vs_Total_tackles.csv');

      // initial render (All Weeks)
      renderTableFromArray('table-opponent_offense_stats', opponentArr);
      renderTableFromArray('table-team_defensive_stats', teamArr);
      renderTableFromArray('table-attemp_vs_Total_tackles', attArr);

      // populate opponent select with unique opponents across arrays
      const opponents = getUniqueOpponentsFromArrays([opponentArr, teamArr, attArr]);
      await populateOpponentSelect(opponents);
    }

    function filterVsTables(opponent) {
      const a1 = filterArrayByOpponent(opponentArr, opponent);
      const a2 = filterArrayByOpponent(teamArr, opponent);
      const a3 = filterArrayByOpponent(attArr, opponent);
      renderTableFromArray('table-opponent_offense_stats', a1);
      renderTableFromArray('table-team_defensive_stats', a2);
      renderTableFromArray('table-attemp_vs_Total_tackles', a3);
      // If filtering to a single opponent, stack the tables vertically for comparison
      const vsContainer = document.getElementById('vs-tables');
      if (vsContainer) {
        if (opponent && opponent !== '__all__') {
          vsContainer.classList.add('filtered');
        } else {
          vsContainer.classList.remove('filtered');
        }
      }
    }

    // initialize first tab active
    activateTab('tab-overview');
});
