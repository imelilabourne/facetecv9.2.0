import { FaceTecIDScanResult, FaceTecSessionResult } from "../assets/core-sdk/FaceTecSDK.js/FaceTecPublicApi";
import { FaceTecSDK } from "../assets/core-sdk/FaceTecSDK.js/FaceTecSDK";
import { Config } from "./Config";
import FacetecStrings from './core-sdk-optional/FacetecStrings';
import { LivenessCheckProcessor } from "./processors/LivenessCheckProcessor";
import { PhotoIDMatchProcessor } from "./processors/PhotoIDMatchProcessor";
import { SampleAppUtilities } from "./utilities/SampleAppUtilities";
import { ThemeHelpers } from "./utilities/ThemeHelpers";
export const AngularSampleApp = (function() {
  let latestEnrollmentIdentifier = "";
  let latestSessionResult: FaceTecSessionResult | null = null;
  let latestIDScanResult: FaceTecIDScanResult | null = null;
  let latestProcessor: LivenessCheckProcessor;

  // Wait for onload to be complete before attempting to access the Browser SDK.
  window.onload = function() {

    // Set a the directory path for other FaceTec Browser SDK Resources.
    FaceTecSDK.setResourceDirectory("/assets/core-sdk/FaceTecSDK.js/resources");

    // Set the directory path for required FaceTec Browser SDK images.
    FaceTecSDK.setImagesDirectory("/assets/core-sdk/FaceTec_images");

    // Set your FaceTec Device SDK Customizations.
    ThemeHelpers.setAppTheme(ThemeHelpers.getCurrentTheme());

    // Initialize FaceTec Browser SDK and configure the UI features.
    FaceTecSDK.initializeInDevelopmentMode(Config.DeviceKeyIdentifier,Config.PublicFaceScanEncryptionKey,function(initializedSuccessfully: boolean) {
      if(initializedSuccessfully) {
        SampleAppUtilities.enableControlButtons();
        FaceTecSDK.configureLocalization(FacetecStrings);

      }
      SampleAppUtilities.displayStatus(FaceTecSDK.getFriendlyDescriptionForFaceTecSDKStatus(FaceTecSDK.getStatus()));
    });

    SampleAppUtilities.formatUIForDevice();
  };

  // Initiate a 3D Liveness Check.
  function onLivenessCheckPressed() {
    SampleAppUtilities.fadeOutMainUIAndPrepareForSession();

    // Get a Session Token from the FaceTec SDK, then start the 3D Liveness Check.
    getSessionToken(function(sessionToken) {
      latestProcessor = new LivenessCheckProcessor(sessionToken as string, AngularSampleApp as any);
    });
  }

    // Perform a 3D Liveness Check, then an ID Scan, then Match the 3D FaceMap to the ID Scan.
  function onPhotoIDMatchPressed() {
    SampleAppUtilities.fadeOutMainUIAndPrepareForSession();

    // Get a Session Token from the FaceTec SDK, then start the 3D Liveness Check.  On Success, ID Scanning will start automatically.
    getSessionToken(function(sessionToken) {
      latestEnrollmentIdentifier = "browser_sample_app_" + SampleAppUtilities.generateUUId();
      latestProcessor = new PhotoIDMatchProcessor(sessionToken as string, AngularSampleApp as any);
    });
  }

  // Show the final result and transition back into the main interface.
  function onComplete() {
    SampleAppUtilities.showMainUI();

    if(!latestProcessor.isSuccess()) {
      // Reset the enrollment identifier.
      latestEnrollmentIdentifier = "";

      // Show early exit message to screen.  If this occurs, please check logs.
      SampleAppUtilities.displayStatus("Session exited early, see logs for more details.");

      return;
    }

    // Show successful message to screen
    SampleAppUtilities.displayStatus("Success");
  }

  // Get the Session Token from the server
  function getSessionToken(sessionTokenCallback: (sessionToken?: string)=>void) {
    const XHR = new XMLHttpRequest();
    XHR.open("GET", Config.BaseURL + "/session-token");
    XHR.setRequestHeader("X-Device-Key", Config.DeviceKeyIdentifier);
    XHR.setRequestHeader("X-User-Agent", FaceTecSDK.createFaceTecAPIUserAgentString(""));
    XHR.onreadystatechange = function() {
      if(this.readyState === XMLHttpRequest.DONE) {
        let sessionToken = "";
        try {
          // Attempt to get the sessionToken from the response object.
          sessionToken = JSON.parse(this.responseText).sessionToken;
          // Something went wrong in parsing the response. Return an error.
          if(typeof sessionToken !== "string") {
            onServerSessionTokenError();
            return;
          }
        }
        catch {
          // Something went wrong in parsing the response. Return an error.
          onServerSessionTokenError();
          return;
        }
        sessionTokenCallback(sessionToken);
      }
    };

    XHR.onerror = function() {
      onServerSessionTokenError();
    };
    XHR.send();
  }

  function onServerSessionTokenError() {
    SampleAppUtilities.handleErrorGettingServerSessionToken();
  }

  //
  // DEVELOPER NOTE:  This is a convenience function for demonstration purposes only so the Sample App can have access to the latest session results.
  // In your code, you may not even want or need to do this.
  //
  function setLatestSessionResult(sessionResult: FaceTecSessionResult) {
    latestSessionResult = sessionResult;
  }

  function setLatestIDScanResult(idScanResult: FaceTecIDScanResult) {
    latestIDScanResult = idScanResult;
  }

  function getLatestEnrollmentIdentifier() {
    return latestEnrollmentIdentifier;
  }

  function setLatestServerResult(responseJSON: any) {
  }

  function clearLatestEnrollmentIdentifier(responseJSON: any) {
    latestEnrollmentIdentifier = "";
  }

  return {
    onLivenessCheckPressed,
    onPhotoIDMatchPressed,
    onComplete,
    setLatestSessionResult,
    setLatestIDScanResult,
    getLatestEnrollmentIdentifier,
    setLatestServerResult,
    clearLatestEnrollmentIdentifier
  };

})();
