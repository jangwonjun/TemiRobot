package com.pangssi.restaurant;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import androidx.appcompat.app.AppCompatActivity;
import com.robotemi.sdk.Robot;

public class MainActivity extends AppCompatActivity {
    
    private WebView webView;
    private Robot robot;
    
    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        // Robot 인스턴스 가져오기
        robot = Robot.getInstance();
        
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
        
        // TemiInterface를 JavaScript에 등록
        // "temi"라는 이름으로 등록하면 window.temi로 접근 가능
        webView.addJavascriptInterface(
            new TemiInterface(robot),  // Robot 인스턴스 전달
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
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }
}

