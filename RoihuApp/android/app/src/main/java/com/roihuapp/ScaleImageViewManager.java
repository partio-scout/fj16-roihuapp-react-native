package com.roihuapp;

import android.net.Uri;
import android.support.annotation.Nullable;
import android.util.Log;

import com.davemorrissey.labs.subscaleview.ImageSource;
import com.davemorrissey.labs.subscaleview.SubsamplingScaleImageView;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

public class ScaleImageViewManager extends SimpleViewManager<SubsamplingScaleImageView> {

    public static final String REACT_CLASS = "RCTScaleImageView";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected SubsamplingScaleImageView createViewInstance(ThemedReactContext reactContext) {
        Log.i("ScaleImageViewManager", "createViewInstance");
        SubsamplingScaleImageView view = new SubsamplingScaleImageView(reactContext);
        view.setMinimumDpi(80);
        view.setPanEnabled(true);
        view.setZoomEnabled(true);
        return view;
    }


    @ReactProp(name = "src")
    public void setSrc(SubsamplingScaleImageView view, @Nullable String src) {
        Log.i("ScaleImageViewManager", "setSrc: " + src);
        view.setImage(ImageSource.uri(Uri.parse(src)));
    }
}
