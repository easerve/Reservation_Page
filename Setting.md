# SRC

## App 폴더 사용 방향성

- 라우팅 용으로 사용한다(라우팅과 관련된 파일만 넣어놓자.)
- Ex) page.tsx, layout.tsx, opengraph-image.tsx

## Containers 폴더 사용 방향성

- page.tsx 안에서 보여줄 컨텤츠들을 넣어놓는다.
- 전역 상태관리 남발하지 말자.(props drilling을 막기 위해서는 Recoil을 사용하자.)
- states.ts => 작은 단위의 상태관리
- Ex) tsx, css, state, hooks ...

## Components 폴더 사용 방향성

- 여러 페이지에서 공통으로 사용할 컴포넌트
- Button, Loading...

## Constants 폴더 사용 방향성

- 공통으로 사용 할 상수

## Hooks 폴더 사용 방향성

- 페이지 곳곳에서 사용되는 공통 훅

## Libs 폴더 사용 방향성

- 외부 라이브러리를 모아둔다. package.json때문에 쓸 일이 많지 않지만 튜닝해서 사용할 경우 발생

## Services 폴더 사용 방향성

- 각종 API 요청
- GET, POST, PATCH...

## States 폴더 사용 방향성

- 페이지 곳곳에서 사용되는 state를 모아두는 곳

## Types 폴더 사용 방향성

- 각종 타입 스크립트의 정의가 들어가는 곳

# References

- https://miriya.net/blog/cliz752zc000lwb86y5gtxstu
