export type Weekday = '月' | '火' | '水' | '木' | '金' | '土' | '日'

export type WeekPlan = {
  week: number
  block: number
  focus: string
  deliverable: string
}

export type BlockPlan = {
  block: number
  name: string
  weeks: [number, number]
  allocation: { listening: number; reading: number; vocabularyGrammar: number; analysis: number }
}

export type CheckpointTarget = {
  week: number
  studyMinutes: string
  studyDays: string
  vocabulary7d: string
  part2: string
  part34: string
  part5: string
  part7: string
  recurrence: string
  freshTestB: string
}

export const roadmapVersion = 'v1' as const

export const weekdayPlans: ReadonlyArray<{ day: Weekday; minutes: number; title: string }> = [
  { day: '月', minutes: 10, title: '単語retrieval＋発音' },
  { day: '火', minutes: 10, title: 'Listening micro-cycle' },
  { day: '水', minutes: 10, title: 'Part 5' },
  { day: '木', minutes: 10, title: 'Listening micro-cycle' },
  { day: '金', minutes: 10, title: 'Part 7' },
  { day: '土', minutes: 20, title: 'Listening精聴＋shadowing' },
  { day: '日', minutes: 30, title: 'mini-test＋error log＋復習' },
]

export const blocks: ReadonlyArray<BlockPlan> = [
  { block: 1, name: '基礎再構築', weeks: [1, 13], allocation: { listening: 40, reading: 15, vocabularyGrammar: 35, analysis: 10 } },
  { block: 2, name: '短文から会話・説明文へ', weeks: [14, 26], allocation: { listening: 40, reading: 25, vocabularyGrammar: 20, analysis: 15 } },
  { block: 3, name: '単語一致から意味処理へ', weeks: [27, 39], allocation: { listening: 35, reading: 35, vocabularyGrammar: 15, analysis: 15 } },
  { block: 4, name: 'Reading速度とListening一発理解', weeks: [40, 52], allocation: { listening: 35, reading: 40, vocabularyGrammar: 10, analysis: 15 } },
  { block: 5, name: 'TOEIC実戦処理', weeks: [53, 65], allocation: { listening: 35, reading: 40, vocabularyGrammar: 10, analysis: 15 } },
  { block: 6, name: '最終統合', weeks: [66, 78], allocation: { listening: 35, reading: 45, vocabularyGrammar: 5, analysis: 15 } },
]

