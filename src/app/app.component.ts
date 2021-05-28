import { Component, OnInit } from "@angular/core";
import { SampleApp } from "../sampleAppController";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})


export class AppComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {

  }

  // Perform Liveness Check.
  onLivenessCheckPressed() {
    SampleApp.onLivenessCheckPressed();
  }

  onPhotoIdMatchPressed() {
    SampleApp.onPhotoIDMatchPressed();
  }

}
