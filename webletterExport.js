/**
 * ============================================================
 *  Webレター差し込みCSVエクスポート (webletterExport.js)
 * ============================================================
 *  - CSVファイルからデータを読み込み
 *  - プロバイダ・カテゴリ・日付でフィルタリング
 *  - Webレター形式のCSVを生成・ダウンロード
 *  - VIPN（仮IPN）を発行し、後でIPNと照合可能
 * ============================================================
 */

// ============================================================
// 定数
// ============================================================
const CSV_SEPARATOR = ',';
const CSV_ENCODING = 'Shift_JIS';
const DATE_FORMAT = 'YYYY年MM月DD日';

// VIPN設定
const VIPN_PREFIX = 'V';  // 仮番号のプレフィックス

// Webレター出力カラム
const OUTPUT_COLUMNS = [
    '管理番号',
    '日付',
    '宛先会社名',
    '郵便番号',
    '住所1',
    '住所2',
    '品番',
    'Infohash',
    'IPアドレス',
    'ポート番号',
    'タイムスタンプ',
    'ホスト名'
];

// ============================================================
// グローバル状態
// ============================================================
let allRecords = [];
let ispCounts = {};
let categoryCounts = {};

// ============================================================
// CSV読み込み・パース
// ============================================================

/**
 * Shift_JISでエンコードされたCSVファイルを読み込み
 * @param {File} file - FileオブジェクトまたはBlob
 * @returns {Promise<string>} UTF-8変換後の文字列
 */
async function readShiftJISFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const decoder = new TextDecoder('shift_jis');
            const text = decoder.decode(e.target.result);
            resolve(text);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

/**
 * CSVテキストをパースしてレコード配列を返す
 * @param {string} csvText - CSVテキスト
 * @param {string} category - カテゴリ名
 * @param {string} sourceType - ソースタイプ (isp/direct)
 * @param {string} productCode - 品番
 * @returns {Array} パース済みレコード配列
 */
function parseCSV(csvText, category, sourceType, productCode) {
    const lines = csvText.split('\n').filter(line => line.trim());
    const records = [];

    for (const line of lines) {
        // CSVパース（クォート対応）
        const parts = parseCSVLine(line);
        if (parts.length < 6) continue;

        const [hash, ip, port, timestamp, hostname, ispName] = parts;

        records.push({
            category,
            sourceType,
            productCode,
            hash: hash.trim(),
            ip: ip.trim(),
            port: parseInt(port.trim(), 10) || 0,
            timestamp: timestamp.trim().replace(/"/g, ''),
            hostname: hostname.trim(),
            ispName: ispName.trim().replace(/"/g, '')
        });
    }

    return records;
}

/**
 * CSV行をパース（クォート対応）
 * @param {string} line - CSV行
 * @returns {Array} フィールド配列
 */
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);

    return result;
}

// ============================================================
// データ集計・フィルタリング
// ============================================================

/**
 * ISPごとの件数を集計
 * @param {Array} records - レコード配列
 * @returns {Object} ISP名 -> 件数 のマップ
 */
function countByISP(records) {
    const counts = {};
    for (const record of records) {
        const isp = normalizeISPName(record.ispName);
        counts[isp] = (counts[isp] || 0) + 1;
    }
    return counts;
}

/**
 * カテゴリごとの件数を集計
 * @param {Array} records - レコード配列
 * @returns {Object} カテゴリ -> 件数 のマップ
 */
function countByCategory(records) {
    const counts = {};
    for (const record of records) {
        counts[record.category] = (counts[record.category] || 0) + 1;
    }
    return counts;
}

/**
 * ISP名を正規化
 * @param {string} ispName - 元のISP名
 * @returns {string} 正規化されたISP名
 */
