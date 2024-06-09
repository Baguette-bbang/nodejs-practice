# 초미니 프로젝트 : 랜덤 데이터 API 사용

## 개요

- 랜덤 데이터 생성 API (외부 API)를 기반으로 한다.
    - https://fakerjs.dev/api/ : npm에서 이미 제공
        - https://www.npmjs.com/package/@faker-js/faker
    - mockaroo
- “가짜” 사용자 정보 생성 API를 생성한다.
- 프로토타입을 개발할 때 사용될 랜덤 데이터를 생성하는 것에 중점을 둘 계획이다.

## 내용

- 랜덤 데이터 생성 API (가짜 사용자, 가짜 상품, 가짜 전화번호 등)
- 가짜 사용자 정보를 생성하는 Express 웹/앱 API

## 사용 및 설치

### 설치

```bash
npm install --save-dev @faker-js/faker
```

### 간단 사용

```jsx
// CJS
const { faker } = require('@faker-js/faker');

console.log(faker.internet.email()); // Gregorio84@hotmail.com
console.log(faker.internet.userName()); // Torrey_Baumbach92
console.log(faker.internet.password()); // vZ6wUA85r1KIRI5
```

## 요구사항

### 사용자 정보
<img width="383" alt="스크린샷 2024-06-09 오후 10 14 33" src="https://github.com/Baguette-bbang/nodejs-practice/assets/122731556/c7c001fe-b98c-47ba-9d3c-46289d6a6d95">
<img width="565" alt="random_user" src="https://github.com/Baguette-bbang/nodejs-practice/assets/122731556/f1e937ae-2446-4235-a6eb-fad4005648bb">
