package com.svbootcamp.bridgeme;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Display;
import android.os.Handler;
import android.content.Intent;
import android.graphics.Point;
import android.webkit.WebView;

public class SplashActivity extends AppCompatActivity {
    private final int delayTime = 1885;
    private Handler handler = new Handler();
    private Runnable runnable = new Runnable() {
        @Override
        public void run() {
            Intent intent = new Intent(SplashActivity.this, MainActivity.class);
            startActivity(intent);

            finish();
            overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out);
        }
    };

    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        webView = (WebView) findViewById(R.id.webview);
        webView.loadUrl("file:///android_asset/splash_anim.gif");
        webView.setVerticalScrollBarEnabled(false);
        webView.setHorizontalScrollBarEnabled(false);
        webView.setInitialScale(this.getScale());

        handler.postDelayed(runnable, delayTime);
    }

    private int getScale() {
        Display display = this.getWindowManager().getDefaultDisplay();
        Point size = new Point();
        display.getSize(size);
        return (size.x * 100) / 782;
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        handler.removeCallbacks(runnable);
    }
}