const rawWeeks: Array<[number, string, string]> = [
  [1, '過去テストA診断', 'L/R別結果、V/S/G/P/A/T/I/C分類'], [2, '単語帳開始＋Part 2', '新規15–20語、P2ミス分類'], [3, '品詞＋VOA Level 1', 'Part5で名詞/動詞/形容詞/副詞を識別'], [4, '音声診断', '聞けない5–15秒を部分dictation'], [5, '動詞・時制・態', 'Part5 10問＋音読'], [6, 'Part 2間接応答', '疑問詞だけで判断しない練習'], [7, 'Part 7短文書', '誰→誰、目的、日時を抽出'], [8, '前置詞・接続詞', '句/節の境界を見る'], [9, 'Part 3導入', '問いを先に把握→音声1回'], [10, 'paraphrase', '言い換え10組をerror logへ'], [11, 'shadowing基礎', '意味確認後に10–20秒×反復'], [12, 'Part5 mixed', '10問正答率70%目標'], [13, 'Checkpoint', 'P2≥65%、P5≥70%、語彙7日後≥75%'],
  [14, 'Part 3人物/場所', 'who/where/whyを1回で取る'], [15, 'Part 3目的', 'purpose問題を集中的に'], [16, 'Part 2否定・婉曲', 'literalな単語一致を避ける'], [17, 'Part 7 email', 'sender/receiver/purpose'], [18, 'VOA Level 1→2', 'transcriptなし初見理解を測定'], [19, 'Part 4 announcements', '冒頭1–2文で状況判断'], [20, 'Part 5語法', '間違えた語法のみ単語帳へ'], [21, 'Reading paraphrase', '問題→本文の言い換え10組'], [22, 'Listening paraphrase', '音声→選択肢言い換え10組'], [23, 'Part 7 notice/ad', 'scanning練習'], [24, 'Part 3長めセット', '3問セットの情報保持'], [25, 'Mixed micro-test', 'P2/P3/P5/P7を各少量'], [26, 'Checkpoint', 'P2≥75%、P3/4≥65%、P5≥75%、P7≥65%'],
  [27, '過去テストA Part3再利用', '初見時との改善を比較'], [28, 'Part7 single passage', '根拠文に線を引く'], [29, 'Part4目的・話者', 'situationを早期特定'], [30, '語彙のchunk化', '単語20個をcollocation化'], [31, 'Part7 double導入', '文書間の役割を区別'], [32, 'Listening memory', '30–45秒の要点を日本語1文で再現'], [33, '文構造', '主節/修飾を高速識別'], [34, 'VOA Level2', 'transcript依存を減らす'], [35, 'Part3 inference', '次の行動・理由を推論'], [36, 'Part7 inference', '根拠＋推論を区別'], [37, 'Mixed 20問', '時間＋正答率を記録'], [38, '弱点集中', '最多error codeだけを練習'], [39, 'Checkpoint', 'L mixed≥70%、R mixed≥70%、語彙≥85%'],
  [40, 'Part 5速度', '10問の時間を記録'], [41, 'Part 7 single timed', '正答率を保って短縮'], [42, 'Part 3 one-pass', 'replayなしで実施'], [43, 'Part 4 one-pass', 'replayなしで実施'], [44, 'double passage', '文書A/Bの対応'], [45, '語彙弱点棚卸し', '未定着語だけに絞る'], [46, 'Part5 mixed', '85%へ接近'], [47, 'Part7 purpose/inference', '言い換え根拠を記録'], [48, 'Listening detail', '数字/日時/場所'], [49, 'longer set', '集中を数分維持'], [50, 'Reading mixed', 'Part5→6→7の切替'], [51, 'Error recycling', '過去8週の再発問題'], [52, 'Checkpoint', 'P3/4≥75%、P5≥85%、P7≥75%'],
  [53, 'L mixed set', 'Part切替を練習'], [54, 'R mixed set', 'Part5→7の配分'], [55, 'Part2弱点', '間接応答/類似音'], [56, 'Part7弱点', 'inference/paraphrase'], [57, 'Part3+4連続', '集中持続'], [58, 'Reading長セット', '20～30分連続練習'], [59, '語彙総復習', '新規語より未定着語'], [60, '過去テストA L再利用', 'error type比較'], [61, '過去テストA R再利用', '時間比較'], [62, 'Listening 1.0x徹底', 'slowdownなしの測定'], [63, 'Part7 multiple docs', '複数資料統合'], [64, 'Mixed mini mock', 'L/R両方'], [65, 'Checkpoint', '各主要Part 75～85%域'],
  [66, '弱点順位決定', '最大2領域だけ選択'], [67, '弱点①集中', '最多error codeを半減'], [68, '弱点②集中', '次点error codeを半減'], [69, 'Listening sustained', '約20～30分連続'], [70, 'Reading sustained', '30～45分連続'], [71, 'Part2/5高速化', '基礎問題で迷わない'], [72, 'Part3/4実戦', '一発理解＋先読み'], [73, 'Part7実戦', 'evidenceを素早く確認'], [74, 'Mixed rehearsal', '時間配分確定'], [75, 'error log総復習', '再発ミスだけ'], [76, '軽い総合演習', '新教材を増やさない'], [77, 'taper', '単語・短い音声中心、疲労を残さない'], [78, 'Fresh Test B', '本番条件、KGI 700+'],
]

export const weeks: ReadonlyArray<WeekPlan> = rawWeeks.map(([week, focus, deliverable]) => ({ week, block: Math.ceil(week / 13), focus, deliverable }))

