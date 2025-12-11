package com.pangssi.restaurant;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.util.Log;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import androidx.appcompat.app.AppCompatActivity;
import com.robotemi.sdk.Robot;
import com.robotemi.sdk.listeners.OnGoToLocationStatusChangedListener;

public class MainActivity extends AppCompatActivity {
    
    private static final String TAG = "MainActivity";
    private WebView webView;
    private Robot robot;
    private TemiInterface temiInterface;
    
    // 도착 이벤트 리스너
    private final OnGoToLocationStatusChangedListener onGoToLocationStatusChangedListener = new OnGoToLocationStatusChangedListener() {
        @Override
        public void onGoToLocationStatusChanged(String location, String status, String description, int descriptionId) {
            Log.d(TAG, "onGoToLocationStatusChanged: location=" + location + ", status=" + status);
            
            // 도착 완료 상태 확인 (status가 "complete" 또는 "COMPLETE"인 경우)
            if (status != null && (status.equals("complete") || status.equals("COMPLETE") || status.equalsIgnoreCase("complete"))) {
                Log.d(TAG, "Location reached: " + location);
                // JavaScript로 도착 이벤트 전달
                if (webView != null && temiInterface != null) {
                    runOnUiThread(() -> {
                        temiInterface.notifyArrived(location);
                    });
                }
            }
        }
    };
    
    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        // Robot 인스턴스 가져오기
        robot = Robot.getInstance();
        
        // 도착 이벤트 리스너 등록
        robot.addOnGoToLocationStatusChangedListener(onGoToLocationStatusChangedListener);
        
        webView = findViewById(R.id.webview);
        
        // WebView 설정
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        webView.getSettings().setDatabaseEnabled(true);
        webView.getSettings().setAllowFileAccess(true);
        webView.getSettings().setAllowContentAccess(true);
        webView.getSettings().setLoadWithOverviewMode(true);
        webView.getSettings().setUseWideViewPort(true);
        webView.getSettings().setBuiltInZoomControls(false);
        webView.getSettings().setDisplayZoomControls(false);
        webView.getSettings().setSupportZoom(false);
        
        // TemiInterface 생성 및 JavaScript에 등록
        temiInterface = new TemiInterface(robot, webView);
        webView.addJavascriptInterface(
            temiInterface,  // Robot 인스턴스 전달
            "temi"  // JavaScript에서 window.temi로 접근
        );
        
        // WebViewClient 설정 (같은 앱 내에서 열기)
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });
        
        // WebChromeClient 설정 (진행 상황 표시)
        webView.setWebChromeClient(new WebChromeClient());
        
        // URL 로드
        // BuildConfig.WEB_URL 사용 (build.gradle에서 설정)
        // BuildConfig는 자동 생성되므로 import 불필요
        String url = com.pangssi.restaurant.BuildConfig.WEB_URL;
        
        // 또는 직접 URL 설정
        // String url;
        // if (BuildConfig.DEBUG) {
        //     url = "http://10.0.2.2:3000/restaurant";  // 에뮬레이터
        //     // url = "http://192.168.1.100:3000/restaurant";  // 실제 기기
        // } else {
        //     url = "https://your-domain.com/restaurant";  // 프로덕션
        // }
        
        webView.loadUrl(url);
    }
    
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
    
    @Override
    protected void onDestroy() {
        // 리스너 제거
        if (robot != null) {
            robot.removeOnGoToLocationStatusChangedListener(onGoToLocationStatusChangedListener);
        }
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }
}

