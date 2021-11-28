# 실행 방법

## 주의 사항

- 고의적으로 .env를 노출했습니다. 과제라서 실행하기 쉽게 만드는 것이 좋다고 판단했습니다.
- 환경 변수 검증을 했습니다.
- 현재(2021년 11월 24일) 기준 LTS인 16버전의 node를 사용하도록 .nvcrc를 작성했습니다.
- babel-plugin-module-resolver를 통해서 절대 경로를 사용할 수 있도록 만들었습니다.
- mongoDB 접속 id와 pw는 root, 1234입니다.
-

## 과제 요구 사항

https://github.com/snuwebprogramming-21-2/final_individual_task

- [ ] /register
- [ ] /login
- [ ] /coins
- [ ] /assets
- [ ] /coins/:coin_name
- [ ] /coins/:coin_name/buy
- [ ] /coins/:coin_name/sell

## 실행 방법

### node 16

(nvm 설치 가정)
nvm use

### mongodb container 실행

    ```
        docker compose up
        or
        docker compose up -d (background)
    ```

### 의존성 설치

npm i

### 구동

npm run start:dev
