// jQuery を、ほかのスクリプトより先に window.$ として置く。
// import は書いた順に、読み込む側の本文より先に実行される。application.js の本文で $ を置くと、
// $ を使うスクリプト（プロフィール画像のプレビューなど）のほうが先に動いて「$ is not defined」になり、
// そこから後ろのスクリプト（スワイプ、カードの登録）がすべて動かなくなる
import jquery from "jquery"

window.$ = window.jQuery = jquery
