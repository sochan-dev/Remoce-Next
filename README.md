# Remoce

閲覧ありがとうございます。
Remoce はリモートワークを円滑にし、生産性・創造性・社員エンゲージメントを向上させる web アプリケーションです。<br />
仮想化したオフィス内で自身のアイコンをドラッグして、アイコン回りのセンサーが他ユーザーのセンサーと触れると通話が開始されます。リアルタイムでユーザー（アイコン）の位置を反映し、複数人の場合はグループ通話になり、センサーが離れたユーザーは通話から退出します。<br>
朝礼、終礼、会議室、個人のデスク、雑談、休憩等決められたエリアをアクセス権限やサイズ、通話可否を設定して作成でき、そのエリア内にアイコンを重ねたユーザーはグループ通話・または入室判定（たばこ休憩中など）となります。

# 利用技術・ライブラリ・フレームワーク等

## フロントエンド

- Next.js
  - Atomic Design
  - Redux Toolkit
  - Custom Hook
  - SSG
  - ISR
- TypeScript
- Scss

## バックエンド

- Express
- TypeScript
- firebase
  Authentication
  - FireStore Database
  - Realtime Database
  - Storage

# ターゲット

リモートワーク・ハイブリッド勤務を実施している組織

# 解決したい問題・ニーズ

**☆ ちょっとした雑談や、小さな質問を連続して気軽に行えるようにしたい！☆**

- リモートだと電話をかけるか、Web 会議を立ち上げるなどワンクッションはさむ必要があり、相手の状況も把握できないため、する側もされる側も億劫。（メールやチャットは非同期でレスポンスが来るので話が進まない）

- 気軽に頻繫に雑談や相談をできるようにし、生産性・創造性を向上させ、チームワークと帰属意識を高めることで社員エンゲージメントの向上を狙う。思いに共感する」「感動する」といった機会を作ることも必要

- 「新しく入った人の顔と名前が一致しない」「人が多い Slack チャンネルでは発言しづらい」「こんなこと言っていいのかな」「大谷選手について話したくなった」を解決したい。

- 雑談を気軽に仕掛けられるようにし、ただ web 会議で目標やビジョン、理由を共有するだけでなく、思想・意見・情報を伝達しあい、共感して納得できるようにし、
  メンバー全員が同じ方向を向くようにする。要は雑談が欲しい。→ 相手の性格や価値観、考え方のクセを垣間見ることができる。

- 在宅勤務によるメンタルケア、オンオフの切り替え、モチベーションの維持

- これまではオフィス勤務で業務への取り組みを間近で見られたため、成果だけでなくプロセスも含めて部下の評価をしていたが、リモートワークでは、プロセスが見えないから評価指標が成果物に依存するため、多角的な業務の評価が難しい。評価される側も成果物だけ見られることを意識するため、短期的な達成感を感じることが出来ず、モチベーションが落ちる。評価する側、される側の双方が納得できる明確な評価基準を設けるとともに、業務のプロセスを見える化するためにデジタルツールの導入が必要。（多分これはある。勤怠管理システムがこれもしてくれるはず）

- 社内の空気が感じ取れない。

## 現状の対策一覧

- 些細なことでも自分から情報を発信する　 → 　話したい時に話したい。意識して発言する時点でストレス。無意識に話せる環境じゃないと改まった文章や言葉になり業務的になる。自然でリラックスしてるとはいえないのでは。
- リモートワークでは雑談をより意識する → 　上記と同じ
- チャットツールでの会話は絵文字や顔文字を活用する　 → 　これが一番効果的に感じた。チャットでは伝わらない感情的な情報をワンクリックで交換できる。楽しい。
- チームメンバーの稼働状況を全員で共有する　 → 　活動する種類に応じてチャンネルを分けたり、ステータスメッセージに記述して共有。しかしチャンネはル細かく分けないと把握できないことがあり、ステータスメッセージはわざわざ見る手間があり、一見して把握できるとは言えない。また、チャンネル内で情報がサイロ化する。
- オンライン会議を積極的に活用する　 → 　会議をわざわざする手間や時間がもったいない。今必要としていないメンバーも参加することもある。

# ニーズ・問題を解決する Remoce の主な機能

## ユーザー同士のアイコンを重ねて通話

    1.自身のアイコンのみをドラッグで動かすことができる。
    1.アイコンの周りの「センサー」（縦横150px程度）が他のユーザーのセンサーと重なると、重なったユーザーのアイコンを囲む「ルーム」（縦横200px程度）ができる。
    1.ルームにアイコンが重なっているユーザーは自動で通話状態になる。生成されたルームに誰でも参加していくことができる。（グループ通話）
    1.ルームの外に自身のアイコンをドラッグすると通話が切断される。ルームに重なっているユーザーが一人以下になると自動でルームは消滅する。

## 業務や目的にエリアを作成

    1.エリア名、エリアの詳細、入室権限、通話可否、サイズ等を設定して、仮想オフィス内にエリアを設置できる。
    1.エリアにアイコンが重なっているユーザーは、センサーが重なっていなくても通話状態になる（通話可否を「可」にしている場合）
        ・朝礼、終礼、会議室、個人のデスク、雑談、休憩等、目的に応じてエリアを任意で設置することで  自由度が高すぎるリモートワークをルール化し制御できる。
        ・個人デスクとしてエリアをユーザー数分用意し、オフィスを再現するのも良い。隣のデスクにアイコンを重ねて気軽に質問や雑談を仕掛けやすい。
        ・たばこ休憩や小休憩の人用のエリアを通話不可で設定し設置すれば、今誰が休憩中かなど勤怠状況を一目で判断できる。

## 通話画面・通話でできること

    - 画面共有機能
    - フルスクリーン
    - ライブスクリーン
    - 均等分割
    - ミュート、ビデオオフ
    - ユーザーのステータス
    - 通話画面の最小化、最適化、最大化
    - 通話画面自体をドラッグできる

# プレビュー・デモ

YouTube：https://youtu.be/roV8HzNCrfo <br>
学校の課題として提出した時点（9 月初旬）の 2 分に収めた動画になります。三人分のユーザーを私一人（pc 一台）で演じて動かしています。

# そもそもリモートワークのメリットとは

- 時間や場所を有効に利用できる
- 労働生産性の向上（デジタル化の推進含む）
- ワーク・ライフ・バランスの向上（育児・介護・治療と仕事の両立）
- 多様な人材の活躍（遠方に居住する社員や障害者等の雇用の維持・創出）
- 組織文化の変革
- 社会課題の解決に向けた貢献（交通機関の混雑緩和、地域活性化等）
- パンデミック対策や自然災害対策等のＢＣＰ対応
- データ等の調査・分析、資料作成など、一人で集中して取り組むことが必要な業務、定例的な報告等のルーティン業務に向いている。

# Issues

- まだ未完成の部分が多く、特にデザインには手をつけていない。
- 「web ブラウザ上でどこまで不自由のないアプリにできるか」といったもう一つの目標を掲げていたが、Nextron,Electron を利用して PWA 化したい。
- 全ての問題やニーズを解決できていない。そもそもこの方法自体最適ではないと思う。

# Author

**HAL 大阪　高度情報処理学科　 3 年（23 卒）　北島壮達（キタジマ　ソウタツ）**

ご連絡はこちらからお願い致します。
**halosakakitajima@gmail.com**
