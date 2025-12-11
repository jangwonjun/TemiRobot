# Vercel 배포를 위한 GitHub Secrets 설정 가이드

Vercel 인증 오류가 발생하는 경우, 주로 `VERCEL_TOKEN`이 없거나 올바르지 않아서 발생합니다. 아래 순서대로 설정을 확인해주세요.

## 1. Vercel Token 생성하기 (한 번만 수행)

1. [Vercel Account Token Settings](https://vercel.com/account/tokens) 페이지로 이동합니다.
2. **Create Token** 버튼을 클릭합니다.
3. 토큰 이름(예: `github-action-deploy`)을 입력하고 **Create**를 누릅니다.
4. 생성된 토큰 값(예: `uO1...`)을 복사합니다. **이 값은 다시 볼 수 없으니 주의하세요!**

## 2. GitHub 저장소에 Secret 등록하기

1. 현재 작업 중인 GitHub 저장소 페이지로 이동합니다.
2. 상단 메뉴에서 **Settings** 탭을 클릭합니다.
3. 왼쪽 사이드바에서 **Secrets and variables** -> **Actions**를 클릭합니다.
4. **New repository secret** 버튼을 클릭합니다.

### 등록해야 할 Secret 목록

아래 3가지 항목을 각각 등록해야 합니다.

| Name | Value | 설명 |
|------|-------|------|
| `VERCEL_TOKEN` | (위 1단계에서 복사한 토큰 값) | Vercel 계정 인증용 토큰 |
| `VERCEL_ORG_ID` | `team_S3xDfVlaRlqXhErMuoof4dj8` | Vercel 조직 ID (이미 확인됨) |
| `VERCEL_PROJECT_ID` | `prj_ybbYaJ0ReV2rsBBpjsRfuaYhpyF9` | Vercel 프로젝트 ID (이미 확인됨) |

## 3. 배포 재시도

Secret 설정이 완료되었다면:
1. GitHub의 **Actions** 탭으로 이동합니다.
2. 실패한 "Vercel Production Deployment" 워크플로우를 클릭합니다.
3. 우측 상단의 **Re-run jobs** 버튼을 눌러 배포를 다시 시도합니다.
