import UIKit

class ScrollViewController : NSObject, UIScrollViewDelegate {
  
  var scrollView: UIScrollView!
  var mapImageView: UIImageView!
  
  func start() {
    let mapImage = UIImage(named: "map.png")!
    mapImageView = UIImageView(image: mapImage)
    mapImageView.frame = CGRect(origin: CGPoint(x: 0, y: 0), size:mapImage.size)
    
    scrollView = UIScrollView()
    scrollView.delegate = self
    scrollView.contentSize = mapImage.size
    scrollView.addSubview(mapImageView)
    
    let doubleTapRecognizer = UITapGestureRecognizer(target: self, action: #selector(ScrollViewController.scrollViewDoubleTapped(_:)))
    doubleTapRecognizer.numberOfTapsRequired = 2
    doubleTapRecognizer.numberOfTouchesRequired = 1
    scrollView.addGestureRecognizer(doubleTapRecognizer)
    
    scrollView.minimumZoomScale = 0.05;
    scrollView.maximumZoomScale = 2.0
    scrollView.zoomScale = 0.1
  }
  
  func centerScrollViewContents() {
    let boundsSize = scrollView.bounds.size
    var contentsFrame = mapImageView.frame
    
    if contentsFrame.size.width < boundsSize.width {
      contentsFrame.origin.x = (boundsSize.width - contentsFrame.size.width) / 2.0
    } else {
      contentsFrame.origin.x = 0.0
    }
    
    if contentsFrame.size.height < boundsSize.height {
      contentsFrame.origin.y = (boundsSize.height - contentsFrame.size.height) / 2.0
    } else {
      contentsFrame.origin.y = 0.0
    }
    
    mapImageView.frame = contentsFrame
  }
  
  func scrollViewDoubleTapped(recognizer: UITapGestureRecognizer) {
    let pointInView = recognizer.locationInView(mapImageView)
    
    var newZoomScale = scrollView.zoomScale * 6.0
    newZoomScale = min(newZoomScale, scrollView.maximumZoomScale)

    let scrollViewSize = scrollView.bounds.size
    let w = scrollViewSize.width / newZoomScale
    let h = scrollViewSize.height / newZoomScale
    let x = pointInView.x - (w / 2.0)
    let y = pointInView.y - (h / 2.0)
    
    let rectToZoomTo = CGRectMake(x, y, w, h);
    scrollView.zoomToRect(rectToZoomTo, animated: true)
  }
  
  func viewForZoomingInScrollView(scrollView: UIScrollView) -> UIView? {
    return mapImageView
  }
  
  func scrollViewDidZoom(scrollView: UIScrollView) {
    centerScrollViewContents()
  }

}