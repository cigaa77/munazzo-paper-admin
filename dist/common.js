(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["common"],{

/***/ "./src/app/components/alert/alert.component.html":
/*!*******************************************************!*\
  !*** ./src/app/components/alert/alert.component.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"alert\" role=\"alert\" [style.background]=\"color\" [style.color]=\"font\" [hidden]=\"alertHidden\" [style.opacity]=\"opacity\">\n  {{text}} <i (click)=\"dismiss()\" class=\"fa fa-remove fa-fw pull-right\"></i>\n</div>\n"

/***/ }),

/***/ "./src/app/components/alert/alert.component.ts":
/*!*****************************************************!*\
  !*** ./src/app/components/alert/alert.component.ts ***!
  \*****************************************************/
/*! exports provided: AlertComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AlertComponent", function() { return AlertComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/**
 * Created by mohma on 7/29/2017.
 */
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var AlertComponent = /** @class */ (function () {
    function AlertComponent() {
        this.color = "#ec045b";
        this.font = "#ececec";
        this.text = "Alert";
        this.opacity = 0;
        this.alertHidden = true;
    }
    AlertComponent.prototype.ngOnInit = function () {
        var self = this;
        setTimeout(function () {
            self.alertHidden = false;
            setInterval(function () {
                self.opacity += 0.1;
                //if(self.opacity===1.0)
            }, 70);
        }, 500);
    };
    AlertComponent.prototype.dismiss = function () {
        this.alertHidden = true;
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])('color'),
        __metadata("design:type", String)
    ], AlertComponent.prototype, "color", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])('fontColor'),
        __metadata("design:type", String)
    ], AlertComponent.prototype, "font", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])('text'),
        __metadata("design:type", String)
    ], AlertComponent.prototype, "text", void 0);
    AlertComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            template: __webpack_require__(/*! ./alert.component.html */ "./src/app/components/alert/alert.component.html"),
            selector: 'alert',
        })
    ], AlertComponent);
    return AlertComponent;
}());



/***/ }),

/***/ "./src/app/components/calendar/calendar.component.html":
/*!*************************************************************!*\
  !*** ./src/app/components/calendar/calendar.component.html ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--\n  Theme: PaperAdmin V1\n  Author: https://github.com/mohdrashid\n  Custom plugin\n-->\n<div class=\"panel\" [style.background]=\"properties['color']\" [style.color]=\"properties['font']\">\n  <div class=\"panel-heading dark-overlay\">\n    <i class=\"{{properties['icon']}}\" style=\"margin-right: 10px\"></i>{{properties['label']}}\n  </div>\n  <div class=\"panel-body\">\n    <div id=\"{{properties['id']}}\" (click)=\"onCalendarClick($event)\"></div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/components/calendar/calendar.component.ts":
/*!***********************************************************!*\
  !*** ./src/app/components/calendar/calendar.component.ts ***!
  \***********************************************************/
/*! exports provided: CalendarComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CalendarComponent", function() { return CalendarComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by mohma on 7/27/2017.
 */

var CalendarComponent = /** @class */ (function () {
    function CalendarComponent() {
        this.properties = { color: "red", icon: "fa fa-calendar", label: "Calendar", font: "#ececec", id: "calendar1", click: function ($event) {
                console.log($event);
            } };
    }
    CalendarComponent.prototype.ngOnInit = function () {
        this.properties.icon += " fa-fw";
    };
    CalendarComponent.prototype.ngAfterViewInit = function () {
        $("#" + this.properties.id).datepicker({});
    };
    /**
     *
     * @param $event: Event details generated from click event
     * Passes object of type JSON to callback
     * Sample: Object {event: MouseEvent, value: "13", month: "July", year: "2017"}
     */
    CalendarComponent.prototype.onCalendarClick = function ($event) {
        var data = { event: $event, value: $event['target']['innerText'] };
        var chosen = $(".datepicker-switch")[0].innerText.split(" ");
        data['month'] = chosen[0];
        data['year'] = chosen[1];
        this.properties.click(data);
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])('data'),
        __metadata("design:type", Object)
    ], CalendarComponent.prototype, "properties", void 0);
    CalendarComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            template: __webpack_require__(/*! ./calendar.component.html */ "./src/app/components/calendar/calendar.component.html"),
            selector: 'calendar',
            styles: [__webpack_require__(/*! .//calendar.scss */ "./src/app/components/calendar/calendar.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], CalendarComponent);
    return CalendarComponent;
}());



/***/ }),

/***/ "./src/app/components/calendar/calendar.scss":
/*!***************************************************!*\
  !*** ./src/app/components/calendar/calendar.scss ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ })

}]);
//# sourceMappingURL=common.js.map