export const checkpoints: ReadonlyArray<CheckpointTarget> = [
  { week: 13, studyMinutes: '≥100分', studyDays: '≥6日', vocabulary7d: '75%', part2: '65%', part34: '55–60%', part5: '70%', part7: '60%', recurrence: '記録開始', freshTestB: '—' },
  { week: 26, studyMinutes: '≥100', studyDays: '≥6', vocabulary7d: '80%', part2: '75%', part34: '65%', part5: '75%', part7: '65%', recurrence: '<40%', freshTestB: '—' },
  { week: 39, studyMinutes: '≥100', studyDays: '≥6', vocabulary7d: '85%', part2: '80%', part34: '70%', part5: '80%', part7: '70%', recurrence: '<30%', freshTestB: '—' },
  { week: 52, studyMinutes: '≥100', studyDays: '≥6', vocabulary7d: '85%', part2: '80%+', part34: '75%', part5: '85%', part7: '75%', recurrence: '<25%', freshTestB: '—' },
  { week: 65, studyMinutes: '≥100', studyDays: '≥6', vocabulary7d: '85%', part2: '85%', part34: '80%', part5: '85%', part7: '80%', recurrence: '<20%', freshTestB: '—' },
  { week: 78, studyMinutes: '≥100', studyDays: '≥6', vocabulary7d: '85%', part2: '85%', part34: '80%', part5: '85%', part7: '80%', recurrence: '<20%', freshTestB: '700+' },
]

export const missCodes = [
  ['V', 'Vocabulary：単語を知らなかった'], ['S', 'Sound：知っている単語なのに音で分からなかった'], ['G', 'Grammar：構文を誤解した'], ['P', 'Paraphrase：言い換えに気づかなかった'], ['A', 'Attention：途中で情報を落とした'], ['T', 'Time：時間切れ/焦り'], ['I', 'Inference：推論・目的を間違えた'], ['C', 'Careless：見落とし'],
] as const

export const procedures = {
  basic: ['前回内容を何も見ずに思い出す', '今日の問題・音声に初見で挑戦', '答え・transcript・根拠を確認', '同じ課題を再実行', 'ミス原因を1行記録＋次回復習日'],
  listening: ['First listen：transcriptなし・原速で意味を取る', 'Second listen：聞こえなかった位置を特定', 'Check：transcriptと意味を確認', 'Diagnosis：語彙/音/構文/記憶/言い換えを分類', 'Dictation：聞き取れなかった5～15秒だけ書く', 'Shadowing：意味が分かった状態で2～3回', 'Final listen：transcriptなし・原速'],
  speed: [['Week 1–8', 'First listenは1.0倍。難しい箇所の練習時のみ0.85～0.9倍可'], ['Week 9–26', '原則1.0倍'], ['Week 27–52', '1.0倍で一発理解を主目標'], ['Week 53–78', 'テスト練習は必ず1.0倍。習熟素材のみ1.05～1.1倍可']],
}

export const kgi = 'Week 78に、これまで一度も解いていない「過去テストB」を時間制限付きで実施し、付属の正規のスコア換算がある場合にTotal 700以上。理想はL350/R350前後。'
export const csfs = ['継続：100分/週を落とさない', '語彙・文法の自動化：考え込まず処理', 'Listening decoding：音→単語→意味', 'paraphrase処理：同じ語を探さない', 'error-driven practice：ミス原因から次課題を選択']
export const materials = ['手持ち過去テストA：診断・精聴・精読', '手持ち過去テストB：最終測定（Week 78まで封印）', 'IIBC公式サンプル問題：公式形式', '手持ち単語帳：語彙', '手持ちPart 5問題集：文法/高速処理', 'TOEIC公式スマホアプリ：Listening/日常英語', 'IIBC穴埋めエクササイズ：文法・語彙', 'VOA Learning English：段階的Listening/Reading', 'Morite2 TOEIC全パート完全攻略：戦略理解']

export const roadmap = { version: roadmapVersion, blocks, weeks, weekdays: weekdayPlans } as const

export function getWeekPlan(week: number): WeekPlan {
  return weeks[Math.max(1, Math.min(78, week)) - 1]
}

export function getBlockPlan(block: number): BlockPlan {
  return blocks[Math.max(1, Math.min(6, block)) - 1]
}
