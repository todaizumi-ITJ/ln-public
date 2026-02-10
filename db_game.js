/**
 * ============================================================
 *  ゲーム/労務管理DB (db_game.js)
 * ============================================================
 *  書類作成には不要。チーム運営・モチベーション管理用。
 *  db_case.js の USERS.role と actionLog を読み取って動作する。
 *
 *  接続ポイント:
 *    ← USERS（db_case.js）から role を参照
 *    ← actionLog（db_case.js）を読んでポイント計算・昇格判定
 * ============================================================
 */

// ── レベルテーブル（英語軍隊階級、最高位 = Captain） ──
const LEVEL_TABLE = [
  { level: 1, minPt: 0,    title: 'Private' },
  { level: 2, minPt: 100,  title: 'Corporal' },
  { level: 3, minPt: 300,  title: 'Sergeant' },
  { level: 4, minPt: 600,  title: 'Staff Sgt.' },
  { level: 5, minPt: 1000, title: 'Sgt. Major' },
  { level: 6, minPt: 1500, title: '2nd Lieutenant' },
  { level: 7, minPt: 2500, title: '1st Lieutenant' },
  { level: 8, minPt: 4000, title: 'Captain' }
];

// ── ユーザー拡張情報（レベル・ポイント・称号） ──
// USERS（db_case.js）の id をキーにして紐づく
const USER_GAME_DATA = {
  nobunaga:  { level: 3, totalPt: 420,  title: 'Sergeant' },
  hideyoshi: { level: 2, totalPt: 180,  title: 'Corporal' },
  ieyasu:    { level: 1, totalPt: 50,   title: 'Private' },
  masamune:  { level: 5, totalPt: 1200, title: 'Sgt. Major' },
  yukimura:  { level: 4, totalPt: 820,  title: 'Staff Sgt.' },
  kenshin:   { level: 4, totalPt: 650,  title: 'Staff Sgt.' },
  yoritomo:  { level: 7, totalPt: 3200, title: '1st Lieutenant' },
  takauji:   { level: 6, totalPt: 1800, title: '2nd Lieutenant' }
};

// ── 昇格条件データ ──
const PROMOTION_DATA = {
  nobunaga: { from:'beginner', to:'expert', conditions:[
    {label:'LNチェック 30件完了',current:32,target:30,done:true},
    {label:'正確率 90%以上',current:94,target:90,unit:'%',done:true},
    {label:'甲10/甲11確認 500枝番',current:423,target:500,done:false},
    {label:'連続勤務 20日以上',current:25,target:20,unit:'日',done:true},
    {label:'Expert推薦',current:0,target:1,unit:'名',done:false}
  ]},
  hideyoshi: { from:'beginner', to:'expert', conditions:[
    {label:'LNチェック 30件完了',current:18,target:30,done:false},
    {label:'正確率 90%以上',current:88,target:90,unit:'%',done:false},
    {label:'甲10/甲11確認 500枝番',current:210,target:500,done:false},
    {label:'連続勤務 20日以上',current:12,target:20,unit:'日',done:false},
    {label:'Expert推薦',current:0,target:1,unit:'名',done:false}
  ]},
  ieyasu: { from:'beginner', to:'expert', conditions:[
    {label:'LNチェック 30件完了',current:5,target:30,done:false},
    {label:'正確率 90%以上',current:100,target:90,unit:'%',done:true},
    {label:'甲10/甲11確認 500枝番',current:60,target:500,done:false},
    {label:'連続勤務 20日以上',current:3,target:20,unit:'日',done:false},
    {label:'Expert推薦',current:0,target:1,unit:'名',done:false}
  ]},
  masamune: { from:'expert', to:'leader', conditions:[
    {label:'Expert期間 3ヶ月以上',current:4,target:3,unit:'ヶ月',done:true},
    {label:'LN完了 100件',current:112,target:100,done:true},
    {label:'証拠説明書 50件',current:38,target:50,done:false},
    {label:'Beginner指導 3名',current:4,target:3,unit:'名',done:true},
    {label:'差し戻し率 5%以下',current:3.2,target:5,unit:'%',done:true},
    {label:'Leader承認',current:0,target:1,unit:'名',done:false}
  ]},
  yukimura: { from:'expert', to:'leader', conditions:[
    {label:'Expert期間 3ヶ月以上',current:2,target:3,unit:'ヶ月',done:false},
    {label:'LN完了 100件',current:67,target:100,done:false},
    {label:'証拠説明書 50件',current:22,target:50,done:false},
    {label:'Beginner指導 3名',current:2,target:3,unit:'名',done:false},
    {label:'差し戻し率 5%以下',current:4.8,target:5,unit:'%',done:true},
    {label:'Leader承認',current:0,target:1,unit:'名',done:false}
  ]},
  kenshin: { from:'expert', to:'leader', conditions:[
    {label:'Expert期間 3ヶ月以上',current:1,target:3,unit:'ヶ月',done:false},
    {label:'LN完了 100件',current:45,target:100,done:false},
    {label:'証拠説明書 50件',current:15,target:50,done:false},
    {label:'Beginner指導 3名',current:1,target:3,unit:'名',done:false},
    {label:'差し戻し率 5%以下',current:6.1,target:5,unit:'%',done:false},
    {label:'Leader承認',current:0,target:1,unit:'名',done:false}
  ]}
};