function normalizeISPName(ispName) {
    if (!ispName) return '不明';

    // Shift_JISの文字化けを考慮
    let name = ispName.replace(/[^\x20-\x7E\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/g, '').trim();

    if (!name) return '不明';

    // 一般的な正規化
    const mappings = {
        'KDDI': ['KDDI', 'au', 'AU'],
        'ソフトバンク': ['SoftBank', 'SOFTBANK', 'Yahoo BB', 'ソフトバンク'],
        'NTTドコモ': ['docomo', 'NTT DOCOMO', 'ドコモ'],
        'NTTコミュニケーションズ': ['OCN', 'NTT Com', 'NTT Communications'],
        'JCOM': ['JCOM', 'J:COM', 'ジェイコム'],
        'ビッグローブ': ['BIGLOBE', 'biglobe'],
        'ニフティ': ['@nifty', 'NIFTY', 'nifty'],
        'ソニーネットワーク': ['So-net', 'NURO', 'ソネット'],
        'GMOインターネット': ['GMO', 'とくとくBB']
    };

    for (const [normalized, aliases] of Object.entries(mappings)) {
        if (aliases.some(alias => name.toLowerCase().includes(alias.toLowerCase()))) {
            return normalized;
        }
    }

    return name;
}

/**
 * レコードをフィルタリング
 * @param {Array} records - 全レコード
 * @param {Object} filters - フィルタ条件
 * @returns {Array} フィルタ済みレコード
 */
function filterRecords(records, filters) {
    return records.filter(record => {
        // ISPフィルタ
        if (filters.isps && filters.isps.length > 0) {
            const normalizedISP = normalizeISPName(record.ispName);
            if (!filters.isps.includes(normalizedISP)) {
                return false;
            }
        }

        // カテゴリフィルタ
        if (filters.categories && filters.categories.length > 0) {
            if (!filters.categories.includes(record.category)) {
                return false;
            }
        }

        // 日付フィルタ
        if (filters.startDate || filters.endDate) {
            const recordDate = parseDate(record.timestamp);
            if (filters.startDate && recordDate < filters.startDate) {
                return false;
            }
            if (filters.endDate && recordDate > filters.endDate) {
                return false;
            }
        }

        // 品番フィルタ
        if (filters.productCodes && filters.productCodes.length > 0) {
            if (!filters.productCodes.includes(record.productCode)) {
                return false;
            }
        }

        return true;
    });
}

/**
 * 日付文字列をDateオブジェクトに変換
 * @param {string} dateStr - 日付文字列 (YYYY/MM/DD HH:MM:SS)
 * @returns {Date} Dateオブジェクト
 */
function parseDate(dateStr) {
    if (!dateStr) return new Date(0);
    // "2023/01/28 04:03:17" 形式
    const [datePart, timePart] = dateStr.split(' ');
    if (!datePart) return new Date(0);

    const [year, month, day] = datePart.split('/').map(Number);
    if (timePart) {
        const [hour, min, sec] = timePart.split(':').map(Number);
        return new Date(year, month - 1, day, hour, min, sec);
    }
    return new Date(year, month - 1, day);
}

// ============================================================
// CSV生成・ダウンロード
// ============================================================

/**
 * Webレター形式のCSVを生成
 * @param {Array} records - エクスポート対象レコード
 * @param {string} targetISP - 送付先ISP
 * @returns {string} CSV文字列
 */
function generateWebletterCSV(records, targetISP) {
    const provider = typeof findProvider === 'function'
        ? findProvider(targetISP)
        : null;

    const today = formatDate(new Date());
    const lines = [OUTPUT_COLUMNS.join(CSV_SEPARATOR)];

    records.forEach((record, index) => {
        const pnNumber = `PN${String(index + 1).padStart(5, '0')}`;

        const row = [
            pnNumber,                                           // 管理番号
            today,                                              // 日付
            provider ? `${provider.fullName} 御中` : targetISP, // 宛先会社名
            provider ? provider.postalCode : '',                // 郵便番号
            provider ? provider.address : '',                   // 住所1
            provider ? (provider.department || '') : '',        // 住所2（部署）
            record.productCode,                                 // 品番
            record.hash,                                        // Infohash
            record.ip,                                          // IPアドレス
            record.port,                                        // ポート番号
            record.timestamp,                                   // タイムスタンプ
            record.hostname                                     // ホスト名
        ];

        lines.push(row.map(v => escapeCSVField(String(v))).join(CSV_SEPARATOR));
    });

    return lines.join('\r\n');
}

/**
 * CSVフィールドをエスケープ
 * @param {string} field - フィールド値
 * @returns {string} エスケープ済みフィールド
 */
function escapeCSVField(field) {
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
        return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
}

/**
 * 日付をフォーマット
 * @param {Date} date - Dateオブジェクト
 * @returns {string} フォーマット済み日付
 */
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}年${month}月${day}日`;
}

/**
 * VIPN（仮IPN）を生成
 * IP + Port + Timestamp + Hash の組み合わせから決定的なユニークIDを生成
 * 後で正式なIPNと照合可能
 * @param {object} record - レコードデータ
 * @returns {string} VIPN
 */
function generateVIPN(record) {
    // 組み合わせからハッシュを生成（決定的アルゴリズム）
    const source = `${record.ip}|${record.port}|${record.timestamp}|${record.hash}`;
    let hashValue = 0;
    for (let i = 0; i < source.length; i++) {
        const char = source.charCodeAt(i);
        hashValue = ((hashValue << 5) - hashValue) + char;
        hashValue = hashValue & hashValue; // 32bit整数に変換
    }
    // 正の16進数に変換し、先頭8文字を使用
    const hashHex = Math.abs(hashValue).toString(16).toUpperCase().padStart(8, '0').substring(0, 8);
    return `${VIPN_PREFIX}${hashHex}`;
}

/**
 * VIPN照合用のマッピングデータを生成
 * 後でIPNと照合するため、VIPNと元データの対応表を出力
 * @param {Array} records - レコード配列
 * @returns {Array} VIPN照合用データ
 */
function generateVIPNMapping(records) {
    return records.map((record) => ({
        vipn: generateVIPN(record),
        ip: record.ip,
        port: record.port,
        timestamp: record.timestamp,
        hash: record.hash,
        productCode: record.productCode,
        exportedAt: new Date().toISOString()
    }));
}

/**
 * VIPN照合用CSVを生成
 * @param {Array} records - レコード配列
 * @returns {string} CSV文字列
 */
function generateVIPNMappingCSV(records) {
    const headers = ['VIPN', 'IPN（後で入力）', 'IPアドレス', 'ポート番号', 'タイムスタンプ', 'Infohash', '品番', 'エクスポート日時'];
    const lines = [headers.join(',')];

    const mappings = generateVIPNMapping(records);
    for (const m of mappings) {
        const row = [
            m.vipn,
            '',  // IPNは後で入力
            m.ip,
            m.port,
            m.timestamp,
            m.hash,
            m.productCode,
            m.exportedAt
        ];
        lines.push(row.map(v => escapeCSVField(String(v))).join(','));
    }

    return lines.join('\r\n');
}

/**
 * CSVファイルをダウンロード（Shift_JIS）
 * @param {string} csvContent - CSV文字列
 * @param {string} filename - ファイル名
 */
function downloadCSV(csvContent, filename) {
    // Shift_JISエンコーディング
    const encoder = new TextEncoder();
    let blob;

    // Shift_JIS対応（encoding.jsがあれば使用、なければUTF-8）
    if (typeof Encoding !== 'undefined') {
        const unicodeArray = Encoding.stringToCode(csvContent);
        const sjisArray = Encoding.convert(unicodeArray, 'SJIS', 'UNICODE');
        const uint8Array = new Uint8Array(sjisArray);
        blob = new Blob([uint8Array], { type: 'text/csv;charset=shift_jis' });
    } else {
        // UTF-8 with BOM
        const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
        blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8' });
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'webletter_export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ============================================================
// UI更新ヘルパー
// ============================================================

/**
 * ISPチェックボックスリストを生成
 * @param {Object} ispCounts - ISP件数マップ
 * @param {HTMLElement} container - コンテナ要素
 */
function renderISPList(ispCounts, container) {
    container.innerHTML = '';

    // 件数でソート
    const sorted = Object.entries(ispCounts)
        .sort((a, b) => b[1] - a[1]);

    for (const [isp, count] of sorted) {
        const label = document.createElement('label');
        label.className = 'isp-item';
        label.innerHTML = `
      <input type="checkbox" name="isp" value="${isp}">
      <span class="isp-name">${isp}</span>
      <span class="isp-count">(${count.toLocaleString()}件)</span>
    `;
        container.appendChild(label);
    }
}

/**
 * カテゴリチェックボックスリストを生成
 * @param {Object} categoryCounts - カテゴリ件数マップ
 * @param {HTMLElement} container - コンテナ要素
 */
function renderCategoryList(categoryCounts, container) {
    container.innerHTML = '';

    // アルファベット順ソート
    const sorted = Object.entries(categoryCounts)
        .sort((a, b) => a[0].localeCompare(b[0]));

    for (const [category, count] of sorted) {
        const label = document.createElement('label');
        label.className = 'category-item';
        label.innerHTML = `
      <input type="checkbox" name="category" value="${category}" checked>
      <span class="category-name">${category}</span>
      <span class="category-count">(${count.toLocaleString()}件)</span>
    `;
        container.appendChild(label);
    }
}

/**
 * プレビューテーブルを生成
 * @param {Array} records - 表示するレコード
 * @param {HTMLElement} container - コンテナ要素
 * @param {number} limit - 表示件数上限
 */
function renderPreviewTable(records, container, limit = 100) {
    const displayRecords = records.slice(0, limit);

    let html = `
    <div class="preview-header">
      <span>表示: ${displayRecords.length}件 / 全${records.length}件</span>
    </div>
    <table class="preview-table">
      <thead>
        <tr>
          <th>No.</th>
          <th>品番</th>
          <th>ISP</th>
          <th>IPアドレス</th>
          <th>ポート</th>
          <th>タイムスタンプ</th>
        </tr>
      </thead>
      <tbody>
  `;

    displayRecords.forEach((record, index) => {
        html += `
      <tr>
        <td>${index + 1}</td>
        <td>${record.productCode}</td>
        <td>${normalizeISPName(record.ispName)}</td>
        <td>${record.ip}</td>
        <td>${record.port}</td>
        <td>${record.timestamp}</td>
      </tr>
    `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

// ============================================================
// エクスポート
// ============================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        parseCSV,
        filterRecords,
        generateWebletterCSV,
        downloadCSV,
        countByISP,
        countByCategory
    };
}
