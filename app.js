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
});
