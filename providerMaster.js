/**
 * ============================================================
 *  プロバイダマスタ (providerMaster.js)
 * ============================================================
 *  Webレター送付先の正式名称・住所情報
 *  発信者情報開示請求の主要宛先を収録
 * ============================================================
 */

const PROVIDER_MASTER = {
    // ============================================================
    // 大手キャリア
    // ============================================================
    'KDDI': {
        fullName: 'KDDI株式会社',
        postalCode: '102-8460',
        address: '東京都千代田区飯田橋3丁目10番10号 ガーデンエアタワー',
        department: '渉外・広報本部 法務部',
        aliases: ['au', 'AU', 'KDDI株式会社']
    },
    'ソフトバンク': {
        fullName: 'ソフトバンク株式会社',
        postalCode: '105-7529',
        address: '東京都港区海岸一丁目7番1号 東京ポートシティ竹芝オフィスタワー',
        department: '法務本部',
        aliases: ['SoftBank', 'SOFTBANK', 'ソフトバンク株式会社']
    },
    'NTTドコモ': {
        fullName: '株式会社NTTドコモ',
        postalCode: '100-6150',
        address: '東京都千代田区永田町2丁目11番1号 山王パークタワー',
        department: '法務部',
        aliases: ['docomo', 'ドコモ', 'NTT docomo']
    },

    // ============================================================
    // 固定回線系
    // ============================================================
    'NTTコミュニケーションズ': {
        fullName: 'NTTコミュニケーションズ株式会社',
        postalCode: '100-8019',
        address: '東京都千代田区大手町2丁目3番1号 大手町プレイスウエストタワー',
        department: '法務部',
        aliases: ['NTT Com', 'OCN', 'NTT Communications']
    },
    'NTT東日本': {
        fullName: '東日本電信電話株式会社',
        postalCode: '163-8019',
        address: '東京都新宿区西新宿3丁目19番2号',
        department: '法務部',
        aliases: ['NTT EAST', 'フレッツ', 'FLET\'S']
    },
    'NTT西日本': {
        fullName: '西日本電信電話株式会社',
        postalCode: '534-0024',
        address: '大阪府大阪市都島区東野田町4丁目15番82号',
        department: '法務部',
        aliases: ['NTT WEST']
    },

    // ============================================================
    // CATV・ケーブル系
    // ============================================================
    'JCOM': {
        fullName: 'JCOM株式会社',
        postalCode: '100-0005',
        address: '東京都千代田区丸の内1丁目8番1号 丸の内トラストタワーN館',
        department: '法務部',
        aliases: ['J:COM', 'ジェイコム', 'ジュピターテレコム']
    },

    // ============================================================
    // ISP（インターネットサービスプロバイダ）
    // ============================================================
    'ビッグローブ': {
        fullName: 'ビッグローブ株式会社',
        postalCode: '140-0002',
        address: '東京都品川区東品川4丁目12番4号 品川シーサイドパークタワー',
        department: '法務部',
        aliases: ['BIGLOBE', 'biglobe']
    },
    'ニフティ': {
        fullName: 'ニフティ株式会社',
        postalCode: '160-0023',
        address: '東京都新宿区西新宿1丁目23番7号 新宿ファーストウエスト',
        department: '法務部',
        aliases: ['@nifty', 'NIFTY']
    },
    'ソニーネットワークコミュニケーションズ': {
        fullName: 'ソニーネットワークコミュニケーションズ株式会社',
        postalCode: '140-0002',
        address: '東京都品川区東品川4丁目12番3号 品川シーサイドTSタワー',
        department: '法務部',
        aliases: ['So-net', 'NURO', 'ソネット']
    },
    'GMOインターネット': {
        fullName: 'GMOインターネットグループ株式会社',
        postalCode: '150-8512',
        address: '東京都渋谷区桜丘町26番1号 セルリアンタワー',
        department: '法務部',
        aliases: ['GMO', 'GMOとくとくBB', 'お名前.com']
    },
    'インターリンク': {
        fullName: '株式会社インターリンク',
        postalCode: '171-0022',
        address: '東京都豊島区南池袋2丁目49番7号 池袋パークビル',
        department: '',
        aliases: ['INTERLINK', 'interlink']
    },

    // ============================================================
    // IXP・接続事業者
    // ============================================================
    'インターネットマルチフィード': {
        fullName: 'インターネットマルチフィード株式会社',
        postalCode: '100-0004',
        address: '東京都千代田区大手町1丁目3番2号 経団連会館',
        department: '',
        aliases: ['MFEED', 'mfeed', 'transix']
    },
    'アルテリア・ネットワークス': {
        fullName: 'アルテリア・ネットワークス株式会社',
        postalCode: '105-0001',
        address: '東京都港区虎ノ門4丁目1番1号 神谷町トラストタワー',
        department: '法務部',
        aliases: ['ARTERIA', 'UCOM', 'アルテリア']
    },

    // ============================================================
    // 電力系
    // ============================================================
    'オプテージ': {
        fullName: '株式会社オプテージ',
        postalCode: '540-8622',
        address: '大阪府大阪市中央区城見2丁目1番5号 オプテージビル',
        department: '法務部',
        aliases: ['eo光', 'eo', 'OPTAGE', 'ケイ・オプティコム']
    },
    'STNet': {
        fullName: '株式会社STNet',
        postalCode: '760-0072',
        address: '香川県高松市花園町2丁目6番1号',
        department: '',
        aliases: ['ピカラ', 'PIKARA']
    },

    // ============================================================
    // その他
    // ============================================================
    '楽天モバイル': {
        fullName: '楽天モバイル株式会社',
        postalCode: '158-0094',
        address: '東京都世田谷区玉川1丁目14番1号 楽天クリムゾンハウス',
        department: '法務部',
        aliases: ['Rakuten', 'rakuten']
    }
};

/**
 * ISP名からプロバイダマスタ情報を検索
 * @param {string} ispName - CSVに記載されているISP名
 * @returns {object|null} プロバイダ情報 or null
 */
function findProvider(ispName) {
    if (!ispName) return null;

    const normalized = ispName.trim();

    // 完全一致検索
    if (PROVIDER_MASTER[normalized]) {
        return { key: normalized, ...PROVIDER_MASTER[normalized] };
    }

    // エイリアス検索
    for (const [key, provider] of Object.entries(PROVIDER_MASTER)) {
        if (provider.aliases && provider.aliases.some(alias =>
            normalized.includes(alias) || alias.includes(normalized)
        )) {
            return { key, ...provider };
        }
    }

    // 部分一致検索
    for (const [key, provider] of Object.entries(PROVIDER_MASTER)) {
        if (normalized.includes(key) || key.includes(normalized) ||
            provider.fullName.includes(normalized) || normalized.includes(provider.fullName)) {
            return { key, ...provider };
        }
    }

    return null;
}

/**
 * 全プロバイダ一覧を取得
 * @returns {Array} プロバイダ一覧
 */
function getAllProviders() {
    return Object.entries(PROVIDER_MASTER).map(([key, data]) => ({
        key,
        ...data
    }));
}

// ESModules / CommonJS 両対応
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PROVIDER_MASTER, findProvider, getAllProviders };
}
