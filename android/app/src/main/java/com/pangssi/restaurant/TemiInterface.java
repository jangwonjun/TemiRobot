package com.pangssi.restaurant;

import android.util.Log;
import android.webkit.JavascriptInterface;
import com.robotemi.sdk.Robot;
import com.robotemi.sdk.TtsRequest;

/**
 * WebView에서 JavaScript로 테미 로봇을 제어하기 위한 인터페이스
 * 
 * 사용법:
 * - JavaScript에서 window.temi.goTo("1") 호출
 * - JavaScript에서 window.temi.speak("안녕하세요") 호출
 * - JavaScript에서 window.temi.dance() 호출
 */
public class TemiInterface {

    private static final String TAG = "TemiInterface";
    private final Robot robot;

    /**
     * Robot 객체를 받아서 TemiInterface를 생성합니다.
     * 
     * @param robot Temi Robot 인스턴스
     */
    public TemiInterface(Robot robot) {
        this.robot = robot; // 전달받은 Robot 객체 사용
        Log.d(TAG, "TemiInterface initialized with Robot instance");
    }

    /**
     * 테미 로봇을 특정 위치(waypoint)로 이동시킵니다.
     * 
     * @param location waypoint 이름 (예: "1", "2", "3", "4" 또는 "table-1", "entrance" 등)
     * 
     * 사용 예시:
     * - window.temi.goTo("1")  // 테이블 1로 이동
     * - window.temi.goTo("2")  // 테이블 2로 이동
     */
    @JavascriptInterface
    public void goTo(String location) {
        Log.d(TAG, "goTo called with: " + location);
        if (robot != null) {
            robot.goTo(location);
            Log.d(TAG, "Robot goTo command sent: " + location);
        } else {
            Log.e(TAG, "Robot instance is null");
        }
    }

    /**
     * 테미 로봇이 음성으로 말합니다.
     * 
     * @param content 말할 내용
     * 
     * 사용 예시:
     * - window.temi.speak("2번 테이블로 안내해드리겠습니다.")
     */
    @JavascriptInterface
    public void speak(String content) {
        Log.d(TAG, "speak called with: " + content);
        if (robot != null) {
            TtsRequest request = TtsRequest.create(
                    content,                     // 말할 내용
                    true,                        // isShowOnConversationLayer
                    TtsRequest.Language.KO_KR    // 언어 (한국어)
            );
            robot.speak(request);
            Log.d(TAG, "Robot speak command sent: " + content);
        } else {
            Log.e(TAG, "Robot instance is null");
        }
    }

    /**
     * 간단한 춤 동작을 실행합니다.
     * 자바스크립트에서 window.temi.dance() 로 호출 가능합니다.
     * 
     * 사용 예시:
     * - window.temi.dance()
     */
    @JavascriptInterface
    public void dance() {
        Log.d(TAG, "dance called");
        if (robot != null) {
            // 춤 동작은 시간이 걸리므로 별도 스레드에서 실행하는 것이 좋습니다.
            new Thread(() -> {
                try {
                    // 1. 왼쪽으로 360도 회전
                    robot.turnBy(350, 1.0f);
                    Thread.sleep(2000); // 회전 시간 대기
                    
                    // 2. 고개 끄덕이기 (리듬)
                    robot.tiltAngle(20, 1.0f);
                    Thread.sleep(500);
                    robot.tiltAngle(-10, 1.0f);
                    Thread.sleep(500);
                    robot.tiltAngle(20, 1.0f);
                    Thread.sleep(500);
                    
                    // 3. 제자리 뱅글뱅글 (SkidJoy)
                    // linearVelocity(전진): 0, angularVelocity(회전): 1.0 (최대 속도)
                    long startTime = System.currentTimeMillis();
                    while (System.currentTimeMillis() - startTime < 3000) { // 3초 동안
                        robot.skidJoy(0.0f, 1.0f);
                        Thread.sleep(100); // 명령 주기적 전송 필요
                    }
                    robot.stopMovement(); // 멈춤
                    
                    // 4. 마무리
                    robot.tiltAngle(0, 1.0f); // 고개 정면
                    Log.d(TAG, "Dance completed");
                } catch (InterruptedException e) {
                    Log.e(TAG, "Dance interrupted", e);
                }
            }).start();
        } else {
            Log.e(TAG, "Robot instance is null");
        }
    }

    /**
     * 테미 로봇을 정지시킵니다.
     * 
     * 사용 예시:
     * - window.temi.stop()
     */
    @JavascriptInterface
    public void stop() {
        Log.d(TAG, "stop called");
        if (robot != null) {
            robot.stopMovement();
            Log.d(TAG, "Robot stop command sent");
        } else {
            Log.e(TAG, "Robot instance is null");
        }
    }

    /**
     * 테미 로봇의 현재 위치를 반환합니다.
     * 
     * @return 현재 위치의 waypoint 이름
     * 
     * 사용 예시:
     * - var location = window.temi.getCurrentLocation()
     */
    @JavascriptInterface
    public String getCurrentLocation() {
        Log.d(TAG, "getCurrentLocation called");
        if (robot != null) {
            String location = robot.getCurrentLocation();
            Log.d(TAG, "Current location: " + location);
            return location;
        } else {
            Log.e(TAG, "Robot instance is null");
            return "";
        }
    }
}

