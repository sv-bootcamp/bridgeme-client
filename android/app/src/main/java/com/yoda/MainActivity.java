package com.yoda;

import android.content.Intent;
import android.os.Bundle;
import com.facebook.react.ReactActivity;
import com.linkedin.platform.LISessionManager;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript.
   * This is used to schedule rendering of the component.
   */
  private static final String MainComponent = "yoda";

  @Override
  protected String getMainComponentName() {
    return MainComponent;
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    LISessionManager.getInstance(getApplicationContext()).onActivityResult(this, requestCode, resultCode, data);

    MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
  }
}
