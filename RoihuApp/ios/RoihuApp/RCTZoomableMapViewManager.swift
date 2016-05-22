import Foundation

@objc(RCTZoomableMapViewManager)
class RCTZoomableMapViewManager : RCTViewManager {

  let controller = ScrollViewController();
  
  override func view() -> UIView! {
    debugPrint("Starting controller");
    controller.start();
    return controller.scrollView
  }
}