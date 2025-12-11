# APK 업데이트 가이드

테미 로봇에 설치된 팡씨네 할머니집 앱을 업데이트하는 방법입니다.

## 📋 목차

1. [빠른 시작](#빠른-시작)
2. [자동 업데이트 스크립트 사용](#자동-업데이트-스크립트-사용)
3. [수동 업데이트 방법](#수동-업데이트-방법)
4. [문제 해결](#문제-해결)
5. [팀원을 위한 가이드](#팀원을-위한-가이드)

---

## 🚀 빠른 시작

가장 간단한 방법은 자동 업데이트 스크립트를 사용하는 것입니다:

```bash
cd android
./update-apk.sh
```

스크립트가 자동으로:
1. APK 파일을 찾습니다
2. 테미 로봇에 연결합니다
3. APK를 업데이트합니다

---

## 📦 자동 업데이트 스크립트 사용

### 기본 사용법

```bash
# android 디렉토리에서 실행
cd android
./update-apk.sh
```

### 다른 IP 주소 사용

테미 로봇의 IP 주소가 다른 경우:

```bash
TEMI_IP=192.168.0.17 ./update-apk.sh
```

### 다른 포트 사용

포트 번호가 다른 경우:

```bash
TEMI_IP=192.168.0.20 TEMI_PORT=5556 ./update-apk.sh
```

### 스크립트가 찾는 APK 파일 위치

스크립트는 다음 위치에서 APK 파일을 자동으로 검색합니다:

1. `/tmp/current-app.apk` (이전에 다운로드한 파일)
2. `android/app/build/outputs/apk/release/app-release.apk` (릴리즈 빌드)
3. `android/app/build/outputs/apk/debug/app-debug.apk` (디버그 빌드)
4. `~/Downloads/*pang*.apk` (다운로드 폴더)
5. `~/Downloads/*restaurant*.apk` (다운로드 폴더)
6. `~/Desktop/*pang*.apk` (바탕화면)
7. `~/Desktop/*restaurant*.apk` (바탕화면)

APK 파일을 찾을 수 없으면 스크립트가 경로를 입력하도록 요청합니다.

---

## 🔧 수동 업데이트 방법

스크립트를 사용하지 않고 수동으로 업데이트하는 방법:

### 1. 테미 로봇 연결

```bash
adb connect 192.168.0.20:5555
adb devices
```

연결이 성공하면 다음과 같이 표시됩니다:
```
List of devices attached
192.168.0.20:5555    device
```

### 2. APK 파일 찾기

APK 파일의 위치를 확인합니다:

```bash
# 예시: 릴리즈 APK
ls -lh android/app/build/outputs/apk/release/app-release.apk

# 또는 다른 위치의 APK
ls -lh ~/Downloads/pangssi-restaurant.apk
```

### 3. APK 설치 (업데이트)

```bash
# -r 옵션: 기존 앱이 있으면 업데이트, 없으면 새로 설치
adb install -r /path/to/app-release.apk
```

성공하면 다음과 같이 표시됩니다:
```
Performing Push Install
	pkg: /data/local/tmp/app-release.apk
Success
```

---

## 🐛 문제 해결

### 문제 1: "adb: command not found"

**원인**: ADB가 설치되지 않았거나 PATH에 없습니다.

**해결책**:
```bash
# macOS (Homebrew)
brew install --cask android-platform-tools

# 또는 Android Studio 설치 (ADB 포함)
```

### 문제 2: "unable to connect to 192.168.0.20:5555"

**원인**: 테미 로봇에 연결할 수 없습니다.

**체크리스트**:
- ✅ 로봇과 컴퓨터가 같은 Wi-Fi에 연결되어 있는가?
- ✅ 로봇의 IP 주소가 정확한가? (`192.168.0.20`)
- ✅ 로봇에서 네트워크 디버깅이 활성화되어 있는가?
- ✅ 방화벽이 포트 5555를 차단하지 않는가?

**해결책**:
```bash
# 연결 시도
adb connect 192.168.0.20:5555

# 연결이 안 되면 포트 확인
adb connect 192.168.0.20:5556  # 다른 포트 시도

# 연결 재시도
adb kill-server
adb start-server
adb connect 192.168.0.20:5555
```

### 문제 3: "device unauthorized"

**원인**: 로봇에서 USB 디버깅 허용을 승인하지 않았습니다.

**해결책**:
1. 로봇 화면에서 "USB 디버깅 허용" 팝업 확인
2. "항상 이 컴퓨터에서 허용" 체크
3. "허용" 버튼 클릭

### 문제 4: "APK 파일을 찾을 수 없습니다"

**원인**: 스크립트가 APK 파일을 자동으로 찾지 못했습니다.

**해결책**:
1. APK 파일의 정확한 경로를 확인합니다
2. 스크립트 실행 시 경로를 입력합니다
3. 또는 APK 파일을 다음 위치 중 하나에 복사합니다:
   - `android/app/build/outputs/apk/release/app-release.apk`
   - `~/Downloads/pangssi-restaurant.apk`

### 문제 5: "INSTALL_FAILED_UPDATE_INCOMPATIBLE"

**원인**: 기존 앱과 새 APK의 서명이 다릅니다.

**해결책**:
```bash
# 기존 앱 제거 후 재설치
adb uninstall com.pangssi.restaurant
adb install /path/to/app-release.apk
```

---

## 👥 팀원을 위한 가이드

### 처음 사용하는 경우

1. **ADB 설치 확인**
   ```bash
   adb --version
   ```
   설치되어 있지 않으면:
   ```bash
   brew install --cask android-platform-tools
   ```

2. **테미 로봇 IP 확인**
   - 로봇 화면에서 설정 → 네트워크 → Wi-Fi → IP 주소 확인
   - 또는 팀 리더에게 IP 주소 문의

3. **APK 파일 위치 확인**
   - 팀 리더에게 APK 파일 위치 문의
   - 또는 `android/app/build/outputs/apk/release/app-release.apk` 확인

4. **업데이트 실행**
   ```bash
   cd android
   ./update-apk.sh
   ```

### 자주 사용하는 경우

**간단한 업데이트:**
```bash
cd android
./update-apk.sh
```

**다른 IP 사용:**
```bash
cd android
TEMI_IP=192.168.0.17 ./update-apk.sh
```

### 업데이트 후 확인

1. **앱 실행 확인**
   - 테미 로봇에서 앱이 정상적으로 실행되는지 확인

2. **로그 확인 (필요시)**
   ```bash
   adb logcat | grep -E "MainActivity|TemiInterface"
   ```

3. **앱 재시작 (필요시)**
   ```bash
   adb shell am force-stop com.pangssi.restaurant
   adb shell am start -n com.pangssi.restaurant/.MainActivity
   ```

---

## 📝 유용한 명령어

### 연결 관리

```bash
# 테미 로봇 연결
adb connect 192.168.0.20:5555

# 연결 확인
adb devices

# 연결 해제
adb disconnect 192.168.0.20:5555

# ADB 서버 재시작
adb kill-server
adb start-server
```

### 앱 관리

```bash
# 앱 설치
adb install -r app-release.apk

# 앱 제거
adb uninstall com.pangssi.restaurant

# 앱 재시작
adb shell am force-stop com.pangssi.restaurant
adb shell am start -n com.pangssi.restaurant/.MainActivity

# 설치된 앱 목록
adb shell pm list packages | grep pangssi
```

### 로그 확인

```bash
# 전체 로그
adb logcat

# 특정 태그만 필터링
adb logcat | grep -E "MainActivity|TemiInterface"

# 로그를 파일로 저장
adb logcat > temi_log.txt
```

---

## 🔒 주의사항

1. **네트워크 보안**: 공용 Wi-Fi에서는 ADB 연결을 사용하지 마세요
2. **IP 주소 변경**: 로봇의 IP 주소가 변경될 수 있으므로 정기적으로 확인하세요
3. **APK 파일 백업**: 업데이트 전에 기존 APK 파일을 백업하는 것을 권장합니다

---

## 📞 지원

문제가 발생하면:
1. 이 가이드의 [문제 해결](#문제-해결) 섹션을 확인하세요
2. 팀 리더에게 문의하세요
3. 로그를 수집하여 공유하세요:
   ```bash
   adb logcat > error_log.txt
   ```

---

**마지막 업데이트**: 2024-12-11

