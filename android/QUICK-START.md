# 🚀 빠른 시작 가이드

## APK 빌드 및 테미 로봇 설치

### 1단계: APK 빌드

#### Android Studio에서 (가장 쉬움)

1. **Android Studio 실행**
2. **File** → **Open** → `android/` 폴더 선택
3. **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
4. 빌드 완료 후 **locate** 클릭
5. APK 파일: `app/build/outputs/apk/debug/app-debug.apk`

#### 명령줄에서

```bash
cd android

# 디버그 APK 빌드
./gradlew assembleDebug

# APK 위치 확인
ls -lh app/build/outputs/apk/debug/app-debug.apk
```

### 2단계: 테미 로봇에 설치

```bash
# 1. ADB 연결 (로봇 IP로 변경)
adb connect 192.168.0.17:5555

# 2. 연결 확인
adb devices

# 3. APK 설치
adb install android/app/build/outputs/apk/debug/app-debug.apk

# 4. 앱 실행
adb shell am start -n com.pangssi.restaurant/.MainActivity
```

### 3단계: temi.center에 업로드

1. **https://temi.center 접속**
2. **로그인** (개발자 계정 필요)
3. **개발자 대시보드** → **앱 추가**
4. **앱 정보 입력**:
   - 이름: 팡씨네 할머니집
   - 패키지: com.pangssi.restaurant
   - 버전: 1.0.0
5. **APK 파일 업로드**: `app-release.apk` 선택
6. **스크린샷 및 아이콘 업로드**
7. **제출**

---

## ⚠️ 중요 사항

### 릴리즈 APK 빌드 시

1. **서명 키 생성** (한 번만):
   ```bash
   keytool -genkey -v -keystore pangssi-restaurant.keystore -alias pangssi -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **build.gradle에 서명 설정 추가** (주석 해제 및 비밀번호 입력)

3. **프로덕션 URL 설정**: `build.gradle`의 `WEB_URL`을 실제 도메인으로 변경

---

## 📚 자세한 가이드

- **전체 가이드**: `docs/apk-build-and-upload-guide.md`
- **Android 설정**: `android/README.md`

---

**준비 완료!** 🎉