// ── ポイント配分（タスク種別 → pt） ──
const POINTS = {
  'ln-check': 10,
  'report': 50,
  'daily': 30,
  'evidence-check': 2,
  'usb-check': 5,
  'doc-check': 5,
  'same-file-check': 10,
  'evidence-statement': 30,
  'appendix-check': 15,
  'box-check': 20,
  'application-create': 50,
  'template-add': 20,
  'ln-deliver': 100,
  'beginner-guide': 50
};

// ── 日次ランク（その日のptに基づく称号） ──
const RANKS = [
  { min: 0,   label: 'スタート地点！', icon: '🌱' },
  { min: 30,  label: 'いい調子！',     icon: '🔥' },
  { min: 80,  label: 'ナイス仕事！',   icon: '⚡' },
  { min: 150, label: 'プロの動き！',   icon: '💎' },
  { min: 250, label: 'MVP級！',        icon: '👑' },
  { min: 400, label: '伝説の一日！',   icon: '🏆' }
];

// ── メンバー業務状況（リーダーボード表示用） ──
const LEADERBOARD_MEMBER_STATUS = {
  nobunaga:  { todayTasks: 'LN確認4件, 証拠チェック20枝番, ボックス詰め1件, 完了報告', situation: '7K14488〜10K14630のLN確認完了。1K14196はボックス詰めまで完了。USB確認も問題なし。' },
  hideyoshi: { todayTasks: 'LN確認3件, 証拠チェック6枝番, 書類確認1件, 完了報告', situation: '12K14661・2A14651・1IM14652の確認完了。2A14651は代表者事項証明書が未着のため要対応フラグ付けました。' },
  ieyasu:    { todayTasks: 'LN確認2件, 証拠チェック4枝番', situation: '1S14671のLN確認完了。7S14487は代表者事項証明書待ちで作業ストップ中。信長さんに質問して進め方を教えてもらいました。' },
  masamune:  { todayTasks: '申立書作成2件, 証拠説明書2件, 別紙確認1件, Beginner指導', situation: '1K14196の申立書＋証拠説明書が完了→河田先生にチェック依頼済み。12K14661も午後に着手して証拠説明書まで完了。家康くんに甲号証の見方を教えました。' },
  yukimura:  { todayTasks: '申立書作成1件, 証拠説明書1件, 同一ファイル照合5件, テンプレ追加', situation: '2A14651の申立書作成完了。同一ファイル照合で問題なし。ブルーコーナー河田版v2のテンプレを追加しました。1SO14655のLN確認も済み。' },
  kenshin:   { todayTasks: '日次チェック, LN確認1件, 申立書作成1件', situation: '6K14640のLN確認→申立書作成に着手。代表者事項証明書が届き次第提出可能な状態まで準備完了。' },
  yoritomo:  { todayTasks: 'LN納品2件, Beginner指導, 要対応LN優先整理, 申立書作成1件', situation: '1K14196と12K14661を裁判所に納品完了。信長くんのLNチェック手順をOJTでフォロー。2N14091・4N14093は委任状の催促を申立人に連絡済み。4N14093の申立書を先に作成中。' },
  takauji:   { todayTasks: 'Beginner指導, LN確認1件, 申立書作成1件, 証拠説明書1件', situation: '秀吉くんの書類確認フォロー完了。1SO14655の申立書＋証拠説明書を作成中。午後はレビュー予定。要対応LNの優先度を源頼朝と共有済み。' }
};

