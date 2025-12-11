#!/bin/bash

# 팡씨네 할머니집 APK 빌드 및 배포 스크립트
# APK 빌드 → ADB 연결 → APK 설치를 자동으로 수행합니다.

set -e  # 에러 발생 시 스크립트 중단

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 설정 (환경 변수로 오버라이드 가능)
TEMI_IP=${TEMI_IP:-"192.168.0.20"}
TEMI_PORT=${TEMI_PORT:-"5555"}
PACKAGE_NAME="com.pangssi.restaurant"
BUILD_TYPE=${1:-release}

echo -e "${BLUE}🍽️ 팡씨네 할머니집 APK 빌드 및 배포${NC}"
echo ""

# 스크립트 위치로 이동
cd "$(dirname "$0")"

# ============================================
# 1. APK 빌드
# ============================================
echo -e "${YELLOW}📦 Step 1: APK 빌드 중...${NC}"

if [ "$BUILD_TYPE" = "release" ]; then
    echo "   릴리즈 APK 빌드 중..."
    ./gradlew assembleRelease
    
    if [ $? -eq 0 ]; then
        APK_PATH="app/build/outputs/apk/release/app-release.apk"
        echo -e "${GREEN}   ✅ 릴리즈 APK 빌드 완료!${NC}"
    else
        echo -e "${RED}   ❌ 빌드 실패${NC}"
        exit 1
    fi
else
    echo "   디버그 APK 빌드 중..."
    ./gradlew assembleDebug
    
    if [ $? -eq 0 ]; then
        APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
        echo -e "${GREEN}   ✅ 디버그 APK 빌드 완료!${NC}"
    else
        echo -e "${RED}   ❌ 빌드 실패${NC}"
        exit 1
    fi
fi

# APK 파일 존재 확인
if [ ! -f "$APK_PATH" ]; then
    echo -e "${RED}   ❌ APK 파일을 찾을 수 없습니다: $APK_PATH${NC}"
    exit 1
fi

# APK 파일 크기 표시
APK_SIZE=$(ls -lh "$APK_PATH" | awk '{print $5}')
echo -e "${GREEN}   📁 APK 위치: $APK_PATH (크기: $APK_SIZE)${NC}"
echo ""

# ============================================
# 2. ADB 연결 확인
# ============================================
echo -e "${YELLOW}🔌 Step 2: ADB 연결 확인...${NC}"

# ADB 설치 확인
if ! command -v adb &> /dev/null; then
    echo -e "${RED}   ❌ ADB가 설치되어 있지 않습니다.${NC}"
    echo "   설치 방법:"
    echo "   - macOS: brew install --cask android-platform-tools"
    echo "   - 또는 Android Studio 설치"
    exit 1
fi

# ADB 서버 시작
echo "   ADB 서버 시작 중..."
adb start-server > /dev/null 2>&1

# 기존 연결 확인
echo "   기존 연결 확인 중..."
CONNECTED_DEVICES=$(adb devices | grep -v "List" | grep "device" | wc -l | tr -d ' ')

if [ "$CONNECTED_DEVICES" -eq 0 ]; then
    echo "   연결된 디바이스가 없습니다. 새로 연결 시도 중..."
    
    # ADB 연결 시도
    echo -e "   ${BLUE}테미 로봇에 연결 중: ${TEMI_IP}:${TEMI_PORT}${NC}"
    adb connect "${TEMI_IP}:${TEMI_PORT}" > /dev/null 2>&1
    
    # 연결 대기 (최대 5초)
    sleep 2
    
    # 연결 확인
    if adb devices | grep -q "${TEMI_IP}:${TEMI_PORT}.*device"; then
        echo -e "${GREEN}   ✅ 테미 로봇 연결 성공!${NC}"
    else
        echo -e "${RED}   ❌ 테미 로봇 연결 실패${NC}"
        echo ""
        echo "   문제 해결 방법:"
        echo "   1. 로봇과 컴퓨터가 같은 Wi-Fi에 연결되어 있는지 확인"
        echo "   2. 로봇에서 네트워크 디버깅이 활성화되어 있는지 확인"
        echo "   3. 로봇 IP 주소가 올바른지 확인 (현재: $TEMI_IP)"
        echo "   4. 환경 변수로 IP 변경: TEMI_IP=192.168.0.XX ./deploy-apk.sh"
        echo ""
        echo "   수동 연결 시도:"
        echo "   adb connect ${TEMI_IP}:${TEMI_PORT}"
        exit 1
    fi
else
    echo -e "${GREEN}   ✅ 이미 연결된 디바이스가 있습니다.${NC}"
    adb devices
fi

echo ""

# ============================================
# 3. 기존 앱 제거 (선택사항)
# ============================================
echo -e "${YELLOW}🗑️  Step 3: 기존 앱 확인...${NC}"

if adb shell pm list packages | grep -q "$PACKAGE_NAME"; then
    echo "   기존 앱이 설치되어 있습니다. 제거 중..."
    adb uninstall "$PACKAGE_NAME" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}   ✅ 기존 앱 제거 완료${NC}"
    else
        echo -e "${YELLOW}   ⚠️  기존 앱 제거 실패 (계속 진행)${NC}"
    fi
else
    echo "   기존 앱이 없습니다."
fi

echo ""

# ============================================
# 4. APK 설치
# ============================================
echo -e "${YELLOW}📱 Step 4: APK 설치 중...${NC}"

echo "   APK 설치 중: $APK_PATH"
adb install -r "$APK_PATH"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}   ✅ APK 설치 완료!${NC}"
else
    echo -e "${RED}   ❌ APK 설치 실패${NC}"
    exit 1
fi

echo ""

# ============================================
# 5. 완료
# ============================================
echo -e "${GREEN}🎉 배포 완료!${NC}"
echo ""
echo "다음 단계:"
echo "  1. 테미 로봇에서 앱을 실행하세요"
echo "  2. 로그 확인: adb logcat | grep -E 'TemiApp|TemiInterface'"
echo "  3. 앱 재시작: adb shell am force-stop $PACKAGE_NAME && adb shell am start -n $PACKAGE_NAME/.MainActivity"
echo ""
echo "유용한 명령어:"
echo "  - 로그 확인: adb logcat"
echo "  - 앱 제거: adb uninstall $PACKAGE_NAME"
echo "  - 연결 확인: adb devices"
echo ""

