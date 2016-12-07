package com.yoda;

import com.evollu.react.fcm.FIRMessagingPackage;
import com.facebook.appevents.AppEventsLogger;
import android.app.Application;
import android.content.Context;
import android.support.multidex.MultiDex;
import android.support.multidex.MultiDexApplication;

import java.util.Arrays;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.imagepicker.ImagePickerPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import java.util.List;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.react.ReactApplication;
import com.oblador.vectoricons.VectorIconsPackage;
import com.chymtt.reactnativedropdown.DropdownPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;

public class MainApplication extends MultiDexApplication implements ReactApplication {

    // implement CallbackManager for facebook SDK
    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

    protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
    }

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        protected boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                new MainReactPackage(),
                new VectorIconsPackage(),
                new LinearGradientPackage(),
                new ImagePickerPackage(),
                new FBSDKPackage(mCallbackManager),
                new DropdownPackage(),
                new FIRMessagingPackage()
            );
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        FacebookSdk.sdkInitialize(getApplicationContext());
        AppEventsLogger.activateApp(this);
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }
}
