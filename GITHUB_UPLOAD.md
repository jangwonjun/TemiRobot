# GitHub 업로드 가이드

프로젝트를 GitHub에 업로드하는 방법입니다.

## 방법 1: GitHub 웹사이트에서 리포지토리 생성 (권장)

### 1단계: GitHub에서 새 리포지토리 만들기

1. [GitHub](https://github.com)에 로그인합니다
2. 우측 상단의 **"+"** 버튼 클릭 → **"New repository"** 선택
3. 다음 정보를 입력합니다:
   - **Repository name**: `temi` (또는 원하는 이름)
   - **Description**: "테미 로봇 제어 및 관리 시스템"
   - **Visibility**: Public 또는 Private 선택
   - ⚠️ **중요**: "Initialize this repository with a README" 체크박스는 **체크하지 마세요** (이미 로컬에 파일이 있으므로)
4. **"Create repository"** 버튼 클릭

### 2단계: 로컬 저장소와 연결

GitHub에서 리포지토리를 생성하면 표시되는 명령어를 사용하거나, 아래 명령어를 실행하세요:

```bash
# 원격 저장소 추가 (YOUR_USERNAME을 본인의 GitHub 사용자명으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/temi.git

# 또는 SSH를 사용하는 경우
git remote add origin git@github.com:YOUR_USERNAME/temi.git
```

### 3단계: 코드 업로드

```bash
# 코드를 GitHub에 푸시
git push -u origin main
```

### 4단계: 확인

GitHub 웹사이트에서 리포지토리 페이지를 새로고침하면 모든 파일이 업로드된 것을 확인할 수 있습니다!

---

## 방법 2: GitHub CLI 사용 (설치되어 있는 경우)

GitHub CLI가 설치되어 있다면 다음 명령어로 한 번에 할 수 있습니다:

```bash
gh repo create temi --public --source=. --remote=origin --push
```

---

## 문제 해결

### 오류: "remote origin already exists"
이미 원격 저장소가 설정되어 있다면:
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/temi.git
```

### 오류: 인증 실패
GitHub 인증이 필요할 수 있습니다:
- Personal Access Token 사용
- 또는 SSH 키 설정

---

## 완료 후

업로드가 완료되면:
- ✅ GitHub에서 코드 확인
- ✅ README.md가 자동으로 표시됨
- ✅ 다른 사람과 공유 가능
- ✅ Vercel 등으로 배포 가능

