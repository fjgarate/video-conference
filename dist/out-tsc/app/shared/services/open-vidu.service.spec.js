"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var open_vidu_service_1 = require("./open-vidu.service");
describe('OpenViduService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [open_vidu_service_1.OpenViduService]
        });
    });
    it('should be created', testing_1.inject([open_vidu_service_1.OpenViduService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=open-vidu.service.spec.js.map