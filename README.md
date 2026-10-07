<img src="./public/logo.svg" alt="Slice 로고" width="50" />

# Slice

목표를 작은 조각(할 일)으로 나누어 관리하고, 대시보드로 진행 상황을 확인하며, 노트로 학습 내용을 정리하는 웹 애플리케이션

- 프로젝트 기간 : 2025.11.21 - 2026.01.05
- 배포 주소 : [https://slice-todo.vercel.app](https://slice-todo.vercel.app)

## 기술 스택

- **Language**: TypeScript
- **Framework**: React 19, Next.js 15 (App Router)
- **State Management**: TanStack Query, Zustand
- **Styling**: Tailwind CSS 4
- **Library**: Tiptap, Framer Motion, Sonner
- **Testing**: Jest, Testing Library, Storybook
- **CI/CD**: GitHub Actions, Vercel

## 서비스 화면

### 랜딩 페이지

- 서비스 소개 및 주요 기능을 소개합니다.
- `시작하기` 버튼을 통해 로그인 상태에 따라 대시보드 또는 로그인 페이지로 이동합니다.

| 랜딩 페이지 (<a href="https://github.com/jjinheeWorld">이진희</a>) |
| :----------------------------------------------------------------: |
|      <img width="1435" height="770" alt="랜딩 페이지" src="https://github.com/user-attachments/assets/949a0d85-a91b-4b8f-ad72-7a7f3a253ab1" />       |

### 로그인 / 회원가입

- 로그인: 이메일과 비밀번호 입력을 통해 계정을 인증합니다.
- 회원가입: 이름, 이메일, 비밀번호에 대한 유효성 검사를 통해 계정을 생성합니다.

| 로그인 / 회원가입 (<a href="https://github.com/swallowedB">최보아</a>) |
| :--------------------------------------------------------------------: |
|        <img width="1435" height="770" alt="로그인 : 회원가입" src="https://github.com/user-attachments/assets/5c1c00ac-e0d4-4c1c-a5df-09b2ba786fe6" />         |

### 네비게이션 사이드바

- 대시보드와 목표 상세 페이지로 이동할 수 있는 네비게이션을 제공하며, 목표와 할 일을 추가할 수 있습니다.
- 로그인한 계정 정보를 확인하고 로그아웃할 수 있습니다.

| 네비게이션 사이드바 (<a href="https://github.com/swallowedB">최보아</a>) |
| :----------------------------------------------------------------------: |
|         <img width="1435" height="770" alt="네비게이션 사이드바" src="https://github.com/user-attachments/assets/e4cf242a-8b6d-4515-bf81-94f6920b0e23" />          |

### 대시보드

- 최근 등록한 할 일: 가장 최근에 생성한 할 일을 확인하고, `모두 보기` 버튼을 통해 모든 할 일 페이지로 이동할 수 있습니다.
- 내 진행 상황: 완료된 할 일과 미완료 할 일의 비율을 통해 현재 진행 상황을 확인할 수 있습니다.
- 목표별 할 일: 목표별 할 일 목록을 확인하고, 각 목표에 할 일을 추가할 수 있습니다. 목표가 2개를 초과하면 무한 스크롤로 목표 목록이 추가됩니다.

| 대시보드 (<a href="https://github.com/goodaseul">정다슬</a>) |
| :----------------------------------------------------------: |
|   <img width="1435" height="770" alt="대시보드" src="https://github.com/user-attachments/assets/cf964508-3278-4e9d-8e33-c781fe592e90" />    |

### 목표 상세

- 특정 목표의 상세 정보를 조회하고, 목표명을 수정하거나 삭제할 수 있습니다.
- 목표에 포함된 할 일들의 완료 여부를 기준으로 목표 진행 상황을 확인할 수 있습니다.
- `노트 모아보기` 버튼을 통해 목표에 속한 할 일들의 노트를 모아보는 페이지로 이동합니다.

| 목표 상세 (<a href="https://github.com/goodaseul">정다슬</a>) |
| :-----------------------------------------------------------: |
|    <img width="1435" height="770" alt="목표 상세" src="https://github.com/user-attachments/assets/6e033d38-b017-495c-98fa-7b139fbf29e4" />    |

### 모든 할 일

- 등록한 모든 할 일 목록을 확인하고, 새로운 할 일을 추가할 수 있습니다. 할 일이 40개를 초과할 경우 무한 스크롤로 할 일 목록이 추가됩니다.
- 해야 할 일(TODO)과 완료된 일(DONE)로 필터링하여 할 일을 확인할 수 있습니다.
- 케밥 버튼을 통해 할 일을 수정하거나 삭제할 수 있으며, 노트 작성 여부에 따라 노트 작성하기 또는 노트 수정하기 페이지로 이동할 수 있습니다.

| 모든 할 일 (<a href="https://github.com/iyxxnjin">나윤진</a>) |
| :-----------------------------------------------------------: |
|    <img width="1435" height="770" alt="모든 할 일" src="https://github.com/user-attachments/assets/1180a0ef-3e07-4f17-b228-b511861a4155" />    |

### 할 일 생성 및 수정 모달

- 제목, 자료 첨부, 목표 선택을 통해 할 일을 생성하거나 수정할 수 있습니다.
- 입력 값 유효성 검사를 통과한 경우에만 생성 또는 수정이 가능하며, 닫기 버튼 클릭 시 확인 후 이전 화면으로 돌아갑니다.

| 할 일 생성 및 수정 모달 (<a href="https://github.com/iyxxnjin">나윤진</a>) |
| :------------------------------------------------------------------------: |
|          <img width="1435" height="770" alt="할 일 작성 및 수정" src="https://github.com/user-attachments/assets/6c32b357-98ba-4e95-a6cb-73086601277d" />           |

### 노트 모아보기

- 목표에 속한 모든 할 일의 노트를 최신 저장 순으로 확인할 수 있습니다.
- 각 노트에는 노트 제목과 해당 할 일 제목, 해야 할 일(TODO) / 완료된 일(DONE)이 함께 표시됩니다.
- 노트 클릭 시 노트 상세가 사이드 보기로 열리며, 케밥 버튼을 통해 노트 수정 페이지로 이동하거나 노트를 삭제할 수 있습니다.

| 노트 모아보기 (<a href="https://github.com/jjinheeWorld">이진희</a>) |
| :------------------------------------------------------------------: |
|       <img width="1435" height="770" alt="노트 모아보기" src="https://github.com/user-attachments/assets/420c1c3c-252f-460b-a3a3-9aa9d4dc0aba" />        |

### 노트 작성 및 수정

- 할 일에 대한 노트를 작성하고 수정할 수 있으며, 링크를 첨부할 수 있는 에디터를 통해 노트 제목과 본문을 입력해 학습 내용을 정리할 수 있습니다.
- 첨부된 링크가 있는 경우, 링크 클릭 시 노트 내부에서 링크 콘텐츠의 임베드를 확인할 수 있습니다.
- 작성 중인 노트는 5분마다 자동으로 임시 저장되며, 임시 저장 버튼을 통해 수동 저장도 가능합니다. 저장된 노트를 불러와 이전 작업을 이어서 작성할 수 있습니다.

| 노트 작성 및 수정 (<a href="https://github.com/jjinheeWorld">이진희</a>) |
| :----------------------------------------------------------------------: |
|         <img width="1435" height="770" alt="노트 작성 및 수정" src="https://github.com/user-attachments/assets/703afeca-472c-49a7-8846-d11959507f15" />          |

### 노트 상세

- 노트의 목표 및 할 일 제목, 노트 제목, 노트 마지막 저장일, 상세 내용을 확인할 수 있습니다.
- 첨부된 링크가 있는 경우, 링크 클릭 시 노트 내부에서 링크 콘텐츠의 임베드를 확인할 수 있습니다.
- 노트 상세는 클릭 시 사이드 보기로 열리며, URL 직접 접근이나 새로고침 시 전체 페이지로 전환됩니다.<br />
  (Parallel Routes와 Intercepting Routes를 활용)

| 노트 상세 (<a href="https://github.com/jjinheeWorld">이진희</a>) |
| :--------------------------------------------------------------: |
|     <img width="1435" height="770" alt="노트 상세" src="https://github.com/user-attachments/assets/ea5143ca-efe0-4b0b-b799-30330ea4e2e7" />      |

## 팀원 소개

|                                                                                       최보아                                                                                        |                                                                                   나윤진                                                                                    |                                                                                           이진희                                                                                            |                                                                                     정다슬                                                                                      |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| <a href="https://github.com/swallowedB"><img src="https://avatars.githubusercontent.com/swallowedB" width="100" /></a><br /><a href="https://github.com/swallowedB">@swallowedB</a> | <a href="https://github.com/iyxxnjin"><img src="https://avatars.githubusercontent.com/iyxxnjin" width="100" /></a><br /><a href="https://github.com/iyxxnjin">@iyxxnjin</a> | <a href="https://github.com/jjinheeWorld"><img src="https://avatars.githubusercontent.com/jjinheeWorld" width="100" /></a><br /><a href="https://github.com/jjinheeWorld">@jjinheeWorld</a> | <a href="https://github.com/goodaseul"><img src="https://avatars.githubusercontent.com/goodaseul" width="100" /></a><br /><a href="https://github.com/goodaseul">@goodaseul</a> |
