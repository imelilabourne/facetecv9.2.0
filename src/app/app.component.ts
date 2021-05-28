import { Component, OnInit } from "@angular/core";
import { AngularSampleApp } from "../assets/angular-sample-controller";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})


export class AppComponent implements OnInit {

  constructor() {}
  buttonName = AngularSampleApp.language;
  ngOnInit(): void {

  }

  // Perform Liveness Check.
  onLivenessCheckPressed() {
    AngularSampleApp.onLivenessCheckPressed();
  }

  onPhotoIdMatchPressed() {
    AngularSampleApp.onPhotoIDMatchPressed();
  }

  translate(){
    if(AngularSampleApp.language === "English"){
      AngularSampleApp.language = "Filipino"
    }else{
      AngularSampleApp.language = "English"
    }

    this.buttonName = AngularSampleApp.language;
  }

}
