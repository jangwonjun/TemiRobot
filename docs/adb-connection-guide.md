# 테미 로봇 ADB 연결 가이드

테미 로봇은 안드로이드 기반이므로 ADB (Android Debug Bridge)를 통해 연결할 수 있습니다.

## 📋 목차

1. [ADB 설치](#adb-설치)
2. [테미 로봇 설정](#테미-로봇-설정)
3. [ADB 연결](#adb-연결)
4. [연결 확인 및 사용](#연결-확인-및-사용)
5. [문제 해결](#문제-해결)

---

## 🔧 ADB 설치

### macOS에서 ADB 설치

#### 방법 1: Homebrew 사용 (권장)

```bash
# Homebrew가 설치되어 있다면
brew install --cask android-platform-tools
```

#### 방법 2: Android SDK Platform Tools 직접 설치

1. [Android Platform Tools 다운로드](https://developer.android.com/tools/releases/platform-tools)
2. 압축 해제
3. `adb` 파일을 PATH에 추가하거나 직접 사용

#### 방법 3: Android Studio 설치

Android Studio를 설치하면 ADB가 함께 설치됩니다.

### 설치 확인

```bash
adb --version
```

정상적으로 설치되었다면 버전 정보가 표시됩니다.

---

## 🤖 테미 로봇 설정

ADB로 연결하려면 테미 로봇에서 다음 설정이 필요합니다:

### 1. 개발자 모드 활성화

1. 테미 로봇 화면에서 **설정** → **시스템 정보**로 이동
2. **빌드 번호** (Build Number)를 **7번 연속 터치**
3. "개발자 모드가 활성화되었습니다" 메시지 확인

### 2. USB 디버깅 활성화

1. 설정 메뉴에 **"개발자 옵션"** (Developer Options)이 추가됨
2. **개발자 옵션** → **USB 디버깅** 활성화
3. **네트워크 디버깅** (Network Debugging) 활성화 (ADB over Wi-Fi 사용 시)

### 3. 네트워크 디버깅 포트 확인

- 기본 포트: **5555**
- 테미 로봇의 설정에서 포트 번호를 확인하거나 변경할 수 있습니다

---

## 🔌 ADB 연결

### 기본 연결 명령어

```bash
adb connect 172.100.6.175:5555
```

**참고**: 포트 번호를 생략하면 기본값 5555가 사용됩니다.

```bash
# 포트 번호 명시 (권장)
adb connect 172.100.6.175:5555

# 또는 포트 번호 생략 (기본 5555)
adb connect 172.100.6.175
```

### 연결 확인

```bash
adb devices
```

성공적으로 연결되었다면 다음과 같이 표시됩니다:

```
List of devices attached
172.100.6.175:5555    device
```

---

## ✅ 연결 확인 및 사용

### 1. 연결 상태 확인

```bash
adb devices
```

### 2. 로그 확인

```bash
# 실시간 로그 확인
adb logcat

# 특정 태그만 필터링
adb logcat -s TemiApp

# 로그를 파일로 저장
adb logcat > temi_log.txt
```

### 3. 쉘 접근

```bash
# Android 쉘 접근
adb shell

# 쉘에서 명령어 실행
adb shell ls /sdcard
adb shell pm list packages
```

### 4. 파일 전송

```bash
# 로컬 파일을 로봇으로 전송
adb push local_file.txt /sdcard/

# 로봇에서 파일 다운로드
adb pull /sdcard/file.txt ./
```

### 5. 앱 설치/제거

```bash
# APK 설치
adb install app.apk

# 앱 제거
adb uninstall com.example.app

# 설치된 앱 목록
adb shell pm list packages
```

---

## 🐛 문제 해결

### 문제 1: "adb: command not found"

**해결책**: ADB가 설치되지 않았거나 PATH에 없습니다.

```bash
# Homebrew로 설치
brew install --cask android-platform-tools

# 또는 Android Studio 설치
```

### 문제 2: "unable to connect to 172.100.6.175:5555"

**체크리스트**:
- ✅ 로봇과 컴퓨터가 같은 Wi-Fi 네트워크에 연결되어 있는가?
- ✅ 로봇의 IP 주소가 정확한가? (`172.100.6.175`)
- ✅ 로봇에서 네트워크 디버깅이 활성화되어 있는가?
- ✅ 방화벽이 포트 5555를 차단하지 않는가?

**해결책**:
```bash
# 연결 시도
adb connect 172.100.6.175:5555

# 연결이 안 되면 포트 확인
adb connect 172.100.6.175:5556  # 다른 포트 시도

# 연결 재시도
adb kill-server
adb start-server
adb connect 172.100.6.175:5555
```

### 문제 3: "device unauthorized"

**해결책**: 로봇 화면에서 USB 디버깅 허용 확인을 승인해야 합니다.

1. 로봇 화면에 "USB 디버깅 허용" 팝업이 나타남
2. "항상 이 컴퓨터에서 허용" 체크
3. "허용" 버튼 클릭

### 문제 4: 연결은 되지만 "unauthorized" 상태

```bash
adb devices
# 출력: 172.100.6.175:5555    unauthorized
```

**해결책**:
1. 로봇에서 USB 디버깅 허용
2. 또는 `adb kill-server && adb start-server` 후 재연결

### 문제 5: 포트가 다를 수 있음

테미 로봇의 ADB 포트가 5555가 아닐 수 있습니다. 다음을 시도해보세요:

```bash
# 일반적인 ADB 포트들
adb connect 172.100.6.175:5555
adb connect 172.100.6.175:5556
adb connect 172.100.6.175:5037
```

---

## 📱 테미 로봇 IP 주소 확인

로봇의 IP 주소를 확인하는 방법:

1. **로봇 화면에서**:
   - 설정 → 네트워크 → Wi-Fi → 연결된 네트워크
   - IP 주소 확인

2. **테미 앱에서**:
   - 로봇 정보에서 IP 주소 확인

3. **네트워크 스캔**:
   ```bash
   # 같은 네트워크에서 테미 로봇 찾기
   nmap -sn 192.168.1.0/24  # 네트워크 범위에 맞게 수정
   ```

---

## 💡 유용한 ADB 명령어

```bash
# 로봇 재부팅
adb reboot

# 로봇 정보 확인
adb shell getprop ro.build.version.release
adb shell getprop ro.product.model

# 화면 캡처
adb shell screencap /sdcard/screenshot.png
adb pull /sdcard/screenshot.png ./

# 화면 녹화
adb shell screenrecord /sdcard/record.mp4
# Ctrl+C로 중지 후
adb pull /sdcard/record.mp4 ./

# 앱 실행
adb shell am start -n com.robotemi.launcher/.MainActivity

# 현재 실행 중인 앱 확인
adb shell dumpsys window windows | grep -E 'mCurrentFocus'
```

---

## 🔒 보안 주의사항

1. **네트워크 디버깅**: 공용 Wi-Fi에서는 사용하지 마세요
2. **인증**: 로봇 화면에서 디버깅 허용을 신중하게 선택하세요
3. **포트**: 방화벽에서 불필요한 포트는 차단하세요

---

## 📚 참고 자료

- [Android ADB 공식 문서](https://developer.android.com/tools/adb)
- [테미 공식 문서](https://www.robotemi.com)
- [테미 개발자 포럼](https://forum.robotemi.com)

---

**마지막 업데이트**: 2025년 1월

