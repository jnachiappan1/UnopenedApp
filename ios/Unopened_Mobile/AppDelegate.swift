import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import UserNotifications
import FirebaseCore
import GoogleMaps
import GooglePlaces

@main
class AppDelegate: RCTAppDelegate, UNUserNotificationCenterDelegate {
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    FirebaseApp.configure()
   
    self.moduleName = "Unopened_Mobile"
    self.dependencyProvider = RCTAppDependencyProvider()

    // Provide Google Maps/Places API key from Info.plist (key: GMSApiKey)
    if let path = Bundle.main.path(forResource: "Info", ofType: "plist"),
       let info = NSDictionary(contentsOfFile: path),
       let apiKey = info["GMSApiKey"] as? String, !apiKey.isEmpty {
      GMSServices.provideAPIKey(apiKey)
      GMSPlacesClient.provideAPIKey(apiKey)
    }

    // Configure push notifications
   configurePushNotifications(application)

    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = [:]

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
 private func configurePushNotifications(_ application: UIApplication) {
    UNUserNotificationCenter.current().delegate = self
    
    let authOptions: UNAuthorizationOptions = [.alert, .badge, .sound]
    UNUserNotificationCenter.current().requestAuthorization(
      options: authOptions,
      completionHandler: { _, _ in }
    )
    
    application.registerForRemoteNotifications()
  }
  
  // Optional: Add notification delegate methods
  func userNotificationCenter(_ center: UNUserNotificationCenter,
                            willPresent notification: UNNotification,
                            withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
    if #available(iOS 14.0, *) {
         completionHandler([.banner, .sound, .badge])
       } else {
         completionHandler([.alert, .sound, .badge])
       }
  }
  
  func userNotificationCenter(_ center: UNUserNotificationCenter,
                            didReceive response: UNNotificationResponse,
                            withCompletionHandler completionHandler: @escaping () -> Void) {
    completionHandler()
  }
}
