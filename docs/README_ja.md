# sql-learning-app

## データ準備・クエリ実行をローカル環境のサーバーに向け、Navicat等でSQLのトライ&エラーをする手順

1. 本リポジトリをclone
1. `config/nginx/nginx.conf`のproxy_passを自身の環境に合わせて修正
1. `docker-compose.yaml`の`nginx`のコメントアウトを解除
1. `docker-compose.yaml`の`serverless-mysql-http_sql_learning_app`をコメントアウト
1. `$ docker compose up -d`
1. `$ yarn mysql:create:db:sandbox`でsandboxというデータベースを作成
1. `$ yarn dev:server`
1. Webアプリの`/`ページの`SQL実行環境の設定`でエンドポイントを`https://192.168.56.5:443`と設定
1. Chromeで一度`https://192.168.56.5:443`にアクセスし、保護されていないがアクセスするか？でアクセスするをクリックして一度ローカルのサーバーにリクエストを送信する  
   （これをしないと`net::ERR_CERT_AUTHORITY_INVALID`になり、ローカルのサーバーにリクエストができない）  
    ローカルは自己署名証明書（CA発行ではない）を利用してNginxでHTTPSサーバー化しているので、この手順が必須