// ── 今月の申立実績/目標 ──
const MONTHLY_RESULTS = {
  yoritomo:  { filed: 12, target: 15 },
  takauji:   { filed: 9,  target: 12 },
  masamune:  { filed: 8,  target: 10 },
  yukimura:  { filed: 5,  target: 8 },
  kenshin:   { filed: 3,  target: 8 },
  nobunaga:  { filed: 2,  target: 5 },
  hideyoshi: { filed: 1,  target: 4 },
  ieyasu:    { filed: 0,  target: 3 }
};

// ── ロール別UI設定 ──
const ROLE_VIEW = {
  beginner: {
    welcomeColor: 'var(--green)',
    flowPara: '<strong>あなた（beginner）の作業は④です。</strong>準備ができたLNを確認し、問題なければ<strong>expertまたは上司</strong>に報告してください。',
    listHint: 'LNをクリック → 作業開始。わからないときは <a href="#" onclick="showPanel(\'manual\'); return false;" style="color: var(--blue);">📚マニュアル</a>',
    desc: '準備ができたLNの確認とCSV・Driveチェックが主な作業です。',
    stats: [
      { val: '32', label: 'LN確認' },
      { val: '25', label: '連続稼働' },
      { val: '423', label: '枝番確認' },
      { val: '420', label: 'pt' }
    ],
    expertPath: [
      { text: 'LNチェック30件', done: true },
      { text: '正確率90%', done: true },
      { text: '枝番確認500', done: false },
      { text: '連続勤務20日', done: true },
      { text: 'Expert推薦', done: false }
    ]
  },
  expert: {
    welcomeColor: 'var(--blue)',
    flowPara: '<strong>あなた（expert）の担当:</strong> LN登録・lo/plリセット・申立書作成・甲号証品質確認など。複数LNの優先度判断も行います。',
    listHint: 'LNをクリックして作業。わからないときは <a href="#" onclick="showPanel(\'manual\'); return false;" style="color: var(--blue);">📚マニュアル</a>',
    desc: 'LN登録・申立書作成・lo/pl対応・甲号証確認などを担当します。',
    stats: [
      { val: '112', label: 'LN完了' },
      { val: '38', label: '証拠説明書' },
      { val: '4', label: '指導済' },
      { val: '1200', label: 'pt' }
    ],
    expertPath: [
      { text: 'Expert期間3ヶ月', done: true },
      { text: 'LN完了100件', done: true },
      { text: '証拠説明書50件', done: false },
      { text: 'Beginner指導3名', done: true },
      { text: '差し戻し率5%以下', done: true },
      { text: 'Leader承認', done: false }
    ]
  },
  leader: {
    welcomeColor: 'var(--purple)',
    flowPara: '<strong>あなた（leader）の担当:</strong> 全体の進捗管理・優先処理の選定・例外対応の承認。チーム指導とメンバーの相談窓口も担います。',
    listHint: 'LN状況・日次レポートで確認。わからないときは <a href="#" onclick="showPanel(\'manual\'); return false;" style="color: var(--blue);">📚マニュアル</a>',
    desc: 'チーム全体の進捗管理と優先度判断を行います。日次レポートで全員分を確認できます。',
    stats: [
      { val: '8', label: 'チーム管理' },
      { val: '156', label: 'LN納品' },
      { val: '8', label: 'メンバー' },
      { val: '3200', label: 'pt' }
    ],
    expertPath: [
      { text: 'リーダーとして活躍中', done: true },
      { text: 'チーム指導', done: true },
      { text: '進捗管理', done: true }
    ]
  }
};

// ── タスク完了メッセージ ──
const COMPLETION_NEXT = {
  beginner: { text: '本日の業務は以上です。レポートを確認してください。', action: 'report' },
  expert:   { text: '本日の業務は以上です。レポートを確認してください。', action: 'report' },
  leader:   { text: '本日の業務は以上です。レポートを確認してください。', action: 'report' }
};
