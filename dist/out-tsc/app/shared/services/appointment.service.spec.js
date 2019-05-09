"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var appointment_service_1 = require("./appointment.service");
describe('AppointmentService', function () {
    beforeEach(function () { return testing_1.TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = testing_1.TestBed.get(appointment_service_1.AppointmentService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=appointment.service.spec.js.map