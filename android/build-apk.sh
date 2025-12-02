#!/bin/bash

# 팡씨네 할머니집 APK 빌드 스크립트

echo "🍽️ 팡씨네 할머니집 APK 빌드 시작..."

cd "$(dirname "$0")"

# 빌드 타입 선택
BUILD_TYPE=${1:-debug}

if [ "$BUILD_TYPE" = "release" ]; then
    echo "📦 릴리즈 APK 빌드 중..."
    ./gradlew assembleRelease
    
    if [ $? -eq 0 ]; then
        echo "✅ 릴리즈 APK 빌드 완료!"
        echo "📁 위치: app/build/outputs/apk/release/app-release.apk"
        
        # APK 파일 크기 확인
        ls -lh app/build/outputs/apk/release/app-release.apk
    else
        echo "❌ 빌드 실패"
        exit 1
    fi
else
    echo "🔧 디버그 APK 빌드 중..."
    ./gradlew assembleDebug
    
    if [ $? -eq 0 ]; then
        echo "✅ 디버그 APK 빌드 완료!"
        echo "📁 위치: app/build/outputs/apk/debug/app-debug.apk"
        
        # APK 파일 크기 확인
        ls -lh app/build/outputs/apk/debug/app-debug.apk
    else
        echo "❌ 빌드 실패"
        exit 1
    fi
fi

echo ""
echo "📱 테미 로봇에 설치하려면:"
echo "   adb install app/build/outputs/apk/$BUILD_TYPE/app-$BUILD_TYPE.apk"

