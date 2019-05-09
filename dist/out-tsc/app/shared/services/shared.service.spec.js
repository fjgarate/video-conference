"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var shared_service_1 = require("./shared.service");
describe('SharedService', function () {
    beforeEach(function () { return testing_1.TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = testing_1.TestBed.get(shared_service_1.SharedService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=shared.service.spec.js.map