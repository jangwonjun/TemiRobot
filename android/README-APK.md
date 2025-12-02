# APK 빌드 및 테미 로봇 설치 가이드

## 🚀 빠른 시작

### 1. APK 빌드

```bash
cd android

# 디버그 APK 빌드 (테스트용)
./gradlew assembleDebug

# 또는 스크립트 사용
./build-apk.sh debug

# 릴리즈 APK 빌드 (배포용)
./gradlew assembleRelease
# 또는
./build-apk.sh release
```

### 2. APK 파일 위치

- **디버그**: `app/build/outputs/apk/debug/app-debug.apk`
- **릴리즈**: `app/build/outputs/apk/release/app-release.apk`

### 3. 테미 로봇에 설치

```bash
# ADB 연결
adb connect [로봇_IP]:5555

# APK 설치
adb install app/build/outputs/apk/debug/app-debug.apk

# 또는 재설치 (기존 앱이 있는 경우)
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

---

## 📦 상세 가이드

자세한 내용은 `docs/apk-build-and-upload-guide.md`를 참고하세요.

---

## 🌐 temi.center 업로드

1. **temi.center 접속**: https://temi.center
2. **개발자 대시보드** → **앱 추가**
3. **앱 정보 입력**:
   - 이름: 팡씨네 할머니집
   - 패키지: com.pangssi.restaurant
   - 버전: 1.0.0
4. **APK 파일 업로드**: `app-release.apk` 선택
5. **스크린샷 및 아이콘 업로드**
6. **제출 및 검토 대기**

---

**준비 완료!** 🎉

